// ============ ROUTE SCENARIO TYPES & DATA ============
// Pre-computed route scenarios for the East Coast World Cup 2026 road trip.
// All coordinates match ROUTE_STOPS in constants.ts. Pure data — no imports needed.

export type RouteLeg = {
  type: "drive" | "flight" | "train";
  from: { name: string; lat: number; lng: number };
  to: { name: string; lat: number; lng: number };
  miles: number;
  hours: number;
  minutes: number;
};

export type RouteScenario = {
  id: string;
  name: string;
  tagline: string;
  totalMiles: number;
  totalDriveHours: number;
  totalDriveMinutes: number;
  totalTrainHours?: number;
  totalTrainMinutes?: number;
  flightCount: number;
  estimatedFlightCostPP: number; // per person
  estimatedTrainCostPP?: number; // per person
  pros: string[];
  cons: string[];
  legs: RouteLeg[];
};

// Reusable city coordinate references
const BOSTON = { name: "Boston", lat: 42.3601, lng: -71.0589 };
const NEW_YORK = { name: "New York", lat: 40.7128, lng: -74.006 };
const PHILADELPHIA = { name: "Philadelphia", lat: 39.9526, lng: -75.1652 };
const WASHINGTON_DC = { name: "Washington DC", lat: 38.9072, lng: -77.0369 };
const ATLANTA = { name: "Atlanta", lat: 33.749, lng: -84.388 };
const MIAMI = { name: "Miami", lat: 25.7617, lng: -80.1918 };
const CHARLOTTE = { name: "Charlotte", lat: 35.2271, lng: -80.8431 };
const NASHVILLE = { name: "Nashville", lat: 36.1627, lng: -86.7816 };
const CHARLESTON = { name: "Charleston", lat: 32.7765, lng: -79.9311 };
const SAVANNAH = { name: "Savannah", lat: 32.0809, lng: -81.0912 };
const ORLANDO = { name: "Orlando", lat: 28.5383, lng: -81.3792 };

export const ROUTE_SCENARIOS: RouteScenario[] = [
  // ── 1. The Full Road Trip ──────────────────────────────────────────
  {
    id: "full-road-trip",
    name: "The Full Road Trip",
    tagline: "See it all, drive it all",
    totalMiles: 1900,
    totalDriveHours: 29,
    totalDriveMinutes: 15,
    flightCount: 0,
    estimatedFlightCostPP: 0,
    pros: [
      "Maximum flexibility — stop anywhere, change plans on the fly",
      "See every host city on the route",
      "Cheapest option with no flight costs",
    ],
    cons: [
      "29+ hours of total driving",
      "Exhausting DC → Nashville leg (9h 40m)",
      "Exhausting Nashville → Miami leg (11h 30m)",
    ],
    legs: [
      {
        type: "drive",
        from: BOSTON,
        to: NEW_YORK,
        miles: 215,
        hours: 3,
        minutes: 45,
      },
      {
        type: "drive",
        from: NEW_YORK,
        to: PHILADELPHIA,
        miles: 95,
        hours: 1,
        minutes: 50,
      },
      {
        type: "drive",
        from: PHILADELPHIA,
        to: WASHINGTON_DC,
        miles: 140,
        hours: 2,
        minutes: 30,
      },
      {
        type: "drive",
        from: WASHINGTON_DC,
        to: NASHVILLE,
        miles: 670,
        hours: 9,
        minutes: 40,
      },
      {
        type: "drive",
        from: NASHVILLE,
        to: MIAMI,
        miles: 780,
        hours: 11,
        minutes: 30,
      },
    ],
  },

  // ── 2. Skip Nashville ──────────────────────────────────────────────
  {
    id: "skip-nashville",
    name: "Skip Nashville",
    tagline: "Fly south, skip the drive",
    totalMiles: 450,
    totalDriveHours: 8,
    totalDriveMinutes: 5,
    flightCount: 1,
    estimatedFlightCostPP: 130,
    pros: [
      "Eliminates 21+ hours of driving south of DC",
      "Arrive in Miami fresh and ready for matches",
    ],
    cons: [
      "Skips Nashville — the group's preferred stop",
      "One-way flight cost adds up for the group",
    ],
    legs: [
      {
        type: "drive",
        from: BOSTON,
        to: NEW_YORK,
        miles: 215,
        hours: 3,
        minutes: 45,
      },
      {
        type: "drive",
        from: NEW_YORK,
        to: PHILADELPHIA,
        miles: 95,
        hours: 1,
        minutes: 50,
      },
      {
        type: "drive",
        from: PHILADELPHIA,
        to: WASHINGTON_DC,
        miles: 140,
        hours: 2,
        minutes: 30,
      },
      {
        type: "flight",
        from: WASHINGTON_DC,
        to: MIAMI,
        miles: 1050,
        hours: 3,
        minutes: 0,
      },
    ],
  },

  // ── 3. Fly the Long Legs ───────────────────────────────────────────
  {
    id: "fly-long-legs",
    name: "Fly the Long Legs",
    tagline: "Best of both worlds",
    totalMiles: 450,
    totalDriveHours: 8,
    totalDriveMinutes: 5,
    flightCount: 2,
    estimatedFlightCostPP: 220,
    pros: [
      "Visits every host city on the route",
      "No brutal 9–11 hour drives",
      "Saves 21+ hours of driving vs. the full road trip",
    ],
    cons: [
      "Most expensive option for flights",
      "Airport logistics at two stops",
      "Less flexibility on southern legs",
    ],
    legs: [
      {
        type: "drive",
        from: BOSTON,
        to: NEW_YORK,
        miles: 215,
        hours: 3,
        minutes: 45,
      },
      {
        type: "drive",
        from: NEW_YORK,
        to: PHILADELPHIA,
        miles: 95,
        hours: 1,
        minutes: 50,
      },
      {
        type: "drive",
        from: PHILADELPHIA,
        to: WASHINGTON_DC,
        miles: 140,
        hours: 2,
        minutes: 30,
      },
      {
        type: "flight",
        from: WASHINGTON_DC,
        to: NASHVILLE,
        miles: 480,
        hours: 1,
        minutes: 30,
      },
      {
        type: "flight",
        from: NASHVILLE,
        to: MIAMI,
        miles: 780,
        hours: 2,
        minutes: 30,
      },
    ],
  },

  // ── 4. The Express ─────────────────────────────────────────────────
  {
    id: "the-express",
    name: "The Express",
    tagline: "Minimum driving, maximum time",
    totalMiles: 235,
    totalDriveHours: 4,
    totalDriveMinutes: 20,
    flightCount: 2,
    estimatedFlightCostPP: 260,
    pros: [
      "Fastest overall — more time enjoying each city",
      "Least fatigue of any scenario",
    ],
    cons: [
      "Most expensive total flight cost",
      "Skips Nashville and Atlanta",
      "Less of a road trip feel",
    ],
    legs: [
      {
        type: "flight",
        from: BOSTON,
        to: NEW_YORK,
        miles: 190,
        hours: 1,
        minutes: 15,
      },
      {
        type: "drive",
        from: NEW_YORK,
        to: PHILADELPHIA,
        miles: 95,
        hours: 1,
        minutes: 50,
      },
      {
        type: "drive",
        from: PHILADELPHIA,
        to: WASHINGTON_DC,
        miles: 140,
        hours: 2,
        minutes: 30,
      },
      {
        type: "flight",
        from: WASHINGTON_DC,
        to: MIAMI,
        miles: 1050,
        hours: 3,
        minutes: 0,
      },
    ],
  },

  // ── 5. The Coastal Cruise ──────────────────────────────────────────
  {
    id: "coastal-cruise",
    name: "The Coastal Cruise",
    tagline: "The scenic southern route",
    totalMiles: 1750,
    totalDriveHours: 27,
    totalDriveMinutes: 35,
    flightCount: 0,
    estimatedFlightCostPP: 0,
    pros: [
      "Scenic I-85 corridor through the Carolinas",
      "Potential pitstop in Charlotte for a break",
      "Sees every host city on the route",
    ],
    cons: [
      "Skips Nashville \u2014 the group\u2019s preferred stop",
      "Extra driving through Charlotte adds a detour",
      "Charlotte has no World Cup matches",
    ],
    legs: [
      {
        type: "drive",
        from: BOSTON,
        to: NEW_YORK,
        miles: 215,
        hours: 3,
        minutes: 45,
      },
      {
        type: "drive",
        from: NEW_YORK,
        to: PHILADELPHIA,
        miles: 95,
        hours: 1,
        minutes: 50,
      },
      {
        type: "drive",
        from: PHILADELPHIA,
        to: WASHINGTON_DC,
        miles: 140,
        hours: 2,
        minutes: 30,
      },
      {
        type: "drive",
        from: WASHINGTON_DC,
        to: CHARLOTTE,
        miles: 390,
        hours: 5,
        minutes: 45,
      },
      {
        type: "drive",
        from: CHARLOTTE,
        to: ATLANTA,
        miles: 245,
        hours: 3,
        minutes: 45,
      },
      {
        type: "drive",
        from: ATLANTA,
        to: MIAMI,
        miles: 665,
        hours: 10,
        minutes: 0,
      },
    ],
  },

  // ── 6. Nashville Route ──────────────────────────────────────────────
  {
    id: "nashville-route",
    name: "Nashville Route",
    tagline: "The chosen route \u2014 honky-tonks and hot chicken",
    totalMiles: 1900,
    totalDriveHours: 29,
    totalDriveMinutes: 15,
    flightCount: 0,
    estimatedFlightCostPP: 0,
    pros: [
      "The group\u2019s preferred route",
      "Nashville adds world-class nightlife and live music",
      "Broadway honky-tonks and hot chicken are bucket-list worthy",
    ],
    cons: [
      "29+ hours of total driving",
      "Nashville has no World Cup matches",
      "DC \u2192 Nashville is still a 9h 40m slog",
    ],
    legs: [
      {
        type: "drive",
        from: BOSTON,
        to: NEW_YORK,
        miles: 215,
        hours: 3,
        minutes: 45,
      },
      {
        type: "drive",
        from: NEW_YORK,
        to: PHILADELPHIA,
        miles: 95,
        hours: 1,
        minutes: 50,
      },
      {
        type: "drive",
        from: PHILADELPHIA,
        to: WASHINGTON_DC,
        miles: 140,
        hours: 2,
        minutes: 30,
      },
      {
        type: "drive",
        from: WASHINGTON_DC,
        to: NASHVILLE,
        miles: 670,
        hours: 9,
        minutes: 40,
      },
      {
        type: "drive",
        from: NASHVILLE,
        to: MIAMI,
        miles: 780,
        hours: 11,
        minutes: 30,
      },
    ],
  },

  // ── 7. The Lowcountry Route ─────────────────────────────────────────
  {
    id: "lowcountry-route",
    name: "The Lowcountry Route",
    tagline: "Charleston charm, Savannah soul",
    totalMiles: 1670,
    totalDriveHours: 25,
    totalDriveMinutes: 35,
    flightCount: 0,
    estimatedFlightCostPP: 0,
    pros: [
      "Two of America\u2019s most beautiful cities \u2014 Charleston and Savannah",
      "Incredible food scene \u2014 Lowcountry cuisine, seafood, cocktails",
      "Actually shorter total drive than the Atlanta route",
    ],
    cons: [
      "Skips Nashville and Atlanta entirely",
      "No World Cup venues on the southern leg",
      "Charleston \u2192 Miami is still 8+ hours",
    ],
    legs: [
      {
        type: "drive",
        from: BOSTON,
        to: NEW_YORK,
        miles: 215,
        hours: 3,
        minutes: 45,
      },
      {
        type: "drive",
        from: NEW_YORK,
        to: PHILADELPHIA,
        miles: 95,
        hours: 1,
        minutes: 50,
      },
      {
        type: "drive",
        from: PHILADELPHIA,
        to: WASHINGTON_DC,
        miles: 140,
        hours: 2,
        minutes: 30,
      },
      {
        type: "drive",
        from: WASHINGTON_DC,
        to: CHARLESTON,
        miles: 530,
        hours: 7,
        minutes: 30,
      },
      {
        type: "drive",
        from: CHARLESTON,
        to: SAVANNAH,
        miles: 110,
        hours: 1,
        minutes: 45,
      },
      {
        type: "drive",
        from: SAVANNAH,
        to: MIAMI,
        miles: 580,
        hours: 8,
        minutes: 15,
      },
    ],
  },

  // ── 8. The Amtrak Express ───────────────────────────────────────────
  {
    id: "amtrak-express",
    name: "The Amtrak Express",
    tagline: "Ride the rails, fly the rest",
    totalMiles: 445,
    totalDriveHours: 0,
    totalDriveMinutes: 0,
    totalTrainHours: 8,
    totalTrainMinutes: 0,
    flightCount: 2,
    estimatedFlightCostPP: 220,
    estimatedTrainCostPP: 180,
    pros: [
      "Zero driving \u2014 relax, drink, work on the train",
      "Amtrak Northeast Corridor is city-center to city-center",
      "Most civilized way to travel the northern leg",
    ],
    cons: [
      "Most expensive option overall (trains + flights)",
      "Skips Nashville \u2014 flies direct to Atlanta instead",
      "Less schedule flexibility \u2014 tied to train times",
    ],
    legs: [
      {
        type: "train",
        from: BOSTON,
        to: NEW_YORK,
        miles: 215,
        hours: 3,
        minutes: 45,
      },
      {
        type: "train",
        from: NEW_YORK,
        to: PHILADELPHIA,
        miles: 95,
        hours: 1,
        minutes: 30,
      },
      {
        type: "train",
        from: PHILADELPHIA,
        to: WASHINGTON_DC,
        miles: 135,
        hours: 2,
        minutes: 45,
      },
      {
        type: "flight",
        from: WASHINGTON_DC,
        to: ATLANTA,
        miles: 600,
        hours: 2,
        minutes: 0,
      },
      {
        type: "flight",
        from: ATLANTA,
        to: MIAMI,
        miles: 665,
        hours: 2,
        minutes: 0,
      },
    ],
  },

  // ── 9. The Orlando Swing ────────────────────────────────────────────
  {
    id: "orlando-swing",
    name: "The Orlando Swing",
    tagline: "Theme parks and touchdowns",
    totalMiles: 2035,
    totalDriveHours: 30,
    totalDriveMinutes: 30,
    flightCount: 0,
    estimatedFlightCostPP: 0,
    pros: [
      "Orlando adds theme parks, International Drive nightlife",
      "Breaks the brutal Nashville\u2192Miami leg into two manageable drives",
      "Extra day in Orlando for rest and fun",
    ],
    cons: [
      "30+ hours of total driving \u2014 the longest route option",
      "Orlando has no World Cup venues",
      "Temptation to spend too long at theme parks",
    ],
    legs: [
      {
        type: "drive",
        from: BOSTON,
        to: NEW_YORK,
        miles: 215,
        hours: 3,
        minutes: 45,
      },
      {
        type: "drive",
        from: NEW_YORK,
        to: PHILADELPHIA,
        miles: 95,
        hours: 1,
        minutes: 50,
      },
      {
        type: "drive",
        from: PHILADELPHIA,
        to: WASHINGTON_DC,
        miles: 140,
        hours: 2,
        minutes: 30,
      },
      {
        type: "drive",
        from: WASHINGTON_DC,
        to: NASHVILLE,
        miles: 670,
        hours: 9,
        minutes: 40,
      },
      {
        type: "drive",
        from: NASHVILLE,
        to: ORLANDO,
        miles: 680,
        hours: 9,
        minutes: 15,
      },
      {
        type: "drive",
        from: ORLANDO,
        to: MIAMI,
        miles: 235,
        hours: 3,
        minutes: 30,
      },
    ],
  },
];
