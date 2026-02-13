// ============================================================================
// Route Pit Stops & Leg Details
// Comprehensive driving data for the Nashville Route:
// Boston -> New York -> Philadelphia -> Washington DC -> Nashville -> Miami
// ============================================================================

export type PitStop = {
  name: string;
  type: "rest_area" | "gas" | "food" | "scenic" | "attraction" | "coffee";
  location: string;
  milesFromStart: number;
  description: string;
  tip?: string;
};

export type OvernightOption = {
  city: string;
  state: string;
  milesFromStart: number;
  milesRemaining: number;
  description: string;
  hotelSuggestion: string;
  nearbyFood: string;
};

export type LegDetail = {
  from: string;
  to: string;
  miles: number;
  hours: number;
  minutes: number;
  highways: string[];
  tollEstimate: string;
  scenicRating: 1 | 2 | 3 | 4 | 5;
  terrain: string;
  bestTimeToDepart: string;
  pitStops: PitStop[];
  overnightOptions?: OvernightOption[];
  drivingTips: string[];
};

export const LEG_DETAILS: LegDetail[] = [
  // ── Leg 1: Boston -> New York ────────────────────────────────────────
  {
    from: "Boston",
    to: "New York",
    miles: 215,
    hours: 3,
    minutes: 45,
    highways: ["I-90 W", "I-84 W", "I-684 S", "I-287 W", "I-95 S"],
    tollEstimate: "$15-20",
    scenicRating: 2,
    terrain: "Urban interstate through Connecticut suburbs",
    bestTimeToDepart:
      "8am \u2014 miss Boston rush hour, arrive NYC before lunch",
    pitStops: [
      {
        name: "Natick Service Plaza",
        type: "rest_area",
        location: "Natick, MA",
        milesFromStart: 20,
        description:
          "Full-service Mass Turnpike rest area with Starbucks, McDonald\u2019s, and clean facilities.",
        tip: "Top up on fuel here \u2014 prices climb once you hit Connecticut.",
      },
      {
        name: "Rein\u2019s Deli",
        type: "food",
        location: "Vernon, CT",
        milesFromStart: 90,
        description:
          "Legendary Jewish deli right off I-84. Massive sandwiches, matzo ball soup, and proper pickles.",
        tip: "The pastrami on rye is the move. Get extra pickles.",
      },
      {
        name: "Connecticut Service Area",
        type: "rest_area",
        location: "Milford, CT",
        milesFromStart: 130,
        description:
          "Standard I-95 highway rest stop. Fuel, toilets, and a few fast food options.",
      },
      {
        name: "Stew Leonard\u2019s",
        type: "food",
        location: "Norwalk, CT",
        milesFromStart: 165,
        description:
          "Famous grocery store/experience just off I-95. Fresh baked goods, samples, and animatronic farm animals.",
        tip: "Quick snack stop \u2014 grab trail mix and drinks for the road.",
      },
    ],
    drivingTips: [
      "I-95 through Connecticut is a parking lot on Fridays. Take I-84 through Hartford instead.",
      "The I-84 route via Hartford adds 15 minutes on paper but saves 45 in reality during peak times.",
      "Approaching NYC: take I-287 to the Tappan Zee Bridge if heading to Manhattan from the west side. The GW Bridge via I-95 is always gridlocked.",
      "Keep E-ZPass loaded \u2014 you\u2019ll hit 3-4 toll points on this leg.",
    ],
  },

  // ── Leg 2: New York -> Philadelphia ──────────────────────────────────
  {
    from: "New York",
    to: "Philadelphia",
    miles: 95,
    hours: 1,
    minutes: 50,
    highways: ["I-95 S", "NJ Turnpike"],
    tollEstimate: "$10-15",
    scenicRating: 1,
    terrain: "Flat NJ Turnpike \u2014 industrial but fast",
    bestTimeToDepart: "After morning traffic clears, 10am",
    pitStops: [
      {
        name: "Molly Pitcher Service Area",
        type: "rest_area",
        location: "Cranbury, NJ",
        milesFromStart: 45,
        description:
          "Classic NJ Turnpike rest stop named after a Revolutionary War heroine. Roy Rogers, Starbucks, restrooms.",
        tip: "The NJ Turnpike rest areas are all named after famous New Jerseyans. This one has the best food court.",
      },
      {
        name: "Wawa",
        type: "food",
        location: "Various, NJ",
        milesFromStart: 70,
        description:
          "Wawa is the East Coast Greggs. Made-to-order hoagies, decent coffee, and a cult following.",
        tip: "Get a classic Italian hoagie. You\u2019ll understand the hype. This is a religion in the Philadelphia area.",
      },
    ],
    drivingTips: [
      "The NJ Turnpike is boring but fast. Don\u2019t take local roads thinking it\u2019ll be better.",
      "Stay in the \u201ccars only\u201d lanes (left side) \u2014 the truck lanes on the right are slower and rougher.",
      "This is the shortest leg of the trip. Use it to decompress after NYC chaos.",
    ],
  },

  // ── Leg 3: Philadelphia -> Washington DC ─────────────────────────────
  {
    from: "Philadelphia",
    to: "Washington DC",
    miles: 140,
    hours: 2,
    minutes: 30,
    highways: ["I-95 S", "I-495"],
    tollEstimate: "$8-12",
    scenicRating: 2,
    terrain:
      "Flat coastal plain, crosses the Susquehanna River and Chesapeake Bay area",
    bestTimeToDepart:
      "Avoid DC rush hour \u2014 arrive before 3pm or after 7pm",
    pitStops: [
      {
        name: "Cracker Barrel",
        type: "food",
        location: "Perryville, MD",
        milesFromStart: 65,
        description:
          "Pure Americana: rocking chairs on the porch, biscuits and gravy, and a gift shop with questionable merchandise.",
        tip: "If you\u2019ve never been to a Cracker Barrel, this is a mandatory cultural experience. Order the pancakes.",
      },
      {
        name: "Maryland House",
        type: "rest_area",
        location: "Aberdeen, MD",
        milesFromStart: 70,
        description:
          "Large I-95 travel plaza right on the highway. Recently renovated with Popeyes, Panda Express, and Shake Shack.",
        tip: "This is one of the best rest stops on I-95. Worth timing your stop for.",
      },
      {
        name: "Susquehanna River Crossing",
        type: "scenic",
        location: "Havre de Grace, MD",
        milesFromStart: 75,
        description:
          "The I-95 bridge over the Susquehanna River offers a brief but beautiful view. Havre de Grace below is a charming Chesapeake town.",
      },
    ],
    drivingTips: [
      "The approach to DC on I-95 is brutal during rush hour. Time it right.",
      "Do NOT exit for Baltimore unless you want to add 45 minutes. The I-95 bypass around Baltimore is the way.",
      "I-95 express toll lanes through Maryland can save 15-20 minutes during peak hours \u2014 worth the $4-8.",
      "Delaware is so small you\u2019ll blink and miss it. There\u2019s a toll booth though, so don\u2019t blink too hard.",
    ],
  },

  // ── Leg 4: Washington DC -> Nashville ────────────────────────────────
  {
    from: "Washington DC",
    to: "Nashville",
    miles: 670,
    hours: 9,
    minutes: 40,
    highways: ["I-66 W", "I-81 S", "I-40 W"],
    tollEstimate: "$5",
    scenicRating: 4,
    terrain: "Stunning mountain driving through Virginia and Tennessee",
    bestTimeToDepart:
      "5-6am to arrive by dinner, or split across 2 days to enjoy the scenery",
    pitStops: [
      {
        name: "Sheetz",
        type: "gas",
        location: "Front Royal, VA",
        milesFromStart: 70,
        description:
          "Made-to-order food, cheap fuel, and the gateway to Shenandoah National Park. Think motorway services but actually good.",
        tip: "The touchscreen MTO menu is weirdly extensive. Get the loaded fries.",
      },
      {
        name: "Shenandoah Valley Overlook",
        type: "scenic",
        location: "Off I-81, VA",
        milesFromStart: 120,
        description:
          "Multiple pulloffs along I-81 with jaw-dropping views of the Shenandoah Valley. The Blue Ridge Mountains stretch to the horizon.",
        tip: "Pull over. Take the photo. This is the most beautiful stretch of road on the entire trip.",
      },
      {
        name: "Staunton, VA",
        type: "food",
        location: "Staunton, VA",
        milesFromStart: 150,
        description:
          "Charming small town in the heart of the Shenandoah Valley. Victorian architecture, craft breweries, and the Blackfriars Playhouse (world\u2019s only re-creation of Shakespeare\u2019s original theatre).",
        tip: "Great lunch stop. Try Byers Street Bistro or The Split Banana for something quick.",
      },
      {
        name: "Cracker Barrel",
        type: "food",
        location: "Wytheville, VA",
        milesFromStart: 300,
        description:
          "Halfway point of the DC-Nashville haul. Good place to stretch, eat, and reconsider your life choices about driving 670 miles.",
        tip: "Wytheville is at the junction of I-81 and I-77. Don\u2019t accidentally get on I-77 south \u2014 that goes to Charlotte.",
      },
      {
        name: "Bristol, VA/TN",
        type: "attraction",
        location: "Bristol, VA/TN",
        milesFromStart: 330,
        description:
          "You\u2019ve crossed into Tennessee! The state line literally runs down the middle of State Street. One side Virginia, one side Tennessee. The birthplace of country music.",
        tip: "Quick photo at the state line sign, then press on. Nashville awaits.",
      },
      {
        name: "Knoxville, TN",
        type: "food",
        location: "Knoxville, TN",
        milesFromStart: 460,
        description:
          "University of Tennessee college town. Good food scene, craft beer, and Market Square is worth a walk if you\u2019re splitting the drive.",
        tip: "If splitting the drive, Knoxville is the ideal overnight. Makes Nashville a relaxed 3-hour morning drive.",
      },
      {
        name: "Buc-ee\u2019s",
        type: "attraction",
        location: "Crossville, TN",
        milesFromStart: 500,
        description:
          "The most American thing you will ever see. 120 gas pumps. Immaculate toilets. A wall of beef jerky. Beaver nuggets. Fudge counter. It\u2019s a petrol station the size of a Tesco Extra.",
        tip: "This is a mandatory stop. Budget 30 minutes. Buy beaver nuggets. You\u2019re welcome.",
      },
      {
        name: "Cookeville, TN",
        type: "gas",
        location: "Cookeville, TN",
        milesFromStart: 540,
        description:
          "Last major town before Nashville. Tennessee Tech university town with plenty of fuel and fast food options.",
        tip: "Top up here \u2014 the final 130 miles to Nashville go quick on I-40.",
      },
    ],
    overnightOptions: [
      {
        city: "Staunton",
        state: "VA",
        milesFromStart: 150,
        milesRemaining: 520,
        description:
          "Charming Shenandoah Valley town with a walkable downtown, great restaurants, and proper B&Bs. A good choice if you want to explore the valley.",
        hotelSuggestion:
          "Stonewall Jackson Hotel & Conference Center \u2014 historic landmark hotel, walking distance to everything.",
        nearbyFood:
          "Zynodoa (upscale Southern), The Split Banana (casual), Byers Street Bistro (lunch).",
      },
      {
        city: "Roanoke",
        state: "VA",
        milesFromStart: 240,
        milesRemaining: 430,
        description:
          "Bigger city nestled in the Blue Ridge Mountains. The Roanoke Star on Mill Mountain is iconic. Solid food and beer scene.",
        hotelSuggestion:
          "Hotel Roanoke & Conference Center \u2014 Tudor-style grand hotel, a local institution since 1882.",
        nearbyFood:
          "Lucky (farm-to-table), The Roanoker (classic Southern breakfast), Big Lick Brewing.",
      },
      {
        city: "Knoxville",
        state: "TN",
        milesFromStart: 460,
        milesRemaining: 210,
        description:
          "Lively college town with a revitalized downtown. Makes the Nashville leg a cruisy 3-hour morning drive through Tennessee.",
        hotelSuggestion:
          "The Oliver Hotel \u2014 boutique spot in a converted 1876 bakery, right on Market Square.",
        nearbyFood:
          "Stock & Barrel (burgers), OliBea (brunch), Pretentious Beer Co. (craft beer).",
      },
    ],
    drivingTips: [
      "This is the most beautiful drive on the trip. I-81 through the Shenandoah Valley is stunning. Don\u2019t rush it.",
      "Buc-ee\u2019s is a mandatory stop. Trust us.",
      "Virginia has strict speed enforcement. Seriously \u2014 80mph in a 70 zone used to be a criminal offence. Don\u2019t speed.",
      "I-81 through Virginia has a lot of lorry traffic. Stay patient and use the passing lanes.",
      "The I-40 stretch through the Cumberland Plateau in Tennessee has some decent elevation changes. Beautiful in autumn.",
      "If you split the drive, consider taking a detour onto Skyline Drive or the Blue Ridge Parkway for a few miles. Extraordinary scenery.",
    ],
  },

  // ── Leg 5: Nashville -> Miami ────────────────────────────────────────
  {
    from: "Nashville",
    to: "Miami",
    miles: 780,
    hours: 11,
    minutes: 30,
    highways: [
      "I-24 E",
      "I-75 S",
      "I-10 E",
      "Florida Turnpike",
      "I-95 S",
    ],
    tollEstimate: "$15-20",
    scenicRating: 3,
    terrain:
      "Rolling Tennessee hills \u2192 flat Georgia farmland \u2192 tropical Florida",
    bestTimeToDepart:
      "5am if driving straight, or split at Atlanta or Jacksonville",
    pitStops: [
      {
        name: "Buc-ee\u2019s",
        type: "attraction",
        location: "Manchester, TN",
        milesFromStart: 70,
        description:
          "Yes, another Buc-ee\u2019s. If you missed the Crossville one, this is your redemption. Same glorious madness.",
        tip: "Beaver nuggets for the road. Stock up \u2014 it\u2019s a long way to the next one.",
      },
      {
        name: "Chattanooga, TN",
        type: "attraction",
        location: "Chattanooga, TN",
        milesFromStart: 130,
        description:
          "Beautiful riverfront city at the base of Lookout Mountain. The Tennessee Aquarium is world-class. The Walnut Street Bridge is a stunning pedestrian crossing.",
        tip: "Worth a proper stop if time allows. Lookout Mountain has views across seven states on a clear day.",
      },
      {
        name: "The Varsity",
        type: "food",
        location: "Atlanta, GA",
        milesFromStart: 250,
        description:
          "The world\u2019s largest drive-in restaurant, serving Atlanta since 1928. Chili dogs, onion rings, and frosted orange drinks. Pure Americana.",
        tip: "When they shout \u201cWhat\u2019ll ya have?\u201d \u2014 have your order ready. They don\u2019t wait.",
      },
      {
        name: "Macon, GA",
        type: "gas",
        location: "Macon, GA",
        milesFromStart: 340,
        description:
          "Peach country and the birthplace of Otis Redding and Little Richard. Good fuel stop with plenty of options right off I-75.",
      },
      {
        name: "Tifton, GA",
        type: "gas",
        location: "Tifton, GA",
        milesFromStart: 410,
        description:
          "Nothing here but you need fuel. The Georgia Museum of Agriculture is nearby if you\u2019re really stretching your legs.",
        tip: "Fill up. Valdosta is the last Georgia town, then it\u2019s Florida.",
      },
      {
        name: "Valdosta, GA",
        type: "gas",
        location: "Valdosta, GA",
        milesFromStart: 450,
        description:
          "Last Georgia town before the Florida border. Home of Valdosta State University and an unreasonable number of fast food restaurants.",
        tip: "Cross the Florida line and the landscape changes almost immediately. Palms incoming.",
      },
      {
        name: "Gainesville, FL",
        type: "food",
        location: "Gainesville, FL",
        milesFromStart: 520,
        description:
          "University of Florida town. Home of the Gators. Decent food options along the main strip and near campus.",
        tip: "Good lunch stop if you started early. The Satchel\u2019s Pizza is legendary if you have time.",
      },
      {
        name: "Ocala, FL",
        type: "scenic",
        location: "Ocala, FL",
        milesFromStart: 570,
        description:
          "Horse country Florida. Rolling green pastures and white-fenced farms. Not what you picture when you think \u201cFlorida.\u201d",
      },
      {
        name: "Buc-ee\u2019s",
        type: "attraction",
        location: "Daytona Beach area, FL",
        milesFromStart: 620,
        description:
          "One more Buc-ee\u2019s on I-95 near Daytona. By now you\u2019re either addicted to beaver nuggets or deeply concerned about American consumer culture. Probably both.",
      },
      {
        name: "Fort Lauderdale, FL",
        type: "scenic",
        location: "Fort Lauderdale, FL",
        milesFromStart: 740,
        description:
          "Almost there. Welcome to South Florida. Palm trees, warm air, and the Atlantic Ocean. You can smell the sunscreen.",
        tip: "The last 40 miles from Fort Lauderdale to Miami feel longer than the first 9 hours. South Florida traffic is relentless.",
      },
    ],
    overnightOptions: [
      {
        city: "Chattanooga",
        state: "TN",
        milesFromStart: 130,
        milesRemaining: 650,
        description:
          "Beautiful riverfront city with a great food scene. The Southside district is walkable with breweries and restaurants.",
        hotelSuggestion:
          "The Crash Pad \u2014 boutique hostel/hotel in a converted train station. Cool vibe. Or Kinley Chattanooga for something more upscale.",
        nearbyFood:
          "Scenic City Brewing (beers), Champy\u2019s Chicken (legendary fried chicken), Clumpies Ice Cream.",
      },
      {
        city: "Atlanta",
        state: "GA",
        milesFromStart: 250,
        milesRemaining: 530,
        description:
          "Proper big city stop. The BeltLine trail is brilliant for a walk. Ponce City Market is a food hall in a converted Sears building.",
        hotelSuggestion:
          "Hotel Clermont \u2014 hipster-chic boutique hotel on the BeltLine with a rooftop bar and a famously weird basement lounge.",
        nearbyFood:
          "Ponce City Market (food hall), Fox Bros Bar-B-Q (Texas-style BBQ in Georgia), Monday Night Brewing.",
      },
      {
        city: "Jacksonville",
        state: "FL",
        milesFromStart: 480,
        milesRemaining: 300,
        description:
          "Beach city with reasonable hotels. Jacksonville Beach is solid. Makes Miami a 4.5-hour morning drive.",
        hotelSuggestion:
          "Casa Marina Hotel \u2014 right on Jacksonville Beach. Sleep with the windows open and hear the Atlantic.",
        nearbyFood:
          "Angie\u2019s Subs (massive portions), Intuition Ale Works (craft beer), TacoLu (best fish tacos in town).",
      },
    ],
    drivingTips: [
      "Georgia is flat and boring. Podcasts are essential. This is where you work through the backlog.",
      "Florida Turnpike is faster than I-95 through central Florida. It\u2019s a toll road, but worth every penny.",
      "The last 2 hours in South Florida feel longer than the first 9. The traffic is genuinely awful.",
      "Atlanta traffic is notoriously bad. If stopping, time your departure to avoid I-285 during rush hour (before 6am or after 8pm).",
      "Florida rest stops are clean and well-maintained. The state actually funds them properly.",
      "Keep hydrated in Florida. The humidity hits different once you\u2019re south of Orlando.",
    ],
  },
];
