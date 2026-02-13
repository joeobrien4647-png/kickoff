// ============ HIGHWAY FOOD GUIDE & ROADSIDE ATTRACTIONS ============
// Best food stops and quirky roadside attractions along the
// Boston -> NYC -> Philly -> DC -> Nashville -> Miami route.
// Curated for 3 British lads experiencing America for the first time.

export type HighwayEat = {
  name: string;
  type:
    | "diner"
    | "bbq"
    | "fast_food"
    | "deli"
    | "bakery"
    | "drive_thru"
    | "roadside"
    | "chain";
  highway: string;
  nearCity: string;
  milesIntoLeg: number;
  leg: string;
  oneLiner: string;
  mustOrder: string;
  priceRange: "$" | "$$";
  britishNote?: string;
};

export type RoadsideAttraction = {
  name: string;
  type: "quirky" | "historic" | "natural" | "roadside_art" | "experience";
  highway: string;
  nearCity: string;
  milesIntoLeg: number;
  leg: string;
  description: string;
  timeNeeded: string;
  cost: "free" | "$" | "$$";
  whyStop: string;
};

// ── LEG LABELS (reusable constants) ────────────────────────────────
const LEG_1 = "Boston \u2192 NYC";
const LEG_2 = "NYC \u2192 Philly";
const LEG_3 = "Philly \u2192 DC";
const LEG_4 = "DC \u2192 Nashville";
const LEG_5 = "Nashville \u2192 Miami";

// ── HIGHWAY EATS ───────────────────────────────────────────────────
export const HIGHWAY_EATS: HighwayEat[] = [
  // ── Leg 1: Boston → NYC ──────────────────────────────────────────
  {
    name: "Rein's Deli",
    type: "deli",
    highway: "I-84 W",
    nearCity: "Vernon, CT",
    milesIntoLeg: 95,
    leg: LEG_1,
    oneLiner:
      "The best Jewish deli between Boston and NYC. Pastrami piled higher than your expectations.",
    mustOrder: "Pastrami on rye with a side of matzo ball soup",
    priceRange: "$$",
    britishNote:
      "Think of the best salt beef bagel in Brick Lane, then triple the portion size.",
  },
  {
    name: "Duchess Restaurant",
    type: "fast_food",
    highway: "I-95 S",
    nearCity: "Bridgeport, CT",
    milesIntoLeg: 155,
    leg: LEG_1,
    oneLiner:
      "Connecticut fast food chain. Better than it has any right to be.",
    mustOrder: "Big D burger and a chocolate shake",
    priceRange: "$",
    britishNote: "Like a Wimpy that never gave up and somehow got good.",
  },
  {
    name: "Super Duper Weenie",
    type: "roadside",
    highway: "I-95 S",
    nearCity: "Fairfield, CT",
    milesIntoLeg: 145,
    leg: LEG_1,
    oneLiner:
      "A hot dog stand that a James Beard chef built. Absurd name, serious food.",
    mustOrder: "New Englander dog with sauerkraut, bacon, mustard, and relish",
    priceRange: "$",
    britishNote:
      "Not a dodgy van outside a football ground. This is a proper restaurant shaped like a hot dog stand.",
  },

  // ── Leg 2: NYC → Philly ─────────────────────────────────────────
  {
    name: "White Manna",
    type: "diner",
    highway: "NJ-17 S",
    nearCity: "Hackensack, NJ",
    milesIntoLeg: 15,
    leg: LEG_2,
    oneLiner:
      "Sliders since 1946. Tiny griddle burgers. Cash only.",
    mustOrder: "6 sliders with cheese and grilled onions",
    priceRange: "$",
    britishNote:
      "Imagine a kebab shop that only does one thing and does it perfectly. That's White Manna.",
  },
  {
    name: "Wawa",
    type: "chain",
    highway: "NJ Turnpike",
    nearCity: "Everywhere in NJ",
    milesIntoLeg: 45,
    leg: LEG_2,
    oneLiner:
      "Like Greggs but American and open 24/7. Hoagies (filled rolls) are the move. MTO = Made To Order.",
    mustOrder: "Italian hoagie MTO or the Gobbler (Thanksgiving sandwich)",
    priceRange: "$",
    britishNote:
      "This is a petrol station. With a touchscreen sandwich builder. And it's genuinely great. America is mad.",
  },
  {
    name: "Tastykake Outlet",
    type: "bakery",
    highway: "I-95 S",
    nearCity: "Philadelphia, PA",
    milesIntoLeg: 85,
    leg: LEG_2,
    oneLiner:
      "Philadelphia's beloved snack cake since 1914. Butterscotch Krimpets are the icon.",
    mustOrder: "Butterscotch Krimpets and Kandy Kakes",
    priceRange: "$",
    britishNote:
      "Like Mr Kipling if he actually did make exceedingly good cakes. Proper nostalgic Philly snacks.",
  },

  // ── Leg 3: Philly → DC ──────────────────────────────────────────
  {
    name: "Cracker Barrel",
    type: "chain",
    highway: "I-95 S",
    nearCity: "Aberdeen, MD",
    milesIntoLeg: 55,
    leg: LEG_3,
    oneLiner:
      "Peak America: rocking chairs, biscuits and gravy, a gift shop full of stuff you don't need. It's like a theme park restaurant for country living.",
    mustOrder: "Chicken and dumplings with fried apples, or the country breakfast",
    priceRange: "$",
    britishNote:
      "Imagine a Little Chef merged with a National Trust gift shop, but genuinely charming. The peg game on the table will keep you busy.",
  },
  {
    name: "Royal Farms",
    type: "chain",
    highway: "I-95 S",
    nearCity: "Baltimore area, MD",
    milesIntoLeg: 70,
    leg: LEG_3,
    oneLiner:
      "Gas station chicken that has no business being this good. Maryland's answer to Nando's.",
    mustOrder: "8-piece fried chicken box or the Western fries",
    priceRange: "$",
    britishNote:
      "Yes, you're buying chicken from a petrol station. Trust the process. Marylanders are obsessed with it.",
  },
  {
    name: "Maryland House",
    type: "roadside",
    highway: "I-95 S",
    nearCity: "Aberdeen, MD",
    milesIntoLeg: 60,
    leg: LEG_3,
    oneLiner:
      "A proper motorway services that spans the highway. Popeyes, Shake Shack, and more under one roof.",
    mustOrder: "Popeyes spicy chicken sandwich",
    priceRange: "$",
    britishNote:
      "Like a Moto services but actually good. The building literally bridges the motorway.",
  },

  // ── Leg 4: DC → Nashville ────────────────────────────────────────
  {
    name: "The Homeplace",
    type: "roadside",
    highway: "I-81 S",
    nearCity: "Catawba, VA",
    milesIntoLeg: 200,
    leg: LEG_4,
    oneLiner:
      "Family-style Appalachian cooking. They bring the food to the table until you beg them to stop. All-you-can-eat for $16.",
    mustOrder: "Fried chicken, mashed potatoes, green beans, and cornbread",
    priceRange: "$",
    britishNote:
      "Like Sunday roast at your nan's house if your nan was from the Blue Ridge Mountains and had no concept of portion control.",
  },
  {
    name: "Waffle House",
    type: "chain",
    highway: "I-81 S / I-40 W",
    nearCity: "Everywhere south of Virginia",
    milesIntoLeg: 300,
    leg: LEG_4,
    oneLiner:
      "The most important restaurant in the American South. Open 24/7, 365. The hash browns are a religion: order them 'scattered, smothered, covered.' FEMA uses Waffle House closures to measure hurricane severity.",
    mustOrder:
      "All-Star Special: waffle, eggs, hash browns (scattered, smothered, covered), bacon, toast",
    priceRange: "$",
    britishNote:
      "This is the American greasy spoon. No menus needed. Just sit at the counter and watch the magic. It's open during hurricanes. Literally always open.",
  },
  {
    name: "Cracker Barrel",
    type: "chain",
    highway: "I-81 S",
    nearCity: "Wytheville, VA",
    milesIntoLeg: 280,
    leg: LEG_4,
    oneLiner:
      "Halfway point. You'll need the rocking chairs.",
    mustOrder: "Biscuits and gravy breakfast platter",
    priceRange: "$",
    britishNote:
      "Same chain, same rocking chairs, same vibes. By now you'll understand why Americans love it.",
  },
  {
    name: "Buc-ee's",
    type: "chain",
    highway: "I-40 W",
    nearCity: "Crossville, TN",
    milesIntoLeg: 530,
    leg: LEG_4,
    oneLiner:
      "Not a gas station. A cathedral to American road trip culture. 120 pumps, bathrooms cleaner than your hotel, brisket sandwich counter, beef jerky wall the size of a cinema screen. Budget 30 minutes minimum.",
    mustOrder: "Brisket sandwich from the counter, beaver nuggets (sweet corn puffs), and kolaches",
    priceRange: "$",
    britishNote:
      "Imagine the world's largest Tesco Extra but it only sells road trip snacks, BBQ, and beaver merchandise. You will leave with a bag full of things you didn't know you needed.",
  },
  {
    name: "Cookout",
    type: "drive_thru",
    highway: "I-81 S / I-40 W",
    nearCity: "Various, VA/TN",
    milesIntoLeg: 350,
    leg: LEG_4,
    oneLiner:
      "Drive-thru fast food. $5 gets you a burger, two sides, and a drink. The milkshakes have 40+ flavors.",
    mustOrder: "Cookout tray: Big Double burger, corn dog and hush puppies as sides, Cheerwine float",
    priceRange: "$",
    britishNote:
      "Under a fiver for a full meal. The sides include a corn dog. You can get a quesadilla as a side dish. America, mate.",
  },
  {
    name: "Shoney's",
    type: "chain",
    highway: "I-40 W",
    nearCity: "Knoxville, TN",
    milesIntoLeg: 450,
    leg: LEG_4,
    oneLiner:
      "Southern diner chain with an all-you-can-eat breakfast bar. A dying breed of American restaurant worth experiencing.",
    mustOrder: "The breakfast bar \u2014 biscuits, gravy, scrambled eggs, and their strawberry pie",
    priceRange: "$",
    britishNote:
      "Like a Harvester but more Southern. The breakfast bar is a pilgrimage.",
  },

  // ── Leg 5: Nashville → Miami ─────────────────────────────────────
  {
    name: "The Varsity",
    type: "fast_food",
    highway: "I-75 S",
    nearCity: "Atlanta, GA",
    milesIntoLeg: 250,
    leg: LEG_5,
    oneLiner:
      "The world's largest drive-in restaurant. 'What'll ya have?' is the catchphrase. Chili dogs and onion rings.",
    mustOrder: "Two chili dogs, onion rings, and a frosted orange",
    priceRange: "$",
    britishNote:
      "Like a chippy the size of a football pitch. They serve 2 miles of hot dogs a day. Just go with it.",
  },
  {
    name: "Buc-ee's",
    type: "chain",
    highway: "I-75 S",
    nearCity: "Warner Robins, GA / Daytona, FL",
    milesIntoLeg: 350,
    leg: LEG_5,
    oneLiner:
      "Yes, you'll stop at every single one.",
    mustOrder: "Different jerky flavors this time. And the fudge.",
    priceRange: "$",
    britishNote:
      "You've been here before. You'll go again. The beaver calls to you now.",
  },
  {
    name: "Publix",
    type: "chain",
    highway: "I-75 S / I-95 S",
    nearCity: "Throughout Florida",
    milesIntoLeg: 600,
    leg: LEG_5,
    oneLiner:
      "The Florida grocery store. Their Pub Subs (deli sandwiches) are legendary. Chicken tender sub is the GOAT.",
    mustOrder: "Chicken tender sub with buffalo sauce, or the Ultimate sub",
    priceRange: "$",
    britishNote:
      "A Tesco meal deal but from a deli counter where they make it fresh. Floridians are genuinely passionate about their Publix subs.",
  },
  {
    name: "Stuckey's",
    type: "roadside",
    highway: "I-75 S / I-95 S",
    nearCity: "Various, GA/FL",
    milesIntoLeg: 400,
    leg: LEG_5,
    oneLiner:
      "Retro pecan candy shops along Southern highways since the 1930s. Log rolls and pecan divinity.",
    mustOrder: "Pecan log roll and a bag of praline pecans",
    priceRange: "$",
    britishNote:
      "Like finding a 1950s sweet shop on the M1. Pure nostalgia even if you've never been before.",
  },
  {
    name: "Whataburger",
    type: "fast_food",
    highway: "I-75 S / I-10",
    nearCity: "North Florida",
    milesIntoLeg: 500,
    leg: LEG_5,
    oneLiner:
      "Texas-born burger chain that the South worships. The honey butter chicken biscuit is a religious experience.",
    mustOrder: "Honey butter chicken biscuit (breakfast) or the Patty Melt",
    priceRange: "$",
    britishNote:
      "It's like discovering that Five Guys has a cooler older brother who lives in the South.",
  },
  {
    name: "Café Risqué",
    type: "roadside",
    highway: "I-75 S",
    nearCity: "Micanopy, FL",
    milesIntoLeg: 520,
    leg: LEG_5,
    oneLiner:
      "You'll see the billboards for 100 miles. Florida's most famous roadside billboard campaign. Terrible coffee. The billboards ARE the attraction.",
    mustOrder: "Just take a photo of the signs and keep driving",
    priceRange: "$",
    britishNote:
      "Imagine if Ann Summers had a motorway café. The billboards are relentless. Welcome to Florida.",
  },
];

// ── ROADSIDE ATTRACTIONS ───────────────────────────────────────────
export const ROADSIDE_ATTRACTIONS: RoadsideAttraction[] = [
  {
    name: "South of the Border",
    type: "quirky",
    highway: "I-95 S",
    nearCity: "Dillon, SC",
    milesIntoLeg: 380,
    leg: LEG_5,
    description:
      "200-foot sombrero tower visible for miles. A gloriously tacky Mexican-themed roadside stop with 100+ billboards leading up to it. It's terrible and perfect.",
    timeNeeded: "30 min \u2013 1 hour",
    cost: "$",
    whyStop:
      "You'll see billboards for it starting 200 miles away. 'Pedro says...' By the time you arrive, you HAVE to stop. It's the law of American road trips.",
  },
  {
    name: "Buc-ee's Experience",
    type: "experience",
    highway: "I-40 W",
    nearCity: "Crossville, TN",
    milesIntoLeg: 530,
    leg: LEG_4,
    description:
      "Already mentioned in eats but deserves its own attraction category. The beaver mascot merch alone is worth the stop. Wall of jerky. Wall of fudge. Wall of everything.",
    timeNeeded: "30 \u2013 45 min",
    cost: "$",
    whyStop:
      "The most aggressively branded gas station on Earth. You'll buy a Buc-ee's t-shirt. Everyone does.",
  },
  {
    name: "World's Largest Cedar Bucket",
    type: "quirky",
    highway: "I-24 / US-41",
    nearCity: "Murfreesboro, TN",
    milesIntoLeg: 200,
    leg: LEG_5,
    description:
      "It's exactly what it says. A massive cedar bucket. America loves 'world's largest' everything and this is a perfect example.",
    timeNeeded: "5 \u2013 10 min",
    cost: "free",
    whyStop:
      "It takes 30 seconds to see. But you can say you saw the World's Largest Cedar Bucket. That's the whole point.",
  },
  {
    name: "Natural Bridge",
    type: "natural",
    highway: "Near I-81 S",
    nearCity: "Natural Bridge, VA",
    milesIntoLeg: 230,
    leg: LEG_4,
    description:
      "A 215-foot natural rock arch that Thomas Jefferson once owned. Genuinely impressive geological formation in the Shenandoah Valley.",
    timeNeeded: "1 \u2013 2 hours",
    cost: "$$",
    whyStop:
      "Thomas Jefferson bought this from King George III. A Founding Father flexing with a natural wonder. It's properly stunning.",
  },
  {
    name: "Gatlinburg",
    type: "experience",
    highway: "Near I-40 (exit to US-66/441)",
    nearCity: "Knoxville, TN",
    milesIntoLeg: 470,
    leg: LEG_4,
    description:
      "A town that exists purely for tourist entertainment. Pancake houses, moonshine distilleries, go-karts, and a ski lift to a viewing platform. Completely insane.",
    timeNeeded: "2 \u2013 4 hours (or overnight)",
    cost: "$$",
    whyStop:
      "It's Blackpool meets the Alps. Moonshine tastings, a SkyBridge over a gorge, and more pancake restaurants than people. Peak American tourist town.",
  },
  {
    name: "Georgia Guidestones Site",
    type: "historic",
    highway: "Near I-85 S",
    nearCity: "Elberton, GA",
    milesIntoLeg: 300,
    leg: LEG_5,
    description:
      "Were mysteriously demolished in 2022 after a bombing. Now just a field with a plaque. The 'American Stonehenge' that conspiracy theorists loved.",
    timeNeeded: "15 \u2013 30 min",
    cost: "free",
    whyStop:
      "A mysterious granite monument with instructions for rebuilding civilisation in 8 languages \u2014 now destroyed under suspicious circumstances. The conspiracy theories alone are worth the detour.",
  },
  {
    name: "Florida Welcome Center",
    type: "experience",
    highway: "I-95 S / I-75 S",
    nearCity: "Florida state line",
    milesIntoLeg: 550,
    leg: LEG_5,
    description:
      "Free orange juice. Seriously. Florida gives you free OJ when you cross the border. Clean toilets, travel brochures, and complimentary citrus.",
    timeNeeded: "15 \u2013 20 min",
    cost: "free",
    whyStop:
      "Free orange juice at the state border. It's Florida's version of a welcome pint. You're legally required to stop.",
  },
  {
    name: "SEE GATORLAND Billboard Trail",
    type: "roadside_art",
    highway: "I-75 S / I-95 S",
    nearCity: "Throughout Florida",
    milesIntoLeg: 580,
    leg: LEG_5,
    description:
      "Billboards for Gatorland start appearing 200+ miles before Orlando. The Wall Drug of Florida \u2014 a relentless billboard campaign that's been running since the 1950s.",
    timeNeeded: "Ongoing (you'll see them for 3+ hours of driving)",
    cost: "free",
    whyStop:
      "You don't stop \u2014 the billboards come to you. Count them. It becomes a road trip game. By the 40th sign, you'll seriously consider going to Gatorland.",
  },
  {
    name: "Foothills Parkway Overlook",
    type: "natural",
    highway: "Near I-40 (exit at US-321)",
    nearCity: "Between Knoxville and Gatlinburg, TN",
    milesIntoLeg: 460,
    leg: LEG_4,
    description:
      "A stunning mountain road with panoramic views of the Great Smoky Mountains. The 'Missing Link' bridge section opened in 2018 after 50 years of construction.",
    timeNeeded: "30 min \u2013 1 hour",
    cost: "free",
    whyStop:
      "Free Smoky Mountain views without the national park crowds. The bridge itself took 50 years to build. That's either very American or very British.",
  },
  {
    name: "World of Coca-Cola",
    type: "experience",
    highway: "I-75/85 (downtown Atlanta)",
    nearCity: "Atlanta, GA",
    milesIntoLeg: 250,
    leg: LEG_5,
    description:
      "A museum dedicated to fizzy drinks. Taste 100+ Coca-Cola products from around the world. The Beverly from Italy is famously disgusting \u2014 dare each other to drink it.",
    timeNeeded: "2 hours",
    cost: "$$",
    whyStop:
      "A museum to a soft drink. Only in America. The tasting room lets you try Coke from every country. The Beverly Challenge is a rite of passage.",
  },
  {
    name: "Mammoth Cave National Park",
    type: "natural",
    highway: "Near I-65 S (between Nashville and the route south)",
    nearCity: "Cave City, KY",
    milesIntoLeg: 100,
    leg: LEG_5,
    description:
      "The world's longest known cave system \u2014 over 400 miles of explored passages. A short detour from Nashville toward the southern route.",
    timeNeeded: "2 \u2013 3 hours (guided tour)",
    cost: "$",
    whyStop:
      "The longest cave system on Earth, right off the highway. Tours run regularly and it's genuinely awe-inspiring underground.",
  },
];
