// ============ CITY PROFILE TYPES & DATA ============
// Rich curated data for every stop on the East Coast World Cup 2026 road trip.
// Real places, real restaurants, real insider tips — built for travelers.

export type Restaurant = {
  name: string;
  cuisine: string;
  priceRange: "$" | "$$" | "$$$";
  neighborhood: string;
  oneLiner: string;
  mustOrder: string;
  matchDayFriendly: boolean;
  images?: string[];
};

export type Attraction = {
  name: string;
  category: "landmark" | "museum" | "park" | "market" | "viewpoint" | "activity";
  description: string;
  duration: string;
  cost: "free" | "$" | "$$" | "$$$";
  tip: string;
  images?: string[];
};

export type NightlifeSpot = {
  name: string;
  type:
    | "bar"
    | "club"
    | "live_music"
    | "rooftop"
    | "dive"
    | "sports_bar"
    | "brewery";
  neighborhood: string;
  oneLiner: string;
  priceRange: "$" | "$$" | "$$$";
  images?: string[];
};

export type ShoppingArea = {
  name: string;
  type: string;
  description: string;
  images?: string[];
};

export type Neighborhood = {
  name: string;
  description: string;
  vibe: string;
};

export type CityProfile = {
  overview: string;
  neighborhoods: Neighborhood[];
  restaurants: Restaurant[];
  attractions: Attraction[];
  nightlife: NightlifeSpot[];
  shopping: ShoppingArea[];
  localTips: string[];
  gettingAround: {
    summary: string;
    toStadium: string;
    apps: string[];
    tips: string[];
  };
  matchDayGuide: {
    arriveEarlyTip: string;
    nearStadium: string[];
    afterParty: string;
  };
};

export const CITY_PROFILES: Record<string, CityProfile> = {
  // ══════════════════════════════════════════════════════════════════════
  //  BOSTON
  // ══════════════════════════════════════════════════════════════════════
  Boston: {
    overview:
      "America's walking city blends colonial history with world-class seafood, fiery sports fandom, and a compact downtown you can cover on foot. The North End alone is worth the trip — cobblestone streets, espresso bars, and the best Italian food outside Italy. June brings warm days, long evenings, and Fenway Park energy that spills into every pub.",
    neighborhoods: [
      {
        name: "North End",
        description:
          "Boston's Little Italy — narrow streets packed with trattorias, bakeries, and espresso bars dating back generations.",
        vibe: "Historic",
      },
      {
        name: "Back Bay",
        description:
          "Victorian brownstones, Newbury Street boutiques, and the iconic Copley Square. Where old money meets new restaurants.",
        vibe: "Upscale",
      },
      {
        name: "Seaport District",
        description:
          "Boston's newest waterfront neighborhood — sleek restaurants, rooftop bars, and the ICA museum right on the harbor.",
        vibe: "Trendy",
      },
      {
        name: "Cambridge / Harvard Square",
        description:
          "Across the river — bookstores, coffee shops, street performers, and the unmistakable ivy-covered Harvard campus.",
        vibe: "Artsy",
      },
    ],
    restaurants: [
      {
        name: "Neptune Oyster",
        cuisine: "Seafood",
        priceRange: "$$$",
        neighborhood: "North End",
        oneLiner:
          "Tiny North End gem with legendary lobster rolls and a raw bar that sets the standard.",
        mustOrder: "Hot butter lobster roll",
        matchDayFriendly: false,
      },
      {
        name: "Legal Sea Foods",
        cuisine: "Seafood",
        priceRange: "$$",
        neighborhood: "Seaport",
        oneLiner:
          "New England clam chowder so good it's been served at every presidential inauguration since 1981.",
        mustOrder: "New England clam chowder",
        matchDayFriendly: true,
      },
      {
        name: "Regina Pizzeria",
        cuisine: "Pizza",
        priceRange: "$",
        neighborhood: "North End",
        oneLiner:
          "Brick-oven pizza since 1926 — the original Thacher Street location is non-negotiable.",
        mustOrder: "Giambotta pizza",
        matchDayFriendly: true,
      },
      {
        name: "Mike's Pastry",
        cuisine: "Bakery",
        priceRange: "$",
        neighborhood: "North End",
        oneLiner:
          "The cannoli pilgrimage every visitor must make. Get there early or face the line.",
        mustOrder: "Ricotta cannoli",
        matchDayFriendly: true,
      },
      {
        name: "Giacomo's Ristorante",
        cuisine: "Italian",
        priceRange: "$$",
        neighborhood: "North End",
        oneLiner:
          "Cash only, no reservations, always a line — and worth every minute of the wait.",
        mustOrder: "Lobster fra diavolo",
        matchDayFriendly: false,
      },
      {
        name: "Row 34",
        cuisine: "Seafood / Craft Beer",
        priceRange: "$$",
        neighborhood: "Seaport",
        oneLiner:
          "Industrial-chic oyster bar with one of the best craft beer lists in the city.",
        mustOrder: "Oyster platter with a local IPA",
        matchDayFriendly: true,
      },
      {
        name: "Toro",
        cuisine: "Spanish Tapas",
        priceRange: "$$$",
        neighborhood: "South End",
        oneLiner:
          "Ken Oringer's Barcelona-inspired tapas joint — lively, loud, and deeply delicious.",
        mustOrder: "Corn with aioli, lime, and espelette",
        matchDayFriendly: false,
      },
      {
        name: "Yankee Lobster Co.",
        cuisine: "Seafood",
        priceRange: "$",
        neighborhood: "Seaport",
        oneLiner:
          "No-frills fisherman's wharf counter with lobster rolls at honest prices.",
        mustOrder: "Lobster roll with drawn butter",
        matchDayFriendly: true,
      },
      {
        name: "El Pelon Taqueria",
        cuisine: "Mexican",
        priceRange: "$",
        neighborhood: "Fenway",
        oneLiner:
          "College-kid favorite near Fenway with burritos the size of your forearm.",
        mustOrder: "Fish tacos",
        matchDayFriendly: true,
      },
      {
        name: "Harpoon Beer Hall",
        cuisine: "American / Brewery",
        priceRange: "$$",
        neighborhood: "Seaport",
        oneLiner:
          "Massive beer hall with pretzels the size of your head and a waterfront patio.",
        mustOrder: "Harpoon IPA with a giant soft pretzel",
        matchDayFriendly: true,
      },
      {
        name: "Mei Mei",
        cuisine: "Chinese-American Fusion",
        priceRange: "$$",
        neighborhood: "South End",
        oneLiner:
          "Farm-to-table meets Chinese-American comfort food — creative and soulful.",
        mustOrder: "Double Awesome scallion pancake sandwich",
        matchDayFriendly: true,
      },
      {
        name: "The Barking Crab",
        cuisine: "Seafood",
        priceRange: "$$",
        neighborhood: "Seaport",
        oneLiner:
          "Open-air waterfront seafood shack with picnic tables and cold beer.",
        mustOrder: "Steamed lobster with corn on the cob",
        matchDayFriendly: true,
      },
    ],
    attractions: [
      {
        name: "Freedom Trail",
        category: "landmark",
        description:
          "2.5-mile red-brick walking path through 16 historically significant sites from the American Revolution.",
        duration: "2-3 hours",
        cost: "free",
        tip: "Start at Boston Common, end at Bunker Hill. Grab a cannoli break midway in the North End.",
      },
      {
        name: "Fenway Park",
        category: "landmark",
        description:
          "America's oldest ballpark (1912) — even non-baseball fans should see the Green Monster up close.",
        duration: "1-3 hours",
        cost: "$$",
        tip: "Tours run daily even without a game. If the Red Sox are playing, grab standing-room tickets.",
      },
      {
        name: "Museum of Fine Arts",
        category: "museum",
        description:
          "One of the largest art museums in the country with an incredible Impressionist collection.",
        duration: "2-3 hours",
        cost: "$$",
        tip: "Free admission on Wednesdays after 4 PM.",
      },
      {
        name: "Boston Public Garden",
        category: "park",
        description:
          "America's first public botanical garden — swan boats, weeping willows, and the Make Way for Ducklings statues.",
        duration: "30-60 min",
        cost: "free",
        tip: "Swan boat rides are $4.50 and run from mid-April through September.",
      },
      {
        name: "New England Aquarium",
        category: "activity",
        description:
          "Giant ocean tank, penguin colony, and whale watch cruises departing from the waterfront.",
        duration: "2-3 hours",
        cost: "$$",
        tip: "Book whale watch tickets separately — it's a 3-hour trip and worth every minute.",
      },
      {
        name: "Faneuil Hall / Quincy Market",
        category: "market",
        description:
          "Historic marketplace since 1742 with food stalls, street performers, and souvenir shops.",
        duration: "1-2 hours",
        cost: "free",
        tip: "Skip the tourist traps inside — the food stalls in Quincy Market are the real draw.",
      },
      {
        name: "Isabella Stewart Gardner Museum",
        category: "museum",
        description:
          "Venetian palace filled with art, built by one woman's obsession. The empty frames from the 1990 heist are still on the walls.",
        duration: "1.5-2 hours",
        cost: "$$",
        tip: "Anyone named Isabella gets in free. The courtyard alone is worth the visit.",
      },
      {
        name: "Harvard Yard",
        category: "landmark",
        description:
          "Walk through the world's most famous university campus. Rub John Harvard's shoe for good luck.",
        duration: "1-2 hours",
        cost: "free",
        tip: "Take the Red Line to Harvard station. The campus is self-guided and free to walk.",
      },
      {
        name: "Boston Harbor Islands",
        category: "activity",
        description:
          "National park area with 34 islands — ferries run from Long Wharf for hiking, beaches, and Civil War forts.",
        duration: "3-5 hours",
        cost: "$",
        tip: "Spectacle Island has the best beaches. Georges Island has Fort Warren. Ferries fill up — book ahead.",
      },
      {
        name: "SoWa Open Market",
        category: "market",
        description:
          "Sunday outdoor market in the South End with local artists, vintage goods, food trucks, and a farmers market.",
        duration: "1-2 hours",
        cost: "free",
        tip: "Runs Sundays May through October. Best visited in the morning before it gets crowded.",
      },
    ],
    nightlife: [
      {
        name: "Bleacher Bar",
        type: "sports_bar",
        neighborhood: "Fenway",
        oneLiner:
          "Built into the belly of Fenway Park with a window overlooking centerfield.",
        priceRange: "$$",
      },
      {
        name: "Drink",
        type: "bar",
        neighborhood: "Seaport",
        oneLiner:
          "No menu — tell the bartender what you like and they'll craft something perfect.",
        priceRange: "$$$",
      },
      {
        name: "The Tam",
        type: "dive",
        neighborhood: "Downtown",
        oneLiner:
          "Cash-only downtown dive with cheap drinks and zero pretension since 1950.",
        priceRange: "$",
      },
      {
        name: "Trillium Brewing Fort Point",
        type: "brewery",
        neighborhood: "Seaport",
        oneLiner:
          "Boston's hottest brewery — hazy IPAs and a taproom that's always packed.",
        priceRange: "$$",
      },
      {
        name: "Wally's Cafe Jazz Club",
        type: "live_music",
        neighborhood: "South End",
        oneLiner:
          "Legendary jazz club since 1947. Berklee students jam nightly. No cover, no pretense.",
        priceRange: "$",
      },
      {
        name: "Lookout Rooftop Bar",
        type: "rooftop",
        neighborhood: "Seaport",
        oneLiner:
          "Envoy Hotel rooftop with panoramic harbor views and craft cocktails.",
        priceRange: "$$$",
      },
      {
        name: "McGreevy's",
        type: "sports_bar",
        neighborhood: "Back Bay",
        oneLiner:
          "Self-proclaimed first sports bar in America — Boston memorabilia floor to ceiling.",
        priceRange: "$$",
      },
      {
        name: "Harpoon Beer Hall",
        type: "brewery",
        neighborhood: "Seaport",
        oneLiner:
          "Massive, loud, communal tables — the kind of beer hall that makes match day better.",
        priceRange: "$$",
      },
    ],
    shopping: [
      {
        name: "Newbury Street",
        type: "High-end retail & boutiques",
        description:
          "Eight blocks of designer shops, indie boutiques, and art galleries in Back Bay. Boston's answer to Fifth Avenue.",
      },
      {
        name: "Faneuil Hall Marketplace",
        type: "Tourist & souvenir shopping",
        description:
          "Historic market with pushcart vendors, souvenir shops, and the Quincy Market food hall under one roof.",
      },
      {
        name: "SoWa Artists Guild",
        type: "Art & vintage",
        description:
          "South End complex with artist studios, vintage dealers, and the Sunday open market.",
      },
      {
        name: "Harvard Square",
        type: "Bookstores & local shops",
        description:
          "Independent bookshops, record stores, and quirky college-town retail across the river in Cambridge.",
      },
    ],
    localTips: [
      "Gillette Stadium is 30 miles south in Foxborough — plan transport ahead, don't wing it on match day.",
      "The T stops running around 12:30 AM. If you're out late, budget for a rideshare home.",
      "North End restaurants are cash-only more often than you'd expect. Carry some bills.",
      "Boston drivers are legendarily aggressive. If you rent a car, brace yourself. Walking or the T is easier.",
      "Duck boats on the Charles River are touristy but genuinely fun, especially in the summer heat.",
      "Dunkin' is a way of life here. Don't call it Dunkin' Donuts — it's just Dunkin'.",
    ],
    gettingAround: {
      summary:
        "Boston is compact and walkable. The T (subway) covers most neighborhoods. Rideshare fills the gaps.",
      toStadium:
        "Gillette Stadium is in Foxborough, 30 miles south. MBTA commuter rail runs special event service on match days from South Station. Rideshare costs $50-70 each way. Driving yourself means dealing with massive parking lots — arrive early.",
      apps: ["MBTA", "Uber", "Lyft"],
      tips: [
        "Get a Charlie Card (reloadable) instead of paper tickets — it's cheaper per ride.",
        "Green Line is above ground and slow. Red Line and Orange Line are faster.",
        "Walking from Back Bay to the North End takes 25 minutes — often faster than the T.",
        "On match day, the commuter rail to Foxborough is your best bet. Trains run 2 hours before and after.",
      ],
    },
    matchDayGuide: {
      arriveEarlyTip:
        "Arrive at Gillette Stadium 2-3 hours early. Tailgating in the parking lots is a massive scene — fans set up grills, speakers, and flags. The walk from the lots to the gates takes 15-20 minutes.",
      nearStadium: [
        "Patriot Place — outdoor mall attached to the stadium with restaurants and bars. CBS Sporting Club is solid for pre-game.",
        "Scorpion Bar at Patriot Place — margaritas and Tex-Mex in a festive atmosphere.",
        "Parking lot tailgates — bring your own cooler, grill, and flags. This is where the real party is.",
      ],
      afterParty:
        "Head back to downtown Boston. The Seaport district stays alive late — Harpoon Beer Hall, Trillium, and Drink will all be packed with post-match energy.",
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  //  NEW YORK
  // ══════════════════════════════════════════════════════════════════════
  "New York": {
    overview:
      "The world's city needs no introduction — but during a World Cup, it transforms into something even bigger. Every neighborhood becomes a fan zone, every bar screens every match, and the energy is unmatched anywhere on earth. From the dollar slice to the Michelin star, from the dive bar to the rooftop lounge, New York does everything at full volume.",
    neighborhoods: [
      {
        name: "Lower Manhattan / Financial District",
        description:
          "Wall Street, the 9/11 Memorial, and the Statue of Liberty ferry. Historic and heavy with meaning.",
        vibe: "Historic",
      },
      {
        name: "Greenwich Village / West Village",
        description:
          "Tree-lined streets, jazz clubs, intimate restaurants, and the beating heart of NYC's creative soul.",
        vibe: "Artsy",
      },
      {
        name: "Midtown / Times Square",
        description:
          "The bright-lights tourist epicenter — Broadway shows, Radio City, and the chaotic energy that defines NYC.",
        vibe: "Iconic",
      },
      {
        name: "Williamsburg, Brooklyn",
        description:
          "Hipster-turned-mainstream with incredible food, nightlife, rooftop bars, and East River views of Manhattan.",
        vibe: "Trendy",
      },
    ],
    restaurants: [
      {
        name: "Joe's Pizza",
        cuisine: "Pizza",
        priceRange: "$",
        neighborhood: "Greenwich Village",
        oneLiner:
          "The gold standard New York slice since 1975. No trip is complete without it.",
        mustOrder: "Plain cheese slice",
        matchDayFriendly: true,
      },
      {
        name: "Peter Luger Steak House",
        cuisine: "Steakhouse",
        priceRange: "$$$",
        neighborhood: "Williamsburg",
        oneLiner:
          "Cash-only Brooklyn legend since 1887. The porterhouse for two is non-negotiable.",
        mustOrder: "Porterhouse steak for two",
        matchDayFriendly: false,
      },
      {
        name: "Los Tacos No. 1",
        cuisine: "Mexican",
        priceRange: "$",
        neighborhood: "Chelsea",
        oneLiner:
          "Chelsea Market counter with tacos that rival anything in Mexico City.",
        mustOrder: "Adobada taco with grilled cactus",
        matchDayFriendly: true,
      },
      {
        name: "Di Fara Pizza",
        cuisine: "Pizza",
        priceRange: "$$",
        neighborhood: "Midwood, Brooklyn",
        oneLiner:
          "Dom DeMarco's legendary one-man operation. Every pie hand-made by the master himself.",
        mustOrder: "Square slice with fresh basil",
        matchDayFriendly: false,
      },
      {
        name: "Russ & Daughters",
        cuisine: "Jewish Deli / Brunch",
        priceRange: "$$",
        neighborhood: "Lower East Side",
        oneLiner:
          "Smoked fish and bagels since 1914. The quintessential New York morning.",
        mustOrder: "Classic bagel with nova, cream cheese, capers",
        matchDayFriendly: true,
      },
      {
        name: "Katz's Delicatessen",
        cuisine: "Jewish Deli",
        priceRange: "$$",
        neighborhood: "Lower East Side",
        oneLiner:
          "Hand-carved pastrami sandwiches since 1888. Don't lose your ticket.",
        mustOrder: "Pastrami on rye",
        matchDayFriendly: true,
      },
      {
        name: "Xi'an Famous Foods",
        cuisine: "Chinese (Northwestern)",
        priceRange: "$",
        neighborhood: "Multiple locations",
        oneLiner:
          "Hand-pulled noodles with fiery cumin lamb that started as a Chinatown basement stall.",
        mustOrder: "Spicy cumin lamb noodles",
        matchDayFriendly: true,
      },
      {
        name: "Lucali",
        cuisine: "Pizza",
        priceRange: "$$",
        neighborhood: "Carroll Gardens, Brooklyn",
        oneLiner:
          "BYOB brick-oven pizza in a former candy store. Jay-Z's favorite. Cash only.",
        mustOrder: "Pepperoni pizza with calzone on the side",
        matchDayFriendly: false,
      },
      {
        name: "The Halal Guys",
        cuisine: "Middle Eastern Street Food",
        priceRange: "$",
        neighborhood: "Midtown",
        oneLiner:
          "The original 53rd & 6th cart — chicken and gyro over rice, white sauce, red sauce.",
        mustOrder: "Combo platter with extra white sauce",
        matchDayFriendly: true,
      },
      {
        name: "Tatiana by Kwame Onwuachi",
        cuisine: "Afro-Caribbean Fine Dining",
        priceRange: "$$$",
        neighborhood: "Lincoln Center",
        oneLiner:
          "One of the most celebrated restaurants in America right now. A stunning celebration of the African diaspora.",
        mustOrder: "Suya-spiced lamb chops",
        matchDayFriendly: false,
      },
      {
        name: "Prince Street Pizza",
        cuisine: "Pizza",
        priceRange: "$",
        neighborhood: "Nolita",
        oneLiner:
          "The spicy spring square slice with its thick, crispy edges is worth the line.",
        mustOrder: "Spicy spring pepperoni square",
        matchDayFriendly: true,
      },
      {
        name: "Juliana's Pizza",
        cuisine: "Pizza",
        priceRange: "$$",
        neighborhood: "DUMBO, Brooklyn",
        oneLiner:
          "Patsy Grimaldi's return to his original coal-oven space under the Brooklyn Bridge.",
        mustOrder: "Margherita pizza",
        matchDayFriendly: true,
      },
    ],
    attractions: [
      {
        name: "Statue of Liberty & Ellis Island",
        category: "landmark",
        description:
          "The icon. Ferry from Battery Park takes you to both islands for history, views, and goosebumps.",
        duration: "3-4 hours",
        cost: "$$",
        tip: "Book pedestal or crown access weeks ahead. The free Staten Island Ferry gives you views too.",
      },
      {
        name: "Central Park",
        category: "park",
        description:
          "843 acres of green in the middle of Manhattan — Bethesda Fountain, Bow Bridge, Shakespeare Garden.",
        duration: "2-4 hours",
        cost: "free",
        tip: "Rent a bike at the south entrance. Walking the whole park takes hours — wheels help.",
      },
      {
        name: "9/11 Memorial & Museum",
        category: "museum",
        description:
          "The reflecting pools are free and deeply moving. The underground museum is one of the most powerful in the world.",
        duration: "2-3 hours",
        cost: "$$",
        tip: "The memorial pools are free and open daily. Museum tickets should be booked in advance.",
      },
      {
        name: "Brooklyn Bridge",
        category: "landmark",
        description:
          "Walk across one of the most photographed bridges in the world. Best at sunrise or sunset.",
        duration: "30-60 min",
        cost: "free",
        tip: "Walk Brooklyn to Manhattan for the skyline view ahead of you. Then grab ice cream at DUMBO.",
      },
      {
        name: "The High Line",
        category: "park",
        description:
          "Elevated park built on a former freight rail line — public art, gardens, and city views from above.",
        duration: "1-2 hours",
        cost: "free",
        tip: "Enter at Gansevoort Street (south end) and walk north. Chelsea Market is right at the 16th St entrance.",
      },
      {
        name: "Top of the Rock",
        category: "viewpoint",
        description:
          "Observation deck at 30 Rock with unobstructed views of the Empire State Building and Central Park.",
        duration: "1 hour",
        cost: "$$",
        tip: "Better than the Empire State Building because you can actually see the Empire State Building from here.",
      },
      {
        name: "The Metropolitan Museum of Art",
        category: "museum",
        description:
          "2 million works spanning 5,000 years. You could spend a week and not see it all.",
        duration: "2-4 hours",
        cost: "$$",
        tip: "Pay-what-you-wish for NY state residents. The rooftop garden bar opens in May — stunning park views.",
      },
      {
        name: "DUMBO, Brooklyn",
        category: "viewpoint",
        description:
          "Down Under the Manhattan Bridge Overpass — cobblestone streets, the iconic bridge-frame photo, and waterfront parks.",
        duration: "1-2 hours",
        cost: "free",
        tip: "Washington Street is the spot for the classic Manhattan Bridge + Empire State Building photo.",
      },
      {
        name: "Chelsea Market",
        category: "market",
        description:
          "Indoor food hall in a former Nabisco factory — lobster, tacos, artisanal everything.",
        duration: "1-2 hours",
        cost: "free",
        tip: "Go hungry. Los Tacos No.1, Lobster Place, and the Doughnuttery are all inside.",
      },
      {
        name: "Broadway Show",
        category: "activity",
        description:
          "World-class theater — from classic musicals to cutting-edge drama. A quintessential NYC experience.",
        duration: "2.5-3 hours",
        cost: "$$$",
        tip: "TKTS booth in Times Square sells same-day discount tickets. Line up around 2 PM for matinee or 5 PM for evening.",
      },
    ],
    nightlife: [
      {
        name: "The Dead Rabbit",
        type: "bar",
        neighborhood: "Financial District",
        oneLiner:
          "Repeatedly named the world's best bar — Irish pub downstairs, cocktail parlor upstairs.",
        priceRange: "$$$",
      },
      {
        name: "230 Fifth",
        type: "rooftop",
        neighborhood: "Flatiron",
        oneLiner:
          "Empire State Building views with a cocktail in hand. The definitive NYC rooftop.",
        priceRange: "$$",
      },
      {
        name: "Barcade",
        type: "bar",
        neighborhood: "Williamsburg",
        oneLiner:
          "Classic arcade games + rotating craft taps. Where 80s nostalgia meets Brooklyn cool.",
        priceRange: "$$",
      },
      {
        name: "Standings",
        type: "sports_bar",
        neighborhood: "East Village",
        oneLiner:
          "Tiny, obsessive sports bar that shows every match from every league. A soccer fan's paradise.",
        priceRange: "$",
      },
      {
        name: "Blue Note Jazz Club",
        type: "live_music",
        neighborhood: "Greenwich Village",
        oneLiner:
          "World-famous jazz venue since 1981. Late sets are more affordable and just as magical.",
        priceRange: "$$$",
      },
      {
        name: "Westlight",
        type: "rooftop",
        neighborhood: "Williamsburg",
        oneLiner:
          "22nd-floor rooftop bar with 360-degree views of the Manhattan skyline.",
        priceRange: "$$$",
      },
      {
        name: "McSorley's Old Ale House",
        type: "dive",
        neighborhood: "East Village",
        oneLiner:
          "NYC's oldest bar (1854). Two choices: light or dark ale. Sawdust on the floor. Cash only.",
        priceRange: "$",
      },
      {
        name: "Football Factory at Legends",
        type: "sports_bar",
        neighborhood: "Midtown",
        oneLiner:
          "Purpose-built soccer bar near Times Square showing every international match.",
        priceRange: "$$",
      },
    ],
    shopping: [
      {
        name: "SoHo",
        type: "Fashion & designer retail",
        description:
          "Cast-iron architecture lined with flagship stores from every brand you know, plus indie boutiques you don't.",
      },
      {
        name: "Fifth Avenue",
        type: "Luxury shopping",
        description:
          "The iconic stretch from Saks to Tiffany's to Bergdorf Goodman. Window shopping alone is an experience.",
      },
      {
        name: "Brooklyn Flea",
        type: "Vintage & artisan market",
        description:
          "Weekend market in DUMBO and Williamsburg with vintage clothing, handmade goods, and incredible food vendors.",
      },
      {
        name: "Chelsea Market",
        type: "Artisanal food & gifts",
        description:
          "Beyond the food stalls — artist shops, kitchenware, bookstores, and unique NYC souvenirs.",
      },
    ],
    localTips: [
      "MetLife Stadium is in East Rutherford, NJ — 8 miles from Midtown. NJ Transit from Penn Station is the move.",
      "Subway runs 24/7 but late-night waits can be 20+ minutes. Check the MTA app for real-time arrivals.",
      "Skip the yellow cabs for long distances — the subway is faster and $2.90 flat vs. $30+ in traffic.",
      "Pizza protocol: fold it in half, eat it walking. Knife and fork will get you stared at.",
      "Times Square is worth seeing once, for about 5 minutes. Then leave and go literally anywhere else.",
      "Tipping culture is real: 20% at restaurants, $1-2 per drink at bars. Budget for it.",
    ],
    gettingAround: {
      summary:
        "The subway is king. 472 stations, 24/7 service, $2.90 per ride. Supplement with Citi Bike and walking. Driving is miserable — don't.",
      toStadium:
        "MetLife Stadium is in East Rutherford, NJ. NJ Transit trains run from Penn Station to the Meadowlands Sports Complex on event days. Express buses also run from Port Authority Bus Terminal. Rideshare to the stadium costs $40-60 from Manhattan with surge pricing likely.",
      apps: ["MTA", "NJ Transit", "Uber", "Lyft", "Citi Bike"],
      tips: [
        "Tap your credit card or phone at any turnstile — no MetroCard needed anymore (OMNY system).",
        "The L train connects Manhattan to Williamsburg. The 7 train goes to Flushing for incredible food.",
        "NJ Transit to MetLife: trains run from Penn Station starting 2 hours before kickoff.",
        "Citi Bike is great for short trips — docks are everywhere below 60th Street.",
      ],
    },
    matchDayGuide: {
      arriveEarlyTip:
        "Arrive at MetLife 2-3 hours early. The Meadowlands parking lots open well before kickoff with a full tailgate scene. NJ Transit trains fill up — catch an early one.",
      nearStadium: [
        "MetLife tailgate lots — massive parking areas where fans set up cookouts and watch parties before gates open.",
        "American Dream Mall — giant entertainment complex 5 minutes from the stadium with restaurants and bars.",
        "Bonefish Grill East Rutherford — sit-down option near the stadium for a calmer pre-game meal.",
      ],
      afterParty:
        "Take the train back to Manhattan and pour into Midtown or the East Village. Football Factory, Standings, or any bar on St. Marks Place will be electric after a big match.",
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  //  PHILADELPHIA
  // ══════════════════════════════════════════════════════════════════════
  Philadelphia: {
    overview:
      "Philly punches way above its weight — one of America's best food cities hiding in plain sight. From cheesesteaks and roast pork to James Beard-winning fine dining, the culinary scene is world-class at every price point. Add a walkable downtown, passionate sports fans, revolutionary history, and a gloriously scrappy attitude, and you've got one of the most underrated stops on the entire route.",
    neighborhoods: [
      {
        name: "Old City",
        description:
          "Cobblestone streets, the Liberty Bell, Independence Hall, and some of the oldest pubs in America.",
        vibe: "Historic",
      },
      {
        name: "Fishtown",
        description:
          "The neighborhood that put Philly on the hipster map — breweries, coffee roasters, music venues, and tattoo parlors.",
        vibe: "Trendy",
      },
      {
        name: "Rittenhouse Square",
        description:
          "Philly's most elegant park surrounded by fine dining, boutiques, and shaded cafe tables.",
        vibe: "Upscale",
      },
      {
        name: "South Philadelphia",
        description:
          "The Italian Market, Pat's and Geno's corner, and the stadium complex. The soul of working-class Philly.",
        vibe: "Authentic",
      },
    ],
    restaurants: [
      {
        name: "Pat's King of Steaks",
        cuisine: "Cheesesteak",
        priceRange: "$",
        neighborhood: "South Philadelphia",
        oneLiner:
          "The original cheesesteak since 1930. Order fast: 'Whiz wit' means Cheez Whiz with onions.",
        mustOrder: "Cheesesteak whiz wit",
        matchDayFriendly: true,
      },
      {
        name: "John's Roast Pork",
        cuisine: "Sandwiches",
        priceRange: "$",
        neighborhood: "South Philadelphia",
        oneLiner:
          "Locals argue this is the real best sandwich in Philly. The roast pork with broccoli rabe and sharp provolone is flawless.",
        mustOrder: "Roast pork Italian with sharp provolone and broccoli rabe",
        matchDayFriendly: true,
      },
      {
        name: "Zahav",
        cuisine: "Israeli",
        priceRange: "$$$",
        neighborhood: "Old City",
        oneLiner:
          "James Beard Outstanding Restaurant winner. The hummus tehina alone is a religious experience.",
        mustOrder: "Hummus tehina with the laffa bread set",
        matchDayFriendly: false,
      },
      {
        name: "Reading Terminal Market",
        cuisine: "Food Hall (everything)",
        priceRange: "$",
        neighborhood: "Center City",
        oneLiner:
          "150+ vendors under one historic roof since 1893. Amish donuts, DiNic's roast pork, Beiler's bakery.",
        mustOrder: "Roast pork sandwich at DiNic's",
        matchDayFriendly: true,
      },
      {
        name: "Federal Donuts",
        cuisine: "Donuts / Fried Chicken",
        priceRange: "$",
        neighborhood: "Multiple locations",
        oneLiner:
          "Michael Solomonov's fried chicken and hot-sugar donuts. The honey combo is life-changing.",
        mustOrder: "Fried chicken sandwich + hot fresh donut",
        matchDayFriendly: true,
      },
      {
        name: "Vernick Food & Drink",
        cuisine: "New American",
        priceRange: "$$$",
        neighborhood: "Rittenhouse",
        oneLiner:
          "Greg Vernick's wood-fired dishes in one of the best dining rooms in the city.",
        mustOrder: "Toast with maitake mushrooms",
        matchDayFriendly: false,
      },
      {
        name: "Suraya",
        cuisine: "Lebanese",
        priceRange: "$$",
        neighborhood: "Fishtown",
        oneLiner:
          "Gorgeous Lebanese restaurant with a dreamy garden patio and a market next door.",
        mustOrder: "Mezze platter on the garden patio",
        matchDayFriendly: true,
      },
      {
        name: "Poi Dog",
        cuisine: "Hawaiian",
        priceRange: "$",
        neighborhood: "Rittenhouse",
        oneLiner:
          "Island comfort food from a Hawaiian-born chef. The spam musubi is worth the detour.",
        mustOrder: "Garlic shrimp plate lunch",
        matchDayFriendly: true,
      },
      {
        name: "Talula's Daily",
        cuisine: "Brunch / Bakery",
        priceRange: "$$",
        neighborhood: "Washington Square West",
        oneLiner:
          "Best brunch in Philly. Pastries, farm eggs, and the kind of coffee that fixes your whole day.",
        mustOrder: "Egg sandwich on house-baked brioche",
        matchDayFriendly: true,
      },
      {
        name: "Pizzeria Beddia",
        cuisine: "Pizza",
        priceRange: "$$",
        neighborhood: "Fishtown",
        oneLiner:
          "Joe Beddia graduated from 40-pies-a-day to a full restaurant. Still some of the best pizza in America.",
        mustOrder: "Margherita with hot honey",
        matchDayFriendly: true,
      },
      {
        name: "Monk's Cafe",
        cuisine: "Belgian",
        priceRange: "$$",
        neighborhood: "Rittenhouse",
        oneLiner:
          "Best Belgian beer list in America, plus steaming pots of mussels and pommes frites.",
        mustOrder: "Mussels and frites with a Belgian tripel",
        matchDayFriendly: true,
      },
      {
        name: "Dalessandro's Steaks",
        cuisine: "Cheesesteak",
        priceRange: "$",
        neighborhood: "Roxborough",
        oneLiner:
          "The local's cheesesteak. Less tourist-famous than Pat's but arguably better.",
        mustOrder: "Cheesesteak with American and fried onions",
        matchDayFriendly: true,
      },
    ],
    attractions: [
      {
        name: "Independence Hall",
        category: "landmark",
        description:
          "Where the Declaration of Independence and the Constitution were debated and adopted. Free timed-entry tickets required.",
        duration: "1 hour",
        cost: "free",
        tip: "Get tickets early from the Independence Visitor Center — they run out by midday in summer.",
      },
      {
        name: "Liberty Bell Center",
        category: "landmark",
        description:
          "The cracked icon of American freedom, right across from Independence Hall.",
        duration: "20-30 min",
        cost: "free",
        tip: "The line moves fast. Best viewed first thing in the morning.",
      },
      {
        name: "Philadelphia Museum of Art",
        category: "museum",
        description:
          "World-class collection spanning centuries. Also: the Rocky Steps are outside.",
        duration: "2-3 hours",
        cost: "$$",
        tip: "Run up the steps. Do the Rocky pose. Everyone does it. Then go inside — the armor hall is incredible.",
      },
      {
        name: "Reading Terminal Market",
        category: "market",
        description:
          "One of America's oldest farmers' markets. Over 80 vendors selling Amish goods, produce, and prepared food.",
        duration: "1-2 hours",
        cost: "free",
        tip: "Go hungry. Hit Beiler's Donuts (Amish-made), DiNic's roast pork, and a Bassetts ice cream.",
      },
      {
        name: "Eastern State Penitentiary",
        category: "museum",
        description:
          "A crumbling, haunting former prison that once held Al Capone. One of the most atmospheric spots in any city.",
        duration: "1.5-2 hours",
        cost: "$$",
        tip: "The audio tour narrated by Steve Buscemi is outstanding. Don't skip it.",
      },
      {
        name: "Spruce Street Harbor Park",
        category: "park",
        description:
          "Seasonal pop-up park on the Delaware River waterfront with hammocks, food vendors, and floating gardens.",
        duration: "1-2 hours",
        cost: "free",
        tip: "Open May through September. Best in the evening when the string lights come on.",
      },
      {
        name: "Elfreth's Alley",
        category: "landmark",
        description:
          "The oldest continuously inhabited residential street in America (since 1702). Thirty-two Georgian and Federal houses.",
        duration: "30 min",
        cost: "free",
        tip: "Quick detour in Old City — photogenic and under 10 minutes to walk through.",
      },
      {
        name: "Italian Market (9th Street)",
        category: "market",
        description:
          "America's oldest outdoor market — produce stands, butchers, cheese shops, and bakeries stretching blocks.",
        duration: "1-2 hours",
        cost: "free",
        tip: "Get a cannoli at Isgro Pastries and a sandwich at Primo Hoagies. This is the real South Philly.",
      },
      {
        name: "Schuylkill River Trail",
        category: "activity",
        description:
          "Paved waterfront trail perfect for running, biking, or a sunset walk with skyline views.",
        duration: "1-2 hours",
        cost: "free",
        tip: "Rent an Indego bike for $4/ride and cruise from the Art Museum down to South Street.",
      },
      {
        name: "Magic Gardens",
        category: "museum",
        description:
          "Isaiah Zagar's immersive mosaic art environment — an entire alley and building covered floor to ceiling.",
        duration: "45 min - 1 hour",
        cost: "$",
        tip: "On South Street between 10th and 11th. Small but jaw-dropping. Great for photos.",
      },
    ],
    nightlife: [
      {
        name: "Yards Brewing Company",
        type: "brewery",
        neighborhood: "Northern Liberties",
        oneLiner:
          "Philly's flagship brewery with a massive taproom and beer garden. Philadelphia Pale Ale is a must.",
        priceRange: "$$",
      },
      {
        name: "Monk's Cafe",
        type: "bar",
        neighborhood: "Rittenhouse",
        oneLiner:
          "If you love Belgian beer, this is Mecca. 200+ Belgian bottles. Extraordinary tap list.",
        priceRange: "$$",
      },
      {
        name: "Xfinity Live!",
        type: "sports_bar",
        neighborhood: "South Philadelphia",
        oneLiner:
          "Stadium-adjacent entertainment complex with multiple bars, giant screens, and 25,000 square feet of match day energy.",
        priceRange: "$$",
      },
      {
        name: "Garage Fishtown",
        type: "bar",
        neighborhood: "Fishtown",
        oneLiner:
          "Converted garage with games, cheap beer, and the casual Fishtown vibe that makes the neighborhood great.",
        priceRange: "$",
      },
      {
        name: "The Barbary",
        type: "dive",
        neighborhood: "Fishtown",
        oneLiner:
          "Sticky floors, strong drinks, pinball machines, and a backyard that gets rowdy on weekends.",
        priceRange: "$",
      },
      {
        name: "Assembly Rooftop Lounge",
        type: "rooftop",
        neighborhood: "Center City",
        oneLiner:
          "Logan Hotel rooftop with skyline views, craft cocktails, and a chic crowd.",
        priceRange: "$$$",
      },
      {
        name: "Johnny Brenda's",
        type: "live_music",
        neighborhood: "Fishtown",
        oneLiner:
          "The venue that helped start the Fishtown renaissance — indie bands, great bar, no attitude.",
        priceRange: "$$",
      },
      {
        name: "Evil Genius Beer Lab",
        type: "brewery",
        neighborhood: "Fishtown",
        oneLiner:
          "Pop-culture-themed beers (names like 'Stacy's Mom') in a laid-back Fishtown taproom.",
        priceRange: "$",
      },
    ],
    shopping: [
      {
        name: "Rittenhouse Row",
        type: "Upscale boutiques & dining",
        description:
          "Walnut Street corridor with designer stores, local boutiques, and fine dining along the park.",
      },
      {
        name: "South Street",
        type: "Eclectic & indie shops",
        description:
          "Philly's bohemian strip — tattoo parlors, record shops, vintage clothing, and the Magic Gardens.",
      },
      {
        name: "Italian Market (9th Street)",
        type: "Food & specialty shops",
        description:
          "America's oldest open-air market — cheese shops, butchers, spice vendors, and fresh produce daily.",
      },
      {
        name: "King of Prussia Mall",
        type: "Mega mall (suburban)",
        description:
          "Largest mall in America by retail space. 30 minutes from downtown if you want the full shopping blitz.",
      },
    ],
    localTips: [
      "Cheesesteak ordering etiquette at Pat's or Geno's: say your cheese first (Whiz, provolone, American) then 'wit' or 'witout' onions. That's it. Move fast.",
      "The Broad Street Line (orange subway) goes directly from Center City to the stadium complex for $2.50. It's the best deal in sports.",
      "Philly is one of the most walkable cities in America. Center City to Old City to South Philly — all on foot.",
      "BYOB culture is huge. Many of the best restaurants don't serve alcohol — you bring your own wine. No corkage fee.",
      "Don't skip Reading Terminal Market. Go for breakfast or lunch, not dinner — most vendors close by 5 or 6 PM.",
      "The Art Museum is free on the first Sunday of every month and on Friday evenings after 5 PM.",
    ],
    gettingAround: {
      summary:
        "Philly is flat, compact, and extremely walkable. The subway has two lines (Broad Street and Market-Frankford). Indego bike-share fills the gaps.",
      toStadium:
        "Lincoln Financial Field is in the South Philadelphia sports complex. The Broad Street Line (BSL) runs directly to NRG Station (formerly AT&T Station) right at the stadium. It's the easiest stadium commute of any city on this trip. $2.50, 15 minutes from Center City.",
      apps: ["SEPTA", "Uber", "Lyft", "Indego"],
      tips: [
        "Broad Street Line to the stadium — it's direct, cheap, and fast. No reason to drive.",
        "SEPTA Key card is reloadable. Buy one at any station for $4.95 plus fare.",
        "Walking from Rittenhouse to Old City takes about 20 minutes through the heart of downtown.",
        "On match day, the BSL runs extra trains. Expect packed cars — arrive early or wait a train.",
      ],
    },
    matchDayGuide: {
      arriveEarlyTip:
        "Arrive 2 hours early. The stadium complex tailgate scene is legendary — Philly fans bring serious energy, grills, and sound systems. Xfinity Live! opens early on match days.",
      nearStadium: [
        "Xfinity Live! — massive sports entertainment complex right next to the stadium with multiple bars, screens, and food options.",
        "Stadium parking lot tailgates — South Philly fans know how to throw down. Bring your own or make friends.",
        "Chickie's & Pete's — crab fries and cold beer at the original South Philly location, a short walk from the stadium.",
      ],
      afterParty:
        "Head back to Fishtown or Center City. Yards Brewing, Johnny Brenda's, and Garage are all perfect post-match spots. The BSL will be packed but runs late on event nights.",
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  //  WASHINGTON DC
  // ══════════════════════════════════════════════════════════════════════
  "Washington DC": {
    overview:
      "No World Cup venue here, but DC is the perfect rest stop — free world-class museums, monuments that make you feel small in the best way, and a food scene that's quietly become one of the best on the East Coast. It's where your group recharges, does some laundry, and reminds themselves that America is pretty incredible.",
    neighborhoods: [
      {
        name: "Georgetown",
        description:
          "Historic waterfront neighborhood with cobblestone streets, upscale dining, boutique shopping, and university energy.",
        vibe: "Upscale",
      },
      {
        name: "Adams Morgan",
        description:
          "DC's most diverse and vibrant nightlife strip — international restaurants, dive bars, and late-night pizza.",
        vibe: "Eclectic",
      },
      {
        name: "Dupont Circle",
        description:
          "Tree-lined rowhouses, embassy row, bookstores, and some of the city's best restaurants.",
        vibe: "Artsy",
      },
      {
        name: "U Street Corridor",
        description:
          "DC's historic Black cultural hub — jazz heritage, Ben's Chili Bowl, murals, and a thriving bar scene.",
        vibe: "Historic",
      },
    ],
    restaurants: [
      {
        name: "Ben's Chili Bowl",
        cuisine: "Half-Smokes / American",
        priceRange: "$",
        neighborhood: "U Street",
        oneLiner:
          "DC institution since 1958. The chili half-smoke is the signature dish of the entire city.",
        mustOrder: "Chili half-smoke with mustard and onions",
        matchDayFriendly: true,
      },
      {
        name: "Old Ebbitt Grill",
        cuisine: "American Classic",
        priceRange: "$$$",
        neighborhood: "Penn Quarter",
        oneLiner:
          "DC's oldest saloon, steps from the White House. Presidents and lobbyists have eaten here since 1856.",
        mustOrder: "Oysters at the raw bar",
        matchDayFriendly: true,
      },
      {
        name: "Founding Farmers",
        cuisine: "Farm-to-Table",
        priceRange: "$$",
        neighborhood: "Foggy Bottom",
        oneLiner:
          "Farmer-owned restaurant with comfort food done right. Brunch is a destination.",
        mustOrder: "Fried chicken and waffles at brunch",
        matchDayFriendly: true,
      },
      {
        name: "Rasika",
        cuisine: "Modern Indian",
        priceRange: "$$$",
        neighborhood: "Penn Quarter",
        oneLiner:
          "One of the best Indian restaurants in North America. The palak chaat is famous for a reason.",
        mustOrder: "Palak chaat (crispy spinach)",
        matchDayFriendly: false,
      },
      {
        name: "Bub and Pop's",
        cuisine: "Sandwiches / Deli",
        priceRange: "$",
        neighborhood: "Dupont Circle",
        oneLiner:
          "Old-school deli making everything from scratch — the Italian sub is a masterpiece.",
        mustOrder: "The Italian sub",
        matchDayFriendly: true,
      },
      {
        name: "Le Diplomate",
        cuisine: "French Bistro",
        priceRange: "$$$",
        neighborhood: "14th Street",
        oneLiner:
          "Parisian brasserie that's become DC's power-brunch spot. Steak frites and people-watching.",
        mustOrder: "Steak frites with a glass of Bordeaux",
        matchDayFriendly: false,
      },
      {
        name: "Roaming Rooster",
        cuisine: "Fried Chicken",
        priceRange: "$",
        neighborhood: "Multiple locations",
        oneLiner:
          "DC's fried chicken cult. Started as a food truck, graduated to brick-and-mortar on pure deliciousness.",
        mustOrder: "OG Roaming Rooster sandwich",
        matchDayFriendly: true,
      },
      {
        name: "Bad Saint",
        cuisine: "Filipino",
        priceRange: "$$",
        neighborhood: "Columbia Heights",
        oneLiner:
          "Tiny 24-seat Filipino restaurant that earned a Michelin star. No reservations — line up early.",
        mustOrder: "Kare-kare (oxtail peanut stew)",
        matchDayFriendly: false,
      },
      {
        name: "Duke's Grocery",
        cuisine: "Brunch / Burgers",
        priceRange: "$$",
        neighborhood: "Dupont Circle",
        oneLiner:
          "East London-inspired neighborhood spot. The Proper Burger is one of the best in DC.",
        mustOrder: "The Proper Burger",
        matchDayFriendly: true,
      },
      {
        name: "Chaia Tacos",
        cuisine: "Vegetarian Mexican",
        priceRange: "$",
        neighborhood: "Georgetown",
        oneLiner:
          "Farm-to-taco vegetarian spot that proves you don't need meat for a perfect taco.",
        mustOrder: "Creamy kale and potato taco",
        matchDayFriendly: true,
      },
      {
        name: "Maydan",
        cuisine: "Middle Eastern / North African",
        priceRange: "$$$",
        neighborhood: "14th Street",
        oneLiner:
          "Wood-fired whole-animal cooking inspired by the Silk Road. Dramatic, communal, unforgettable.",
        mustOrder: "Whole roasted lamb shoulder (feeds the group)",
        matchDayFriendly: false,
      },
      {
        name: "Compass Rose",
        cuisine: "International Small Plates",
        priceRange: "$$",
        neighborhood: "14th Street",
        oneLiner:
          "Every dish is from a different country. The Georgian khachapuri (cheese bread) is addictive.",
        mustOrder: "Khachapuri (Georgian cheese bread)",
        matchDayFriendly: true,
      },
    ],
    attractions: [
      {
        name: "National Mall",
        category: "landmark",
        description:
          "Two miles of monuments — Lincoln Memorial, Washington Monument, WWII Memorial, MLK Memorial, and more. All free, all powerful.",
        duration: "3-5 hours",
        cost: "free",
        tip: "Walk it at sunset. Start at the Capitol, end at the Lincoln Memorial. The reflecting pool at dusk is unforgettable.",
      },
      {
        name: "Smithsonian National Air and Space Museum",
        category: "museum",
        description:
          "The Wright Flyer, Apollo 11, the Space Shuttle Discovery. America's most visited museum — and it's free.",
        duration: "2-3 hours",
        cost: "free",
        tip: "Recently renovated with new exhibits. Get there at opening to beat the school groups.",
      },
      {
        name: "Smithsonian National Museum of African American History",
        category: "museum",
        description:
          "The most impactful museum in DC. The history galleries underground are deeply moving. The culture floors celebrate joy.",
        duration: "3-4 hours",
        cost: "free",
        tip: "Timed entry passes release online in advance. Grab them as soon as they drop — they go fast.",
      },
      {
        name: "Lincoln Memorial",
        category: "landmark",
        description:
          "Sit on the steps where MLK gave the 'I Have a Dream' speech. The view down the reflecting pool to the Capitol is iconic.",
        duration: "30-60 min",
        cost: "free",
        tip: "Visit at night. The memorial is lit up and nearly empty. Far more powerful than daytime.",
      },
      {
        name: "Georgetown Waterfront",
        category: "park",
        description:
          "Scenic waterfront park along the Potomac — restaurants, kayaking, and a riverside walk with Key Bridge views.",
        duration: "1-2 hours",
        cost: "free",
        tip: "Rent a kayak at Key Bridge Boathouse. Or just grab a drink at the waterfront and watch the rowers.",
      },
      {
        name: "Library of Congress",
        category: "landmark",
        description:
          "The largest library in the world. The Great Hall's architecture alone justifies the visit. Free tours available.",
        duration: "1-2 hours",
        cost: "free",
        tip: "Enter through the Jefferson Building. The main reading room is one of the most beautiful spaces in America.",
      },
      {
        name: "National Gallery of Art",
        category: "museum",
        description:
          "Vermeer, Monet, Pollock — two buildings, one world-class collection. The sculpture garden has a fountain and seasonal ice rink.",
        duration: "2-3 hours",
        cost: "free",
        tip: "The underground walkway between the East and West buildings has a moving light installation. Don't miss it.",
      },
      {
        name: "Tidal Basin",
        category: "park",
        description:
          "The iconic reservoir surrounded by the Jefferson Memorial, FDR Memorial, and MLK Memorial. Rent a paddleboat.",
        duration: "1-2 hours",
        cost: "free",
        tip: "Cherry blossom season is spring, but the paddleboats and memorials are beautiful in June too.",
      },
      {
        name: "U Street Murals Walk",
        category: "activity",
        description:
          "Self-guided walk through DC's street art and jazz heritage. The Duke Ellington mural is a highlight.",
        duration: "1-2 hours",
        cost: "free",
        tip: "Start at the African American Civil War Memorial and walk south. Ben's Chili Bowl is right on the route.",
      },
      {
        name: "The Wharf",
        category: "market",
        description:
          "New waterfront district with restaurants, live music venues, and a fish market dating back to 1805.",
        duration: "2-3 hours",
        cost: "free",
        tip: "The Municipal Fish Market is the oldest continuous fish market in the US. Grab steamed crabs and sit by the water.",
      },
    ],
    nightlife: [
      {
        name: "Dan's Cafe",
        type: "dive",
        neighborhood: "Adams Morgan",
        oneLiner:
          "Legendary dive bar. They hand you a squeeze bottle of mixer and a bottle of liquor. You pour your own.",
        priceRange: "$",
      },
      {
        name: "The Gibson",
        type: "bar",
        neighborhood: "U Street",
        oneLiner:
          "Speakeasy-style cocktail bar behind an unmarked door. Ring the buzzer. Trust the bartender.",
        priceRange: "$$$",
      },
      {
        name: "Blagden Alley",
        type: "bar",
        neighborhood: "Shaw",
        oneLiner:
          "Hidden alley with multiple bars and restaurants — Columbia Room, Tiger Fork, and Calico all share the same secret corridor.",
        priceRange: "$$",
      },
      {
        name: "Madam's Organ",
        type: "live_music",
        neighborhood: "Adams Morgan",
        oneLiner:
          "Blues, soul, and R&B seven nights a week. The rooftop is a party. The name is unforgettable.",
        priceRange: "$$",
      },
      {
        name: "Bluejacket Brewery",
        type: "brewery",
        neighborhood: "Navy Yard",
        oneLiner:
          "One of DC's best breweries with an adventurous tap list in the Navy Yard waterfront district.",
        priceRange: "$$",
      },
      {
        name: "Lucky Bar",
        type: "sports_bar",
        neighborhood: "Dupont Circle",
        oneLiner:
          "DC's original soccer bar. Every major match on every screen. The place to watch when there's no stadium.",
        priceRange: "$",
      },
      {
        name: "Service Bar",
        type: "bar",
        neighborhood: "U Street",
        oneLiner:
          "Bartender-owned cocktail bar with a menu that changes constantly. Serious drinks, casual vibe.",
        priceRange: "$$",
      },
      {
        name: "The Rooftop at The Graham",
        type: "rooftop",
        neighborhood: "Georgetown",
        oneLiner:
          "Intimate Georgetown rooftop with panoramic views over the Potomac and Key Bridge.",
        priceRange: "$$$",
      },
    ],
    shopping: [
      {
        name: "Georgetown (M Street & Wisconsin Ave)",
        type: "Boutiques & designer retail",
        description:
          "Historic streets lined with shops from indie boutiques to Nike, Zara, and Apple. The waterfront adds dining options.",
      },
      {
        name: "Eastern Market",
        type: "Artisan & farmers market",
        description:
          "Capitol Hill's weekend market with local artisans, antiques, fresh produce, and food vendors.",
      },
      {
        name: "14th Street Corridor",
        type: "Trendy local shops",
        description:
          "The trendiest strip in DC — independent clothing stores, home goods, and design shops mixed with restaurants.",
      },
      {
        name: "Union Market",
        type: "Food & specialty market",
        description:
          "Industrial-chic food hall in NoMa with local vendors, specialty groceries, and a rooftop cinema in summer.",
      },
    ],
    localTips: [
      "Every Smithsonian museum is free. All of them. There are 21. You could spend a week and not see them all.",
      "DC has no World Cup stadium — it's a rest day between Philly and Atlanta. Use it to recharge.",
      "The Metro (WMATA) is clean, fast, and covers most tourist areas. Paper farecard machines take cash.",
      "Monuments are open 24/7 and free. Walking the Mall at night is a completely different (and better) experience.",
      "DC summers are brutally humid. Hydrate constantly, seek shade, and duck into free air-conditioned museums.",
      "Lucky Bar in Dupont Circle is the soccer bar — even without a stadium, match viewing here is electric.",
    ],
    gettingAround: {
      summary:
        "The Metro covers most of DC efficiently. Capital Bikeshare is excellent for the Mall and waterfront. Walking is great in individual neighborhoods.",
      toStadium:
        "No World Cup stadium in DC. This is a rest and explore stop. If watching matches, head to Lucky Bar (Dupont Circle) or one of the many bars screening games along U Street and 14th Street.",
      apps: ["WMATA Metro", "Uber", "Lyft", "Capital Bikeshare"],
      tips: [
        "Metro uses distance-based fares — tap in and tap out. $2-6 per ride depending on distance.",
        "Capital Bikeshare has 700+ stations. Single ride is $1 for 30 minutes. Great for the Mall.",
        "Georgetown has no Metro stop — take the DC Circulator bus from Dupont Circle or Rosslyn.",
        "Avoid driving. Parking is expensive and the street grid is deliberately confusing (thanks, L'Enfant).",
      ],
    },
    matchDayGuide: {
      arriveEarlyTip:
        "No stadium here, but match-day energy fills the bars and public viewing areas. Arrive at your chosen spot 1-2 hours before kickoff for a good seat.",
      nearStadium: [
        "Lucky Bar — DC's soccer HQ. Every match, every screen, all tournament long.",
        "Public viewing at the National Mall — check FIFA Fan Fest schedules for big-screen events.",
        "Penn Social — massive bar in Penn Quarter with dozens of screens and a game-day atmosphere.",
      ],
      afterParty:
        "Adams Morgan comes alive after dark. Madam's Organ for live blues, Dan's Cafe for the most unique dive bar experience you'll ever have, and late-night Jumbo Slice pizza to cap the night.",
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  //  ATLANTA
  // ══════════════════════════════════════════════════════════════════════
  Atlanta: {
    overview:
      "Atlanta is the cultural capital of the American South — hip-hop royalty, civil rights history, world-class BBQ, and a brand-new stadium with a retractable roof and $2 hot dogs. The city sprawls, but the best neighborhoods are clustered along the BeltLine trail, making it feel walkable where it matters. In June, expect heat, thunderstorms, and Southern hospitality at maximum.",
    neighborhoods: [
      {
        name: "Midtown",
        description:
          "Atlanta's arts district — Piedmont Park, the High Museum, Colony Square, and some of the best restaurants in the city.",
        vibe: "Artsy",
      },
      {
        name: "Old Fourth Ward (O4W)",
        description:
          "Martin Luther King Jr.'s birthplace, the BeltLine Eastside Trail, and Ponce City Market all in one neighborhood.",
        vibe: "Historic",
      },
      {
        name: "Buckhead",
        description:
          "Atlanta's upscale playground — high-end dining, luxury shopping, and the nightlife strip along Peachtree Road.",
        vibe: "Upscale",
      },
      {
        name: "East Atlanta Village",
        description:
          "Dive bars, taco joints, and a tight-knit community vibe. Where Atlanta stays weird.",
        vibe: "Eclectic",
      },
    ],
    restaurants: [
      {
        name: "Fox Bros Bar-B-Q",
        cuisine: "BBQ",
        priceRange: "$$",
        neighborhood: "Candler Park",
        oneLiner:
          "Texas-style brisket in the heart of the South. The tater tot side dish is unreasonably good.",
        mustOrder: "Brisket plate with Brunswick stew and tater tots",
        matchDayFriendly: true,
      },
      {
        name: "Ponce City Market",
        cuisine: "Food Hall (everything)",
        priceRange: "$$",
        neighborhood: "Old Fourth Ward",
        oneLiner:
          "Massive food hall in a converted Sears building with rooftop amusement rides and skyline views.",
        mustOrder: "Hop around — Jia, H&F Burger, Honeysuckle Gelato",
        matchDayFriendly: true,
      },
      {
        name: "The Varsity",
        cuisine: "Fast Food Institution",
        priceRange: "$",
        neighborhood: "Midtown",
        oneLiner:
          "World's largest drive-in since 1928. 'What'll ya have?' is how every order starts.",
        mustOrder: "Chili cheese dog with a Frosted Orange",
        matchDayFriendly: true,
      },
      {
        name: "Busy Bee Cafe",
        cuisine: "Soul Food",
        priceRange: "$",
        neighborhood: "Vine City",
        oneLiner:
          "Atlanta soul food landmark since 1947. MLK ate here. The fried chicken is divine.",
        mustOrder: "Fried chicken with mac and cheese and collard greens",
        matchDayFriendly: true,
      },
      {
        name: "Bacchanalia",
        cuisine: "Fine Dining / American",
        priceRange: "$$$",
        neighborhood: "Westside",
        oneLiner:
          "Atlanta's most celebrated restaurant for 30 years. Seasonal, refined, and worth the splurge.",
        mustOrder: "Tasting menu with wine pairing",
        matchDayFriendly: false,
      },
      {
        name: "Hattie B's Hot Chicken",
        cuisine: "Nashville Hot Chicken",
        priceRange: "$",
        neighborhood: "Midtown",
        oneLiner:
          "Nashville transplant that's become an Atlanta obsession. The line moves fast.",
        mustOrder: "Medium or Hot tenders with pimento mac and banana pudding",
        matchDayFriendly: true,
      },
      {
        name: "Gunshow",
        cuisine: "Creative American",
        priceRange: "$$$",
        neighborhood: "Glenwood Park",
        oneLiner:
          "Chefs bring dishes to your table dim-sum style. You pick what looks amazing. Everything does.",
        mustOrder: "Whatever the chefs bring — that's the point",
        matchDayFriendly: false,
      },
      {
        name: "Buford Highway Farmers Market",
        cuisine: "International (everything)",
        priceRange: "$",
        neighborhood: "Buford Highway",
        oneLiner:
          "Not a restaurant — an international food wonderland. Every cuisine on earth under one roof.",
        mustOrder: "Explore the prepared food section: Korean, Vietnamese, Mexican, Chinese",
        matchDayFriendly: true,
      },
      {
        name: "Antico Pizza Napoletana",
        cuisine: "Neapolitan Pizza",
        priceRange: "$",
        neighborhood: "Westside",
        oneLiner:
          "BYOB pizza shop with a roaring wood-fired oven. Cash only. Always packed. Always worth it.",
        mustOrder: "San Gennaro pizza",
        matchDayFriendly: true,
      },
      {
        name: "Slutty Vegan",
        cuisine: "Vegan Burgers",
        priceRange: "$",
        neighborhood: "West View",
        oneLiner:
          "Plant-based burgers with attitude. The lines are long because it's that good.",
        mustOrder: "One Night Stand (vegan burger with vegan bacon and cheese)",
        matchDayFriendly: true,
      },
      {
        name: "Mary Mac's Tea Room",
        cuisine: "Southern Comfort",
        priceRange: "$$",
        neighborhood: "Midtown",
        oneLiner:
          "Atlanta's dining room since 1945. Southern cooking at its most traditional and generous.",
        mustOrder: "Fried chicken with pot likker and cornbread",
        matchDayFriendly: true,
      },
      {
        name: "Supremo Taqueria",
        cuisine: "Mexican Street Food",
        priceRange: "$",
        neighborhood: "Buford Highway",
        oneLiner:
          "Authentic Mexican street tacos on Buford Highway. Al pastor from the spit.",
        mustOrder: "Tacos al pastor",
        matchDayFriendly: true,
      },
    ],
    attractions: [
      {
        name: "Martin Luther King Jr. National Historical Park",
        category: "landmark",
        description:
          "MLK's birth home, Ebenezer Baptist Church, and the King Center. A pilgrimage for American history.",
        duration: "2-3 hours",
        cost: "free",
        tip: "Free timed-entry tickets for the birth home are first-come, first-served. Arrive early.",
      },
      {
        name: "Atlanta BeltLine Eastside Trail",
        category: "activity",
        description:
          "2.4-mile paved trail connecting Piedmont Park to Ponce City Market and Krog Street Market, lined with public art.",
        duration: "1-3 hours",
        cost: "free",
        tip: "Walk or rent a scooter. The murals change regularly. End at Ponce City Market for food.",
      },
      {
        name: "Georgia Aquarium",
        category: "activity",
        description:
          "The largest aquarium in the Western Hemisphere — whale sharks, beluga whales, and manta rays.",
        duration: "2-3 hours",
        cost: "$$",
        tip: "Book the Ocean Voyager exhibit early. Whale sharks are mesmerizing. Go on a weekday if possible.",
      },
      {
        name: "World of Coca-Cola",
        category: "museum",
        description:
          "Coca-Cola's HQ museum — the vault, the tasting room with 100+ international sodas, and the history of an Atlanta icon.",
        duration: "1.5-2 hours",
        cost: "$$",
        tip: "The international tasting room is the highlight — try Beverly from Italy. You'll regret it, but in a fun way.",
      },
      {
        name: "Piedmont Park",
        category: "park",
        description:
          "Atlanta's Central Park — 200 acres of green space, skyline views, dog parks, and the weekly Green Market on Saturdays.",
        duration: "1-2 hours",
        cost: "free",
        tip: "Best skyline photos are from the park's south side looking toward Midtown. Saturday farmers market is excellent.",
      },
      {
        name: "High Museum of Art",
        category: "museum",
        description:
          "The South's premier art museum — Richard Meier architecture, strong folk art collection, and rotating blockbuster exhibits.",
        duration: "2-3 hours",
        cost: "$$",
        tip: "Free on the second Sunday of every month. The building's architecture is as impressive as the art inside.",
      },
      {
        name: "Krog Street Market",
        category: "market",
        description:
          "Converted warehouse food hall on the BeltLine — craft cocktails, ramen, oysters, and a great patio scene.",
        duration: "1-2 hours",
        cost: "free",
        tip: "Ticonderoga Club inside the market is one of Atlanta's best bars. Get there early for a seat.",
      },
      {
        name: "Centennial Olympic Park",
        category: "park",
        description:
          "Built for the 1996 Olympics — the Fountain of Rings, SkyView Ferris wheel, and walking distance to the stadium.",
        duration: "30-60 min",
        cost: "free",
        tip: "The Fountain of Rings show runs four times daily with synchronized water jets and lights.",
      },
      {
        name: "Center for Civil and Human Rights",
        category: "museum",
        description:
          "Powerful interactive museum covering the US civil rights movement and global human rights struggles.",
        duration: "1.5-2 hours",
        cost: "$$",
        tip: "The lunch counter simulation puts you in the seat of a civil rights protester. Unforgettable and uncomfortable.",
      },
      {
        name: "Jimmy Carter Presidential Library",
        category: "museum",
        description:
          "The 39th president's library and museum set in 35 acres of gardens. A quiet, reflective stop.",
        duration: "1.5-2 hours",
        cost: "$",
        tip: "The Japanese garden on the grounds is one of Atlanta's hidden gems. Perfect for a calm morning.",
      },
    ],
    nightlife: [
      {
        name: "Monday Night Brewing",
        type: "brewery",
        neighborhood: "Westside",
        oneLiner:
          "Atlanta's favorite taproom — rotating small-batch brews, food trucks, and a laid-back patio.",
        priceRange: "$$",
      },
      {
        name: "The Vortex Bar & Grill",
        type: "bar",
        neighborhood: "Little Five Points",
        oneLiner:
          "Walk through the giant skull entrance. Stay for creative burgers and strong drinks. No one under 21.",
        priceRange: "$$",
      },
      {
        name: "Ticonderoga Club",
        type: "bar",
        neighborhood: "Krog Street Market",
        oneLiner:
          "One of Atlanta's best cocktail bars, hidden inside a food hall. New England-inspired, Southern-executed.",
        priceRange: "$$$",
      },
      {
        name: "Terminal West",
        type: "live_music",
        neighborhood: "Westside",
        oneLiner:
          "Converted iron and steel warehouse turned into one of the best live music venues in the South.",
        priceRange: "$$",
      },
      {
        name: "Clermont Lounge",
        type: "dive",
        neighborhood: "Poncey-Highland",
        oneLiner:
          "Atlanta's most legendary dive — an institution since 1965. You haven't done Atlanta until you've been here.",
        priceRange: "$",
      },
      {
        name: "SkyLounge at Glenn Hotel",
        type: "rooftop",
        neighborhood: "Downtown",
        oneLiner:
          "Downtown rooftop with views of the stadium and city skyline. Perfect pre-game cocktail spot.",
        priceRange: "$$$",
      },
      {
        name: "Stats Brewpub",
        type: "sports_bar",
        neighborhood: "Downtown",
        oneLiner:
          "Multi-level sports bar steps from Mercedes-Benz Stadium. Giant screens and a match-day crowd.",
        priceRange: "$$",
      },
      {
        name: "New Realm Brewing",
        type: "brewery",
        neighborhood: "BeltLine / Old Fourth Ward",
        oneLiner:
          "Massive BeltLine-adjacent brewery with a rooftop deck and Piedmont Park views.",
        priceRange: "$$",
      },
    ],
    shopping: [
      {
        name: "Ponce City Market",
        type: "Food, fashion & lifestyle",
        description:
          "Converted Sears building on the BeltLine with a curated mix of local shops, food, and a rooftop carnival.",
      },
      {
        name: "Little Five Points",
        type: "Vintage, vinyl & counterculture",
        description:
          "Atlanta's bohemian heart — record stores, thrift shops, tattoo parlors, and the Junkman's Daughter.",
      },
      {
        name: "Lenox Square & Phipps Plaza",
        type: "Luxury & department stores",
        description:
          "Buckhead's twin malls with Neiman Marcus, Nordstrom, Louis Vuitton, and every major brand.",
      },
      {
        name: "Westside Provisions District",
        type: "Boutique & design",
        description:
          "Industrial-chic shopping complex with local designers, home goods, and restaurants like Bacchanalia.",
      },
    ],
    localTips: [
      "MARTA rail goes directly to Mercedes-Benz Stadium — take it. Rideshare surge pricing on match days is brutal.",
      "Atlanta sprawls. Without a car, stick to MARTA, the BeltLine, and rideshare. Walking between neighborhoods isn't practical.",
      "Buford Highway is Atlanta's secret weapon — a corridor of incredible international restaurants from Korean to Ethiopian.",
      "Mercedes-Benz Stadium has $2 hot dogs, $3 refillable sodas, and $5 beers. Best concession prices in American sports.",
      "Afternoon thunderstorms in June are almost daily. They blow through fast — carry a light rain layer.",
      "The BeltLine connects Ponce City Market, Krog Street Market, and Piedmont Park by foot or scooter.",
    ],
    gettingAround: {
      summary:
        "Atlanta requires MARTA rail for stadium access and a mix of rideshare and BeltLine walking for neighborhood exploring. The city is spread out — plan accordingly.",
      toStadium:
        "Mercedes-Benz Stadium is downtown. MARTA's Dome/GWCC/Philips Arena/CNN Center station drops you at the stadium doorstep. Trains run frequently on event days. From Midtown, it's one stop. From the airport, it's a straight shot on the Gold/Red line. Rideshare surge pricing can triple fares — take MARTA.",
      apps: ["MARTA", "Uber", "Lyft", "Bird / Lime scooters"],
      tips: [
        "MARTA Breeze Card is $2 plus fares ($2.50/ride). Buy at any station vending machine.",
        "The BeltLine Eastside Trail is the best way to connect O4W, Midtown, and Inman Park on foot.",
        "Rent a scooter for the BeltLine — Bird and Lime are everywhere. Watch for pedestrians.",
        "Buckhead is 15-20 min from downtown by MARTA. Worth the trip for dining and nightlife.",
      ],
    },
    matchDayGuide: {
      arriveEarlyTip:
        "Arrive 2-3 hours early. Centennial Olympic Park turns into a massive fan zone with live music, food vendors, and the Fountain of Rings show. Mercedes-Benz Stadium's retractable roof means AC — arrive early and enjoy it.",
      nearStadium: [
        "Stats Brewpub — multi-level sports bar right next to the stadium. Arrive early for a spot.",
        "Centennial Olympic Park — fan zone atmosphere with food trucks and big screens before matches.",
        "Max's Coal Oven Pizzeria — quick, solid pizza at CNN Center, a short walk from the stadium.",
      ],
      afterParty:
        "The BeltLine and Old Fourth Ward come alive after matches. Ponce City Market rooftop, New Realm Brewing, or Ticonderoga Club at Krog Street Market are all great post-match destinations. For something wilder, head to Clermont Lounge.",
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  //  NASHVILLE
  // ══════════════════════════════════════════════════════════════════════
  Nashville: {
    overview:
      "Jonny's dream stop — and he's absolutely right. Nashville is one of those cities that grabs you by the ears and doesn't let go. Every door on Broadway hides a live band. Every kitchen hides a cast-iron skillet of hot chicken that'll rearrange your understanding of spice. The honky-tonks run noon to 3 AM, the neon never dims, and the Southern hospitality is so thick you'll wonder if everyone's putting it on (they're not). No World Cup matches here — this is a pure fun stop. Three days of live music, whiskey, hot chicken, and late nights in Music City. For three British lads, it doesn't get better than this.",
    neighborhoods: [
      {
        name: "Broadway / Downtown",
        description:
          "The legendary Lower Broadway strip — wall-to-wall honky-tonks, neon signs, live music pouring out of every door, and the Ryman Auditorium presiding over it all.",
        vibe: "Electric",
      },
      {
        name: "East Nashville",
        description:
          "The cool side of the river — craft cocktail bars, vinyl shops, indie restaurants, and a locals-first vibe that feels miles from the Broadway chaos.",
        vibe: "Hipster",
      },
      {
        name: "The Gulch",
        description:
          "Nashville's sleek, walkable pocket south of Broadway — boutique hotels, trendy restaurants, the famous 'What Lifts You' wings mural, and rooftop bars.",
        vibe: "Trendy",
      },
      {
        name: "Midtown / Music Row",
        description:
          "Where the music industry actually lives — recording studios, Vanderbilt University, and a strip of bars and restaurants along Elliston Place and Division Street.",
        vibe: "Local",
      },
    ],
    restaurants: [
      {
        name: "Hattie B's Hot Chicken",
        cuisine: "Nashville Hot Chicken",
        priceRange: "$",
        neighborhood: "Midtown",
        oneLiner:
          "The hot chicken institution with the perpetual queue. Worth every minute of the wait. Start at Medium if you value your dignity.",
        mustOrder: "Half bird, Medium or Hot, with pimento mac and banana pudding",
        matchDayFriendly: true,
      },
      {
        name: "Prince's Hot Chicken Shack",
        cuisine: "Nashville Hot Chicken",
        priceRange: "$",
        neighborhood: "Ewing Drive",
        oneLiner:
          "The original. The one that started it all in the 1940s. A pilgrimage site for hot chicken devotees. The 'Hot' here is genuinely dangerous.",
        mustOrder: "Quarter dark, Medium heat — respect the OG on your first visit",
        matchDayFriendly: true,
      },
      {
        name: "Bolton's Spicy Chicken & Fish",
        cuisine: "Nashville Hot Chicken / Fish",
        priceRange: "$",
        neighborhood: "East Nashville",
        oneLiner:
          "The local favourite that tourists sleep on. The hot fish is arguably better than the chicken — and that's saying something.",
        mustOrder: "Hot fish sandwich with white bread and pickles",
        matchDayFriendly: true,
      },
      {
        name: "Martin's Bar-B-Que Joint",
        cuisine: "BBQ",
        priceRange: "$$",
        neighborhood: "Downtown",
        oneLiner:
          "Whole-hog BBQ cooked over hickory in a massive pit. The pulled pork and cornbread are perfection. Get here before the lunch rush.",
        mustOrder: "Redneck Taco (pulled pork on cornbread) and the whole-hog plate",
        matchDayFriendly: true,
      },
      {
        name: "Biscuit Love",
        cuisine: "Southern Brunch",
        priceRange: "$$",
        neighborhood: "The Gulch",
        oneLiner:
          "Started as a food truck, now a Nashville brunch institution. The Bonuts alone are worth the trip — fried biscuit dough with lemon mascarpone.",
        mustOrder: "The East Nasty (fried chicken biscuit) and a Bonut",
        matchDayFriendly: true,
      },
      {
        name: "Assembly Food Hall",
        cuisine: "Food Hall (everything)",
        priceRange: "$$",
        neighborhood: "Downtown / 5th + Broadway",
        oneLiner:
          "Massive food hall overlooking Broadway with 30+ vendors, rooftop bars, and live music. Decision fatigue in the best way.",
        mustOrder: "Hop around — Prince's has an outpost here, plus tacos, sushi, and BBQ",
        matchDayFriendly: true,
      },
      {
        name: "Pancake Pantry",
        cuisine: "Breakfast / Brunch",
        priceRange: "$",
        neighborhood: "Hillsboro Village",
        oneLiner:
          "Nashville's breakfast queue since 1961. 23 varieties of pancakes and a line that wraps around the building on weekends.",
        mustOrder: "Sweet potato pancakes with cinnamon cream — non-negotiable",
        matchDayFriendly: true,
      },
      {
        name: "Peg Leg Porker",
        cuisine: "BBQ",
        priceRange: "$$",
        neighborhood: "The Gulch",
        oneLiner:
          "Award-winning dry-rubbed ribs and a whiskey selection that'd make a Scotsman weep. Unpretentious and brilliant.",
        mustOrder: "Dry-rubbed ribs with smoked wings and the BBQ nachos",
        matchDayFriendly: true,
      },
      {
        name: "The Catbird Seat",
        cuisine: "Fine Dining / Tasting Menu",
        priceRange: "$$$",
        neighborhood: "Midtown",
        oneLiner:
          "Nashville's most acclaimed restaurant — 22 seats around an open kitchen, multi-course tasting menu, and chefs who perform like musicians.",
        mustOrder: "The tasting menu (it's the only option — and it's extraordinary)",
        matchDayFriendly: false,
      },
      {
        name: "Loveless Cafe",
        cuisine: "Southern Comfort",
        priceRange: "$$",
        neighborhood: "Highway 100 (20 min from downtown)",
        oneLiner:
          "Country ham, scratch biscuits, and preserves since 1951. A bit of a drive but the real deal — no Nashville trip is complete without it.",
        mustOrder: "Country ham breakfast with biscuits and homemade preserves",
        matchDayFriendly: false,
      },
      {
        name: "Party Fowl",
        cuisine: "Nashville Hot Chicken / Craft Beer",
        priceRange: "$$",
        neighborhood: "The Gulch",
        oneLiner:
          "Hot chicken in every form imaginable — tacos, sliders, waffles — plus a huge craft beer list and a solid patio.",
        mustOrder: "Hot chicken and waffles with a local beer flight",
        matchDayFriendly: true,
      },
      {
        name: "Monell's Dining & Catering",
        cuisine: "Southern Family-Style",
        priceRange: "$$",
        neighborhood: "Germantown",
        oneLiner:
          "Communal tables, pass-the-dish Southern cooking. You sit with strangers and leave as friends. The skillet-fried chicken is legendary.",
        mustOrder: "Whatever's on the table — fried chicken, cornbread, greens, and sweet tea",
        matchDayFriendly: true,
      },
      {
        name: "Mas Tacos Por Favor",
        cuisine: "Mexican Street Food",
        priceRange: "$",
        neighborhood: "East Nashville",
        oneLiner:
          "Cash-only taco shack in a converted gas station. The elote and fried chicken tacos have a cult following for good reason.",
        mustOrder: "Fried chicken tacos and the elote (Mexican street corn)",
        matchDayFriendly: true,
      },
      {
        name: "Woolworth on 5th",
        cuisine: "Southern / Historic",
        priceRange: "$$",
        neighborhood: "Downtown",
        oneLiner:
          "A restored 1930s Woolworth lunch counter with civil rights history, Southern plates, and live jazz in the basement bar.",
        mustOrder: "Meat-and-three plate with the daily special and sweet tea",
        matchDayFriendly: true,
      },
    ],
    attractions: [
      {
        name: "Ryman Auditorium",
        category: "landmark",
        description:
          "The Mother Church of Country Music — a former tabernacle turned concert hall where Johnny Cash, Dolly, and Hank Williams made history. Even the backstage tour gives you chills.",
        duration: "1-2 hours",
        cost: "$$",
        tip: "Book a show if anything's on — the acoustics are sacred. Otherwise, the daytime tour lets you stand on the stage and strum a guitar.",
      },
      {
        name: "Country Music Hall of Fame & Museum",
        category: "museum",
        description:
          "The Smithsonian of country music — three floors of costumes, instruments, recordings, and stories from Hank to Taylor Swift.",
        duration: "2-3 hours",
        cost: "$$",
        tip: "Even if you don't love country, the craftsmanship and storytelling are incredible. The RCA Studio B combo ticket is the best value.",
      },
      {
        name: "The Parthenon",
        category: "landmark",
        description:
          "A full-scale replica of the Athens Parthenon, complete with a 42-foot gilded Athena statue inside. Gloriously absurd and genuinely impressive.",
        duration: "1-1.5 hours",
        cost: "$",
        tip: "Go at golden hour for photos. Inside, the Athena statue is jaw-dropping. The fact that this exists in Tennessee is peak America.",
      },
      {
        name: "Broadway Honky-Tonks",
        category: "activity",
        description:
          "Lower Broadway is a mile-long strip of honky-tonks with free live music pouring out of every door from 10 AM to 3 AM. Bar-hop your way through the most concentrated live music strip on earth.",
        duration: "2-6 hours (you won't want to leave)",
        cost: "free",
        tip: "No cover charge at most honky-tonks. Tip the bands — they're playing for tips, not a salary. $5-10 per set is the norm. Afternoons are less chaotic.",
      },
      {
        name: "Centennial Park",
        category: "park",
        description:
          "Nashville's urban park — home to the Parthenon, a one-mile walking trail, a lake, and summer festivals. A green oasis minutes from Broadway.",
        duration: "1-2 hours",
        cost: "free",
        tip: "Combine with the Parthenon visit. Good morning jog spot. The sunflower garden in June is lovely.",
      },
      {
        name: "Johnny Cash Museum",
        category: "museum",
        description:
          "The Man in Black's life in artifacts — handwritten lyrics, stage costumes, guitars, and personal letters. Small but powerful.",
        duration: "1-1.5 hours",
        cost: "$$",
        tip: "The attached Patsy Cline Museum upstairs is included with combo tickets. Both are worth it.",
      },
      {
        name: "RCA Studio B",
        category: "landmark",
        description:
          "The studio where Elvis, Dolly Parton, and the Everly Brothers recorded. You stand in the exact room where 'Are You Lonesome Tonight' was cut.",
        duration: "1 hour (guided tour)",
        cost: "$$",
        tip: "Only accessible via Country Music Hall of Fame tours — book the combo ticket. The guide will play the original recordings in the room. Goosebumps guaranteed.",
      },
      {
        name: "Printers Alley",
        category: "landmark",
        description:
          "A narrow alley off Church Street with a storied past — speakeasies during Prohibition, blues clubs in the '60s, and live music venues today.",
        duration: "30-60 min",
        cost: "free",
        tip: "Best at night when the neon signs glow. Skull's Rainbow Room inside is a supper club with burlesque and jazz — very Nashville.",
      },
      {
        name: "John Seigenthaler Pedestrian Bridge",
        category: "viewpoint",
        description:
          "A converted railroad bridge spanning the Cumberland River with postcard-perfect views of the Nashville skyline. The most Instagrammed spot in the city.",
        duration: "20-30 min",
        cost: "free",
        tip: "Walk it at sunset for the best skyline photos. Connects downtown to East Nashville — perfect way to start an East Nash evening.",
      },
      {
        name: "Shelby Bottoms Greenway",
        category: "park",
        description:
          "A sprawling 960-acre nature area along the Cumberland River with paved trails, bird watching, and a needed escape from the Broadway madness.",
        duration: "1-3 hours",
        cost: "free",
        tip: "Rent bikes from the BCycle stations and ride the greenway. The nature center has free maps. Great hangover cure.",
      },
    ],
    nightlife: [
      {
        name: "Tootsie's Orchid Lounge",
        type: "live_music",
        neighborhood: "Broadway",
        oneLiner:
          "The most famous honky-tonk in the world — where Willie Nelson was discovered. Three floors of live music and purple everything.",
        priceRange: "$",
      },
      {
        name: "Robert's Western World",
        type: "live_music",
        neighborhood: "Broadway",
        oneLiner:
          "The real deal on Broadway — genuine country, Brazilbilly house band, cold beer, and a fried bologna sandwich at 1 AM.",
        priceRange: "$",
      },
      {
        name: "The Stage on Broadway",
        type: "live_music",
        neighborhood: "Broadway",
        oneLiner:
          "Multi-level honky-tonk with a rooftop overlooking all of Lower Broad. The party floor for when you want volume and energy.",
        priceRange: "$",
      },
      {
        name: "L.A. Jackson",
        type: "rooftop",
        neighborhood: "The Gulch",
        oneLiner:
          "Rooftop bar atop the Thompson Hotel with skyline views, craft cocktails, and a scene that's more LA than Nashville. Dress up slightly.",
        priceRange: "$$$",
      },
      {
        name: "Rare Bird",
        type: "rooftop",
        neighborhood: "The Gulch",
        oneLiner:
          "Noelle Hotel's rooftop bar with a retro-glam vibe, creative cocktails, and a view of the Ryman. More intimate than L.A. Jackson.",
        priceRange: "$$$",
      },
      {
        name: "The 5 Spot",
        type: "live_music",
        neighborhood: "East Nashville",
        oneLiner:
          "East Nashville's living room — funk, soul, R&B, and Monday night dance parties. The antidote to Broadway's country-only diet.",
        priceRange: "$",
      },
      {
        name: "The Basement / Basement East",
        type: "live_music",
        neighborhood: "East Nashville",
        oneLiner:
          "Where Nashville's indie and rock scene lives. The 'Be A Good Neighbor' mural is iconic. Check the calendar — you might catch someone before they're famous.",
        priceRange: "$$",
      },
      {
        name: "Southern Grist Brewing Company",
        type: "brewery",
        neighborhood: "East Nashville",
        oneLiner:
          "Nashville's best craft brewery — bold fruited sours, hazy IPAs, and a taproom with food trucks parked outside. A proper pint after Broadway madness.",
        priceRange: "$$",
      },
    ],
    shopping: [
      {
        name: "Broadway Souvenir Strip",
        type: "Souvenirs, boots & Western wear",
        description:
          "Wall-to-wall boot shops, hat stores, and souvenir emporiums. Boot Country and Nashville Cowboy are the biggest. Buy the hat — you'll regret it if you don't.",
      },
      {
        name: "The Gulch Shopping",
        type: "Boutique fashion & lifestyle",
        description:
          "Trendy boutiques, Judith Bright jewelry, and the famous 'What Lifts You' angel wings mural for obligatory photos.",
      },
      {
        name: "12South",
        type: "Local boutiques & vintage",
        description:
          "Nashville's cutest shopping street — Draper James (Reese Witherspoon's brand), Imogene + Willie jeans, White's Mercantile, and excellent coffee at Frothy Monkey.",
      },
      {
        name: "Marathon Village",
        type: "Artisan & craft",
        description:
          "A converted 1881 auto factory housing local artisans — Olive & Sinclair chocolate, Batch Nashville gifts, Nelson's Green Brier Distillery, and Third Man Records (Jack White's label).",
      },
    ],
    localTips: [
      "Tipping culture: 20% at sit-down restaurants, $1-2 per drink at bars. British lads — this is non-negotiable in America. Budget for it.",
      "June in Nashville is HOT — 32-35°C with humidity that hits like a wall. Hydrate aggressively. Alternate between air-conditioned honky-tonks and outdoor activities.",
      "Broadway timing matters: afternoons (12-5 PM) are fun and manageable. After 8 PM it becomes absolute chaos — brilliant chaos, but plan accordingly.",
      "Hot chicken spice levels are real. 'Medium' at Prince's or Hattie B's is hotter than anything in the UK. Start one level below where your ego tells you. You can always go up.",
      "Cowboy boots and hats: buy them. Wear them. You're in Nashville. Nobody will judge you — they'll respect it. Boot shops on Broadway will fit you properly.",
      "Pedal taverns (party bikes) clog Broadway and are full of hen parties. Funny to watch, not worth riding. Spend that money on live music and whiskey instead.",
      "Uber/Lyft from East Nashville or The Gulch to Broadway is 5-10 minutes, $8-12. Walking Broadway itself is easy — everything is on one strip. Don't drive and park.",
      "Many Broadway honky-tonks have no cover charge but bands play for tips. Carry cash — $5-10 per band is expected. Some smaller venues off Broadway do charge $5-10 cover.",
    ],
    gettingAround: {
      summary:
        "Nashville's core is compact enough to walk, especially Broadway and The Gulch. East Nashville and Midtown require Uber/Lyft. No useful public transit for visitors.",
      toStadium:
        "No World Cup matches in Nashville — but Broadway is walkable from downtown hotels. Lyft/Uber for East Nashville and The Gulch. Most of the action is on Lower Broadway, which is best on foot.",
      apps: ["Uber", "Lyft", "BCycle (bike share)", "Bird / Lime scooters"],
      tips: [
        "Broadway is a straight line — walk it end to end. Rideshare surge pricing on weekend nights is brutal; walk if you're already downtown.",
        "East Nashville is a quick Uber over the Pedestrian Bridge, or a 15-minute walk across the bridge itself.",
        "BCycle bike share stations are scattered downtown — great for reaching Shelby Bottoms or Centennial Park.",
        "The Gulch is a 10-minute walk south of Broadway. No need for a car between these two neighborhoods.",
      ],
    },
    matchDayGuide: {
      arriveEarlyTip:
        "No matches in Nashville, but Broadway's honky-tonks open by 10 AM, and the earlier you start, the better spots you'll get. Brunch at Biscuit Love, then hit Broadway by noon for the best balance of energy and elbow room.",
      nearStadium: [
        "The George Jones — big screens, multiple floors, and a rooftop for watching matches with a beer in hand.",
        "Tootsie's Orchid Lounge — iconic honky-tonk with TVs on the upper floors. Grab a spot and watch the match surrounded by neon and live music.",
        "Assembly Food Hall — 30+ food vendors and big screens on the rooftop. Best spot to watch a match if you also want to eat your way through Nashville.",
        "Tin Roof Broadway — sports bar meets live music venue. Good screens, good crowd, good wings.",
      ],
      afterParty:
        "After watching matches on the big screens, keep the night rolling on Broadway — Robert's Western World for authentic country, then The Stage rooftop for the energy. Or cross the Pedestrian Bridge to East Nashville for craft cocktails at The Fox and a show at The 5 Spot.",
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  //  MIAMI
  // ══════════════════════════════════════════════════════════════════════
  Miami: {
    overview:
      "The final stop. Sun, salsa, ocean, and the most international city in America. Miami runs on Cuban coffee, Latin energy, and a nightlife scene that doesn't start until midnight. From the Art Deco architecture of South Beach to the street art of Wynwood to the old-world charm of Little Havana, this city is a celebration from start to finish. The perfect place to end a World Cup road trip.",
    neighborhoods: [
      {
        name: "South Beach (SoBe)",
        description:
          "Art Deco hotels, the beach, Ocean Drive, and the nightlife. Touristy but iconic — you have to see it at least once.",
        vibe: "Iconic",
      },
      {
        name: "Wynwood",
        description:
          "Graffiti-covered warehouses turned into the trendiest art district in America. Galleries, craft cocktails, and street tacos.",
        vibe: "Artsy",
      },
      {
        name: "Little Havana",
        description:
          "Calle Ocho is the heart — domino parks, cigar shops, Cuban coffee windows, and live salsa spilling out of every doorway.",
        vibe: "Authentic",
      },
      {
        name: "Brickell",
        description:
          "Miami's financial district turned urban playground — high-rise condos, rooftop pools, and a walkable restaurant scene.",
        vibe: "Upscale",
      },
    ],
    restaurants: [
      {
        name: "Versailles",
        cuisine: "Cuban",
        priceRange: "$",
        neighborhood: "Little Havana",
        oneLiner:
          "The cathedral of Cuban cuisine. The ventanita (walk-up window) serves cafecito that will change your life.",
        mustOrder: "Ropa vieja with a cafecito from the ventanita",
        matchDayFriendly: true,
      },
      {
        name: "Joe's Stone Crab",
        cuisine: "Seafood",
        priceRange: "$$$",
        neighborhood: "South Beach",
        oneLiner:
          "South Beach legend since 1913. Stone crabs are seasonal but the key lime pie is year-round perfection.",
        mustOrder: "Stone crab claws with mustard sauce (in season) or key lime pie",
        matchDayFriendly: false,
      },
      {
        name: "Coyo Taco",
        cuisine: "Mexican / Mezcal",
        priceRange: "$",
        neighborhood: "Wynwood",
        oneLiner:
          "Fresh-pressed tortillas upfront, hidden speakeasy in the back. The duality of Wynwood in one spot.",
        mustOrder: "Al pastor tacos, then find the speakeasy behind the bathroom",
        matchDayFriendly: true,
      },
      {
        name: "La Mar by Gaston Acurio",
        cuisine: "Peruvian",
        priceRange: "$$$",
        neighborhood: "Brickell",
        oneLiner:
          "World-renowned Peruvian ceviche and pisco sours on the Brickell waterfront. A stunning setting.",
        mustOrder: "Ceviche sampler with a pisco sour",
        matchDayFriendly: false,
      },
      {
        name: "Zak the Baker",
        cuisine: "Bakery / Brunch",
        priceRange: "$",
        neighborhood: "Wynwood",
        oneLiner:
          "James Beard-nominated bakery in Wynwood. The sourdough and pastries are extraordinary.",
        mustOrder: "Sourdough toast with avocado and zhug",
        matchDayFriendly: true,
      },
      {
        name: "KYU",
        cuisine: "Asian BBQ",
        priceRange: "$$$",
        neighborhood: "Wynwood",
        oneLiner:
          "Wood-fired Asian BBQ that put Wynwood on the fine-dining map. The cauliflower is famous for a reason.",
        mustOrder: "Roasted cauliflower with shiso and goat cheese",
        matchDayFriendly: false,
      },
      {
        name: "Casablanca Seafood Bar & Grill",
        cuisine: "Seafood",
        priceRange: "$$",
        neighborhood: "Miami River",
        oneLiner:
          "Waterfront fish house on the Miami River. No pretension, just incredibly fresh seafood and cold beer.",
        mustOrder: "Whole fried snapper",
        matchDayFriendly: true,
      },
      {
        name: "Ball & Chain",
        cuisine: "Cuban / Live Music",
        priceRange: "$$",
        neighborhood: "Little Havana",
        oneLiner:
          "Historic Calle Ocho jazz club reborn — live salsa, mojitos, and Cuban food under one legendary roof.",
        mustOrder: "Croquetas and a mojito while watching the salsa band",
        matchDayFriendly: true,
      },
      {
        name: "Sushi Garage",
        cuisine: "Japanese",
        priceRange: "$$",
        neighborhood: "Sunset Harbour",
        oneLiner:
          "Casual-cool sushi spot in a converted garage. Surprisingly great quality for the relaxed vibe.",
        mustOrder: "Omakase platter",
        matchDayFriendly: true,
      },
      {
        name: "Los Gorditos",
        cuisine: "Venezuelan",
        priceRange: "$",
        neighborhood: "Miami Beach",
        oneLiner:
          "Tiny arepa stand with massive flavors. The Venezuelan diaspora in Miami is real and delicious.",
        mustOrder: "Arepa reina pepiada (chicken avocado)",
        matchDayFriendly: true,
      },
      {
        name: "The Salty Donut",
        cuisine: "Donuts / Coffee",
        priceRange: "$",
        neighborhood: "Wynwood",
        oneLiner:
          "Artisanal donuts with rotating seasonal flavors. The guava and cheese donut is quintessentially Miami.",
        mustOrder: "Guava and cheese donut",
        matchDayFriendly: true,
      },
      {
        name: "Mandolin Aegean Bistro",
        cuisine: "Greek / Turkish",
        priceRange: "$$",
        neighborhood: "Design District",
        oneLiner:
          "Mediterranean magic in a charming bungalow with a garden patio. Perfect for a long lunch.",
        mustOrder: "Grilled octopus with a glass of ros\u00E9",
        matchDayFriendly: true,
      },
    ],
    attractions: [
      {
        name: "South Beach & Art Deco Historic District",
        category: "landmark",
        description:
          "Pastel Art Deco buildings, Ocean Drive, white sand, turquoise water. The postcard that launched a thousand vacations.",
        duration: "2-4 hours",
        cost: "free",
        tip: "Walk Collins Avenue and Ocean Drive between 5th and 15th streets for the best architecture. Avoid the overpriced Ocean Drive restaurants.",
      },
      {
        name: "Wynwood Walls",
        category: "landmark",
        description:
          "Open-air street art museum featuring murals by world-renowned artists. The epicenter of Miami's art scene.",
        duration: "1-2 hours",
        cost: "free",
        tip: "The main Wynwood Walls compound charges a small entry fee, but the surrounding streets are free and equally impressive.",
      },
      {
        name: "Vizcaya Museum and Gardens",
        category: "museum",
        description:
          "Italian Renaissance villa on Biscayne Bay with 10 acres of formal gardens. Like stepping into a European palace.",
        duration: "2-3 hours",
        cost: "$$",
        tip: "Go in the morning before the heat peaks. The gardens overlooking the bay are extraordinary.",
      },
      {
        name: "Little Havana / Calle Ocho Walk",
        category: "activity",
        description:
          "Self-guided walk along SW 8th Street — cigar shops, domino park, fruit stands, and the heart of Miami's Cuban community.",
        duration: "2-3 hours",
        cost: "free",
        tip: "Start at Domino Park (Maximo Gomez Park), get a cafecito at Versailles, and end at Ball & Chain for live music.",
      },
      {
        name: "P\u00E9rez Art Museum Miami (PAMM)",
        category: "museum",
        description:
          "Contemporary art museum on Biscayne Bay with hanging gardens and stunning waterfront architecture.",
        duration: "1.5-2 hours",
        cost: "$$",
        tip: "The outdoor terrace with bay views is free to visit. Second Saturdays are free admission.",
      },
      {
        name: "Everglades National Park",
        category: "activity",
        description:
          "An airboat ride through the River of Grass — alligators, exotic birds, and a wilderness like nowhere else.",
        duration: "3-5 hours",
        cost: "$$",
        tip: "Book through Shark Valley or a licensed operator. Morning tours have cooler temps and more wildlife.",
      },
      {
        name: "Key Biscayne / Crandon Park",
        category: "park",
        description:
          "Cross the Rickenbacker Causeway to a tropical island with pristine beaches, mangroves, and the old Cape Florida Lighthouse.",
        duration: "3-5 hours",
        cost: "$",
        tip: "Rent bikes and ride the causeway — the views of the skyline behind you are stunning.",
      },
      {
        name: "Bayside Marketplace",
        category: "market",
        description:
          "Waterfront shopping and dining complex with live music and boat tours of Biscayne Bay and Star Island.",
        duration: "1-2 hours",
        cost: "free",
        tip: "Skip the shopping — take the boat tour past Star Island celebrity mansions. It's cheesy but fun.",
      },
      {
        name: "Design District",
        category: "activity",
        description:
          "Open-air luxury shopping district with public art installations, galleries, and some of Miami's best restaurants.",
        duration: "1-2 hours",
        cost: "free",
        tip: "Walk through even if you're not shopping — the architecture and public art are world-class. ICA Miami is nearby and free.",
      },
      {
        name: "Bill Baggs Cape Florida State Park",
        category: "park",
        description:
          "At the tip of Key Biscayne — the lighthouse, pristine beaches, and the feeling of being at the edge of the world.",
        duration: "2-3 hours",
        cost: "$",
        tip: "Boater's Grill at the park serves surprisingly good Cuban food with an unbeatable beach view.",
      },
    ],
    nightlife: [
      {
        name: "Ball & Chain",
        type: "live_music",
        neighborhood: "Little Havana",
        oneLiner:
          "Historic jazz club reborn with live salsa bands, strong mojitos, and the soul of Calle Ocho.",
        priceRange: "$$",
      },
      {
        name: "Wynwood Brewing Company",
        type: "brewery",
        neighborhood: "Wynwood",
        oneLiner:
          "Wynwood's original craft brewery — La Rubia blonde ale surrounded by street art.",
        priceRange: "$$",
      },
      {
        name: "E11EVEN",
        type: "club",
        neighborhood: "Downtown",
        oneLiner:
          "24-hour ultraclub that defines Miami excess. Cirque du Soleil meets Vegas meets South Beach.",
        priceRange: "$$$",
      },
      {
        name: "Broken Shaker",
        type: "bar",
        neighborhood: "Miami Beach",
        oneLiner:
          "Award-winning cocktail bar in a hostel courtyard. Tropical drinks, fairy lights, and zero attitude.",
        priceRange: "$$",
      },
      {
        name: "The Corner",
        type: "dive",
        neighborhood: "Wynwood",
        oneLiner:
          "The anti-Miami bar — cheap drinks, pool table, cash only, and a jukebox that doesn't play reggaeton.",
        priceRange: "$",
      },
      {
        name: "Sugar",
        type: "rooftop",
        neighborhood: "Brickell",
        oneLiner:
          "40th-floor rooftop garden bar at the EAST hotel. Asian-inspired cocktails with jaw-dropping city and bay views.",
        priceRange: "$$$",
      },
      {
        name: "Gramps",
        type: "bar",
        neighborhood: "Wynwood",
        oneLiner:
          "Laid-back Wynwood bar with a backyard, food pop-ups, drag brunches, and the neighborhood's most welcoming vibe.",
        priceRange: "$",
      },
      {
        name: "The Wharf Miami",
        type: "bar",
        neighborhood: "Miami River",
        oneLiner:
          "Open-air waterfront bar on the Miami River with food vendors, DJs, and boat-watching at sunset.",
        priceRange: "$$",
      },
    ],
    shopping: [
      {
        name: "Design District",
        type: "Luxury fashion & art",
        description:
          "Open-air luxury quarter with Louis Vuitton, Dior, Prada, and contemporary art galleries between them.",
      },
      {
        name: "Lincoln Road Mall",
        type: "Pedestrian shopping & dining",
        description:
          "South Beach's outdoor pedestrian mall — a mix of chain stores, local boutiques, and sidewalk cafes.",
      },
      {
        name: "Wynwood Shops",
        type: "Art, streetwear & local designers",
        description:
          "Independent boutiques and streetwear shops scattered through the art district. Best for unique finds.",
      },
      {
        name: "Aventura Mall",
        type: "Mega mall",
        description:
          "Third-largest mall in the US with a curated arts program and every brand imaginable. AC in the Miami heat.",
      },
    ],
    localTips: [
      "Hard Rock Stadium is 30 minutes north in Miami Gardens. Plan transport — there's no convenient train.",
      "Miami runs late. Dinner at 9 PM, clubs at midnight. Don't try to force an East Coast schedule.",
      "Cafecito (Cuban espresso) from a ventanita is the local fuel. $1 and life-altering. Get one at Versailles.",
      "Uber and Lyft are essential. Public transit is limited outside the downtown Metromover loop.",
      "Afternoon rainstorms in June are daily. They last 30-60 minutes and it's beautiful after. Don't cancel plans.",
      "South Beach restaurant prices are inflated. The best food is in Wynwood, Little Havana, and the Design District.",
    ],
    gettingAround: {
      summary:
        "Miami requires rideshare for most trips. The free Metromover loops through downtown and Brickell. Otherwise, it's Uber/Lyft territory.",
      toStadium:
        "Hard Rock Stadium is in Miami Gardens, 30 minutes north of South Beach. No convenient rail line goes there. Rideshare costs $25-45 depending on where you're coming from with surge pricing on match days. Tri-Rail has a stop in Opa-locka/Miami Gardens but requires a bus connection to the stadium. Driving means massive parking lots — arrive 2+ hours early.",
      apps: ["Uber", "Lyft", "Metromover (free)"],
      tips: [
        "The Metromover is free and loops through downtown, Brickell, and Omni. Use it to avoid short-distance rideshare costs.",
        "Taxis in Miami Beach are overpriced. Always use rideshare apps.",
        "Rent a car if you want to explore Key Biscayne, the Everglades, or Buford Highway-equivalent ethnic food corridors.",
        "Traffic on I-95 to the stadium on match day will be brutal. Leave 2 hours before you think you need to.",
      ],
    },
    matchDayGuide: {
      arriveEarlyTip:
        "Arrive at Hard Rock Stadium at least 2 hours early. The parking lots are enormous and fill up fast. Tailgating is allowed and expected — bring a cooler, chairs, and sunscreen. The Florida sun in June is no joke.",
      nearStadium: [
        "Hard Rock Stadium tailgate lots — the scene is festive with Latin music, grills, and international fan groups.",
        "Stadium concessions — Hard Rock has solid food options inside including local Miami favorites.",
        "Oceans 10 (near the stadium) — sports bar and restaurant in Miami Gardens for a sit-down pre-game meal.",
      ],
      afterParty:
        "Head back to Wynwood or South Beach. Wynwood is closer — Coyo Taco for late-night tacos, Gramps or The Corner for drinks, or go full send at E11EVEN downtown. This is the last city. Celebrate like it.",
    },
  },
};
