"use client";

import { Tv, Globe, Smartphone, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function BroadcastGuideSection() {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Tv className="size-5 text-wc-blue" />
        <div>
          <h2 className="text-lg font-bold leading-none">How to Watch</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Every match, every channel, every app
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        {/* US Channels */}
        <Card className="py-3">
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <Tv className="size-4 text-wc-blue" />
              <p className="text-sm font-bold">In the US</p>
            </div>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">FOX</span> — Big matches:
                England, USA, Brazil, France, knockout rounds
              </p>
              <p>
                <span className="font-medium text-foreground">FS1</span> — Smaller group
                stage matches
              </p>
              <p>
                <span className="font-medium text-foreground">Telemundo</span> — Spanish
                commentary (every match)
              </p>
            </div>
            <p className="text-[10px] text-wc-gold font-medium">
              Most bars will have it on FOX — just ask the bartender.
            </p>
          </CardContent>
        </Card>

        {/* UK */}
        <Card className="py-3">
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <Globe className="size-4 text-wc-teal" />
              <p className="text-sm font-bold">For Family Back Home</p>
            </div>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">BBC</span> and{" "}
                <span className="font-medium text-foreground">ITV</span> share all WC
                rights. Every match is free-to-air.
              </p>
              <p>
                <span className="font-medium text-foreground">BBC iPlayer</span> and{" "}
                <span className="font-medium text-foreground">ITVX</span> for streaming.
              </p>
            </div>
            <p className="text-[10px] text-wc-teal font-medium">
              Tell your mum it&rsquo;s on BBC One. She&rsquo;ll find it.
            </p>
          </CardContent>
        </Card>

        {/* Streaming */}
        <Card className="py-3">
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <Smartphone className="size-4 text-wc-coral" />
              <p className="text-sm font-bold">Streaming (US)</p>
            </div>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Tubi</span> — FREE. Every
                match. Download before the trip.
              </p>
              <p>
                <span className="font-medium text-foreground">Fox Sports App</span> —
                Requires cable login (ask your hotel).
              </p>
              <p>
                <span className="font-medium text-foreground">Peacock</span> — Backup
                option, some matches.
              </p>
            </div>
            <p className="text-[10px] text-wc-coral font-medium">
              Tubi is the move. It&rsquo;s free, legal, and has every match.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Time zone reminder */}
      <div className="flex items-start gap-2 rounded-lg bg-wc-gold/5 border border-wc-gold/20 p-3">
        <Clock className="size-4 text-wc-gold shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-medium text-foreground">Time Zones</p>
          <p className="text-muted-foreground">
            All kickoff times in US Eastern. Add 5 hours for BST (UK time).
          </p>
          <p className="text-muted-foreground">
            A 3:00 PM kickoff here = 8:00 PM back home.
          </p>
        </div>
      </div>

      <Badge variant="outline" className="text-[10px] text-wc-gold border-wc-gold/30">
        England&rsquo;s matches are ALWAYS on main FOX (not FS1)
      </Badge>
    </section>
  );
}
