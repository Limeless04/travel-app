import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface ArticleCardProps {
  id: number;
  title: string;
  slug: string;
  summary: string;
  image_url: string;
  total_likes: number;
}

interface ArticleStore {
  articles: ArticleCardProps[];
  setArticles: (articles: ArticleCardProps[]) => void;
  clearArticles: () => void;
}

export const useArticleStore = create<ArticleStore>()(
  persist(
    (set) => ({
      articles: [],
      setArticles: (articles) => set({ articles }),
      clearArticles: () => set({ articles: [] }),
    }),
    {
      name: 'article-store',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
