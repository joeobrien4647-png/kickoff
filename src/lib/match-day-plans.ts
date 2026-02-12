// ── Match Day Plans ─────────────────────────────────────────────────
// Venue-specific timelines for World Cup match days.
// Each step uses a relative offset (in minutes) from kickoff.

export type StepType = "transport" | "food" | "activity" | "match" | "celebration";

export type MatchDayStep = {
  /** Offset in minutes relative to kickoff (negative = before, 0 = kickoff) */
  offset: number;
  /** Human-readable relative time, e.g. "-4h", "KICKOFF", "+2h" */
  time: string;
  label: string;
  description: string;
  type: StepType;
  tip?: string;
};

export type MatchDayPlan = {
  venue: string;
  city: string;
  gateOpenTime: string;
  transportFromCity: string;
  transportTime: string;
  parkingTip: string;
  steps: MatchDayStep[];
};

export const MATCH_DAY_PLANS: Record<string, MatchDayPlan> = {
  "Gillette Stadium": {
    venue: "Gillette Stadium",
    city: "Boston",
    gateOpenTime: "3 hours before kickoff",
    transportFromCity: "Foxboro commuter rail from South Station, or drive",
    transportTime: "60-90 min by commuter rail",
    parkingTip: "Parking is $60 cash. Lots open 4h before kickoff.",
    steps: [
      {
        offset: -300,
        time: "-5h",
        label: "Brunch",
        description: "Fuel up at the hotel or a spot near South Station",
        type: "food",
        tip: "Try Paramount on Charles St or South Street Diner",
      },
      {
        offset: -240,
        time: "-4h",
        label: "Foxboro commuter rail",
        description:
          "Take the special game-day train from South Station to Foxborough",
        type: "transport",
        tip: "Driving? Parking is $60 cash only. Leave extra early for traffic on Rte 1.",
      },
      {
        offset: -180,
        time: "-3h",
        label: "Gates open",
        description: "Find the tailgating area and soak it all in",
        type: "activity",
        tip: "Bring sunscreen and water - New England summer sun is no joke",
      },
      {
        offset: -120,
        time: "-2h",
        label: "FIFA Fan Zone",
        description: "Explore the fan fest and entertainment area outside the stadium",
        type: "activity",
      },
      {
        offset: -60,
        time: "-1h",
        label: "Find your seats",
        description: "Head in, grab a drink, soak up the atmosphere",
        type: "activity",
      },
      {
        offset: 0,
        time: "KICKOFF",
        label: "KICKOFF",
        description: "Match time!",
        type: "match",
      },
      {
        offset: 60,
        time: "+1h",
        label: "Full time",
        description: "Don't rush out - enjoy the scenes and the crowd",
        type: "celebration",
      },
      {
        offset: 120,
        time: "+2h",
        label: "Commuter rail back",
        description:
          "Catch the train back to Boston. If driving, expect 90 min of traffic.",
        type: "transport",
        tip: "Trains run for about 2 hours after the final whistle",
      },
      {
        offset: 180,
        time: "+3h",
        label: "Celebrate in Boston",
        description: "Hit up McGreevy's or The Banshee for post-match pints",
        type: "celebration",
        tip: "McGreevy's is the most iconic sports pub in Boston",
      },
    ],
  },

  "MetLife Stadium": {
    venue: "MetLife Stadium",
    city: "New York",
    gateOpenTime: "2.5 hours before kickoff",
    transportFromCity: "NJ Transit train from Penn Station, or express bus",
    transportTime: "30-45 min by NJ Transit",
    parkingTip:
      "Parking available but expensive. Public transit is the move here.",
    steps: [
      {
        offset: -300,
        time: "-5h",
        label: "Brunch in Manhattan",
        description: "Grab a proper breakfast before heading across the river",
        type: "food",
        tip: "Clinton St. Baking Co. or Bubby's in Tribeca",
      },
      {
        offset: -180,
        time: "-3h",
        label: "NJ Transit to Meadowlands",
        description:
          "Train from Penn Station or express bus from Port Authority",
        type: "transport",
        tip: "Buy a return ticket now - queues after the match are brutal",
      },
      {
        offset: -150,
        time: "-2.5h",
        label: "Gates open",
        description: "Massive tailgating culture here - get involved",
        type: "activity",
        tip: "The parking lots are like a festival. Friendly crowds.",
      },
      {
        offset: -90,
        time: "-1.5h",
        label: "FIFA Fan Zone",
        description: "Live entertainment, food vendors, and World Cup merch",
        type: "activity",
      },
      {
        offset: -30,
        time: "-0.5h",
        label: "Find your seats",
        description: "Head to your section and take it all in",
        type: "activity",
      },
      {
        offset: 0,
        time: "KICKOFF",
        label: "KICKOFF",
        description: "Match time!",
        type: "match",
      },
      {
        offset: 60,
        time: "+1h",
        label: "Full time",
        description: "Enjoy the atmosphere - no rush to leave",
        type: "celebration",
      },
      {
        offset: 120,
        time: "+2h",
        label: "NJ Transit back",
        description: "Train or bus back to Manhattan",
        type: "transport",
        tip: "Follow the crowd - everyone's going the same way",
      },
      {
        offset: 180,
        time: "+3h",
        label: "Celebrate in NYC",
        description:
          "Times Square for the buzz, or Hell's Kitchen bars for a proper night out",
        type: "celebration",
        tip: "The Playwright on 49th has great craic and big screens",
      },
    ],
  },

  "Lincoln Financial Field": {
    venue: "Lincoln Financial Field",
    city: "Philadelphia",
    gateOpenTime: "2 hours before kickoff",
    transportFromCity: "BSL subway to NRG station, or walk from Center City",
    transportTime: "20 min by subway",
    parkingTip:
      "Parking lots fill up fast. Tailgating culture is legendary here.",
    steps: [
      {
        offset: -240,
        time: "-4h",
        label: "Brunch in Center City",
        description: "Reading Terminal Market or a Center City brunch spot",
        type: "food",
        tip: "Reading Terminal Market is unmissable - get a Philly cheesesteak too",
      },
      {
        offset: -120,
        time: "-2h",
        label: "Subway to the stadium",
        description:
          "Take the Broad Street Line (BSL) south to NRG station, or walk through the sports complex",
        type: "transport",
        tip: "It's a short ride - one of the easiest stadium commutes on the trip",
      },
      {
        offset: -90,
        time: "-1.5h",
        label: "Tailgate in the parking lots",
        description: "Eagles fans know how to tailgate. This will be next level for the World Cup.",
        type: "activity",
        tip: "Be friendly, bring beers to share, and you'll make new mates instantly",
      },
      {
        offset: -60,
        time: "-1h",
        label: "Fan festival",
        description: "FIFA Fan Zone and pre-match entertainment",
        type: "activity",
      },
      {
        offset: 0,
        time: "KICKOFF",
        label: "KICKOFF",
        description: "Match time!",
        type: "match",
      },
      {
        offset: 60,
        time: "+1h",
        label: "Full time",
        description: "Post-match buzz - soak it in",
        type: "celebration",
      },
      {
        offset: 120,
        time: "+2h",
        label: "Back to Center City",
        description: "Walk or take the BSL subway back",
        type: "transport",
      },
      {
        offset: 180,
        time: "+3h",
        label: "Celebrate in Philly",
        description: "Head to Fado Irish Pub or McGillin's Olde Ale House",
        type: "celebration",
        tip: "McGillin's is the oldest continuously operating pub in Philadelphia (since 1860)",
      },
    ],
  },

  "Mercedes-Benz Stadium": {
    venue: "Mercedes-Benz Stadium",
    city: "Atlanta",
    gateOpenTime: "3 hours before kickoff",
    transportFromCity: "MARTA rail to Vine City or GWCC/CNN Center stations",
    transportTime: "15-25 min by MARTA",
    parkingTip:
      "Use MARTA. Parking near the stadium is limited and expensive.",
    steps: [
      {
        offset: -300,
        time: "-5h",
        label: "Brunch in Midtown",
        description: "Start the day with southern brunch in Midtown or Buckhead",
        type: "food",
        tip: "Flying Biscuit Cafe is a local institution",
      },
      {
        offset: -180,
        time: "-3h",
        label: "MARTA to the stadium",
        description: "Take the MARTA rail to Vine City station - 5 min walk to the stadium",
        type: "transport",
        tip: "Buy a reloadable Breeze card at any station",
      },
      {
        offset: -150,
        time: "-2.5h",
        label: "Gates open",
        description: "Mercedes-Benz has incredible concessions - check out the food hall",
        type: "activity",
        tip: "The retractable roof is engineering art - it may be open if weather permits",
      },
      {
        offset: -90,
        time: "-1.5h",
        label: "FIFA Fan Zone",
        description: "Centennial Olympic Park area will be buzzing",
        type: "activity",
      },
      {
        offset: -30,
        time: "-0.5h",
        label: "Find your seats",
        description: "The halo board is the world's largest - enjoy the view",
        type: "activity",
      },
      {
        offset: 0,
        time: "KICKOFF",
        label: "KICKOFF",
        description: "Match time!",
        type: "match",
      },
      {
        offset: 60,
        time: "+1h",
        label: "Full time",
        description: "Stay and celebrate - the stadium atmosphere lingers",
        type: "celebration",
      },
      {
        offset: 120,
        time: "+2h",
        label: "MARTA back",
        description: "Trains run frequently post-match. Follow the crowds.",
        type: "transport",
      },
      {
        offset: 180,
        time: "+3h",
        label: "Night out in Atlanta",
        description: "Edgewood Ave for bars or Ponce City Market for food",
        type: "celebration",
        tip: "Atlanta has an incredible nightlife scene",
      },
    ],
  },

  "Hard Rock Stadium": {
    venue: "Hard Rock Stadium",
    city: "Miami",
    gateOpenTime: "2 hours before kickoff",
    transportFromCity:
      "Uber/Lyft from Miami Beach. No good public transit to the stadium.",
    transportTime: "30-40 min from Miami Beach by car",
    parkingTip:
      "Ride-share is the way. Surge pricing will be brutal - share rides.",
    steps: [
      {
        offset: -300,
        time: "-5h",
        label: "Hit the beach",
        description: "Start the day on South Beach - you're in Miami!",
        type: "activity",
        tip: "Stay hydrated. It's June in Miami - 35C+ and humid.",
      },
      {
        offset: -180,
        time: "-3h",
        label: "Uber to the stadium",
        description:
          "Book an Uber/Lyft to Hard Rock Stadium in Miami Gardens. Allow extra time.",
        type: "transport",
        tip: "No decent public transit option. Pre-schedule the ride or leave early.",
      },
      {
        offset: -120,
        time: "-2h",
        label: "Gates open",
        description: "Get inside early for shade and air con where available. Hydrate!",
        type: "activity",
        tip: "Bring a hat and sunscreen. The Miami sun is relentless.",
      },
      {
        offset: -60,
        time: "-1h",
        label: "FIFA Fan Zone",
        description: "Grab food and drinks, explore the entertainment area",
        type: "activity",
      },
      {
        offset: 0,
        time: "KICKOFF",
        label: "KICKOFF",
        description: "Match time! Stay hydrated!",
        type: "match",
        tip: "Drink water constantly. The humidity is real.",
      },
      {
        offset: 60,
        time: "+1h",
        label: "Full time",
        description: "Enjoy the post-match atmosphere, but the humidity is real",
        type: "celebration",
      },
      {
        offset: 120,
        time: "+2h",
        label: "Uber back to Miami",
        description: "Ride-share back to the city. Surge pricing is likely.",
        type: "transport",
        tip: "Share rides with other fans to split the surge cost",
      },
      {
        offset: 180,
        time: "+3h",
        label: "Celebrate on Ocean Drive",
        description:
          "Ocean Drive for vibes, Wynwood for something cooler, or Brickell for cocktails",
        type: "celebration",
        tip: "Wynwood has incredible street art and late-night bars",
      },
    ],
  },
};

/** Look up a match day plan by venue name. Returns undefined if no plan exists. */
export function getMatchDayPlan(venue: string): MatchDayPlan | undefined {
  return MATCH_DAY_PLANS[venue];
}
