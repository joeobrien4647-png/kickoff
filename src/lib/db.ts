import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import path from "path";
import fs from "fs";

const DATABASE_PATH = process.env.DATABASE_PATH || ".kickoff/kickoff.db";

// Ensure the .kickoff directory exists
const dbDir = path.dirname(DATABASE_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Singleton connection
let _sqlite: Database.Database | null = null;

function getSqlite(): Database.Database {
  if (!_sqlite) {
    _sqlite = new Database(DATABASE_PATH);

    // Enable WAL mode for better concurrent read performance
    _sqlite.pragma("journal_mode = WAL");
    // Enable foreign key constraints
    _sqlite.pragma("foreign_keys = ON");
    // Integrity check on first connection
    const integrity = _sqlite.pragma("integrity_check") as {
      integrity_check: string;
    }[];
    if (integrity[0]?.integrity_check !== "ok") {
      console.error("[DB] Integrity check failed:", integrity);
    }
  }
  return _sqlite;
}

export const sqlite = getSqlite();
export const db = drizzle(sqlite, { schema });
