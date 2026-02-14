// ============================================================================
// City Emergency & Quick Reference Data
// Real addresses, phone numbers, and transit info for all 6 cities
// ============================================================================

export type CityEmergencyInfo = {
  city: string;
  hospital: { name: string; address: string; phone: string };
  ukConsulate: { name: string; address: string; phone: string };
  police: { precinct: string; address: string; phone: string };
  transit: { app: string; tips: string[] };
  uber: string;
  keyAreas: { name: string; note: string }[];
  stadium: { name: string; address: string; nearestTransit: string };
};

export const CITY_EMERGENCY: Record<string, CityEmergencyInfo> = {
  Boston: {
    city: "Boston",
    hospital: {
      name: "Massachusetts General Hospital",
      address: "55 Fruit St, Boston, MA 02114",
      phone: "(617) 726-2000",
    },
    ukConsulate: {
      name: "British Consulate-General Boston",
      address: "One Broadway, Cambridge, MA 02142",
      phone: "(617) 245-4500",
    },
    police: {
      precinct: "Boston Police District A-1",
      address: "40 New Sudbury St, Boston, MA 02203",
      phone: "(617) 343-4240",
    },
    transit: {
      app: "MBTA (the T)",
      tips: [
        "Green Line to Kenmore for Fenway area",
        "Blue Line to Airport for Logan",
        "CharlieCard tap-to-pay or contactless",
        "Last train ~12:30 AM",
      ],
    },
    uber: "Uber/Lyft work everywhere. Pickup at Logan is at designated rideshare areas.",
    keyAreas: [
      { name: "Back Bay", note: "Newbury St shopping + restaurants" },
      { name: "North End", note: "Italian food, Mike's Pastry" },
      { name: "Fenway", note: "Near stadium, bars on Lansdowne St" },
      { name: "Seaport", note: "Newer area, waterfront dining" },
    ],
    stadium: {
      name: "Gillette Stadium",
      address: "1 Patriot Pl, Foxborough, MA 02035",
      nearestTransit: "No direct T service. Commuter rail from South Station on match days, or drive/Uber (35 min from downtown).",
    },
  },
  "New York": {
    city: "New York",
    hospital: {
      name: "NYU Langone Health",
      address: "550 First Ave, New York, NY 10016",
      phone: "(212) 263-7300",
    },
    ukConsulate: {
      name: "British Consulate-General New York",
      address: "885 Second Ave, New York, NY 10017",
      phone: "(212) 745-0200",
    },
    police: {
      precinct: "NYPD Midtown South",
      address: "357 W 35th St, New York, NY 10001",
      phone: "(212) 239-9811",
    },
    transit: {
      app: "NYC Subway (MTA)",
      tips: [
        "OMNY tap-to-pay with contactless card",
        "Express trains (2/3, 4/5, A/D) skip stops — check before boarding",
        "Runs 24/7 but late night can be slow",
        "NJ Transit to MetLife Stadium on match days",
      ],
    },
    uber: "Uber/Lyft everywhere but can be slow in Manhattan. Yellow cabs are often faster for short trips.",
    keyAreas: [
      { name: "Times Square", note: "Touristy but iconic, fan zone likely here" },
      { name: "Lower East Side", note: "Bars, nightlife, cheaper eats" },
      { name: "Williamsburg", note: "Brooklyn hipster area, great food" },
      { name: "Midtown", note: "Hotels, MSG area, Penn Station" },
    ],
    stadium: {
      name: "MetLife Stadium",
      address: "1 MetLife Stadium Dr, East Rutherford, NJ 07073",
      nearestTransit: "NJ Transit train from Penn Station to Meadowlands (special match day service). Bus 160/165 from Port Authority.",
    },
  },
  Philadelphia: {
    city: "Philadelphia",
    hospital: {
      name: "Thomas Jefferson University Hospital",
      address: "111 S 11th St, Philadelphia, PA 19107",
      phone: "(215) 955-6000",
    },
    ukConsulate: {
      name: "British Honorary Consulate Philadelphia",
      address: "414 Walnut St, Suite 1230, Philadelphia, PA 19106",
      phone: "(215) 625-0560",
    },
    police: {
      precinct: "Philadelphia Police 6th District",
      address: "235 N Broad St, Philadelphia, PA 19107",
      phone: "(215) 686-3060",
    },
    transit: {
      app: "SEPTA",
      tips: [
        "Broad Street Line (subway) runs north-south",
        "SEPTA Key card or contactless payment",
        "Broad Street Line direct to stadium (NRG station)",
        "Regional Rail to 30th Street from airport",
      ],
    },
    uber: "Uber/Lyft reliable. Philly is walkable in Center City — most things within 20 min walk.",
    keyAreas: [
      { name: "Old City", note: "Historic area, Liberty Bell, good bars" },
      { name: "Rittenhouse", note: "Upscale dining, nice park" },
      { name: "Fishtown", note: "Trendy, craft beer, nightlife" },
      { name: "South Philly", note: "Cheesesteaks (Pat's vs Geno's), Italian Market" },
    ],
    stadium: {
      name: "Lincoln Financial Field",
      address: "1 Lincoln Financial Field Way, Philadelphia, PA 19148",
      nearestTransit: "Broad Street Line to NRG Station. Direct subway from Center City, 15 min ride.",
    },
  },
  "Washington DC": {
    city: "Washington DC",
    hospital: {
      name: "George Washington University Hospital",
      address: "900 23rd St NW, Washington, DC 20037",
      phone: "(202) 715-4000",
    },
    ukConsulate: {
      name: "British Embassy Washington",
      address: "3100 Massachusetts Ave NW, Washington, DC 20008",
      phone: "(202) 588-6500",
    },
    police: {
      precinct: "DC Metropolitan Police 2nd District",
      address: "3320 Idaho Ave NW, Washington, DC 20016",
      phone: "(202) 715-7300",
    },
    transit: {
      app: "DC Metro (WMATA)",
      tips: [
        "SmarTrip card or contactless tap-to-pay",
        "Fares vary by distance + time of day (peak is pricier)",
        "Closes ~11:30 PM weeknights, 1 AM weekends",
        "Stand right, walk left on escalators (locals are serious about this)",
      ],
    },
    uber: "Uber/Lyft work well. Watch out for restricted zones near the Mall and government buildings.",
    keyAreas: [
      { name: "Georgetown", note: "Bars, restaurants, waterfront" },
      { name: "Dupont Circle", note: "Nightlife, Embassy Row nearby" },
      { name: "Adams Morgan", note: "Late-night food, dive bars" },
      { name: "The Mall", note: "Free museums (Smithsonian), monuments" },
    ],
    stadium: {
      name: "No WC venue in DC",
      address: "Nearest: Lincoln Financial Field (Philly) or MetLife (NYC)",
      nearestTransit: "Amtrak/MARC to Philly or NYC for match days.",
    },
  },
  Nashville: {
    city: "Nashville",
    hospital: {
      name: "Vanderbilt University Medical Center",
      address: "1211 Medical Center Dr, Nashville, TN 37232",
      phone: "(615) 322-5000",
    },
    ukConsulate: {
      name: "British Honorary Consulate Nashville",
      address: "211 Commerce St, Suite 100, Nashville, TN 37201",
      phone: "(615) 577-2575",
    },
    police: {
      precinct: "Metro Nashville Police Central Precinct",
      address: "601 Korean Veterans Blvd, Nashville, TN 37203",
      phone: "(615) 862-8600",
    },
    transit: {
      app: "WeGo Public Transit",
      tips: [
        "Nashville is a car city — transit is limited",
        "Broadway is walkable from most downtown hotels",
        "Pedal taverns and party buses are everywhere (skip them)",
        "Electric scooters available downtown",
      ],
    },
    uber: "Uber/Lyft are the main way to get around. Short rides from downtown to Midtown/East Nashville ~$8-12.",
    keyAreas: [
      { name: "Broadway", note: "Honky tonks, live music, tourist central" },
      { name: "East Nashville", note: "Hip restaurants, craft cocktails" },
      { name: "Midtown/Music Row", note: "Bars, college crowd" },
      { name: "The Gulch", note: "Trendy restaurants, Instagram walls" },
    ],
    stadium: {
      name: "No WC venue in Nashville",
      address: "Nashville is a road trip stop between DC and Miami",
      nearestTransit: "Drive or fly to Atlanta (Mercedes-Benz Stadium) for nearest WC venue.",
    },
  },
  Miami: {
    city: "Miami",
    hospital: {
      name: "Jackson Memorial Hospital",
      address: "1611 NW 12th Ave, Miami, FL 33136",
      phone: "(305) 585-1111",
    },
    ukConsulate: {
      name: "British Consulate-General Miami",
      address: "1001 Brickell Bay Dr, Suite 2800, Miami, FL 33131",
      phone: "(305) 400-6400",
    },
    police: {
      precinct: "Miami Beach Police Department",
      address: "1100 Washington Ave, Miami Beach, FL 33139",
      phone: "(305) 673-7900",
    },
    transit: {
      app: "Miami-Dade Transit (Metrorail + Metrobus)",
      tips: [
        "Metrorail has limited coverage — mostly north-south",
        "Free Metromover loops through downtown/Brickell",
        "South Beach to downtown is a bus or Uber (~$15)",
        "Traffic is brutal — allow extra time everywhere",
      ],
    },
    uber: "Uber/Lyft essential in Miami. Airport to South Beach ~$25-35. Allow 45+ min in traffic.",
    keyAreas: [
      { name: "South Beach", note: "Ocean Drive, Art Deco, nightlife" },
      { name: "Wynwood", note: "Street art, breweries, trendy" },
      { name: "Brickell", note: "Downtown high-rises, upscale bars" },
      { name: "Little Havana", note: "Cuban food, Calle Ocho, Domino Park" },
    ],
    stadium: {
      name: "Hard Rock Stadium",
      address: "347 Don Shula Dr, Miami Gardens, FL 33056",
      nearestTransit: "No rail service. Special match day buses from downtown. Uber/Lyft or drive (~30 min from South Beach). Parking $40+.",
    },
  },
};

export const EMERGENCY_CITIES = Object.keys(CITY_EMERGENCY);
