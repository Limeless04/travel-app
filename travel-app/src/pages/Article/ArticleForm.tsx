import React, { useState } from "react";
import { z } from "zod";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";
import { apiClient } from "../../lib/axios/client";
import AlertModal from "../../components/AlertModal";

const createArticleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  summary: z.string().min(1, "Summary is required"),
  image_url: z.string().optional(),
  authorId: z.number(),
});

type CreateArticleDto = z.infer<typeof createArticleSchema>;

const ArticleForm = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [form, setForm] = useState<CreateArticleDto>({
    title: "",
    content: "",
    summary: "",
    image_url: "",
    authorId: user?.id!,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlerModal, setShowAlertModal] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchPost = async (formData: any) => {
    try {
      setLoading(true);
      const res = await apiClient.post("/articles", formData);
      if (res.status === 201) {
        setShowAlertModal(true);
        setForm({
          title: "",
          summary: "",
          content: "",
          image_url: "",
          authorId: user?.id!,
        });
      }
    } catch (error: any) {
      setShowAlertModal(true);
      setError("Failed to create article");
      console.error("Error creating article:", error);
      // Optional: show error message to user
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Parse and validate with zod
    const result = createArticleSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    fetchPost(form);
  };

  const handleCloseAlert = () => {
    setShowAlertModal(false);
    navigate("/");
  };

  return (
    <>
      {showAlerModal && (
        <AlertModal
          message={"Registration successful!"}
          type={error ? "failed" : "success"}
          open={showAlerModal}
          title={
            error ? "Article Creation Failed!" : "Article Creation Success!"
          }
          onClose={handleCloseAlert}
        />
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-xl mt-20 mx-auto bg-white p-8 rounded-lg shadow space-y-6"
      >
        <h1 className="text-4xl text-center">Create New Travel Article</h1>
        <div>
          <button
            className="mb-6 text-blue-600 hover:underline flex items-center gap-1 bg-transparent p-0"
            onClick={() => navigate("/")}
          >
            <span aria-hidden="true">&larr;</span> Back to Home
          </button>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          {errors.title && (
            <span className="text-red-500 text-xs mt-1 block">
              {errors.title}
            </span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Summary
          </label>
          <input
            name="summary"
            value={form.summary}
            onChange={handleChange}
            required
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          {errors.summary && (
            <span className="text-red-500 text-xs mt-1 block">
              {errors.summary}
            </span>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <input
            name="image_url"
            value={form.image_url || ""}
            onChange={handleChange}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          {errors.image_url && (
            <span className="text-red-500 text-xs mt-1 block">
              {errors.image_url}
            </span>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            required
            rows={6}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 resize-y"
          />
          {errors.content && (
            <span className="text-red-500 text-xs mt-1 block">
              {errors.content}
            </span>
          )}
        </div>
        <input type="hidden" name="authorId" value={user?.id} />
        {errors.authorId && (
          <span className="text-red-500 text-xs mt-1 block">
            {errors.authorId}
          </span>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Please Wait, we creating your article" : "Create Article"}
        </button>
      </form>
    </>
  );
};

export default ArticleForm;
