// ── Stadium Pocket Guides ──────────────────────────────────────────
// Match-day reference data for each World Cup venue on our route.
// Designed to be glanced at on your phone while walking to the gate.

export type StadiumGuide = {
  name: string;
  city: string;
  capacity: string;
  address: string;
  gatesOpen: string;
  bagPolicy: string;
  allowedItems: string[];
  prohibitedItems: string[];
  foodInside: { name: string; price: string; note: string }[];
  drinkPrices: { item: string; price: string }[];
  gettingThere: { method: string; details: string; cost: string }[];
  tips: string[];
  mapsUrl: string;
};

export const STADIUM_GUIDES: StadiumGuide[] = [
  {
    name: "Gillette Stadium",
    city: "Boston",
    capacity: "65,878",
    address: "1 Patriot Pl, Foxborough, MA 02035",
    gatesOpen: "3 hours before kickoff",
    bagPolicy:
      'Clear bag policy \u2014 one clear bag (12"x6"x12" max) + one small clutch (4.5"x6.5"). No backpacks, no purses, no fanny packs.',
    allowedItems: [
      "Clear bag",
      "Small clutch",
      "Phone",
      "Wallet",
      "Keys",
      "Sunscreen (sealed)",
      "Sealed water bottle (empty)",
    ],
    prohibitedItems: [
      "Backpacks",
      "Cameras with detachable lens",
      "Umbrellas",
      "Coolers",
      "Outside food/drink",
      "Selfie sticks",
      "Laptops/tablets",
      "Noisemakers",
    ],
    foodInside: [
      { name: "Hot dogs", price: "$7-9", note: "Available everywhere" },
      { name: "Pizza slices", price: "$8-10", note: "Papa Gino's" },
      {
        name: "Lobster roll",
        price: "$18-22",
        note: "Local specialty \u2014 worth it",
      },
      { name: "Burgers", price: "$12-15", note: "Various stands" },
    ],
    drinkPrices: [
      { item: "Draft beer (16oz)", price: "$12-15" },
      { item: "Craft beer", price: "$15-18" },
      { item: "Soda", price: "$6-7" },
      { item: "Water bottle", price: "$5-6" },
    ],
    gettingThere: [
      {
        method: "Uber/Lyft",
        details:
          "From Boston \u2014 45 min. Surge pricing likely. Set pickup at Lot 15.",
        cost: "$50-80",
      },
      {
        method: "Commuter Rail",
        details:
          "MBTA from South Station to Foxborough. Special event service.",
        cost: "$20 round trip",
      },
      {
        method: "Drive + Park",
        details: "Lots open 4hrs before. Cash or card. $40-60.",
        cost: "$40-60 parking",
      },
      {
        method: "Shuttle bus",
        details:
          "From Patriot Place \u2014 free. From Boston \u2014 various operators.",
        cost: "$25-40",
      },
    ],
    tips: [
      "Arrive early \u2014 Patriot Place has shops and restaurants right outside",
      "Bring cash for some parking lots",
      "Cell service is terrible inside \u2014 download offline maps before",
      "Sunscreen! \u2014 mostly open-air stadium",
      "Foxborough is 30+ miles from Boston \u2014 don\u2019t underestimate travel time",
    ],
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Gillette+Stadium+Foxborough",
  },
  {
    name: "MetLife Stadium",
    city: "New York",
    capacity: "82,500",
    address: "1 MetLife Stadium Dr, East Rutherford, NJ 07073",
    gatesOpen: "3 hours before kickoff",
    bagPolicy:
      'Clear bag policy \u2014 one clear bag (12"x6"x12") OR one gallon zip-lock bag + small clutch.',
    allowedItems: [
      "Clear bag",
      "Small clutch",
      "Phone",
      "Wallet",
      "Sealed empty water bottle",
    ],
    prohibitedItems: [
      "Backpacks",
      "Purses",
      'Cameras with lens >6"',
      "Umbrellas",
      "Coolers",
      "Outside food/drink",
      "Drones",
    ],
    foodInside: [
      { name: "NY-style pizza", price: "$9-12", note: "Multiple vendors" },
      {
        name: "Sausage & peppers",
        price: "$12-14",
        note: "Classic stadium food",
      },
      { name: "Chicken tenders", price: "$13-15", note: "Everywhere" },
      {
        name: "Specialty burgers",
        price: "$15-18",
        note: "Gourmet options available",
      },
    ],
    drinkPrices: [
      { item: "Draft beer (16oz)", price: "$14-16" },
      { item: "Craft beer", price: "$16-19" },
      { item: "Soda", price: "$6-8" },
      { item: "Water", price: "$5-6" },
    ],
    gettingThere: [
      {
        method: "NJ Transit bus",
        details:
          "Bus 160 or 165 from Port Authority (42nd St). 30 min.",
        cost: "$5-7",
      },
      {
        method: "NJ Transit train",
        details:
          "Meadowlands Rail Line from Secaucus Junction (special events only)",
        cost: "$10-15",
      },
      {
        method: "Uber/Lyft",
        details:
          "From Manhattan \u2014 30-45 min depending on traffic. Surge likely.",
        cost: "$40-70",
      },
      {
        method: "Drive + Park",
        details: "Lots open 5hrs before. $40-60 per car.",
        cost: "$40-60 parking",
      },
    ],
    tips: [
      "The stadium is in NEW JERSEY, not NYC \u2014 plan accordingly",
      "Public transit is the best option \u2014 traffic is brutal",
      "Tailgating in the parking lots is legendary \u2014 arrive early if driving",
      "Wind can be fierce \u2014 it\u2019s an open-air stadium",
      "MetLife is the biggest stadium on the East Coast \u2014 keep track of your section",
    ],
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=MetLife+Stadium",
  },
  {
    name: "Lincoln Financial Field",
    city: "Philadelphia",
    capacity: "69,796",
    address: "1020 Pattison Ave, Philadelphia, PA 19148",
    gatesOpen: "2.5 hours before kickoff",
    bagPolicy:
      'Clear bag policy \u2014 one clear bag (12"x6"x12") + one small clutch.',
    allowedItems: [
      "Clear bag",
      "Small clutch",
      "Phone",
      "Wallet",
      "Sealed sunscreen",
    ],
    prohibitedItems: [
      "Backpacks",
      "Purses",
      "Outside food/drink",
      "Umbrellas",
      "Cameras with detachable lens",
    ],
    foodInside: [
      {
        name: "Cheesesteak",
        price: "$14-16",
        note: "MUST try \u2014 it\u2019s Philly!",
      },
      {
        name: "Crab fries",
        price: "$10-12",
        note: "Chickie\u2019s & Pete\u2019s \u2014 famous",
      },
      { name: "Roast pork sandwich", price: "$13-15", note: "Local favorite" },
      { name: "Soft pretzel", price: "$6-8", note: "Philly classic" },
    ],
    drinkPrices: [
      { item: "Draft beer", price: "$12-14" },
      { item: "Craft beer", price: "$14-17" },
      { item: "Soda", price: "$5-7" },
      { item: "Water", price: "$5" },
    ],
    gettingThere: [
      {
        method: "Subway (SEPTA)",
        details:
          "Broad Street Line to NRG Station. Runs right to the stadium.",
        cost: "$2.50",
      },
      {
        method: "Uber/Lyft",
        details: "From Center City \u2014 15-20 min.",
        cost: "$15-25",
      },
      {
        method: "Drive + Park",
        details: "Parking lots surrounding stadium. $25-40.",
        cost: "$25-40",
      },
    ],
    tips: [
      "Take the Broad Street Line subway \u2014 it drops you right at the stadium",
      "Get a cheesesteak inside \u2014 you\u2019re in Philly, it\u2019s mandatory",
      "Philly fans are passionate \u2014 wear your colours proudly",
      "South Philly is walkable from Center City if you want to save money",
    ],
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Lincoln+Financial+Field+Philadelphia",
  },
  {
    name: "Hard Rock Stadium",
    city: "Miami",
    capacity: "64,767",
    address: "347 Don Shula Dr, Miami Gardens, FL 33056",
    gatesOpen: "3 hours before kickoff",
    bagPolicy:
      'Clear bag policy \u2014 one clear bag (12"x6"x12") + one small clutch.',
    allowedItems: [
      "Clear bag",
      "Small clutch",
      "Phone",
      "Wallet",
      "Sunscreen (sealed)",
      "Portable phone charger",
    ],
    prohibitedItems: [
      "Backpacks",
      "Purses",
      "Outside food/drink",
      "Umbrellas",
      "GoPros/video cameras",
    ],
    foodInside: [
      {
        name: "Cuban sandwich",
        price: "$14-16",
        note: "Miami specialty \u2014 must try",
      },
      { name: "Fish tacos", price: "$12-14", note: "Fresh and good" },
      { name: "Empanadas", price: "$8-10", note: "Latin American staple" },
      { name: "Burgers", price: "$14-16", note: "Various options" },
    ],
    drinkPrices: [
      { item: "Draft beer", price: "$13-16" },
      { item: "Frozen cocktail", price: "$16-20" },
      { item: "Soda", price: "$6-7" },
      { item: "Water", price: "$5-6" },
    ],
    gettingThere: [
      {
        method: "Uber/Lyft",
        details:
          "From South Beach \u2014 30-40 min. From Downtown Miami \u2014 25 min.",
        cost: "$30-50",
      },
      {
        method: "Shuttle",
        details:
          "FIFA will likely run shuttles from Downtown and South Beach",
        cost: "$10-20 estimated",
      },
      {
        method: "Drive + Park",
        details: "Lots open 4hrs before. Cash or card.",
        cost: "$40-60",
      },
    ],
    tips: [
      "It\u2019s HOT. Drink water. Wear sunscreen. Bring a hat (if clear bag allows).",
      "Hard Rock is in Miami Gardens \u2014 NOT South Beach. It\u2019s a 30+ min drive.",
      "The roof canopy provides some shade but lower bowl gets direct sun",
      "Frozen cocktails are expensive but you\u2019ll want one in the heat",
      "Plan your Uber pickup spot BEFORE the match ends \u2014 surge is insane",
    ],
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Hard+Rock+Stadium+Miami",
  },
];

/** All stadium cities in route order */
export const STADIUM_CITIES = [
  "Boston",
  "New York",
  "Philadelphia",
  "Miami",
] as const;

/** Look up a guide by stadium name */
export function getStadiumGuide(
  name: string,
): StadiumGuide | undefined {
  return STADIUM_GUIDES.find((g) => g.name === name);
}

/** Look up a guide by city name */
export function getStadiumGuideByCity(
  city: string,
): StadiumGuide | undefined {
  return STADIUM_GUIDES.find((g) => g.city === city);
}
