"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AdFormProps {
  initialData?: {
    id?: string;
    title: string;
    content: string;
    position: string;
    active: boolean;
  };
  isEditing?: boolean;
}

export default function AdForm({ initialData, isEditing = false }: AdFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    content: initialData?.content || "",
    position: initialData?.position || "sidebar",
    active: initialData?.active ?? true,
  });

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
      const url = isEditing ? `/api/ads/${initialData?.id}` : "/api/ads";
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

      router.push("/admin/ads");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-8 rounded-lg shadow">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Title (Internal Name)</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bn-red focus:ring-bn-red sm:text-sm border p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Content (HTML or Image URL)</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          rows={5}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bn-red focus:ring-bn-red sm:text-sm border p-2"
          placeholder="<div>Ad Code</div> or https://example.com/ad.jpg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Position</label>
        <select
          name="position"
          value={formData.position}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bn-red focus:ring-bn-red sm:text-sm border p-2"
        >
          <option value="header">Header</option>
          <option value="sidebar">Sidebar</option>
          <option value="content_top">Content Top</option>
          <option value="content_bottom">Content Bottom</option>
          <option value="footer">Footer</option>
        </select>
      </div>

      <div className="flex items-center">
        <input
          id="active"
          name="active"
          type="checkbox"
          checked={formData.active}
          onChange={handleCheckboxChange}
          className="h-4 w-4 text-bn-red focus:ring-bn-red border-gray-300 rounded"
        />
        <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
          Active
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
          {loading ? "Saving..." : isEditing ? "Update Ad" : "Create Ad"}
        </button>
      </div>
    </form>
  );
}
