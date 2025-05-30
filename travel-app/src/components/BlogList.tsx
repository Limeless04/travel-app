import { useState } from "react";
import Pagination from "./Pagination";
import ArticleCard from "./ArticleCard";
import { useArticleStore } from "../store/useArticleStore";
import ArticleCardSkeleton from "./loading/ArticleSkeletonLaoding";
import AlertModal from "./modal/AlertModal";
import { useArticleData } from "../hook/useArticleData";
import { useUserArticles } from "../hook/useUserArticles";

interface BlogListProps {
  type: string;
}

const BlogList = ({ type }: BlogListProps) => {
  const { articles, userArticles } = useArticleStore();
  const [allArticlePage, setAllArticlePage] = useState<number>(1);
  const [userPage, setUserPage] = useState<number>(1);
  const {
    loading: allLoading,
    error: allError,
    showAlert: allAlert,
    totalAllArticle = 0,
    limit: allLimit,

    setShowAlert: allArticlesShowAlert,
  } = useArticleData({ page: allArticlePage });

  const {
    loading: userLoading,
    error: userError,
    showAlert: userAlert,
    totalUserArticle = 0,
    limit: userLimit,
    setShowAlert: onlyUserShowAlert,
  } = useUserArticles({ page: userPage });
  const setShowAlert =
    type === "user" ? onlyUserShowAlert : allArticlesShowAlert;
  const currentArticles = type === "user" ? userArticles : articles;
  const total = type === "user" ? totalUserArticle : totalAllArticle;
  const loading = type === "user" ? userLoading : allLoading;
  const error = type === "user" ? userError : allError;
  const showAlert = type === "user" ? userAlert : allAlert;
  const limit = type === "user" ? userLimit : allLimit;
  const page = type === "user" ? userPage : allArticlePage;

  const handleSetPage = (pageNumber: number) => {
    if (type === "user") {
      setUserPage(pageNumber);
    } else {
      setAllArticlePage(pageNumber);
    }
  };

  return (
    <div className="p-4">
      <div className="grid gap-4 md:grid-cols-2">
        {error && (
          <AlertModal
            open={showAlert}
            onClose={() => setShowAlert(false)}
            type="failed"
            message={error?.message || "Un unexpected error occured"}
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
            onPageChange={(p) => handleSetPage(p)}
          />
        </div>
      )}
    </div>
  );
};

export default BlogList;
