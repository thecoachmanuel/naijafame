"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";

export default function DeleteAdPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/ads/${params.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete");
      }

      router.push("/admin/ads");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error deleting ad");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow mt-10 text-center">
      <h1 className="text-xl font-bold mb-4 text-red-600">Delete Ad?</h1>
      <p className="mb-6 text-gray-600">
        Are you sure you want to delete this ad? This action cannot be undone.
      </p>
      
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "Deleting..." : "Confirm Delete"}
        </button>
      </div>
    </div>
  );
}
