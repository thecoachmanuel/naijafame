import { prisma } from "@/lib/prisma";

interface AdDisplayProps {
  position: string;
}

export default async function AdDisplay({ position }: AdDisplayProps) {
  const ads = await prisma.ad.findMany({
    where: {
      position,
      active: true,
    },
  });

  if (ads.length === 0) return null;

  // Simple random selection
  // eslint-disable-next-line react-hooks/purity
  const randomAd = ads[Math.floor(Math.random() * ads.length)];

  return (
    <div className="my-6 text-center">
      {randomAd.content.startsWith("http") ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img 
          src={randomAd.content} 
          alt={randomAd.title} 
          className="mx-auto max-w-full h-auto rounded shadow-sm"
        />
      ) : (
        <div 
          className="mx-auto max-w-full overflow-hidden"
          dangerouslySetInnerHTML={{ __html: randomAd.content }} 
        />
      )}
      <span className="text-[10px] text-gray-400 uppercase tracking-widest mt-1 block">Advertisement</span>
    </div>
  );
}
