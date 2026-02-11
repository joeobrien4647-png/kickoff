"use client";

import { useState, useMemo, useCallback } from "react";
import { Music, Headphones, Shuffle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Song data
// ---------------------------------------------------------------------------

interface Song {
  title: string;
  artist: string;
  category: Category;
}

type Category =
  | "Pre-Game Anthems"
  | "Road Trip Classics"
  | "Football Anthems"
  | "City Vibes"
  | "Late Night";

const SONGS: Song[] = [
  // Pre-Game Anthems
  { title: "Seven Nation Army", artist: "The White Stripes", category: "Pre-Game Anthems" },
  { title: "Kernkraft 400", artist: "Zombie Nation", category: "Pre-Game Anthems" },
  { title: "Freed from Desire", artist: "GALA", category: "Pre-Game Anthems" },
  { title: "Song 2", artist: "Blur", category: "Pre-Game Anthems" },
  { title: "Jump Around", artist: "House of Pain", category: "Pre-Game Anthems" },
  { title: "Levels", artist: "Avicii", category: "Pre-Game Anthems" },

  // Road Trip Classics
  { title: "Don't Stop Believin'", artist: "Journey", category: "Road Trip Classics" },
  { title: "Mr. Brightside", artist: "The Killers", category: "Road Trip Classics" },
  { title: "Livin' on a Prayer", artist: "Bon Jovi", category: "Road Trip Classics" },
  { title: "Country Roads", artist: "John Denver", category: "Road Trip Classics" },
  { title: "Born to Run", artist: "Bruce Springsteen", category: "Road Trip Classics" },
  { title: "Life Is a Highway", artist: "Tom Cochrane", category: "Road Trip Classics" },
  { title: "Sweet Home Alabama", artist: "Lynyrd Skynyrd", category: "Road Trip Classics" },
  { title: "Come On Eileen", artist: "Dexys Midnight Runners", category: "Road Trip Classics" },

  // Football Anthems
  { title: "Three Lions (Football's Coming Home)", artist: "Lightning Seeds", category: "Football Anthems" },
  { title: "Vindaloo", artist: "Fat Les", category: "Football Anthems" },
  { title: "World in Motion", artist: "New Order", category: "Football Anthems" },
  { title: "Tubthumping", artist: "Chumbawamba", category: "Football Anthems" },
  { title: "Wonderwall", artist: "Oasis", category: "Football Anthems" },
  { title: "Sweet Caroline", artist: "Neil Diamond", category: "Football Anthems" },
  { title: "Hey Jude", artist: "The Beatles", category: "Football Anthems" },

  // City Vibes
  { title: "Empire State of Mind", artist: "Jay-Z ft. Alicia Keys", category: "City Vibes" },
  { title: "No Sleep Till Brooklyn", artist: "Beastie Boys", category: "City Vibes" },
  { title: "Welcome to Miami", artist: "Will Smith", category: "City Vibes" },
  { title: "Shipping Up to Boston", artist: "Dropkick Murphys", category: "City Vibes" },
  { title: "Georgia on My Mind", artist: "Ray Charles", category: "City Vibes" },
  { title: "New York, New York", artist: "Frank Sinatra", category: "City Vibes" },

  // Late Night
  { title: "Don't Stop Me Now", artist: "Queen", category: "Late Night" },
  { title: "Dancing Queen", artist: "ABBA", category: "Late Night" },
  { title: "September", artist: "Earth, Wind & Fire", category: "Late Night" },
  { title: "Shut Up and Dance", artist: "Walk the Moon", category: "Late Night" },
  { title: "Mr. Blue Sky", artist: "Electric Light Orchestra", category: "Late Night" },
  { title: "Crazy in Love", artist: "Beyonce", category: "Late Night" },
];

// ---------------------------------------------------------------------------
// Category styling
// ---------------------------------------------------------------------------

const CATEGORY_META: Record<
  Category,
  { icon: string; gradient: string; accent: string; badgeClass: string }
> = {
  "Pre-Game Anthems": {
    icon: "\u26BD",
    gradient: "from-wc-coral/10 to-wc-coral/5",
    accent: "border-l-wc-coral",
    badgeClass: "bg-wc-coral/15 text-wc-coral",
  },
  "Road Trip Classics": {
    icon: "\uD83D\uDE97",
    gradient: "from-wc-teal/10 to-wc-teal/5",
    accent: "border-l-wc-teal",
    badgeClass: "bg-wc-teal/15 text-wc-teal",
  },
  "Football Anthems": {
    icon: "\uD83C\uDFF4\u200D\u2620\uFE0F",
    gradient: "from-wc-blue/10 to-wc-blue/5",
    accent: "border-l-wc-blue",
    badgeClass: "bg-wc-blue/15 text-wc-blue",
  },
  "City Vibes": {
    icon: "\uD83C\uDFD9\uFE0F",
    gradient: "from-wc-gold/10 to-wc-gold/5",
    accent: "border-l-wc-gold",
    badgeClass: "bg-wc-gold/15 text-wc-gold",
  },
  "Late Night": {
    icon: "\uD83C\uDF1F",
    gradient: "from-purple-500/10 to-purple-500/5",
    accent: "border-l-purple-500",
    badgeClass: "bg-purple-500/15 text-purple-600",
  },
};

const CATEGORIES: Category[] = [
  "Pre-Game Anthems",
  "Road Trip Classics",
  "Football Anthems",
  "City Vibes",
  "Late Night",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function spotifySearchUrl(title: string, artist: string) {
  return `https://open.spotify.com/search/${encodeURIComponent(title + " " + artist)}`;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PlaylistView() {
  const [shuffled, setShuffled] = useState(false);
  const [shuffledSongs, setShuffledSongs] = useState<Song[]>([]);

  const handleShuffle = useCallback(() => {
    setShuffledSongs(shuffleArray(SONGS));
    setShuffled(true);
  }, []);

  const handleReset = useCallback(() => {
    setShuffled(false);
    setShuffledSongs([]);
  }, []);

  // Group songs by category
  const grouped = useMemo(() => {
    const map = new Map<Category, Song[]>();
    for (const cat of CATEGORIES) {
      map.set(cat, SONGS.filter((s) => s.category === cat));
    }
    return map;
  }, []);

  return (
    <div className="space-y-6">
      {/* Action bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={shuffled ? handleReset : handleShuffle}
          className="gap-1.5"
        >
          <Shuffle className="size-3.5" />
          {shuffled ? "Back to Categories" : "Shuffle All"}
        </Button>
        <Button variant="outline" size="sm" asChild className="gap-1.5">
          <a
            href="https://open.spotify.com/search/world%20cup%202026%20road%20trip"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Headphones className="size-3.5" />
            Open in Spotify
          </a>
        </Button>
        <Badge variant="secondary" className="ml-auto">
          <Music className="size-3" />
          {SONGS.length} songs
        </Badge>
      </div>

      {/* Shuffled flat list */}
      {shuffled ? (
        <div className="space-y-1.5">
          {shuffledSongs.map((song, i) => (
            <SongRow key={`${song.title}-${i}`} song={song} index={i + 1} showCategory />
          ))}
        </div>
      ) : (
        /* Category sections */
        <div className="space-y-8">
          {CATEGORIES.map((cat) => {
            const meta = CATEGORY_META[cat];
            const songs = grouped.get(cat) ?? [];

            return (
              <section key={cat}>
                {/* Category header */}
                <div
                  className={cn(
                    "flex items-center gap-3 mb-3 pb-2 border-b border-border/50"
                  )}
                >
                  <span className="text-xl" role="img" aria-label={cat}>
                    {meta.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-semibold">{cat}</h2>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px]", meta.badgeClass)}>
                    {songs.length}
                  </Badge>
                </div>

                {/* Song list */}
                <div className="space-y-1">
                  {songs.map((song, i) => (
                    <SongRow key={song.title} song={song} index={i + 1} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Song Row
// ---------------------------------------------------------------------------

function SongRow({
  song,
  index,
  showCategory = false,
}: {
  song: Song;
  index: number;
  showCategory?: boolean;
}) {
  const meta = CATEGORY_META[song.category];

  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2.5",
        "border-l-2 transition-colors hover:bg-accent/50",
        meta.accent
      )}
    >
      {/* Track number */}
      <span className="w-5 text-right text-xs tabular-nums text-muted-foreground shrink-0">
        {index}
      </span>

      {/* Song info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{song.title}</p>
        <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
      </div>

      {/* Category badge (shuffled mode) */}
      {showCategory && (
        <Badge
          variant="outline"
          className={cn("text-[10px] hidden sm:inline-flex", meta.badgeClass)}
        >
          {song.category}
        </Badge>
      )}

      {/* Spotify link */}
      <a
        href={spotifySearchUrl(song.title, song.artist)}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "shrink-0 rounded-md p-1.5 text-muted-foreground",
          "opacity-0 group-hover:opacity-100 transition-opacity",
          "hover:text-[#1DB954] hover:bg-[#1DB954]/10"
        )}
        aria-label={`Search ${song.title} on Spotify`}
      >
        <ExternalLink className="size-3.5" />
      </a>
    </div>
  );
}
