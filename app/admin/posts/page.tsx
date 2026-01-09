import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AdminPostsPage() {
  const session = await getServerSession(authOptions);
  
  // Double check admin just in case layout fails or for extra security
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/login");
  }

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { email: true } } }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Posts</h1>
        <Link 
          href="/admin/posts/create" 
          className="bg-bn-red text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Create New Post
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.map((post) => (
              <tr key={post.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{post.title}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">{post.slug}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                  {post.topic}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/admin/posts/edit/${post.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    Edit
                  </Link>
                  {/* We will add a delete button component later */}
                  <Link href={`/admin/posts/delete/${post.id}`} className="text-red-600 hover:text-red-900">
                    Delete
                  </Link>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No posts found. Create one!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
