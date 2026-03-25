export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export interface ModelCategory {
  category: Category;
}

export interface ModelDetails {
  id: number;
  model_id: number;
  full_description: string;
  technical_specs: Record<string, string | number | boolean | null>;
  benchmarks: Record<string, number | null>;
  use_cases?: string;
  limitations?: string;
  resources: { name: string; url: string }[];
  last_updated: string;
}

export interface Model {
  id: number;
  name: string;
  slug: string;
  developer: string;
  type: string;
  license: string;
  architecture: string;
  context_window: string;
  parameters: string;
  mmlu_score: number | null;
  gsm8k_score: number | null;
  humaneval_score: number | null;
  release_date: string;
  description: string;
  documentation_url?: string;
  logo_url?: string;
  created_at?: string;
  model_categories?: ModelCategory[];
  details?: ModelDetails; // One-to-one relationship
}
