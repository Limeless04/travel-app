import { useState, useEffect } from "react";
import { useArticleStore } from "../store/useArticleStore";
import useSWR from "swr";
import fetcher from "../lib/axios/fetcher";
interface UseFetchArticlesProps {
  page: number;
}

const LIMIT = 4;

export function useArticleData({ page }: UseFetchArticlesProps) {
  const setArticles = useArticleStore((state) => state.setArticles);
  const [showAlert, setShowAlert] = useState(false);
  const [totalAllArticle, setTotalAllArticle] = useState<number>(0);

  const {
    data,
    error,
    isLoading: loading,
  } = useSWR(`articles?limit=${LIMIT}&page=${page}`, fetcher);

  useEffect(() => {
    if (data) {
      setArticles(data);
      setTotalAllArticle(data.total);
    }

    if (error) setShowAlert(true);
  }, [data, error, setArticles, setTotalAllArticle, setShowAlert]);

  return {
    setShowAlert,
    loading,
    error,
    showAlert,
    totalAllArticle,
    limit: LIMIT,
  };
}
