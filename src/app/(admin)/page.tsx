"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/app/ui/atoms/Button";
import Badge from "@/app/ui/atoms/Badge";
import Input from "@/app/ui/atoms/Input";
import Textarea from "@/app/ui/atoms/Textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/app/ui/molecules/Card";
import { Presentation } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  presentations: {
    id: string;
    title: string;
    status: string;
    createdAt: string;
  }[];
}

const STATUS_BADGE_VARIANT: Record<string, "default" | "primary" | "success" | "warning" | "error"> = {
  DRAFT: "default",
  WORK_IN_PROGRESS: "warning",
  VIEWED: "primary",
  ACCEPTED: "success",
  REJECTED: "error",
};

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    const res = await fetch("/api/projects");
    setProjects(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });
    setName("");
    setDescription("");
    setShowForm(false);
    fetchProjects();
  };

  if (loading) {
    return (
      <p className="text-neutral-500 dark:text-neutral-400">
        Loading projects...
      </p>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        <Button
          variant={showForm ? "outline" : "primary"}
          size="sm"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "New Project"}
        </Button>
      </div>

      {showForm && (
        <Card variant="default" className="mb-8">
          <form onSubmit={handleCreate} className="space-y-4">
            <Input
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Project name"
            />
            <Textarea
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Optional description"
            />
            <Button type="submit" size="sm">
              Create Project
            </Button>
          </form>
        </Card>
      )}

      {projects.length === 0 ? (
        <Card variant="minimal" className="text-center py-12">
          <CardContent>
            <Presentation className="w-12 h-12 mx-auto text-neutral-400 mb-4" />
            <p className="text-neutral-500 dark:text-neutral-400">
              No projects yet. Create one to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card variant="default" interactive>
                <CardHeader>
                  <div className="flex items-start justify-between w-full">
                    <div>
                      <CardTitle>{project.name}</CardTitle>
                      {project.description && (
                        <CardDescription>{project.description}</CardDescription>
                      )}
                    </div>
                    <Badge variant="default">
                      {project.presentations.length} presentation
                      {project.presentations.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                </CardHeader>
                {project.presentations.length > 0 && (
                  <CardFooter gap="sm">
                    {project.presentations.slice(0, 5).map((p) => (
                      <Badge
                        key={p.id}
                        variant={STATUS_BADGE_VARIANT[p.status] || "default"}
                      >
                        {p.title}
                      </Badge>
                    ))}
                    {project.presentations.length > 5 && (
                      <span className="text-xs text-neutral-400">
                        +{project.presentations.length - 5} more
                      </span>
                    )}
                  </CardFooter>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
