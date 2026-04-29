export interface Source {
  id: string | null;
  name: string;
}

export interface Article {
  id: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: Source;
  category: string;
  sentiment: 'Positivo' | 'Neutro' | 'Negativo';
  summary?: string;
  isRead?: boolean;
}

export interface UserPreferences {
  categories: string[];
  theme: 'light' | 'dark';
  summaryLength: 'short' | 'long';
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  password?: string;
  preferences: UserPreferences;
  favorites: Article[];
  history: string[]; // List of article IDs or categories visited
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}
