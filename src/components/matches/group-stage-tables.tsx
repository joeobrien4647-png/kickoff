"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { countryFlag } from "@/lib/constants";
import type { Match } from "@/lib/schema";

// ── Types ────────────────────────────────────────────────────────────
interface TeamStanding {
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

interface GroupStageTablesProps {
  matches: Match[];
}

// ── Standings computation ────────────────────────────────────────────
function computeGroupStandings(
  groupMatches: Match[]
): TeamStanding[] {
  const standings = new Map<string, TeamStanding>();

  function getOrCreate(team: string): TeamStanding {
    if (!standings.has(team)) {
      standings.set(team, {
        team,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
      });
    }
    return standings.get(team)!;
  }

  for (const match of groupMatches) {
    // Only count matches with actual scores entered
    if (match.actualHomeScore === null || match.actualAwayScore === null) {
      // Still register the teams so they appear in the table
      getOrCreate(match.homeTeam);
      getOrCreate(match.awayTeam);
      continue;
    }

    const home = getOrCreate(match.homeTeam);
    const away = getOrCreate(match.awayTeam);

    const hg = match.actualHomeScore;
    const ag = match.actualAwayScore;

    home.played++;
    away.played++;

    home.goalsFor += hg;
    home.goalsAgainst += ag;
    away.goalsFor += ag;
    away.goalsAgainst += hg;

    if (hg > ag) {
      home.won++;
      home.points += 3;
      away.lost++;
    } else if (hg < ag) {
      away.won++;
      away.points += 3;
      home.lost++;
    } else {
      home.drawn++;
      away.drawn++;
      home.points += 1;
      away.points += 1;
    }
  }

  // Recalculate GD
  for (const s of standings.values()) {
    s.goalDifference = s.goalsFor - s.goalsAgainst;
  }

  // Sort: points desc, GD desc, GF desc, team name asc
  return Array.from(standings.values()).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference)
      return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.team.localeCompare(b.team);
  });
}

// ── Component ────────────────────────────────────────────────────────
export function GroupStageTables({ matches }: GroupStageTablesProps) {
  const groups = useMemo(() => {
    // Group matches by groupName, skip non-group matches
    const groupMap = new Map<string, Match[]>();

    for (const match of matches) {
      if (!match.groupName) continue;
      if (!groupMap.has(match.groupName)) {
        groupMap.set(match.groupName, []);
      }
      groupMap.get(match.groupName)!.push(match);
    }

    // Build standings per group, only include groups with at least 1 result
    const result: { name: string; standings: TeamStanding[] }[] = [];

    for (const [name, groupMatches] of groupMap.entries()) {
      const hasResult = groupMatches.some(
        (m) => m.actualHomeScore !== null && m.actualAwayScore !== null
      );
      if (!hasResult) continue;

      result.push({
        name,
        standings: computeGroupStandings(groupMatches),
      });
    }

    // Sort groups alphabetically
    result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [matches]);

  if (groups.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-sm">No group results yet.</p>
        <p className="text-xs mt-1">Standings will appear once scores are entered.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {groups.map(({ name, standings }) => (
        <Card key={name} className="py-3 gap-3">
          <CardHeader className="px-4 py-0">
            <CardTitle className="text-sm">{name}</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left pl-4 pr-2 py-1.5 font-medium">#</th>
                  <th className="text-left pr-2 py-1.5 font-medium">Team</th>
                  <th className="text-center px-1 py-1.5 font-medium">P</th>
                  <th className="text-center px-1 py-1.5 font-medium">W</th>
                  <th className="text-center px-1 py-1.5 font-medium">D</th>
                  <th className="text-center px-1 py-1.5 font-medium">L</th>
                  <th className="text-center px-1 py-1.5 font-medium">GF</th>
                  <th className="text-center px-1 py-1.5 font-medium">GA</th>
                  <th className="text-center px-1 py-1.5 font-medium">GD</th>
                  <th className="text-center px-1 pr-4 py-1.5 font-medium">Pts</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((row, idx) => {
                  const qualifies = idx < 2;
                  return (
                    <tr
                      key={row.team}
                      className={cn(
                        "border-b border-border/50 last:border-0 transition-colors",
                        qualifies && "bg-emerald-500/5"
                      )}
                    >
                      <td
                        className={cn(
                          "pl-4 pr-2 py-1.5 tabular-nums",
                          qualifies && "text-emerald-400 font-semibold"
                        )}
                      >
                        {idx + 1}
                      </td>
                      <td className="pr-2 py-1.5">
                        <span className="flex items-center gap-1.5">
                          <span className="text-sm leading-none">
                            {countryFlag(row.team)}
                          </span>
                          <span
                            className={cn(
                              "font-medium truncate",
                              qualifies && "text-foreground"
                            )}
                          >
                            {row.team}
                          </span>
                        </span>
                      </td>
                      <td className="text-center px-1 py-1.5 tabular-nums">
                        {row.played}
                      </td>
                      <td className="text-center px-1 py-1.5 tabular-nums">
                        {row.won}
                      </td>
                      <td className="text-center px-1 py-1.5 tabular-nums">
                        {row.drawn}
                      </td>
                      <td className="text-center px-1 py-1.5 tabular-nums">
                        {row.lost}
                      </td>
                      <td className="text-center px-1 py-1.5 tabular-nums">
                        {row.goalsFor}
                      </td>
                      <td className="text-center px-1 py-1.5 tabular-nums">
                        {row.goalsAgainst}
                      </td>
                      <td
                        className={cn(
                          "text-center px-1 py-1.5 tabular-nums",
                          row.goalDifference > 0 && "text-emerald-400",
                          row.goalDifference < 0 && "text-red-400"
                        )}
                      >
                        {row.goalDifference > 0
                          ? `+${row.goalDifference}`
                          : row.goalDifference}
                      </td>
                      <td
                        className={cn(
                          "text-center px-1 pr-4 py-1.5 tabular-nums font-bold",
                          qualifies && "text-emerald-400"
                        )}
                      >
                        {row.points}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
