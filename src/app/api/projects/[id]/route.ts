import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/require-auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauth = await requireAuth();
  if (unauth) return unauth;
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: { presentations: { orderBy: { createdAt: "desc" } } },
  });
  if (!project) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(project);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauth = await requireAuth();
  if (unauth) return unauth;
  const { id } = await params;
  const body = await request.json();
  const project = await prisma.project.update({
    where: { id },
    data: { name: body.name, description: body.description },
  });
  return Response.json(project);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauth = await requireAuth();
  if (unauth) return unauth;
  const { id } = await params;
  await prisma.project.delete({ where: { id } });
  return Response.json({ deleted: true });
}
