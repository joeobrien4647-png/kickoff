import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// ============ TRIP SETTINGS ============
export const tripSettings = sqliteTable("trip_settings", {
  id: text("id").primaryKey(), // always "trip" — single row
  name: text("name").notNull(),
  tripCode: text("trip_code").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  currency: text("currency").notNull().default("USD"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// ============ TRAVELERS ============
export const travelers = sqliteTable("travelers", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  color: text("color").notNull(),
  emoji: text("emoji").notNull(),
  createdAt: text("created_at").notNull(),
});

// ============ STOPS ============
export const stops = sqliteTable("stops", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  arriveDate: text("arrive_date").notNull(),
  departDate: text("depart_date").notNull(),
  sortOrder: integer("sort_order").notNull(),
  lat: real("lat"),
  lng: real("lng"),
  driveFromPrev: text("drive_from_prev"), // JSON: { miles, hours, minutes }
  notes: text("notes"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// ============ ACCOMMODATIONS ============
export const accommodations = sqliteTable("accommodations", {
  id: text("id").primaryKey(),
  stopId: text("stop_id")
    .notNull()
    .references(() => stops.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type", {
    enum: ["host", "hotel", "airbnb", "hostel", "other"],
  }).notNull(),
  address: text("address"),
  contact: text("contact"),
  costPerNight: real("cost_per_night"),
  nights: integer("nights"),
  confirmed: integer("confirmed", { mode: "boolean" }).notNull().default(false),
  bookingUrl: text("booking_url"),
  notes: text("notes"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// ============ MATCHES ============
export const matches = sqliteTable("matches", {
  id: text("id").primaryKey(),
  stopId: text("stop_id").references(() => stops.id),
  homeTeam: text("home_team").notNull(),
  awayTeam: text("away_team").notNull(),
  venue: text("venue").notNull(),
  city: text("city").notNull(),
  matchDate: text("match_date").notNull(),
  kickoff: text("kickoff"),
  groupName: text("group_name"),
  round: text("round").default("group"),
  ticketStatus: text("ticket_status", {
    enum: ["none", "seeking", "purchased", "gave_up"],
  })
    .notNull()
    .default("none"),
  ticketPrice: real("ticket_price"),
  ticketUrl: text("ticket_url"),
  ticketNotes: text("ticket_notes"),
  fanZone: text("fan_zone"),
  attending: integer("attending", { mode: "boolean" }).notNull().default(false),
  priority: integer("priority").notNull().default(0), // 0-3
  notes: text("notes"),
  actualHomeScore: integer("actual_home_score"),
  actualAwayScore: integer("actual_away_score"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// ============ ITINERARY ITEMS ============
export const itineraryItems = sqliteTable("itinerary_items", {
  id: text("id").primaryKey(),
  date: text("date").notNull(),
  stopId: text("stop_id").references(() => stops.id),
  matchId: text("match_id").references(() => matches.id),
  title: text("title").notNull(),
  type: text("type", {
    enum: ["travel", "match", "food", "sightseeing", "activity", "rest", "other"],
  }).notNull(),
  startTime: text("start_time"),
  endTime: text("end_time"),
  location: text("location"),
  cost: real("cost"),
  confirmed: integer("confirmed", { mode: "boolean" }).notNull().default(false),
  addedBy: text("added_by"),
  sortOrder: integer("sort_order").notNull().default(0),
  notes: text("notes"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// ============ EXPENSES ============
export const expenses = sqliteTable("expenses", {
  id: text("id").primaryKey(),
  description: text("description").notNull(),
  amount: real("amount").notNull(),
  category: text("category", {
    enum: [
      "food",
      "transport",
      "tickets",
      "accommodation",
      "drinks",
      "activities",
      "shopping",
      "other",
    ],
  }).notNull(),
  paidBy: text("paid_by").notNull(),
  date: text("date").notNull(),
  stopId: text("stop_id").references(() => stops.id),
  notes: text("notes"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// ============ EXPENSE SPLITS ============
export const expenseSplits = sqliteTable("expense_splits", {
  id: text("id").primaryKey(),
  expenseId: text("expense_id")
    .notNull()
    .references(() => expenses.id, { onDelete: "cascade" }),
  travelerId: text("traveler_id")
    .notNull()
    .references(() => travelers.id),
  share: real("share").notNull(),
  settled: integer("settled", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull(),
});

// ============ PACKING ITEMS ============
export const packingItems = sqliteTable("packing_items", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category", {
    enum: [
      "clothing",
      "toiletries",
      "electronics",
      "documents",
      "gear",
      "fan_gear",
      "other",
    ],
  }).notNull(),
  assignedTo: text("assigned_to"),
  checked: integer("checked", { mode: "boolean" }).notNull().default(false),
  quantity: integer("quantity").notNull().default(1),
  notes: text("notes"),
  createdAt: text("created_at").notNull(),
});

// ============ IDEAS ============
// Things we could do at each stop — the wishlist
export const ideas = sqliteTable("ideas", {
  id: text("id").primaryKey(),
  stopId: text("stop_id")
    .notNull()
    .references(() => stops.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  category: text("category", {
    enum: [
      "food",
      "drinks",
      "sightseeing",
      "activity",
      "nightlife",
      "shopping",
      "sports_bar",
      "other",
    ],
  }).notNull(),
  description: text("description"),
  url: text("url"),
  address: text("address"),
  estimatedCost: real("estimated_cost"),
  estimatedDuration: text("estimated_duration"), // e.g. "2 hours", "half day"
  votes: text("votes").default("[]"), // JSON array of traveler names who upvoted
  type: text("type").notNull().default("idea"), // "idea" | "poll"
  options: text("options"), // JSON: [{text: string, votes: string[]}] — null for regular ideas
  status: text("status", {
    enum: ["idea", "planned", "done", "skipped"],
  })
    .notNull()
    .default("idea"),
  itineraryItemId: text("itinerary_item_id").references(() => itineraryItems.id),
  addedBy: text("added_by"),
  notes: text("notes"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// ============ LOGISTICS ============
// Pre-trip checklist — things to book, organise, sort out
export const logistics = sqliteTable("logistics", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category", {
    enum: [
      "transport",
      "accommodation",
      "documents",
      "booking",
      "money",
      "tech",
      "other",
    ],
  }).notNull(),
  status: text("status", {
    enum: ["todo", "in_progress", "done"],
  })
    .notNull()
    .default("todo"),
  priority: integer("priority").notNull().default(1), // 0-3
  dueDate: text("due_date"),
  confirmationRef: text("confirmation_ref"),
  url: text("url"),
  cost: real("cost"),
  assignedTo: text("assigned_to"),
  notes: text("notes"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// ============ NOTES ============
export const notes = sqliteTable("notes", {
  id: text("id").primaryKey(),
  date: text("date"),
  stopId: text("stop_id").references(() => stops.id),
  title: text("title"),
  content: text("content").notNull(),
  pinned: integer("pinned", { mode: "boolean" }).notNull().default(false),
  addedBy: text("added_by"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// ============ PREDICTIONS ============
export const predictions = sqliteTable("predictions", {
  id: text("id").primaryKey(),
  matchId: text("match_id")
    .notNull()
    .references(() => matches.id, { onDelete: "cascade" }),
  travelerName: text("traveler_name").notNull(),
  homeScore: integer("home_score").notNull(),
  awayScore: integer("away_score").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// ============ ACTIVITY LOG ============
export const activityLog = sqliteTable("activity_log", {
  id: text("id").primaryKey(),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id"),
  description: text("description").notNull(),
  actor: text("actor").notNull(),
  createdAt: text("created_at").notNull(),
});

// ============ VENUE VOTES ============
export const venueVotes = sqliteTable("venue_votes", {
  id: text("id").primaryKey(),
  venueName: text("venue_name").notNull(),
  city: text("city").notNull(),
  category: text("category", {
    enum: ["restaurant", "attraction", "nightlife", "shopping"],
  }).notNull(),
  voterName: text("voter_name").notNull(),
  vote: integer("vote").notNull().default(1), // 1 = upvote
  createdAt: text("created_at").notNull(),
});

// ============ TRANSPORTS ============
export const transports = sqliteTable("transports", {
  id: text("id").primaryKey(),
  type: text("type", {
    enum: ["flight", "train", "car_rental", "bus", "rideshare"],
  }).notNull(),
  fromCity: text("from_city").notNull(),
  toCity: text("to_city").notNull(),
  departDate: text("depart_date").notNull(),
  departTime: text("depart_time"),
  arriveTime: text("arrive_time"),
  carrier: text("carrier"),
  confirmationRef: text("confirmation_ref"),
  cost: real("cost"),
  bookingUrl: text("booking_url"),
  notes: text("notes"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// ============ PHOTOS ============
export const photos = sqliteTable("photos", {
  id: text("id").primaryKey(),
  stopId: text("stop_id").references(() => stops.id),
  caption: text("caption"),
  data: text("data").notNull(), // base64 encoded image
  takenDate: text("taken_date"),
  addedBy: text("added_by").notNull(),
  createdAt: text("created_at").notNull(),
});

// ============ TYPE EXPORTS ============
export type TripSettings = typeof tripSettings.$inferSelect;
export type Traveler = typeof travelers.$inferSelect;
export type Stop = typeof stops.$inferSelect;
export type Accommodation = typeof accommodations.$inferSelect;
export type Match = typeof matches.$inferSelect;
export type ItineraryItem = typeof itineraryItems.$inferSelect;
export type Expense = typeof expenses.$inferSelect;
export type ExpenseSplit = typeof expenseSplits.$inferSelect;
export type PackingItem = typeof packingItems.$inferSelect;
export type Idea = typeof ideas.$inferSelect;
export type Logistics = typeof logistics.$inferSelect;
export type Note = typeof notes.$inferSelect;
export type Prediction = typeof predictions.$inferSelect;
export type ActivityLogEntry = typeof activityLog.$inferSelect;
export type VenueVote = typeof venueVotes.$inferSelect;
export type Transport = typeof transports.$inferSelect;
export type Photo = typeof photos.$inferSelect;
