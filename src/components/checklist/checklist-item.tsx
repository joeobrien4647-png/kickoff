"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  DollarSign,
  Hash,
  StickyNote,
  User,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Logistics } from "@/lib/schema";

const PRIORITY_DOT: Record<number, string> = {
  3: "bg-red-400",
  2: "bg-amber-400",
  1: "bg-wc-blue",
  0: "bg-muted-foreground/50",
};

const PRIORITY_LABEL: Record<number, string> = {
  3: "Urgent",
  2: "High",
  1: "Normal",
  0: "Low",
};

const STATUS_CYCLE: Record<string, string> = {
  todo: "in_progress",
  in_progress: "done",
  done: "todo",
};

function formatDueDate(dateStr: string): { label: string; className: string } {
  const due = new Date(dateStr + "T12:00:00");
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  const diffMs = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  const formatted = due.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });

  if (diffDays < 0) {
    return { label: "Overdue!", className: "text-red-400 font-medium" };
  }
  if (diffDays <= 7) {
    return { label: `Due ${formatted}`, className: "text-amber-400" };
  }
  return { label: `Due ${formatted}`, className: "text-muted-foreground" };
}

interface ChecklistItemProps {
  item: Logistics;
  onStatusChange: (id: string, status: string) => void;
  onEdit: (item: Logistics) => void;
}

export function ChecklistItem({ item, onStatusChange, onEdit }: ChecklistItemProps) {
  const [expanded, setExpanded] = useState(false);

  const isDone = item.status === "done";
  const hasDetails = !!(item.notes || item.confirmationRef || item.url || item.cost != null);

  function handleStatusClick(e: React.MouseEvent) {
    e.stopPropagation();
    const nextStatus = STATUS_CYCLE[item.status] || "todo";
    onStatusChange(item.id, nextStatus);
  }

  return (
    <Card
      className={cn(
        "py-0 transition-colors hover:border-muted-foreground/20 cursor-pointer",
        isDone && "opacity-60",
        item.dueDate && !isDone && formatDueDate(item.dueDate).className === "text-red-400 font-medium" &&
          "border-l-red-400 border-l-2"
      )}
      onClick={() => onEdit(item)}
    >
      <CardContent className="py-3 space-y-2">
        {/* Main row */}
        <div className="flex items-center gap-3">
          {/* Status checkbox */}
          <button
            onClick={handleStatusClick}
            className={cn(
              "shrink-0 size-5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md transition-colors",
              "hover:bg-accent"
            )}
            aria-label={`Mark as ${STATUS_CYCLE[item.status]}`}
          >
            <span
              className={cn(
                "size-5 rounded-md border-2 flex items-center justify-center transition-all",
                item.status === "done" && "bg-wc-teal border-wc-teal",
                item.status === "in_progress" && "border-wc-coral bg-wc-coral/20",
                item.status === "todo" && "border-muted-foreground/40"
              )}
            >
              {item.status === "done" && (
                <svg className="size-3 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 6l3 3 5-5" />
                </svg>
              )}
              {item.status === "in_progress" && (
                <span className="size-2 rounded-sm bg-wc-coral" />
              )}
            </span>
          </button>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-sm font-medium leading-tight truncate",
                  isDone && "line-through text-muted-foreground"
                )}
              >
                {item.title}
              </span>
              {/* Priority dot */}
              <span
                className={cn(
                  "size-2 rounded-full shrink-0",
                  PRIORITY_DOT[item.priority] || PRIORITY_DOT[0]
                )}
                title={PRIORITY_LABEL[item.priority] || "Low"}
              />
            </div>

            {/* Meta row */}
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              {item.dueDate && !isDone && (
                <span className={cn("text-[11px]", formatDueDate(item.dueDate).className)}>
                  {formatDueDate(item.dueDate).label}
                </span>
              )}
              {item.assignedTo && (
                <span className="text-[11px] text-muted-foreground flex items-center gap-0.5">
                  <User className="size-2.5" />
                  {item.assignedTo}
                </span>
              )}
              {item.confirmationRef && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  Ref
                </Badge>
              )}
            </div>
          </div>

          {/* Expand toggle */}
          {hasDetails && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              className="shrink-0 p-1 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={expanded ? "Collapse" : "Expand"}
            >
              {expanded ? (
                <ChevronUp className="size-4" />
              ) : (
                <ChevronDown className="size-4" />
              )}
            </button>
          )}
        </div>

        {/* Expanded details */}
        {expanded && hasDetails && (
          <div className="ml-[56px] space-y-1.5 pt-1.5 border-t border-border text-xs text-muted-foreground">
            {item.notes && (
              <p className="flex items-start gap-1.5">
                <StickyNote className="size-3 shrink-0 mt-0.5" />
                {item.notes}
              </p>
            )}
            {item.confirmationRef && (
              <p className="flex items-center gap-1.5 font-mono">
                <Hash className="size-3 shrink-0" />
                {item.confirmationRef}
              </p>
            )}
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-wc-blue hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="size-3 shrink-0" />
                {(() => {
                  try { return new URL(item.url).hostname; }
                  catch { return item.url; }
                })()}
              </a>
            )}
            {item.cost != null && (
              <p className="flex items-center gap-1.5">
                <DollarSign className="size-3 shrink-0" />
                ${item.cost.toFixed(2)}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
