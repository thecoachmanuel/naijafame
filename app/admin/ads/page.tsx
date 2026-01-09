import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AdminAdsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/login");
  }

  const ads = await prisma.ad.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Ads</h1>
        <Link 
          href="/admin/ads/create" 
          className="bg-bn-red text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Create New Ad
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ads.map((ad) => (
              <tr key={ad.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {ad.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                  {ad.position}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    ad.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {ad.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/admin/ads/edit/${ad.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    Edit
                  </Link>
                  <Link href={`/admin/ads/delete/${ad.id}`} className="text-red-600 hover:text-red-900">
                    Delete
                  </Link>
                </td>
              </tr>
            ))}
            {ads.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  No ads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
