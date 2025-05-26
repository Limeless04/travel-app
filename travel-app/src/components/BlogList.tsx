import { useState } from "react";
import Pagination from "./Pagination";
import ArticleCard from "./ArticleCard";
import { useArticleStore } from "../store/useArticleStore";
import ArticleCardSkeleton from "./loading/ArticleSkeletonLaoding";
import AlertModal from "./AlertModal";
import { useArticleData } from "../hook/useArticleData";

interface BlogListProps {
  type: string;
}

const BlogList = ({ type }: BlogListProps) => {
  const { articles, userArticles } = useArticleStore();
  const [page, setPage] = useState(1);
  const currentArticles = (type === "user" ? userArticles : articles) || [];
  const { loading, error, showAlert, setShowAlert, total, limit } =
    useArticleData({
      page,
    });

  return (
    <div className="p-4">
      <div className="grid gap-4 md:grid-cols-2">
        {error && (
          <AlertModal
            open={showAlert}
            onClose={() => setShowAlert(false)}
            type="failed"
            message={error}
          />
        )}
        {loading ? (
          // Show skeletons while loading
          Array.from({ length: limit }).map((_, i) => (
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
            total={Math.ceil(total / limit)}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}
    </div>
  );
};

export default BlogList;
