import { prisma } from "@/lib/prisma";
import { PresentationStatus } from "@/generated/prisma/client";
import { NextRequest } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const validStatuses: PresentationStatus[] = [
    "DRAFT",
    "WORK_IN_PROGRESS",
    "VIEWED",
    "ACCEPTED",
    "REJECTED",
  ];

  if (!validStatuses.includes(body.status)) {
    return Response.json(
      { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
      { status: 400 }
    );
  }

  const presentation = await prisma.presentation.update({
    where: { id },
    data: { status: body.status },
  });
  return Response.json(presentation);
}
