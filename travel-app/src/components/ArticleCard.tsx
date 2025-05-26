import { useNavigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";
import AlertModal from "./AlertModal";
import { FiTrash2, FiEdit } from "react-icons/fi";
import type { Author } from "../store/useArticleStore";

type ArticleCardProps = {
  title: string;
  summary: string;
  slug: string;
  imageUrl?: string;
  author?: Author;
  total_likes?: number; // Added total_likes prop
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
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const { user } = useAuthStore();
  const canDelete = user && author && user.id === Number(author.id);
  console.log(user);
  console.log(author);
  console.log(canDelete);
  const handleReadMore = () => {
    if (isAuthenticated) {
      navigate(`/articles/${slug}`, { replace: true }); // Replace with actual article ID or path
    } else {
      setShowLoginAlert(true);
      setTimeout(() => setShowLoginAlert(false), 2000);
    }
  };

  const handleDelete = (slug: string) => {
    console.log(author);
    console.log(`Delete Article ${slug}`);
  };
  const handleEdit = (slug: string) => {
    console.log(author);
    console.log(`Edit Article ${slug}`);
  };

  return (
    <ul className="space-y-6 sm:space-y-8">
      {showLoginAlert && (
        <AlertModal
          type="login"
          open={showLoginAlert}
          onClose={() => setShowLoginAlert(false)}
        />
      )}
      <li
        className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 relative overflow-hidden"
        style={
          imageUrl
            ? {
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "white",
              }
            : undefined
        }
      >
        {canDelete && (
          <>
            <button
              onClick={() => handleDelete(slug)} // define this handler
              className="absolute top-2 right-2 z-20 text-white bg-red-600 hover:bg-red-700 rounded-full p-1 shadow-lg transition"
              title="Delete article"
              aria-label="Delete article"
            >
              <FiTrash2 size={20} />
            </button>
            <button
              onClick={() => handleEdit(slug)}
              className="absolute top-2 right-10 z-20 text-white bg-blue-600 hover:bg-blue-700 rounded-full p-1 shadow-lg transition"
              title="Edit article"
              aria-label="Edit article"
            >
              <FiEdit size={20} />
            </button>
          </>
        )}

        {imageUrl && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.2))",
              zIndex: 0,
            }}
          />
        )}
        <div className={imageUrl ? "relative z-10" : undefined}>
          <h3 className="text-lg sm:text-xl font-bold mb-2">{title}</h3>
          <p className="text-sm sm:text-base leading-relaxed mb-3">{summary}</p>
          {author && <div className="text-xs mb-2">By {author.username}</div>}
          {typeof total_likes === "number" && (
            <div className="text-xs mb-2 flex items-center">
              <svg
                className="w-4 h-4 mr-1 text-pink-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
              {total_likes}
            </div>
          )}

          <button
            onClick={handleReadMore}
            className="text-blue-200 hover:underline text-sm sm:text-base font-medium inline-flex items-center group"
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
      </li>
    </ul>
  );
};

export default ArticleCard;
