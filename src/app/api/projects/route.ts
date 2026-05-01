import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET() {
  const projects = await prisma.project.findMany({
    include: { presentations: { select: { id: true, title: true, status: true, createdAt: true } } },
    orderBy: { createdAt: "desc" },
  });
  return Response.json(projects);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const project = await prisma.project.create({
    data: { name: body.name, description: body.description },
  });
  return Response.json(project, { status: 201 });
}
