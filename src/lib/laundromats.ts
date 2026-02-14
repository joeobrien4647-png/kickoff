// ============================================================================
// Laundromat Finder Data
// Laundromats near each road trip stop: Boston -> NYC -> Philly -> DC -> Nashville -> Miami
// ============================================================================

export type Laundromat = {
  name: string;
  city: string;
  address: string;
  hours: string;
  hasWashDry: boolean;
  hasFoldService: boolean;
  estimatedCost: string;
  mapsUrl: string;
  notes: string;
};

export const LAUNDROMATS: Laundromat[] = [
  // Boston
  {
    name: "Spin Cycle Laundromat",
    city: "Boston",
    address: "285 Newbury St, Boston, MA",
    hours: "7am-10pm daily",
    hasWashDry: true,
    hasFoldService: true,
    estimatedCost: "$3-5 per load",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Spin+Cycle+Laundromat+Boston+Newbury",
    notes: "Right on Newbury St \u2014 grab coffee while you wait",
  },
  {
    name: "Sudsville Laundromat",
    city: "Boston",
    address: "190 Brighton Ave, Allston, MA",
    hours: "6am-11pm daily",
    hasWashDry: true,
    hasFoldService: false,
    estimatedCost: "$2.50-4 per load",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Sudsville+Laundromat+Allston",
    notes: "Allston \u2014 great neighborhood for cheap eats",
  },
  // NYC
  {
    name: "Clean Rite Centers",
    city: "New York",
    address: "Multiple locations in Manhattan",
    hours: "24/7",
    hasWashDry: true,
    hasFoldService: true,
    estimatedCost: "$4-7 per load",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Clean+Rite+Centers+Manhattan",
    notes: "Chain with multiple locations \u2014 the most convenient option",
  },
  {
    name: "Celsious",
    city: "New York",
    address: "115 N 7th St, Brooklyn, NY",
    hours: "8am-10pm daily",
    hasWashDry: true,
    hasFoldService: true,
    estimatedCost: "$5-8 per load",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Celsious+Brooklyn",
    notes: "Upscale eco-friendly laundromat with caf\u00e9 \u2014 very Brooklyn",
  },
  // Philadelphia
  {
    name: "Wash Cycle Laundry",
    city: "Philadelphia",
    address: "1114 S 9th St, Philadelphia, PA",
    hours: "7am-9pm daily",
    hasWashDry: true,
    hasFoldService: true,
    estimatedCost: "$3-5 per load",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Wash+Cycle+Laundry+Philadelphia",
    notes: "Near Italian Market \u2014 grab a sandwich while you wait",
  },
  // Washington DC
  {
    name: "Spin Zone",
    city: "Washington DC",
    address: "1414 U St NW, Washington, DC",
    hours: "7am-10pm daily",
    hasWashDry: true,
    hasFoldService: true,
    estimatedCost: "$3-6 per load",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Spin+Zone+Laundry+U+Street+DC",
    notes: "U Street corridor \u2014 tons of restaurants nearby",
  },
  // Nashville
  {
    name: "Music Row Laundry",
    city: "Nashville",
    address: "1907 Division St, Nashville, TN",
    hours: "6am-midnight",
    hasWashDry: true,
    hasFoldService: false,
    estimatedCost: "$2-4 per load",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=laundromat+Music+Row+Nashville",
    notes: "Near Music Row \u2014 cheapest option",
  },
  // Miami
  {
    name: "Coral Way Laundry",
    city: "Miami",
    address: "2700 SW 22nd St, Miami, FL",
    hours: "7am-10pm daily",
    hasWashDry: true,
    hasFoldService: true,
    estimatedCost: "$3-6 per load",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Coral+Way+Laundry+Miami",
    notes: "Coral Way neighborhood \u2014 air-conditioned",
  },
];
