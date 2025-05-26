import React, { useState, useEffect } from "react";
import { z } from "zod";

const commentSchema = z.string().min(1).max(200);

type CommentSchemaType = z.infer<typeof commentSchema>;
interface CommentFormProps {
  onSubmit: (comment: string) => void;
  onCancel?: () => void;
  updateComment?: string;
  loading?: boolean;
}

const CommentForm = ({
  onSubmit,
  onCancel,
  updateComment,
  loading,
}: CommentFormProps) => {
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validatedComment: CommentSchemaType = commentSchema.parse(comment);
      onSubmit(validatedComment);
      setComment("");
    } catch (error) {
      console.error("Validation error:", error);
      alert("Please enter a valid comment between 1 and 200 characters.");
    }
  };

  const handleCancel = () => {
    setComment("");
    if (onCancel) {
      onCancel();
    }
  };

  useEffect(() => {
    if (updateComment) {
      setComment(updateComment);
    }
  }, [updateComment]);

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto p-4 bg-white rounded-lg shadow"
    >
      <textarea
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment..."
        required
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline mt-2 text-sm"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
      {updateComment && updateComment?.length > 0 && (
        <button
          type="button"
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline mt-2 text-sm ml-2"
          onClick={handleCancel}
        >
          Cancel
        </button>
      )}
    </form>
  );
};

export default CommentForm;
