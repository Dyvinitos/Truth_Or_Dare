import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const truths = await prisma.truth.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(truths);
}

export async function POST(req: Request) {
  const { content } = await req.json();
  if (!content) return NextResponse.json({ error: "Content required" }, { status: 400 });
  const truth = await prisma.truth.create({ data: { content } });
  return NextResponse.json(truth);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.truth.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
