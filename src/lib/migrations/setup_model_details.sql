-- Migration: setup_model_details.sql
-- Description: Creates a dedicated table for extended model information and migrates data.

-- 1. Create the model_details table
CREATE TABLE IF NOT EXISTS public.model_details (
    id BIGSERIAL PRIMARY KEY,
    model_id BIGINT REFERENCES public.models(id) ON DELETE CASCADE UNIQUE,
    full_description TEXT,
    technical_specs JSONB DEFAULT '{}'::jsonb, -- Store architecture, context, etc.
    benchmarks JSONB DEFAULT '{}'::jsonb,      -- Store MMLU, GSM8K, HumanEval, etc.
    use_cases TEXT,
    limitations TEXT,
    resources JSONB DEFAULT '[]'::jsonb,       -- Store documentation_url, blog, etc.
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Migrate existing data from 'models' to 'model_details'
-- Initial migration to populate the one-to-one relationship
INSERT INTO public.model_details (model_id, full_description, technical_specs, benchmarks, resources)
SELECT 
    id, 
    description,
    jsonb_build_object(
        'architecture', architecture,
        'context_window', context_window,
        'parameters', parameters,
        'license', license
    ),
    jsonb_build_object(
        'mmlu', mmlu_score,
        'gsm8k', gsm8k_score,
        'humaneval', humaneval_score
    ),
    jsonb_build_array(
        jsonb_build_object('name', 'Documentación Oficial', 'url', documentation_url)
    )
FROM public.models;

-- 3. (Optional) Cleanup the models table if needed, or keep for the index.
-- Moving data to model_details doesn't STRICTLY require deleting from models,
-- but they are now redundant. I'll leave them for now to avoid breaking the index.

-- 4. Verify migration
SELECT m.name, d.full_description, d.benchmarks 
FROM public.models m
JOIN public.model_details d ON m.id = d.model_id
LIMIT 5;
