import { useEffect, useState, useCallback } from "react";
import Pagination from "./Pagination";
import ArticleCard from "./ArticleCard";
import { useArticleStore } from "../store/useArticleStore";
import ArticleCardSkeleton from "./loading/ArticleSkeletonLaoding";
import AlertModal from "./AlertModal";
import { apiClient } from "../lib/axios/client";
import { useAuthStore } from "../store/useAuthStore";

const LIMIT = 4;

interface BlogListProps {
  type: string;
}

const BlogList = ({ type }: BlogListProps) => {
  const { articles, setArticles, userArticles, setUserArticles } =
    useArticleStore();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const { user } = useAuthStore();
  const currentArticles = type === "user" ? userArticles : articles;

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const url =
        type === "user"
          ? `/articles/?limit=${LIMIT}&page=${page}&user_id=${user?.id}`
          : `/articles?limit=${LIMIT}&page=${page}`;
      const { data } = await apiClient.get(url);
      if (type === "user") {
        setUserArticles(data.data);
      } else {
        setArticles(data.data);
      }

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

  useEffect(() => {
    fetchArticles();
  }, [page, type]);

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
        {loading ? (
          // Show skeletons while loading
          Array.from({ length: LIMIT }).map((_, i) => (
            <ArticleCardSkeleton key={i} />
          ))
        ) : currentArticles && currentArticles.length > 0 ? (
          // Show articles if available
          currentArticles.map((article) => (
            <ArticleCard
              key={`article-${article.id}`}
              slug={article.slug}
              title={article.title}
              author={article.author}
              summary={article.summary}
              imageUrl={article.image_url}
              total_likes={article.total_likes}
            />
          ))
        ) : (
          // Show fallback if no articles
          <p className="text-center col-span-full text-gray-500">
            There are no articles.
          </p>
        )}
      </div>
      {currentArticles.length > 0 && (
        <div className="mt-6">
          <Pagination
            current={page}
            total={Math.ceil(total / LIMIT)}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}
    </div>
  );
};

export default BlogList;
