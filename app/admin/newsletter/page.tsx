import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AdminNewsletterPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/login");
  }

  const subscribers = await prisma.newsletter.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Newsletter Subscribers</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Subscribed</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {subscribers.map((sub) => (
              <tr key={sub.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {sub.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(sub.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {subscribers.length === 0 && (
              <tr>
                <td colSpan={2} className="px-6 py-4 text-center text-gray-500">
                  No subscribers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
