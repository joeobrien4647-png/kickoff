"use client";

import { useState } from "react";
import { Download, Copy, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ExportState = "idle" | "downloading" | "done";

export function DataExport() {
  const [state, setState] = useState<ExportState>("idle");
  const [lastSize, setLastSize] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function fetchExport(): Promise<{ blob: Blob; text: string }> {
    const res = await fetch("/api/export");
    if (!res.ok) throw new Error("Export failed");
    const text = await res.text();
    const blob = new Blob([text], { type: "application/json" });
    return { blob, text };
  }

  function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  async function handleDownload() {
    setState("downloading");
    try {
      const { blob } = await fetchExport();
      setLastSize(formatBytes(blob.size));

      const today = new Date().toISOString().slice(0, 10);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kickoff-backup-${today}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setState("done");
      toast.success("Backup downloaded successfully");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("idle");
      toast.error("Failed to export data");
    }
  }

  async function handleCopy() {
    try {
      const { blob, text } = await fetchExport();
      setLastSize(formatBytes(blob.size));
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy data");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="size-4" />
          Export All Data
        </CardTitle>
        <CardDescription>
          Download a complete backup of all trip data as JSON
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleDownload}
            disabled={state === "downloading"}
          >
            {state === "downloading" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : state === "done" ? (
              <Check className="size-4" />
            ) : (
              <Download className="size-4" />
            )}
            {state === "downloading"
              ? "Exporting..."
              : state === "done"
                ? "Downloaded!"
                : "Download Backup"}
          </Button>
          <Button variant="outline" onClick={handleCopy}>
            {copied ? (
              <Check className="size-4" />
            ) : (
              <Copy className="size-4" />
            )}
            {copied ? "Copied!" : "Copy to Clipboard"}
          </Button>
        </div>
        {lastSize && (
          <p className="text-xs text-muted-foreground">
            Last export: {lastSize}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
