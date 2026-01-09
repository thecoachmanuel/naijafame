import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { slug, content, title, topic } = await req.json();

  if (!slug || !content) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  try {
    // Find or create post
    let post = await prisma.post.findUnique({ where: { slug } });
    if (!post) {
      // Need a default author for the post if we create it on the fly
      // We can use the system user or the first admin
      // Ideally we should have a specific system user, but any admin works for now
      let systemUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
      
      // If no admin exists, create one (system fallback)
      if (!systemUser) {
         systemUser = await prisma.user.create({
            data: {
               email: 'system@naijafame.com',
               password: 'system-password-placeholder',
               role: 'ADMIN'
            }
         });
      }

      post = await prisma.post.create({
        data: {
          slug,
          title: title || slug,
          content: '', 
          topic: topic || 'general',
          authorId: systemUser.id,
          published: true,
        }
      });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId: post.id,
        authorId: session.user.id as string,
      },
      include: {
        author: {
          select: { email: true, role: true } 
        }
      }
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to post comment" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ message: "Slug required" }, { status: 400 });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        comments: {
          include: {
            author: {
              select: { email: true, role: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    return NextResponse.json(post?.comments || []);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch comments" }, { status: 500 });
  }
}
