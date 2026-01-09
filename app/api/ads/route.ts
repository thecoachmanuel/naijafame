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
    const { title, content, position, active } = body;

    const ad = await prisma.ad.create({
      data: {
        title,
        content,
        position,
        active: active ?? true,
      },
    });

    return NextResponse.json(ad, { status: 201 });
  } catch (error) {
    console.error("Error creating ad:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const ads = await prisma.ad.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(ads);
}
