export type RouteState = {
  name: string;
  abbreviation: string;
  order: number;
  enterCity: string;
  funFact: string;
};

export const ROUTE_STATES: RouteState[] = [
  { name: "Massachusetts", abbreviation: "MA", order: 1, enterCity: "Boston (start)", funFact: "Home of the first World Cup venue on the trip" },
  { name: "Connecticut", abbreviation: "CT", order: 2, enterCity: "Entering via I-95", funFact: "Smallest state you'll drive through — done in 90 mins" },
  { name: "New York", abbreviation: "NY", order: 3, enterCity: "Entering via I-95", funFact: "Welcome to the Empire State — NYC awaits" },
  { name: "New Jersey", abbreviation: "NJ", order: 4, enterCity: "Crossing the GW Bridge", funFact: "MetLife Stadium is actually in NJ, not NYC" },
  { name: "Pennsylvania", abbreviation: "PA", order: 5, enterCity: "Entering via NJ Turnpike", funFact: "Birthplace of American independence" },
  { name: "Delaware", abbreviation: "DE", order: 6, enterCity: "Brief I-95 pass-through", funFact: "First state to ratify the Constitution — you'll be through in 20 mins" },
  { name: "Maryland", abbreviation: "MD", order: 7, enterCity: "Entering via I-95", funFact: "Grab crab cakes if you stop" },
  { name: "Virginia", abbreviation: "VA", order: 8, enterCity: "Passing through to DC", funFact: "Brief pass through NoVA suburbs" },
  { name: "Tennessee", abbreviation: "TN", order: 9, enterCity: "Nashville", funFact: "Music City — home of country, blues, and hot chicken" },
  { name: "Georgia", abbreviation: "GA", order: 10, enterCity: "Passing through Atlanta area", funFact: "Watch for Atlanta traffic on I-75" },
  { name: "Florida", abbreviation: "FL", order: 11, enterCity: "Entering via I-95 South", funFact: "Final destination — Miami and the World Cup final" },
];
