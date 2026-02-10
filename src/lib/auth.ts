import { cookies } from "next/headers";

const COOKIE_NAME = "kickoff_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export interface Session {
  tripCode: string;
  travelerId: string;
  travelerName: string;
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function buildSetCookieHeader(session: Session): string {
  return `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(session))}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`;
}

export function buildClearCookieHeader(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
