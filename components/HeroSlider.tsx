'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PostListItem } from '@/lib/types';

interface SliderPost extends PostListItem {
  image?: string | null;
}

interface HeroSliderProps {
  posts: SliderPost[];
}

const getImage = (slug: string, image?: string | null) => image || `https://picsum.photos/seed/${slug}/800/600`;

export default function HeroSlider({ posts }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderPosts, setSliderPosts] = useState<SliderPost[]>([]);

  useEffect(() => {
    // Shuffle and pick top 5 for the slider on mount
    const shuffled = [...posts].sort(() => 0.5 - Math.random());
    setSliderPosts(shuffled.slice(0, 5));
  }, [posts]);

  useEffect(() => {
    if (sliderPosts.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderPosts.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(timer);
  }, [sliderPosts]);

  if (sliderPosts.length === 0) {
    return <div className="w-full h-[400px] bg-gray-200 animate-pulse rounded-sm"></div>;
  }

  return (
    <div className="relative w-full aspect-video md:h-[500px] md:aspect-auto overflow-hidden rounded-sm group">
      {sliderPosts.map((post, index) => (
        <div
          key={post.slug}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <Link href={`/${post.topic}/${post.slug}`} className="block w-full h-full relative">
            <img
              src={getImage(post.slug, post.image)}
              alt={post.title}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 pt-20">
              <span className="bg-bn-red text-white text-xs font-bold px-3 py-1 uppercase mb-3 inline-block tracking-wider animate-fadeIn">
                {post.topic}
              </span>
              <h2 className="text-white text-2xl md:text-5xl font-extrabold leading-tight drop-shadow-md line-clamp-2 md:line-clamp-3">
                {post.title}
              </h2>
            </div>
          </Link>
        </div>
      ))}

      {/* Indicators */}
      <div className="absolute bottom-4 right-4 z-20 flex space-x-2">
        {sliderPosts.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-bn-red w-8' : 'bg-white/50 hover:bg-white'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={() => setCurrentSlide((prev) => (prev - 1 + sliderPosts.length) % sliderPosts.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-bn-red text-white p-2 rounded-full backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % sliderPosts.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-bn-red text-white p-2 rounded-full backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  );
}
