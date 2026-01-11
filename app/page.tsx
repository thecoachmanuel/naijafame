import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts, getAllTopics, getPostPreview } from '@/lib/posts';
import { prisma } from "@/lib/prisma";
import HeroSlider from '@/components/HeroSlider';
import AdDisplay from '@/components/AdDisplay';
import { shuffle } from '@/lib/utils';

export const dynamic = 'force-dynamic';

// Helper for images (deterministic based on slug string)
const getImage = (slug: string, customImage?: string | null) => customImage || `https://picsum.photos/seed/${slug}/800/600`;

interface Post {
  title: string;
  slug: string;
  topic: string;
  excerpt: string;
  image?: string | null;
  createdAt?: Date; // Optional for sorting
}

export default async function Home() {
  // 1. Get FS Posts
  const fsPostsRaw = getAllPosts();
  const fsPosts: Post[] = fsPostsRaw.map(p => {
    const preview = getPostPreview(p.topic, p.slug);
    return {
      title: p.title,
      slug: p.slug,
      topic: p.topic,
      excerpt: preview?.excerpt || "",
      image: null,
      createdAt: new Date(0) // Old date for static posts
    };
  });

  // 2. Get DB Posts
  let dbPostsRaw: any[] = [];
  
  // Skip DB if using placeholder connection string
  const isPlaceholderDb = process.env.DATABASE_URL?.includes('johndoe') || false;

  if (!isPlaceholderDb) {
    try {
      dbPostsRaw = await prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      console.error("Failed to fetch posts from DB (fallback to FS only):", error);
    }
  }
  
  const dbPosts: Post[] = dbPostsRaw.map(p => ({
    title: p.title,
    slug: p.slug,
    topic: p.topic,
    excerpt: p.excerpt || "",
    image: p.image,
    createdAt: p.createdAt
  }));

  // 3. Merge and Sort (Newest first)
  const allPosts = [...dbPosts, ...fsPosts].sort((a, b) => {
    if (a.createdAt && b.createdAt) {
      return b.createdAt.getTime() - a.createdAt.getTime();
    }
    return 0; 
  });
  
  // 4. Content Strategy: Randomize Topics to ensure variety and no overlap
  const allTopics = getAllTopics();
  // Shuffle topics randomly on every render (user open)
  const randomTopics = shuffle(allTopics);
  
  // Assign distinct topics to sections
  // Ensure we have enough topics, otherwise loop or reuse (but user asked for no overlap)
  // We'll fallback if not enough topics
  const heroTopics = randomTopics.slice(0, 3).map(t => t.id);
  const scoopTopics = randomTopics.slice(3, 6).map(t => t.id);
  const dynamicTopics = randomTopics.slice(6, 11); // Up to 5 more sections

  // Filter posts for each section based on assigned topics
  const heroPosts = allPosts.filter(p => heroTopics.includes(p.topic)).slice(0, 10);
  const scoopPosts = allPosts.filter(p => scoopTopics.includes(p.topic)).slice(0, 12);

  // Sub-feature for Hero (Right side)
  const heroMain = shuffle(heroPosts.slice(0, 6)); // For slider
  const heroSide = heroPosts.slice(6, 10); // For side list

  return (
    <div className="space-y-12 font-sans">
      <AdDisplay position="header" />

      {/* Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="md:col-span-2 relative group">
            {/* Hero Slider */}
            <HeroSlider posts={heroMain} />
         </div>
         <div className="space-y-6 flex flex-col justify-between">
            {/* Side Features */}
            {heroSide.map(post => (
                <Link key={post.slug} href={`/${post.topic}/${post.slug}`} className="flex gap-4 group items-start h-full">
                   <div className="w-32 h-24 flex-shrink-0 overflow-hidden rounded-sm bg-gray-200 relative">
                      <Image src={getImage(post.slug, post.image)} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                   </div>
                   <div className="flex flex-col justify-between h-full py-1">
                      <div>
                        <span className="text-bn-red text-[10px] font-bold uppercase tracking-wide">{post.topic}</span>
                        <h3 className="font-bold text-sm leading-snug group-hover:text-bn-red transition-colors line-clamp-3 mt-1 text-bn-black">{post.title}</h3>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{post.excerpt}</p>
                      </div>
                   </div>
                </Link>
              ))}
           </div>
        </section>

      <AdDisplay position="content_top" />

      {/* Latest Scoop Grid (Actually Random Topics Scoop) */}
      <section>
        <div className="flex items-center justify-between mb-6 border-b-2 border-bn-black pb-2">
           <h2 className="text-2xl font-black uppercase text-bn-black tracking-tight">The Latest Scoop</h2>
           <span className="text-xs font-bold text-bn-red uppercase cursor-pointer hover:underline">View All</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
           {scoopPosts.map(post => (
             <div key={post.slug} className="group flex flex-col h-full">
                <Link href={`/${post.topic}/${post.slug}`} className="flex-grow">
                  <div className="aspect-[4/3] overflow-hidden mb-3 rounded-sm bg-gray-200 relative">
                    <Image src={getImage(post.slug, post.image)} alt={post.title} fill className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-bn-red text-[10px] font-bold uppercase tracking-wide mb-1">{post.topic}</span>
                    <h3 className="font-bold text-lg leading-tight group-hover:text-bn-red transition-colors text-bn-black">{post.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{post.excerpt}</p>
                  </div>
                </Link>
             </div>
           ))}
        </div>
      </section>

      <AdDisplay position="content_bottom" />

      {/* Dynamic Topic Sections */}
      {dynamicTopics.map(topic => {
        const topicPosts = allPosts.filter(p => p.topic === topic.id).slice(0, 4);
        if (topicPosts.length === 0) return null;

        return (
          <section key={topic.id}>
             <div className="flex items-center justify-between mb-6 border-b-2 border-bn-gold pb-2">
                <h2 className="text-2xl font-black uppercase text-bn-black tracking-tight capitalize">{topic.name}</h2>
                <Link href={`/${topic.id}`} className="text-xs font-bold text-bn-gold uppercase hover:underline">See More</Link>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {topicPosts.map(post => (
                  <Link key={post.slug} href={`/${post.topic}/${post.slug}`} className="group block">
                     <div className="aspect-video overflow-hidden mb-3 rounded-sm bg-gray-200 relative">
                       <Image src={getImage(post.slug, post.image)} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                     </div>
                     <h3 className="font-bold text-base leading-snug group-hover:text-bn-gold transition-colors text-bn-black">{post.title}</h3>
                     <p className="text-sm text-gray-600 mt-1 line-clamp-2">{post.excerpt}</p>
                  </Link>
                ))}
             </div>
          </section>
        );
      })}
    </div>
  );
}
