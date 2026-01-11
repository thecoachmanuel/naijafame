'use client';

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === 'loading') return null;

  if (session) {
    return (
      <div className="flex items-center space-x-4">
        <span className="text-xs text-white">Welcome, {session.user?.email}</span>
        {session.user?.role === 'ADMIN' && (
           <Link href="/admin" className="text-xs text-white hover:text-gray-300 font-bold">Admin</Link>
        )}
        <button onClick={() => signOut()} className="text-xs text-white hover:text-gray-300 cursor-pointer">Logout</button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <Link href="/login" className="text-xs text-white hover:text-gray-300">Login</Link>
      <Link href="/signup" className="text-xs text-white hover:text-gray-300">Sign Up</Link>
    </div>
  );
}
