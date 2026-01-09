import Link from 'next/link';
import { getPostsByTopic, getAllTopics, getPostPreview } from '@/lib/posts';
import { notFound } from 'next/navigation';

// Helper for images
const getImage = (slug: string) => `https://picsum.photos/seed/${slug}/800/600`;

export async function generateStaticParams() {
  const topics = getAllTopics();
  return topics.map((topic) => ({
    topic: topic.id,
  }));
}

export default async function TopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  
  // Verify topic exists
  const allTopics = getAllTopics();
  const currentTopic = allTopics.find(t => t.id === topic);
  
  if (!currentTopic) {
    notFound();
  }

  const posts = getPostsByTopic(topic);
  const topicName = currentTopic.name;

  return (
    <div className="font-sans">
      {/* Topic Header */}
      <div className="bg-bn-black text-white py-8 mb-8">
        <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-center">{topicName}</h1>
            <div className="text-center mt-4 text-gray-400 text-sm">
                <span>Home</span> <span className="mx-2">/</span> <span className="text-white capitalize">{topicName}</span>
            </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        {posts.length === 0 ? (
           <p className="text-gray-500 text-center py-12">No articles found in this topic.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div key={post.slug} className="group flex flex-col">
                 <Link href={`/${topic}/${post.slug}`} className="block overflow-hidden mb-4 rounded-sm bg-gray-200 aspect-[4/3]">
                    <img 
                        src={getImage(post.slug)} 
                        alt={post.title} 
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                 </Link>
                 <div className="flex flex-col flex-grow">
                    <span className="text-bn-red text-xs font-bold uppercase mb-2">{topicName}</span>
                    <Link href={`/${topic}/${post.slug}`}>
                        <h2 className="text-xl font-bold text-bn-black leading-tight group-hover:text-bn-red transition-colors mb-3">
                            {post.title}
                        </h2>
                    </Link>
                    {(() => { const p = getPostPreview(post.topic, post.slug); return p ? <p className="text-sm text-gray-600 mt-1 line-clamp-2">{p.excerpt}</p> : null; })()}
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
