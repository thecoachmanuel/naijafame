'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Topic {
  id: string;
  name: string;
  count: number;
}

interface NavbarClientProps {
  topics: Topic[];
}

export default function NavbarClient({ topics }: NavbarClientProps) {
  const [showStickyLogo, setShowStickyLogo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // Handle Resize for Mobile Detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine limit based on state
  // Mobile: 6, Sticky: 4, Default: 8
  const limit = isMobile ? 6 : (showStickyLogo ? 4 : 8);

  // We don't sort by count here anymore because the parent component (Navbar) 
  // has already shuffled/rotated them for us.
  // Just use the passed order.
  const mainTopics = topics.slice(0, limit);
  const moreTopics = topics.slice(limit);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      // Show logo when scrolled past 200px (approx height of header)
      if (window.scrollY > 150) {
        setShowStickyLogo(true);
      } else {
        setShowStickyLogo(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="bg-white border-b-2 border-bn-black sticky top-0 z-50 shadow-sm font-sans transition-all duration-300">
      <div className="container mx-auto px-4 flex items-center justify-between h-14">
        {/* Sticky Logo */}
        <div 
          className={`flex items-center transition-all duration-500 ease-in-out overflow-hidden ${
            showStickyLogo ? 'w-auto opacity-100 mr-6' : 'w-0 opacity-0 mr-0'
          }`}
        >
          <Link href="/" className="flex flex-col leading-none">
             <span className="text-xl font-extrabold text-bn-red tracking-tighter whitespace-nowrap">NAIJAFAME</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="flex-1 flex items-center justify-start md:justify-center space-x-4 md:space-x-6 text-xs md:text-sm font-bold uppercase text-bn-black overflow-x-auto md:overflow-visible flex-nowrap md:flex-wrap no-scrollbar px-2 md:px-0">
          <li className="flex-shrink-0"><Link href="/" className="hover:text-bn-red transition-colors">Home</Link></li>
          {mainTopics.map(topic => (
            <li key={topic.id} className="flex-shrink-0">
              <Link href={`/${topic.id}`} className="hover:text-bn-red transition-colors whitespace-nowrap">
                {topic.name}
              </Link>
            </li>
          ))}
          
          {/* Improved More Dropdown */}
          {moreTopics.length > 0 && (
            <li className="relative group cursor-pointer h-full flex items-center flex-shrink-0">
              <span className="hover:text-bn-red transition-colors flex items-center gap-1 py-4">
                More 
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </span>
              
              {/* Mega Menu / Grid Dropdown */}
              <div className="absolute right-0 top-full mt-0 w-64 md:w-96 bg-white border border-gray-200 shadow-xl rounded-b-lg hidden group-hover:block z-50 overflow-hidden">
                <div className="grid grid-cols-2 gap-1 p-4 max-h-[80vh] overflow-y-auto">
                  {moreTopics.map(topic => (
                    <Link 
                      key={topic.id} 
                      href={`/${topic.id}`} 
                      className="block px-3 py-2 text-xs hover:bg-gray-50 hover:text-bn-red transition-colors rounded-sm uppercase border-b border-gray-50 last:border-0"
                    >
                      {topic.name}
                    </Link>
                  ))}
                </div>
              </div>
            </li>
          )}
        </ul>

        {/* Search Section */}
        <div className="flex items-center ml-4 relative">
          <div className={`absolute right-0 top-1/2 -translate-y-1/2 bg-white flex items-center transition-all duration-300 ${
            showSearch ? 'w-[calc(100vw-4rem)] md:w-64 opacity-100 z-50 pr-10' : 'w-0 opacity-0 -z-10'
          }`}>
            <form onSubmit={handleSearch} className="w-full">
              <input
                type="text"
                placeholder="Search..."
                className="w-full border-b-2 border-bn-red px-3 py-2 text-sm focus:outline-none bg-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
          <button 
            aria-label="Search" 
            onClick={() => setShowSearch(!showSearch)}
            className="text-bn-black hover:text-bn-red transition-colors p-2 z-50 relative"
          >
            {showSearch ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
