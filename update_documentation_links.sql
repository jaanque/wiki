-- 1. Añadir la columna de documentación oficial
ALTER TABLE models ADD COLUMN IF NOT EXISTS documentation_url TEXT;

-- 2. Actualizar los modelos existentes con enlaces de ejemplo
UPDATE models SET documentation_url = 'https://openai.com/index/gpt-4o-system-card/' WHERE slug = 'gpt-4o';
UPDATE models SET documentation_url = 'https://ai.meta.com/blog/meta-llama-3/' WHERE slug = 'llama-3-70b';
UPDATE models SET documentation_url = 'https://www.anthropic.com/news/claude-3-5-sonnet' WHERE slug = 'claude-3-5-sonnet';
UPDATE models SET documentation_url = 'https://mistral.ai/news/mistral-large-2407/' WHERE slug = 'mistral-large-2';
UPDATE models SET documentation_url = 'https://blackforestlabs.ai/' WHERE slug = 'flux-1-pro';
UPDATE models SET documentation_url = 'https://deepmind.google/technologies/gemini/' WHERE slug = 'gemini-1-5-pro';
UPDATE models SET documentation_url = 'https://openai.com/index/dall-e-3/' WHERE slug = 'dall-e-3';
UPDATE models SET documentation_url = 'https://stability.ai/news/stable-diffusion-3-medium' WHERE slug = 'stable-diffusion-3';
UPDATE models SET documentation_url = 'https://blog.midjourney.com/' WHERE slug = 'midjourney-v6';
UPDATE models SET documentation_url = 'https://cohere.com/blog/command-r-plus-microsoft-azure' WHERE slug = 'command-r-plus';
UPDATE models SET documentation_url = 'https://www.databricks.com/blog/introducing-dbrx-new-state-art-open-llm' WHERE slug = 'dbrx-instruct';
UPDATE models SET documentation_url = 'https://huggingface.co/microsoft/Phi-3-mini-4k-instruct' WHERE slug = 'phi-3-mini';
UPDATE models SET documentation_url = 'https://ai.google.dev/gemma/docs' WHERE slug = 'gemma-2-9b';
UPDATE models SET documentation_url = 'https://groq.com/' WHERE slug = 'groq-lp-v1';
UPDATE models SET documentation_url = 'https://suno.com/' WHERE slug = 'suno-v3-5';

-- Verificar cambios
SELECT name, documentation_url FROM models LIMIT 5;
