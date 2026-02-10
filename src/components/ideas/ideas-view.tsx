"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpDown, Filter } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { IDEA_CATEGORIES, IDEA_STATUS } from "@/lib/constants";
import { IdeaCard } from "@/components/ideas/idea-card";
import { PollCard } from "@/components/ideas/poll-card";
import { AddIdeaForm } from "@/components/ideas/add-idea-form";
import { AddPollForm } from "@/components/ideas/add-poll-form";
import type { Stop, Idea } from "@/lib/schema";

type SortKey = "votes" | "newest" | "category" | "status";
type StatusFilter = "all" | "idea" | "planned" | "done" | "skipped";
type CategoryFilter = string; // "all" or a category value

interface IdeasViewProps {
  stops: Stop[];
  ideas: Idea[];
  currentUser: string | null;
}

export function IdeasView({ stops, ideas, currentUser }: IdeasViewProps) {
  const router = useRouter();
  const [activeStop, setActiveStop] = useState("all");
  const [sortBy, setSortBy] = useState<SortKey>("votes");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Filter ideas by selected stop
  const stopFilteredIdeas = useMemo(() => {
    if (activeStop === "all") return ideas;
    return ideas.filter((i) => i.stopId === activeStop);
  }, [ideas, activeStop]);

  // Apply status + category filters
  const filteredIdeas = useMemo(() => {
    let result = stopFilteredIdeas;

    if (statusFilter !== "all") {
      result = result.filter((i) => i.status === statusFilter);
    }
    if (categoryFilter !== "all") {
      result = result.filter((i) => i.category === categoryFilter);
    }

    return result;
  }, [stopFilteredIdeas, statusFilter, categoryFilter]);

  // Sort
  const sortedIdeas = useMemo(() => {
    const sorted = [...filteredIdeas];
    switch (sortBy) {
      case "votes":
        sorted.sort((a, b) => {
          const aVotes = JSON.parse(a.votes || "[]").length;
          const bVotes = JSON.parse(b.votes || "[]").length;
          return bVotes - aVotes;
        });
        break;
      case "newest":
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "category":
        sorted.sort((a, b) => a.category.localeCompare(b.category));
        break;
      case "status": {
        const order = { idea: 0, planned: 1, done: 2, skipped: 3 };
        sorted.sort(
          (a, b) =>
            (order[a.status as keyof typeof order] ?? 4) -
            (order[b.status as keyof typeof order] ?? 4)
        );
        break;
      }
    }
    return sorted;
  }, [filteredIdeas, sortBy]);

  // Group by category for display
  const groupedByCategory = useMemo(() => {
    const groups = new Map<string, Idea[]>();
    for (const idea of sortedIdeas) {
      const cat = idea.category;
      if (!groups.has(cat)) groups.set(cat, []);
      groups.get(cat)!.push(idea);
    }
    return groups;
  }, [sortedIdeas]);

  // Count ideas per stop
  const countsPerStop = useMemo(() => {
    const map = new Map<string, number>();
    for (const idea of ideas) {
      map.set(idea.stopId, (map.get(idea.stopId) || 0) + 1);
    }
    return map;
  }, [ideas]);

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
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {ideas.length}
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
          </TabsList>
        </Tabs>
      </div>

      {/* Filter/Sort bar */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className={cn(showFilters && "border-wc-teal text-wc-teal")}
        >
          <Filter className="size-3.5" />
          Filter
        </Button>
        <div className="flex items-center gap-1.5 ml-auto">
          <ArrowUpDown className="size-3.5 text-muted-foreground" />
          <Select
            value={sortBy}
            onValueChange={(v) => setSortBy(v as SortKey)}
          >
            <SelectTrigger className="h-8 text-xs w-[110px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="votes">Most voted</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="category">Category</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filter dropdowns */}
      {showFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <Select
            value={categoryFilter}
            onValueChange={(v) => setCategoryFilter(v)}
          >
            <SelectTrigger className="h-8 text-xs w-[130px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {IDEA_CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as StatusFilter)}
          >
            <SelectTrigger className="h-8 text-xs w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {Object.entries(IDEA_STATUS).map(([key, meta]) => (
                <SelectItem key={key} value={key}>
                  {meta.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(categoryFilter !== "all" || statusFilter !== "all") && (
            <Button
              variant="ghost"
              size="xs"
              onClick={() => {
                setCategoryFilter("all");
                setStatusFilter("all");
              }}
              className="text-muted-foreground"
            >
              Clear
            </Button>
          )}
        </div>
      )}

      {/* Ideas list */}
      {sortedIdeas.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">No ideas yet.</p>
          <p className="text-xs mt-1">
            Tap the + button to suggest something.
          </p>
        </div>
      ) : sortBy === "category" ? (
        // Grouped by category view
        <div className="space-y-6">
          {Array.from(groupedByCategory.entries()).map(([cat, catIdeas]) => {
            const catMeta = IDEA_CATEGORIES.find((c) => c.value === cat);
            return (
              <section key={cat} className="space-y-2">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  {catMeta?.label || cat}
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    {catIdeas.length}
                  </Badge>
                </h3>
                <div className="space-y-2">
                  {catIdeas.map((idea) =>
                    idea.type === "poll" ? (
                      <PollCard
                        key={idea.id}
                        idea={idea}
                        currentUser={currentUser}
                        onMutate={handleMutate}
                      />
                    ) : (
                      <IdeaCard
                        key={idea.id}
                        idea={idea}
                        currentUser={currentUser}
                        onMutate={handleMutate}
                      />
                    )
                  )}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        // Flat list view
        <div className="space-y-2">
          {sortedIdeas.map((idea) =>
            idea.type === "poll" ? (
              <PollCard
                key={idea.id}
                idea={idea}
                currentUser={currentUser}
                onMutate={handleMutate}
              />
            ) : (
              <IdeaCard
                key={idea.id}
                idea={idea}
                currentUser={currentUser}
                onMutate={handleMutate}
              />
            )
          )}
        </div>
      )}

      {/* Floating action buttons */}
      <AddPollForm
        stops={stops}
        defaultStopId={activeStop !== "all" ? activeStop : undefined}
      />
      <AddIdeaForm
        stops={stops}
        defaultStopId={activeStop !== "all" ? activeStop : undefined}
      />
    </div>
  );
}
