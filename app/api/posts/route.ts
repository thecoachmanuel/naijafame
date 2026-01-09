import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, slug, content, excerpt, topic, image, published } = body;

    // Basic validation
    if (!title || !slug || !content || !topic) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Check if slug exists
    const existingPost = await prisma.post.findUnique({ where: { slug } });
    if (existingPost) {
      return NextResponse.json({ message: "Slug already exists" }, { status: 409 });
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        topic,
        image,
        published: published || false,
        authorId: session.user.id as string,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const topic = searchParams.get('topic');
  
  const where = topic ? { topic } : {};

  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { email: true } } }
  });

  return NextResponse.json(posts);
}
