import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const ad = await prisma.ad.findUnique({
      where: { id: params.id },
    });

    if (!ad) {
      return NextResponse.json({ message: "Ad not found" }, { status: 404 });
    }

    return NextResponse.json(ad);
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, content, position, active } = body;

    const ad = await prisma.ad.update({
      where: { id: params.id },
      data: {
        title,
        content,
        position,
        active,
      },
    });

    return NextResponse.json(ad);
  } catch (error) {
    console.error("Error updating ad:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.ad.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Ad deleted successfully" });
  } catch (error) {
    console.error("Error deleting ad:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
