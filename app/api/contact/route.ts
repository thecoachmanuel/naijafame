import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await prisma.contact.create({
      data: { name, email, message },
    });

    return NextResponse.json({ message: "Message sent successfully" }, { status: 201 });
  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
