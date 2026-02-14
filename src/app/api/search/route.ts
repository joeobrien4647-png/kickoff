import { db } from "@/lib/db";
import {
  matches,
  ideas,
  notes,
  accommodations,
  itineraryItems,
  expenses,
  logistics,
  stops,
} from "@/lib/schema";
import { like, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// City-to-slug mapping for guide links
// ---------------------------------------------------------------------------

const CITY_TO_SLUG: Record<string, string> = {
  Boston: "boston",
  "New York": "nyc",
  Philadelphia: "philadelphia",
  "Washington DC": "washington-dc",
  Atlanta: "atlanta",
  Nashville: "nashville",
  Miami: "miami",
};

function citySlug(city: string): string {
  return CITY_TO_SLUG[city] ?? city.toLowerCase().replace(/\s+/g, "-");
}

// ---------------------------------------------------------------------------
// Result shape
// ---------------------------------------------------------------------------

interface SearchResult {
  type: string;
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

// ---------------------------------------------------------------------------
// GET /api/search?q=searchterm
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get("q")?.trim();

    if (!q) {
      return NextResponse.json({ results: [] });
    }

    const term = `%${q}%`;
    const results: SearchResult[] = [];

    // --- Matches ---
    const matchRows = db
      .select()
      .from(matches)
      .where(
        or(
          like(matches.homeTeam, term),
          like(matches.awayTeam, term),
          like(matches.venue, term),
          like(matches.city, term),
        ),
      )
      .all();

    for (const m of matchRows) {
      results.push({
        type: "match",
        id: m.id,
        title: `${m.homeTeam} vs ${m.awayTeam}`,
        subtitle: `${m.venue}, ${m.city}`,
        href: "/matches",
      });
    }

    // --- Ideas ---
    const ideaRows = db
      .select()
      .from(ideas)
      .where(
        or(
          like(ideas.title, term),
          like(ideas.description, term),
          like(ideas.address, term),
        ),
      )
      .all();

    for (const i of ideaRows) {
      results.push({
        type: "idea",
        id: i.id,
        title: i.title,
        subtitle: i.description ?? "Idea",
        href: "/ideas",
      });
    }

    // --- Notes ---
    const noteRows = db
      .select()
      .from(notes)
      .where(
        or(
          like(notes.title, term),
          like(notes.content, term),
        ),
      )
      .all();

    for (const n of noteRows) {
      results.push({
        type: "note",
        id: n.id,
        title: n.title ?? "Untitled Note",
        subtitle: n.content.slice(0, 80),
        href: "/notes",
      });
    }

    // --- Accommodations ---
    const accomRows = db
      .select()
      .from(accommodations)
      .where(
        or(
          like(accommodations.name, term),
          like(accommodations.address, term),
        ),
      )
      .all();

    for (const a of accomRows) {
      results.push({
        type: "accommodation",
        id: a.id,
        title: a.name,
        subtitle: a.address ?? a.type,
        href: "/accommodations",
      });
    }

    // --- Itinerary Items ---
    const itineraryRows = db
      .select()
      .from(itineraryItems)
      .where(
        or(
          like(itineraryItems.title, term),
          like(itineraryItems.location, term),
        ),
      )
      .all();

    for (const it of itineraryRows) {
      results.push({
        type: "itinerary",
        id: it.id,
        title: it.title,
        subtitle: it.location ?? it.date,
        href: "/itinerary",
      });
    }

    // --- Expenses ---
    const expenseRows = db
      .select()
      .from(expenses)
      .where(like(expenses.description, term))
      .all();

    for (const e of expenseRows) {
      results.push({
        type: "expense",
        id: e.id,
        title: e.description,
        subtitle: `$${e.amount.toFixed(2)} - ${e.category}`,
        href: "/budget",
      });
    }

    // --- Logistics (Checklist) ---
    const logisticsRows = db
      .select()
      .from(logistics)
      .where(like(logistics.title, term))
      .all();

    for (const l of logisticsRows) {
      results.push({
        type: "checklist",
        id: l.id,
        title: l.title,
        subtitle: l.category,
        href: "/checklist",
      });
    }

    // --- Stops (Cities) ---
    const stopRows = db
      .select()
      .from(stops)
      .where(
        or(
          like(stops.city, term),
          like(stops.name, term),
        ),
      )
      .all();

    for (const s of stopRows) {
      results.push({
        type: "stop",
        id: s.id,
        title: s.name,
        subtitle: `${s.city}, ${s.state}`,
        href: `/guide/${citySlug(s.city)}`,
      });
    }

    // Cap at 20 results
    return NextResponse.json({ results: results.slice(0, 20) });
  } catch (error) {
    console.error("[API] GET /api/search error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 },
    );
  }
}
