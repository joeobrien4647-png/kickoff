export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  category: "travel" | "matches" | "food" | "social" | "planning";
  checkFn: string; // describes the unlock condition
};

export const ACHIEVEMENTS: Achievement[] = [
  // ── Travel ──────────────────────────────────────────────────────────
  {
    id: "road-warrior",
    name: "Road Warrior",
    description: "Drive 500+ total miles",
    icon: "Car",
    category: "travel",
    checkFn: "totalMiles >= 500",
  },
  {
    id: "state-hopper",
    name: "State Hopper",
    description: "Visit 6+ states (MA, NY, PA, DC, TN, FL)",
    icon: "MapPin",
    category: "travel",
    checkFn: "statesVisited >= 6",
  },
  {
    id: "mile-high-club",
    name: "Mile High Club",
    description: "Take at least 1 flight during the trip",
    icon: "Plane",
    category: "travel",
    checkFn: "flightsPlanned >= 1",
  },
  {
    id: "night-owl",
    name: "Night Owl",
    description: "Plan a leg departing after 10 PM",
    icon: "Moon",
    category: "travel",
    checkFn: "hasLateNightDeparture",
  },
  {
    id: "scenic-route",
    name: "Scenic Route",
    description: "Go the distance \u2014 1,500+ miles planned",
    icon: "Mountain",
    category: "travel",
    checkFn: "totalMiles >= 1500",
  },

  // ── Matches ─────────────────────────────────────────────────────────
  {
    id: "super-fan",
    name: "Super Fan",
    description: "Attend 3+ matches",
    icon: "Trophy",
    category: "matches",
    checkFn: "matchesAttending >= 3",
  },
  {
    id: "ticket-master",
    name: "Ticket Master",
    description: "Purchase tickets for 5+ matches",
    icon: "Ticket",
    category: "matches",
    checkFn: "ticketsPurchased >= 5",
  },
  {
    id: "oracle",
    name: "Oracle",
    description: "Get 3+ match predictions exactly right",
    icon: "Target",
    category: "matches",
    checkFn: "predictionsCorrect >= 3",
  },
  {
    id: "full-house",
    name: "Full House",
    description: "All 3 lads attend the same match",
    icon: "Users",
    category: "matches",
    checkFn: "activeTravelers >= 3 && matchesAttending >= 1",
  },

  // ── Food ────────────────────────────────────────────────────────────
  {
    id: "hot-chicken-survivor",
    name: "Hot Chicken Survivor",
    description: "Reach Nashville \u2014 hot chicken is inevitable",
    icon: "Flame",
    category: "food",
    checkFn: "statesVisited >= 5",
  },
  {
    id: "philly-special",
    name: "Philly Special",
    description: "Reach Philadelphia \u2014 cheesesteak awaits",
    icon: "UtensilsCrossed",
    category: "food",
    checkFn: "statesVisited >= 3",
  },
  {
    id: "biscuit-boss",
    name: "Biscuit Boss",
    description: "Try a Southern biscuit (Nashville counts)",
    icon: "Cookie",
    category: "food",
    checkFn: "statesVisited >= 5",
  },

  // ── Social ──────────────────────────────────────────────────────────
  {
    id: "squad-goals",
    name: "Squad Goals",
    description: "All 3 travelers logged in and active",
    icon: "Heart",
    category: "social",
    checkFn: "activeTravelers >= 3",
  },
  {
    id: "decision-maker",
    name: "Decision Maker",
    description: "Vote on 5+ group decisions",
    icon: "ThumbsUp",
    category: "social",
    checkFn: "decisionsVoted >= 5",
  },
  {
    id: "idea-machine",
    name: "Idea Machine",
    description: "Create 10+ trip ideas",
    icon: "Lightbulb",
    category: "social",
    checkFn: "ideasCreated >= 10",
  },
  {
    id: "shutterbug",
    name: "Shutterbug",
    description: "Upload 10+ trip photos",
    icon: "Camera",
    category: "social",
    checkFn: "photosUploaded >= 10",
  },

  // ── Planning ────────────────────────────────────────────────────────
  {
    id: "fully-packed",
    name: "Fully Packed",
    description: "100% packing list complete",
    icon: "Package",
    category: "planning",
    checkFn: "packingProgress >= 100",
  },
  {
    id: "all-checked",
    name: "All Checked",
    description: "100% checklist complete",
    icon: "CheckCircle",
    category: "planning",
    checkFn: "checklistProgress >= 100",
  },
  {
    id: "budget-boss",
    name: "Budget Boss",
    description: "Log 20+ expenses",
    icon: "DollarSign",
    category: "planning",
    checkFn: "expensesLogged >= 20",
  },
  {
    id: "early-bird",
    name: "Early Bird",
    description: "80%+ checklist done 7+ days before departure",
    icon: "Clock",
    category: "planning",
    checkFn: "daysUntilTrip >= 7 && checklistProgress >= 80",
  },
];
