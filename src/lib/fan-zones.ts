export type FanZone = {
  name: string;
  city: string;
  address: string;
  description: string;
  capacity: string;
  hours: string;
  features: string[];
  mapsUrl: string;
};

export const FAN_ZONES: FanZone[] = [
  // Boston
  {
    name: "Boston Common FIFA Fan Fest",
    city: "Boston",
    address: "Boston Common, Boston, MA",
    description:
      "Main fan zone in Boston's iconic park with massive screens and live entertainment",
    capacity: "15,000+",
    hours: "11am - 11pm on match days",
    features: [
      "Giant screens",
      "Live music",
      "Food trucks",
      "Beer garden",
      "Face painting",
    ],
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Boston+Common",
  },
  {
    name: "Faneuil Hall Fan Zone",
    city: "Boston",
    address: "Faneuil Hall Marketplace, Boston, MA",
    description: "Historic marketplace turned World Cup viewing party",
    capacity: "5,000",
    hours: "10am - midnight",
    features: ["Outdoor screens", "Bars", "Restaurants", "Shopping"],
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Faneuil+Hall+Boston",
  },
  // NYC
  {
    name: "Times Square FIFA Fan Fest",
    city: "New York",
    address: "Times Square, New York, NY",
    description:
      "The ultimate World Cup atmosphere in the heart of Manhattan",
    capacity: "25,000+",
    hours: "10am - midnight",
    features: [
      "Giant screens",
      "DJ sets",
      "International food",
      "Beer garden",
      "Merchandise",
    ],
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Times+Square+NYC",
  },
  {
    name: "Brooklyn Fan Zone",
    city: "New York",
    address: "Prospect Park, Brooklyn, NY",
    description: "Relaxed outdoor viewing in Brooklyn's beloved park",
    capacity: "10,000",
    hours: "11am - 10pm",
    features: ["Big screens", "Food vendors", "Family area", "Craft beer"],
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Prospect+Park+Brooklyn",
  },
  // Philadelphia
  {
    name: "Philly FIFA Fan Fest",
    city: "Philadelphia",
    address: "Eakins Oval, Philadelphia, PA",
    description:
      "Philadelphia's main fan zone on the Benjamin Franklin Parkway",
    capacity: "12,000",
    hours: "11am - 11pm",
    features: [
      "Giant screens",
      "Live music",
      "Philly cheesesteaks",
      "Beer tent",
    ],
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Eakins+Oval+Philadelphia",
  },
  // Washington DC
  {
    name: "National Mall Fan Zone",
    city: "Washington DC",
    address: "National Mall, Washington, DC",
    description:
      "Watch the World Cup with the Capitol as your backdrop",
    capacity: "20,000+",
    hours: "10am - 11pm",
    features: [
      "Giant screens",
      "International food village",
      "Live entertainment",
      "Kids zone",
    ],
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=National+Mall+Washington+DC",
  },
  // Nashville
  {
    name: "Broadway Fan Zone",
    city: "Nashville",
    address: "Lower Broadway, Nashville, TN",
    description:
      "Nashville's legendary honky-tonk strip turns into a World Cup party",
    capacity: "8,000",
    hours: "11am - 2am",
    features: ["Screens in bars", "Live country music", "BBQ", "Whiskey"],
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Lower+Broadway+Nashville",
  },
  // Miami
  {
    name: "Miami Beach FIFA Fan Fest",
    city: "Miami",
    address: "Lummus Park, Miami Beach, FL",
    description:
      "Beachside World Cup viewing with South Beach vibes",
    capacity: "20,000+",
    hours: "10am - midnight",
    features: [
      "Giant screens",
      "Beach volleyball",
      "Latin food",
      "DJ sets",
      "Cocktails",
    ],
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Lummus+Park+Miami+Beach",
  },
  {
    name: "Wynwood Fan Zone",
    city: "Miami",
    address: "Wynwood Art District, Miami, FL",
    description:
      "World Cup meets street art in Miami's hippest neighborhood",
    capacity: "8,000",
    hours: "11am - 11pm",
    features: [
      "Screens",
      "Street art tours",
      "Craft cocktails",
      "Food trucks",
    ],
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Wynwood+Art+District+Miami",
  },
];
