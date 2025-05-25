import { useEffect, useState, useCallback } from "react";
import Pagination from "./Pagination";
import ArticleCard from "./ArticleCard";
import { useArticleStore } from "../store/useArticleStore";
import ArticleCardSkeleton from "./loading/ArticleSkeletonLaoding";
import AlertModal from "./AlertModal";
import apiClient from "../lib/axios/client";

const LIMIT = 5;

const BlogList = () => {
  const { articles, setArticles } = useArticleStore();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get(
        `/articles?limit=${LIMIT}&page=${page}`
      );
      setArticles(data.data);
      setTotal(data.total);
    } catch (error) {
      console.error("Failed to fetch articles:", error);
      if (error instanceof Error) {
        setError(error.message);
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 2000);
      } else {
        setError(String(error));
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  }, [page, setArticles]);

  useEffect(() => {
    fetchData();
  }, [fetchData, page]);
  return (
    <div className="p-4">
      <div className="grid gap-4 md:grid-cols-2">
        {error && (
          <AlertModal
            open={showAlert}
            onClose={() => setError(null)}
            type="failed"
            message={error}
          />
        )}
        {loading
          ? // Render 4-6 skeletons (or based on LIMIT)
            Array.from({ length: LIMIT }).map((_, i) => (
              <ArticleCardSkeleton key={i} />
            ))
          : articles &&
            articles.map((article) => (
              <ArticleCard
                key={`article-${article.id}`}
                slug={article.slug}
                title={article.title}
                summary={article.summary}
                imageUrl={article.image_url}
                total_likes={article.total_likes}
              />
            ))}
      </div>

      <div className="mt-6">
        <Pagination
          current={page}
          total={Math.ceil(total / LIMIT)}
          onPageChange={(p) => setPage(p)}
        />
      </div>
    </div>
  );
};

export default BlogList;
