export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export interface ModelCategory {
  category: Category;
}

export interface Model {
  id: number;
  name: string;
  slug: string;
  developer: string;
  type: string;
  license: string;
  context_window: string;
  parameters: string;
  mmlu_score: number | null;
  release_date: string;
  description: string;
  documentation_url?: string;
  logo_url?: string;
  created_at?: string;
  model_categories?: ModelCategory[];
}
