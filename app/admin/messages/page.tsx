import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AdminMessagesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/login");
  }

  const messages = await prisma.contact.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Contact Messages</h1>

      <div className="grid grid-cols-1 gap-6">
        {messages.map((msg) => (
          <div key={msg.id} className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{msg.name}</h3>
                <p className="text-sm text-gray-500">{msg.email}</p>
              </div>
              <span className="text-sm text-gray-400">
                {new Date(msg.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{msg.message}</p>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-12 bg-white rounded-lg shadow">
            No messages yet.
          </div>
        )}
      </div>
    </div>
  );
}
