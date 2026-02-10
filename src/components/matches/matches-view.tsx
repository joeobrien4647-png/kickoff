"use client";

import { useState, useMemo } from "react";
import { Trophy, Ticket, Search, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MatchCard } from "@/components/match-card";
import { MatchEditForm } from "@/components/matches/match-edit-form";
import { TICKET_STATUS, MATCH_PRIORITY, VENUES } from "@/lib/constants";
import { formatDate } from "@/lib/dates";
import { cn } from "@/lib/utils";
import type { Match, Stop, Traveler } from "@/lib/schema";

type ViewMode = "calendar" | "venue";
type PriorityFilter = "all" | "0" | "1" | "2" | "3";
type TicketFilter = "all" | "none" | "seeking" | "purchased" | "gave_up";

interface MatchesViewProps {
  matches: Match[];
  stops: Stop[];
  travelers: Traveler[];
  stats: {
    total: number;
    mustSee: number;
    purchased: number;
    seeking: number;
  };
}

export function MatchesView({
  matches,
  stops,
  travelers,
  stats,
}: MatchesViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [ticketFilter, setTicketFilter] = useState<TicketFilter>("all");
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  // Filter matches
  const filteredMatches = useMemo(() => {
    let result = matches;

    if (priorityFilter !== "all") {
      const p = Number(priorityFilter);
      result = result.filter((m) => m.priority === p);
    }

    if (ticketFilter !== "all") {
      result = result.filter((m) => m.ticketStatus === ticketFilter);
    }

    return result;
  }, [matches, priorityFilter, ticketFilter]);

  // Group by date (calendar view)
  const groupedByDate = useMemo(() => {
    const groups = new Map<string, Match[]>();
    const sorted = [...filteredMatches].sort((a, b) =>
      a.matchDate.localeCompare(b.matchDate)
    );

    for (const match of sorted) {
      const date = match.matchDate;
      if (!groups.has(date)) groups.set(date, []);
      groups.get(date)!.push(match);
    }

    return groups;
  }, [filteredMatches]);

  // Group by venue
  const groupedByVenue = useMemo(() => {
    const groups = new Map<string, Match[]>();
    const sorted = [...filteredMatches].sort((a, b) =>
      a.matchDate.localeCompare(b.matchDate)
    );

    for (const match of sorted) {
      const venue = match.venue;
      if (!groups.has(venue)) groups.set(venue, []);
      groups.get(venue)!.push(match);
    }

    return groups;
  }, [filteredMatches]);

  function handleMatchClick(match: Match) {
    setEditingMatch(match);
    setFormOpen(true);
  }

  return (
    <div className="space-y-4">
      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="py-3">
          <CardContent className="flex items-center gap-2.5 px-4">
            <Trophy className="size-4 text-wc-gold" />
            <div>
              <p className="text-lg font-bold leading-none">{stats.total}</p>
              <p className="text-[11px] text-muted-foreground">Matches</p>
            </div>
          </CardContent>
        </Card>
        <Card className="py-3">
          <CardContent className="flex items-center gap-2.5 px-4">
            <Star className="size-4 text-wc-gold" />
            <div>
              <p className="text-lg font-bold leading-none">{stats.mustSee}</p>
              <p className="text-[11px] text-muted-foreground">Must-See</p>
            </div>
          </CardContent>
        </Card>
        <Card className="py-3">
          <CardContent className="flex items-center gap-2.5 px-4">
            <Ticket className="size-4 text-emerald-400" />
            <div>
              <p className="text-lg font-bold leading-none text-emerald-400">
                {stats.purchased}
              </p>
              <p className="text-[11px] text-muted-foreground">Purchased</p>
            </div>
          </CardContent>
        </Card>
        <Card className="py-3">
          <CardContent className="flex items-center gap-2.5 px-4">
            <Search
              className={cn(
                "size-4 text-amber-400",
                stats.seeking > 0 && "animate-pulse"
              )}
            />
            <div>
              <p
                className={cn(
                  "text-lg font-bold leading-none",
                  stats.seeking > 0 ? "text-amber-400" : "text-muted-foreground"
                )}
              >
                {stats.seeking}
              </p>
              <p className="text-[11px] text-muted-foreground">Seeking</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View tabs */}
      <Tabs
        value={viewMode}
        onValueChange={(v) => setViewMode(v as ViewMode)}
      >
        <TabsList variant="line">
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="venue">Venue</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filter row */}
      <div className="flex items-center gap-2 flex-wrap">
        <Select
          value={priorityFilter}
          onValueChange={(v) => setPriorityFilter(v as PriorityFilter)}
        >
          <SelectTrigger className="h-8 text-xs w-[120px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            {MATCH_PRIORITY.map((p) => (
              <SelectItem key={p.value} value={String(p.value)}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={ticketFilter}
          onValueChange={(v) => setTicketFilter(v as TicketFilter)}
        >
          <SelectTrigger className="h-8 text-xs w-[140px]">
            <SelectValue placeholder="Ticket status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All tickets</SelectItem>
            {Object.entries(TICKET_STATUS).map(([key, meta]) => (
              <SelectItem key={key} value={key}>
                {meta.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Match list */}
      {filteredMatches.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">No matches found.</p>
          <p className="text-xs mt-1">Try adjusting the filters.</p>
        </div>
      ) : viewMode === "calendar" ? (
        <div className="space-y-6">
          {Array.from(groupedByDate.entries()).map(([date, dateMatches]) => (
            <section key={date} className="space-y-3">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {formatDate(date)}
              </h3>
              <div className="space-y-3">
                {dateMatches.map((match) => (
                  <div
                    key={match.id}
                    className="cursor-pointer"
                    onClick={() => handleMatchClick(match)}
                  >
                    <MatchCard match={match} compact />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {Array.from(groupedByVenue.entries()).map(
            ([venue, venueMatches]) => (
              <section key={venue} className="space-y-3">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {venue}
                </h3>
                <div className="space-y-3">
                  {venueMatches.map((match) => (
                    <div
                      key={match.id}
                      className="cursor-pointer"
                      onClick={() => handleMatchClick(match)}
                    >
                      <MatchCard match={match} compact />
                    </div>
                  ))}
                </div>
              </section>
            )
          )}
        </div>
      )}

      {/* Edit form sheet */}
      <MatchEditForm
        match={editingMatch}
        open={formOpen}
        onOpenChange={setFormOpen}
      />
    </div>
  );
}
