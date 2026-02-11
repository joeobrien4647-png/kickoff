"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpDown, Search, Pin, StickyNote } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NoteCard } from "@/components/notes/note-card";
import { AddNoteForm } from "@/components/notes/add-note-form";
import type { Stop, Note } from "@/lib/schema";

type SortKey = "newest" | "pinned";

interface NotesViewProps {
  stops: Stop[];
  notes: Note[];
  currentUser: string | null;
}

export function NotesView({ stops, notes, currentUser }: NotesViewProps) {
  const router = useRouter();
  const [activeStop, setActiveStop] = useState("all");
  const [sortBy, setSortBy] = useState<SortKey>("newest");
  const [search, setSearch] = useState("");

  // Count notes per stop (including "general" for null stopId)
  const countsPerStop = useMemo(() => {
    const map = new Map<string, number>();
    let generalCount = 0;
    for (const note of notes) {
      if (note.stopId) {
        map.set(note.stopId, (map.get(note.stopId) || 0) + 1);
      } else {
        generalCount++;
      }
    }
    map.set("general", generalCount);
    return map;
  }, [notes]);

  // Filter by stop tab
  const stopFiltered = useMemo(() => {
    if (activeStop === "all") return notes;
    if (activeStop === "general") return notes.filter((n) => !n.stopId);
    return notes.filter((n) => n.stopId === activeStop);
  }, [notes, activeStop]);

  // Search filter (title + content)
  const searchFiltered = useMemo(() => {
    if (!search.trim()) return stopFiltered;
    const q = search.toLowerCase();
    return stopFiltered.filter(
      (n) =>
        (n.title?.toLowerCase().includes(q)) ||
        n.content.toLowerCase().includes(q)
    );
  }, [stopFiltered, search]);

  // Sort
  const sortedNotes = useMemo(() => {
    const sorted = [...searchFiltered];
    switch (sortBy) {
      case "newest":
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "pinned":
        sorted.sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
        break;
    }
    return sorted;
  }, [searchFiltered, sortBy]);

  // Stats
  const pinnedCount = notes.filter((n) => n.pinned).length;

  function handleMutate() {
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {/* Stop tabs */}
      <div className="overflow-x-auto -mx-4 px-4 scrollbar-none">
        <Tabs value={activeStop} onValueChange={setActiveStop}>
          <TabsList variant="line" className="w-full justify-start">
            <TabsTrigger value="all">
              All
              <Badge
                variant="secondary"
                className="ml-1 text-[10px] px-1.5 py-0"
              >
                {notes.length}
              </Badge>
            </TabsTrigger>
            {stops.map((stop) => (
              <TabsTrigger key={stop.id} value={stop.id}>
                {stop.city}
                {(countsPerStop.get(stop.id) || 0) > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 text-[10px] px-1.5 py-0"
                  >
                    {countsPerStop.get(stop.id)}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
            <TabsTrigger value="general">
              General
              {(countsPerStop.get("general") || 0) > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 text-[10px] px-1.5 py-0"
                >
                  {countsPerStop.get("general")}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Search + Sort bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes..."
            className="h-8 text-xs pl-8"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="size-3.5 text-muted-foreground" />
          <Select
            value={sortBy}
            onValueChange={(v) => setSortBy(v as SortKey)}
          >
            <SelectTrigger className="h-8 text-xs w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="pinned">Pinned first</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <StickyNote className="size-3" />
          {notes.length} {notes.length === 1 ? "note" : "notes"}
        </span>
        {pinnedCount > 0 && (
          <span className="flex items-center gap-1">
            <Pin className="size-3 fill-wc-gold text-wc-gold" />
            {pinnedCount} pinned
          </span>
        )}
      </div>

      {/* Notes list */}
      {sortedNotes.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">No notes yet.</p>
          <p className="text-xs mt-1">
            Tap the + button to add a note.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              stops={stops}
              currentUser={currentUser}
              onMutate={handleMutate}
            />
          ))}
        </div>
      )}

      {/* Floating add button */}
      <AddNoteForm
        stops={stops}
        defaultStopId={
          activeStop !== "all" && activeStop !== "general"
            ? activeStop
            : undefined
        }
      />
    </div>
  );
}
