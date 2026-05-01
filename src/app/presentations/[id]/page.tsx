"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/app/ui/atoms/Button";
import Badge from "@/app/ui/atoms/Badge";
import { Card } from "@/app/ui/molecules/Card";
import { ArrowLeft, Maximize2, Minimize2, Pencil, Trash2 } from "lucide-react";

interface Presentation {
  id: string;
  title: string;
  status: string;
  htmlContent: string;
  createdAt: string;
  project: { id: string; name: string };
}

const STATUS_BADGE_VARIANT: Record<string, "default" | "primary" | "success" | "warning" | "error"> = {
  DRAFT: "default",
  WORK_IN_PROGRESS: "warning",
  VIEWED: "primary",
  ACCEPTED: "success",
  REJECTED: "error",
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  WORK_IN_PROGRESS: "Work in Progress",
  VIEWED: "Viewed",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
};

export default function PresentationViewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);

  const fetchPresentation = async () => {
    const res = await fetch(`/api/presentations/${id}`);
    if (!res.ok) {
      router.push("/");
      return;
    }
    const data = await res.json();

    if (data.status === "DRAFT") {
      await fetch(`/api/presentations/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "VIEWED" }),
      });
      data.status = "VIEWED";
    }

    setPresentation(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPresentation();
  }, [id]);

  const handleStatusChange = async (status: string) => {
    await fetch(`/api/presentations/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setPresentation((prev) => (prev ? { ...prev, status } : null));
  };

  const handleDelete = async () => {
    if (!presentation) return;
    if (!confirm("Delete this presentation?")) return;
    await fetch(`/api/presentations/${id}`, { method: "DELETE" });
    router.push(`/projects/${presentation.project.id}`);
  };

  if (loading)
    return (
      <p className="text-neutral-500 dark:text-neutral-400">Loading...</p>
    );
  if (!presentation) return null;

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white dark:bg-neutral-950">
        <div className="absolute top-4 right-4 z-50">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setFullscreen(false)}
          >
            <Minimize2 className="w-4 h-4" />
            Exit Fullscreen
          </Button>
        </div>
        <iframe
          srcDoc={presentation.htmlContent}
          className="w-full h-full border-0"
          title={presentation.title}
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href={`/projects/${presentation.project.id}`}
          className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {presentation.project.name}
        </Link>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">
            {presentation.title}
          </h1>
          <Badge
            variant={STATUS_BADGE_VARIANT[presentation.status] || "default"}
          >
            {STATUS_LABELS[presentation.status] || presentation.status}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/presentations/${id}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="w-4 h-4" />
              Edit
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFullscreen(true)}
          >
            <Maximize2 className="w-4 h-4" />
            Fullscreen
          </Button>
          <Button
            variant="success"
            size="sm"
            onClick={() => handleStatusChange("ACCEPTED")}
          >
            Accept
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleStatusChange("REJECTED")}
          >
            Reject
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Card variant="default" spacing="none" size="sm" className="overflow-hidden">
        <iframe
          srcDoc={presentation.htmlContent}
          className="w-full border-0"
          style={{ height: "70vh" }}
          title={presentation.title}
          sandbox="allow-scripts allow-same-origin"
        />
      </Card>
    </div>
  );
}
