// ============ SCENIC DETOURS & SIDE TRIPS ============
// Optional detours and side trips along the Boston -> Miami route.
// Real destinations with accurate mileage and timing estimates.

export type ScenicDetour = {
  id: string;
  name: string;
  tagline: string;
  nearestLeg: string;
  detourFromCity: string;
  detourMiles: number;
  detourHours: number;
  description: string;
  highlights: string[];
  bestFor: string;
  season: string;
  difficulty: "easy" | "moderate" | "ambitious";
  overnightNeeded: boolean;
  estimatedCost: string;
  image?: string;
};

export const SCENIC_DETOURS: ScenicDetour[] = [
  // ── 1. Blue Ridge Parkway ─────────────────────────────────────────
  {
    id: "blue-ridge-parkway",
    name: "Blue Ridge Parkway",
    tagline: "America's favourite drive",
    nearestLeg: "DC \u2192 Nashville",
    detourFromCity: "Staunton or Roanoke, VA",
    detourMiles: 60,
    detourHours: 3,
    description:
      "America's favorite drive. 469 miles of mountain vistas, wildflower meadows, and zero traffic lights. You don't have to do the whole thing \u2014 the 80-mile stretch from Waynesboro to Roanoke is the greatest hits.",
    highlights: [
      "Humpback Rocks viewpoint",
      "Peaks of Otter",
      "Mabry Mill (most photographed spot on the Blue Ridge)",
    ],
    bestFor: "Nature lovers, photographers",
    season: "June is peak season \u2014 wildflowers, perfect temperatures at elevation",
    difficulty: "moderate",
    overnightNeeded: false,
    estimatedCost: "$20\u201340",
    image: "Mountain ridgeline with layered blue peaks fading into morning mist, wildflowers in the foreground",
  },

  // ── 2. Shenandoah / Skyline Drive ────────────────────────────────
  {
    id: "shenandoah-skyline-drive",
    name: "Shenandoah National Park",
    tagline: "75 overlooks, one mountain ridge",
    nearestLeg: "DC \u2192 Nashville",
    detourFromCity: "Front Royal, VA (just off I-66)",
    detourMiles: 40,
    detourHours: 2.5,
    description:
      "105 miles of mountain ridge driving with 75 overlooks. Deer, black bears, and the best sunsets on the East Coast. The first 30 miles from Front Royal are the most dramatic.",
    highlights: [
      "Stony Man summit (easy 1.6mi hike)",
      "Big Meadows",
      "Shenandoah River overlook",
    ],
    bestFor: "Nature lovers, hikers",
    season: "June is ideal \u2014 long days, lush greenery, clear mountain air",
    difficulty: "easy",
    overnightNeeded: false,
    estimatedCost: "$30 (park entrance fee per vehicle)",
    image: "Lush green mountain valley with morning fog rolling through, overlook with wooden fence",
  },

  // ── 3. Lookout Mountain & Rock City ──────────────────────────────
  {
    id: "lookout-mountain-rock-city",
    name: "Lookout Mountain & Rock City",
    tagline: "See 7 states from one spot",
    nearestLeg: "Nashville \u2192 Miami",
    detourFromCity: "Chattanooga, TN",
    detourMiles: 10,
    detourHours: 2,
    description:
      "See 7 states from one viewpoint. Rock City is peak Americana \u2014 gardens, rock formations, gnome caves. Tacky but unforgettable. Ruby Falls is an underground waterfall.",
    highlights: [
      "Rock City (\u201cSee Rock City\u201d barns)",
      "Ruby Falls underground waterfall",
      "Incline Railway (steepest passenger railway in the world)",
      "Point Park Civil War site",
    ],
    bestFor: "American kitsch enthusiasts",
    season: "Open year-round \u2014 June means outdoor gardens are at their best",
    difficulty: "easy",
    overnightNeeded: false,
    estimatedCost: "$25\u201345",
    image: "Dramatic cliff overlook with a vast panorama of valleys and distant states, rock formations in a garden",
  },

  // ── 4. Key West ──────────────────────────────────────────────────
  {
    id: "key-west",
    name: "Key West Day Trip",
    tagline: "42 bridges to the edge of America",
    nearestLeg: "Miami (end of trip)",
    detourFromCity: "Miami",
    detourMiles: 300,
    detourHours: 7,
    description:
      "The southernmost point in the US. 42 bridges over turquoise water on the Overseas Highway \u2014 one of the world's greatest drives. Hemingway's house, sunset at Mallory Square, key lime pie.",
    highlights: [
      "Seven Mile Bridge",
      "Mallory Square sunset",
      "Hemingway House (polydactyl cats)",
      "Duval Street bars",
      "Snorkelling at Bahia Honda",
    ],
    bestFor: "Everyone \u2014 it's a bucket-list drive",
    season: "June is hot and humid but the water is perfect for snorkelling",
    difficulty: "ambitious",
    overnightNeeded: true,
    estimatedCost: "$150\u2013250",
    image: "Turquoise ocean water stretching to the horizon, a long bridge connecting small green keys",
  },

  // ── 5. Savannah Quick Stop ───────────────────────────────────────
  {
    id: "savannah-quick-stop",
    name: "Savannah Quick Stop",
    tagline: "Spanish moss and garden squares",
    nearestLeg: "Nashville \u2192 Miami",
    detourFromCity: "I-95 through Georgia",
    detourMiles: 20,
    detourHours: 1,
    description:
      "The most beautiful city in the South. Spanish moss, 22 garden squares, a riverfront lined with restaurants. Worth a 2-hour wander even if you don't stay.",
    highlights: [
      "Forsyth Park fountain",
      "River Street",
      "Leopold's Ice Cream (queue but worth it)",
      "SCAD art everywhere",
    ],
    bestFor: "History buffs, architecture lovers",
    season: "Warm in June \u2014 but the tree canopy keeps the squares shaded",
    difficulty: "easy",
    overnightNeeded: false,
    estimatedCost: "$15\u201330",
    image: "Tree-lined square draped in Spanish moss, a fountain at the centre, historic brick buildings",
  },

  // ── 6. Cape Canaveral / Kennedy Space Center ─────────────────────
  {
    id: "cape-canaveral",
    name: "Kennedy Space Center",
    tagline: "Rockets, shuttles, bucket-list stuff",
    nearestLeg: "Nashville \u2192 Miami (via Orlando)",
    detourFromCity: "Orlando area",
    detourMiles: 100,
    detourHours: 3,
    description:
      "Watch a rocket launch (if timing works), see the actual Space Shuttle Atlantis, walk through the Vehicle Assembly Building. Pure bucket-list stuff.",
    highlights: [
      "Space Shuttle Atlantis exhibit",
      "Saturn V rocket",
      "Launch viewing (check schedule)",
      "Astronaut Hall of Fame",
    ],
    bestFor: "Everyone \u2014 it's incredible",
    season: "Open year-round \u2014 check the launch schedule for June dates",
    difficulty: "moderate",
    overnightNeeded: false,
    estimatedCost: "$75 (admission)",
    image: "Space shuttle on the launch pad with blue sky, palm trees in the foreground",
  },

  // ── 7. Great Smoky Mountains ─────────────────────────────────────
  {
    id: "great-smoky-mountains",
    name: "Great Smoky Mountains",
    tagline: "America's most visited national park",
    nearestLeg: "DC \u2192 Nashville",
    detourFromCity: "Knoxville, TN",
    detourMiles: 60,
    detourHours: 3,
    description:
      "America's most visited national park. Free admission. The drive through Newfound Gap is stunning \u2014 Cherokee on one side, Gatlinburg on the other.",
    highlights: [
      "Clingmans Dome viewpoint (highest point in TN)",
      "Cades Cove loop",
      "Gatlinburg (tourist town, pancakes, moonshine distilleries)",
    ],
    bestFor: "Nature lovers",
    season: "June is glorious \u2014 synchronous fireflies if you're lucky",
    difficulty: "moderate",
    overnightNeeded: false,
    estimatedCost: "Free (national park admission)",
    image: "Misty blue-green mountain ridges layered to the horizon, dense forest below",
  },

  // ── 8. Bourbon Trail Quick Hit ───────────────────────────────────
  {
    id: "bourbon-trail",
    name: "Bourbon Trail Quick Hit",
    tagline: "Tennessee whiskey, Kentucky bourbon",
    nearestLeg: "DC \u2192 Nashville (or Nashville day trip)",
    detourFromCity: "Nashville",
    detourMiles: 200,
    detourHours: 4,
    description:
      "Cross into Kentucky for a taste of Bourbon Country. Jack Daniel's is actually in Lynchburg, TN \u2014 just 75 miles from Nashville.",
    highlights: [
      "Jack Daniel's Distillery (Lynchburg, TN \u2014 closest)",
      "George Dickel Distillery (Tullahoma, TN)",
      "Or cross to Kentucky for Maker's Mark / Woodford Reserve",
    ],
    bestFor: "Whisky lovers (British spelling intentional)",
    season: "Distilleries run tours year-round \u2014 book ahead in June",
    difficulty: "moderate",
    overnightNeeded: false,
    estimatedCost: "$20\u201350 (tour + tastings)",
    image: "Rows of charred oak bourbon barrels in a dim rick house, amber light filtering through slats",
  },
];
