export type CityGuide = {
  weather: {
    highF: number;
    lowF: number;
    rainChance: number;
    description: string;
  };
  fanZone: { name: string; address: string; notes: string } | null;
  restaurants: Array<{
    name: string;
    type: string;
    priceRange: "$" | "$$" | "$$$";
    oneLiner: string;
  }>;
  transport: string[];
  emergency: { hospital: string; hospitalAddress: string };
  funFact: string;
};

export const CITY_GUIDES: Record<string, CityGuide> = {
  Boston: {
    weather: {
      highF: 78,
      lowF: 62,
      rainChance: 30,
      description: "Warm and pleasant with occasional afternoon showers",
    },
    fanZone: {
      name: "Boston Common",
      address: "139 Tremont St, Boston, MA 02111",
      notes: "Main gathering spot for fans, big screens and live music",
    },
    restaurants: [
      {
        name: "Legal Sea Foods",
        type: "Seafood",
        priceRange: "$$",
        oneLiner: "New England clam chowder that sets the standard",
      },
      {
        name: "Neptune Oyster",
        type: "Raw bar",
        priceRange: "$$$",
        oneLiner: "Tiny North End gem with legendary lobster rolls",
      },
      {
        name: "Mike's Pastry",
        type: "Cannoli",
        priceRange: "$",
        oneLiner: "The cannoli pilgrimage every visitor must make",
      },
      {
        name: "Harpoon Beer Hall",
        type: "Craft beer",
        priceRange: "$$",
        oneLiner: "Massive beer hall with pretzels the size of your head",
      },
      {
        name: "Bleacher Bar",
        type: "Sports bar",
        priceRange: "$$",
        oneLiner: "Built into Fenway Park with a view of the field",
      },
    ],
    transport: [
      "T subway covers most areas — Green and Red lines are your friends",
      "Uber/Lyft 10-15 min to Gillette Stadium in Foxborough",
      "MBTA commuter rail runs event service to Foxborough on match days",
    ],
    emergency: {
      hospital: "Massachusetts General Hospital",
      hospitalAddress: "55 Fruit St, Boston, MA 02114",
    },
    funFact:
      "Gillette Stadium is actually in Foxborough, 30 miles south of downtown Boston.",
  },

  "New York": {
    weather: {
      highF: 82,
      lowF: 66,
      rainChance: 35,
      description: "Hot and humid with possible thunderstorms",
    },
    fanZone: {
      name: "Times Square Fan Festival",
      address: "Times Square, Manhattan, NY 10036",
      notes: "Massive screens, live entertainment, and global atmosphere",
    },
    restaurants: [
      {
        name: "Joe's Pizza",
        type: "Classic slice",
        priceRange: "$",
        oneLiner: "The gold standard Greenwich Village dollar slice",
      },
      {
        name: "Peter Luger",
        type: "Steakhouse",
        priceRange: "$$$",
        oneLiner: "Cash-only Brooklyn legend since 1887",
      },
      {
        name: "Los Tacos No. 1",
        type: "Tacos",
        priceRange: "$",
        oneLiner: "Chelsea Market tacos that rival anything in Mexico City",
      },
      {
        name: "230 Fifth",
        type: "Rooftop bar",
        priceRange: "$$",
        oneLiner: "Empire State Building views with a cocktail in hand",
      },
      {
        name: "The Dead Rabbit",
        type: "Cocktails",
        priceRange: "$$",
        oneLiner: "World's best bar — Irish pub downstairs, parlor upstairs",
      },
    ],
    transport: [
      "Subway runs 24/7 — get a MetroCard or tap contactless",
      "NJ Transit from Penn Station to MetLife Stadium (Meadowlands)",
      "Event-day express buses run from Port Authority to the stadium",
    ],
    emergency: {
      hospital: "NYU Langone Medical Center",
      hospitalAddress: "550 1st Ave, New York, NY 10016",
    },
    funFact:
      "MetLife Stadium is technically in New Jersey, not New York.",
  },

  Philadelphia: {
    weather: {
      highF: 85,
      lowF: 66,
      rainChance: 30,
      description: "Hot summer days with low humidity for the East Coast",
    },
    fanZone: {
      name: "JFK Plaza (Love Park)",
      address: "1500 Arch St, Philadelphia, PA 19102",
      notes: "Iconic LOVE sculpture, fan activities, and food vendors",
    },
    restaurants: [
      {
        name: "Pat's King of Steaks",
        type: "Cheesesteaks",
        priceRange: "$",
        oneLiner: "The original Philly cheesesteak since 1930",
      },
      {
        name: "Zahav",
        type: "Israeli",
        priceRange: "$$$",
        oneLiner: "James Beard-winning hummus that changes lives",
      },
      {
        name: "Reading Terminal Market",
        type: "Food hall",
        priceRange: "$",
        oneLiner: "150+ vendors under one historic roof since 1893",
      },
      {
        name: "Monk's Cafe",
        type: "Belgian beer",
        priceRange: "$$",
        oneLiner: "Best Belgian beer list in America, plus mussels",
      },
      {
        name: "Yards Brewing",
        type: "Craft beer",
        priceRange: "$$",
        oneLiner: "Philly's flagship brewery with a massive taproom",
      },
    ],
    transport: [
      "SEPTA subway + trolley cover Center City to the stadiums",
      "Broad Street Line goes directly to the stadium complex",
      "Walking-friendly downtown — most attractions within 2 miles",
    ],
    emergency: {
      hospital: "Penn Medicine (Hospital of the University of Pennsylvania)",
      hospitalAddress: "3400 Spruce St, Philadelphia, PA 19104",
    },
    funFact:
      "Lincoln Financial Field is walking distance from three other major Philly sports stadiums.",
  },

  "Washington DC": {
    weather: {
      highF: 87,
      lowF: 68,
      rainChance: 35,
      description: "Hot and muggy — hydrate and seek shade often",
    },
    fanZone: {
      name: "National Mall",
      address: "National Mall, Washington, DC 20560",
      notes: "Open-air viewing areas between the monuments",
    },
    restaurants: [
      {
        name: "Ben's Chili Bowl",
        type: "Half-smokes",
        priceRange: "$",
        oneLiner: "DC institution since 1958 — get the chili half-smoke",
      },
      {
        name: "Old Ebbitt Grill",
        type: "Classic DC",
        priceRange: "$$$",
        oneLiner: "DC's oldest saloon, steps from the White House",
      },
      {
        name: "Founding Farmers",
        type: "Farm-to-table",
        priceRange: "$$",
        oneLiner: "Farmer-owned comfort food with a conscience",
      },
      {
        name: "The Partisan",
        type: "Charcuterie",
        priceRange: "$$",
        oneLiner: "House-cured meats and craft cocktails in Penn Quarter",
      },
      {
        name: "Dan's Cafe",
        type: "Dive bar",
        priceRange: "$",
        oneLiner: "Legendary dive — bring-your-own-mix with a squeeze bottle",
      },
    ],
    transport: [
      "Metro system is excellent — covers all major sights and neighborhoods",
      "No World Cup venue in DC, but it's a great base between Philly and Atlanta",
      "Capital Bikeshare for getting around the Mall and monuments",
    ],
    emergency: {
      hospital: "George Washington University Hospital",
      hospitalAddress: "900 23rd St NW, Washington, DC 20037",
    },
    funFact:
      "DC has no World Cup venue — it's a rest and explore stop between Philly and Atlanta.",
  },

  Atlanta: {
    weather: {
      highF: 89,
      lowF: 70,
      rainChance: 45,
      description: "Hot and humid with frequent afternoon thunderstorms",
    },
    fanZone: {
      name: "Centennial Olympic Park",
      address: "265 Park Ave W NW, Atlanta, GA 30313",
      notes: "Steps from the stadium, Fountain of Rings, big screens",
    },
    restaurants: [
      {
        name: "Fox Bros Bar-B-Q",
        type: "BBQ",
        priceRange: "$$",
        oneLiner: "Texas-style brisket in the heart of the South",
      },
      {
        name: "Ponce City Market",
        type: "Food hall",
        priceRange: "$$",
        oneLiner: "Rooftop amusement park + dozens of food stalls",
      },
      {
        name: "The Varsity",
        type: "Fast food institution",
        priceRange: "$",
        oneLiner: "World's largest drive-in — What'll ya have?",
      },
      {
        name: "Monday Night Brewing",
        type: "Craft beer",
        priceRange: "$$",
        oneLiner: "Atlanta's favorite taproom with rotating small-batch brews",
      },
      {
        name: "Bacchanalia",
        type: "Fine dining",
        priceRange: "$$$",
        oneLiner: "Atlanta's most celebrated restaurant for a special night out",
      },
    ],
    transport: [
      "MARTA rail goes directly to Mercedes-Benz Stadium (Dome/GWCC station)",
      "Rideshare is plentiful but expect surge pricing on match days",
      "Atlanta BeltLine trail connects several neighborhoods on foot or bike",
    ],
    emergency: {
      hospital: "Emory University Hospital",
      hospitalAddress: "1364 Clifton Rd NE, Atlanta, GA 30322",
    },
    funFact:
      "Mercedes-Benz Stadium has a retractable roof shaped like a camera aperture — hope for AC in June.",
  },

  Miami: {
    weather: {
      highF: 90,
      lowF: 76,
      rainChance: 55,
      description: "Hot, tropical, with daily afternoon storms that pass quickly",
    },
    fanZone: {
      name: "Bayfront Park",
      address: "301 Biscayne Blvd, Miami, FL 33132",
      notes: "Waterfront fan fest with views of Biscayne Bay",
    },
    restaurants: [
      {
        name: "Versailles",
        type: "Cuban",
        priceRange: "$",
        oneLiner: "The cathedral of Cuban cuisine in Little Havana",
      },
      {
        name: "Joe's Stone Crab",
        type: "Seafood",
        priceRange: "$$$",
        oneLiner: "South Beach legend since 1913 — worth any wait",
      },
      {
        name: "Coyo Taco",
        type: "Tacos + mezcal",
        priceRange: "$",
        oneLiner: "Hidden speakeasy behind the taco counter in Wynwood",
      },
      {
        name: "Ball & Chain",
        type: "Live music + cocktails",
        priceRange: "$$",
        oneLiner: "Little Havana's historic jazz club reborn",
      },
      {
        name: "Wynwood Brewing",
        type: "Craft beer",
        priceRange: "$$",
        oneLiner: "Wynwood's original craft brewery surrounded by street art",
      },
    ],
    transport: [
      "Uber/Lyft is king — public transit is limited outside downtown",
      "Tri-Rail runs north to the Hard Rock Stadium area from downtown",
      "Free Metromover loops around downtown and Brickell",
    ],
    emergency: {
      hospital: "Jackson Memorial Hospital",
      hospitalAddress: "1611 NW 12th Ave, Miami, FL 33136",
    },
    funFact:
      "Hard Rock Stadium is in Miami Gardens, about 30 minutes north of South Beach.",
  },
};
