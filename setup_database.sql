-- 1. Create the 'models' table
CREATE TABLE IF NOT EXISTS public.models (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    developer TEXT NOT NULL,
    type TEXT NOT NULL, -- 'Texto', 'Multimodal', 'Imagen', 'Audio', 'Código'
    architecture TEXT,
    context_window TEXT,
    parameters TEXT,
    mmlu_score NUMERIC,
    license TEXT,
    release_date DATE,
    logo_url TEXT,
    description TEXT,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;

-- 3. Create a policy to allow everyone to READ the models
CREATE POLICY "Allow public read-only access" 
ON public.models 
FOR SELECT 
USING (true);

-- 4. Insert 15 Industry-Standard AI Models
INSERT INTO public.models (name, slug, developer, type, architecture, context_window, parameters, mmlu_score, license, release_date, description, is_featured)
VALUES 
('GPT-4o', 'gpt-4o', 'OpenAI', 'Multimodal', 'Transformer', '128k', 'N/A', 88.7, 'Proprietary', '2024-05-13', 'Modelo insignia multimodal de OpenAI.', true),
('Llama 3.1 405B', 'llama-3-1-405b', 'Meta AI', 'Texto', 'Dense', '128k', '405B', 88.6, 'Llama 3.1', '2024-07-23', 'El modelo Open Weights más potente del mundo.', false),
('Claude 3.5 Sonnet', 'claude-3-5-sonnet', 'Anthropic', 'Texto', 'Transformer', '200k', 'N/A', 88.7, 'Proprietary', '2024-06-20', 'Equilibrio perfecto entre velocidad e inteligencia.', false),
('Gemini 1.5 Pro', 'gemini-1-5-pro', 'Google', 'Multimodal', 'MoE', '2M', 'N/A', 85.9, 'Proprietary', '2024-02-15', 'Ventana de contexto líder en la industria.', false),
('Mistral Large 2', 'mistral-large-2', 'Mistral AI', 'Texto', 'Dense', '128k', '123B', 84.0, 'Mistral Commercial', '2024-07-24', 'Optimizado para razonamiento multilingüe y código.', false),
('Stable Diffusion 3', 'sd3', 'Stability AI', 'Imagen', 'MM-DiT', 'N/A', '8B', NULL, 'SD3 License', '2024-02-22', 'Generación de imágenes fotorrealistas de alta calidad.', false),
('DeepSeek-V2', 'deepseek-v2', 'DeepSeek', 'Texto', 'MoE', '128k', '236B', 81.1, 'MIT', '2024-05-07', 'Modelo de arquitectura Mixture-of-Experts eficiente.', false),
('Grok-1.5', 'grok-1-5', 'xAI', 'Texto', 'Transformer', '128k', 'N/A', 81.3, 'Proprietary', '2024-03-28', 'Modelo con acceso a datos en tiempo real de X.', false),
('Command R+', 'command-r-plus', 'Cohere', 'Texto', 'Transformer', '128k', '104B', 75.0, 'CC-BY-NC', '2024-04-04', 'Especializado en flujos de trabajo RAG empresariales.', false),
('Phi-3 Mini', 'phi-3-mini', 'Microsoft', 'Texto', 'Transformer', '128k', '3.8B', 68.8, 'MIT', '2024-04-23', 'Modelo de lenguaje pequeño con rendimiento masivo.', false),
('Qwen2-72B', 'qwen2-72b', 'Alibaba Cloud', 'Texto', 'Dense', '128k', '72B', 82.3, 'Apache 2.0', '2024-06-06', 'Líder en benchmarks de modelos abiertos en Asia.', false),
('Flux.1 [dev]', 'flux-1-dev', 'Black Forest Labs', 'Imagen', 'DiT', 'N/A', '12B', NULL, 'FLUX.1-dev-NonCommercial', '2024-08-01', 'Estado del arte en generación de texto dentro de imágenes.', false),
('Sora', 'sora', 'OpenAI', 'Vídeo', 'Diffusion', 'N/A', 'N/A', NULL, 'Proprietary', '2024-02-15', 'Generación de vídeo hiperrealista a partir de texto.', false),
('DALL-E 3', 'dall-e-3', 'OpenAI', 'Imagen', 'Diffusion', 'N/A', 'N/A', NULL, 'Proprietary', '2023-09-20', 'Integración nativa con ChatGPT para diseño visual.', false),
('Jamba 1.5 Mini', 'jamba-1-5-mini', 'AI21 Labs', 'Texto', 'SSM-Transformer', '256k', '52B', 81.4, 'Jamba License', '2024-08-19', 'Arquitectura híbrida Mamba-Transformer.', false);
