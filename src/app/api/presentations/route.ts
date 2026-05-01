import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/require-auth";

export async function POST(request: NextRequest) {
  const unauth = await requireAuth();
  if (unauth) return unauth;
  const body = await request.json();
  const presentation = await prisma.presentation.create({
    data: {
      title: body.title,
      htmlContent: body.htmlContent,
      status: body.status || "DRAFT",
      projectId: body.projectId,
    },
  });
  return Response.json(presentation, { status: 201 });
}
