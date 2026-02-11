"use client";

import {
  Shield,
  Phone,
  Hospital,
  Building2,
  AlertTriangle,
  MapPin,
  Smartphone,
  FileText,
  Lightbulb,
  Siren,
} from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { EMERGENCY_INFO, GENERAL_INFO } from "@/lib/emergency-info";
import type { CityEmergency } from "@/lib/emergency-info";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a Google Maps search URL from an address string. */
function mapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Format a phone number into a tel: href (strips non-digit chars except leading +). */
function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function PhoneLink({ number, className }: { number: string; className?: string }) {
  return (
    <a
      href={telHref(number)}
      className={className ?? "text-wc-blue hover:underline font-medium"}
    >
      {number}
    </a>
  );
}

function AddressLink({ address }: { address: string }) {
  return (
    <a
      href={mapsUrl(address)}
      target="_blank"
      rel="noopener noreferrer"
      className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2 decoration-muted-foreground/30"
    >
      {address}
    </a>
  );
}

// ---------------------------------------------------------------------------
// General Info Card
// ---------------------------------------------------------------------------

function GeneralInfoCard() {
  return (
    <div className="bg-card rounded-xl border shadow-sm p-5 space-y-5">
      <div className="flex items-center gap-2">
        <AlertTriangle className="size-4 text-wc-coral" />
        <h2 className="font-semibold text-sm">General Travel Info</h2>
      </div>

      {/* UK Emergency Abroad */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <Phone className="size-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            UK Emergency Abroad (FCO)
          </span>
        </div>
        <p className="text-sm pl-5.5">
          <PhoneLink number={GENERAL_INFO.ukEmergencyAbroad} />
        </p>
      </div>

      {/* Travel Insurance */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <FileText className="size-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Travel Insurance
          </span>
        </div>
        <p className="text-sm text-muted-foreground pl-5.5">
          {GENERAL_INFO.travelInsurance}
        </p>
      </div>

      {/* Important Documents */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FileText className="size-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Important Documents
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 pl-5.5">
          {GENERAL_INFO.importantDocs.map((doc) => (
            <Badge key={doc} variant="secondary" className="text-xs">
              {doc}
            </Badge>
          ))}
        </div>
      </div>

      {/* Useful Apps */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Smartphone className="size-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Useful Apps
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 pl-5.5">
          {GENERAL_INFO.usefulApps.map((app) => (
            <Badge key={app} variant="outline" className="text-xs">
              {app}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// City Emergency Card
// ---------------------------------------------------------------------------

function CityEmergencyCard({ info }: { info: CityEmergency }) {
  return (
    <div className="space-y-4 pt-2">
      {/* Emergency 911 */}
      <div className="bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-900/30 p-4 flex items-center gap-3">
        <Siren className="size-5 text-red-600 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-red-700 dark:text-red-400">
            Emergency: 911
          </p>
          <p className="text-xs text-red-600/80 dark:text-red-400/60">
            Police, Fire, Ambulance
          </p>
        </div>
      </div>

      {/* Hospital */}
      <div className="bg-card rounded-xl border shadow-sm p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Hospital className="size-4 text-wc-teal" />
          <h3 className="font-semibold text-sm">Nearest Hospital</h3>
        </div>
        <div className="pl-6 space-y-1">
          <p className="text-sm font-medium">{info.nearestHospital.name}</p>
          <p className="text-xs">
            <AddressLink address={info.nearestHospital.address} />
          </p>
          <p className="text-xs">
            <PhoneLink number={info.nearestHospital.phone} className="text-sm text-wc-blue hover:underline" />
          </p>
        </div>
      </div>

      {/* Urgent Care */}
      <div className="bg-card rounded-xl border shadow-sm p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Hospital className="size-4 text-wc-gold" />
          <h3 className="font-semibold text-sm">Urgent Care</h3>
        </div>
        <div className="pl-6 space-y-1">
          <p className="text-sm font-medium">{info.urgentCare.name}</p>
          <p className="text-xs">
            <AddressLink address={info.urgentCare.address} />
          </p>
          <p className="text-xs">
            <PhoneLink number={info.urgentCare.phone} className="text-sm text-wc-blue hover:underline" />
          </p>
        </div>
      </div>

      {/* UK Consulate */}
      <div className="bg-card rounded-xl border shadow-sm p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Building2 className="size-4 text-wc-coral" />
          <h3 className="font-semibold text-sm">UK Consulate / Embassy</h3>
        </div>
        <div className="pl-6 space-y-1">
          <p className="text-sm font-medium">{info.ukConsulate.name}</p>
          <p className="text-xs">
            <AddressLink address={info.ukConsulate.address} />
          </p>
          <p className="text-xs">
            <PhoneLink number={info.ukConsulate.phone} className="text-sm text-wc-blue hover:underline" />
          </p>
          <p className="text-xs text-muted-foreground">
            {info.ukConsulate.hours}
          </p>
        </div>
      </div>

      {/* Local Police (non-emergency) */}
      <div className="bg-card rounded-xl border shadow-sm p-4">
        <div className="flex items-center gap-2">
          <Shield className="size-4 text-muted-foreground" />
          <h3 className="font-semibold text-sm">Local Police (Non-Emergency)</h3>
        </div>
        <p className="text-sm pl-6 mt-1.5">
          <PhoneLink number={info.localPolice} />
        </p>
      </div>

      {/* Local Safety Tips */}
      <div className="bg-card rounded-xl border shadow-sm p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="size-4 text-wc-gold" />
          <h3 className="font-semibold text-sm">Local Safety Tips</h3>
        </div>
        <ul className="space-y-2.5 pl-6">
          {info.localTips.map((tip, i) => (
            <li key={i} className="flex gap-2.5 text-sm">
              <MapPin className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
              <span className="text-muted-foreground leading-relaxed">
                {tip}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main View
// ---------------------------------------------------------------------------

/** City slugs for tab values, in route order. */
const CITY_TABS = EMERGENCY_INFO.map((info) => ({
  value: info.city.toLowerCase().replace(/\s+/g, "-"),
  label: info.city,
  info,
}));

export function EmergencyView() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="pt-4 md:pt-6 space-y-1">
        <div className="flex items-center gap-2">
          <Shield className="size-6 text-wc-coral" />
          <h1 className="text-2xl font-bold">Emergency Info</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Essential contacts for each city on the road trip.
        </p>
      </section>

      {/* General Info */}
      <GeneralInfoCard />

      {/* Per-City Tabs */}
      <Tabs defaultValue={CITY_TABS[0].value}>
        <TabsList variant="line" className="w-full flex-wrap">
          {CITY_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {CITY_TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <CityEmergencyCard info={tab.info} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
