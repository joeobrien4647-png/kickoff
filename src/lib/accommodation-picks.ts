// ============ CURATED ACCOMMODATION PICKS ============
// Hand-picked stays for each city on the route:
// Boston -> NYC -> Philly -> DC -> Nashville -> Miami
// 3-4 options per city across budget/mid/splurge tiers.

export type AccommodationPick = {
  city: string;
  name: string;
  type: "hotel" | "airbnb" | "hostel" | "motel";
  tier: "budget" | "mid" | "splurge";
  pricePerNight: number; // USD, per room
  neighborhood: string;
  whyWePickedIt: string;
  walkToStadium: string | null; // null if no stadium in that city
  nearbyFood: string;
  bookingUrl: string;
  britishNote?: string;
};

function bookingUrl(name: string, city: string): string {
  return `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(name + " " + city)}`;
}

// ── BOSTON (Jun 11-13, Gillette Stadium in Foxborough) ────────────

const BOSTON: AccommodationPick[] = [
  {
    city: "Boston",
    name: "HI Boston Hostel",
    type: "hostel",
    tier: "budget",
    pricePerNight: 45,
    neighborhood: "Chinatown",
    whyWePickedIt:
      "Clean, central, and absurdly cheap for Boston. Steps from the Common and Chinatown eats. Perfect for lads who'd rather spend on pints than pillows.",
    walkToStadium: null,
    nearbyFood: "Gourmet Dumpling House is a 2-minute walk — order the soup dumplings",
    bookingUrl: bookingUrl("HI Boston Hostel", "Boston"),
    britishNote:
      "Fenway Park is walkable from most downtown hotels — catch a Red Sox game if the schedule lines up",
  },
  {
    city: "Boston",
    name: "The Godfrey Hotel",
    type: "hotel",
    tier: "mid",
    pricePerNight: 180,
    neighborhood: "Downtown Crossing",
    whyWePickedIt:
      "Stylish boutique hotel in the shopping district with a rooftop bar. You're equidistant from the North End, Back Bay, and the waterfront.",
    walkToStadium: null,
    nearbyFood: "Walk 10 minutes to the North End for the best Italian food outside Italy",
    bookingUrl: bookingUrl("The Godfrey Hotel", "Boston"),
  },
  {
    city: "Boston",
    name: "The Liberty Hotel",
    type: "hotel",
    tier: "splurge",
    pricePerNight: 350,
    neighborhood: "Beacon Hill",
    whyWePickedIt:
      "A converted 19th-century jail in Boston's poshest neighbourhood. The old catwalks are now bars. Most Instagram-worthy hotel in the city.",
    walkToStadium: null,
    nearbyFood: "Beacon Hill is cobblestoned charm — hit The Paramount for brunch",
    bookingUrl: bookingUrl("The Liberty Hotel", "Boston"),
    britishNote:
      "Gillette Stadium is 30 miles south in Foxborough — MBTA runs match-day rail service from South Station",
  },
];

// ── NEW YORK (Jun 13-15, MetLife Stadium in East Rutherford, NJ) ─

const NEW_YORK: AccommodationPick[] = [
  {
    city: "New York",
    name: "Pod 51",
    type: "hotel",
    tier: "budget",
    pricePerNight: 120,
    neighborhood: "Midtown East",
    whyWePickedIt:
      "Micro-rooms done right. Tiny but immaculate, with a rooftop garden. You're paying for location — and Midtown East delivers.",
    walkToStadium: null,
    nearbyFood: "Grand Central food hall is 5 minutes away — grab a lobster roll at Luke's",
    bookingUrl: bookingUrl("Pod 51", "New York"),
    britishNote:
      "MetLife is in New Jersey — plan 45min+ transit from Manhattan via NJ Transit from Penn Station",
  },
  {
    city: "New York",
    name: "Moxy NYC Times Square",
    type: "hotel",
    tier: "mid",
    pricePerNight: 200,
    neighborhood: "Times Square",
    whyWePickedIt:
      "Playful Marriott brand with a killer rooftop bar. The Magic Hour terrace has carousel horses and skyline views. Central to everything.",
    walkToStadium: null,
    nearbyFood: "Joe's Pizza on Carmine St is a 15-min subway ride — worth every second",
    bookingUrl: bookingUrl("Moxy NYC Times Square", "New York"),
  },
  {
    city: "New York",
    name: "The Standard High Line",
    type: "hotel",
    tier: "splurge",
    pricePerNight: 400,
    neighborhood: "Meatpacking District",
    whyWePickedIt:
      "Iconic hotel straddling the High Line with floor-to-ceiling windows. Le Bain rooftop is legendary. The Meatpacking location puts Chelsea Market, the Whitney, and the Village at your feet.",
    walkToStadium: null,
    nearbyFood: "Chelsea Market is literally below you — Los Tacos No. 1 is mandatory",
    bookingUrl: bookingUrl("The Standard High Line", "New York"),
    britishNote:
      "The Dead Rabbit in FiDi was named world's best bar — worth the downtown trip",
  },
];

// ── PHILADELPHIA (Jun 15-17, Lincoln Financial Field) ────────────

const PHILADELPHIA: AccommodationPick[] = [
  {
    city: "Philadelphia",
    name: "Apple Hostels Philadelphia",
    type: "hostel",
    tier: "budget",
    pricePerNight: 40,
    neighborhood: "Old City",
    whyWePickedIt:
      "Right next to Independence Hall and the Liberty Bell. Free walking tours depart from the door. The common room has a bar — say no more.",
    walkToStadium: "Broad Street Line from City Hall to the stadium complex, 15 min",
    nearbyFood: "Reading Terminal Market is a 10-minute walk — try DiNic's roast pork sandwich",
    bookingUrl: bookingUrl("Apple Hostels Philadelphia", "Philadelphia"),
    britishNote:
      "Most Philly hotels are walkable to the historic stuff — you can see where they signed the Declaration",
  },
  {
    city: "Philadelphia",
    name: "Hotel Monaco Philadelphia",
    type: "hotel",
    tier: "mid",
    pricePerNight: 190,
    neighborhood: "Old City",
    whyWePickedIt:
      "Kimpton boutique in a gorgeous 1907 building. Complimentary wine hour every evening. Walking distance to every major historic site.",
    walkToStadium: "Broad Street Line, 15 min door-to-door from City Hall station",
    nearbyFood: "Zahav is 5 minutes away — the hummus will ruin all other hummus for you",
    bookingUrl: bookingUrl("Hotel Monaco", "Philadelphia"),
  },
  {
    city: "Philadelphia",
    name: "The Rittenhouse Hotel",
    type: "hotel",
    tier: "splurge",
    pricePerNight: 350,
    neighborhood: "Rittenhouse Square",
    whyWePickedIt:
      "The best hotel in Philadelphia, overlooking the city's most beautiful park. White-glove service, massive rooms, and a spa. Treat yourselves.",
    walkToStadium: "Subway from Walnut-Locust, 20 min to stadium",
    nearbyFood: "Parc on the square does perfect French bistro — excellent for people-watching",
    bookingUrl: bookingUrl("The Rittenhouse Hotel", "Philadelphia"),
  },
];

// ── WASHINGTON DC (Jun 17-19, no WC stadium) ─────────────────────

const WASHINGTON_DC: AccommodationPick[] = [
  {
    city: "Washington DC",
    name: "Generator Washington DC",
    type: "hostel",
    tier: "budget",
    pricePerNight: 55,
    neighborhood: "Capitol Hill",
    whyWePickedIt:
      "Hip design hostel near the Capitol. Rooftop bar, free events, and a crowd of international travellers. More boutique hotel than backpacker dorm.",
    walkToStadium: null,
    nearbyFood: "Eastern Market is around the corner — Saturday brunch with blueberry buckwheat pancakes",
    bookingUrl: bookingUrl("Generator Washington DC", "Washington DC"),
    britishNote:
      "The British Embassy is right on Massachusetts Avenue — pop by and feel patriotic",
  },
  {
    city: "Washington DC",
    name: "The LINE DC",
    type: "hotel",
    tier: "mid",
    pricePerNight: 200,
    neighborhood: "Adams Morgan",
    whyWePickedIt:
      "A converted church in DC's most eclectic neighbourhood. The lobby bar is in the old nave. Adams Morgan has the best nightlife in DC — you'll need it after a day of museums.",
    walkToStadium: null,
    nearbyFood: "Adams Morgan is restaurant row — Tail Up Goat is the crown jewel",
    bookingUrl: bookingUrl("The LINE DC", "Washington DC"),
  },
  {
    city: "Washington DC",
    name: "The Watergate Hotel",
    type: "hotel",
    tier: "splurge",
    pricePerNight: 380,
    neighborhood: "Foggy Bottom",
    whyWePickedIt:
      "Yes, THAT Watergate. Completely reimagined as a mid-century modern luxury hotel. The rooftop whiskey bar overlooks the Potomac and the Kennedy Center. History never looked this good.",
    walkToStadium: null,
    nearbyFood: "Georgetown is a 10-minute walk across the bridge — Martin's Tavern since 1933",
    bookingUrl: bookingUrl("The Watergate Hotel", "Washington DC"),
    britishNote:
      "DC's museums are almost all free — Smithsonian could fill a week, but you have two days",
  },
];

// ── NASHVILLE (Jun 19-22, no WC stadium) ─────────────────────────

const NASHVILLE: AccommodationPick[] = [
  {
    city: "Nashville",
    name: "Nashville Downtown Hostel",
    type: "hostel",
    tier: "budget",
    pricePerNight: 40,
    neighborhood: "Downtown",
    whyWePickedIt:
      "Steps from Lower Broadway and the honky-tonks. Clean, friendly, and you'll meet people from everywhere. The savings fund your bar tab.",
    walkToStadium: null,
    nearbyFood: "Prince's Hot Chicken is a Nashville rite of passage — order 'medium' to start",
    bookingUrl: bookingUrl("Nashville Downtown Hostel", "Nashville"),
    britishNote:
      "Stay near Broadway — you'll be crawling back from honky-tonks at 2am and you'll want a short walk",
  },
  {
    city: "Nashville",
    name: "Graduate Nashville",
    type: "hotel",
    tier: "mid",
    pricePerNight: 170,
    neighborhood: "Midtown",
    whyWePickedIt:
      "Quirky themed rooms paying homage to Nashville's music heritage. Near Vanderbilt campus with great bars and restaurants. The rooftop pool bar is a bonus.",
    walkToStadium: null,
    nearbyFood: "Hattie B's Hot Chicken is walking distance — arrive before 11am to skip the queue",
    bookingUrl: bookingUrl("Graduate Nashville", "Nashville"),
  },
  {
    city: "Nashville",
    name: "Broadway Loft Nashville",
    type: "airbnb",
    tier: "mid",
    pricePerNight: 150,
    neighborhood: "Lower Broadway",
    whyWePickedIt:
      "Live above the mayhem. Search for 'Broadway loft Nashville' on Airbnb — there are several options right above the honky-tonks. Fall out of bed and into a live music bar.",
    walkToStadium: null,
    nearbyFood: "You're ON Broadway — walk downstairs to Acme Feed & Seed for elevated bar food",
    bookingUrl: "https://www.airbnb.com/s/Broadway--Nashville--TN/homes",
    britishNote:
      "Nashville honky-tonks have free live music all day — no cover charge, just tip the band",
  },
  {
    city: "Nashville",
    name: "The Hermitage Hotel",
    type: "hotel",
    tier: "splurge",
    pricePerNight: 400,
    neighborhood: "Downtown",
    whyWePickedIt:
      "Historic 1910 Beaux-Arts landmark and Nashville's only Forbes Five-Star hotel. The lobby is jaw-dropping. The men's toilets won an award — genuinely worth seeing even if you're not staying.",
    walkToStadium: null,
    nearbyFood: "The Capitol Grille downstairs is one of Nashville's finest restaurants",
    bookingUrl: bookingUrl("The Hermitage Hotel", "Nashville"),
  },
];

// ── MIAMI (Jun 22-26, Hard Rock Stadium in Miami Gardens) ────────

const MIAMI: AccommodationPick[] = [
  {
    city: "Miami",
    name: "Generator Miami",
    type: "hostel",
    tier: "budget",
    pricePerNight: 50,
    neighborhood: "South Beach",
    whyWePickedIt:
      "Pool parties, a proper bar, and South Beach on your doorstep. The design is more boutique than budget. This is Miami's best-value bed by a mile.",
    walkToStadium: "Hard Rock Stadium is 20min by Uber from South Beach",
    nearbyFood: "La Sandwicherie on 14th St — legendary late-night French sandwiches after the beach",
    bookingUrl: bookingUrl("Generator Miami", "Miami"),
    britishNote:
      "South Beach is where you want to be — 20min Uber to Hard Rock Stadium in Miami Gardens",
  },
  {
    city: "Miami",
    name: "The Plymouth South Beach",
    type: "hotel",
    tier: "mid",
    pricePerNight: 220,
    neighborhood: "South Beach",
    whyWePickedIt:
      "Art Deco classic from 1940, lovingly restored. The pool area is a Miami postcard. Collins Avenue location puts you in the heart of South Beach without the Ocean Drive chaos.",
    walkToStadium: "25min Uber to Hard Rock Stadium",
    nearbyFood: "Juvia on Lincoln Road — rooftop Japanese-Peruvian-French fusion with ocean views",
    bookingUrl: bookingUrl("The Plymouth South Beach", "Miami"),
  },
  {
    city: "Miami",
    name: "Faena Miami Beach",
    type: "hotel",
    tier: "splurge",
    pricePerNight: 500,
    neighborhood: "Mid-Beach",
    whyWePickedIt:
      "Over-the-top Baz Luhrmann-designed luxury. Gold mammoth skeleton in the lobby. A Damien Hirst unicorn in the restaurant. This is Miami at its most maximalist — the perfect finale to the trip.",
    walkToStadium: "20min Uber to Hard Rock Stadium",
    nearbyFood: "Los Fuegos by Francis Mallmann downstairs — Argentine wood-fire cooking at its finest",
    bookingUrl: bookingUrl("Faena Miami Beach", "Miami"),
    britishNote:
      "The final stop deserves a splurge. Four nights here as a victory lap? You've earned it.",
  },
];

// ── COMBINED EXPORT ──────────────────────────────────────────────

export const ACCOMMODATION_PICKS: AccommodationPick[] = [
  ...BOSTON,
  ...NEW_YORK,
  ...PHILADELPHIA,
  ...WASHINGTON_DC,
  ...NASHVILLE,
  ...MIAMI,
];

/** All cities with picks, in route order */
export const ACCOMMODATION_CITIES = [
  "Boston",
  "New York",
  "Philadelphia",
  "Washington DC",
  "Nashville",
  "Miami",
] as const;
