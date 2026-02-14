import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { matches } from "@/lib/schema";

// Free football API options for WC 2026:
// 1. api-football.com (free tier: 100 req/day)
// 2. football-data.org (free tier, limited)
// 3. Manual updates via the app's own PATCH endpoint

export async function GET() {
  try {
    const allMatches = db.select().from(matches).all();

    const scores = allMatches
      .filter((m) => m.actualHomeScore !== null)
      .map((m) => ({
        id: m.id,
        homeTeam: m.homeTeam,
        awayTeam: m.awayTeam,
        homeScore: m.actualHomeScore,
        awayScore: m.actualAwayScore,
        matchDate: m.matchDate,
        kickoff: m.kickoff,
        status: getMatchStatus(m.matchDate, m.kickoff),
      }));

    return NextResponse.json({ scores });
  } catch (error) {
    console.error("[API] GET /api/scores error:", error);
    return NextResponse.json(
      { error: "Failed to fetch scores" },
      { status: 500 }
    );
  }
}

function getMatchStatus(
  matchDate: string,
  kickoff: string | null
): "upcoming" | "live" | "finished" {
  const now = new Date();
  const matchStart = new Date(`${matchDate}T${kickoff || "00:00"}:00`);
  const matchEnd = new Date(matchStart.getTime() + 2 * 60 * 60 * 1000); // +2 hours

  if (now < matchStart) return "upcoming";
  if (now >= matchStart && now <= matchEnd) return "live";
  return "finished";
}
