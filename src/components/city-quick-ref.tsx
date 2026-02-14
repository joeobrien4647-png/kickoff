"use client";

import { useState } from "react";
import {
  MapPin,
  Phone,
  Hospital,
  Shield,
  Train,
  Car,
  Landmark,
  ChevronDown,
  Flag,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getCityIdentity } from "@/lib/constants";
import { CITY_EMERGENCY, type CityEmergencyInfo } from "@/lib/city-emergency";

// ── Single reference card ───────────────────────────────────────────

function RefCard({ info }: { info: CityEmergencyInfo }) {
  const [open, setOpen] = useState(false);
  const identity = getCityIdentity(info.city);

  return (
    <Card className="py-0 overflow-hidden">
      {/* Tap to expand header */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex items-center justify-between w-full px-4 py-3 text-left transition-colors",
          "bg-gradient-to-r",
          identity.gradient
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          <MapPin className={cn("size-4 shrink-0", identity.color)} />
          <span className="font-bold text-sm">{info.city}</span>
        </div>
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground transition-transform shrink-0",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <CardContent className="space-y-4 py-3">
          {/* Emergency Numbers */}
          <div className="rounded-lg border border-wc-coral/30 bg-wc-coral/5 p-3 space-y-1.5">
            <p className="text-xs font-bold text-wc-coral flex items-center gap-1.5">
              <Phone className="size-3" />
              Emergency
            </p>
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">911</span> — Police,
              Fire, Ambulance (free from any phone)
            </p>
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">112</span> — Also
              works (redirects to 911)
            </p>
          </div>

          {/* Hospital */}
          <InfoRow
            icon={Hospital}
            iconColor="text-wc-coral"
            label="Nearest Hospital"
            name={info.hospital.name}
            detail={info.hospital.address}
            phone={info.hospital.phone}
          />

          {/* UK Consulate */}
          <InfoRow
            icon={Flag}
            iconColor="text-wc-blue"
            label="UK Consulate"
            name={info.ukConsulate.name}
            detail={info.ukConsulate.address}
            phone={info.ukConsulate.phone}
          />

          {/* Police */}
          <InfoRow
            icon={Shield}
            iconColor="text-wc-gold"
            label="Local Police"
            name={info.police.precinct}
            detail={info.police.address}
            phone={info.police.phone}
          />

          {/* Transit */}
          <div className="space-y-1.5">
            <p className="text-xs font-bold flex items-center gap-1.5">
              <Train className="size-3 text-wc-teal" />
              Getting Around
            </p>
            <Badge
              variant="outline"
              className="text-[10px] bg-wc-teal/8 text-wc-teal border-wc-teal/30"
            >
              {info.transit.app}
            </Badge>
            <ul className="space-y-1 ml-1">
              {info.transit.tips.map((tip) => (
                <li
                  key={tip}
                  className="text-xs text-muted-foreground flex gap-1.5"
                >
                  <span className="text-muted-foreground/40 shrink-0">•</span>
                  {tip}
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground flex items-start gap-1.5 mt-1">
              <Car className="size-3 shrink-0 mt-0.5 text-muted-foreground" />
              {info.uber}
            </p>
          </div>

          {/* Stadium */}
          <div className="space-y-1.5">
            <p className="text-xs font-bold flex items-center gap-1.5">
              <Landmark className="size-3 text-wc-gold" />
              Stadium
            </p>
            <p className="text-xs">
              <span className="font-medium">{info.stadium.name}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              {info.stadium.address}
            </p>
            <p className="text-xs text-muted-foreground">
              {info.stadium.nearestTransit}
            </p>
          </div>

          {/* Key Areas */}
          <div className="space-y-1.5">
            <p className="text-xs font-bold">Key Neighborhoods</p>
            <div className="grid grid-cols-2 gap-1.5">
              {info.keyAreas.map((area) => (
                <div
                  key={area.name}
                  className="rounded border border-border p-2"
                >
                  <p className="text-xs font-medium">{area.name}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">
                    {area.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

// ── Reusable info row ───────────────────────────────────────────────

function InfoRow({
  icon: Icon,
  iconColor,
  label,
  name,
  detail,
  phone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  label: string;
  name: string;
  detail: string;
  phone: string;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-bold flex items-center gap-1.5">
        <Icon className={cn("size-3", iconColor)} />
        {label}
      </p>
      <p className="text-xs font-medium">{name}</p>
      <p className="text-xs text-muted-foreground">{detail}</p>
      <a
        href={`tel:${phone.replace(/[^+\d]/g, "")}`}
        className="text-xs text-wc-teal hover:underline"
      >
        {phone}
      </a>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────

export function CityQuickRef() {
  const cities = Object.values(CITY_EMERGENCY);

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-bold">City Quick Reference</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Emergency contacts, transit, and key info — works offline
        </p>
      </div>

      <div className="space-y-2">
        {cities.map((info) => (
          <RefCard key={info.city} info={info} />
        ))}
      </div>

      <p className="text-[10px] text-muted-foreground text-center">
        Save this page for offline access. Tap a city to expand.
      </p>
    </section>
  );
}
