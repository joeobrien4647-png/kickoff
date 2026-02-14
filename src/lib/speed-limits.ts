// ============================================================================
// Speed Limit Reference Data
// Per-state speed limits along the Boston -> NYC -> Philly -> DC -> Nashville
// -> Miami road trip route. Covers all 11 states on I-95 / I-81 / I-75 corridor.
// ============================================================================

export type StateSpeedLimit = {
  state: string;
  abbreviation: string;
  interstate: { mph: number; kmh: number };
  urban: { mph: number; kmh: number };
  residential: { mph: number; kmh: number };
  schoolZone: { mph: number; kmh: number };
  notes: string;
};

export const SPEED_LIMITS: StateSpeedLimit[] = [
  { state: "Massachusetts", abbreviation: "MA", interstate: { mph: 65, kmh: 105 }, urban: { mph: 30, kmh: 48 }, residential: { mph: 25, kmh: 40 }, schoolZone: { mph: 20, kmh: 32 }, notes: "Speed cameras active in some areas. Toll roads use EZPass." },
  { state: "Connecticut", abbreviation: "CT", interstate: { mph: 65, kmh: 105 }, urban: { mph: 30, kmh: 48 }, residential: { mph: 25, kmh: 40 }, schoolZone: { mph: 20, kmh: 32 }, notes: "Heavy traffic on I-95. Police actively enforce speed limits." },
  { state: "New York", abbreviation: "NY", interstate: { mph: 65, kmh: 105 }, urban: { mph: 30, kmh: 48 }, residential: { mph: 25, kmh: 40 }, schoolZone: { mph: 20, kmh: 32 }, notes: "NYC speed limit is 25 mph unless posted. Speed cameras everywhere in NYC." },
  { state: "New Jersey", abbreviation: "NJ", interstate: { mph: 65, kmh: 105 }, urban: { mph: 35, kmh: 56 }, residential: { mph: 25, kmh: 40 }, schoolZone: { mph: 25, kmh: 40 }, notes: "NJ Turnpike can be 65 mph. Aggressive drivers \u2014 stay right!" },
  { state: "Pennsylvania", abbreviation: "PA", interstate: { mph: 70, kmh: 113 }, urban: { mph: 35, kmh: 56 }, residential: { mph: 25, kmh: 40 }, schoolZone: { mph: 15, kmh: 24 }, notes: "PA Turnpike speed limit is 70 mph. Watch for construction zones." },
  { state: "Delaware", abbreviation: "DE", interstate: { mph: 65, kmh: 105 }, urban: { mph: 25, kmh: 40 }, residential: { mph: 25, kmh: 40 }, schoolZone: { mph: 15, kmh: 24 }, notes: "Brief pass-through on I-95. Toll plaza at state line." },
  { state: "Maryland", abbreviation: "MD", interstate: { mph: 65, kmh: 105 }, urban: { mph: 30, kmh: 48 }, residential: { mph: 25, kmh: 40 }, schoolZone: { mph: 15, kmh: 24 }, notes: "Speed cameras on highways! Baltimore tunnels have lower limits." },
  { state: "Virginia", abbreviation: "VA", interstate: { mph: 70, kmh: 113 }, urban: { mph: 35, kmh: 56 }, residential: { mph: 25, kmh: 40 }, schoolZone: { mph: 25, kmh: 40 }, notes: "Reckless driving charge for 20+ mph over limit or 85+ mph. Heavy fines." },
  { state: "Tennessee", abbreviation: "TN", interstate: { mph: 70, kmh: 113 }, urban: { mph: 30, kmh: 48 }, residential: { mph: 30, kmh: 48 }, schoolZone: { mph: 15, kmh: 24 }, notes: "Some rural interstates are 75 mph. Watch for 'Move Over' law for emergency vehicles." },
  { state: "Georgia", abbreviation: "GA", interstate: { mph: 70, kmh: 113 }, urban: { mph: 35, kmh: 56 }, residential: { mph: 25, kmh: 40 }, schoolZone: { mph: 25, kmh: 40 }, notes: "Atlanta traffic is brutal. I-75/I-85 merge is notorious. Super Speeder law: 75+ on 2-lane, 85+ on interstate = extra $200 fine." },
  { state: "Florida", abbreviation: "FL", interstate: { mph: 70, kmh: 113 }, urban: { mph: 30, kmh: 48 }, residential: { mph: 25, kmh: 40 }, schoolZone: { mph: 15, kmh: 24 }, notes: "Some rural interstates 75 mph. Toll roads use SunPass/EZPass. Miami traffic is chaotic." },
];

/** States with notably strict enforcement or severe penalties */
export const STRICT_STATES = new Set(["VA", "GA"]);
