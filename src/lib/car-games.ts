// ============ ROAD TRIP CAR GAMES ============
// Entertainment for the drive legs between cities:
// Boston -> NYC -> Philly -> DC -> Nashville -> Miami
// For Joe, Jonny, and Gregor — three British lads in America.

export type WouldYouRather = {
  optionA: string;
  optionB: string;
};

export type ConversationStarter = {
  question: string;
  category: "travel" | "football" | "funny" | "deep";
};

export type CarBingoItem = {
  text: string;
  icon: string; // emoji
};

// ── Would You Rather (30) ─────────────────────────────────────────

export const WOULD_YOU_RATHER: WouldYouRather[] = [
  {
    optionA: "Watch England win the World Cup but you can't be there",
    optionB: "Be at the final but England loses",
  },
  {
    optionA: "Drive the entire Boston–Miami route in one go, no stops",
    optionB: "Fly everywhere but your luggage gets lost every time",
  },
  {
    optionA: "Only eat hot dogs for the entire trip",
    optionB: "Only drink water (no beer) for the entire trip",
  },
  {
    optionA: "Sit next to the world's loudest vuvuzela player",
    optionB: "Sit behind the world's tallest person at every match",
  },
  {
    optionA: "Have Gregor navigate the whole trip",
    optionB: "Have Joe choose every restaurant",
  },
  {
    optionA: "Be stuck in NYC traffic for 4 hours",
    optionB: "Get a speeding ticket in Tennessee",
  },
  {
    optionA: "Sleep in the car for one night",
    optionB: "Stay in a hostel with 20 strangers who all snore",
  },
  {
    optionA: "Have to explain cricket to every American you meet",
    optionB: "Pretend to understand American football for 2 weeks",
  },
  {
    optionA: "Accidentally wear a USA shirt to an England match",
    optionB: "Get your face painted with the wrong flag at a fan zone",
  },
  {
    optionA: "Listen to only country music for the entire road trip",
    optionB: "Listen to only one song on repeat (you don't get to pick it)",
  },
  {
    optionA: "Have permanent sunburn for the Miami leg",
    optionB: "Torrential rain for the entire Nashville leg",
  },
  {
    optionA: "Be the designated driver for the whole trip",
    optionB: "Ride in the middle back seat every single drive",
  },
  {
    optionA: "Jonny controls the aux cord for 2 weeks straight",
    optionB: "No music at all — just silence and the road",
  },
  {
    optionA: "Try a deep-fried Oreo at every state fair you pass",
    optionB: "Eat an entire Nashville hot chicken (extra hot) in one sitting",
  },
  {
    optionA: "Get recognised on the Jumbotron at a match doing something embarrassing",
    optionB: "Go viral on American TikTok for being a 'typical British tourist'",
  },
  {
    optionA: "Have an unlimited budget but only 3 days for the whole trip",
    optionB: "Have the full 2 weeks but a daily budget of $50",
  },
  {
    optionA: "Navigate the entire trip using only a paper map",
    optionB: "Use GPS but it only speaks in a thick Brummie accent",
  },
  {
    optionA: "Meet your favourite footballer but you can only speak in American slang",
    optionB: "Get a signed shirt but it's from a team you hate",
  },
  {
    optionA: "Be stuck in the car with a wasp for an hour on the highway",
    optionB: "Have the air conditioning break in Miami",
  },
  {
    optionA: "Have a Waffle House meal cooked by Gordon Ramsay",
    optionB: "Have a Michelin-star meal cooked by the Waffle House line cook",
  },
  {
    optionA: "Do karaoke 'Three Lions' in a Nashville honky-tonk",
    optionB: "Do karaoke 'Sweet Home Alabama' at an England supporters' pub",
  },
  {
    optionA: "Accidentally call football 'soccer' in front of English fans for the rest of the trip",
    optionB: "Accidentally tip 0% at an American restaurant",
  },
  {
    optionA: "Run out of petrol on a highway in the middle of nowhere",
    optionB: "Get a flat tyre in downtown Miami at midnight",
  },
  {
    optionA: "Be forced to queue for 2 hours at every tourist spot (very British)",
    optionB: "Skip every queue but get heckled by everyone watching",
  },
  {
    optionA: "Only communicate in football chants for one full day",
    optionB: "Only communicate in an American accent for one full day",
  },
  {
    optionA: "Get front-row seats but at a match with no goals",
    optionB: "Watch a 5-goal thriller from the very last row",
  },
  {
    optionA: "Have Joe's mum text the group chat travel tips every hour",
    optionB: "Have Gregor's dad call with weather updates at 6am every morning",
  },
  {
    optionA: "Eat nothing but Philly cheesesteaks for 3 days in Philadelphia",
    optionB: "Eat nothing but clam chowder for 3 days in Boston",
  },
  {
    optionA: "Have the rental car be a bright pink convertible",
    optionB: "Have the rental car be a massive pickup truck you can barely drive",
  },
  {
    optionA: "Spend a night out in Nashville wearing a cowboy hat and boots",
    optionB: "Spend a night out in Miami in a full England kit including shin pads",
  },
];

// ── Conversation Starters (30) ────────────────────────────────────

export const CONVERSATION_STARTERS: ConversationStarter[] = [
  {
    question: "What's the most overrated tourist attraction you've ever been to?",
    category: "travel",
  },
  {
    question: "If you could watch any World Cup match in history live, which one?",
    category: "football",
  },
  {
    question: "What's the worst thing you could say at US customs?",
    category: "funny",
  },
  {
    question: "If you could live in any of the 6 cities we're visiting, which one and why?",
    category: "deep",
  },
  {
    question: "Who's the most overrated player at this World Cup?",
    category: "football",
  },
  {
    question: "What's the one thing you'd grab if we had to evacuate the car in 30 seconds?",
    category: "travel",
  },
  {
    question: "Rank: Nashville hot chicken, Philly cheesesteak, NYC pizza, Miami Cuban sandwich.",
    category: "funny",
  },
  {
    question: "After this trip, what's the next adventure we should plan?",
    category: "deep",
  },
  {
    question: "What's your hot take that would get you booed in a pub?",
    category: "football",
  },
  {
    question: "If you had to move to America permanently, what would you miss most about home?",
    category: "deep",
  },
  {
    question: "What's the most American thing you've done so far this trip?",
    category: "funny",
  },
  {
    question: "Which city on the route are you most looking forward to and why?",
    category: "travel",
  },
  {
    question: "Build your dream 5-a-side team from any era. Go.",
    category: "football",
  },
  {
    question: "If the three of us started a business in America, what would it be?",
    category: "deep",
  },
  {
    question: "What's the funniest mispronunciation of a place name you've heard on this trip?",
    category: "funny",
  },
  {
    question: "What's a food you'd never try before this trip that you'd now eat again?",
    category: "travel",
  },
  {
    question: "Which current England player would be the best road trip companion?",
    category: "football",
  },
  {
    question: "What will you remember most about this trip in 10 years?",
    category: "deep",
  },
  {
    question: "Describe each of us as an American stereotype. Be honest.",
    category: "funny",
  },
  {
    question: "Best and worst travel experience you've ever had?",
    category: "travel",
  },
  {
    question: "If you managed England, what's the first thing you'd change?",
    category: "football",
  },
  {
    question: "What's something you believed as a kid that turned out to be completely wrong?",
    category: "deep",
  },
  {
    question: "If we had to perform in a talent show at the next rest stop, what's our act?",
    category: "funny",
  },
  {
    question: "What's the biggest culture shock going from the UK to the US?",
    category: "travel",
  },
  {
    question: "Predict the World Cup final score and scorers. Loser buys dinner.",
    category: "football",
  },
  {
    question: "If you could have dinner with anyone, alive or dead, who and what restaurant on our route?",
    category: "deep",
  },
  {
    question: "What American phrase or word have you accidentally started using?",
    category: "funny",
  },
  {
    question: "What's the longest you've gone without checking your phone? Could you beat it on this trip?",
    category: "travel",
  },
  {
    question: "Which World Cup host nation would you most want to do a road trip through?",
    category: "football",
  },
  {
    question: "When we're 80, what story from this trip will we still be telling?",
    category: "deep",
  },
];

// ── Car Bingo (25 items for 5x5 grid) ─────────────────────────────

export const CAR_BINGO: CarBingoItem[] = [
  { text: "Car with bumper stickers", icon: "\uD83D\uDE97" },
  { text: "American football on TV at a rest stop", icon: "\uD83C\uDFC8" },
  { text: "Bird of prey in the sky", icon: "\uD83E\uDD85" },
  { text: "Truck bigger than our car", icon: "\uD83D\uDE9B" },
  { text: "Country music radio station", icon: "\uD83C\uDFB8" },
  { text: "First palm tree spotted", icon: "\uD83C\uDF34" },
  { text: "Construction zone", icon: "\uD83C\uDFD7\uFE0F" },
  { text: "Police car", icon: "\uD83D\uDE93" },
  { text: "American flag on a building", icon: "\uD83C\uDFC6" },
  { text: "Waffle House sighting", icon: "\uD83C\uDF54" },
  { text: "Alligator warning sign", icon: "\uD83D\uDC0A" },
  { text: "Gas under $3/gallon", icon: "\u26FD" },
  { text: "Drive through rain", icon: "\uD83C\uDF27\uFE0F" },
  { text: "Beach visible from highway", icon: "\uD83C\uDFD6\uFE0F" },
  { text: "Everyone singing along", icon: "\uD83C\uDFB5" },
  { text: "Selfie at a state line", icon: "\uD83D\uDCF8" },
  { text: "Toll booth", icon: "\uD83D\uDEE3\uFE0F" },
  { text: "Sunset while driving", icon: "\uD83C\uDF05" },
  { text: "Mountain visible", icon: "\uD83C\uDFD4\uFE0F" },
  { text: "Cows in a field", icon: "\uD83D\uDC04" },
  { text: "Buc-ee's sighting", icon: "\uD83C\uDFEA" },
  { text: "Billboard for something questionable", icon: "\uD83C\uDFB0" },
  { text: "Helicopter overhead", icon: "\uD83D\uDE81" },
  { text: "Tesla charging station", icon: "\u26A1" },
  { text: "Dog with head out of car window", icon: "\uD83D\uDC15" },
];
