// Type definitions for the application
export interface AnimationProject {
  id: string;
  slug: string;
  title: string;
  category: string;
  categorySlug: string;
  categoryIcon: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  views: number;
  stars: number;
  likes: number;
  creator: string;
  creatorAvatar: string;
  creatorColor: string;
  gradientFrom: string;
  gradientTo: string;
  animationType: string;
  tags: string[];
  description: string;
  isNew?: boolean;
  isTrending?: boolean;
  isFeatured?: boolean;
  rows?: string[];
  htmlPath?: string;
  cssPath?: string;
  jsPath?: string;
  video?: {
    platform: 'youtube' | 'tiktok' | 'instagram' | 'vimeo';
    url: string;
    thumbnail?: string;
    label: string;
  };
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  gradient: [string, string];
  slug: string;
}

export type Language = 'en' | 'es';

export interface Translations {
  [key: string]: any;
}
