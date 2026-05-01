"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/app/ui/atoms/Button";
import Badge from "@/app/ui/atoms/Badge";
import Input from "@/app/ui/atoms/Input";
import Textarea from "@/app/ui/atoms/Textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/app/ui/molecules/Card";
import Dropdown, { type DropdownItem } from "@/app/ui/molecules/Dropdown";
import { ArrowLeft, Eye, Pencil } from "lucide-react";

interface Presentation {
  id: string;
  title: string;
  status: string;
  htmlContent: string;
  createdAt: string;
  updatedAt: string;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  presentations: Presentation[];
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

const STATUS_DROPDOWN_ITEMS: DropdownItem[] = [
  { id: "DRAFT", label: "Draft", value: "DRAFT" },
  { id: "WORK_IN_PROGRESS", label: "Work in Progress", value: "WORK_IN_PROGRESS" },
  { id: "VIEWED", label: "Viewed", value: "VIEWED" },
  { id: "ACCEPTED", label: "Accepted", value: "ACCEPTED" },
  { id: "REJECTED", label: "Rejected", value: "REJECTED" },
];

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProject = async () => {
    const res = await fetch(`/api/projects/${id}`);
    if (!res.ok) {
      router.push("/");
      return;
    }
    setProject(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handleAddPresentation = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/presentations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, htmlContent, projectId: id }),
    });
    setTitle("");
    setHtmlContent("");
    setShowForm(false);
    fetchProject();
  };

  const handleStatusChange = async (
    presentationId: string,
    value: string | number
  ) => {
    await fetch(`/api/presentations/${presentationId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: value }),
    });
    fetchProject();
  };

  const handleDeleteProject = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this project and all its presentations?"
      )
    )
      return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    router.push("/");
  };

  if (loading)
    return (
      <p className="text-neutral-500 dark:text-neutral-400">Loading...</p>
    );
  if (!project) return null;

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to projects
        </Link>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
          {project.description && (
            <p className="text-neutral-500 dark:text-neutral-400 mt-1">
              {project.description}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Link href={`/projects/${id}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="w-4 h-4" />
              Edit
            </Button>
          </Link>
          <Button
            variant={showForm ? "outline" : "primary"}
            size="sm"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "Add Presentation"}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteProject}
          >
            Delete Project
          </Button>
        </div>
      </div>

      {showForm && (
        <Card variant="default" className="mb-8">
          <form onSubmit={handleAddPresentation} className="space-y-4">
            <Input
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Presentation title"
            />
            <Textarea
              label="HTML Content"
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
              required
              rows={12}
              placeholder="Paste your HTML presentation here..."
              className="font-mono"
            />
            <Button type="submit" size="sm">
              Save Presentation
            </Button>
          </form>
        </Card>
      )}

      {project.presentations.length === 0 ? (
        <Card variant="minimal" className="text-center py-12">
          <p className="text-neutral-500 dark:text-neutral-400">
            No presentations yet. Add one to get started.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {project.presentations.map((pres) => (
            <Card key={pres.id} variant="default">
              <CardHeader>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <CardTitle>{pres.title}</CardTitle>
                    <Badge
                      variant={
                        STATUS_BADGE_VARIANT[pres.status] || "default"
                      }
                    >
                      {STATUS_LABELS[pres.status] || pres.status}
                    </Badge>
                  </div>
                  <Link href={`/presentations/${pres.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardFooter justify="between">
                <span className="text-xs text-neutral-400">
                  Created: {new Date(pres.createdAt).toLocaleDateString()}
                </span>
                <div className="w-48">
                  <Dropdown
                    items={STATUS_DROPDOWN_ITEMS}
                    value={pres.status}
                    onSelectionChange={(value) =>
                      handleStatusChange(pres.id, value)
                    }
                  />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
