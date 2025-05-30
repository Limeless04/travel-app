import { useState, useEffect } from "react";
import { useArticleStore } from "../store/useArticleStore";
import { useAuthStore } from "../store/useAuthStore";
import useSWR from "swr";
import fetcher from "../lib/axios/fetcher";
interface UseFetchArticlesProps {
  page: number;
}

const LIMIT = 4;

export function useUserArticles({ page }: UseFetchArticlesProps) {
  const setUserArticles = useArticleStore((state) => state.setUserArticles);
  const [showAlert, setShowAlert] = useState(false);
  const [totalUserArticle, setTotalUserArticle] = useState<number>(0);

  const { user } = useAuthStore();
  const shouldFetch = user?.id !== undefined;
  const {
    data,
    error,
    isLoading: loading,
  } = useSWR(
    shouldFetch
      ? `articles?limit=${LIMIT}&page=${page}&user_id=${user?.id}`
      : null,
    fetcher,
  );

  useEffect(() => {
    if (data) {
      setUserArticles(data.data);
      setTotalUserArticle(data.total);
    }

    if (error) setShowAlert(true);
  }, [data, error, setUserArticles, setShowAlert, setTotalUserArticle]);

  return {
    setShowAlert,
    loading,
    error,
    showAlert,
    totalUserArticle,
    limit: LIMIT,
  };
}
