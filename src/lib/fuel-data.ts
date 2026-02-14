// ============================================================================
// Fuel Cost Estimator Data
// Per-leg fuel estimates for the Boston -> NYC -> Philly -> DC -> Nashville -> Miami
// road trip. Based on a midsize rental SUV at ~28 MPG and 2025-2026 regional gas prices.
// ============================================================================

export type FuelEstimate = {
  from: string;
  to: string;
  miles: number;
  estimatedGallons: number; // at ~28 MPG (typical midsize rental)
  estimatedCost: number; // gallons x avg gas price for that state
  gasPrice: number; // avg price per gallon in that region
  stations: string[]; // good chains to stop at (Buc-ee's, Wawa, etc.)
};

export const FUEL_ESTIMATES: FuelEstimate[] = [
  {
    from: "Boston",
    to: "New York",
    miles: 215,
    estimatedGallons: 7.7,
    estimatedCost: 27,
    gasPrice: 3.5,
    stations: [
      "Cumberland Farms (MA/CT)",
      "Costco (Milford, CT)",
      "Shell (I-95 rest stops)",
    ],
  },
  {
    from: "New York",
    to: "Philadelphia",
    miles: 97,
    estimatedGallons: 3.5,
    estimatedCost: 12,
    gasPrice: 3.3,
    stations: [
      "Wawa (NJ Turnpike)",
      "QuickChek (NJ)",
      "Costco (Edison, NJ)",
    ],
  },
  {
    from: "Philadelphia",
    to: "Washington DC",
    miles: 140,
    estimatedGallons: 5.0,
    estimatedCost: 17,
    gasPrice: 3.4,
    stations: [
      "Wawa (throughout PA/MD)",
      "Royal Farms (MD)",
      "Sheetz (MD)",
    ],
  },
  {
    from: "Washington DC",
    to: "Nashville",
    miles: 670,
    estimatedGallons: 23.9,
    estimatedCost: 77,
    gasPrice: 3.2,
    stations: [
      "Sheetz (VA)",
      "Pilot/Flying J (I-81)",
      "Buc-ee's (Crossville, TN)",
      "Costco (Knoxville, TN)",
    ],
  },
  {
    from: "Nashville",
    to: "Miami",
    miles: 780,
    estimatedGallons: 27.9,
    estimatedCost: 92,
    gasPrice: 3.3,
    stations: [
      "Buc-ee's (Warner Robins, GA)",
      "QT (Georgia)",
      "Buc-ee's (Daytona, FL)",
      "Wawa (Florida)",
      "Costco (throughout FL)",
    ],
  },
];

export const RENTAL_CAR_INFO = {
  type: "Midsize SUV or similar",
  mpg: 28,
  pickupCity: "Boston",
  dropoffCity: "Miami",
  estimatedCost: "$1,200-1,500 for 16 days (one-way fee included)",
  tips: [
    "Fill up before returning \u2014 rental company charges 2-3x pump price",
    "Get an EZ-Pass tag \u2014 saves time and money on tolls (I-95 is toll-heavy)",
    "New Jersey is full-service only \u2014 attendant pumps your gas",
    "Costco and Sam's Club have cheapest gas if you pass one",
    "GasBuddy app shows real-time prices \u2014 save $0.10-0.30/gal easily",
    "Fill up before leaving Virginia \u2014 prices rise in rural TN/GA stretches",
  ],
} as const;

export const TOTAL_FUEL_ESTIMATE = {
  miles: 1902,
  gallons: 68,
  cost: 225,
} as const;
