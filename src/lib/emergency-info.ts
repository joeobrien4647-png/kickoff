// ---------------------------------------------------------------------------
// Emergency information for each city on the road trip
// ---------------------------------------------------------------------------

export interface CityEmergency {
  city: string;
  state: string;
  emergencyNumber: string;
  localPolice: string;
  nearestHospital: { name: string; address: string; phone: string };
  urgentCare: { name: string; address: string; phone: string };
  ukConsulate: { name: string; address: string; phone: string; hours: string };
  localTips: string[];
}

export const EMERGENCY_INFO: CityEmergency[] = [
  {
    city: "Boston",
    state: "MA",
    emergencyNumber: "911",
    localPolice: "(617) 343-4911",
    nearestHospital: {
      name: "Massachusetts General Hospital",
      address: "55 Fruit St, Boston, MA 02114",
      phone: "(617) 726-2000",
    },
    urgentCare: {
      name: "Mass General Urgent Care - Charles River",
      address: "15 Parkman St, Boston, MA 02114",
      phone: "(617) 726-2000",
    },
    ukConsulate: {
      name: "British Consulate General Boston",
      address: "One Broadway, Cambridge, MA 02142",
      phone: "(617) 245-4500",
      hours: "Mon-Fri 9:00 AM - 5:00 PM",
    },
    localTips: [
      "The T (subway) stops running around 12:30 AM -- plan late-night transport via Uber/Lyft.",
      "Watch for aggressive drivers at rotaries (roundabouts) -- pedestrians should use crosswalks.",
      "Stay aware in the Common and Public Garden after dark; stick to well-lit paths.",
      "Boston tap water is excellent and safe to drink.",
    ],
  },
  {
    city: "New York",
    state: "NY",
    emergencyNumber: "911",
    localPolice: "(646) 610-5000",
    nearestHospital: {
      name: "NYU Langone Health - Tisch Hospital",
      address: "550 First Ave, New York, NY 10016",
      phone: "(212) 263-7300",
    },
    urgentCare: {
      name: "NYU Langone Urgent Care - Cobble Hill",
      address: "124 Court St, Brooklyn, NY 11201",
      phone: "(929) 455-2500",
    },
    ukConsulate: {
      name: "British Consulate General New York",
      address: "885 Second Ave, New York, NY 10017",
      phone: "(212) 745-0200",
      hours: "Mon-Fri 9:00 AM - 5:00 PM",
    },
    localTips: [
      "Avoid Times Square street hustlers -- keep walking if approached for CDs, photos, or petitions.",
      "The subway runs 24/7 but late-night service can be slow; use real-time apps like Transit or Citymapper.",
      "Keep bags zipped and in front of you on crowded trains.",
      "Yellow cabs and Uber are plentiful -- never accept rides from unlicensed drivers at airports.",
    ],
  },
  {
    city: "Philadelphia",
    state: "PA",
    emergencyNumber: "911",
    localPolice: "(215) 686-3093",
    nearestHospital: {
      name: "Penn Medicine - Hospital of the University of Pennsylvania",
      address: "3400 Spruce St, Philadelphia, PA 19104",
      phone: "(215) 662-4000",
    },
    urgentCare: {
      name: "Penn Medicine Urgent Care - University City",
      address: "3737 Market St, Philadelphia, PA 19104",
      phone: "(215) 662-9880",
    },
    ukConsulate: {
      name: "British Honorary Consulate Philadelphia",
      address: "200 S Broad St, Suite 600, Philadelphia, PA 19102",
      phone: "(215) 557-7655",
      hours: "By appointment only",
    },
    localTips: [
      "Center City and Old City are generally safe but stay aware in quieter blocks after dark.",
      "SEPTA transit can be unreliable late-night -- have a rideshare app as backup.",
      "Philly summers are hot and humid; carry water and wear sun protection on match days.",
      "Street parking is tight -- use garages or the ParkPhilly app for metered spots.",
    ],
  },
  {
    city: "Washington DC",
    state: "DC",
    emergencyNumber: "911",
    localPolice: "(202) 727-9099",
    nearestHospital: {
      name: "George Washington University Hospital",
      address: "900 23rd St NW, Washington, DC 20037",
      phone: "(202) 715-4000",
    },
    urgentCare: {
      name: "MedStar PromptCare - Capitol Hill",
      address: "650 Pennsylvania Ave SE, Washington, DC 20003",
      phone: "(202) 546-3700",
    },
    ukConsulate: {
      name: "British Embassy Washington",
      address: "3100 Massachusetts Ave NW, Washington, DC 20008",
      phone: "(202) 588-6500",
      hours: "Mon-Fri 9:00 AM - 5:00 PM",
    },
    localTips: [
      "The Metro is the easiest way to get around -- buy a SmarTrip card at any station.",
      "Stay hydrated in DC's summer heat; the National Mall has limited shade.",
      "Avoid SE quadrant after dark unless you know the specific area.",
      "All Smithsonian museums are free -- great for downtime between matches.",
    ],
  },
  {
    city: "Atlanta",
    state: "GA",
    emergencyNumber: "911",
    localPolice: "(404) 614-6544",
    nearestHospital: {
      name: "Emory University Hospital Midtown",
      address: "550 Peachtree St NE, Atlanta, GA 30308",
      phone: "(404) 686-4411",
    },
    urgentCare: {
      name: "Emory Urgent Care - Midtown",
      address: "550 Peachtree St NE, Atlanta, GA 30308",
      phone: "(404) 686-8995",
    },
    ukConsulate: {
      name: "British Honorary Consulate Atlanta",
      address: "133 Peachtree St NE, Suite 3400, Atlanta, GA 30303",
      phone: "(404) 954-7700",
      hours: "By appointment only",
    },
    localTips: [
      "Atlanta is very car-dependent -- MARTA rail covers key areas but rideshares fill the gaps.",
      "Summer heat is intense; plan for air-conditioned breaks and drink plenty of water.",
      "Stay in well-trafficked areas of Downtown and Midtown after dark.",
      "Peachtree Street has many variants (Peachtree Rd, Peachtree Ave, etc.) -- double-check addresses.",
    ],
  },
  {
    city: "Miami",
    state: "FL",
    emergencyNumber: "911",
    localPolice: "(305) 579-6111",
    nearestHospital: {
      name: "Jackson Memorial Hospital",
      address: "1611 NW 12th Ave, Miami, FL 33136",
      phone: "(305) 585-1111",
    },
    urgentCare: {
      name: "Baptist Health Urgent Care - Brickell",
      address: "1110 Brickell Ave, Suite 100, Miami, FL 33131",
      phone: "(786) 578-5710",
    },
    ukConsulate: {
      name: "British Consulate General Miami",
      address: "1001 Brickell Bay Dr, Suite 2800, Miami, FL 33131",
      phone: "(305) 400-6400",
      hours: "Mon-Fri 8:30 AM - 4:30 PM",
    },
    localTips: [
      "Miami sun is brutal -- SPF 50+, hat, and sunglasses are essential at outdoor matches.",
      "Keep valuables locked in hotel safes; car break-ins happen in tourist areas.",
      "Rip currents at South Beach can be dangerous -- swim near lifeguard stations only.",
      "Spanish is widely spoken -- knowing a few phrases can be genuinely helpful.",
    ],
  },
];

// ---------------------------------------------------------------------------
// General travel info for UK travelers in the US
// ---------------------------------------------------------------------------

export const GENERAL_INFO = {
  ukEmergencyAbroad: "+44 20 7008 5000",
  travelInsurance:
    "Keep policy number accessible at all times",
  importantDocs: [
    "Passport",
    "ESTA confirmation",
    "Travel insurance",
    "Driver's license (if renting)",
  ],
  usefulApps: ["Google Maps", "Uber/Lyft", "What3Words", "TripIt"],
};
