"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Phone,
  ExternalLink,
  Copy,
  Check,
  Pencil,
  Trash2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDate, formatTime } from "@/lib/dates";
import type { Reservation } from "@/lib/schema";

const TYPE_CONFIG: Record<string, { label: string; emoji: string; color: string }> = {
  restaurant: { label: "Restaurant", emoji: "\uD83C\uDF7D\uFE0F", color: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  bar: { label: "Bar", emoji: "\uD83C\uDF7A", color: "bg-purple-500/15 text-purple-400 border-purple-500/20" },
  tour: { label: "Tour", emoji: "\uD83D\uDDFA\uFE0F", color: "bg-sky-500/15 text-sky-400 border-sky-500/20" },
  activity: { label: "Activity", emoji: "\uD83C\uDFAF", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  other: { label: "Other", emoji: "\uD83D\uDCCC", color: "bg-muted text-muted-foreground border-muted" },
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  confirmed: { label: "Confirmed", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  pending: { label: "Pending", color: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  cancelled: { label: "Cancelled", color: "bg-red-500/15 text-red-400 border-red-500/20" },
};

interface ReservationCardProps {
  reservation: Reservation;
  onMutate: () => void;
  onEdit: (reservation: Reservation) => void;
}

export function ReservationCard({ reservation, onMutate, onEdit }: ReservationCardProps) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const typeInfo = TYPE_CONFIG[reservation.type] ?? TYPE_CONFIG.other;
  const statusInfo = STATUS_CONFIG[reservation.status] ?? STATUS_CONFIG.pending;
  const isCancelled = reservation.status === "cancelled";

  async function handleDelete() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setLoading(true);
    try {
      await fetch(`/api/reservations/${reservation.id}`, { method: "DELETE" });
      onMutate();
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  }

  async function copyRef() {
    if (!reservation.confirmationRef) return;
    await navigator.clipboard.writeText(reservation.confirmationRef);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card
      className={cn(
        "py-3 transition-colors hover:border-muted-foreground/20",
        isCancelled && "opacity-60"
      )}
    >
      <CardContent className="space-y-2">
        {/* Header: name + type badge + status badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-1.5">
            <h3
              className={cn(
                "font-semibold text-sm leading-tight",
                isCancelled && "line-through"
              )}
            >
              {typeInfo.emoji} {reservation.name}
            </h3>
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge
                variant="outline"
                className={cn("text-[10px] px-1.5 py-0", typeInfo.color)}
              >
                {typeInfo.label}
              </Badge>
              <Badge
                variant="outline"
                className={cn("text-[10px] px-1.5 py-0", statusInfo.color)}
              >
                {statusInfo.label}
              </Badge>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onEdit(reservation)}
              disabled={loading}
            >
              <Pencil className="size-3.5 text-muted-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={handleDelete}
              onBlur={() => setConfirming(false)}
              disabled={loading}
              className={cn(
                confirming
                  ? "text-destructive"
                  : "text-destructive/70 hover:text-destructive"
              )}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>

        {/* Date, time, party size */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1">
            <Calendar className="size-3" />
            {formatDate(reservation.date)}
          </span>
          {reservation.time && (
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {formatTime(reservation.time)}
            </span>
          )}
          {reservation.partySize && (
            <span className="flex items-center gap-1">
              <Users className="size-3" />
              {reservation.partySize}
            </span>
          )}
        </div>

        {/* Address with Google Maps link */}
        {reservation.address && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(reservation.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <MapPin className="size-3 shrink-0" />
            <span className="underline underline-offset-2">{reservation.address}</span>
          </a>
        )}

        {/* Phone */}
        {reservation.phone && (
          <a
            href={`tel:${reservation.phone}`}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Phone className="size-3 shrink-0" />
            <span className="underline underline-offset-2">{reservation.phone}</span>
          </a>
        )}

        {/* Confirmation ref (copyable) */}
        {reservation.confirmationRef && (
          <button
            onClick={copyRef}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? (
              <Check className="size-3 text-emerald-400" />
            ) : (
              <Copy className="size-3" />
            )}
            <span className="font-mono">{reservation.confirmationRef}</span>
          </button>
        )}

        {/* URL */}
        {reservation.url && (
          <a
            href={reservation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="size-3 shrink-0" />
            <span className="underline underline-offset-2 truncate">
              {reservation.url.replace(/^https?:\/\//, "").split("/")[0]}
            </span>
          </a>
        )}

        {/* Notes */}
        {reservation.notes && (
          <p className="text-xs text-muted-foreground leading-relaxed">
            {reservation.notes}
          </p>
        )}

        {/* Added by */}
        {reservation.addedBy && (
          <p className="text-[10px] text-muted-foreground/70">
            Added by {reservation.addedBy}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
