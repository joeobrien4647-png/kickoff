// ============================================================================
// Essential Stores Data (Pharmacies, Supermarkets, Convenience)
// Pharmacies and grocery stores near each road trip stop:
// Boston -> NYC -> Philly -> DC -> Nashville -> Miami
// ============================================================================

export type EssentialStore = {
  name: string;
  type: "pharmacy" | "supermarket" | "convenience";
  city: string;
  address: string;
  hours: string;
  mapsUrl: string;
  notes: string;
};

export const ESSENTIAL_STORES: EssentialStore[] = [
  // Boston
  {
    name: "CVS Pharmacy",
    type: "pharmacy",
    city: "Boston",
    address: "587 Boylston St, Boston, MA",
    hours: "7am-10pm",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=CVS+Pharmacy+Boylston+Boston",
    notes: "Back Bay \u2014 central location",
  },
  {
    name: "Trader Joe's",
    type: "supermarket",
    city: "Boston",
    address: "899 Boylston St, Boston, MA",
    hours: "8am-9pm",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Trader+Joes+Boylston+Boston",
    notes: "Good for snacks and cheap wine",
  },
  // NYC
  {
    name: "Walgreens",
    type: "pharmacy",
    city: "New York",
    address: "1471 Broadway, New York, NY (Times Square)",
    hours: "24/7",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Walgreens+Times+Square",
    notes: "24/7 \u2014 right in Times Square",
  },
  {
    name: "Whole Foods Market",
    type: "supermarket",
    city: "New York",
    address: "4 Union Square S, New York, NY",
    hours: "7am-11pm",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Whole+Foods+Union+Square+NYC",
    notes: "Great prepared food section for quick meals",
  },
  {
    name: "Duane Reade",
    type: "pharmacy",
    city: "New York",
    address: "Multiple locations",
    hours: "24/7 many locations",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Duane+Reade+Manhattan",
    notes: "NYC's everywhere pharmacy \u2014 like Boots",
  },
  // Philadelphia
  {
    name: "CVS Pharmacy",
    type: "pharmacy",
    city: "Philadelphia",
    address: "1826 Chestnut St, Philadelphia, PA",
    hours: "8am-10pm",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=CVS+Chestnut+Street+Philadelphia",
    notes: "Center City location",
  },
  {
    name: "Acme Markets",
    type: "supermarket",
    city: "Philadelphia",
    address: "1100 S Delaware Ave, Philadelphia, PA",
    hours: "6am-midnight",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Acme+Markets+Philadelphia",
    notes: "Good prices, big selection",
  },
  // Washington DC
  {
    name: "CVS Pharmacy",
    type: "pharmacy",
    city: "Washington DC",
    address: "2 Dupont Circle NW, Washington, DC",
    hours: "7am-10pm",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=CVS+Dupont+Circle+DC",
    notes: "Dupont Circle \u2014 walkable to most things",
  },
  {
    name: "Trader Joe's",
    type: "supermarket",
    city: "Washington DC",
    address: "1101 25th St NW, Washington, DC",
    hours: "8am-9pm",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Trader+Joes+Foggy+Bottom+DC",
    notes: "Foggy Bottom \u2014 near Georgetown",
  },
  // Nashville
  {
    name: "Walgreens",
    type: "pharmacy",
    city: "Nashville",
    address: "426 Broadway, Nashville, TN",
    hours: "7am-midnight",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Walgreens+Broadway+Nashville",
    notes: "Right on Broadway \u2014 impossible to miss",
  },
  {
    name: "Publix",
    type: "supermarket",
    city: "Nashville",
    address: "4005 Hillsboro Pike, Nashville, TN",
    hours: "7am-10pm",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Publix+Hillsboro+Nashville",
    notes: "Southern grocery chain \u2014 great deli subs",
  },
  // Miami
  {
    name: "CVS Pharmacy",
    type: "pharmacy",
    city: "Miami",
    address: "1560 Washington Ave, Miami Beach, FL",
    hours: "8am-10pm",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=CVS+Washington+Ave+Miami+Beach",
    notes: "South Beach location",
  },
  {
    name: "Publix",
    type: "supermarket",
    city: "Miami",
    address: "1045 5th St, Miami Beach, FL",
    hours: "7am-11pm",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Publix+South+Beach+Miami",
    notes: "South Beach \u2014 good for road trip snack runs",
  },
];
