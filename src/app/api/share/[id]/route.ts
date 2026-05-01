import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const presentation = await prisma.presentation.findUnique({
    where: { id },
    select: { id: true, title: true, htmlContent: true },
  });
  if (!presentation) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return Response.json(presentation);
}
