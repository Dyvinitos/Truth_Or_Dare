import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const dares = await prisma.dare.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(dares);
}

export async function POST(req: Request) {
  const { content } = await req.json();
  if (!content) return NextResponse.json({ error: "Content required" }, { status: 400 });
  const dare = await prisma.dare.create({ data: { content } });
  return NextResponse.json(dare);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.dare.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
