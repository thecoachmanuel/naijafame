import Link from 'next/link';
import { getPostContent, getPostsByTopic, getAllTopics, getAllPosts } from '@/lib/posts';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

import SocialShare from '@/components/SocialShare';
import ViewCounter from '@/components/ViewCounter';
import CommentsSection from '@/components/CommentsSection';
import AdDisplay from '@/components/AdDisplay';

// Helper for images
const getImage = (slug: string, customImage?: string | null) => customImage || `https://picsum.photos/seed/${slug}/800/600`;

export async function generateStaticParams() {
  const topics = getAllTopics();
  const params: { topic: string; slug: string }[] = [];
  
  for (const topic of topics) {
    const posts = getPostsByTopic(topic.id);
    for (const post of posts) {
      params.push({
        topic: topic.id,
        slug: post.slug,
      });
    }
  }
  
  return params;
}

export default async function PostPage({ params }: { params: Promise<{ topic: string; slug: string }> }) {
  const { topic, slug } = await params;
  
  // Try DB first
  let post: any = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post) {
    // Fallback to FS
    post = getPostContent(topic, slug);
  }

  if (!post) {
    notFound();
  }

  // Get related posts (same topic, exclude current)
  // Note: relatedPosts from FS for now, ideally should mix both but that's complex
  const relatedPosts = getPostsByTopic(topic)
    .filter(p => p.slug !== slug)
    .slice(0, 3);

  // Get recent posts for sidebar (mock trending)
  const recentPosts = getAllPosts().slice(0, 5);

  return (
    <div className="font-sans container mx-auto px-4 py-8">
       {/* Breadcrumb */}
       <div className="text-xs font-bold uppercase text-gray-400 mb-6 flex flex-wrap items-center">
          <Link href="/" className="hover:text-bn-red transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/${topic}`} className="hover:text-bn-red transition-colors capitalize">{topic.replace(/-/g, ' ')}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 truncate max-w-[200px] md:max-w-md">{post.title}</span>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <article className="lg:col-span-2">
             <h1 className="text-3xl md:text-5xl font-black text-bn-black leading-tight mb-6">{post.title}</h1>
             
             {/* Meta */}
             <div className="flex items-center flex-wrap text-xs font-bold uppercase text-gray-500 mb-8 border-y border-gray-100 py-4 gap-y-2">
                <span className="text-bn-red">By Editorial Team</span>
                <span className="mx-3">•</span>
                <span>{new Date().toDateString()}</span>
                <span className="mx-3">•</span>
                <span className="capitalize">{topic.replace(/-/g, ' ')}</span>
                <span className="mx-3">•</span>
                <ViewCounter slug={slug} />
             </div>

             {/* Featured Image */}
             <div className="aspect-video w-full overflow-hidden rounded-sm mb-8 bg-gray-200">
                <img src={getImage(slug, post.image)} alt={post.title} className="object-cover w-full h-full" />
             </div>

             <AdDisplay position="content_top" />

             {/* Content */}
             <div 
                className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-bn-red hover:prose-a:text-bn-black prose-img:rounded-sm text-gray-800"
                dangerouslySetInnerHTML={{ __html: post.content }} 
             />

             <AdDisplay position="content_bottom" />

             {/* Share */}
             <div className="mt-12 py-8 border-t border-gray-100">
                <h3 className="text-sm font-bold uppercase mb-4">Share this article</h3>
                <SocialShare 
                  url={`https://naijafame-blog.vercel.app/${topic}/${slug}`} 
                  title={post.title} 
                />
             </div>

             {/* Related Posts */}
             {relatedPosts.length > 0 && (
                <div className="mt-12">
                   <h3 className="text-xl font-black uppercase mb-6 border-b-2 border-bn-black pb-2">Related Articles</h3>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {relatedPosts.map(p => (
                         <Link key={p.slug} href={`/${topic}/${p.slug}`} className="group block">
                            <div className="aspect-video overflow-hidden mb-3 rounded-sm bg-gray-200">
                               <img src={getImage(p.slug)} alt={p.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <h4 className="font-bold text-sm leading-tight group-hover:text-bn-red transition-colors text-bn-black line-clamp-3">{p.title}</h4>
                         </Link>
                      ))}
                   </div>
                </div>
             )}

             <CommentsSection slug={slug} postTitle={post.title} postTopic={topic} />
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
             <div className="sticky top-24 space-y-12">
                {/* Search Widget (Mock) */}
                <div className="bg-gray-50 p-6 rounded-sm border border-gray-100">
                   <h3 className="text-lg font-black uppercase mb-4">Search</h3>
                   <input type="text" placeholder="Type and hit enter..." className="w-full p-3 border border-gray-200 text-sm focus:outline-none focus:border-bn-red rounded-sm" />
                </div>

                <AdDisplay position="sidebar" />

                {/* Trending Widget */}
                <div>
                   <h3 className="text-lg font-black uppercase mb-6 border-b-2 border-bn-red pb-2 inline-block">Trending Now</h3>
                   <div className="space-y-6">
                      {recentPosts.map((p, i) => (
                         <Link key={p.slug} href={`/${p.topic}/${p.slug}`} className="flex gap-4 group">
                            <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-sm bg-gray-200 relative">
                               <img src={getImage(p.slug)} alt={p.title} className="object-cover w-full h-full" />
                               <span className="absolute top-0 left-0 bg-bn-red text-white text-[10px] font-bold w-6 h-6 flex items-center justify-center">{i + 1}</span>
                            </div>
                            <div>
                               <span className="text-bn-red text-[10px] font-bold uppercase">{p.topic}</span>
                               <h4 className="font-bold text-sm leading-snug group-hover:text-bn-red transition-colors line-clamp-2 text-bn-black">{p.title}</h4>
                            </div>
                         </Link>
                      ))}
                   </div>
                </div>
             </div>
          </aside>
       </div>
    </div>
  );
}
