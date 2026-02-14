/**
 * Self-contained database setup — creates all tables and seeds if empty.
 * Runs before `next build` to ensure the database is ready.
 * No dependency on drizzle-kit — uses raw SQL for reliability in CI/CD.
 */
import Database from "better-sqlite3";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const DB_PATH = process.env.DATABASE_PATH || ".kickoff/kickoff.db";

// Ensure directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const sqlite = new Database(DB_PATH);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

// ============ CREATE TABLES ============
console.log("Ensuring database tables exist...");

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS trip_settings (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    trip_code TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS travelers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    color TEXT NOT NULL,
    emoji TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS stops (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    arrive_date TEXT NOT NULL,
    depart_date TEXT NOT NULL,
    sort_order INTEGER NOT NULL,
    lat REAL,
    lng REAL,
    drive_from_prev TEXT,
    notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS accommodations (
    id TEXT PRIMARY KEY,
    stop_id TEXT NOT NULL REFERENCES stops(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    address TEXT,
    contact TEXT,
    cost_per_night REAL,
    nights INTEGER,
    confirmed INTEGER NOT NULL DEFAULT 0,
    booking_url TEXT,
    notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS matches (
    id TEXT PRIMARY KEY,
    stop_id TEXT REFERENCES stops(id),
    home_team TEXT NOT NULL,
    away_team TEXT NOT NULL,
    venue TEXT NOT NULL,
    city TEXT NOT NULL,
    match_date TEXT NOT NULL,
    kickoff TEXT,
    group_name TEXT,
    round TEXT DEFAULT 'group',
    ticket_status TEXT NOT NULL DEFAULT 'none',
    ticket_price REAL,
    ticket_url TEXT,
    ticket_notes TEXT,
    fan_zone TEXT,
    attending INTEGER NOT NULL DEFAULT 0,
    priority INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS itinerary_items (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    stop_id TEXT REFERENCES stops(id),
    match_id TEXT REFERENCES matches(id),
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    start_time TEXT,
    end_time TEXT,
    location TEXT,
    cost REAL,
    confirmed INTEGER NOT NULL DEFAULT 0,
    added_by TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    description TEXT NOT NULL,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    paid_by TEXT NOT NULL,
    date TEXT NOT NULL,
    stop_id TEXT REFERENCES stops(id),
    notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS expense_splits (
    id TEXT PRIMARY KEY,
    expense_id TEXT NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
    traveler_id TEXT NOT NULL REFERENCES travelers(id),
    share REAL NOT NULL,
    settled INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS packing_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    assigned_to TEXT,
    checked INTEGER NOT NULL DEFAULT 0,
    quantity INTEGER NOT NULL DEFAULT 1,
    notes TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS ideas (
    id TEXT PRIMARY KEY,
    stop_id TEXT NOT NULL REFERENCES stops(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    url TEXT,
    address TEXT,
    estimated_cost REAL,
    estimated_duration TEXT,
    votes TEXT DEFAULT '[]',
    type TEXT NOT NULL DEFAULT 'idea',
    options TEXT,
    status TEXT NOT NULL DEFAULT 'idea',
    itinerary_item_id TEXT REFERENCES itinerary_items(id),
    added_by TEXT,
    notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS logistics (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'todo',
    priority INTEGER NOT NULL DEFAULT 1,
    due_date TEXT,
    confirmation_ref TEXT,
    url TEXT,
    cost REAL,
    assigned_to TEXT,
    notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    date TEXT,
    stop_id TEXT REFERENCES stops(id),
    title TEXT,
    content TEXT NOT NULL,
    pinned INTEGER NOT NULL DEFAULT 0,
    added_by TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS predictions (
    id TEXT PRIMARY KEY,
    match_id TEXT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    traveler_name TEXT NOT NULL,
    home_score INTEGER NOT NULL,
    away_score INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    UNIQUE(match_id, traveler_name)
  );

  CREATE TABLE IF NOT EXISTS activity_log (
    id TEXT PRIMARY KEY,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    description TEXT NOT NULL,
    actor TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS venue_votes (
    id TEXT PRIMARY KEY,
    venue_name TEXT NOT NULL,
    city TEXT NOT NULL,
    category TEXT NOT NULL,
    voter_name TEXT NOT NULL,
    vote INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    UNIQUE(venue_name, city, voter_name)
  );

  CREATE TABLE IF NOT EXISTS transports (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    from_city TEXT NOT NULL,
    to_city TEXT NOT NULL,
    depart_date TEXT NOT NULL,
    depart_time TEXT,
    arrive_time TEXT,
    carrier TEXT,
    confirmation_ref TEXT,
    cost REAL,
    booking_url TEXT,
    notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS decisions (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'route',
    options TEXT NOT NULL DEFAULT '[]',
    status TEXT NOT NULL DEFAULT 'open',
    decided_option TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS photos (
    id TEXT PRIMARY KEY,
    stop_id TEXT REFERENCES stops(id),
    caption TEXT,
    data TEXT NOT NULL,
    taken_date TEXT,
    added_by TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS reservations (
    id TEXT PRIMARY KEY,
    stop_id TEXT REFERENCES stops(id),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT,
    party_size INTEGER,
    confirmation_ref TEXT,
    address TEXT,
    phone TEXT,
    url TEXT,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    added_by TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS journal_entries (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL UNIQUE,
    stop_id TEXT REFERENCES stops(id),
    highlight TEXT,
    best_meal TEXT,
    funniest_moment TEXT,
    rating INTEGER,
    added_by TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS driving_assignments (
    id TEXT PRIMARY KEY,
    from_city TEXT NOT NULL,
    to_city TEXT NOT NULL,
    driver_name TEXT NOT NULL,
    estimated_hours REAL,
    date TEXT,
    notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS meeting_points (
    id TEXT PRIMARY KEY,
    stop_id TEXT REFERENCES stops(id),
    name TEXT NOT NULL,
    address TEXT,
    lat REAL,
    lng REAL,
    time TEXT,
    date TEXT,
    notes TEXT,
    added_by TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`);

// Add actual score columns to matches (may already exist)
try { sqlite.exec("ALTER TABLE matches ADD COLUMN actual_home_score INTEGER"); } catch {}
try { sqlite.exec("ALTER TABLE matches ADD COLUMN actual_away_score INTEGER"); } catch {}

console.log("  Tables ready.\n");

// ============ MIGRATIONS (populate new tables on existing databases) ============
const decisionsCount = (sqlite.prepare("SELECT count(*) as c FROM decisions").get() as { c: number }).c;
if (decisionsCount === 0) {
  const tripExists = (sqlite.prepare("SELECT count(*) as c FROM trip_settings").get() as { c: number }).c;
  if (tripExists > 0) {
    console.log("Populating decisions table...");
    const ts = new Date().toISOString();
    const decisions = [
      { q: "How do we get from DC to Nashville?", desc: "It's a 9+ hour drive. Flying is ~$110pp but adds airport logistics. Car needs to get there either way.", cat: "transport", opts: JSON.stringify([{text:"Fly (~$110pp, 1.5h)",votes:[]},{text:"Drive (9h 40m, scenic route)",votes:[]},{text:"One drives the car, two fly",votes:[]}]), status: "open", decided: null, sort: 1 },
      { q: "How do we get from Nashville to Miami?", desc: "Even longer than DC→Nashville. 11+ hours of driving. Could fly but car still needs to get to Miami for the return flight.", cat: "transport", opts: JSON.stringify([{text:"Drive — split over 2 days with an overnight stop",votes:[]},{text:"Drive straight through (11h 30m, take turns)",votes:[]},{text:"One drives, two fly (~$100pp)",votes:[]}]), status: "open", decided: null, sort: 2 },
      { q: "Key West overnight trip?", desc: "Greg found an Airstream motorhome on Airbnb (~$130/night, 3 beds). It's a 3.5hr drive from Miami each way.", cat: "activity", opts: JSON.stringify([{text:"Yes — book the Airstream, stay overnight",votes:["Greg"]},{text:"Yes — but day trip only (7hr round trip)",votes:[]},{text:"Skip it — not enough time",votes:[]}]), status: "open", decided: null, sort: 3 },
      { q: "NYC: where do we stay?", desc: "Manhattan is pricier but walkable. Brooklyn is cheaper with better food scene. Both have good transit to MetLife Stadium.", cat: "accommodation", opts: JSON.stringify([{text:"Manhattan — Times Square area",votes:[]},{text:"Manhattan — Lower East Side / East Village",votes:[]},{text:"Brooklyn — Williamsburg",votes:[]},{text:"Brooklyn — Downtown",votes:[]}]), status: "open", decided: null, sort: 4 },
      { q: "Match tickets: what's the plan?", desc: "FIFA ballot was unsuccessful for all 3 of us. Resale prices are $1000+. Last-minute sales phase is our best hope.", cat: "budget", opts: JSON.stringify([{text:"Keep trying — last-minute sales + check daily",votes:[]},{text:"Set a max budget ($500pp) and buy whatever we can",votes:[]},{text:"Give up on tickets — watch at fan parks/sports bars",votes:[]},{text:"Must get Scotland v Haiti — skip others if needed",votes:[]}]), status: "open", decided: null, sort: 5 },
      { q: "Daily budget per person?", desc: "Flights and free accommodation (Lisa's, Greg's sister) are sorted. This is for food, drinks, activities, transport.", cat: "budget", opts: JSON.stringify([{text:"$100/day — budget mode",votes:[]},{text:"$150/day — comfortable",votes:[]},{text:"$200/day — treat ourselves",votes:[]},{text:"No budget — YOLO it's the World Cup",votes:[]}]), status: "open", decided: null, sort: 6 },
      { q: "Nashville: route confirmed?", desc: "The group prefers Nashville over Atlanta. Confirming this means we commit to Nashville as stop 5.", cat: "route", opts: JSON.stringify([{text:"Yes — Nashville is locked in",votes:["Joe","Jonny","Greg"]},{text:"Reconsider — maybe Atlanta is better for matches",votes:[]}]), status: "decided", decided: "Yes — Nashville is locked in", sort: 0 },
    ];
    const insert = sqlite.prepare("INSERT INTO decisions (id, question, description, category, options, status, decided_option, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    let i = 0;
    for (const d of decisions) {
      const id = `dec_${Date.now()}_${i++}`;
      insert.run(id, d.q, d.desc, d.cat, d.opts, d.status, d.decided, d.sort, ts, ts);
    }
    console.log(`  ${decisions.length} decisions added.\n`);
  }
}

// ============ CHECK IF SEEDED ============
const count = (sqlite.prepare("SELECT count(*) as c FROM trip_settings").get() as { c: number }).c;
if (count > 0) {
  console.log("Database already seeded — done.");
  sqlite.close();
  process.exit(0);
}

console.log("Empty database — running seed...");
sqlite.close();

// Run the seed script as a child process
execSync("npx tsx scripts/seed.ts", { stdio: "inherit" });
