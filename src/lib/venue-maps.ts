export type VenueInfo = {
  name: string;
  city: string;
  capacity: string;
  sections: string;
  foodInside: string[];
  drinkRules: string;
  gates: string;
  clearBagPolicy: string;
  tips: string[];
  mapUrl: string;
  address: string;
};

export const VENUE_INFO: Record<string, VenueInfo> = {
  "Gillette Stadium": {
    name: "Gillette Stadium",
    city: "Foxborough",
    capacity: "65,878",
    sections:
      "Lower bowl (100s), Club level (200s), Upper deck (300s). Best atmosphere: 100-level behind goals. Sections 101-104 and 133-136 are the supporter ends.",
    foodInside: [
      "Lobster rolls",
      "Clam chowder",
      "Standard burgers & dogs",
      "Craft beer from local breweries",
      "Chicken tenders",
      "Pulled pork sandwiches",
    ],
    drinkRules:
      "Beer and wine sold throughout. No outside drinks. Alcohol sales cut off at the start of the second half.",
    gates: "Gates open 2 hours before kickoff",
    clearBagPolicy:
      "Clear bag policy \u2014 12\u00D76\u00D712 inch clear plastic bags only. Small clutch purses (4.5\u00D76.5 inches) allowed. No backpacks, fanny packs, or oversized bags.",
    tips: [
      "Arrive 3+ hours early \u2014 parking lots fill up fast and tailgating is huge",
      "Cash and cards accepted at all concession stands",
      "Cell service can be patchy \u2014 download tickets to your wallet offline",
      "The Patriot Place shopping area outside has restaurants and bars for pre-game",
      "Shuttle buses run from Boston (South Station) and Providence on game days",
    ],
    mapUrl: "https://www.gillettestadium.com/seating-map/",
    address: "1 Patriot Pl, Foxborough, MA 02035",
  },

  "MetLife Stadium": {
    name: "MetLife Stadium",
    city: "East Rutherford",
    capacity: "82,500",
    sections:
      "Lower level (100s), Mezzanine (200s), Upper level (300s). Best atmosphere: 100-level sections behind goals (111-114, 134-137). Club seats in 200-level offer wider seats and premium food.",
    foodInside: [
      "NJ deli sandwiches",
      "NY-style pizza slices",
      "Italian sausage & peppers",
      "Burgers & hot dogs",
      "Pat LaFrieda steak sandwiches",
      "Craft beer from local NJ breweries",
    ],
    drinkRules:
      "Beer, wine, and mixed drinks sold at stands throughout. No outside beverages. Alcohol cut-off at 75th minute.",
    gates: "Gates open 2 hours before kickoff",
    clearBagPolicy:
      "NFL clear bag policy \u2014 one clear 12\u00D76\u00D712 bag or one-gallon Ziploc-style bag per person. Small clutch purses (4.5\u00D76.5 inches) permitted. No backpacks.",
    tips: [
      "Take NJ Transit from Penn Station (NYC) \u2014 the Meadowlands Rail Line runs express on event days (~30 min)",
      "Parking opens 6 hours before kickoff; rideshare drop-off at Lot L",
      "The stadium gets windy \u2014 bring an extra layer even in summer",
      "Download the MetLife Stadium app for mobile ordering to skip concession lines",
      "No re-entry once you leave the stadium",
    ],
    mapUrl: "https://www.metlifestadium.com/seating-map",
    address: "1 MetLife Stadium Dr, East Rutherford, NJ 07073",
  },

  "Lincoln Financial Field": {
    name: "Lincoln Financial Field",
    city: "Philadelphia",
    capacity: "69,176",
    sections:
      "Lower level (100s), Club level (200s), Upper level (300s). Best atmosphere: lower bowl behind goals (sections 101-106 and 131-136). The 200-level clubs have air-conditioned lounges.",
    foodInside: [
      "Philly cheesesteaks (multiple stands)",
      "Roast pork sandwiches",
      "Crab fries from Chickie's & Pete's",
      "Federal Donuts fried chicken",
      "Standard burgers, dogs, pretzels",
      "Local craft beer and hard seltzer",
    ],
    drinkRules:
      "Beer, wine, and cocktails available. No outside drinks. Alcohol sales end at the start of the second half.",
    gates: "Gates open 2 hours before kickoff",
    clearBagPolicy:
      "Clear bag policy enforced \u2014 12\u00D76\u00D712 clear plastic, vinyl, or PVC bags. One-gallon Ziploc bags permitted. Small non-clear clutch (4.5\u00D76.5 inches max). No exceptions for backpacks.",
    tips: [
      "SEPTA Broad Street Line subway stops right at NRG Station (AT&T Station) \u2014 fastest way in",
      "Xfinity Live! across the street is the best pre-game spot with multiple bars and restaurants",
      "Philly fans are passionate \u2014 enjoy the atmosphere and keep banter friendly",
      "Parking lots open 4 hours before kickoff; lots fill quickly for big matches",
      "Sunscreen is a must \u2014 the stadium is open-air with little shade in the upper deck",
    ],
    mapUrl: "https://www.lincolnfinancialfield.com/seating-map/",
    address: "1 Lincoln Financial Field Way, Philadelphia, PA 19148",
  },

  "Mercedes-Benz Stadium": {
    name: "Mercedes-Benz Stadium",
    city: "Atlanta",
    capacity: "71,000",
    sections:
      "Lower level (100s), Club level (200s), Upper level (300s). Retractable roof keeps it climate-controlled. Best atmosphere: 100-level behind goals (sections 101-106 and 133-138). The 300-level has surprisingly good sightlines.",
    foodInside: [
      "Chick-fil-A sandwiches",
      "$2 hot dogs & $3 nachos (fan-first pricing)",
      "$2 refillable soft drinks",
      "Delia's Chicken Sausage Stand",
      "Fox Bros BBQ brisket sandwiches",
      "Molly B's burgers",
      "Craft beer ($5 domestic, $6 craft)",
    ],
    drinkRules:
      "Beer, wine, and cocktails available throughout at fan-friendly prices ($5-6 beers). No outside beverages. Alcohol sales end at 75th minute.",
    gates: "Gates open 2 hours before kickoff",
    clearBagPolicy:
      "Clear bag policy \u2014 12\u00D76\u00D712 clear bags only. Small clutch purses (4.5\u00D76.5 inches) allowed. Medical and parenting bags inspected at gate.",
    tips: [
      "Mercedes-Benz Stadium has the cheapest concessions in pro sports \u2014 $2 hot dogs, $2 sodas, $5 beers",
      "MARTA Vine City station is a 10-minute walk \u2014 skip the parking entirely",
      "The retractable roof means it's air-conditioned even in the Atlanta heat",
      "The 360-degree Halo Board is the world's largest LED video board \u2014 incredible viewing from any seat",
      "Arrive early to explore the Chick-fil-A Fan Plaza outside the stadium",
      "No re-entry after leaving",
    ],
    mapUrl: "https://mercedesbenzstadium.com/seating-map/",
    address: "1 AMB Dr NW, Atlanta, GA 30313",
  },

  "Hard Rock Stadium": {
    name: "Hard Rock Stadium",
    city: "Miami Gardens",
    capacity: "64,767",
    sections:
      "Lower level (100s), Club level (200s), Upper level (300s). Canopy roof provides partial shade. Best atmosphere: lower level behind goals (sections 101-106, 136-141). 200-level clubs are air-conditioned.",
    foodInside: [
      "Cuban sandwiches",
      "Empanadas",
      "Miami-style ceviche cups",
      "Burgers, hot dogs, chicken tenders",
      "Tropical fruit bowls",
      "Local craft beer and frozen cocktails",
    ],
    drinkRules:
      "Beer, wine, cocktails, and frozen drinks available. No outside beverages. Alcohol sales end at start of the second half.",
    gates: "Gates open 2 hours before kickoff",
    clearBagPolicy:
      "Clear bag policy \u2014 12\u00D76\u00D712 clear bags or one-gallon Ziploc bags. Small clutch (4.5\u00D76.5 inches) allowed. No backpacks, camera bags, or coolers.",
    tips: [
      "It's HOT \u2014 bring sunscreen, a hat, and stay hydrated (free water stations inside)",
      "The canopy roof provides some shade but lower sections still get direct sun early",
      "Parking is $40+ cash or card; rideshare is recommended (drop-off at Gate G)",
      "Pre-game at the surrounding tailgate areas \u2014 arrive 2-3 hours early",
      "Tri-Rail and shuttle buses run from Miami and Fort Lauderdale on game days",
      "Wear light, breathable clothing \u2014 even evening matches are humid",
    ],
    mapUrl: "https://www.hardrockstadium.com/seating-map/",
    address: "347 Don Shula Dr, Miami Gardens, FL 33056",
  },
};

/** Look up venue info by name, returns undefined if not found */
export function getVenueInfo(name: string): VenueInfo | undefined {
  return VENUE_INFO[name];
}
