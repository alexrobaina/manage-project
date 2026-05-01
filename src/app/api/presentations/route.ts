import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
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
