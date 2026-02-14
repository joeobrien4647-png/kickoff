"use client";

import { useState } from "react";
import {
  Music,
  Play,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Disc3,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LegPlaylist } from "@/lib/road-trip-playlists";

// ── Accent colors per leg — drawn from the WC theme palette ──────
const LEG_ACCENT = [
  {
    color: "text-wc-teal",
    bg: "bg-wc-teal/10",
    border: "border-wc-teal/30",
    badge: "bg-wc-teal/15 text-wc-teal",
    ring: "ring-wc-teal/20",
  },
  {
    color: "text-wc-blue",
    bg: "bg-wc-blue/10",
    border: "border-wc-blue/30",
    badge: "bg-wc-blue/15 text-wc-blue",
    ring: "ring-wc-blue/20",
  },
  {
    color: "text-wc-coral",
    bg: "bg-wc-coral/10",
    border: "border-wc-coral/30",
    badge: "bg-wc-coral/15 text-wc-coral",
    ring: "ring-wc-coral/20",
  },
  {
    color: "text-wc-gold",
    bg: "bg-wc-gold/10",
    border: "border-wc-gold/30",
    badge: "bg-wc-gold/15 text-wc-gold",
    ring: "ring-wc-gold/20",
  },
  {
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/30",
    badge: "bg-emerald-400/15 text-emerald-400",
    ring: "ring-emerald-400/20",
  },
] as const;

// ── Playlist Card ────────────────────────────────────────────────

function PlaylistCard({
  playlist,
  index,
}: {
  playlist: LegPlaylist;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const accent = LEG_ACCENT[index % LEG_ACCENT.length];

  return (
    <Card
      className={cn(
        "py-4 transition-all hover:bg-accent/30",
        expanded && "ring-1",
        expanded && accent.ring,
      )}
    >
      <CardContent className="space-y-3">
        {/* ── Header row ── */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-start gap-3 text-left"
        >
          {/* Icon */}
          <div
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-full",
              accent.bg,
              accent.color,
            )}
          >
            {expanded ? (
              <Disc3 className="size-4 animate-spin [animation-duration:3s]" />
            ) : (
              <Play className="size-4" />
            )}
          </div>

          {/* Leg name + vibe */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold leading-tight">
              {playlist.leg}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 italic line-clamp-1">
              {playlist.vibe}
            </p>
          </div>

          {/* Track count + chevron */}
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="ghost" className={cn("text-[10px]", accent.badge)}>
              <Music className="size-2.5" />
              {playlist.tracks.length} tracks
            </Badge>
            {expanded ? (
              <ChevronUp className="size-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="size-4 text-muted-foreground" />
            )}
          </div>
        </button>

        {/* ── Expanded track list ── */}
        {expanded && (
          <div className="animate-in fade-in-0 slide-in-from-top-1 duration-200 space-y-3">
            {/* Spotify link */}
            <Button
              variant="outline"
              size="xs"
              className={cn("gap-1.5", accent.color)}
              asChild
            >
              <a
                href={playlist.spotifySearchUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="size-3" />
                Open in Spotify
              </a>
            </Button>

            {/* Track list */}
            <ol className="space-y-2">
              {playlist.tracks.map((track, i) => (
                <li key={`${track.title}-${track.artist}`} className="flex gap-2.5">
                  {/* Track number */}
                  <span
                    className={cn(
                      "text-[11px] font-mono tabular-nums w-5 shrink-0 text-right pt-0.5",
                      accent.color,
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Track info */}
                  <div className="min-w-0">
                    <p className="text-xs font-medium leading-tight">
                      {track.title}
                      <span className="text-muted-foreground font-normal">
                        {" "}
                        &mdash; {track.artist}
                      </span>
                    </p>
                    <p className="text-[11px] text-muted-foreground/70 leading-relaxed mt-0.5">
                      {track.whyItFits}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Main Component ───────────────────────────────────────────────

interface RoadTripPlaylistsProps {
  playlists: LegPlaylist[];
}

export function RoadTripPlaylists({ playlists }: RoadTripPlaylistsProps) {
  return (
    <section className="space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-wc-coral/20 text-wc-coral">
          <Music className="size-4" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Road Trip Soundtrack</h2>
          <p className="text-xs text-muted-foreground">
            {playlists.length} playlists &middot;{" "}
            {playlists.reduce((sum, p) => sum + p.tracks.length, 0)} tracks
            across the whole route
          </p>
        </div>
      </div>

      {/* Playlist cards */}
      <div className="grid grid-cols-1 gap-3">
        {playlists.map((playlist, i) => (
          <PlaylistCard key={playlist.leg} playlist={playlist} index={i} />
        ))}
      </div>

      {/* Footer */}
      <p className="text-center text-[11px] text-muted-foreground/60 italic pt-1">
        Created by 3 lads who definitely won&apos;t be singing in the car 🎤
      </p>
    </section>
  );
}
