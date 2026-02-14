// Route coordinates for map
export const ROUTE_STOPS = [
  { name: "Boston", lat: 42.3601, lng: -71.0589 },
  { name: "New York", lat: 40.7128, lng: -74.006 },
  { name: "Philadelphia", lat: 39.9526, lng: -75.1652 },
  { name: "Washington DC", lat: 38.9072, lng: -77.0369 },
  { name: "Nashville", lat: 36.1627, lng: -86.7816 },
  { name: "Miami", lat: 25.7617, lng: -80.1918 },
] as const;

// World Cup venues on the East Coast
export const VENUES = [
  {
    name: "Gillette Stadium",
    city: "Foxborough",
    displayCity: "Boston",
    lat: 42.0909,
    lng: -71.2643,
  },
  {
    name: "MetLife Stadium",
    city: "East Rutherford",
    displayCity: "New York",
    lat: 40.8135,
    lng: -74.0745,
  },
  {
    name: "Lincoln Financial Field",
    city: "Philadelphia",
    displayCity: "Philadelphia",
    lat: 39.9008,
    lng: -75.1675,
  },
  {
    name: "Mercedes-Benz Stadium",
    city: "Atlanta",
    displayCity: "Atlanta",
    lat: 33.7553,
    lng: -84.4006,
  },
  {
    name: "Hard Rock Stadium",
    city: "Miami Gardens",
    displayCity: "Miami",
    lat: 25.958,
    lng: -80.2389,
  },
] as const;

// Traveler colors
export const TRAVELER_COLORS = {
  blue: "#3b82f6",
  green: "#22c55e",
  amber: "#f59e0b",
} as const;

// Expense categories with icons
export const EXPENSE_CATEGORIES = [
  { value: "food", label: "Food", icon: "UtensilsCrossed" },
  { value: "transport", label: "Transport", icon: "Car" },
  { value: "tickets", label: "Tickets", icon: "Ticket" },
  { value: "accommodation", label: "Accommodation", icon: "Bed" },
  { value: "drinks", label: "Drinks", icon: "Beer" },
  { value: "activities", label: "Activities", icon: "MapPin" },
  { value: "shopping", label: "Shopping", icon: "ShoppingBag" },
  { value: "other", label: "Other", icon: "MoreHorizontal" },
] as const;

// Packing categories
export const PACKING_CATEGORIES = [
  { value: "documents", label: "Documents" },
  { value: "clothing", label: "Clothing" },
  { value: "toiletries", label: "Toiletries" },
  { value: "electronics", label: "Electronics" },
  { value: "gear", label: "Gear" },
  { value: "fan_gear", label: "Fan Gear" },
  { value: "other", label: "Other" },
] as const;

// Idea categories
export const IDEA_CATEGORIES = [
  { value: "food", label: "Food", icon: "UtensilsCrossed" },
  { value: "drinks", label: "Drinks", icon: "Beer" },
  { value: "sightseeing", label: "Sightseeing", icon: "Camera" },
  { value: "activity", label: "Activity", icon: "Zap" },
  { value: "nightlife", label: "Nightlife", icon: "Moon" },
  { value: "shopping", label: "Shopping", icon: "ShoppingBag" },
  { value: "sports_bar", label: "Sports Bar", icon: "Tv" },
  { value: "other", label: "Other", icon: "MoreHorizontal" },
] as const;

// Idea status display config
export const IDEA_STATUS = {
  idea: { label: "Idea", color: "text-muted-foreground", bg: "bg-muted" },
  planned: { label: "Planned", color: "text-wc-teal", bg: "bg-wc-teal/10" },
  done: { label: "Done", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  skipped: { label: "Skipped", color: "text-muted-foreground", bg: "bg-muted/50" },
} as const;

// Logistics categories
export const LOGISTICS_CATEGORIES = [
  { value: "documents", label: "Documents", icon: "FileText" },
  { value: "transport", label: "Transport", icon: "Car" },
  { value: "accommodation", label: "Accommodation", icon: "Bed" },
  { value: "booking", label: "Bookings", icon: "CalendarCheck" },
  { value: "money", label: "Money", icon: "Banknote" },
  { value: "tech", label: "Tech", icon: "Smartphone" },
  { value: "other", label: "Other", icon: "MoreHorizontal" },
] as const;

// Logistics status
export const LOGISTICS_STATUS = {
  todo: { label: "To Do", color: "text-muted-foreground", bg: "bg-muted" },
  in_progress: { label: "In Progress", color: "text-wc-coral", bg: "bg-wc-coral/10" },
  done: { label: "Done", color: "text-wc-teal", bg: "bg-wc-teal/10" },
} as const;

// Itinerary item types
export const ITINERARY_TYPES = [
  { value: "travel", label: "Travel", icon: "Plane" },
  { value: "match", label: "Match", icon: "Trophy" },
  { value: "food", label: "Food", icon: "UtensilsCrossed" },
  { value: "sightseeing", label: "Sightseeing", icon: "Camera" },
  { value: "activity", label: "Activity", icon: "Zap" },
  { value: "rest", label: "Rest", icon: "Moon" },
  { value: "other", label: "Other", icon: "MoreHorizontal" },
] as const;

// Ticket status display config
export const TICKET_STATUS = {
  none: { label: "No Tickets", color: "text-muted-foreground" },
  seeking: { label: "Seeking", color: "text-amber-400" },
  purchased: { label: "Purchased", color: "text-emerald-400" },
  gave_up: { label: "Watching Elsewhere", color: "text-muted-foreground" },
} as const;

// Priority labels
export const MATCH_PRIORITY = [
  { value: 0, label: "Skip" },
  { value: 1, label: "Low" },
  { value: 2, label: "Medium" },
  { value: 3, label: "Must See" },
] as const;

// ============ CITY IDENTITY ============
// Each stop gets a unique visual identity used across the app
export const CITY_IDENTITY: Record<
  string,
  {
    color: string;
    bg: string;
    border: string;
    gradient: string;
    icon: string;
    tagline: string;
  }
> = {
  Boston: {
    color: "text-wc-teal",
    bg: "bg-wc-teal/8",
    border: "border-wc-teal/30",
    gradient: "from-wc-teal/12 via-transparent to-transparent",
    icon: "GraduationCap",
    tagline: "Where it begins",
  },
  "New York": {
    color: "text-wc-blue",
    bg: "bg-wc-blue/8",
    border: "border-wc-blue/30",
    gradient: "from-wc-blue/12 via-transparent to-transparent",
    icon: "Building2",
    tagline: "The city that never sleeps",
  },
  Philadelphia: {
    color: "text-wc-coral",
    bg: "bg-wc-coral/8",
    border: "border-wc-coral/30",
    gradient: "from-wc-coral/12 via-transparent to-transparent",
    icon: "Landmark",
    tagline: "City of brotherly love",
  },
  "Washington DC": {
    color: "text-wc-gold",
    bg: "bg-wc-gold/8",
    border: "border-wc-gold/30",
    gradient: "from-wc-gold/12 via-transparent to-transparent",
    icon: "Building",
    tagline: "The nation's capital",
  },
  Nashville: {
    color: "text-orange-400",
    bg: "bg-orange-400/8",
    border: "border-orange-400/30",
    gradient: "from-orange-400/12 via-transparent to-transparent",
    icon: "Music",
    tagline: "Music City",
  },
  Miami: {
    color: "text-emerald-400",
    bg: "bg-emerald-400/8",
    border: "border-emerald-400/30",
    gradient: "from-emerald-400/12 via-transparent to-transparent",
    icon: "Waves",
    tagline: "End of the road",
  },
};

/** Look up city identity, falling back to a neutral default */
export function getCityIdentity(city: string) {
  return (
    CITY_IDENTITY[city] ?? {
      color: "text-muted-foreground",
      bg: "bg-muted/8",
      border: "border-border",
      gradient: "from-muted/12 via-transparent to-transparent",
      icon: "MapPin",
      tagline: "",
    }
  );
}

// ============ COUNTRY FLAGS ============
// Emoji flags for teams in our match data
export const COUNTRY_FLAGS: Record<string, string> = {
  Brazil: "\u{1F1E7}\u{1F1F7}",
  England: "\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}",
  Scotland: "\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}",
  France: "\u{1F1EB}\u{1F1F7}",
  Morocco: "\u{1F1F2}\u{1F1E6}",
  Germany: "\u{1F1E9}\u{1F1EA}",
  Spain: "\u{1F1EA}\u{1F1F8}",
  Haiti: "\u{1F1ED}\u{1F1F9}",
  Uruguay: "\u{1F1FA}\u{1F1FE}",
  Norway: "\u{1F1F3}\u{1F1F4}",
  Senegal: "\u{1F1F8}\u{1F1F3}",
  Ecuador: "\u{1F1EA}\u{1F1E8}",
  Ghana: "\u{1F1EC}\u{1F1ED}",
  "Ivory Coast": "\u{1F1E8}\u{1F1EE}",
  Croatia: "\u{1F1ED}\u{1F1F7}",
  "Cape Verde": "\u{1F1E8}\u{1F1FB}",
  "South Africa": "\u{1F1FF}\u{1F1E6}",
  "Saudi Arabia": "\u{1F1F8}\u{1F1E6}",
  Panama: "\u{1F1F5}\u{1F1E6}",
  Colombia: "\u{1F1E8}\u{1F1F4}",
  Portugal: "\u{1F1F5}\u{1F1F9}",
  Curacao: "\u{1F1E8}\u{1F1FC}",
  "Playoff Winner": "\u{26BD}",
};

/** Get flag emoji for a team, fallback to soccer ball */
export function countryFlag(team: string): string {
  return COUNTRY_FLAGS[team] ?? "\u{26BD}";
}
