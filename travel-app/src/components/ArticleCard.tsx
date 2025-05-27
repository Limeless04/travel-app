import { useNavigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";
import AlertModal from "./modal/AlertModal";
import { FiTrash2, FiEdit } from "react-icons/fi";
import type { Author } from "../store/useArticleStore";
import { apiClient } from "../lib/axios/client";
import DeleteModal from "./modal/DeleteModal";
import { useArticleData } from "../hook/useArticleData";

type ArticleCardProps = {
  title: string;
  summary: string;
  slug: string;
  imageUrl?: string;
  author?: Author;
  total_likes?: number;
};

const ArticleCard = ({
  title,
  summary,
  slug,
  imageUrl,
  author,
  total_likes,
}: ArticleCardProps) => {
  const navigate = useNavigate();
  const [showAlertModal, setShowAlertModal] = useState(false);
  const { isAuthenticated, user } = useAuthStore(); // Destructure user directly
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Consider managing loading state for this card's specific actions
  const canDelete = user && author && user.id === Number(author.id);

  // It's generally better to pass these functions as props from the parent
  // if they affect the list of articles. If useArticleData just provides
  // methods to refetch, it's okay here, but be mindful of performance.
  const { fetchArticles, fetchArticlesByUser } = useArticleData({ page: 1 });

  const handleReadMore = () => {
    if (isAuthenticated) {
      navigate(`/articles/${slug}`); // No need for replace: true unless specifically desired
    } else {
      setShowAlertModal(true);
      setError(null); // Clear previous errors if this alert is for login
      setTimeout(() => setShowAlertModal(false), 2000);
    }
  };

  const handleDeleteArticle = async () => {
    if (!slug) return;

    setLoading(true); // Set loading for this specific action
    setError(null); // Clear previous errors
    try {
      const res = await apiClient.delete(`/articles/${slug}`);
      if (res.status === 200) {
        setShowDeleteModal(false);
        fetchArticles();
        fetchArticlesByUser();
      } else {
        throw new Error("Failed to delete the article.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      setShowAlertModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (slug: string) => {
    navigate(`/articles/update/${slug}`); // No need for replace: true unless specifically desired
  };

  // Determine text color based on whether there's an image
  const textColorClass = imageUrl ? "text-white" : "text-gray-900";
  const subTextColorClass = imageUrl ? "text-gray-200" : "text-gray-600";
  const iconColorClass = imageUrl ? "text-pink-300" : "text-pink-400"; // For heart icon
  const readMoreColorClass = imageUrl ? "text-blue-200" : "text-blue-600";

  return (
    <>
      {showAlertModal && (
        <AlertModal
          type={error ? "failed" : "login"} // Use 'failed' for delete error, 'login' otherwise
          message={
            error ? `Delete failed: ${error}` : "Please log in to continue."
          }
          open={showAlertModal}
          onClose={() => setShowAlertModal(false)}
        />
      )}
      {showDeleteModal && (
        <DeleteModal
          open={showDeleteModal}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteArticle}
        />
      )}

      {/* The main card container - applying fixed height and flex properties */}
      {/* Set a min-height or fixed height. h-[400px] is an example. Adjust as needed. */}
      {/* flex flex-col to stack content vertically */}
      <div
        className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 relative overflow-hidden flex flex-col h-[400px]" // Fixed height
        // Optionally, if you prefer min-height to allow more content:
        // className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 relative overflow-hidden flex flex-col min-h-[400px]"
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 z-30">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent" />
          </div>
        )}

        {/* Background Image and Overlay */}
        {imageUrl && (
          <>
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
            <div
              className="absolute inset-0 pointer-events-none z-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2))", // Stronger overlay for readability
              }}
            />
          </>
        )}

        {/* Action Buttons (Delete/Edit) - ensure z-index is high enough */}
        {canDelete && (
          <div className="absolute top-1 right-2 z-20 flex space-x-2">
            <button
              onClick={() => setShowDeleteModal(true)}
              className="text-white bg-red-600 hover:bg-red-700 rounded-full p-1 shadow-lg transition flex items-center justify-center"
              title="Delete article"
              aria-label="Delete article"
            >
              <FiTrash2 size={20} />
            </button>
            <button
              onClick={() => handleEdit(slug)}
              className="text-white bg-blue-600 hover:bg-blue-700 rounded-full p-1 shadow-lg transition flex items-center justify-center"
              title="Edit article"
              aria-label="Edit article"
            >
              <FiEdit size={20} />
            </button>
          </div>
        )}

        {/* Main Content Area - This needs to be positioned and styled to fit */}
        {/* We'll use flex-grow to push the read more link to the bottom,
            and line-clamp to limit title/summary text height */}
        <div className={`relative z-10 flex flex-col flex-grow `}>
          <h3
            className={`text-lg sm:text-xl font-bold mb-2 ${textColorClass} line-clamp-2`}
          >
            {title}
          </h3>
          <p
            className={`text-sm sm:text-base leading-relaxed mb-3 ${subTextColorClass} line-clamp-3`}
          >
            {summary || "No summary available for this article."}
          </p>
          {author && (
            <div className={`text-xs mb-2 ${subTextColorClass}`}>
              By {author.username}
            </div>
          )}

          {typeof total_likes === "number" && (
            <div
              className={`text-xs mb-2 flex items-center ${subTextColorClass}`}
            >
              <svg
                className={`w-4 h-4 mr-1 ${iconColorClass}`} // Apply color class
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
              {total_likes}
            </div>
          )}

          {/* Read more button - pushed to the bottom by flex-grow on the content div */}
          <button
            onClick={handleReadMore}
            className={`mt-auto ${readMoreColorClass} hover:underline text-sm sm:text-base font-medium inline-flex items-center group`}
          >
            Read more
            <svg
              className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default ArticleCard;
