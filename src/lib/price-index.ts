export type CityPrices = {
  city: string;
  pint: { low: number; high: number };
  cocktail: { low: number; high: number };
  meal: { casual: number; midRange: number; nice: number };
  coffee: number;
  uber5mi: { low: number; high: number };
  bottleWater: number;
  slice: number;
  budgetTip: string;
};

export const CITY_PRICES: CityPrices[] = [
  {
    city: "Boston",
    pint: { low: 8, high: 10 },
    cocktail: { low: 14, high: 18 },
    meal: { casual: 15, midRange: 25, nice: 50 },
    coffee: 5,
    uber5mi: { low: 12, high: 18 },
    bottleWater: 2.5,
    slice: 4,
    budgetTip:
      "Happy hour is 4-7pm at most bars. Sam Adams is local and cheap on draft.",
  },
  {
    city: "New York",
    pint: { low: 9, high: 12 },
    cocktail: { low: 16, high: 22 },
    meal: { casual: 18, midRange: 30, nice: 60 },
    coffee: 5.5,
    uber5mi: { low: 15, high: 25 },
    bottleWater: 3,
    slice: 4.5,
    budgetTip:
      "Dollar slice shops are everywhere for $1.50. Happy hours in Midtown start at 4pm.",
  },
  {
    city: "Philadelphia",
    pint: { low: 7, high: 9 },
    cocktail: { low: 12, high: 16 },
    meal: { casual: 14, midRange: 22, nice: 45 },
    coffee: 4.5,
    uber5mi: { low: 10, high: 15 },
    bottleWater: 2,
    slice: 3.5,
    budgetTip:
      "BYOB restaurants are huge here and save a fortune on drinks. Reading Terminal Market for cheap lunch.",
  },
  {
    city: "Washington DC",
    pint: { low: 8, high: 10 },
    cocktail: { low: 14, high: 18 },
    meal: { casual: 16, midRange: 25, nice: 50 },
    coffee: 5,
    uber5mi: { low: 12, high: 20 },
    bottleWater: 2.5,
    slice: 4,
    budgetTip:
      "Smithsonian museums are free. Adams Morgan and U Street have the best happy hour deals.",
  },
  {
    city: "Nashville",
    pint: { low: 7, high: 9 },
    cocktail: { low: 12, high: 16 },
    meal: { casual: 14, midRange: 22, nice: 45 },
    coffee: 4.5,
    uber5mi: { low: 10, high: 15 },
    bottleWater: 2,
    slice: 3.5,
    budgetTip:
      "Broadway honky-tonks have no cover charge. Hot chicken is the move -- Prince's is the original.",
  },
  {
    city: "Miami",
    pint: { low: 8, high: 11 },
    cocktail: { low: 15, high: 20 },
    meal: { casual: 16, midRange: 28, nice: 55 },
    coffee: 5.5,
    uber5mi: { low: 15, high: 22 },
    bottleWater: 3,
    slice: 4,
    budgetTip:
      "Cuban coffee (colada) is $2-3 and feeds four. Wynwood has 2-for-1 happy hours.",
  },
];

/** Approximate GBP conversion rate: $1 USD = this many GBP */
export const GBP_RATE = 0.79;

/** Cost tier for color-coding: maps city name to its relative expense level */
export function getCostTier(
  city: string,
): "cheap" | "moderate" | "expensive" {
  switch (city) {
    case "New York":
    case "Miami":
      return "expensive";
    case "Philadelphia":
    case "Nashville":
      return "cheap";
    default:
      return "moderate";
  }
}
