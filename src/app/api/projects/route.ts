import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/require-auth";

export async function GET() {
  const unauth = await requireAuth();
  if (unauth) return unauth;
  const projects = await prisma.project.findMany({
    include: { presentations: { select: { id: true, title: true, status: true, createdAt: true } } },
    orderBy: { createdAt: "desc" },
  });
  return Response.json(projects);
}

export async function POST(request: NextRequest) {
  const unauth = await requireAuth();
  if (unauth) return unauth;
  const body = await request.json();
  const project = await prisma.project.create({
    data: { name: body.name, description: body.description },
  });
  return Response.json(project, { status: 201 });
}
