import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

// SECURITY: Define strict schema for chat requests
const chatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().min(1).max(2000)
  })).min(1).max(10)
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate request structure with Zod
    const validation = chatRequestSchema.safeParse(body);
    
    if (!validation.success) {
      console.error('Zod Validation Failed:', JSON.stringify(validation.error.format(), null, 2));
      return NextResponse.json({ 
        error: 'Petición inválida o límites de datos excedidos.'
      }, { status: 400 });
    }

    const { messages } = validation.data;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'API Key not configured' }, { status: 500 });
    }

    // 1. Fetch total count of models for context
    const { count: totalCount } = await supabase
      .from('models')
      .select('*', { count: 'exact', head: true });

    // 2. Fetch models for grounding (optimized limit)
    const { data: models } = await supabase
      .from('models')
      .select('name, developer, type, description, mmlu_score, gsm8k_score, humaneval_score')
      .order('mmlu_score', { ascending: false })
      .limit(100);

    interface KnowledgeBaseModel {
      name: string;
      developer: string;
      description: string;
      mmlu_score: number | null;
      gsm8k_score: number | null;
      humaneval_score: number | null;
    }

    const knowledgeBase = (models as unknown as KnowledgeBaseModel[])?.map((m: KnowledgeBaseModel) => {
      const desc = m.description ? m.description.substring(0, 120) : 'Sin descripción';
      return `- ${m.name} (${m.developer}): ${desc}. Benchmarks: MMLU:${m.mmlu_score || 'N/A'}%, GSM8K:${m.gsm8k_score || 'N/A'}%, HE:${m.humaneval_score || 'N/A'}%.`;
    }).join('\n') || 'No hay modelos registrados actualmente en el índice.';

    const systemPrompt = `Eres el asistente técnico de wikIA.
NUESTRA BASE DE DATOS TIENE UN TOTAL DE ${totalCount || 'varios'} MODELOS.
TU CONOCIMIENTO TÉCNICO DETALLADO INCLUYE LOS SIGUIENTES ${models?.length || 0} MODELOS:
${knowledgeBase}

REGLAS CRÍTICAS:
1. Indica que tenemos ${totalCount || 'muchos'} modelos en total.
2. Resuelve dudas técnicas basadas EN LOS DATOS PROPORCIONADOS arriba.
3. Si preguntan por modelos externos, di que no están en el índice y ofrece la mejor alternativa de la lista.
4. Sé directo, técnico y profesional. No saludes en cada respuesta si ya hay historial.`;



    // SECURITY: Sanitize messages and enforce resource limits
    // 1. Only allow 'user' and 'assistant' roles from the client.
    // 2. Limit to the last 10 messages to prevent token exhaustion.
    // 3. Cap each message at 2000 characters to prevent DDoS/Memory issues.
    const MAX_MESSAGES = 10;
    const MAX_CHARS = 2000;

    const sanitizedMessages = Array.isArray(messages) 
      ? messages
          .slice(-MAX_MESSAGES) // Keep only recent history
          .filter(m => m && typeof m === 'object' && (m.role === 'user' || m.role === 'assistant'))
          .map(m => ({ 
            role: m.role, 
            content: String(m.content || '').substring(0, MAX_CHARS) // Truncate long inputs
          }))
      : [];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          ...sanitizedMessages
        ],
        temperature: 0.3,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Groq API error detail:', errorData);
      return NextResponse.json({ 
        error: 'Error de comunicación con el servicio de IA. Inténtalo de nuevo más tarde.' 
      }, { status: 502 }); // Use 502 for upstream failures
    }

    const data = await response.json();
    return NextResponse.json({ 
      content: data.choices?.[0]?.message?.content || 'Sin respuesta del modelo.' 
    });
  } catch (error) {
    console.error('Chat API route error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
