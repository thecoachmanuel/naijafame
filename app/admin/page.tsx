import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const userCount = await prisma.user.count();
  const postCount = await prisma.post.count(); 
  const commentCount = await prisma.comment.count();
  const adCount = await prisma.ad.count();
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-xs font-bold uppercase">Total Users</h3>
          <p className="text-3xl font-bold text-bn-black mt-2">{userCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-xs font-bold uppercase">Posts (DB)</h3>
          <p className="text-3xl font-bold text-bn-black mt-2">{postCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-xs font-bold uppercase">Comments</h3>
          <p className="text-3xl font-bold text-bn-black mt-2">{commentCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-xs font-bold uppercase">Active Ads</h3>
          <p className="text-3xl font-bold text-bn-black mt-2">{adCount}</p>
        </div>
      </div>
    </div>
  );
}
