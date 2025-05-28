import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Comment } from "../components/CommentSection";
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

export interface Likes {
  id: number;
  userId: number;
  articleId: number;
}

export interface ArticleDetailState {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image_url: string | null;
  total_likes: number;
  author: {
    id: number;
    username: string;
    email: string;
  };
  likes: Likes[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

interface ArticleStore {
  userArticles: ArticleCardProps[];
  articles: ArticleCardProps[];
  articleDetail: Partial<ArticleDetailState> | ArticleDetailState | null;
  setArticleDetail: (articleDetail: Partial<ArticleDetailState> | null) => void;
  setArticles: (articles: ArticleCardProps[]) => void;
  setUserArticles: (articles: ArticleCardProps[]) => void;
  clearArticles: () => void;
}

export const useArticleStore = create<ArticleStore>()(
  persist(
    (set) => ({
      articles: [],
      userArticles: [],
      articleDetail: null,
      setArticleDetail: (updates) =>
        set((state) => ({
          articleDetail: { ...state.articleDetail, ...updates },
        })),
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
