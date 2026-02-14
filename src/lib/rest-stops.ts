// ============================================================================
// Rest Stop Planner Data
// Curated rest stops along the Boston -> NYC -> Philly -> DC -> Nashville -> Miami
// route. Stops are chosen at ~2-hour intervals for driver alertness.
// ============================================================================

export type RestStop = {
  leg: string; // e.g. "Boston → NYC"
  name: string;
  location: string;
  milesFromStart: number; // miles into the leg
  estimatedTime: string; // "~1h 15m from start"
  type: "service_plaza" | "rest_area" | "town_stop";
  hasGas: boolean;
  hasFood: boolean;
  hasRestrooms: boolean;
  foodOptions: string[];
  notes: string;
  mapsUrl: string;
};

export const REST_STOPS: RestStop[] = [
  // ── Boston → NYC (215 miles, ~3.5 hrs) ──────────────────────────────
  {
    leg: "Boston \u2192 NYC",
    name: "Charlton Service Plaza",
    location: "I-90, Charlton, MA",
    milesFromStart: 55,
    estimatedTime: "~50 min",
    type: "service_plaza",
    hasGas: true,
    hasFood: true,
    hasRestrooms: true,
    foodOptions: ["McDonald's", "Dunkin'", "Starbucks"],
    notes:
      "Massachusetts Turnpike rest stop. Good place for first break.",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Charlton+Service+Plaza+I-90",
  },
  {
    leg: "Boston \u2192 NYC",
    name: "Connecticut Welcome Center",
    location: "I-84, Danbury, CT",
    milesFromStart: 120,
    estimatedTime: "~1h 50m",
    type: "rest_area",
    hasGas: false,
    hasFood: false,
    hasRestrooms: true,
    foodOptions: [],
    notes:
      "Basic rest area with restrooms and vending machines. Gas available at nearby exits.",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Connecticut+Welcome+Center+I-84",
  },

  // ── NYC → Philly (97 miles, ~1.5 hrs) ───────────────────────────────
  {
    leg: "NYC \u2192 Philly",
    name: "Woodbridge Service Area",
    location: "NJ Turnpike, Woodbridge, NJ",
    milesFromStart: 25,
    estimatedTime: "~25 min",
    type: "service_plaza",
    hasGas: true,
    hasFood: true,
    hasRestrooms: true,
    foodOptions: ["Burger King", "Nathan's", "Sbarro", "Starbucks"],
    notes:
      "NJ Turnpike service area. Good for quick stop. Gets busy.",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Woodbridge+Service+Area+NJ+Turnpike",
  },

  // ── Philly → DC (140 miles, ~2.5 hrs) ───────────────────────────────
  {
    leg: "Philly \u2192 DC",
    name: "Chesapeake House",
    location: "I-95, North East, MD",
    milesFromStart: 65,
    estimatedTime: "~1h",
    type: "service_plaza",
    hasGas: true,
    hasFood: true,
    hasRestrooms: true,
    foodOptions: ["Popeyes", "Starbucks", "Pizza Hut", "Panda Express"],
    notes:
      "Maryland House travel plaza on I-95. Great midway stop. Maryland crab cakes available!",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Chesapeake+House+I-95+Maryland",
  },

  // ── DC → Nashville (660 miles, ~9.5 hrs) ────────────────────────────
  {
    leg: "DC \u2192 Nashville",
    name: "Staunton, VA",
    location: "I-81, Staunton, VA (Exit 222)",
    milesFromStart: 150,
    estimatedTime: "~2h 15m",
    type: "town_stop",
    hasGas: true,
    hasFood: true,
    hasRestrooms: true,
    foodOptions: ["Cracker Barrel", "Chick-fil-A", "local diners"],
    notes:
      "Charming small town in Shenandoah Valley. Good for a proper meal stop.",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Staunton+VA+restaurants",
  },
  {
    leg: "DC \u2192 Nashville",
    name: "Wytheville, VA",
    location: "I-81/I-77, Wytheville, VA",
    milesFromStart: 320,
    estimatedTime: "~4h 45m",
    type: "town_stop",
    hasGas: true,
    hasFood: true,
    hasRestrooms: true,
    foodOptions: ["Waffle House", "Subway", "Wendy's", "local BBQ"],
    notes:
      "Good halfway point. Multiple gas stations and fast food at the interchange.",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Wytheville+VA",
  },
  {
    leg: "DC \u2192 Nashville",
    name: "Knoxville, TN",
    location: "I-40/I-75, Knoxville, TN",
    milesFromStart: 500,
    estimatedTime: "~7h",
    type: "town_stop",
    hasGas: true,
    hasFood: true,
    hasRestrooms: true,
    foodOptions: ["Waffle House", "Cracker Barrel", "Zaxby's", "local BBQ"],
    notes:
      "Major city \u2014 good for a longer break. 2.5 hrs to Nashville from here.",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Knoxville+TN+restaurants+I-40",
  },

  // ── Nashville → Miami (780 miles, ~11.5 hrs) ────────────────────────
  {
    leg: "Nashville \u2192 Miami",
    name: "Chattanooga, TN",
    location: "I-24, Chattanooga, TN",
    milesFromStart: 130,
    estimatedTime: "~2h",
    type: "town_stop",
    hasGas: true,
    hasFood: true,
    hasRestrooms: true,
    foodOptions: [
      "Waffle House",
      "Chick-fil-A",
      "local BBQ",
      "Cracker Barrel",
    ],
    notes:
      "Nice city worth a quick explore. Lookout Mountain is nearby if you have time.",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Chattanooga+TN+restaurants",
  },
  {
    leg: "Nashville \u2192 Miami",
    name: "Macon, GA",
    location: "I-75, Macon, GA",
    milesFromStart: 340,
    estimatedTime: "~5h",
    type: "town_stop",
    hasGas: true,
    hasFood: true,
    hasRestrooms: true,
    foodOptions: [
      "Waffle House",
      "Zaxby's",
      "Chick-fil-A",
      "H&H Soul Food",
    ],
    notes:
      "Roughly halfway. H&H Soul Food is legendary if you can swing it.",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Macon+GA+restaurants+I-75",
  },
  {
    leg: "Nashville \u2192 Miami",
    name: "Lake City, FL",
    location: "I-75, Lake City, FL",
    milesFromStart: 530,
    estimatedTime: "~7.5h",
    type: "town_stop",
    hasGas: true,
    hasFood: true,
    hasRestrooms: true,
    foodOptions: [
      "Waffle House",
      "Wendy's",
      "Burger King",
      "gas station food",
    ],
    notes:
      "Welcome to Florida. Good spot to refuel before the final push south.",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Lake+City+FL+gas+stations+I-75",
  },
  {
    leg: "Nashville \u2192 Miami",
    name: "Fort Pierce Service Plaza",
    location: "Florida Turnpike, Fort Pierce, FL",
    milesFromStart: 680,
    estimatedTime: "~10h",
    type: "service_plaza",
    hasGas: true,
    hasFood: true,
    hasRestrooms: true,
    foodOptions: ["Starbucks", "Burger King", "Subway"],
    notes: "Last major stop before Miami. About 2hrs to go.",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Fort+Pierce+Service+Plaza+Florida+Turnpike",
  },
];

// ── Leg metadata for display ────────────────────────────────────────

export type LegInfo = {
  leg: string;
  totalMiles: number;
  estimatedDrive: string;
};

export const LEG_INFO: LegInfo[] = [
  { leg: "Boston \u2192 NYC", totalMiles: 215, estimatedDrive: "~3.5 hrs" },
  { leg: "NYC \u2192 Philly", totalMiles: 97, estimatedDrive: "~1.5 hrs" },
  { leg: "Philly \u2192 DC", totalMiles: 140, estimatedDrive: "~2.5 hrs" },
  { leg: "DC \u2192 Nashville", totalMiles: 660, estimatedDrive: "~9.5 hrs" },
  {
    leg: "Nashville \u2192 Miami",
    totalMiles: 780,
    estimatedDrive: "~11.5 hrs",
  },
];
