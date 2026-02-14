// ============================================================================
// Match Broadcast Guide
// US TV channels, streaming, and UK channels for World Cup 2026
// FOX/FS1 have US English rights, Telemundo has Spanish rights
// BBC and ITV share UK rights (all free-to-air)
// ============================================================================

export type BroadcastInfo = {
  network: string;
  streaming: string;
  ukChannel: string;
  notes?: string;
};

const GROUP_FOX: BroadcastInfo = {
  network: "FOX",
  streaming: "Tubi (free) / Fox Sports App",
  ukChannel: "BBC One / ITV1",
  notes: "Big group matches on main FOX channel",
};

const GROUP_FS1: BroadcastInfo = {
  network: "FS1",
  streaming: "Tubi (free) / Fox Sports App",
  ukChannel: "BBC One / ITV1",
  notes: "Smaller group games on FS1",
};

const KNOCKOUT: BroadcastInfo = {
  network: "FOX",
  streaming: "Tubi (free) / Fox Sports App",
  ukChannel: "BBC One / ITV1",
};

const DEFAULT: BroadcastInfo = {
  network: "FOX / FS1",
  streaming: "Tubi (free) / Fox Sports App",
  ukChannel: "BBC / ITV",
};

const BIG_TEAMS = ["England", "Brazil", "France", "Germany", "Spain", "USA", "Scotland"];

/** Get broadcast info for a match based on round and teams */
export function getBroadcast(
  round: string | null,
  homeTeam: string,
  awayTeam: string
): BroadcastInfo {
  const isBig = BIG_TEAMS.includes(homeTeam) || BIG_TEAMS.includes(awayTeam);

  if (round === "group") {
    return isBig ? GROUP_FOX : GROUP_FS1;
  }
  if (round && round !== "group") {
    return KNOCKOUT;
  }
  return DEFAULT;
}

/** Convert US Eastern time string to BST (ET + 5 hours) */
export function toBST(kickoff: string | null): string | null {
  if (!kickoff) return null;
  let hours: number;
  let minutes: number;

  if (kickoff.includes("AM") || kickoff.includes("PM")) {
    const m = kickoff.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!m) return null;
    hours = parseInt(m[1]);
    minutes = parseInt(m[2]);
    if (m[3].toUpperCase() === "PM" && hours !== 12) hours += 12;
    if (m[3].toUpperCase() === "AM" && hours === 12) hours = 0;
  } else {
    const parts = kickoff.split(":");
    hours = parseInt(parts[0]);
    minutes = parseInt(parts[1]);
  }

  hours += 5;
  if (hours >= 24) hours -= 24;
  const period = hours >= 12 ? "PM" : "AM";
  const display = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${display}:${minutes.toString().padStart(2, "0")} ${period} BST`;
}
