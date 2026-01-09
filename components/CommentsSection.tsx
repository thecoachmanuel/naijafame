'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    email: string;
    role: string;
  };
}

interface CommentsSectionProps {
  slug: string;
  postTitle: string;
  postTopic: string;
}

export default function CommentsSection({ slug, postTitle, postTopic }: CommentsSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [slug]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?slug=${slug}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          content: newComment,
          title: postTitle,
          topic: postTopic
        }),
      });

      if (res.ok) {
        setNewComment('');
        fetchComments();
      }
    } catch (error) {
      console.error('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-12 pt-8 border-t border-gray-100">
      <h3 className="text-xl font-black uppercase mb-6 border-b-2 border-bn-black pb-2">
        Comments ({comments.length})
      </h3>

      {/* Comment List */}
      <div className="space-y-6 mb-8">
        {loading ? (
          <p>Loading comments...</p>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 p-4 rounded-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm text-bn-black">
                   {comment.author.email.split('@')[0]}
                   {comment.author.role === 'ADMIN' && <span className="ml-2 text-xs bg-bn-red text-white px-1 rounded-xs">ADMIN</span>}
                </span>
                <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-700 text-sm">{comment.content}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No comments yet. Be the first to share your thoughts!</p>
        )}
      </div>

      {/* Comment Form */}
      {session ? (
        <form onSubmit={handleSubmit} className="bg-white p-6 border border-gray-200 rounded-sm">
          <h4 className="font-bold uppercase text-sm mb-4">Leave a Comment</h4>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full border p-3 rounded-sm mb-4 text-sm focus:outline-none focus:border-bn-black"
            rows={4}
            placeholder="Write your comment here..."
            required
          />
          <button 
            type="submit" 
            disabled={submitting}
            className="bg-bn-red text-white px-6 py-2 text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <div className="bg-gray-50 p-6 text-center rounded-sm">
          <p className="text-gray-600 mb-4">Please login to leave a comment.</p>
          <div className="space-x-4">
             <Link href="/login" className="text-bn-red font-bold uppercase text-xs hover:underline">Login</Link>
             <span>or</span>
             <Link href="/signup" className="text-bn-red font-bold uppercase text-xs hover:underline">Sign Up</Link>
          </div>
        </div>
      )}
    </div>
  );
}
