"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Pencil, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { MatchReview } from "@/lib/schema";

// ── Props ────────────────────────────────────────────────────────────
interface MatchReviewCardProps {
  matchId: string;
  review: MatchReview | null;
  homeTeam: string;
  awayTeam: string;
}

// ── Component ────────────────────────────────────────────────────────
export function MatchReviewCard({
  matchId,
  review,
  homeTeam,
  awayTeam,
}: MatchReviewCardProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(!review);
  const [saving, setSaving] = useState(false);

  // Form state
  const [atmosphere, setAtmosphere] = useState(review?.atmosphere ?? 0);
  const [highlights, setHighlights] = useState(review?.highlights ?? "");
  const [scorersText, setScorersText] = useState(
    review?.scorers ? (JSON.parse(review.scorers) as string[]).join(", ") : ""
  );
  const [mvp, setMvp] = useState(review?.mvp ?? "");

  async function handleSave() {
    setSaving(true);
    try {
      const scorers = scorersText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        matchId,
        atmosphere: atmosphere || null,
        highlights: highlights || null,
        scorers: scorers.length > 0 ? scorers : null,
        mvp: mvp || null,
      };

      const url = review
        ? `/api/match-reviews/${review.id}`
        : "/api/match-reviews";
      const method = review ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save review");
      }

      toast.success(review ? "Review updated" : "Review saved");
      setEditing(false);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save review");
    } finally {
      setSaving(false);
    }
  }

  // ── Read mode ────────────────────────────────────────────────────────
  if (!editing && review) {
    const parsedScorers: string[] = review.scorers
      ? JSON.parse(review.scorers)
      : [];

    return (
      <Card className="py-3">
        <CardContent className="px-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Match Review
            </p>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setEditing(true)}
            >
              <Pencil className="size-3" />
            </Button>
          </div>

          {/* Atmosphere stars */}
          {review.atmosphere && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground mr-1">Atmosphere</span>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "size-3.5",
                    i < review.atmosphere!
                      ? "fill-wc-gold text-wc-gold"
                      : "text-muted-foreground/30"
                  )}
                />
              ))}
            </div>
          )}

          {/* Highlights */}
          {review.highlights && (
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Highlights</p>
              <p className="text-sm leading-relaxed">{review.highlights}</p>
            </div>
          )}

          {/* Scorers */}
          {parsedScorers.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Scorers</p>
              <p className="text-sm">{parsedScorers.join(", ")}</p>
            </div>
          )}

          {/* MVP */}
          {review.mvp && (
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">MVP</p>
              <p className="text-sm font-medium">{review.mvp}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // ── Edit mode ────────────────────────────────────────────────────────
  return (
    <Card className="py-3">
      <CardContent className="px-4 space-y-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {review ? "Edit Review" : "Add Review"} &mdash; {homeTeam} vs {awayTeam}
        </p>

        {/* Atmosphere rating */}
        <div>
          <label className="text-xs text-muted-foreground">Atmosphere</label>
          <div className="flex items-center gap-1 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setAtmosphere(i + 1)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={cn(
                    "size-5",
                    i < atmosphere
                      ? "fill-wc-gold text-wc-gold"
                      : "text-muted-foreground/30 hover:text-wc-gold/50"
                  )}
                />
              </button>
            ))}
            {atmosphere > 0 && (
              <button
                type="button"
                onClick={() => setAtmosphere(0)}
                className="ml-1 text-[10px] text-muted-foreground hover:text-foreground"
              >
                clear
              </button>
            )}
          </div>
        </div>

        {/* Highlights */}
        <div>
          <label className="text-xs text-muted-foreground">Highlights</label>
          <Textarea
            value={highlights}
            onChange={(e) => setHighlights(e.target.value)}
            placeholder="Best moments from the match..."
            className="mt-1 min-h-12 text-sm"
          />
        </div>

        {/* Scorers */}
        <div>
          <label className="text-xs text-muted-foreground">
            Scorers (comma-separated)
          </label>
          <Input
            value={scorersText}
            onChange={(e) => setScorersText(e.target.value)}
            placeholder="Mbappe, Kane, Salah"
            className="mt-1 text-sm"
          />
        </div>

        {/* MVP */}
        <div>
          <label className="text-xs text-muted-foreground">MVP</label>
          <Input
            value={mvp}
            onChange={(e) => setMvp(e.target.value)}
            placeholder="Best player of the match"
            className="mt-1 text-sm"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Save className="size-3.5" />
            )}
            {saving ? "Saving..." : "Save Review"}
          </Button>
          {review && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setAtmosphere(review.atmosphere ?? 0);
                setHighlights(review.highlights ?? "");
                setScorersText(
                  review.scorers
                    ? (JSON.parse(review.scorers) as string[]).join(", ")
                    : ""
                );
                setMvp(review.mvp ?? "");
                setEditing(false);
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
