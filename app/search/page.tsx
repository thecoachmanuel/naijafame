import Link from 'next/link';
import { getAllPosts, getPostPreview } from '@/lib/posts';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

const getImage = (slug: string) => `https://picsum.photos/seed/${slug}/800/600`;

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.toLowerCase() || '';
  
  const allPosts = getAllPosts();
  const results = query 
    ? allPosts.filter(post => 
        post.title.toLowerCase().includes(query) || 
        post.topic.toLowerCase().includes(query)
      )
    : [];

  return (
    <div className="font-sans">
      <h1 className="text-3xl font-black uppercase text-bn-black mb-8 border-b-2 border-bn-red pb-2">
        Search Results for "{q}"
      </h1>

      {results.length === 0 ? (
        <p className="text-gray-600">No results found for your query.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map(post => (
            <Link key={post.slug} href={`/${post.topic}/${post.slug}`} className="group block h-full flex flex-col">
               <div className="aspect-video overflow-hidden mb-3 rounded-sm bg-gray-200">
                 <img src={getImage(post.slug)} alt={post.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
               </div>
               <span className="text-bn-red text-[10px] font-bold uppercase tracking-wide mb-1">{post.topic}</span>
               <h3 className="font-bold text-base leading-snug group-hover:text-bn-red transition-colors text-bn-black">{post.title}</h3>
               {(() => { const p = getPostPreview(post.topic, post.slug); return p ? <p className="text-sm text-gray-600 mt-1 line-clamp-2">{p.excerpt}</p> : null; })()}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
