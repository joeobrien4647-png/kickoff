"use client";

import { Tv, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getBroadcast, toBST } from "@/lib/broadcast-guide";

interface BroadcastBadgeProps {
  round: string | null;
  homeTeam: string;
  awayTeam: string;
  kickoff: string | null;
}

export function BroadcastBadge({ round, homeTeam, awayTeam, kickoff }: BroadcastBadgeProps) {
  const info = getBroadcast(round, homeTeam, awayTeam);
  const bst = toBST(kickoff);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="outline" className="text-[10px] gap-1 bg-wc-blue/8 text-wc-blue border-wc-blue/30">
        <Tv className="size-2.5" />
        {info.network}
      </Badge>
      {bst && (
        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Clock className="size-2.5" />
          {bst}
        </span>
      )}
    </div>
  );
}
