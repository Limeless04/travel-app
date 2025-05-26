import { useState, useCallback, useEffect } from "react";
import { apiClient } from "../lib/axios/client";
import { useArticleStore } from "../store/useArticleStore";
import { useAuthStore } from "../store/useAuthStore";

interface UseFetchArticlesProps {
  page: number;
}

const LIMIT = 4;

export function useArticleData({ page }: UseFetchArticlesProps) {
  const { setArticles, setUserArticles } = useArticleStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [total, setTotal] = useState<number>(0);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const url = `/articles?limit=${LIMIT}&page=${page}`;
      const { data } = await apiClient.get(url);
      setArticles(data.data);
      setTotal(data.total);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    } finally {
      setLoading(false);
    }
  }, [page, setArticles]);

  const fetchArticlesByUser = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get(
        `/articles/?limit=${LIMIT}&page=${page}&user_id=${user?.id}`
      );
      setUserArticles(data.data);
      setTotal(data.total);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    } finally {
      setLoading(false);
    }
  }, [page, user?.id, setUserArticles]);

  useEffect(() => {
    fetchArticles();
    if (user?.id) {
      fetchArticlesByUser();
    }
  }, [fetchArticles, fetchArticlesByUser, user?.id]);

  return {
    fetchArticles,
    fetchArticlesByUser,
    setShowAlert,
    loading,
    error,
    showAlert,
    total,
    limit: LIMIT,
  };
}
