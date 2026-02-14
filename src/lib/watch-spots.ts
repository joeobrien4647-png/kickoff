export type WatchSpot = {
  name: string;
  type: "sports_bar" | "fan_zone" | "pub" | "rooftop" | "beer_garden";
  neighborhood: string;
  description: string;
  screenCount: string;
  atmosphere: "rowdy" | "chill" | "upscale" | "family";
  reservationNeeded: boolean;
  tip: string;
};

export const WATCH_SPOTS: Record<string, WatchSpot[]> = {
  Boston: [
    {
      name: "The Banshee",
      type: "pub",
      neighborhood: "Brighton",
      description:
        "Proper Irish pub that lives and breathes football. The go-to for Premier League and international matches in Boston.",
      screenCount: "8 TVs",
      atmosphere: "rowdy",
      reservationNeeded: false,
      tip: "Get there early for England matches — Brighton's Irish and British expat crowd packs this place.",
    },
    {
      name: "McGreevy's",
      type: "sports_bar",
      neighborhood: "Back Bay",
      description:
        "Historic Boston sports bar steps from Fenway. Named after the original 1894 bar that was the city's first sports gathering spot.",
      screenCount: "20+ TVs",
      atmosphere: "rowdy",
      reservationNeeded: true,
      tip: "Book a table for World Cup — this place will be heaving. Great beer list and solid pub grub.",
    },
    {
      name: "The Fours",
      type: "sports_bar",
      neighborhood: "North Station",
      description:
        "Classic Boston sports bar near TD Garden. Walls plastered with memorabilia from decades of Boston sports history.",
      screenCount: "15+ TVs",
      atmosphere: "rowdy",
      reservationNeeded: false,
      tip: "Solid lunch specials on match days. Good central location if you're exploring the Freedom Trail.",
    },
    {
      name: "Parlor Sports",
      type: "pub",
      neighborhood: "Cambridge",
      description:
        "Intimate neighborhood bar that punches above its weight for atmosphere. Craft cocktails meet screaming-at-the-telly energy.",
      screenCount: "6 TVs",
      atmosphere: "chill",
      reservationNeeded: false,
      tip: "More of a locals' vibe — perfect for a quieter group stage match. Excellent whiskey selection.",
    },
    {
      name: "Tony C's",
      type: "sports_bar",
      neighborhood: "Seaport",
      description:
        "Modern sports bar in the buzzy Seaport district. Massive screens, good cocktails, and a roof deck when the weather cooperates.",
      screenCount: "Giant projector + 30 TVs",
      atmosphere: "upscale",
      reservationNeeded: true,
      tip: "The roof deck with a projector screen is unbeatable for a summer World Cup match.",
    },
  ],

  "New York": [
    {
      name: "Smithfield Hall",
      type: "sports_bar",
      neighborhood: "Hell's Kitchen",
      description:
        "New York's dedicated soccer bar. Every match, every league, every tournament — this is where the football faithful gather.",
      screenCount: "20+ TVs + projector",
      atmosphere: "rowdy",
      reservationNeeded: true,
      tip: "THE spot for World Cup in NYC. Reserve weeks ahead for England matches. Incredible atmosphere.",
    },
    {
      name: "Banter",
      type: "pub",
      neighborhood: "Williamsburg",
      description:
        "Brooklyn's beloved soccer bar with a gritty, no-frills charm. Scarves on the walls, songs in the air.",
      screenCount: "10 TVs",
      atmosphere: "rowdy",
      reservationNeeded: false,
      tip: "Cash only! Hit the ATM first. Best for early kickoffs when Williamsburg is still waking up.",
    },
    {
      name: "Legends",
      type: "sports_bar",
      neighborhood: "Midtown",
      description:
        "Massive multi-floor sports bar near Times Square. An absolute cathedral of screens — you won't miss a single angle.",
      screenCount: "40+ TVs across 3 floors",
      atmosphere: "rowdy",
      reservationNeeded: true,
      tip: "The Football Factory section downstairs is specifically for soccer. Book that area.",
    },
    {
      name: "Nevada Smith's",
      type: "pub",
      neighborhood: "East Village",
      description:
        "Legendary NYC soccer bar that's been hosting football fans for decades. A rite of passage for any visiting supporter.",
      screenCount: "12 TVs",
      atmosphere: "rowdy",
      reservationNeeded: false,
      tip: "Arrive 90 minutes before kickoff for big matches. The place has genuine football history.",
    },
    {
      name: "The Irish Pub",
      type: "pub",
      neighborhood: "Midtown",
      description:
        "Reliable Midtown Irish pub that goes all-in on major tournaments. Big screens, cold pints, zero pretension.",
      screenCount: "15 TVs",
      atmosphere: "chill",
      reservationNeeded: false,
      tip: "Good fallback if Smithfield or Legends are fully booked. Walking distance to both.",
    },
    {
      name: "Football Factory at Legends",
      type: "fan_zone",
      neighborhood: "Midtown",
      description:
        "Dedicated football section within Legends. Scarf-draped walls, supporter group meetups, and purpose-built for the beautiful game.",
      screenCount: "Giant projector + 10 TVs",
      atmosphere: "rowdy",
      reservationNeeded: true,
      tip: "Check their social media for official supporter group watch parties during the World Cup.",
    },
  ],

  Philadelphia: [
    {
      name: "Fado Irish Pub",
      type: "pub",
      neighborhood: "Center City",
      description:
        "Philly's top soccer pub with an authentic Irish interior shipped over from Ireland. Excellent match-day atmosphere.",
      screenCount: "15+ TVs",
      atmosphere: "rowdy",
      reservationNeeded: true,
      tip: "The Sons of Ben (Philadelphia Union supporters) gather here. World Cup will be electric.",
    },
    {
      name: "Misconduct Tavern",
      type: "sports_bar",
      neighborhood: "Center City",
      description:
        "High-energy sports bar that turns into a football madhouse during tournaments. Three floors of screens and chaos.",
      screenCount: "20+ TVs across 3 floors",
      atmosphere: "rowdy",
      reservationNeeded: true,
      tip: "The rooftop opens for summer — perfect for a World Cup afternoon session in June heat.",
    },
    {
      name: "McGillin's Olde Ale House",
      type: "pub",
      neighborhood: "Center City",
      description:
        "Philadelphia's oldest continuously operating tavern (since 1860). History pours from the walls alongside 30 craft beers.",
      screenCount: "8 TVs",
      atmosphere: "chill",
      reservationNeeded: false,
      tip: "Not a dedicated sports bar, but the atmosphere during big matches is special. A Philly institution.",
    },
    {
      name: "Garage",
      type: "sports_bar",
      neighborhood: "Fishtown",
      description:
        "Fishtown's go-to for game-watching. Retro arcade games, craft beers, and a laid-back crowd that gets loud when it matters.",
      screenCount: "12 TVs + projector",
      atmosphere: "chill",
      reservationNeeded: false,
      tip: "Great brunch menu if you're catching an early kickoff. Fishtown is walkable and full of good food.",
    },
    {
      name: "Brauhaus Schmitz",
      type: "beer_garden",
      neighborhood: "South Street",
      description:
        "Authentic German beer hall with a massive outdoor biergarten. Liters of beer, pretzels, and football on the big screen.",
      screenCount: "Outdoor screen + 6 TVs",
      atmosphere: "family",
      reservationNeeded: true,
      tip: "The biergarten is the move during summer World Cup. Reserve a long table for the lads.",
    },
    {
      name: "Cooperage Wine & Whiskey Bar",
      type: "pub",
      neighborhood: "Washington Square",
      description:
        "Upscale British-inspired gastropub with an excellent whiskey collection. A more refined watching experience.",
      screenCount: "6 TVs",
      atmosphere: "upscale",
      reservationNeeded: true,
      tip: "Perfect for a knockout-stage evening match when you want proper food with your football.",
    },
  ],

  "Washington DC": [
    {
      name: "Lucky Bar",
      type: "sports_bar",
      neighborhood: "Dupont Circle",
      description:
        "THE soccer bar in Washington DC. Every supporters' group in the city calls this home. If there's a match on, Lucky Bar has it.",
      screenCount: "15+ TVs + projector",
      atmosphere: "rowdy",
      reservationNeeded: false,
      tip: "Get there early and claim your spot. The American Outlaws and DC United supporters fill this place fast.",
    },
    {
      name: "The Queen Vic",
      type: "pub",
      neighborhood: "H Street NE",
      description:
        "A proper British pub in DC. Fish and chips, Sunday roasts, and an atmosphere that'll make you forget you're 3,500 miles from home.",
      screenCount: "8 TVs",
      atmosphere: "chill",
      reservationNeeded: true,
      tip: "This is your home away from home. British owners, British crowd, British atmosphere. Book for England matches.",
    },
    {
      name: "Public Bar",
      type: "sports_bar",
      neighborhood: "Dupont Circle",
      description:
        "Multi-level sports bar with a rooftop. The Dupont Circle crowd fills every floor during major tournaments.",
      screenCount: "20+ TVs + rooftop screen",
      atmosphere: "rowdy",
      reservationNeeded: true,
      tip: "The rooftop is summer World Cup perfection. Book a section if you can.",
    },
    {
      name: "Across the Pond",
      type: "pub",
      neighborhood: "Glover Park",
      description:
        "Cozy British pub tucked away in Glover Park. A hidden gem for watching football without the downtown crush.",
      screenCount: "6 TVs",
      atmosphere: "chill",
      reservationNeeded: false,
      tip: "More relaxed than Lucky Bar. Great for early round matches or when you want a quieter pint.",
    },
    {
      name: "Iron Horse Taproom",
      type: "sports_bar",
      neighborhood: "Chinatown",
      description:
        "Solid sports bar in the heart of Penn Quarter/Chinatown. Close to the Mall and monuments for pre-match sightseeing.",
      screenCount: "25+ TVs",
      atmosphere: "family",
      reservationNeeded: false,
      tip: "Great location if you're combining match-watching with a day exploring DC's free museums.",
    },
    {
      name: "Elephant & Castle",
      type: "pub",
      neighborhood: "Penn Quarter",
      description:
        "British-style pub chain that reliably delivers for football. No surprises — just screens, pints, and English breakfast.",
      screenCount: "10 TVs",
      atmosphere: "chill",
      reservationNeeded: false,
      tip: "Order the Full English before a noon kickoff. Solid comfort pick in a tourist-friendly area.",
    },
  ],

  Nashville: [
    {
      name: "The George Jones",
      type: "rooftop",
      neighborhood: "Downtown",
      description:
        "Four floors of bars with a rooftop overlooking Broadway. Nashville's honky-tonk meets World Cup madness.",
      screenCount: "Rooftop projector + 15 TVs",
      atmosphere: "rowdy",
      reservationNeeded: true,
      tip: "Book the rooftop for sunset kickoffs. The view of Broadway with football is peak road trip energy.",
    },
    {
      name: "Tin Roof",
      type: "sports_bar",
      neighborhood: "Demonbreun",
      description:
        "Nashville's original live music and sports bar. Born in Music City, perfected for game day.",
      screenCount: "20+ TVs",
      atmosphere: "rowdy",
      reservationNeeded: false,
      tip: "The Demonbreun strip location is the one you want. Live music between matches as a bonus.",
    },
    {
      name: "Tootsie's Orchid Lounge",
      type: "pub",
      neighborhood: "Lower Broadway",
      description:
        "The most famous honky-tonk on Broadway. They'll have the World Cup on, and the atmosphere will be unlike anywhere else.",
      screenCount: "6 TVs",
      atmosphere: "rowdy",
      reservationNeeded: false,
      tip: "Not a sports bar — but watching England in a honky-tonk on Broadway? That's a story for life.",
    },
    {
      name: "Assembly Food Hall",
      type: "fan_zone",
      neighborhood: "Downtown",
      description:
        "Massive food hall with 30+ vendors, a full bar, and big screens. Eat your way through Nashville while watching football.",
      screenCount: "Giant screen + 10 TVs",
      atmosphere: "family",
      reservationNeeded: false,
      tip: "Best spot if you can't decide on food. Hot chicken from Prince's + a cold beer + World Cup = perfection.",
    },
    {
      name: "Winners Bar",
      type: "sports_bar",
      neighborhood: "Midtown",
      description:
        "Nashville's dedicated sports bar for the serious fan. No frills, all action. Proper game-watching environment.",
      screenCount: "15+ TVs",
      atmosphere: "chill",
      reservationNeeded: false,
      tip: "The Midtown locals' pick. Less touristy than Broadway, more focused on the actual football.",
    },
  ],

  Miami: [
    {
      name: "Fritz & Franz Bierhaus",
      type: "beer_garden",
      neighborhood: "Coral Gables",
      description:
        "Massive German beer hall with liters of beer, communal tables, and an outdoor area that turns into a football fan zone.",
      screenCount: "Outdoor projector + 12 TVs",
      atmosphere: "rowdy",
      reservationNeeded: true,
      tip: "Reserve a long table in the biergarten. Liters of Paulaner + World Cup football = the dream.",
    },
    {
      name: "Batch Gastropub",
      type: "sports_bar",
      neighborhood: "Brickell",
      description:
        "Upscale gastropub in the heart of Brickell. Great food, craft cocktails, and plenty of screens for the match.",
      screenCount: "15 TVs",
      atmosphere: "upscale",
      reservationNeeded: true,
      tip: "The Brickell brunch crowd turns into football fans during a World Cup. Good cocktails to cool off in the Miami heat.",
    },
    {
      name: "Blackbird Ordinary",
      type: "pub",
      neighborhood: "Brickell",
      description:
        "Hip Brickell bar with a massive outdoor patio, live DJs, and a crowd that knows how to turn a football match into a party.",
      screenCount: "8 TVs + patio screen",
      atmosphere: "chill",
      reservationNeeded: false,
      tip: "The outdoor patio is the vibe. Evening kickoffs here feel like a Miami festival with football.",
    },
    {
      name: "Fado Irish Pub",
      type: "pub",
      neighborhood: "Brickell",
      description:
        "The Brickell outpost of the beloved Irish pub chain. Reliable football atmosphere with proper pints and pub food.",
      screenCount: "20+ TVs",
      atmosphere: "rowdy",
      reservationNeeded: true,
      tip: "Sister pub to the Philly location. Same great football atmosphere, now with Miami sunshine outside.",
    },
    {
      name: "The Wharf Miami",
      type: "fan_zone",
      neighborhood: "Miami River",
      description:
        "Open-air waterfront venue on the Miami River. Food trucks, cocktail bars, and big screens under the tropical sky.",
      screenCount: "Giant outdoor screen",
      atmosphere: "chill",
      reservationNeeded: false,
      tip: "The most 'Miami' way to watch a World Cup match. Sunset kickoff on the river is unforgettable.",
    },
    {
      name: "Brickell City Centre",
      type: "fan_zone",
      neighborhood: "Brickell",
      description:
        "The outdoor plaza area hosts pop-up fan zones during major events. Expect big screens and World Cup energy in the city center.",
      screenCount: "Giant outdoor screen",
      atmosphere: "family",
      reservationNeeded: false,
      tip: "Check social media closer to the tournament for exact fan zone setup. Great for a casual daytime match.",
    },
  ],
};

/** All cities that have watch spots, in route order */
export const WATCH_SPOT_CITIES = [
  "Boston",
  "New York",
  "Philadelphia",
  "Washington DC",
  "Nashville",
  "Miami",
] as const;

// ── Watch Party Spots ──────────────────────────────────────────────
// Curated picks for the watch-party-finder component.
// More structured than the general watch guide — includes address,
// directions link, food notes, and reservation details.

export type WatchPartySpot = {
  name: string;
  city: string;
  type: "sports_bar" | "pub" | "rooftop" | "fan_zone" | "restaurant";
  address: string;
  screens: string;
  atmosphere: string;
  foodNote: string;
  reservationTip: string;
  mapsUrl: string;
};

export const WATCH_PARTY_SPOTS: WatchPartySpot[] = [
  // ── Boston ──
  {
    name: "McGreevy's",
    city: "Boston",
    type: "sports_bar",
    address: "911 Boylston St, Boston, MA 02115",
    screens: "20+ TVs with surround sound on every floor",
    atmosphere: "Rowdy, passionate, proper sports bar energy. Named after the 1894 original.",
    foodNote: "Solid pub grub \u2014 burgers, wings, and a strong craft beer list.",
    reservationTip: "Book 2+ weeks ahead for World Cup. Walk-ins possible for early group stage matches.",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=McGreevys+Boston",
  },
  {
    name: "The Banshee",
    city: "Boston",
    type: "pub",
    address: "934 Commonwealth Ave, Boston, MA 02215",
    screens: "8 TVs \u2014 every one tuned to football",
    atmosphere: "Authentic Irish pub. The expat crowd makes it feel like watching in the UK.",
    foodNote: "Classic pub fare \u2014 fish & chips, shepherd\u2019s pie, and proper pints of Guinness.",
    reservationTip: "No reservations \u2014 first come, first served. Arrive 90 min early for England matches.",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=The+Banshee+Boston",
  },
  {
    name: "Tony C's",
    city: "Boston",
    type: "rooftop",
    address: "450 Seaport Blvd, Boston, MA 02210",
    screens: "Giant projector + 30 TVs including rooftop screens",
    atmosphere: "Upscale Seaport vibes with a roof deck. Summer World Cup perfection.",
    foodNote: "Elevated bar food \u2014 wagyu sliders, lobster mac, craft cocktails.",
    reservationTip: "Reserve the rooftop section for groups. Book ASAP \u2014 the deck sells out fast in summer.",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Tony+Cs+Seaport+Boston",
  },

  // ── New York ──
  {
    name: "Smithfield Hall",
    city: "New York",
    type: "sports_bar",
    address: "138 W 25th St, New York, NY 10001",
    screens: "20+ TVs + giant projector wall \u2014 purpose-built for football",
    atmosphere: "NYC\u2019s #1 soccer bar. Scarves everywhere, chanting guaranteed. Electric for big matches.",
    foodNote: "Solid bar menu \u2014 wings, nachos, burgers. Drink specials during matches.",
    reservationTip: "Reserve weeks ahead for England matches. Email them directly for large groups.",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Smithfield+Hall+NYC",
  },
  {
    name: "Legends",
    city: "New York",
    type: "sports_bar",
    address: "6 W 33rd St, New York, NY 10001",
    screens: "40+ TVs across 3 floors \u2014 a cathedral of screens",
    atmosphere: "Massive, loud, every angle covered. The Football Factory downstairs is for proper fans.",
    foodNote: "Full menu including brunch for early kickoffs. Decent nachos and pitchers.",
    reservationTip: "Book the Football Factory section specifically. Walk-ins fill up fast on match days.",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Legends+Bar+33rd+St+NYC",
  },
  {
    name: "Banter",
    city: "New York",
    type: "pub",
    address: "132 Havemeyer St, Brooklyn, NY 11211",
    screens: "10 TVs \u2014 intimate but intense",
    atmosphere: "Gritty Williamsburg soccer bar. Scarves on the walls, songs in the air, zero pretension.",
    foodNote: "Basic bar snacks. It\u2019s about the football, not the food. CASH ONLY.",
    reservationTip: "No reservations. Arrive early. Hit an ATM first \u2014 they don\u2019t take cards.",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Banter+Bar+Williamsburg+Brooklyn",
  },

  // ── Philadelphia ──
  {
    name: "Fado Irish Pub",
    city: "Philadelphia",
    type: "pub",
    address: "1500 Locust St, Philadelphia, PA 19102",
    screens: "15+ TVs with dedicated football audio",
    atmosphere: "Authentic Irish interior shipped from Ireland. Sons of Ben territory. World Cup HQ.",
    foodNote: "Full Irish menu \u2014 bangers & mash, fish & chips, Guinness beef stew.",
    reservationTip: "Reserve for any knockout stage match. Group bookings available \u2014 call ahead.",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Fado+Irish+Pub+Philadelphia",
  },
  {
    name: "Misconduct Tavern",
    city: "Philadelphia",
    type: "sports_bar",
    address: "1511 Locust St, Philadelphia, PA 19102",
    screens: "20+ TVs across 3 floors + rooftop",
    atmosphere: "High-energy madhouse during tournaments. Three floors of chaos. Rooftop in summer.",
    foodNote: "Bar classics \u2014 wings, burgers, loaded fries. Good happy hour deals.",
    reservationTip: "The rooftop books up fast for summer. Reserve a section for groups of 6+.",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Misconduct+Tavern+Philadelphia",
  },

  // ── Washington DC ──
  {
    name: "Lucky Bar",
    city: "Washington DC",
    type: "sports_bar",
    address: "1221 Connecticut Ave NW, Washington, DC 20036",
    screens: "15+ TVs + projector \u2014 every supporters\u2019 group calls this home",
    atmosphere: "THE soccer bar in DC. American Outlaws, DC United fans, and football purists converge here.",
    foodNote: "Standard bar food. It\u2019s about the atmosphere, not the cuisine.",
    reservationTip: "No reservations \u2014 get there 2 hours early for big matches. Standing room only by kickoff.",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Lucky+Bar+Washington+DC",
  },
  {
    name: "The Queen Vic",
    city: "Washington DC",
    type: "pub",
    address: "1206 H St NE, Washington, DC 20002",
    screens: "8 TVs \u2014 cozy but perfectly placed",
    atmosphere: "A proper British pub. Fish & chips, Sunday roasts, and it feels like home.",
    foodNote: "Best English breakfast in DC. Proper pints. Sunday roasts that\u2019ll make you weep.",
    reservationTip: "Book for England matches \u2014 the British expat crowd fills this place. Call ahead.",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=The+Queen+Vic+Washington+DC",
  },
  {
    name: "Public Bar",
    city: "Washington DC",
    type: "rooftop",
    address: "1214 18th St NW, Washington, DC 20036",
    screens: "20+ TVs + rooftop screen with outdoor seating",
    atmosphere: "Multi-level bar with rooftop. Dupont Circle crowd goes hard during tournaments.",
    foodNote: "Brunch, burgers, tacos \u2014 solid all-day menu. Great cocktails.",
    reservationTip: "The rooftop is summer World Cup perfection. Reserve a section if possible.",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Public+Bar+Dupont+Circle+DC",
  },

  // ── Nashville ──
  {
    name: "The George Jones",
    city: "Nashville",
    type: "rooftop",
    address: "128 2nd Ave N, Nashville, TN 37201",
    screens: "Rooftop projector + 15 TVs across four floors",
    atmosphere: "Honky-tonk meets World Cup. Rooftop views of Broadway. Peak road trip energy.",
    foodNote: "Southern bar food \u2014 hot chicken sliders, BBQ nachos, cold beer.",
    reservationTip: "Book the rooftop for sunset kickoffs. Call ahead for groups of 4+.",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=George+Jones+Nashville",
  },
  {
    name: "Assembly Food Hall",
    city: "Nashville",
    type: "fan_zone",
    address: "5055 Broadway Pl, Nashville, TN 37203",
    screens: "Giant screen + 10 TVs in the central hall",
    atmosphere: "Massive food hall energy. 30+ vendors, full bar, big screens. Family-friendly.",
    foodNote: "Hot chicken from Prince\u2019s, tacos, BBQ, ramen \u2014 whatever you\u2019re craving.",
    reservationTip: "No reservations needed \u2014 just turn up. Grab a seat near the big screen early.",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Assembly+Food+Hall+Nashville",
  },

  // ── Miami ──
  {
    name: "Fritz & Franz Bierhaus",
    city: "Miami",
    type: "restaurant",
    address: "60 Merrick Way, Coral Gables, FL 33134",
    screens: "Outdoor projector + 12 TVs in the beer hall",
    atmosphere: "German beer hall meets Miami sun. Communal tables, litre steins, football on the big screen.",
    foodNote: "Bratwurst, schnitzel, pretzels, and litres of Paulaner. Beer garden heaven.",
    reservationTip: "Reserve a long table in the biergarten for groups. Fills up fast for big matches.",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Fritz+Franz+Bierhaus+Coral+Gables",
  },
  {
    name: "Fado Irish Pub",
    city: "Miami",
    type: "pub",
    address: "900 S Miami Ave, Miami, FL 33130",
    screens: "20+ TVs with dedicated football audio setup",
    atmosphere: "Reliable football atmosphere with proper pints. The Brickell outpost delivers.",
    foodNote: "Full Irish pub menu. Solid fish & chips and a good selection of draught beers.",
    reservationTip: "Reserve for knockout matches. Walk-in for group stage but arrive 1hr early.",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Fado+Irish+Pub+Brickell+Miami",
  },
  {
    name: "The Wharf Miami",
    city: "Miami",
    type: "fan_zone",
    address: "114 SW North River Dr, Miami, FL 33130",
    screens: "Giant outdoor screen on the waterfront",
    atmosphere: "Open-air riverfront venue. Food trucks, cocktails, tropical sky. The most Miami experience possible.",
    foodNote: "Rotating food trucks \u2014 tacos, ceviche, sliders. Cocktail bars on-site.",
    reservationTip: "No reservations \u2014 open-air venue. Arrive early for prime riverfront spots.",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=The+Wharf+Miami",
  },
];

/** All cities that have watch party spots, in route order */
export const WATCH_PARTY_CITIES = [
  "Boston",
  "New York",
  "Philadelphia",
  "Washington DC",
  "Nashville",
  "Miami",
] as const;
