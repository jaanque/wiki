import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'API Key not configured' }, { status: 500 });
    }

    // Fetch models for grounding
    const { data: models } = await supabase
      .from('models')
      .select('name, developer, type, description, mmlu_score, gsm8k_score, humaneval_score')
      .limit(20);

    const knowledgeBase = models?.map(m =>
      `- ${m.name} (por ${m.developer}): ${m.description}. Benchmarks: MMLU ${m.mmlu_score}%, GSM8K ${m.gsm8k_score}%, HumanEval ${m.humaneval_score}%.`
    ).join('\n') || 'No hay modelos registrados actualmente en el índice.';

    const systemPrompt = `Eres el asistente técnico de wikIA.
TU CONOCIMIENTO SE LIMITA EXCLUSIVAMENTE A ESTOS MODELOS DE NUESTRA BASE DE DATOS:
${knowledgeBase}

REGLAS CRÍTICAS:
1. SOLO recomienda o resuelve dudas sobre los modelos listados arriba.
2. Si preguntan por modelos externos (como o1, Claude 3.5, etc.) que NO estén en la lista, di que no están en el índice y ofrece la mejor alternativa de la lista.
3. Ayuda al usuario a elegir basándote en los benchmarks y descripciones proporcionadas.
4. Sé conciso y profesional.`;

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
          ...messages
        ],
        temperature: 0.3, // Lower temperature for more grounded responses
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { error: { message: 'Failed to parse error response' } };
      }
      console.log('API Key present:', !!apiKey);
      console.error('Groq API error detail:', errorData);
      return NextResponse.json({ 
        error: errorData.error?.message || 'Error desconocido de la API de Groq' 
      }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Chat API route error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
