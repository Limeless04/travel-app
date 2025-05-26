import CommentForm from "./CommentForm";
import { apiClient } from "../lib/axios/client";
import Toast from "./Toast";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";

export type Comment = {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: Author;
};

export type Author = {
  id: string;
  username: string;
  email: string;
};

export type CommentSectionProps = {
  comments: Comment[];
  articleId?: number;
  articleSlug?: string;
  onSubmit: () => void;
  articleOwnerId?: number;
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const CommentSection = ({
  comments,
  articleId,
  articleSlug,
  onSubmit,
  articleOwnerId,
}: CommentSectionProps) => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [editComment, setEditComment] = useState<{
    id: number;
    content: string;
  } | null>(null);

  const handleOnSubmit = async (commentContent: string) => {
    setLoading(true);
    try {
      if (editComment) {
        // Update flow
        const res = await apiClient.put(
          `/comments/${editComment.id}/article/${articleSlug}`,
          { content: commentContent }
        );
        if (res.status !== 200) {
          throw new Error("Failed to update comment");
        }
        setMessage("Comment updated successfully!");
      } else {
        // Create flow
        const res = await apiClient.post("/comments", {
          content: commentContent,
          articleId: articleId,
          authorId: user?.id,
        });
        if (res.status !== 201) {
          throw new Error("Failed to create comment");
        }
        setMessage("Comment submitted successfully!");
      }

      setSuccess(true);
      if (onSubmit) onSubmit(); // Refresh
      setEditComment(null); // Reset edit mode
    } catch (error) {
      console.error("Error submitting comment:", error);
      setError(true);
      setMessage("Failed to submit comment. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    setLoading(true);
    try {
      const res = await apiClient.delete(`/comments/${commentId}`);
      if (res.status !== 200) {
        throw new Error("Failed to delete comment");
      }
      setSuccess(true);
      setMessage("Comment submitted successfully!");
      if (onSubmit) {
        onSubmit(); // Call the onSubmit prop to refresh comments
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      setError(true);
      setMessage("Failed to delete comment. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditComment = async (commentId: number) => {
    setLoading(true);
    try {
      const res = await apiClient.get(
        `/comments/${commentId}/article/${articleSlug}`
      );

      console.log("Fetched article data:", res.data);
      if (res.status !== 200) {
        throw new Error("Failed to delete comment");
      }
      setEditComment({ id: commentId, content: res.data.content });
    } catch (error) {
      console.error("Error fetching comment for edit:", error);
      setMessage("Failed to delete comment. Please try again later.");
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const canEditOrDelete = (commentAuthorId: string): boolean => {
    return (
      (user?.id ?? "") === commentAuthorId ||
      (user?.id ?? "") === articleOwnerId
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Comments</h2>
      <ul className="space-y-4">
        {comments.map((comment) => (
          <li
            key={comment.id}
            className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0"
          >
            <div className="text-gray-800 leading-relaxed">
              {comment.content}
            </div>
            <div className="text-xs text-gray-500 mt-2 flex items-center">
              {" "}
              Posted by {comment.author.username ||
                comment.author.email} on{" "}
              <span className="ml-1">{formatDate(comment.createdAt)}</span>{" "}
              {comment.updatedAt !== comment.createdAt && (
                <span className="ml-2 px-2 py-0.5 rounded bg-gray-200 text-gray-700 text-xs font-medium">
                  {" "}
                  Edited
                </span>
              )}
              {/* Edit Span */}
              <span
                className={`ml-2 px-2 py-0.5 rounded text-white text-xs font-medium ${
                  canEditOrDelete(comment.author.id)
                    ? "bg-blue-600 hover:underline cursor-pointer"
                    : "bg-blue-400 opacity-50 cursor-not-allowed"
                }`}
                onClick={() => {
                  if (canEditOrDelete(comment.author.id)) {
                    handleEditComment(comment.id);
                  }
                }}
              >
                Edit
              </span>
              {/* Delete Span */}
              <span
                className={`ml-2 px-2 py-0.5 rounded text-white text-xs font-medium ${
                  canEditOrDelete(comment.author.id)
                    ? "bg-red-600 hover:underline cursor-pointer"
                    : "bg-red-400 opacity-50 cursor-not-allowed"
                }`}
                onClick={() => {
                  if (canEditOrDelete(comment.author.id)) {
                    handleDeleteComment(comment.id);
                  }
                }}
              >
                Delete
              </span>
            </div>
          </li>
        ))}
      </ul>
      {error && (
        <Toast message={message} type="error" onClose={() => setError(false)} />
      )}
      {success && (
        <Toast
          message={message}
          type="success"
          onClose={() => setSuccess(false)}
        />
      )}
      {comments.length > 0 && <hr className="my-6 border-gray-200" />}
      <CommentForm
        onSubmit={handleOnSubmit}
        updateComment={editComment?.content}
        onCancel={() => setEditComment(null)}
        loading={loading}
      />
    </div>
  );
};

export default CommentSection;
