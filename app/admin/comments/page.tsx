import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AdminCommentsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/login");
  }

  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: 'desc' },
    include: { 
      author: { select: { email: true } },
      post: { select: { title: true, slug: true } }
    },
    take: 100 // Limit to last 100 comments for performance
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Comments</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {comments.map((comment) => (
              <tr key={comment.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {comment.author.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                  {comment.content}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                  <Link href={`/${comment.post.slug}`} className="hover:text-bn-red" target="_blank">
                    {comment.post.title}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/admin/comments/delete/${comment.id}`} className="text-red-600 hover:text-red-900">
                    Delete
                  </Link>
                </td>
              </tr>
            ))}
            {comments.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No comments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
