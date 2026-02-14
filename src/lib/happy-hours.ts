// ============ HAPPY HOUR FINDER ============
// Best happy hour spots along the
// Boston -> NYC -> Philly -> DC -> Nashville -> Miami route.
// Curated for 3 British lads who appreciate a good deal on drinks.

export type HappyHourSpot = {
  name: string;
  city: string;
  type: "bar" | "restaurant" | "rooftop" | "brewery" | "pub";
  address: string;
  happyHourTimes: string;
  deals: string[];
  atmosphere: string;
  mapsUrl: string;
};

export const HAPPY_HOURS: HappyHourSpot[] = [
  // ── Boston (3) ─────────────────────────────────────────────────────
  {
    name: "The Tam",
    city: "Boston",
    type: "pub",
    address: "222 Tremont St, Boston, MA",
    happyHourTimes: "Mon-Fri 4-7pm",
    deals: ["$5 draft beers", "$7 well cocktails", "$3 off appetizers"],
    atmosphere: "Classic dive bar with character. Cash only!",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=The+Tam+Boston",
  },
  {
    name: "Trillium Brewing",
    city: "Boston",
    type: "brewery",
    address: "369 Congress St, Boston, MA",
    happyHourTimes: "Tue-Fri 3-6pm",
    deals: ["$2 off all drafts", "Free brewery tour with purchase"],
    atmosphere: "Craft beer heaven. Best IPAs in New England.",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Trillium+Brewing+Congress+St+Boston",
  },
  {
    name: "Drink",
    city: "Boston",
    type: "bar",
    address: "348 Congress St, Boston, MA",
    happyHourTimes: "Daily 4-6pm",
    deals: ["$10 classic cocktails (normally $14-16)", "$6 beers"],
    atmosphere:
      "Speakeasy vibe. No menu — tell the bartender what you like.",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Drink+Bar+Congress+St+Boston",
  },

  // ── New York (3) ───────────────────────────────────────────────────
  {
    name: "Rudy's Bar & Grill",
    city: "New York",
    type: "bar",
    address: "627 9th Ave, New York, NY",
    happyHourTimes: "Mon-Sat 8am-4pm (yes, 8am)",
    deals: ["$4 beers", "Free hot dogs with every drink"],
    atmosphere:
      "Legendary Hell's Kitchen dive. Free hot dogs! Cash only.",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Rudys+Bar+Grill+9th+Ave+NYC",
  },
  {
    name: "The Flatiron Room",
    city: "New York",
    type: "bar",
    address: "37 W 26th St, New York, NY",
    happyHourTimes: "Mon-Fri 4-7pm",
    deals: ["$8 cocktails", "$6 draft beers", "Half-price bar bites"],
    atmosphere: "Upscale whiskey bar with live jazz. Treat yourself.",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Flatiron+Room+NYC",
  },
  {
    name: "230 Fifth Rooftop",
    city: "New York",
    type: "rooftop",
    address: "230 5th Ave, New York, NY",
    happyHourTimes: "Mon-Fri 4-7pm",
    deals: ["$8 cocktails", "$5 beers", "Half-price sliders"],
    atmosphere:
      "Rooftop with Empire State Building views. Tourist but worth it.",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=230+Fifth+Rooftop+NYC",
  },

  // ── Philadelphia (2) ───────────────────────────────────────────────
  {
    name: "McGillin's Olde Ale House",
    city: "Philadelphia",
    type: "pub",
    address: "1310 Drury St, Philadelphia, PA",
    happyHourTimes: "Mon-Fri 3-7pm",
    deals: ["$4 domestic drafts", "$5 crafts", "Half-price wings"],
    atmosphere:
      "Oldest pub in Philly (since 1860). Incredible atmosphere.",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=McGillins+Olde+Ale+House+Philadelphia",
  },
  {
    name: "Evil Genius Beer Co.",
    city: "Philadelphia",
    type: "brewery",
    address: "1727 Front St, Philadelphia, PA",
    happyHourTimes: "Wed-Fri 4-6pm",
    deals: ["$2 off pints", "Free brewery tour", "$5 pretzels"],
    atmosphere: "Quirky craft brewery with creative beer names.",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Evil+Genius+Beer+Company+Philadelphia",
  },

  // ── Washington DC (2) ──────────────────────────────────────────────
  {
    name: "Dan's Caf\u00e9",
    city: "Washington DC",
    type: "bar",
    address: "2315 18th St NW, Washington, DC",
    happyHourTimes: "Daily 7pm-3am (drink specials all night)",
    deals: [
      "$3-5 beers",
      "You pour your own drinks from squeeze bottles",
    ],
    atmosphere:
      "The most DC dive bar ever. You pour your own mixers. It's chaos.",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Dans+Cafe+DC",
  },
  {
    name: "The Hamilton",
    city: "Washington DC",
    type: "restaurant",
    address: "600 14th St NW, Washington, DC",
    happyHourTimes: "Mon-Fri 4-7pm",
    deals: ["$6 cocktails", "$4 drafts", "Half-price appetizers"],
    atmosphere: "Upscale but great deals. Near the White House.",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=The+Hamilton+DC+14th+St",
  },

  // ── Nashville (2) ──────────────────────────────────────────────────
  {
    name: "Robert's Western World",
    city: "Nashville",
    type: "bar",
    address: "416 Broadway, Nashville, TN",
    happyHourTimes: "Daily 11am-7pm",
    deals: ["$3 PBR", "$5 shots", "$6 burgers"],
    atmosphere:
      "Honky-tonk legend on Broadway. Live country music all day.",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Roberts+Western+World+Nashville",
  },
  {
    name: "Acme Feed & Seed",
    city: "Nashville",
    type: "rooftop",
    address: "101 Broadway, Nashville, TN",
    happyHourTimes: "Mon-Fri 3-6pm",
    deals: [
      "$5 cocktails",
      "$4 local beers",
      "Discounted small plates",
    ],
    atmosphere:
      "Rooftop views of the Cumberland River. More upscale Broadway option.",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Acme+Feed+Seed+Nashville",
  },

  // ── Miami (2) ──────────────────────────────────────────────────────
  {
    name: "Ball & Chain",
    city: "Miami",
    type: "bar",
    address: "1513 SW 8th St, Miami, FL",
    happyHourTimes: "Mon-Fri 4-7pm",
    deals: ["$7 mojitos", "$5 beers", "Live salsa music"],
    atmosphere:
      "Little Havana institution. Cuban cocktails and live music.",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Ball+Chain+Little+Havana+Miami",
  },
  {
    name: "Broken Shaker",
    city: "Miami",
    type: "bar",
    address: "2727 Indian Creek Dr, Miami Beach, FL",
    happyHourTimes: "Mon-Fri 5-7pm",
    deals: ["$8 cocktails (normally $15+)", "$5 beers"],
    atmosphere:
      "World-famous cocktail bar at the Freehand Hotel. Best cocktails in Miami.",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Broken+Shaker+Miami+Beach",
  },
];
