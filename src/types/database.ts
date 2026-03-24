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
  model_categories?: ModelCategory[];
}
