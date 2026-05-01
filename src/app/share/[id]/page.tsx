import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SharePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const presentation = await prisma.presentation.findUnique({
    where: { id },
    select: { id: true, title: true, htmlContent: true },
  });

  if (!presentation) notFound();

  return (
    <div className="fixed inset-0 bg-white dark:bg-neutral-950">
      <iframe
        srcDoc={presentation.htmlContent}
        className="w-full h-full border-0"
        title={presentation.title}
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const presentation = await prisma.presentation.findUnique({
    where: { id },
    select: { title: true },
  });
  return { title: presentation?.title ?? "Presentación" };
}
