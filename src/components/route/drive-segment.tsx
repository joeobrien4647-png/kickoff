import { Car, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DriveInfo } from "@/app/route/page";

interface DriveSegmentProps {
  drive: DriveInfo;
}

const LONG_DRIVE_THRESHOLD_HOURS = 5;

export function DriveSegment({ drive }: DriveSegmentProps) {
  const totalHours = drive.hours + drive.minutes / 60;
  const isLong = totalHours > LONG_DRIVE_THRESHOLD_HOURS;

  const timeLabel =
    drive.minutes > 0
      ? `${drive.hours}h ${drive.minutes}m`
      : `${drive.hours}h`;

  return (
    <div className="relative flex items-center gap-3 py-3 pl-11">
      {/* Vertical dashed connector — height proportional to distance */}
      <div
        className="absolute left-[15px] top-0 w-px border-l-2 border-dashed border-muted"
        style={{ minHeight: `${Math.max(40, Math.min(140, (drive.miles / 665) * 140))}px` }}
      />

      {/* Car icon circle */}
      <div
        className={cn(
          "absolute left-0 flex size-8 shrink-0 items-center justify-center rounded-full border",
          isLong
            ? "bg-wc-coral/10 border-wc-coral/30"
            : "bg-muted/50 border-border"
        )}
      >
        <Car
          className={cn(
            "size-4",
            isLong ? "text-wc-coral" : "text-muted-foreground"
          )}
        />
      </div>

      {/* Drive info */}
      <div className="flex flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {drive.miles} mi &mdash; {timeLabel}
          </span>

          {isLong && (
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 border-wc-coral/30 text-wc-coral gap-1"
            >
              <AlertTriangle className="size-3" />
              Long drive
            </Badge>
          )}
        </div>

        {/* Distance bar — width proportional to longest drive (665 mi) */}
        <div
          className={cn("h-1 rounded-full", isLong ? "bg-wc-coral/40" : "bg-wc-blue/30")}
          style={{ width: `${Math.max(20, Math.min(100, (drive.miles / 665) * 100))}%` }}
        />
      </div>
    </div>
  );
}
