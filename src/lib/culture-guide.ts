// ---------------------------------------------------------------------------
// Tipping & Culture Guide — essential survival kit for 3 Brits in America
// ---------------------------------------------------------------------------

export type TipItem = {
  title: string;
  detail: string;
  britishComparison?: string;
};

export type TipCategory = {
  category: string;
  icon: string; // lucide icon name
  items: TipItem[];
};

// ── Tipping Guide ─────────────────────────────────────────────────

export const TIPPING_GUIDE: {
  situation: string;
  tip: string;
  note: string;
  priority: "essential" | "expected" | "optional";
}[] = [
  {
    situation: "Restaurants (sit-down)",
    tip: "18-20%",
    note: "Of the pre-tax total. Yes, really. They will chase you if you don't.",
    priority: "essential",
  },
  {
    situation: "Bars",
    tip: "$1-2/drink or 15-20%",
    note: "Especially if you want drinks quickly. Bartenders have long memories.",
    priority: "essential",
  },
  {
    situation: "Uber / Lyft",
    tip: "15-20%",
    note: "Add it in the app after the ride. The driver WILL see if you don't tip.",
    priority: "essential",
  },
  {
    situation: "Hotel housekeeping",
    tip: "$2-5/night",
    note: "Leave on the pillow each morning with a note. Not just at Christmas.",
    priority: "expected",
  },
  {
    situation: "Valet parking",
    tip: "$3-5",
    note: "When the car is returned. Even if the car park was right there.",
    priority: "expected",
  },
  {
    situation: "Coffee shops",
    tip: "$1-2",
    note: "For counter service. The iPad screen WILL guilt-trip you with 25% options.",
    priority: "optional",
  },
  {
    situation: "Food delivery",
    tip: "15-20%, min $3",
    note: "More in bad weather. These folks are bringing you food in a Miami thunderstorm.",
    priority: "essential",
  },
  {
    situation: "Barbers / haircuts",
    tip: "20%",
    note: "Even if they just buzzed it. You sat in the chair, you tip.",
    priority: "expected",
  },
  {
    situation: "Hotel concierge",
    tip: "$5-20",
    note: "Depends on the request. Getting match tickets? Tip generously.",
    priority: "expected",
  },
  {
    situation: "Tour guides",
    tip: "$5-10/person",
    note: "They're usually students or actors. This is how they eat.",
    priority: "expected",
  },
  {
    situation: "Coat check",
    tip: "$1-2/item",
    note: "Hand it over when you pick up your stuff. Quick and painless.",
    priority: "optional",
  },
  {
    situation: "Bathroom attendant",
    tip: "$1",
    note: "Yes, this is a real thing. There's a person. There's a tray. Put a dollar on it.",
    priority: "optional",
  },
];

// ── Culture Tips by Category ──────────────────────────────────────

export const CULTURE_TIPS: TipCategory[] = [
  {
    category: "Driving",
    icon: "Car",
    items: [
      {
        title: "Drive on the RIGHT",
        detail:
          "This is the big one. Your instinct will betray you at every junction. Especially after the third pint.",
        britishComparison:
          "Like driving in the UK but mirrored. Your passenger now sits where the steering wheel should be.",
      },
      {
        title: "Right on red is legal",
        detail:
          "You can turn right at a red light after stopping, unless a sign says otherwise. Brits always forget this and get honked at.",
        britishComparison:
          "No UK equivalent. Imagine being allowed to turn left on red at home — it would be chaos.",
      },
      {
        title: "Speed limits are in mph",
        detail:
          "Same as UK, so no conversion needed. Highway speed is 55-70 mph. Stay in the right lane unless overtaking.",
        britishComparison:
          "Familiar units, but American cops are less forgiving than speed cameras on the M4.",
      },
      {
        title: "Fuel is laughably cheap",
        detail:
          "Roughly half the price of UK petrol. It's called 'gas' not 'petrol'. Gas stations are everywhere.",
        britishComparison:
          "Like filling up at 2005 UK prices. You'll want to drive just because you can afford to.",
      },
      {
        title: "East Coast drivers are aggressive",
        detail:
          "Horns, lane changes, creative use of hard shoulders. Boston and NYC especially. Stay calm and let them pass.",
        britishComparison:
          "Think M25 on a bank holiday, but everyone drives like they're late for a flight. Permanently.",
      },
    ],
  },
  {
    category: "Food & Drink",
    icon: "UtensilsCrossed",
    items: [
      {
        title: "Free refills on soft drinks",
        detail:
          "Order one Coke, drink twelve. This applies at most sit-down and fast food restaurants. It's not a trap.",
        britishComparison:
          "In the UK, a second Coke costs another three quid. Here it's bottomless. Embrace it.",
      },
      {
        title: "Portion sizes are enormous",
        detail:
          "An American 'medium' is a British 'XL'. You can often split a starter. Doggy bags are normal, not embarrassing.",
        britishComparison:
          "That Wetherspoons large plate? That's an American side dish.",
      },
      {
        title: "Ice in absolutely everything",
        detail:
          "Your water, your Coke, your iced tea, probably your soup. Ask for 'no ice' if you want actual drink in your glass.",
        britishComparison:
          "In the UK, asking for ice is an event. Here, asking for 'no ice' is the unusual request.",
      },
      {
        title: "Tax isn't included in menu prices",
        detail:
          "That $15 burger is actually $17.50 at the till. Tax is added at the register. Always mentally add 7-10%.",
        britishComparison:
          "Like if Tesco showed prices without VAT. Annoying, but you'll get used to it by day three.",
      },
      {
        title: "Drinking age is 21",
        detail:
          "Carry your passport at bars. Yes, even at 30. They will card you. It's the law, not a compliment.",
        britishComparison:
          "In the UK, you've been drinking since 18 (legally) and 15 (in parks). America is strict about this.",
      },
    ],
  },
  {
    category: "Social",
    icon: "Users",
    items: [
      {
        title: "Americans are genuinely friendly",
        detail:
          "They WILL talk to you. In lifts, at bars, in the queue at Starbucks. It's not weird — it's just how it works here.",
        britishComparison:
          "Like if everyone in Tesco suddenly started chatting to you. Unsettling at first, then lovely.",
      },
      {
        title: "'How are you?' isn't a real question",
        detail:
          "The correct response is 'Good, you?' and you move on. Do NOT actually tell them how you are.",
        britishComparison:
          "Like the British 'alright?' — if you actually answer, you've broken the social contract.",
      },
      {
        title: "Bathroom means restroom",
        detail:
          "Ask for the 'restroom' at nice restaurants. 'Toilet' is considered a bit crude. 'Loo' will get blank stares.",
        britishComparison:
          "Like how you'd never say 'bog' at a posh dinner. Same energy, different word.",
      },
      {
        title: "Football means something else here",
        detail:
          "Your football is their 'soccer'. Their football involves helmets, pads, and commercial breaks every 4 minutes.",
        britishComparison:
          "Prepare to explain this roughly 47 times. 'No mate, REAL football' will not help.",
      },
      {
        title: "Being British is a superpower at bars",
        detail:
          "The accent gets you free drinks, new friends, and an audience. Use this power wisely. Or recklessly. Your call.",
        britishComparison:
          "Like being Australian in a London pub, but turned up to eleven. Americans love a British accent.",
      },
    ],
  },
  {
    category: "Money",
    icon: "Wallet",
    items: [
      {
        title: "Everything costs more than the sticker price",
        detail:
          "Sales tax is added at the register, not shown on the price tag. Budget an extra 6-9% on everything.",
        britishComparison:
          "Imagine if UK shops showed prices without VAT. Welcome to America's most confusing feature.",
      },
      {
        title: "Contactless and Apple Pay work almost everywhere",
        detail:
          "Tap-to-pay is widely accepted. Visa and Mastercard are universal. Amex is sometimes rejected at smaller places.",
        britishComparison:
          "Just as convenient as the UK. Your Monzo/Revolut card works brilliantly here.",
      },
      {
        title: "Some places are cash-only",
        detail:
          "Dive bars, food trucks, and some legendary restaurants. Keep at least $50 in your wallet at all times.",
        britishComparison:
          "Like those market stalls and chippies back home that still don't take card. Same principle.",
      },
      {
        title: "ATM fees are brutal",
        detail:
          "Out-of-network ATMs charge $3-5 per withdrawal. Use your Revolut/Monzo or find in-network machines.",
        britishComparison:
          "Makes those dodgy UK cash machines that charge 1.50 look like a bargain.",
      },
      {
        title: "Sales tax varies by state",
        detail:
          "MA: 6.25% | NY: 8.875% | PA: 6% | DC: 6% | TN: 9.25% | FL: 6%. Nashville stings the most.",
        britishComparison:
          "Like if VAT changed every time you crossed a county line. America is just 50 countries in a trenchcoat.",
      },
    ],
  },
  {
    category: "Weather",
    icon: "Sun",
    items: [
      {
        title: "June means HEAT",
        detail:
          "Expect 30-38C (85-100F) across the route. Miami and Nashville will be the worst. You will melt.",
        britishComparison:
          "That one week in July when the UK hits 30C and the country shuts down? That's every single day here.",
      },
      {
        title: "Air conditioning is weaponised",
        detail:
          "Restaurants, shops, and stadiums are kept at Arctic temperatures. Bring a hoodie for indoors.",
        britishComparison:
          "Like walking into a Tesco freezer aisle, except it's the entire building.",
      },
      {
        title: "Hydrate or die (almost)",
        detail:
          "Carry a water bottle everywhere. Refill it constantly. You're not used to this heat and humidity.",
        britishComparison:
          "Your body thinks a British summer is 22C. It is about to receive a very rude awakening.",
      },
    ],
  },
];

// ── US vs UK Quick Reference ──────────────────────────────────────

export const US_VS_UK: { topic: string; uk: string; us: string }[] = [
  { topic: "Floor numbering", uk: "Ground floor", us: "First floor" },
  { topic: "Restaurant", uk: "Bill", us: "Check" },
  { topic: "Waiting", uk: "Queue", us: "Line" },
  { topic: "Big roads", uk: "Motorway", us: "Highway / Interstate" },
  { topic: "Car fuel", uk: "Petrol", us: "Gas" },
  { topic: "Car storage", uk: "Boot", us: "Trunk" },
  { topic: "Walking path", uk: "Pavement", us: "Sidewalk" },
  { topic: "Drinking spot", uk: "Pub", us: "Bar" },
  { topic: "Friend", uk: "Mate", us: "Bro / Dude" },
  { topic: "Waste", uk: "Rubbish", us: "Trash / Garbage" },
];
