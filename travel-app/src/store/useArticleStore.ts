import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';


export interface Author {
  id: string;
  username: string;
  email: string;
}
export interface ArticleCardProps {
  id: number;
  title: string;
  slug: string;
  author: Author;
  summary: string;
  image_url: string;
  total_likes: number;
}

interface ArticleStore {
  userArticles: ArticleCardProps[];
  articles: ArticleCardProps[];
  setArticles: (articles: ArticleCardProps[]) => void;
  setUserArticles: (articles: ArticleCardProps[]) => void;
  clearArticles: () => void;
}

export const useArticleStore = create<ArticleStore>()(
  persist(
    (set) => ({
      articles: [],
      userArticles: [],
      setArticles: (articles) => set({ articles }),
      setUserArticles: (userArticles) => set({ userArticles }),
      clearArticles: () => set({ articles: [] }),
    }),
    {
      name: "article-store",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
