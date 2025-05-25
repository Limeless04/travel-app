import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import ArticleNotFound from "./ArticleNotFound";
import type { User } from "../../store/useAuthStore";
import CommentSection from "../../components/CommentSection";
import type {  Comment } from "../../components/CommentSection";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegCommentDots } from "react-icons/fa";
import {apiClient} from "../../lib/axios/client";

type ArticleDetail = {
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
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
};

const ArticleDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // Start with true since we're loading initially
  const { user } = useAuthStore();
  const [article, setArticle] = useState<ArticleDetail | null>(null); // Initialize as null
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoading(true);
        setError(false); // Reset error state
        const data = await fetchBySlug(slug, user);

        if (data) {
          setArticle(data);
        } else {
          setError(true);
        }
      } catch (error) {
        console.error("Error fetching article:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadArticle();
    } else {
      setError(true);
      setLoading(false);
    }
  }, [slug, user]); 

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="animate-pulse">Loading article...</div>
      </div>
    );
  }

  if (error || !article) {
    return <ArticleNotFound />;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <button
        className="mb-6 text-blue-600 hover:underline flex items-center gap-1 bg-transparent p-0"
        onClick={() => navigate("/")}
      >
        <span aria-hidden="true">&larr;</span> Back to Home
      </button>

      <img
        src={article.image_url!}
        alt={article.title}
        className="w-full h-64 object-cover rounded-md mb-6"
      />
      <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
    <div className="flex flex-col sm:flex-row sm:items-center text-gray-500 text-sm mb-4 gap-1 sm:gap-2">
      <span>By {article.author?.username || "Unknown Author"}</span>
      <span className="hidden sm:inline">|</span>
      <span>{article.author?.email || "No email"}</span>
      <span className="hidden sm:inline">•</span>
      <span>{new Date(article.createdAt).toLocaleDateString()}</span>
    </div>
      <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-4">
        {article.content}
      </p>
    <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
      <button
        className="flex items-center gap-2 px-2 py-1 text-gray-600 hover:text-red-600 bg-transparent rounded transition focus:outline-none"
        type="button"
      >
        <span>
        <AiOutlineLike className="h-5 w-5" />
        </span>
        {article.total_likes} Likes
      </button>
      <button
        className="flex items-center gap-2 px-2 py-1 text-gray-600 hover:text-blue-600 bg-transparent rounded transition focus:outline-none"
        onClick={() => setShowComments((prev) => !prev)}
      >
        <span>
        <FaRegCommentDots className="h-5 w-5" />
        </span>
        {showComments ? "Hide Comments" : "Show Comments"}
      </button>
    </div>
      {showComments && (
        <CommentSection comments={article.comments} />
      )}
    </div>
  );
};

async function fetchBySlug(
  slug: string | undefined,
  user: User | null
): Promise<ArticleDetail | null> {
  if (!slug) return null;

  try {
    const response = await apiClient.get(
      `/articles/${slug}`,
      {
        headers: {
          Authorization: `Bearer ${user?.token || ""}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("fetchBySlug error:", error);
    return null;
  }
}

export default ArticleDetail;
