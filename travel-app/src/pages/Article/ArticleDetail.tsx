import { useNavigate, useParams } from "react-router";
import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import ArticleNotFound from "./ArticleNotFound";
import type { User } from "../../store/useAuthStore";
import CommentSection from "../../components/CommentSection";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegCommentDots } from "react-icons/fa";
import { apiClient } from "../../lib/axios/client";
import { useArticleStore } from "../../store/useArticleStore";
import type { ArticleDetailState } from "../../store/useArticleStore";

type likeStatus = {
  like: boolean;
  total_likes: number;
};

const ArticleDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuthStore();
  const setArticleDetail = useArticleStore((state) => state.setArticleDetail);
  const articleDetail = useArticleStore((state) => state.articleDetail);
  const [likeStatus, setLikeStatus] = useState<likeStatus>({
    like: false,
    total_likes: 0,
  });
  const [showComments, setShowComments] = useState(false);

  const loadArticle = useCallback(async () => {
    try {
      setLoading(true);
      setError(false); // Reset error state
      const data = await fetchBySlug(slug, user);
      if (data) {
        setArticleDetail(data);
        setLikeStatus((prev) => ({
          ...prev,
          total_likes: data.total_likes || 0,
        }));
      } else {
        setError(true);
      }
    } catch (error) {
      console.error("Error fetching article:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLikes = async () => {
    if (!articleDetail || !user) return;
    try {
      setLoading(true);
      const response = await apiClient.post(
        `/articles/${slug}/like/${user.id}`
      );
      if (response.status === 201) {
        setLikeStatus({
          like: response.data.total_likes,
          total_likes: response.data.total_likes,
        });
        setArticleDetail({ total_likes: response.data.total_likes });
      }
    } catch (error) {
      console.error("Error handling likes:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      loadArticle();
    } else {
      setError(true);
      setLoading(false);
    }
  }, [slug, user, loadArticle]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="animate-pulse">Loading article...</div>
      </div>
    );
  }

  if (error || !articleDetail) {
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

      {articleDetail.image_url && (
        <img
          src={articleDetail.image_url!}
          alt={articleDetail.title}
          className="w-full h-64 object-cover rounded-md mb-6"
        />
      )}

      <h1 className="text-3xl font-bold mb-2">{articleDetail.title}</h1>
      <div className="flex flex-col sm:flex-row sm:items-center text-gray-500 text-sm mb-4 gap-1 sm:gap-2">
        <span>By {articleDetail.author?.username || "Unknown Author"}</span>
        <span className="hidden sm:inline">|</span>
        <span>{articleDetail.author?.email || "No email"}</span>
        <span className="hidden sm:inline">•</span>
        {articleDetail.createdAt && (
          <span>{new Date(articleDetail.createdAt).toLocaleDateString()}</span>
        )}
      </div>
      <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-4">
        {articleDetail.content}
      </p>
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
        <button
          className={`flex items-center gap-2 px-2 py-1 bg-transparent rounded transition focus:outline-none   hover:text-red-600 ${
            likeStatus.like ? "text-red-600" : "text-gray-600"
          }`}
          type="button"
          onClick={handleLikes}
        >
          <span>
            <AiOutlineLike className="h-5 w-5" />
          </span>
          {articleDetail.total_likes} Likes
        </button>
        <button
          className={`flex items-center gap-2 px-2 py-1 bg-transparent rounded transition focus:outline-none text-gray-600 hover:text-blue-600`}
          onClick={() => setShowComments((prev) => !prev)}
        >
          <span>
            <FaRegCommentDots className="h-5 w-5" />
          </span>
          {showComments ? "Hide Comments" : "Show Comments"}
        </button>{" "}
      </div>
      {showComments && articleDetail.comments && (
        <CommentSection
          comments={articleDetail.comments}
          articleSlug={articleDetail.slug}
          articleId={articleDetail.id}
          onSubmit={loadArticle}
          articleOwnerId={articleDetail.author?.id}
        />
      )}
    </div>
  );
};
async function fetchBySlug(
  slug: string | undefined,
  user: User | null
): Promise<ArticleDetailState | null> {
  if (!slug) return null;

  try {
    const response = await apiClient.get(`/articles/${slug}`, {
      headers: {
        Authorization: `Bearer ${user?.token || ""}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("fetchBySlug error:", error);
    return null;
  }
}

export default ArticleDetail;
