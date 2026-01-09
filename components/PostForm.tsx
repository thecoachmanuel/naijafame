"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface PostFormProps {
  initialData?: {
    id?: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string | null;
    topic: string;
    image?: string | null;
    published: boolean;
  };
  isEditing?: boolean;
}

export default function PostForm({ initialData, isEditing = false }: PostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    content: initialData?.content || "",
    excerpt: initialData?.excerpt || "",
    topic: initialData?.topic || "general",
    image: initialData?.image || "",
    published: initialData?.published || false,
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: !isEditing ? generateSlug(title) : prev.slug, // Auto-generate slug only on create
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = isEditing ? `/api/posts/${initialData?.id}` : "/api/posts";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Something went wrong");
      }

      router.push("/admin/posts");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl bg-white p-8 rounded-lg shadow">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleTitleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bn-red focus:ring-bn-red sm:text-sm border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Slug</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bn-red focus:ring-bn-red sm:text-sm border p-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Content</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          rows={10}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bn-red focus:ring-bn-red sm:text-sm border p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Excerpt (Optional)</label>
        <textarea
          name="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bn-red focus:ring-bn-red sm:text-sm border p-2"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Topic</label>
          <select
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bn-red focus:ring-bn-red sm:text-sm border p-2"
          >
            <option value="general">General</option>
            <option value="news">News</option>
            <option value="entertainment">Entertainment</option>
            <option value="sports">Sports</option>
            <option value="politics">Politics</option>
            <option value="lifestyle">Lifestyle</option>
            <option value="business">Business</option>
            <option value="technology">Technology</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Image URL</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bn-red focus:ring-bn-red sm:text-sm border p-2"
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          id="published"
          name="published"
          type="checkbox"
          checked={formData.published}
          onChange={handleCheckboxChange}
          className="h-4 w-4 text-bn-red focus:ring-bn-red border-gray-300 rounded"
        />
        <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
          Published
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="mr-4 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bn-red"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-bn-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bn-red disabled:opacity-50"
        >
          {loading ? "Saving..." : isEditing ? "Update Post" : "Create Post"}
        </button>
      </div>
    </form>
  );
}
