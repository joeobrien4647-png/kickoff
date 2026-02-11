import { db } from "@/lib/db";
import { activityLog } from "@/lib/schema";
import { generateId } from "@/lib/ulid";
import { now } from "@/lib/dates";

export function logActivity(
  action: string,
  entityType: string,
  entityId: string | null,
  description: string,
  actor: string
) {
  db.insert(activityLog)
    .values({
      id: generateId(),
      action,
      entityType,
      entityId,
      description,
      actor,
      createdAt: now(),
    })
    .run();
}
