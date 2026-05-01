import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const presentation = await prisma.presentation.findUnique({
    where: { id },
    include: { project: true },
  });
  if (!presentation) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(presentation);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const presentation = await prisma.presentation.update({
    where: { id },
    data: {
      title: body.title,
      htmlContent: body.htmlContent,
    },
  });
  return Response.json(presentation);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.presentation.delete({ where: { id } });
  return Response.json({ deleted: true });
}
