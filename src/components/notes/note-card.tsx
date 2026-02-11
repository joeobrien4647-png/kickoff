"use client";

import { useState } from "react";
import {
  Pin,
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
  Calendar,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Note, Stop } from "@/lib/schema";
import { AddNoteForm } from "@/components/notes/add-note-form";

interface NoteCardProps {
  note: Note;
  stops: Stop[];
  currentUser: string | null;
  onMutate: () => void;
}

export function NoteCard({ note, stops, currentUser, onMutate }: NoteCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const stop = stops.find((s) => s.id === note.stopId);

  async function handleTogglePin() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/notes/${note.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pinned: !note.pinned }),
      });
      if (!res.ok) throw new Error("Failed to update pin");
      onMutate();
    } catch {
      toast.error("Failed to update pin");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/notes/${note.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete note");
      toast.success("Note deleted");
      onMutate();
    } catch {
      toast.error("Failed to delete note");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Card
        className={cn(
          "py-3 transition-colors hover:border-muted-foreground/20",
          note.pinned && "border-wc-gold/30 bg-wc-gold/5"
        )}
      >
        <CardContent className="space-y-2">
          {/* Header: title + pin */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1 space-y-1.5">
              {note.title && (
                <h3 className="font-semibold text-sm leading-tight">
                  {note.title}
                </h3>
              )}
              <p
                className={cn(
                  "text-xs text-muted-foreground leading-relaxed",
                  !expanded && "line-clamp-2"
                )}
              >
                {note.content}
              </p>
            </div>

            {/* Pin button */}
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={handleTogglePin}
              disabled={loading}
              className="shrink-0"
            >
              <Pin
                className={cn(
                  "size-4 transition-colors",
                  note.pinned
                    ? "fill-wc-gold text-wc-gold"
                    : "text-muted-foreground"
                )}
              />
            </Button>
          </div>

          {/* Meta badges */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs text-muted-foreground">
            {note.date && (
              <span className="flex items-center gap-1">
                <Calendar className="size-3" />
                {note.date}
              </span>
            )}
            {stop && (
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 py-0 bg-wc-blue/10 text-wc-blue border-wc-blue/20"
              >
                <MapPin className="size-2.5 mr-0.5" />
                {stop.city}
              </Badge>
            )}
            {!stop && note.stopId === null && (
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 py-0"
              >
                General
              </Badge>
            )}
            {note.addedBy && (
              <span className="text-muted-foreground/70">
                by {note.addedBy}
              </span>
            )}
          </div>

          {/* Expand toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {expanded ? (
              <>
                <ChevronUp className="size-3" /> Less
              </>
            ) : (
              <>
                <ChevronDown className="size-3" /> More
              </>
            )}
          </button>

          {/* Expanded actions */}
          {expanded && (
            <div className="space-y-3 pt-1 border-t border-border">
              <p className="text-[10px] text-muted-foreground/70">
                Created{" "}
                {new Date(note.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => setEditing(true)}
                  className="text-wc-teal border-wc-teal/30 hover:bg-wc-teal/10"
                >
                  <Pencil className="size-3" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={handleDelete}
                  disabled={loading}
                  className="text-destructive/70 hover:text-destructive ml-auto"
                >
                  <Trash2 className="size-3" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit form sheet */}
      {editing && (
        <AddNoteForm
          stops={stops}
          note={note}
          open={editing}
          onOpenChange={setEditing}
          onSave={() => {
            setEditing(false);
            onMutate();
          }}
        />
      )}
    </>
  );
}
