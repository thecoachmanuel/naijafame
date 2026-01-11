import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <aside className="w-64 bg-bn-black text-white p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-8 text-bn-red">ADMIN</h2>
        <nav className="space-y-4">
          <Link href="/admin" className="block hover:text-bn-red transition-colors">Dashboard</Link>
          <Link href="/admin/posts" className="block hover:text-bn-red transition-colors">Posts</Link>
          <Link href="/admin/comments" className="block hover:text-bn-red transition-colors">Comments</Link>
          <Link href="/admin/ads" className="block hover:text-bn-red transition-colors">Ads</Link>
          <Link href="/admin/newsletter" className="block hover:text-bn-red transition-colors">Newsletter</Link>
          <Link href="/admin/messages" className="block hover:text-bn-red transition-colors">Messages</Link>
          <Link href="/" className="block pt-8 text-gray-400 hover:text-white text-sm">Back to Site</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
