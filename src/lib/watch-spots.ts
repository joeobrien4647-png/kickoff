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
