import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  
  try {
    // Ensure system user exists
    let systemUser = await prisma.user.findUnique({ where: { email: 'system@naijafame.com' } });
    if (!systemUser) {
      systemUser = await prisma.user.create({
        data: {
          email: 'system@naijafame.com',
          password: 'system-password-placeholder',
          role: 'ADMIN',
        },
      });
    }

    // Upsert post
    const post = await prisma.post.upsert({
      where: { slug },
      create: {
        slug,
        title: slug, // Placeholder, ideally we'd pass the title in the body
        content: '',
        topic: 'general',
        authorId: systemUser.id,
        viewCount: 1,
        published: true,
      },
      update: {
        viewCount: { increment: 1 },
      },
    });

    return NextResponse.json({ viewCount: post.viewCount });
  } catch (error) {
    console.error('Error incrementing view count:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      select: { viewCount: true },
    });

    return NextResponse.json({ viewCount: post?.viewCount || 0 });
  } catch (error) {
    console.error('Error fetching view count:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
