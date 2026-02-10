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
sqlite.exec("DELETE FROM ideas");
sqlite.exec("DELETE FROM logistics");
sqlite.exec("DELETE FROM itinerary_items");
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
  { id: ulid(), name: "Greg", color: "#f59e0b", emoji: "🇧🇷" },
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
    name: "Atlanta",
    city: "Atlanta",
    state: "GA",
    arriveDate: "2026-06-22",
    departDate: "2026-06-24",
    sortOrder: 5,
    lat: 33.749,
    lng: -84.388,
    driveFromPrev: JSON.stringify({ miles: 640, hours: 9, minutes: 30 }),
    notes: null,
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
  atlanta: stopData[4].id,
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
    contact: "Lisa Natale",
    confirmed: true,
    notes: "New Hampshire, ~1hr outside Boston. Irish pub in the garden!",
  },
  {
    id: ulid(),
    stopId: stopIds.nyc,
    name: "TBD",
    type: "airbnb" as const,
    contact: null,
    confirmed: false,
    notes: null,
  },
  {
    id: ulid(),
    stopId: stopIds.philly,
    name: "TBD",
    type: "airbnb" as const,
    contact: null,
    confirmed: false,
    notes: null,
  },
  {
    id: ulid(),
    stopId: stopIds.dc,
    name: "Friend's Sister's Place",
    type: "host" as const,
    contact: null,
    confirmed: true,
    notes: "Friend's sister in DC",
  },
  {
    id: ulid(),
    stopId: stopIds.atlanta,
    name: "TBD",
    type: "hotel" as const,
    contact: null,
    confirmed: false,
    notes: null,
  },
  {
    id: ulid(),
    stopId: stopIds.miami,
    name: "TBD",
    type: "airbnb" as const,
    contact: null,
    confirmed: false,
    notes: null,
  },
];

for (const acc of accommodationData) {
  db.insert(schema.accommodations)
    .values({
      ...acc,
      address: null,
      costPerNight: null,
      nights: null,
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
    stopId: null, // Jun 23 — travelers in Atlanta
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
    stopId: null, // Jun 22 — travelers in Atlanta
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
    stopId: null, // Jun 22 — travelers in Atlanta
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
    stopId: stopIds.atlanta, // Jun 22-24, match Jun 24
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
  db.insert(schema.matches)
    .values({
      ...match,
      ticketStatus: "none",
      ticketPrice: null,
      ticketUrl: null,
      ticketNotes: null,
      fanZone: null,
      attending: false,
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
    stopId: stopIds.atlanta,
    matchId: null,
    title: "Drive to Atlanta",
    type: "travel" as const,
    startTime: "07:00",
    endTime: null,
    location: null,
    confirmed: false,
    sortOrder: 1,
    notes: "~9.5 hours - long drive day!",
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
    items: ["England shirt", "Scarf", "Bucket hat"],
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
    votes: JSON.stringify(["Joe", "Jonny", "Greg"]),
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
    votes: JSON.stringify(["Joe", "Jonny"]),
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
    votes: JSON.stringify(["Greg"]),
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
    votes: JSON.stringify(["Joe", "Greg"]),
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
    votes: JSON.stringify(["Joe", "Jonny"]),
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
    votes: JSON.stringify([]),
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
    votes: JSON.stringify([]),
    addedBy: "Joe",
    notes: "Free — can combine with a walk along the Charles River",
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
    votes: JSON.stringify(["Jonny"]),
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
    votes: JSON.stringify(["Joe", "Greg"]),
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
    votes: JSON.stringify(["Joe"]),
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
    votes: JSON.stringify([]),
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
    votes: JSON.stringify(["Joe", "Jonny"]),
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
    votes: JSON.stringify(["Joe", "Jonny", "Greg"]),
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
    votes: JSON.stringify(["Jonny", "Greg"]),
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
    votes: JSON.stringify(["Greg"]),
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
    votes: JSON.stringify(["Joe", "Jonny"]),
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
    votes: JSON.stringify(["Joe", "Jonny", "Greg"]),
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
    votes: JSON.stringify(["Joe", "Greg"]),
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
    votes: JSON.stringify([]),
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
    votes: JSON.stringify(["Jonny"]),
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
    votes: JSON.stringify(["Joe", "Jonny"]),
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
    votes: JSON.stringify(["Joe", "Jonny", "Greg"]),
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
    votes: JSON.stringify(["Joe", "Greg"]),
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
    votes: JSON.stringify(["Jonny"]),
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
    votes: JSON.stringify(["Joe", "Jonny"]),
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
    votes: JSON.stringify(["Jonny", "Greg"]),
    addedBy: "Jonny",
    notes: "Good crawl route: Board Room → Dirty Habit → The Admiral",
  },

  // --- Atlanta ---
  {
    id: ulid(),
    stopId: stopIds.atlanta,
    title: "World of Coca-Cola",
    category: "activity" as const,
    description: "Interactive museum dedicated to Coca-Cola history with unlimited tastings from around the world",
    url: "https://www.worldofcoca-cola.com/",
    address: "121 Baker St NW, Atlanta, GA 30313",
    estimatedCost: 22,
    estimatedDuration: "2 hours",
    votes: JSON.stringify(["Greg"]),
    addedBy: "Greg",
    notes: "Taste room has drinks from 100+ countries",
  },
  {
    id: ulid(),
    stopId: stopIds.atlanta,
    title: "Georgia Aquarium",
    category: "activity" as const,
    description: "Largest aquarium in the Western Hemisphere — whale sharks, beluga whales, manta rays",
    url: "https://www.georgiaaquarium.org/",
    address: "225 Baker St NW, Atlanta, GA 30313",
    estimatedCost: 45,
    estimatedDuration: "3 hours",
    votes: JSON.stringify(["Joe", "Greg"]),
    addedBy: "Joe",
    notes: "Next door to World of Coca-Cola — do both in one go",
  },
  {
    id: ulid(),
    stopId: stopIds.atlanta,
    title: "Ponce City Market",
    category: "food" as const,
    description: "Huge food hall and rooftop amusement park in a converted Sears building on the BeltLine",
    url: "https://www.poncecitymarket.com/",
    address: "675 Ponce De Leon Ave NE, Atlanta, GA 30308",
    estimatedCost: 25,
    estimatedDuration: "2 hours",
    votes: JSON.stringify(["Joe", "Jonny"]),
    addedBy: "Jonny",
    notes: "Rooftop has mini golf, games, and great views of the Atlanta skyline",
  },
  {
    id: ulid(),
    stopId: stopIds.atlanta,
    title: "Stats Brewpub — World Cup Watch",
    category: "sports_bar" as const,
    description: "Sports bar right across from Mercedes-Benz Stadium with 70+ TVs",
    url: null,
    address: "300 Marietta St NW, Atlanta, GA 30313",
    estimatedCost: 30,
    estimatedDuration: "2 hours",
    votes: JSON.stringify(["Jonny"]),
    addedBy: "Jonny",
    notes: "Walking distance to the stadium — perfect for pre/post match",
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
    votes: JSON.stringify(["Joe", "Jonny", "Greg"]),
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
    votes: JSON.stringify(["Greg"]),
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
    votes: JSON.stringify(["Joe", "Jonny"]),
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
    votes: JSON.stringify(["Joe", "Greg"]),
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
    votes: JSON.stringify(["Jonny"]),
    addedBy: "Jonny",
    notes: "Day pass may be needed if not a guest — check availability",
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
    votes: JSON.stringify(["Joe"]),
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
      { text: "Bleacher Bar (Fenway)", votes: ["Joe", "Greg"] },
      { text: "The Banshee (Dorchester)", votes: ["Jonny"] },
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
      { text: "Classic Rock", votes: ["Joe"] },
      { text: "Hip Hop/R&B", votes: ["Greg"] },
      { text: "Country", votes: [] },
      { text: "EDM/Dance", votes: ["Jonny"] },
    ]),
    addedBy: "Joe",
  },
  {
    id: ulid(),
    stopId: stopIds.miami,
    title: "Group dinner preference in Miami?",
    category: "food" as const,
    options: JSON.stringify([
      { text: "Seafood", votes: ["Joe"] },
      { text: "Cuban", votes: ["Jonny", "Greg"] },
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
      { text: "Dupont Circle bar crawl", votes: ["Jonny", "Greg"] },
      { text: "Georgetown waterfront", votes: ["Joe"] },
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
    notes: "All 3 need to apply. $21 per person. Apply at least 72 hours before travel.",
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
    notes: "Pick up Boston, drop off Miami. Need full-size for 3 + luggage. Joe driving.",
  },
  {
    id: ulid(),
    title: "Research Atlanta → Miami options",
    category: "transport" as const,
    status: "todo" as const,
    priority: 2,
    dueDate: "2026-04-01",
    notes: "10hr drive is brutal. Consider internal flight? Or drive overnight? Budget flights ~$80-150pp",
  },
  {
    id: ulid(),
    title: "Research DC → Atlanta options",
    category: "transport" as const,
    status: "todo" as const,
    priority: 2,
    dueDate: "2026-04-01",
    notes: "9.5hr drive. Could fly and rent second car? Or push through in one day",
  },
  {
    id: ulid(),
    title: "Download Google Maps offline for East Coast",
    category: "transport" as const,
    status: "todo" as const,
    priority: 1,
    dueDate: "2026-06-10",
    notes: "Boston, NYC, Philly, DC, Atlanta, Miami + routes between",
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
    title: "Confirm Lisa's place (Boston)",
    category: "accommodation" as const,
    status: "todo" as const,
    priority: 2,
    dueDate: "2026-05-15",
    notes: "New Hampshire, 1hr from Boston. Check dates Jun 11-14",
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
    title: "Confirm DC place (friend's sister)",
    category: "accommodation" as const,
    status: "todo" as const,
    priority: 2,
    dueDate: "2026-05-15",
    notes: "Jun 19-22, 3 nights",
  },
  {
    id: ulid(),
    title: "Book Atlanta accommodation",
    category: "accommodation" as const,
    status: "todo" as const,
    priority: 3,
    dueDate: "2026-04-01",
    notes: "Jun 22-24, 2 nights. Near Mercedes-Benz Stadium ideally",
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
    notes: "Consider Revolut/Wise card if high fees",
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
    title: "World Cup ticket secondary market",
    category: "booking" as const,
    status: "todo" as const,
    priority: 3,
    notes: "Monitor StubHub, Viagogo, SeatGeek for East Coast matches. Target: England vs Ghana (Boston Jun 23), Scotland vs Brazil (Miami Jun 24)",
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

const expenseData = [
  // Transport (3)
  { id: ulid(), desc: "Uber to Gillette Stadium", amount: 45, cat: "transport" as const, paidBy: joe.id, date: "2026-06-13", stopId: stopIds.boston },
  { id: ulid(), desc: "Gas — Boston to New York", amount: 62, cat: "transport" as const, paidBy: greg.id, date: "2026-06-14", stopId: stopIds.nyc },
  { id: ulid(), desc: "Tolls — I-95 to Philadelphia", amount: 28, cat: "transport" as const, paidBy: joe.id, date: "2026-06-17", stopId: stopIds.philly },

  // Food (4)
  { id: ulid(), desc: "Lobster dinner at Legal Sea Foods", amount: 120, cat: "food" as const, paidBy: jonny.id, date: "2026-06-12", stopId: stopIds.boston },
  { id: ulid(), desc: "Joe's Pizza — NYC classic slices", amount: 24, cat: "food" as const, paidBy: joe.id, date: "2026-06-15", stopId: stopIds.nyc },
  { id: ulid(), desc: "Pat's King of Steaks — cheesesteaks", amount: 36, cat: "food" as const, paidBy: greg.id, date: "2026-06-18", stopId: stopIds.philly },
  { id: ulid(), desc: "Ben's Chili Bowl — half-smokes", amount: 42, cat: "food" as const, paidBy: jonny.id, date: "2026-06-20", stopId: stopIds.dc },

  // Tickets (2)
  { id: ulid(), desc: "Haiti vs Scotland — Gillette Stadium", amount: 210, cat: "tickets" as const, paidBy: joe.id, date: "2026-06-13", stopId: stopIds.boston },
  { id: ulid(), desc: "Scotland vs Brazil — Hard Rock Stadium", amount: 450, cat: "tickets" as const, paidBy: jonny.id, date: "2026-06-24", stopId: stopIds.miami },

  // Accommodation (2)
  { id: ulid(), desc: "Airbnb — NYC 3 nights", amount: 540, cat: "accommodation" as const, paidBy: greg.id, date: "2026-06-14", stopId: stopIds.nyc },
  { id: ulid(), desc: "Hotel — Atlanta 2 nights", amount: 280, cat: "accommodation" as const, paidBy: joe.id, date: "2026-06-22", stopId: stopIds.atlanta },

  // Drinks (2)
  { id: ulid(), desc: "230 Fifth rooftop bar", amount: 78, cat: "drinks" as const, paidBy: jonny.id, date: "2026-06-15", stopId: stopIds.nyc },
  { id: ulid(), desc: "Dupont Circle bar crawl", amount: 96, cat: "drinks" as const, paidBy: greg.id, date: "2026-06-21", stopId: stopIds.dc },

  // Activities (2)
  { id: ulid(), desc: "World of Coca-Cola tickets", amount: 66, cat: "activities" as const, paidBy: joe.id, date: "2026-06-23", stopId: stopIds.atlanta },
  { id: ulid(), desc: "Wynwood Walls admission", amount: 36, cat: "activities" as const, paidBy: greg.id, date: "2026-06-25", stopId: stopIds.miami },
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

// Log expense summary by payer
const paidByName: Record<string, number> = { Joe: 0, Jonny: 0, Greg: 0 };
for (const e of expenseData) {
  if (e.paidBy === joe.id) paidByName.Joe += e.amount;
  else if (e.paidBy === jonny.id) paidByName.Jonny += e.amount;
  else paidByName.Greg += e.amount;
}
const totalExpenses = expenseData.reduce((s, e) => s + e.amount, 0);
console.log(`  ${expenseData.length} expenses totalling $${totalExpenses}`);
for (const [name, amt] of Object.entries(paidByName)) {
  console.log(`    ${name} paid: $${amt}`);
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
console.log("========================================");

sqlite.close();
