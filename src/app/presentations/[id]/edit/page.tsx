"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/app/ui/atoms/Button";
import Input from "@/app/ui/atoms/Input";
import Textarea from "@/app/ui/atoms/Textarea";
import { Card } from "@/app/ui/molecules/Card";
import { ArrowLeft } from "lucide-react";

interface Presentation {
  id: string;
  title: string;
  htmlContent: string;
  project: { id: string; name: string };
}

export default function EditPresentationPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [projectId, setProjectId] = useState("");
  const [projectName, setProjectName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPresentation = async () => {
      const res = await fetch(`/api/presentations/${id}`);
      if (!res.ok) {
        router.push("/");
        return;
      }
      const data: Presentation = await res.json();
      setTitle(data.title);
      setHtmlContent(data.htmlContent);
      setProjectId(data.project.id);
      setProjectName(data.project.name);
      setLoading(false);
    };
    fetchPresentation();
  }, [id, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch(`/api/presentations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, htmlContent }),
    });
    router.push(`/presentations/${id}`);
  };

  if (loading) {
    return <p className="text-neutral-500 dark:text-neutral-400">Loading...</p>;
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href={`/presentations/${id}`}
          className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to presentation
        </Link>
      </div>

      <h1 className="text-2xl font-bold tracking-tight mb-6">
        Edit Presentation
      </h1>

      <Card variant="default">
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Textarea
            label="HTML Content"
            value={htmlContent}
            onChange={(e) => setHtmlContent(e.target.value)}
            required
            rows={16}
            className="font-mono"
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" loading={saving} loadingText="Saving...">
              Save Changes
            </Button>
            <Link href={`/presentations/${id}`}>
              <Button variant="outline" size="sm" type="button">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
