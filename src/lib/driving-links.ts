// ============ DRIVING DIRECTIONS DEEP LINKS ============
// Static route data with Google Maps navigation links,
// toll info, and points of interest along each leg.

export type DrivingLeg = {
  from: string;
  to: string;
  miles: number;
  hours: number;
  minutes: number;
  googleMapsUrl: string;
  highlights: string[];
  tollInfo: string;
};

export const DRIVING_LEGS: DrivingLeg[] = [
  {
    from: "Boston",
    to: "New York",
    miles: 215,
    hours: 3,
    minutes: 50,
    googleMapsUrl:
      "https://www.google.com/maps/dir/Boston,+MA/New+York,+NY",
    highlights: [
      "Stop in New Haven for pizza (Frank Pepe's)",
      "I-95 scenic views through Connecticut",
    ],
    tollInfo: "I-90 (Mass Pike) + multiple CT tolls. Budget ~$15-20 in tolls.",
  },
  {
    from: "New York",
    to: "Philadelphia",
    miles: 97,
    hours: 1,
    minutes: 50,
    googleMapsUrl:
      "https://www.google.com/maps/dir/New+York,+NY/Philadelphia,+PA",
    highlights: [
      "Quick stop in Princeton for campus walk",
      "Grab a cheesesteak immediately on arrival",
    ],
    tollInfo:
      "NJ Turnpike tolls ~$5-10. E-ZPass recommended for faster lanes.",
  },
  {
    from: "Philadelphia",
    to: "Washington DC",
    miles: 140,
    hours: 2,
    minutes: 30,
    googleMapsUrl:
      "https://www.google.com/maps/dir/Philadelphia,+PA/Washington,+DC",
    highlights: [
      "Drive through Wilmington, DE — tax-free shopping",
      "Stop at the Chesapeake House rest area on I-95",
    ],
    tollInfo:
      "I-95 through Delaware + Maryland tolls. Budget ~$12-15 in tolls.",
  },
  {
    from: "Washington DC",
    to: "Nashville",
    miles: 670,
    hours: 9,
    minutes: 40,
    googleMapsUrl:
      "https://www.google.com/maps/dir/Washington,+DC/Nashville,+TN",
    highlights: [
      "Shenandoah Valley views on I-81 through Virginia",
      "BBQ pit stop in Bristol, TN/VA — birthplace of country music",
      "Knoxville halfway break — Market Square for coffee",
    ],
    tollInfo:
      "Mostly toll-free via I-81/I-40. Small VA tolls possible if using I-66 east.",
  },
  {
    from: "Nashville",
    to: "Miami",
    miles: 780,
    hours: 11,
    minutes: 30,
    googleMapsUrl:
      "https://www.google.com/maps/dir/Nashville,+TN/Miami,+FL",
    highlights: [
      "Chattanooga stop — Lookout Mountain views",
      "Atlanta halfway point — grab lunch at Ponce City Market",
      "Cross into Florida — first rest stop for orange juice",
    ],
    tollInfo:
      "Florida Turnpike tolls south of Orlando ~$15-20. SunPass or Toll-By-Plate available.",
  },
];
