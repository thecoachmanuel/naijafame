import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ message: "Invalid email address" }, { status: 400 });
    }

    // Check if already subscribed
    const existing = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json({ message: "Already subscribed" }, { status: 409 });
    }

    await prisma.newsletter.create({
      data: { email },
    });

    return NextResponse.json({ message: "Subscribed successfully" }, { status: 201 });
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
