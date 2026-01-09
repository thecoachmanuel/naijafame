import Link from 'next/link';
import { getAllTopics } from '@/lib/posts';
import NavbarClient from './NavbarClient';
import AuthStatus from './AuthStatus';
import { shuffle } from '@/lib/utils';

export default async function Navbar() {
  const allTopics = getAllTopics();
  
  // Rotate topics every hour
  // Use current hour + day as seed for deterministic hourly rotation
  const now = new Date();
  const seed = now.getHours() + now.getDate() * 24;
  const topics = shuffle(allTopics, seed);

  return (
    <>
      <header className="font-sans flex flex-col w-full">
         {/* Top Bar */}
         <div className="bg-bn-black text-white text-xs py-2 hidden md:block">
           <div className="container mx-auto px-4 flex justify-between items-center">
              <span>{new Date().toDateString()}</span>
              <div className="flex items-center space-x-6">
                 <div className="space-x-4 flex">
                   <span className="cursor-pointer hover:text-gray-300">Facebook</span>
                   <span className="cursor-pointer hover:text-gray-300">Twitter</span>
                   <span className="cursor-pointer hover:text-gray-300">Instagram</span>
                 </div>
                 <AuthStatus />
              </div>
           </div>
         </div>

         {/* Logo Section */}
         <div className="bg-white py-8 border-b border-gray-100">
           <div className="container mx-auto px-4 text-center">
              <Link href="/" className="inline-block group">
                <h1 className="text-5xl font-extrabold text-bn-red tracking-tighter group-hover:opacity-90 transition-opacity">
                  NAIJAFAME
                </h1>
                <p className="text-xs text-gray-500 mt-2 tracking-widest uppercase">The Voice of the Nation</p>
                <p className="text-sm font-bold text-bn-black mt-1 italic font-serif">by Olaoluwa</p>
              </Link>
           </div>
         </div>
      </header>

      {/* Navigation (Client Component) */}
      <NavbarClient topics={topics} />
    </>
  );
}
