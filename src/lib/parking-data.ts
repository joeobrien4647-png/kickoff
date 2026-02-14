// ============================================================================
// Parking Guide Data
// Stadium parking and city parking info for each stop on the road trip.
// Boston -> New York -> Philadelphia -> Washington DC -> Nashville -> Miami
// ============================================================================

export type ParkingInfo = {
  city: string;
  stadium: {
    name: string;
    lots: string;
    cost: string;
    tips: string[];
    ridesharePickup: string;
  };
  cityParking: {
    garageAvg: string;
    streetParking: string;
    tips: string[];
    freeOptions: string;
  };
  accommodation: string;
};

export const PARKING_GUIDE: ParkingInfo[] = [
  // ── Boston / Foxborough ────────────────────────────────────────────
  {
    city: "Boston",
    stadium: {
      name: "Gillette Stadium",
      lots: "Massive surface lots surrounding the stadium (P1-P15). 25,000+ spaces. Opens 4 hours before kickoff. Cash and card accepted.",
      cost: "$40-60",
      tips: [
        "Arrive 3+ hours early \u2014 one access road (Rte 1) means gridlock",
        "Lots P6 and P8 are closest to the main gates",
        "Tailgating is allowed and encouraged \u2014 bring a grill if you want the full experience",
        "No public transit to the stadium \u2014 driving or rideshare only",
      ],
      ridesharePickup:
        "Designated rideshare zone at Lot 15 (CBS Sporting Club side). Expect 30-60 min surge-priced waits post-match.",
    },
    cityParking: {
      garageAvg: "$30-50/day in downtown Boston",
      streetParking:
        "Metered until 8pm ($3.50/hr). Resident-only zones everywhere \u2014 read every sign carefully.",
      tips: [
        "SpotHero app for pre-booked garage spots at 20-40% off",
        "Boston Common Garage is central but expensive ($38/day)",
        "Street parking in Back Bay and Beacon Hill is resident-only",
      ],
      freeOptions:
        "Free on Sundays at meters. Some spots in Allston/Brighton if you're willing to walk or take the T.",
    },
    accommodation:
      "Most downtown hotels charge $40-55/night for parking. Budget this in or find a hotel near a T station and skip the car.",
  },

  // ── New York / East Rutherford ─────────────────────────────────────
  {
    city: "New York",
    stadium: {
      name: "MetLife Stadium",
      lots: "Official lots (A-K) with 28,000+ spaces. Pre-purchase parking passes on Ticketmaster or ParkWhiz. Premium lots closer to entrances.",
      cost: "$30-45",
      tips: [
        "NJ Transit trains from Penn Station (Meadowlands Rail Line) run on event days \u2014 much easier than driving",
        "If driving, Lot J is the main tailgating lot (iconic)",
        "Traffic on I-95 and NJ Turnpike is brutal post-match \u2014 budget 60-90 min to exit",
        "Pre-purchased parking passes avoid cash-only lot hassles",
      ],
      ridesharePickup:
        "Lot L rideshare zone. Massive surge pricing after events ($60-80+ to Manhattan). Consider walking to the train instead.",
    },
    cityParking: {
      garageAvg: "$40-60/day in Manhattan",
      streetParking:
        "Nearly impossible in Midtown. Alternate side parking rules are confusing. Meters run $4/hr with 2-hour max.",
      tips: [
        "Don't drive in Manhattan \u2014 use the subway, it runs 24/7",
        "If you must park: Icon/LAZ garages near Times Square for $30-45/day if pre-booked",
        "SpotHero or ParkWhiz apps are essential for NYC",
        "Jersey City garages ($15-25/day) + PATH train to Manhattan saves money",
      ],
      freeOptions:
        "Free street parking exists in outer boroughs (Brooklyn, Queens) but check signs carefully. Alternate side rules mean you'll move the car every other day.",
    },
    accommodation:
      "Manhattan hotels charge $50-75/night for parking if they even have it. Leave the car in NJ and take transit.",
  },

  // ── Philadelphia ───────────────────────────────────────────────────
  {
    city: "Philadelphia",
    stadium: {
      name: "Lincoln Financial Field",
      lots: "Official lots in the South Philly Sports Complex. Multiple lots (A-M) surrounding the stadium and neighboring venues.",
      cost: "$20-30",
      tips: [
        "Broad Street Line (subway) drops you at NRG station \u2014 easiest option",
        "Lot K is the main tailgating area (legendary for Eagles games)",
        "Lots fill up fast on match days \u2014 arrive 2+ hours early",
        "I-76 and I-95 exits are jammed \u2014 take Broad Street south instead",
      ],
      ridesharePickup:
        "Rideshare pickup at the corner of Pattison Ave and 11th Street. Less surge than NYC but still expect waits.",
    },
    cityParking: {
      garageAvg: "$15-25/day in Center City",
      streetParking:
        "Metered ($3/hr, 2-hour max). PPA (Parking Authority) is notoriously aggressive \u2014 don't overstay a meter.",
      tips: [
        "Cheaper than NYC and Boston \u2014 garages around Rittenhouse Square are $20-30/day",
        "ParkMobile app for street meters",
        "Old City has some free spots on weekends if you're lucky",
      ],
      freeOptions:
        "Free parking in residential areas of South Philly and East Passyunk \u2014 15 min walk to the stadium complex.",
    },
    accommodation:
      "Hotel parking in Center City runs $25-40/night. More reasonable than Boston/NYC.",
  },

  // ── Washington DC ──────────────────────────────────────────────────
  {
    city: "Washington DC",
    stadium: {
      name: "No WC venue",
      lots: "N/A \u2014 no World Cup matches scheduled in DC. But FedEx Field (Commanders) is in Landover, MD if needed for fan events.",
      cost: "N/A",
      tips: [
        "DC is a transit stop \u2014 use the Metro system to see the sights",
        "If visiting FedEx Field for events: parking is $40-60, but Metro is easier",
      ],
      ridesharePickup: "N/A for WC \u2014 Uber/Lyft work well throughout DC.",
    },
    cityParking: {
      garageAvg: "$20-30/day",
      streetParking:
        "Metered until 10pm ($2.30/hr in most zones). Strict enforcement \u2014 DC parking officers are relentless.",
      tips: [
        "Metro is the best option \u2014 covers all major sights and neighborhoods",
        "ColonialParking and PMI garages have weekend flat rates ($15-20)",
        "Never park in a zone marked 'Emergency No Parking' \u2014 your car WILL be towed",
        "Embassy Row has some free parking on weekends",
      ],
      freeOptions:
        "Free on Sundays and federal holidays at meters. The Mall area has some free lots on weekends (limited).",
    },
    accommodation:
      "Hotel parking is $30-45/night downtown. Stay near a Metro station and skip driving entirely.",
  },

  // ── Nashville ──────────────────────────────────────────────────────
  {
    city: "Nashville",
    stadium: {
      name: "No WC venue",
      lots: "N/A \u2014 no World Cup matches in Nashville. Nissan Stadium (Titans) sits across the river from downtown for any fan zone events.",
      cost: "N/A",
      tips: [
        "Nashville is a road trip pit stop \u2014 park once downtown and walk Broadway",
        "If visiting Nissan Stadium: lots are $20-30 with easy pedestrian bridge access to downtown",
      ],
      ridesharePickup:
        "N/A for WC \u2014 rideshare works well, especially on Broadway where walking is easier.",
    },
    cityParking: {
      garageAvg: "$10-20/day",
      streetParking:
        "Metered downtown ($2/hr). Free after 6pm and on weekends in most areas.",
      tips: [
        "Cheapest parking of any city on the trip",
        "The Gulch and Midtown have free street parking on side streets",
        "Public Square Garage downtown is $12/day \u2014 great location",
        "Don't park on Lower Broadway \u2014 it's a pedestrian zone at night",
      ],
      freeOptions:
        "Free parking at Nissan Stadium lots on non-event days. Free street parking in Germantown and East Nashville side streets.",
    },
    accommodation:
      "Hotel parking downtown is $25-35/night. Stay in Germantown or The Gulch for cheaper or free street parking.",
  },

  // ── Miami ──────────────────────────────────────────────────────────
  {
    city: "Miami",
    stadium: {
      name: "Hard Rock Stadium",
      lots: "Official parking in surrounding lots (Orange, Blue, Green, Yellow zones). 25,000+ spaces. Pre-purchase recommended.",
      cost: "$40-60+",
      tips: [
        "No public transit to Hard Rock \u2014 driving or rideshare only",
        "Pre-purchase parking on ParkWhiz or Ticketmaster \u2014 cash lots run out fast",
        "Orange Lot opens earliest for tailgating",
        "I-95 and Florida's Turnpike exits will be gridlocked \u2014 leave 3 hours early",
        "Consider parking at Calder Casino ($20) and walking 10 min to the stadium",
      ],
      ridesharePickup:
        "Stadium Gate 4 rideshare zone. Expect extreme surge pricing ($80-120+ after matches). Seriously consider pre-arranged transport.",
    },
    cityParking: {
      garageAvg: "$15-30/day in Miami Beach, $10-20/day in Downtown/Brickell",
      streetParking:
        "Metered in Miami Beach ($4/hr, enforced until midnight). ParkMobile app for all meters.",
      tips: [
        "Miami Beach meters are enforced until MIDNIGHT \u2014 don't assume they stop at 6pm",
        "Brickell/Downtown garages are $10-15/day pre-booked",
        "Wynwood has $5-10 lots for the arts district",
        "Watch for residential permit zones in South Beach \u2014 you will get towed",
      ],
      freeOptions:
        "Free parking at Bayfront Park on weekends (limited). Some free spots in Little Havana side streets. Wynwood has some free lots during weekday mornings.",
    },
    accommodation:
      "South Beach hotels charge $30-50/night for parking. Stay in Brickell or Downtown for cheaper rates ($15-25/night) with Metromover access.",
  },
];
