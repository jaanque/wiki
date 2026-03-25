-- Migration: add_benchmarks.sql
-- Description: Adds gsm8k_score and humaneval_score to the models table and populates them with initial data.

-- 1. Add columns for additional benchmarks
ALTER TABLE public.models ADD COLUMN IF NOT EXISTS gsm8k_score NUMERIC;
ALTER TABLE public.models ADD COLUMN IF NOT EXISTS humaneval_score NUMERIC;

-- 2. Populate example data for top models
-- GPT-4o
UPDATE public.models SET gsm8k_score = 92.0, humaneval_score = 90.2 WHERE slug = 'gpt-4o';

-- Llama 3.1 405B
UPDATE public.models SET gsm8k_score = 96.8, humaneval_score = 89.0 WHERE slug = 'llama-3-1-405b';

-- Claude 3.5 Sonnet
UPDATE public.models SET gsm8k_score = 96.4, humaneval_score = 92.0 WHERE slug = 'claude-3-5-sonnet';

-- Gemini 1.5 Pro
UPDATE public.models SET gsm8k_score = 91.7, humaneval_score = 84.1 WHERE slug = 'gemini-1-5-pro';

-- Mistral Large 2
UPDATE public.models SET gsm8k_score = 91.0, humaneval_score = 92.4 WHERE slug = 'mistral-large-2';

-- DeepSeek-V2
UPDATE public.models SET gsm8k_score = 92.2, humaneval_score = 81.1 WHERE slug = 'deepseek-v2';

-- Qwen2-72B
UPDATE public.models SET gsm8k_score = 91.1, humaneval_score = 86.1 WHERE slug = 'qwen2-72b';

-- Phi-3 Mini
UPDATE public.models SET gsm8k_score = 82.5, humaneval_score = 58.8 WHERE slug = 'phi-3-mini';

-- 3. Verify changes
SELECT name, mmlu_score, gsm8k_score, humaneval_score FROM public.models LIMIT 5;
