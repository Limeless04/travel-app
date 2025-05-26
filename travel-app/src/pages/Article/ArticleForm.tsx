import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";
import { apiClient } from "../../lib/axios/client";
import AlertModal from "../../components/modal/AlertModal";
import { useParams } from "react-router";
import DeleteModal from "../../components/modal/DeleteModal";
const createArticleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  summary: z.string().min(1, "Summary is required"),
  image_url: z.string().optional(),
  authorId: z.number(),
});

type ArticleForm = z.infer<typeof createArticleSchema>;

const ArticleForm = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [form, setForm] = useState<ArticleForm>({
    title: "",
    content: "",
    summary: "",
    image_url: "",
    authorId: user?.id ?? 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlerModal, setShowAlertModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { slug } = useParams();
  const isEditMode = !!slug;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const result = isEditMode
      ? createArticleSchema.partial().safeParse(form)
      : createArticleSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const submitForm = async () => {
    try {
      setLoading(true);
      const url = isEditMode ? `/articles/${slug}` : "/articles";
      const { authorId, ...formData } = form;
      const payload: ArticleForm | Omit<ArticleForm, "authorId"> = isEditMode
        ? formData
        : form;
      const res = isEditMode
        ? await apiClient.put(url, payload)
        : await apiClient.post(url, form);

      if ([200, 201].includes(res.status)) {
        setShowAlertModal(true);
        if (!isEditMode) {
          resetForm();
        }
      }
    } catch (err: any) {
      console.error("Form error:", err);
      setError(
        err?.response?.data?.message || err.message || "Unexpected error"
      );
      setShowAlertModal(true);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      content: "",
      summary: "",
      image_url: "",
      authorId: user?.id ?? 0,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) submitForm();
  };

  const handleDeleteArticle = async () => {
    if (!slug) return;
    try {
      setLoading(true);
      const res = await apiClient.delete(`/articles/${slug}`);
      if (res.status === 200) {
        setShowDeleteModal(false);
        navigate("/");
      } else {
        throw new Error("Failed to delete the article.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete the article.");
      setShowAlertModal(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchArticle = async () => {
    if (!slug) return;
    try {
      setLoading(true);
      const res = await apiClient.get(`/articles/${slug}`);
      const data = res.data;
      setForm({
        title: data.title,
        summary: data.summary,
        content: data.content,
        image_url: data.image_url || "",
        authorId: (data.authorId || user?.id) ?? 0,
      });
    } catch {
      setError("Failed to load article.");
      setShowAlertModal(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEditMode) {
      fetchArticle();
    }
  }, [slug]);

  const handleCloseAlert = () => {
    setShowAlertModal(false);
    if (!error) navigate("/");
  };
  return (
    <>
      {showAlerModal && (
        <AlertModal
          message={
            error
              ? "Failed to save the article."
              : "The article was saved successfully."
          }
          type={error ? "failed" : "success"}
          open={showAlerModal}
          title={
            error
              ? isEditMode
                ? "Article Update Failed!"
                : "Article Creation Failed!"
              : isEditMode
              ? "Article Updated Successfully!"
              : "Article Created Successfully!"
          }
          onClose={handleCloseAlert}
        />
      )}

      {showDeleteModal && (
        <DeleteModal
          open={showDeleteModal}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteArticle}
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
          {loading
            ? isEditMode
              ? "Updating article..."
              : "Creating article..."
            : isEditMode
            ? "Update Article"
            : "Create Article"}
        </button>
      </form>
    </>
  );
};

export default ArticleForm;
