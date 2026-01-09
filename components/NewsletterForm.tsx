"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setStatus("success");
      setMessage(data.message);
      setEmail("");
    } catch (error: any) {
      setStatus("error");
      setMessage(error.message);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <h3 className="text-lg font-bold mb-2">Subscribe to our Newsletter</h3>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="flex-grow px-4 py-2 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-bn-red"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-4 py-2 bg-bn-red text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {status === "loading" ? "..." : "Subscribe"}
        </button>
      </form>
      {message && (
        <p className={`mt-2 text-sm ${status === "success" ? "text-green-400" : "text-red-400"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
