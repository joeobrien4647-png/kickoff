import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { ulid } from "ulid";
import * as schema from "../src/lib/schema";
import fs from "fs";
import path from "path";

const DB_PATH = ".kickoff/kickoff.db";

// Ensure directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const sqlite = new Database(DB_PATH);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");
const db = drizzle(sqlite, { schema });

function now() {
  return new Date().toISOString();
}

// ============ CHECK IF ALREADY SEEDED ============
try {
  const existing = sqlite.prepare("SELECT count(*) as count FROM trip_settings").get() as { count: number };
  if (existing.count > 0 && !process.argv.includes("--force")) {
    console.log("Database already seeded — skipping. Run with --force to reseed.");
    process.exit(0);
  }
} catch {
  // Table doesn't exist yet — will be created by drizzle-kit push, continue seeding
}

// ============ WIPE EXISTING DATA ============
console.log("Wiping existing data...");
// Delete in reverse-dependency order to respect foreign keys
sqlite.exec("DELETE FROM expense_splits");
sqlite.exec("DELETE FROM expenses");
sqlite.exec("DELETE FROM packing_items");
sqlite.exec("DELETE FROM notes");
sqlite.exec("DELETE FROM predictions");
sqlite.exec("DELETE FROM ideas");
sqlite.exec("DELETE FROM logistics");
sqlite.exec("DELETE FROM itinerary_items");
sqlite.exec("DELETE FROM venue_votes");
sqlite.exec("DELETE FROM activity_log");
sqlite.exec("DELETE FROM transports");
sqlite.exec("DELETE FROM decisions");
sqlite.exec("DELETE FROM matches");
sqlite.exec("DELETE FROM accommodations");
sqlite.exec("DELETE FROM stops");
sqlite.exec("DELETE FROM travelers");
sqlite.exec("DELETE FROM trip_settings");
console.log("  Done.\n");

// ============ TRIP SETTINGS ============
console.log("Creating trip settings...");

db.insert(schema.tripSettings)
  .values({
    id: "trip",
    name: "World Cup 2026 Road Trip",
    tripCode: "kickoff26",
    startDate: "2026-06-11",
    endDate: "2026-06-26",
    currency: "USD",
    createdAt: now(),
    updatedAt: now(),
  })
  .run();
console.log("  World Cup 2026 Road Trip (Jun 11-26)\n");

// ============ TRAVELERS ============
console.log("Creating travelers...");

const travelerData = [
  { id: ulid(), name: "Joe", color: "#3b82f6", emoji: "⚽" },
  { id: ulid(), name: "Jonny", color: "#22c55e", emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: ulid(), name: "Greg", color: "#f59e0b", emoji: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
];

for (const traveler of travelerData) {
  db.insert(schema.travelers)
    .values({ ...traveler, createdAt: now() })
    .run();
  console.log(`  ${traveler.emoji} ${traveler.name}`);
}
console.log();

// ============ STOPS ============
console.log("Creating stops...");

const stopData = [
  {
    id: ulid(),
    name: "Boston",
    city: "Boston",
    state: "MA",
    arriveDate: "2026-06-11",
    departDate: "2026-06-14",
    sortOrder: 1,
    lat: 42.3601,
    lng: -71.0589,
    driveFromPrev: null,
    notes: "Flying in. Staying in New Hampshire area.",
  },
  {
    id: ulid(),
    name: "New York",
    city: "New York",
    state: "NY",
    arriveDate: "2026-06-14",
    departDate: "2026-06-17",
    sortOrder: 2,
    lat: 40.7128,
    lng: -74.006,
    driveFromPrev: JSON.stringify({ miles: 215, hours: 3, minutes: 45 }),
    notes: null,
  },
  {
    id: ulid(),
    name: "Philadelphia",
    city: "Philadelphia",
    state: "PA",
    arriveDate: "2026-06-17",
    departDate: "2026-06-19",
    sortOrder: 3,
    lat: 39.9526,
    lng: -75.1652,
    driveFromPrev: JSON.stringify({ miles: 95, hours: 1, minutes: 45 }),
    notes: null,
  },
  {
    id: ulid(),
    name: "Washington DC",
    city: "Washington",
    state: "DC",
    arriveDate: "2026-06-19",
    departDate: "2026-06-22",
    sortOrder: 4,
    lat: 38.9072,
    lng: -77.0369,
    driveFromPrev: JSON.stringify({ miles: 140, hours: 2, minutes: 30 }),
    notes: null,
  },
  {
    id: ulid(),
    name: "Nashville, TN",
    city: "Nashville",
    state: "TN",
    arriveDate: "2026-06-22",
    departDate: "2026-06-24",
    sortOrder: 5,
    lat: 36.1627,
    lng: -86.7816,
    driveFromPrev: JSON.stringify({ miles: 670, hours: 9, minutes: 40 }),
    notes: "Music City! Grand Ole Opry, Broadway honky-tonks, hot chicken. Jonny's dream stop. May fly from DC (~$110pp) instead of driving 9+ hours.",
  },
  {
    id: ulid(),
    name: "Miami",
    city: "Miami",
    state: "FL",
    arriveDate: "2026-06-24",
    departDate: "2026-06-26",
    sortOrder: 6,
    lat: 25.7617,
    lng: -80.1918,
    driveFromPrev: JSON.stringify({ miles: 665, hours: 10, minutes: 0 }),
    notes: null,
  },
];

// Store stop IDs for easy reference
const stopIds = {
  boston: stopData[0].id,
  nyc: stopData[1].id,
  philly: stopData[2].id,
  dc: stopData[3].id,
  nashville: stopData[4].id,
  miami: stopData[5].id,
};

for (const stop of stopData) {
  db.insert(schema.stops)
    .values({ ...stop, createdAt: now(), updatedAt: now() })
    .run();
  console.log(
    `  ${stop.sortOrder}. ${stop.name} (${stop.arriveDate} → ${stop.departDate})`
  );
}
console.log();

// ============ ACCOMMODATIONS ============
console.log("Creating accommodations...");

const accommodationData = [
  {
    id: ulid(),
    stopId: stopIds.boston,
    name: "Lisa's Place",
    type: "host" as const,
    address: "18 Hemlock Street, Londonderry, NH 03053",
    contact: "Lisa Natale",
    costPerNight: 0,
    nights: 3,
    confirmed: true,
    notes: "Lisa's husband is Irish. Has a pool and an Irish pub in the garden! ~1hr from Boston/Gillette Stadium.",
  },
  {
    id: ulid(),
    stopId: stopIds.nyc,
    name: "TBD — Airbnb",
    type: "airbnb" as const,
    address: null,
    contact: null,
    costPerNight: null,
    nights: 3,
    confirmed: false,
    notes: "Quick 1-2 night stay, just enough to see the sights. Manhattan or Brooklyn.",
  },
  {
    id: ulid(),
    stopId: stopIds.philly,
    name: "TBD — Airbnb",
    type: "airbnb" as const,
    address: null,
    contact: null,
    costPerNight: null,
    nights: 2,
    confirmed: false,
    notes: "Quick stop, 1-2 nights max. Near stadiums or Old City area.",
  },
  {
    id: ulid(),
    stopId: stopIds.dc,
    name: "Greg's Sister's Place",
    type: "host" as const,
    address: "1608 Dogwood Drive, Alexandria, VA",
    contact: "Greg's sister",
    costPerNight: 0,
    nights: 3,
    confirmed: true,
    notes: "Greg's sister lives in Alexandria, just outside DC. Free accommodation — she can show us around!",
  },
  {
    id: ulid(),
    stopId: stopIds.nashville,
    name: "TBD — Downtown Hotel",
    type: "hotel" as const,
    address: null,
    contact: null,
    costPerNight: null,
    nights: 2,
    confirmed: false,
    notes: "Downtown Nashville near Broadway. Walking distance to honky-tonks and live music venues.",
  },
  {
    id: ulid(),
    stopId: stopIds.miami,
    name: "TBD — Airbnb",
    type: "airbnb" as const,
    address: null,
    contact: null,
    costPerNight: null,
    nights: 2,
    confirmed: false,
    notes: "South Beach or Miami Beach area. Also considering Key West overnight — Airstream motorhome on Airbnb ~$130/night, 3 beds.",
  },
];

for (const acc of accommodationData) {
  db.insert(schema.accommodations)
    .values({
      ...acc,
      bookingUrl: null,
      createdAt: now(),
      updatedAt: now(),
    })
    .run();
  const status = acc.confirmed ? "✓" : "?";
  console.log(`  [${status}] ${acc.name} (${acc.type})`);
}
console.log();

// ============ MATCHES ============
console.log("Creating matches...");

// Match data: all East Coast venue group stage matches Jun 11-27
// stopId is set when the match falls within a stop's date range
const matchData = [
  // --- Gillette Stadium / Boston ---
  {
    id: ulid(),
    stopId: stopIds.boston, // Jun 11-14, match Jun 13
    homeTeam: "Haiti",
    awayTeam: "Scotland",
    venue: "Gillette Stadium",
    city: "Foxborough",
    matchDate: "2026-06-13",
    kickoff: "21:00",
    groupName: "Group C",
    round: "group",
    priority: 2,
    notes: null,
  },
  {
    id: ulid(),
    stopId: null, // Jun 19 — travelers in DC
    homeTeam: "Morocco",
    awayTeam: "Scotland",
    venue: "Gillette Stadium",
    city: "Foxborough",
    matchDate: "2026-06-19",
    kickoff: "18:00",
    groupName: "Group C",
    round: "group",
    priority: 1,
    notes: null,
  },
  {
    id: ulid(),
    stopId: null, // Jun 23 — travelers in Nashville
    homeTeam: "England",
    awayTeam: "Ghana",
    venue: "Gillette Stadium",
    city: "Foxborough",
    matchDate: "2026-06-23",
    kickoff: "16:00",
    groupName: "Group L",
    round: "group",
    priority: 3,
    notes: "MUST SEE — but not in Boston for this one",
  },
  {
    id: ulid(),
    stopId: null, // Jun 26 — travelers in Miami
    homeTeam: "Norway",
    awayTeam: "France",
    venue: "Gillette Stadium",
    city: "Foxborough",
    matchDate: "2026-06-26",
    kickoff: "15:00",
    groupName: "Group I",
    round: "group",
    priority: 1,
    notes: null,
  },

  // --- MetLife Stadium / New York ---
  {
    id: ulid(),
    stopId: null, // Jun 13 — travelers in Boston
    homeTeam: "Brazil",
    awayTeam: "Morocco",
    venue: "MetLife Stadium",
    city: "East Rutherford",
    matchDate: "2026-06-13",
    kickoff: "18:00",
    groupName: "Group C",
    round: "group",
    priority: 2,
    notes: null,
  },
  {
    id: ulid(),
    stopId: stopIds.nyc, // Jun 14-17, match Jun 16
    homeTeam: "France",
    awayTeam: "Senegal",
    venue: "MetLife Stadium",
    city: "East Rutherford",
    matchDate: "2026-06-16",
    kickoff: "15:00",
    groupName: "Group I",
    round: "group",
    priority: 2,
    notes: null,
  },
  {
    id: ulid(),
    stopId: null, // Jun 22 — travelers in Nashville
    homeTeam: "Norway",
    awayTeam: "Senegal",
    venue: "MetLife Stadium",
    city: "East Rutherford",
    matchDate: "2026-06-22",
    kickoff: "20:00",
    groupName: "Group I",
    round: "group",
    priority: 1,
    notes: null,
  },
  {
    id: ulid(),
    stopId: null, // Jun 25 — travelers in Miami
    homeTeam: "Ecuador",
    awayTeam: "Germany",
    venue: "MetLife Stadium",
    city: "East Rutherford",
    matchDate: "2026-06-25",
    kickoff: "16:00",
    groupName: "Group E",
    round: "group",
    priority: 2,
    notes: null,
  },
  {
    id: ulid(),
    stopId: null, // Jun 27 — after trip ends
    homeTeam: "Panama",
    awayTeam: "England",
    venue: "MetLife Stadium",
    city: "East Rutherford",
    matchDate: "2026-06-27",
    kickoff: "17:00",
    groupName: "Group L",
    round: "group",
    priority: 3,
    notes: "After trip ends",
  },

  // --- Lincoln Financial Field / Philadelphia ---
  {
    id: ulid(),
    stopId: null, // Jun 14 — travelers transitioning Boston → NYC
    homeTeam: "Ivory Coast",
    awayTeam: "Ecuador",
    venue: "Lincoln Financial Field",
    city: "Philadelphia",
    matchDate: "2026-06-14",
    kickoff: "19:00",
    groupName: "Group E",
    round: "group",
    priority: 1,
    notes: null,
  },
  {
    id: ulid(),
    stopId: stopIds.philly, // Jun 17-19, match Jun 19
    homeTeam: "Brazil",
    awayTeam: "Haiti",
    venue: "Lincoln Financial Field",
    city: "Philadelphia",
    matchDate: "2026-06-19",
    kickoff: "21:00",
    groupName: "Group C",
    round: "group",
    priority: 2,
    notes: null,
  },
  {
    id: ulid(),
    stopId: null, // Jun 22 — travelers in Nashville
    homeTeam: "France",
    awayTeam: "Playoff Winner",
    venue: "Lincoln Financial Field",
    city: "Philadelphia",
    matchDate: "2026-06-22",
    kickoff: "17:00",
    groupName: "Group I",
    round: "group",
    priority: 1,
    notes: null,
  },
  {
    id: ulid(),
    stopId: null, // Jun 25 — travelers in Miami
    homeTeam: "Curacao",
    awayTeam: "Ivory Coast",
    venue: "Lincoln Financial Field",
    city: "Philadelphia",
    matchDate: "2026-06-25",
    kickoff: "16:00",
    groupName: "Group E",
    round: "group",
    priority: 0,
    notes: null,
  },
  {
    id: ulid(),
    stopId: null, // Jun 27 — after trip ends
    homeTeam: "Croatia",
    awayTeam: "Ghana",
    venue: "Lincoln Financial Field",
    city: "Philadelphia",
    matchDate: "2026-06-27",
    kickoff: "17:00",
    groupName: "Group L",
    round: "group",
    priority: 1,
    notes: "After trip ends",
  },

  // --- Mercedes-Benz Stadium / Atlanta ---
  {
    id: ulid(),
    stopId: null, // Jun 15 — travelers in NYC
    homeTeam: "Spain",
    awayTeam: "Cape Verde",
    venue: "Mercedes-Benz Stadium",
    city: "Atlanta",
    matchDate: "2026-06-15",
    kickoff: "12:00",
    groupName: "Group H",
    round: "group",
    priority: 1,
    notes: null,
  },
  {
    id: ulid(),
    stopId: null, // Jun 18 — travelers in Philly
    homeTeam: "Playoff Winner",
    awayTeam: "South Africa",
    venue: "Mercedes-Benz Stadium",
    city: "Atlanta",
    matchDate: "2026-06-18",
    kickoff: null,
    groupName: "Group A",
    round: "group",
    priority: 0,
    notes: "Time TBD",
  },
  {
    id: ulid(),
    stopId: null, // Jun 21 — travelers in DC
    homeTeam: "Spain",
    awayTeam: "Saudi Arabia",
    venue: "Mercedes-Benz Stadium",
    city: "Atlanta",
    matchDate: "2026-06-21",
    kickoff: null,
    groupName: "Group H",
    round: "group",
    priority: 1,
    notes: "Time TBD",
  },
  {
    id: ulid(),
    stopId: stopIds.nashville, // Jun 22-24, match Jun 24 (travelers in Nashville, match in Atlanta)
    homeTeam: "Morocco",
    awayTeam: "Haiti",
    venue: "Mercedes-Benz Stadium",
    city: "Atlanta",
    matchDate: "2026-06-24",
    kickoff: null,
    groupName: "Group C",
    round: "group",
    priority: 1,
    notes: "Time TBD",
  },

  // --- Hard Rock Stadium / Miami ---
  {
    id: ulid(),
    stopId: null, // Jun 15 — travelers in NYC
    homeTeam: "Saudi Arabia",
    awayTeam: "Uruguay",
    venue: "Hard Rock Stadium",
    city: "Miami Gardens",
    matchDate: "2026-06-15",
    kickoff: "18:00",
    groupName: "Group H",
    round: "group",
    priority: 1,
    notes: null,
  },
  {
    id: ulid(),
    stopId: null, // Jun 21 — travelers in DC
    homeTeam: "Uruguay",
    awayTeam: "Cape Verde",
    venue: "Hard Rock Stadium",
    city: "Miami Gardens",
    matchDate: "2026-06-21",
    kickoff: "18:00",
    groupName: "Group H",
    round: "group",
    priority: 1,
    notes: null,
  },
  {
    id: ulid(),
    stopId: stopIds.miami, // Jun 24-26, match Jun 24
    homeTeam: "Scotland",
    awayTeam: "Brazil",
    venue: "Hard Rock Stadium",
    city: "Miami Gardens",
    matchDate: "2026-06-24",
    kickoff: "18:00",
    groupName: "Group C",
    round: "group",
    priority: 3,
    notes: "MUST SEE",
  },
  {
    id: ulid(),
    stopId: null, // Jun 27 — after trip ends
    homeTeam: "Colombia",
    awayTeam: "Portugal",
    venue: "Hard Rock Stadium",
    city: "Miami Gardens",
    matchDate: "2026-06-27",
    kickoff: "19:30",
    groupName: "Group K",
    round: "group",
    priority: 2,
    notes: "After trip ends",
  },
];

for (const match of matchData) {
  // Key matches we tried for in ballot (all unsuccessful Feb 2026)
  const isScotlandHaiti = match.homeTeam === "Haiti" && match.awayTeam === "Scotland";
  const isScotlandBrazil = match.homeTeam === "Scotland" && match.awayTeam === "Brazil";
  const isEnglandGhana = match.homeTeam === "England" && match.awayTeam === "Ghana";

  const triedBallot = isScotlandHaiti || isScotlandBrazil || isEnglandGhana;
  const ticketStatus = triedBallot ? "seeking" as const : "none" as const;
  const ticketNotes = triedBallot
    ? "FIFA ballot unsuccessful (Feb 2026). Resale prices extortionate ($1000+). Trying last-minute sales phase. May watch at fan park instead."
    : null;

  db.insert(schema.matches)
    .values({
      ...match,
      ticketStatus,
      ticketPrice: null,
      ticketUrl: null,
      ticketNotes,
      fanZone: null,
      attending: false,
      actualHomeScore: null,
      actualAwayScore: null,
      createdAt: now(),
      updatedAt: now(),
    })
    .run();
  const linked = match.stopId ? "★" : " ";
  console.log(
    `  [${linked}] ${match.matchDate} ${match.homeTeam} vs ${match.awayTeam} @ ${match.venue}`
  );
}
console.log();

// ============ ITINERARY ITEMS ============
console.log("Creating itinerary items...");

const itineraryData = [
  {
    id: ulid(),
    date: "2026-06-11",
    stopId: stopIds.boston,
    matchId: null,
    title: "Fly to Boston",
    type: "travel" as const,
    startTime: null,
    endTime: null,
    location: null,
    confirmed: false,
    sortOrder: 1,
    notes: null,
  },
  {
    id: ulid(),
    date: "2026-06-14",
    stopId: stopIds.nyc,
    matchId: null,
    title: "Drive to New York",
    type: "travel" as const,
    startTime: "09:00",
    endTime: null,
    location: null,
    confirmed: false,
    sortOrder: 1,
    notes: "~3.75 hours",
  },
  {
    id: ulid(),
    date: "2026-06-17",
    stopId: stopIds.philly,
    matchId: null,
    title: "Drive to Philadelphia",
    type: "travel" as const,
    startTime: "10:00",
    endTime: null,
    location: null,
    confirmed: false,
    sortOrder: 1,
    notes: "~1.75 hours",
  },
  {
    id: ulid(),
    date: "2026-06-19",
    stopId: stopIds.dc,
    matchId: null,
    title: "Drive to Washington DC",
    type: "travel" as const,
    startTime: "10:00",
    endTime: null,
    location: null,
    confirmed: false,
    sortOrder: 1,
    notes: "~2.5 hours",
  },
  {
    id: ulid(),
    date: "2026-06-22",
    stopId: stopIds.nashville,
    matchId: null,
    title: "Travel to Nashville",
    type: "travel" as const,
    startTime: "07:00",
    endTime: null,
    location: null,
    confirmed: false,
    sortOrder: 1,
    notes: "~9h 40m drive or fly (~$110pp). May fly instead of driving.",
  },
  {
    id: ulid(),
    date: "2026-06-24",
    stopId: stopIds.miami,
    matchId: null,
    title: "Drive to Miami",
    type: "travel" as const,
    startTime: "07:00",
    endTime: null,
    location: null,
    confirmed: false,
    sortOrder: 1,
    notes: "~10 hours - another long one",
  },
  {
    id: ulid(),
    date: "2026-06-26",
    stopId: stopIds.miami,
    matchId: null,
    title: "Fly home from Miami",
    type: "travel" as const,
    startTime: null,
    endTime: null,
    location: null,
    confirmed: false,
    sortOrder: 1,
    notes: null,
  },
];

for (const item of itineraryData) {
  db.insert(schema.itineraryItems)
    .values({
      ...item,
      cost: null,
      addedBy: null,
      createdAt: now(),
      updatedAt: now(),
    })
    .run();
  const time = item.startTime ? ` @ ${item.startTime}` : "";
  console.log(`  ${item.date}${time} — ${item.title}`);
}
console.log();

// ============ PACKING ITEMS ============
console.log("Creating packing items...");

const packingData: {
  category: "documents" | "clothing" | "toiletries" | "electronics" | "fan_gear" | "gear";
  items: string[];
}[] = [
  {
    category: "documents",
    items: [
      "Passport",
      "Travel insurance docs",
      "Boarding passes",
      "Driver's license",
      "Car rental confirmation",
    ],
  },
  {
    category: "clothing",
    items: [
      "Shorts x5",
      "T-shirts x7",
      "Underwear x8",
      "Socks x8",
      "Jeans x2",
      "Light jacket",
      "Swimwear",
      "Trainers",
      "Flip flops",
    ],
  },
  {
    category: "toiletries",
    items: ["Toothbrush", "Toothpaste", "Deodorant", "Sunscreen", "Shampoo"],
  },
  {
    category: "electronics",
    items: [
      "Phone charger",
      "Portable battery pack",
      "Headphones",
      "Camera",
      "Travel adapter (US)",
    ],
  },
  {
    category: "fan_gear",
    items: ["England shirt", "Scotland shirt", "Scarf", "Bucket hat"],
  },
  {
    category: "gear",
    items: [
      "Sunglasses",
      "Day backpack",
      "Reusable water bottle",
      "First aid kit (shared)",
    ],
  },
];

let packingCount = 0;
for (const group of packingData) {
  for (const itemName of group.items) {
    db.insert(schema.packingItems)
      .values({
        id: ulid(),
        name: itemName,
        category: group.category,
        assignedTo: null,
        checked: false,
        quantity: 1,
        notes: null,
        createdAt: now(),
      })
      .run();
    packingCount++;
  }
  console.log(`  ${group.category}: ${group.items.length} items`);
}
console.log();

// ============ IDEAS ============
console.log("Creating ideas...");

const ideaData = [
  // --- Boston ---
  {
    id: ulid(),
    stopId: stopIds.boston,
    title: "Freedom Trail Walk",
    category: "sightseeing" as const,
    description: "2.5-mile walk through 16 historic sites from Boston Common to Bunker Hill Monument",
    url: "https://www.thefreedomtrail.org/",
    address: "Boston Common, 139 Tremont St, Boston, MA 02111",
    estimatedCost: 0,
    estimatedDuration: "3 hours",
    votes: "[]",
    addedBy: "Joe",
    notes: "Free to walk — guided tours available for ~$14",
  },
  {
    id: ulid(),
    stopId: stopIds.boston,
    title: "Bleacher Bar at Fenway Park",
    category: "sports_bar" as const,
    description: "Bar built into the bleachers at Fenway Park with a garage door view into center field",
    url: "https://www.bleacherbarboston.com/",
    address: "82A Lansdowne St, Boston, MA 02215",
    estimatedCost: 30,
    estimatedDuration: "2 hours",
    votes: "[]",
    addedBy: "Jonny",
    notes: "Gets packed on game days — arrive early",
  },
  {
    id: ulid(),
    stopId: stopIds.boston,
    title: "Legal Sea Foods — Lobster Dinner",
    category: "food" as const,
    description: "Classic New England lobster at the iconic Boston seafood spot",
    url: "https://www.legalseafoods.com/",
    address: "270 Northern Ave, Boston, MA 02210",
    estimatedCost: 50,
    estimatedDuration: "1.5 hours",
    votes: "[]",
    addedBy: "Greg",
    notes: "Long Wharf location is most iconic",
  },
  {
    id: ulid(),
    stopId: stopIds.boston,
    title: "Mike's Pastry in North End",
    category: "food" as const,
    description: "Famous cannoli and Italian pastries in Boston's Little Italy",
    url: "https://www.mikespastry.com/",
    address: "300 Hanover St, Boston, MA 02113",
    estimatedCost: 10,
    estimatedDuration: "30 minutes",
    votes: "[]",
    addedBy: "Joe",
    notes: "Cash only — long lines but worth it",
  },
  {
    id: ulid(),
    stopId: stopIds.boston,
    title: "Sam Adams Brewery Tour",
    category: "activity" as const,
    description: "Tour the Boston brewery with tastings included",
    url: "https://www.samueladams.com/boston-taproom",
    address: "30 Germania St, Boston, MA 02130",
    estimatedCost: 0,
    estimatedDuration: "1.5 hours",
    votes: "[]",
    addedBy: "Jonny",
    notes: "Free tour — donations appreciated. Book ahead.",
  },
  {
    id: ulid(),
    stopId: stopIds.boston,
    title: "Faneuil Hall & Quincy Market",
    category: "sightseeing" as const,
    description: "Historic marketplace with street performers, food stalls, and shops",
    url: "https://faneuilhallmarketplace.com/",
    address: "4 S Market St, Boston, MA 02109",
    estimatedCost: 15,
    estimatedDuration: "1.5 hours",
    votes: "[]",
    addedBy: "Greg",
    notes: null,
  },
  {
    id: ulid(),
    stopId: stopIds.boston,
    title: "Harvard Campus Walk",
    category: "sightseeing" as const,
    description: "Stroll through Harvard Yard and around the oldest university in the US",
    url: null,
    address: "Massachusetts Hall, Cambridge, MA 02138",
    estimatedCost: 0,
    estimatedDuration: "1.5 hours",
    votes: "[]",
    addedBy: "Joe",
    notes: "Free — can combine with a walk along the Charles River",
  },
  {
    id: ulid(),
    stopId: stopIds.boston,
    title: "Maine Day Trip — Castine",
    category: "sightseeing" as const,
    description: "Drive up to Castine, Maine — quaint coastal town with harbour views, lobster shacks, and maritime history",
    url: null,
    address: "Castine, ME 04421",
    estimatedCost: 50,
    estimatedDuration: "full day",
    votes: JSON.stringify(["Jonny"]),
    addedBy: "Jonny",
    notes: "Jonny really wants to see Maine. ~3hr drive from Lisa's place in NH. Could be a tight day trip.",
  },
  {
    id: ulid(),
    stopId: stopIds.boston,
    title: "The Banshee — World Cup Watch",
    category: "sports_bar" as const,
    description: "Legendary Irish sports pub in Dorchester, great for watching footy",
    url: "https://www.bansheeboston.com/",
    address: "934 Dorchester Ave, Dorchester, MA 02125",
    estimatedCost: 25,
    estimatedDuration: "2 hours",
    votes: "[]",
    addedBy: "Jonny",
    notes: "Big screens, proper atmosphere for a match",
  },

  // --- New York ---
  {
    id: ulid(),
    stopId: stopIds.nyc,
    title: "Statue of Liberty & Ellis Island",
    category: "sightseeing" as const,
    description: "Ferry to Liberty Island and the immigration museum on Ellis Island",
    url: "https://www.statueofliberty.org/",
    address: "Liberty Island, New York, NY 10004",
    estimatedCost: 24,
    estimatedDuration: "half day",
    votes: "[]",
    addedBy: "Greg",
    notes: "Book ferry tickets well in advance — sells out",
  },
  {
    id: ulid(),
    stopId: stopIds.nyc,
    title: "Central Park",
    category: "sightseeing" as const,
    description: "Iconic urban park — Bethesda Fountain, Bow Bridge, The Mall",
    url: "https://www.centralparknyc.org/",
    address: "Central Park, New York, NY 10024",
    estimatedCost: 0,
    estimatedDuration: "2 hours",
    votes: "[]",
    addedBy: "Joe",
    notes: null,
  },
  {
    id: ulid(),
    stopId: stopIds.nyc,
    title: "Times Square",
    category: "sightseeing" as const,
    description: "The neon-lit crossroads of the world — see it once, especially at night",
    url: null,
    address: "Times Square, Manhattan, NY 10036",
    estimatedCost: 0,
    estimatedDuration: "1 hour",
    votes: "[]",
    addedBy: "Greg",
    notes: "Touristy but has to be done",
  },
  {
    id: ulid(),
    stopId: stopIds.nyc,
    title: "Brooklyn Bridge Walk",
    category: "sightseeing" as const,
    description: "Walk across the iconic bridge with Manhattan skyline views",
    url: null,
    address: "Brooklyn Bridge, New York, NY 10038",
    estimatedCost: 0,
    estimatedDuration: "1 hour",
    votes: "[]",
    addedBy: "Joe",
    notes: "Best at sunset — walk from Brooklyn side toward Manhattan",
  },
  {
    id: ulid(),
    stopId: stopIds.nyc,
    title: "Joe's Pizza",
    category: "food" as const,
    description: "No-frills NYC slice joint — a New York institution since 1975",
    url: "https://www.joespizzanyc.com/",
    address: "7 Carmine St, New York, NY 10014",
    estimatedCost: 8,
    estimatedDuration: "30 minutes",
    votes: "[]",
    addedBy: "Joe",
    notes: "Cash only. Get the plain cheese slice.",
  },
  {
    id: ulid(),
    stopId: stopIds.nyc,
    title: "230 Fifth Rooftop Bar",
    category: "drinks" as const,
    description: "Massive rooftop bar with panoramic views of the Empire State Building",
    url: "https://www.230-fifth.com/",
    address: "230 5th Ave, New York, NY 10001",
    estimatedCost: 25,
    estimatedDuration: "2 hours",
    votes: "[]",
    addedBy: "Jonny",
    notes: "No reservation needed for rooftop — but expect a wait on weekends",
  },
  {
    id: ulid(),
    stopId: stopIds.nyc,
    title: "Top of the Rock",
    category: "sightseeing" as const,
    description: "Observation deck at 30 Rock with unobstructed views of the Empire State and Central Park",
    url: "https://www.topoftherocknyc.com/",
    address: "30 Rockefeller Plaza, New York, NY 10112",
    estimatedCost: 43,
    estimatedDuration: "1.5 hours",
    votes: "[]",
    addedBy: "Greg",
    notes: "Better views than Empire State (you can actually see the Empire State from here)",
  },
  {
    id: ulid(),
    stopId: stopIds.nyc,
    title: "Legends Bar — World Cup Watch",
    category: "sports_bar" as const,
    description: "Premier football bar in Manhattan, packed during international tournaments",
    url: "https://www.legends33.com/",
    address: "6 W 33rd St, New York, NY 10001",
    estimatedCost: 30,
    estimatedDuration: "2 hours",
    votes: "[]",
    addedBy: "Jonny",
    notes: "THE football bar in NYC — will be electric during the World Cup",
  },

  // --- Philadelphia ---
  {
    id: ulid(),
    stopId: stopIds.philly,
    title: "Pat's King of Steaks",
    category: "food" as const,
    description: "The original Philly cheesesteak since 1930 — order 'whiz wit'",
    url: "https://www.patskingofsteaks.com/",
    address: "1237 E Passyunk Ave, Philadelphia, PA 19147",
    estimatedCost: 15,
    estimatedDuration: "30 minutes",
    votes: "[]",
    addedBy: "Joe",
    notes: "Pat's vs Geno's — they're across the street from each other. Try both.",
  },
  {
    id: ulid(),
    stopId: stopIds.philly,
    title: "Rocky Steps at Philadelphia Museum of Art",
    category: "sightseeing" as const,
    description: "Run up the steps like Rocky Balboa and take a photo with the statue",
    url: "https://philamuseum.org/",
    address: "2600 Benjamin Franklin Pkwy, Philadelphia, PA 19130",
    estimatedCost: 0,
    estimatedDuration: "1 hour",
    votes: "[]",
    addedBy: "Greg",
    notes: "The steps are free — museum entry is $25 if you want to go inside",
  },
  {
    id: ulid(),
    stopId: stopIds.philly,
    title: "Liberty Bell",
    category: "sightseeing" as const,
    description: "See the iconic cracked bell — a symbol of American independence",
    url: "https://www.nps.gov/inde/learn/historyculture/stories-libertybell.htm",
    address: "526 Market St, Philadelphia, PA 19106",
    estimatedCost: 0,
    estimatedDuration: "30 minutes",
    votes: "[]",
    addedBy: "Greg",
    notes: "Free admission — quick stop, combine with Independence Hall next door",
  },
  {
    id: ulid(),
    stopId: stopIds.philly,
    title: "Reading Terminal Market",
    category: "food" as const,
    description: "Historic indoor market with Amish vendors, local food, and fresh produce since 1893",
    url: "https://readingterminalmarket.org/",
    address: "51 N 12th St, Philadelphia, PA 19107",
    estimatedCost: 20,
    estimatedDuration: "1.5 hours",
    votes: "[]",
    addedBy: "Jonny",
    notes: "Great for brunch — try DiNic's roast pork sandwich",
  },
  {
    id: ulid(),
    stopId: stopIds.philly,
    title: "Xfinity Live! — World Cup Watch",
    category: "sports_bar" as const,
    description: "Sports entertainment complex right next to the stadiums in South Philly",
    url: "https://www.xfinitylive.com/",
    address: "1100 Pattison Ave, Philadelphia, PA 19148",
    estimatedCost: 30,
    estimatedDuration: "2 hours",
    votes: "[]",
    addedBy: "Joe",
    notes: "Right near Lincoln Financial Field — multiple bars and big screens",
  },

  // --- Washington DC ---
  {
    id: ulid(),
    stopId: stopIds.dc,
    title: "National Mall — Lincoln Memorial & Washington Monument",
    category: "sightseeing" as const,
    description: "Walk the full stretch of the National Mall from the Capitol to the Lincoln Memorial",
    url: "https://www.nps.gov/nama/index.htm",
    address: "National Mall, Washington, DC 20024",
    estimatedCost: 0,
    estimatedDuration: "3 hours",
    votes: "[]",
    addedBy: "Joe",
    notes: "All free — best done in the morning before it gets too hot",
  },
  {
    id: ulid(),
    stopId: stopIds.dc,
    title: "Smithsonian Air & Space Museum",
    category: "sightseeing" as const,
    description: "World-class aerospace museum — Wright Flyer, Apollo 11, SR-71 Blackbird",
    url: "https://airandspace.si.edu/",
    address: "600 Independence Ave SW, Washington, DC 20560",
    estimatedCost: 0,
    estimatedDuration: "2.5 hours",
    votes: "[]",
    addedBy: "Greg",
    notes: "Free admission — timed entry passes recommended",
  },
  {
    id: ulid(),
    stopId: stopIds.dc,
    title: "Georgetown Neighborhood",
    category: "sightseeing" as const,
    description: "Historic cobblestone streets, boutiques, waterfront dining, and great nightlife",
    url: null,
    address: "M St NW & Wisconsin Ave NW, Washington, DC 20007",
    estimatedCost: 30,
    estimatedDuration: "3 hours",
    votes: "[]",
    addedBy: "Jonny",
    notes: "Good for an afternoon wander + dinner",
  },
  {
    id: ulid(),
    stopId: stopIds.dc,
    title: "Ben's Chili Bowl",
    category: "food" as const,
    description: "DC landmark since 1958 — famous half-smoke sausage with chili",
    url: "https://benschilibowl.com/",
    address: "1213 U St NW, Washington, DC 20009",
    estimatedCost: 15,
    estimatedDuration: "45 minutes",
    votes: "[]",
    addedBy: "Joe",
    notes: "A must-eat in DC — Obama ate here",
  },
  {
    id: ulid(),
    stopId: stopIds.dc,
    title: "Dupont Circle Bars",
    category: "nightlife" as const,
    description: "Vibrant bar scene around Dupont Circle — cocktail lounges, dive bars, rooftop spots",
    url: null,
    address: "Dupont Circle, Washington, DC 20036",
    estimatedCost: 40,
    estimatedDuration: "3 hours",
    votes: "[]",
    addedBy: "Jonny",
    notes: "Good crawl route: Board Room → Dirty Habit → The Admiral",
  },

  // --- Nashville ---
  {
    id: ulid(),
    stopId: stopIds.nashville,
    title: "Grand Ole Opry Show",
    category: "activity" as const,
    description: "The legendary country music venue — live performances every week since 1925",
    url: "https://www.opry.com/",
    address: "2804 Opryland Dr, Nashville, TN 37214",
    estimatedCost: 54,
    estimatedDuration: "3 hours",
    votes: JSON.stringify(["Jonny"]),
    addedBy: "Jonny",
    notes: "Jonny is well into country music. ~$54 per ticket. Book early!",
  },
  {
    id: ulid(),
    stopId: stopIds.nashville,
    title: "Morgan Wallen's Bar (This Bar)",
    category: "nightlife" as const,
    description: "Country star Morgan Wallen's 6-story bar on Broadway — live music, rooftop, multiple floors",
    url: null,
    address: "301 Broadway, Nashville, TN 37201",
    estimatedCost: 40,
    estimatedDuration: "2 hours",
    votes: JSON.stringify(["Jonny"]),
    addedBy: "Jonny",
    notes: "On Nashville's famous Broadway honky-tonk strip",
  },
  {
    id: ulid(),
    stopId: stopIds.nashville,
    title: "Broadway Honky-Tonk Crawl",
    category: "nightlife" as const,
    description: "Nashville's Lower Broadway — wall-to-wall live music bars, no cover charges, cold beer",
    url: null,
    address: "Lower Broadway, Nashville, TN 37203",
    estimatedCost: 50,
    estimatedDuration: "4 hours",
    votes: "[]",
    addedBy: "Joe",
    notes: "Free live music all day. Tootsie's, Robert's Western World, The Stage are must-visits.",
  },
  {
    id: ulid(),
    stopId: stopIds.nashville,
    title: "Disc Golf Course",
    category: "activity" as const,
    description: "Outdoor disc golf — Jonny's suggestion for an active afternoon",
    url: null,
    address: null,
    estimatedCost: 5,
    estimatedDuration: "2 hours",
    votes: JSON.stringify(["Jonny"]),
    addedBy: "Jonny",
    notes: "Nashville has several good courses. Could do this in any city really.",
  },

  // --- Miami ---
  {
    id: ulid(),
    stopId: stopIds.miami,
    title: "South Beach",
    category: "activity" as const,
    description: "Iconic white sand beach with turquoise water — sunbathe, swim, people-watch",
    url: null,
    address: "South Beach, Miami Beach, FL 33139",
    estimatedCost: 0,
    estimatedDuration: "half day",
    votes: "[]",
    addedBy: "Joe",
    notes: "Bring sunscreen — it's June in Miami",
  },
  {
    id: ulid(),
    stopId: stopIds.miami,
    title: "Ocean Drive & Art Deco District",
    category: "sightseeing" as const,
    description: "Stroll along the neon-lit Art Deco buildings on Miami Beach's most famous strip",
    url: "https://mdpl.org/",
    address: "Ocean Drive, Miami Beach, FL 33139",
    estimatedCost: 0,
    estimatedDuration: "1.5 hours",
    votes: "[]",
    addedBy: "Greg",
    notes: "Best at dusk when the neon lights come on",
  },
  {
    id: ulid(),
    stopId: stopIds.miami,
    title: "Versailles Restaurant — Little Havana",
    category: "food" as const,
    description: "The most famous Cuban restaurant in Miami — ropa vieja, Cuban sandwich, cafecito",
    url: "https://www.versaillesrestaurant.com/",
    address: "3555 SW 8th St, Miami, FL 33135",
    estimatedCost: 20,
    estimatedDuration: "1.5 hours",
    votes: "[]",
    addedBy: "Joe",
    notes: "Hit the ventanita (walk-up window) for a cafecito too",
  },
  {
    id: ulid(),
    stopId: stopIds.miami,
    title: "Wynwood Walls",
    category: "sightseeing" as const,
    description: "Open-air street art museum with massive murals from world-renowned artists",
    url: "https://www.thewynwoodwalls.com/",
    address: "2520 NW 2nd Ave, Miami, FL 33127",
    estimatedCost: 12,
    estimatedDuration: "1.5 hours",
    votes: "[]",
    addedBy: "Greg",
    notes: "Whole Wynwood neighborhood is walkable and has great bars/food",
  },
  {
    id: ulid(),
    stopId: stopIds.miami,
    title: "1 Hotel South Beach Rooftop Pool Bar",
    category: "drinks" as const,
    description: "Stylish rooftop pool bar with ocean views — the ultimate Miami vibe",
    url: "https://www.1hotels.com/south-beach",
    address: "2341 Collins Ave, Miami Beach, FL 33139",
    estimatedCost: 35,
    estimatedDuration: "2 hours",
    votes: "[]",
    addedBy: "Jonny",
    notes: "Day pass may be needed if not a guest — check availability",
  },
  {
    id: ulid(),
    stopId: stopIds.miami,
    title: "Key West Overnight Trip",
    category: "activity" as const,
    description: "Drive from Miami to Key West for an overnight stay — Duval Street bars, sunset at Mallory Square, Hemingway House",
    url: null,
    address: "Key West, FL 33040",
    estimatedCost: 130,
    estimatedDuration: "overnight",
    votes: JSON.stringify(["Greg"]),
    addedBy: "Greg",
    notes: "Greg found an Airstream motorhome on Airbnb ~$130/night, 3 beds. ~3.5hr drive from Miami. Could do it as a day trip but overnight is better.",
  },
  {
    id: ulid(),
    stopId: stopIds.miami,
    title: "Duffy's Sports Grill — World Cup Watch",
    category: "sports_bar" as const,
    description: "Large sports bar chain near Hard Rock Stadium, solid for watching matches",
    url: "https://www.duffysmvp.com/",
    address: "3969 NW 198th St, Miami Gardens, FL 33055",
    estimatedCost: 25,
    estimatedDuration: "2 hours",
    votes: "[]",
    addedBy: "Joe",
    notes: "Close to Hard Rock Stadium — good fallback if not at the match",
  },
];

let ideaCount = 0;
const ideaCountByStop: Record<string, number> = {};
for (const idea of ideaData) {
  db.insert(schema.ideas)
    .values({
      ...idea,
      status: "idea",
      itineraryItemId: null,
      createdAt: now(),
      updatedAt: now(),
    })
    .run();
  ideaCount++;
  // Track per-stop for logging
  const stopName = stopData.find((s) => s.id === idea.stopId)?.name ?? "?";
  ideaCountByStop[stopName] = (ideaCountByStop[stopName] ?? 0) + 1;
}
for (const [stopName, cnt] of Object.entries(ideaCountByStop)) {
  console.log(`  ${stopName}: ${cnt} ideas`);
}
console.log();

// ============ POLLS ============
console.log("Creating polls...");

const pollData = [
  {
    id: ulid(),
    stopId: stopIds.boston,
    title: "Best sports bar for USA vs England?",
    category: "sports_bar" as const,
    options: JSON.stringify([
      { text: "Bleacher Bar (Fenway)", votes: [] },
      { text: "The Banshee (Dorchester)", votes: [] },
      { text: "McGreevy's (Back Bay)", votes: [] },
    ]),
    addedBy: "Jonny",
  },
  {
    id: ulid(),
    stopId: stopIds.nyc,
    title: "Road trip music playlist theme?",
    category: "activity" as const,
    options: JSON.stringify([
      { text: "Classic Rock", votes: [] },
      { text: "Hip Hop/R&B", votes: [] },
      { text: "Country", votes: [] },
      { text: "EDM/Dance", votes: [] },
    ]),
    addedBy: "Joe",
  },
  {
    id: ulid(),
    stopId: stopIds.miami,
    title: "Group dinner preference in Miami?",
    category: "food" as const,
    options: JSON.stringify([
      { text: "Seafood", votes: [] },
      { text: "Cuban", votes: [] },
      { text: "Steakhouse", votes: [] },
      { text: "Sushi", votes: [] },
    ]),
    addedBy: "Greg",
  },
  {
    id: ulid(),
    stopId: stopIds.dc,
    title: "DC night out: where to?",
    category: "nightlife" as const,
    options: JSON.stringify([
      { text: "Dupont Circle bar crawl", votes: [] },
      { text: "Georgetown waterfront", votes: [] },
      { text: "Adams Morgan dive bars", votes: [] },
    ]),
    addedBy: "Jonny",
  },
];

for (const poll of pollData) {
  db.insert(schema.ideas)
    .values({
      ...poll,
      description: null,
      url: null,
      address: null,
      estimatedCost: null,
      estimatedDuration: null,
      votes: "[]",
      type: "poll",
      status: "idea",
      itineraryItemId: null,
      notes: null,
      createdAt: now(),
      updatedAt: now(),
    })
    .run();
  console.log(`  ${poll.title} (${poll.options})`);
}
console.log(`  ${pollData.length} polls created`);
console.log();

// ============ LOGISTICS ============
console.log("Creating logistics...");

const logisticsData = [
  // --- Documents ---
  {
    id: ulid(),
    title: "Apply for ESTA",
    category: "documents" as const,
    status: "todo" as const,
    priority: 3,
    dueDate: "2026-04-01",
    url: "https://esta.cbp.dhs.gov/esta",
    notes: "All 3 need to apply. $21 per person (valid 2 years). Apply at least 72 hours before travel.",
  },
  {
    id: ulid(),
    title: "Check passport expiry",
    category: "documents" as const,
    status: "todo" as const,
    priority: 3,
    dueDate: "2026-03-01",
    notes: "Must be valid for at least 6 months beyond travel dates",
  },
  {
    id: ulid(),
    title: "Travel insurance",
    category: "documents" as const,
    status: "todo" as const,
    priority: 3,
    dueDate: "2026-05-01",
    notes: "Get comprehensive cover including medical, trip cancellation, baggage",
  },
  {
    id: ulid(),
    title: "Print/save boarding passes",
    category: "documents" as const,
    status: "todo" as const,
    priority: 2,
    dueDate: "2026-06-10",
  },
  {
    id: ulid(),
    title: "Save offline copies of confirmations",
    category: "documents" as const,
    status: "todo" as const,
    priority: 1,
    dueDate: "2026-06-10",
    notes: "Hotel bookings, car rental, match tickets if any",
  },

  // --- Transport ---
  {
    id: ulid(),
    title: "Book car rental",
    category: "transport" as const,
    status: "todo" as const,
    priority: 3,
    dueDate: "2026-04-15",
    notes: "Pick up Boston, drop off Miami. Need full-size for 3 + luggage. Joe and Jonny driving (Greg 'can drive... just shouldn't'). NO EV — poor US charging infrastructure (Greg's brother-in-law in auto industry confirmed). Gas is cheap in the US.",
  },
  {
    id: ulid(),
    title: "Research Nashville → Miami options",
    category: "transport" as const,
    status: "todo" as const,
    priority: 2,
    dueDate: "2026-04-01",
    notes: "~10hr drive or internal flight. Budget flights ~$80-150pp",
  },
  {
    id: ulid(),
    title: "Research DC → Nashville options",
    category: "transport" as const,
    status: "todo" as const,
    priority: 2,
    dueDate: "2026-04-01",
    notes: "Group prefers Nashville over Atlanta. Internal flight ~$110pp with luggage. Or 9hr drive.",
  },
  {
    id: ulid(),
    title: "Download Google Maps offline for East Coast",
    category: "transport" as const,
    status: "todo" as const,
    priority: 1,
    dueDate: "2026-06-10",
    notes: "Boston, NYC, Philly, DC, Nashville, Miami + routes between",
  },
  {
    id: ulid(),
    title: "Check international driving permit requirements",
    category: "transport" as const,
    status: "todo" as const,
    priority: 2,
    dueDate: "2026-04-01",
    notes: "UK license usually accepted but IDP recommended",
  },

  // --- Accommodation ---
  {
    id: ulid(),
    title: "Confirm Lisa's place (Boston/NH)",
    category: "accommodation" as const,
    status: "done" as const,
    priority: 2,
    dueDate: "2026-05-15",
    notes: "CONFIRMED — 18 Hemlock Street, Londonderry, NH 03053. Pool + Irish pub in garden. Lisa's husband is Irish.",
    assignedTo: "Joe",
  },
  {
    id: ulid(),
    title: "Book NYC accommodation",
    category: "accommodation" as const,
    status: "todo" as const,
    priority: 3,
    dueDate: "2026-04-01",
    notes: "Jun 14-17, 3 nights. Check Airbnb for 3-person place in Manhattan/Brooklyn",
    cost: 500,
  },
  {
    id: ulid(),
    title: "Book Philadelphia accommodation",
    category: "accommodation" as const,
    status: "todo" as const,
    priority: 3,
    dueDate: "2026-04-01",
    notes: "Jun 17-19, 2 nights",
    cost: 300,
  },
  {
    id: ulid(),
    title: "Confirm DC place (Greg's sister)",
    category: "accommodation" as const,
    status: "done" as const,
    priority: 2,
    dueDate: "2026-05-15",
    notes: "CONFIRMED — 1608 Dogwood Drive, Alexandria, VA. Greg's sister. Free accommodation.",
    assignedTo: "Greg",
  },
  {
    id: ulid(),
    title: "Book Nashville accommodation",
    category: "accommodation" as const,
    status: "todo" as const,
    priority: 3,
    dueDate: "2026-04-01",
    notes: "Jun 22-24, 2 nights. Downtown Nashville near Broadway.",
    cost: 250,
  },
  {
    id: ulid(),
    title: "Book Miami accommodation",
    category: "accommodation" as const,
    status: "todo" as const,
    priority: 3,
    dueDate: "2026-04-01",
    notes: "Jun 24-26, 2 nights. South Beach area?",
    cost: 400,
  },

  // --- Money ---
  {
    id: ulid(),
    title: "Set travel budget",
    category: "money" as const,
    status: "todo" as const,
    priority: 2,
    dueDate: "2026-05-01",
    notes: "Agree a daily budget per person. Factor in food, drinks, transport, activities, tickets",
  },
  {
    id: ulid(),
    title: "Notify bank of travel dates",
    category: "money" as const,
    status: "todo" as const,
    priority: 2,
    dueDate: "2026-06-01",
    notes: "Avoid card being blocked abroad",
  },
  {
    id: ulid(),
    title: "Get USD cash",
    category: "money" as const,
    status: "todo" as const,
    priority: 1,
    dueDate: "2026-06-09",
    notes: "£200-300 worth each for tips, street food, small purchases",
  },
  {
    id: ulid(),
    title: "Check card foreign transaction fees",
    category: "money" as const,
    status: "todo" as const,
    priority: 1,
    dueDate: "2026-05-01",
    notes: "Greg has Monzo card (no foreign fees). Joe and Jonny: consider Revolut/Wise/Monzo if current cards have high fees.",
  },

  // --- Tech ---
  {
    id: ulid(),
    title: "Check phone roaming plans",
    category: "tech" as const,
    status: "todo" as const,
    priority: 2,
    dueDate: "2026-05-15",
    notes: "UK roaming in US can be expensive. Consider US SIM or eSIM",
  },
  {
    id: ulid(),
    title: "Download offline maps",
    category: "tech" as const,
    status: "todo" as const,
    priority: 1,
    dueDate: "2026-06-10",
  },
  {
    id: ulid(),
    title: "Portable charger — ensure fully charged",
    category: "tech" as const,
    status: "todo" as const,
    priority: 1,
    dueDate: "2026-06-10",
  },

  // --- Bookings ---
  {
    id: ulid(),
    title: "World Cup tickets — last-minute sales phase",
    category: "booking" as const,
    status: "in_progress" as const,
    priority: 3,
    notes: "ALL 3 unsuccessful in FIFA ballot (Feb 2026). Resale prices extortionate ($1000+ for Scotland v Haiti). Registered for last-minute sales phase. Plan B: watch at fan parks/sports bars. Still hoping for 1-2 cheaper ones.",
  },
  {
    id: ulid(),
    title: "Book Fenway Park tour or game",
    category: "booking" as const,
    status: "todo" as const,
    priority: 1,
    notes: "If Red Sox playing Jun 11-14",
  },
  {
    id: ulid(),
    title: "Book Key West Airstream (Airbnb)",
    category: "accommodation" as const,
    status: "todo" as const,
    priority: 1,
    dueDate: "2026-05-15",
    notes: "Greg found Airstream motorhome on Airbnb ~$130/night, 3 beds. Overnight trip from Miami.",
  },
  {
    id: ulid(),
    title: "Book airport lounge (Heathrow)",
    category: "booking" as const,
    status: "todo" as const,
    priority: 1,
    dueDate: "2026-06-01",
    notes: "~£40pp unlimited food/drinks. Joe may have Virgin Atlantic vouchers.",
  },
  {
    id: ulid(),
    title: "Research fan zones at each venue",
    category: "booking" as const,
    status: "todo" as const,
    priority: 1,
    dueDate: "2026-05-15",
    notes: "FIFA Fan Fest locations for watching matches we don't have tickets to",
  },
];

const logisticsCountByCategory: Record<string, number> = {};
for (const item of logisticsData) {
  db.insert(schema.logistics)
    .values({
      confirmationRef: null,
      url: null,
      cost: null,
      assignedTo: null,
      notes: null,
      dueDate: null,
      ...item,
      createdAt: now(),
      updatedAt: now(),
    })
    .run();
  logisticsCountByCategory[item.category] =
    (logisticsCountByCategory[item.category] ?? 0) + 1;
}
for (const [cat, cnt] of Object.entries(logisticsCountByCategory)) {
  console.log(`  ${cat}: ${cnt} items`);
}
console.log();

// ============ EXPENSES ============
console.log("Creating expenses...");

const joe = travelerData[0];
const jonny = travelerData[1];
const greg = travelerData[2];
const allTravelerIds = [joe.id, jonny.id, greg.id];

function equalSplits(expenseId: string, amount: number) {
  const share = Math.round((amount / 3) * 100) / 100;
  for (const tId of allTravelerIds) {
    db.insert(schema.expenseSplits)
      .values({
        id: ulid(),
        expenseId,
        travelerId: tId,
        share,
        settled: false,
        createdAt: now(),
      })
      .run();
  }
}

// Only real expenses so far — trip is Jun 2026, we're in Feb 2026
const expenseData = [
  // Flights — booked Oct 2025 via Joe's Virgin Atlantic air miles
  // ~£300pp × 3 = ~£900 total ≈ $1,140 at 1.27 rate
  { id: ulid(), desc: "Virgin Atlantic flights (LHR→BOS + MIA→LHR)", amount: 1140, cat: "transport" as const, paidBy: joe.id, date: "2025-10-21", stopId: null },
];

for (const e of expenseData) {
  db.insert(schema.expenses)
    .values({
      id: e.id,
      description: e.desc,
      amount: e.amount,
      category: e.cat,
      paidBy: e.paidBy,
      date: e.date,
      stopId: e.stopId,
      notes: null,
      createdAt: now(),
      updatedAt: now(),
    })
    .run();
  equalSplits(e.id, e.amount);
}

const totalExpenses = expenseData.reduce((s, e) => s + e.amount, 0);
console.log(`  ${expenseData.length} expense(s) totalling $${totalExpenses}`);
console.log(`    (Only pre-trip costs — trip expenses will be added during the trip)`);
console.log();

// ============ TRANSPORTS ============
console.log("Creating transport bookings...");

const transportData = [
  {
    id: ulid(),
    type: "flight" as const,
    fromCity: "London Heathrow",
    toCity: "Boston",
    departDate: "2026-06-11",
    departTime: "15:15",
    arriveTime: null,
    carrier: "Virgin Atlantic",
    confirmationRef: null,
    cost: 300,
    bookingUrl: null,
    notes: "Booked Oct 2025 using Joe's air miles. Saved ~£1200. All 3 on same flight. ~£300pp.",
  },
  {
    id: ulid(),
    type: "flight" as const,
    fromCity: "Miami",
    toCity: "London Heathrow",
    departDate: "2026-06-26",
    departTime: null,
    arriveTime: null,
    carrier: "Virgin Atlantic",
    confirmationRef: null,
    cost: 300,
    bookingUrl: null,
    notes: "Evening flight. Booked Oct 2025 using Joe's air miles.",
  },
];

for (const t of transportData) {
  db.insert(schema.transports)
    .values({
      ...t,
      createdAt: now(),
      updatedAt: now(),
    })
    .run();
  console.log(`  ✈ ${t.fromCity} → ${t.toCity} (${t.departDate}) — ${t.carrier}`);
}
console.log();

// ============ DECISIONS ============
console.log("Creating key decisions...");

const decisionData = [
  {
    id: ulid(),
    question: "How do we get from DC to Nashville?",
    description: "It's a 9+ hour drive. Flying is ~$110pp but adds airport logistics. Car needs to get there either way.",
    category: "transport" as const,
    options: JSON.stringify([
      { text: "Fly (~$110pp, 1.5h)", votes: [] },
      { text: "Drive (9h 40m, scenic route)", votes: [] },
      { text: "One drives the car, two fly", votes: [] },
    ]),
    status: "open" as const,
    decidedOption: null,
    sortOrder: 1,
  },
  {
    id: ulid(),
    question: "How do we get from Nashville to Miami?",
    description: "Even longer than DC\u2192Nashville. 11+ hours of driving. Could fly but car still needs to get to Miami for the return flight.",
    category: "transport" as const,
    options: JSON.stringify([
      { text: "Drive \u2014 split over 2 days with an overnight stop", votes: [] },
      { text: "Drive straight through (11h 30m, take turns)", votes: [] },
      { text: "One drives, two fly (~$100pp)", votes: [] },
    ]),
    status: "open" as const,
    decidedOption: null,
    sortOrder: 2,
  },
  {
    id: ulid(),
    question: "Key West overnight trip?",
    description: "Greg found an Airstream motorhome on Airbnb (~$130/night, 3 beds). It's a 3.5hr drive from Miami each way.",
    category: "activity" as const,
    options: JSON.stringify([
      { text: "Yes \u2014 book the Airstream, stay overnight", votes: ["Greg"] },
      { text: "Yes \u2014 but day trip only (7hr round trip)", votes: [] },
      { text: "Skip it \u2014 not enough time", votes: [] },
    ]),
    status: "open" as const,
    decidedOption: null,
    sortOrder: 3,
  },
  {
    id: ulid(),
    question: "NYC: where do we stay?",
    description: "Manhattan is pricier but walkable. Brooklyn is cheaper with better food scene. Both have good transit to MetLife Stadium.",
    category: "accommodation" as const,
    options: JSON.stringify([
      { text: "Manhattan \u2014 Times Square area", votes: [] },
      { text: "Manhattan \u2014 Lower East Side / East Village", votes: [] },
      { text: "Brooklyn \u2014 Williamsburg", votes: [] },
      { text: "Brooklyn \u2014 Downtown", votes: [] },
    ]),
    status: "open" as const,
    decidedOption: null,
    sortOrder: 4,
  },
  {
    id: ulid(),
    question: "Match tickets: what's the plan?",
    description: "FIFA ballot was unsuccessful for all 3 of us. Resale prices are $1000+. Last-minute sales phase is our best hope.",
    category: "budget" as const,
    options: JSON.stringify([
      { text: "Keep trying \u2014 last-minute sales + check daily", votes: [] },
      { text: "Set a max budget ($500pp) and buy whatever we can", votes: [] },
      { text: "Give up on tickets \u2014 watch at fan parks/sports bars", votes: [] },
      { text: "Must get Scotland v Haiti \u2014 skip others if needed", votes: [] },
    ]),
    status: "open" as const,
    decidedOption: null,
    sortOrder: 5,
  },
  {
    id: ulid(),
    question: "Daily budget per person?",
    description: "Flights and free accommodation (Lisa's, Greg's sister) are sorted. This is for food, drinks, activities, transport.",
    category: "budget" as const,
    options: JSON.stringify([
      { text: "$100/day \u2014 budget mode", votes: [] },
      { text: "$150/day \u2014 comfortable", votes: [] },
      { text: "$200/day \u2014 treat ourselves", votes: [] },
      { text: "No budget \u2014 YOLO it's the World Cup", votes: [] },
    ]),
    status: "open" as const,
    decidedOption: null,
    sortOrder: 6,
  },
  {
    id: ulid(),
    question: "Nashville: route confirmed?",
    description: "The group prefers Nashville over Atlanta. Confirming this means we commit to Nashville as stop 5.",
    category: "route" as const,
    options: JSON.stringify([
      { text: "Yes \u2014 Nashville is locked in", votes: ["Joe", "Jonny", "Greg"] },
      { text: "Reconsider \u2014 maybe Atlanta is better for matches", votes: [] },
    ]),
    status: "decided" as const,
    decidedOption: "Yes \u2014 Nashville is locked in",
    sortOrder: 0,
  },
];

for (const d of decisionData) {
  db.insert(schema.decisions)
    .values({
      ...d,
      createdAt: now(),
      updatedAt: now(),
    })
    .run();
  const statusIcon = d.status === "decided" ? "\u2713" : "?";
  console.log(`  [${statusIcon}] ${d.question}`);
}
console.log();

// ============ NOTES ============
console.log("Creating notes...");

const noteData = [
  {
    id: ulid(),
    date: null,
    stopId: null,
    title: "Flights BOOKED!",
    content: "Virgin Atlantic via Joe's air miles — saved ~£1200!\n\nOUTBOUND: London Heathrow → Boston, June 11, ~15:15\nRETURN: Miami → London Heathrow, June 26, evening\n\n~£300 per person. All 3 on same flights.",
    pinned: true,
    addedBy: "Joe",
  },
  {
    id: ulid(),
    date: null,
    stopId: null,
    title: "Ticket Ballot — ALL UNSUCCESSFUL",
    content: "All 3 of us were unsuccessful in the FIFA ticket ballot (Feb 5-8, 2026).\n\nResale prices are extortionate — $1000+ for Scotland v Haiti alone.\n\nPLAN: Watch matches at fan parks and sports bars. May still try for 1-2 cheaper ones via last-minute sales phase.\n\nRegistered for FIFA last-minute sales phase.",
    pinned: true,
    addedBy: "Joe",
  },
  {
    id: ulid(),
    date: null,
    stopId: null,
    title: "Route Decision — Nashville vs Atlanta",
    content: "Group consensus: Boston → NYC → Philly → DC → Nashville → Miami\n\nNashville preferred over Atlanta! Jonny is well into country music — Grand Ole Opry, Morgan Wallen's bar, Broadway honky-tonks.\n\nInternal flight DC → Nashville discussed (~$110pp with luggage) to avoid 9hr drive.\n\nGreg also wants to drive through Florida rather than fly.",
    pinned: true,
    addedBy: "Joe",
  },
  {
    id: ulid(),
    date: null,
    stopId: stopIds.boston,
    title: "Lisa's Place — Accommodation Details",
    content: "18 Hemlock Street, Londonderry, NH 03053\n\nLisa's husband is Irish. They have a POOL and an Irish pub built in the garden!\n\n~1hr from Boston and Gillette Stadium. Free accommodation.\n\nJun 11-14 confirmed.",
    pinned: false,
    addedBy: "Joe",
  },
  {
    id: ulid(),
    date: null,
    stopId: stopIds.dc,
    title: "Greg's Sister — DC Accommodation",
    content: "1608 Dogwood Drive, Alexandria, VA\n\nGreg's sister lives just outside DC. Free accommodation.\nShe can show us around — National Mall, Lincoln Memorial, etc.\n\nJun 19-22.",
    pinned: false,
    addedBy: "Greg",
  },
  {
    id: ulid(),
    date: null,
    stopId: stopIds.miami,
    title: "Key West Overnight",
    content: "Greg's idea: overnight trip from Miami to Key West.\n\nFound an Airstream motorhome on Airbnb ~$130/night, 3 beds.\n\n~3.5hr drive from Miami. Duval Street bars, sunset at Mallory Square.",
    pinned: false,
    addedBy: "Greg",
  },
  {
    id: ulid(),
    date: null,
    stopId: null,
    title: "Car Rental Notes",
    content: "Boston pickup → Miami dropoff. Need full-size for 3 + luggage.\n\nJoe and Jonny driving. Greg 'can drive... just shouldn't' 😂\n\nNO EV — Greg's brother-in-law is in the US auto industry and says EV charging infrastructure is poor.\n\nGas is cheap in the US so petrol car is fine.",
    pinned: false,
    addedBy: "Joe",
  },
  {
    id: ulid(),
    date: null,
    stopId: null,
    title: "Airport Lounge — Pre-Flight",
    content: "Consider booking airport lounge before the flight (~£40 each, unlimited food and drinks).\n\nJoe may have vouchers from Virgin Atlantic.",
    pinned: false,
    addedBy: "Joe",
  },
];

for (const note of noteData) {
  db.insert(schema.notes)
    .values({
      ...note,
      createdAt: now(),
      updatedAt: now(),
    })
    .run();
  const pin = note.pinned ? "📌 " : "";
  console.log(`  ${pin}${note.title} (by ${note.addedBy})`);
}
console.log();

// ============ SUMMARY ============
const count = (table: string) =>
  (sqlite.prepare(`SELECT COUNT(*) as count FROM ${table}`).get() as { count: number }).count;

console.log("========================================");
console.log("Seeding complete!");
console.log(`  1  trip settings`);
console.log(`  ${count("travelers")} travelers`);
console.log(`  ${count("stops")} stops`);
console.log(`  ${count("accommodations")} accommodations`);
console.log(`  ${count("matches")} matches`);
console.log(`  ${count("itinerary_items")} itinerary items`);
console.log(`  ${count("packing_items")} packing items`);
console.log(`  ${count("ideas")} ideas`);
console.log(`  ${count("logistics")} logistics`);
console.log(`  ${count("expenses")} expenses`);
console.log(`  ${count("expense_splits")} expense splits`);
console.log(`  ${count("notes")} notes`);
console.log(`  ${count("transports")} transports`);
console.log(`  ${count("decisions")} decisions`);
console.log("========================================");

sqlite.close();
