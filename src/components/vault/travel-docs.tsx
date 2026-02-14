"use client";

import { useState, useCallback, useSyncExternalStore } from "react";
import {
  FileText,
  Eye,
  EyeOff,
  Edit3,
  Save,
  X,
  Shield,
  AlertTriangle,
  Phone,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronDown,
  User,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TravelerDocs {
  passportNumber: string;
  passportExpiry: string;
  estaNumber: string;
  estaStatus: "approved" | "pending" | "rejected" | "";
  insurancePolicyNumber: string;
  insuranceEmergencyPhone: string;
}

interface AllTravelDocs {
  joe: TravelerDocs;
  jonny: TravelerDocs;
  greg: TravelerDocs;
}

type TravelerKey = keyof AllTravelDocs;

const TRAVELERS: { key: TravelerKey; name: string }[] = [
  { key: "joe", name: "Joe" },
  { key: "jonny", name: "Jonny" },
  { key: "greg", name: "Greg" },
];

const EMPTY_TRAVELER: TravelerDocs = {
  passportNumber: "",
  passportExpiry: "",
  estaNumber: "",
  estaStatus: "",
  insurancePolicyNumber: "",
  insuranceEmergencyPhone: "",
};

const EMPTY_DOCS: AllTravelDocs = {
  joe: { ...EMPTY_TRAVELER },
  jonny: { ...EMPTY_TRAVELER },
  greg: { ...EMPTY_TRAVELER },
};

const ESTA_STATUS_CONFIG = {
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-0",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-0",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-red-500/15 text-red-500 border-0",
  },
  "": {
    label: "Not Set",
    icon: Clock,
    className: "bg-muted text-muted-foreground border-0",
  },
} as const;

const REMINDERS = [
  {
    text: "ESTA must be approved BEFORE you fly",
    severity: "critical" as const,
  },
  {
    text: "Passport must be valid for at least 6 months after entry",
    severity: "critical" as const,
  },
  {
    text: "Carry a printed copy of your ESTA approval",
    severity: "important" as const,
  },
  {
    text: "Travel insurance is NOT optional \u2014 US healthcare costs are insane",
    severity: "critical" as const,
  },
];

const STORAGE_KEY = "kickoff_travel_docs";

// ---------------------------------------------------------------------------
// localStorage store (hydration-safe via useSyncExternalStore)
// ---------------------------------------------------------------------------

type Listener = () => void;

const docsStore = {
  listeners: new Set<Listener>(),

  getSnapshot(): string {
    try {
      return localStorage.getItem(STORAGE_KEY) ?? "null";
    } catch {
      return "null";
    }
  },

  getServerSnapshot(): string {
    return "null";
  },

  subscribe(listener: Listener): () => void {
    docsStore.listeners.add(listener);

    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) listener();
    }
    window.addEventListener("storage", onStorage);

    return () => {
      docsStore.listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  },

  write(data: AllTravelDocs) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Storage full or unavailable
    }
    for (const listener of docsStore.listeners) {
      listener();
    }
  },
};

function useTravelDocs(): [AllTravelDocs, (next: AllTravelDocs) => void] {
  const raw = useSyncExternalStore(
    docsStore.subscribe,
    docsStore.getSnapshot,
    docsStore.getServerSnapshot,
  );

  let data: AllTravelDocs;
  try {
    const parsed = JSON.parse(raw);
    data = parsed ?? EMPTY_DOCS;
  } catch {
    data = EMPTY_DOCS;
  }

  const setData = useCallback((next: AllTravelDocs) => {
    docsStore.write(next);
  }, []);

  return [data, setData];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Masks all but the last 4 characters: ****1234 */
function maskValue(value: string): string {
  if (!value) return "";
  if (value.length <= 4) return "\u2022".repeat(value.length);
  return "\u2022".repeat(value.length - 4) + value.slice(-4);
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// ---------------------------------------------------------------------------
// Traveler Section (collapsible)
// ---------------------------------------------------------------------------

function TravelerSection({
  traveler,
  docs,
  allDocs,
  onSave,
}: {
  traveler: { key: TravelerKey; name: string };
  docs: TravelerDocs;
  allDocs: AllTravelDocs;
  onSave: (next: AllTravelDocs) => void;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [form, setForm] = useState<TravelerDocs>(docs);

  const hasData = docs.passportNumber || docs.estaNumber || docs.insurancePolicyNumber;
  const estaConfig = ESTA_STATUS_CONFIG[docs.estaStatus || ""];
  const EstaIcon = estaConfig.icon;

  function update(field: keyof TravelerDocs, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleEdit() {
    setForm(docs);
    setEditing(true);
    if (!open) setOpen(true);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    onSave({ ...allDocs, [traveler.key]: form });
    setEditing(false);
  }

  function handleCancel() {
    setForm(docs);
    setEditing(false);
  }

  return (
    <div className="rounded-lg border bg-muted/30">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between px-3 py-2.5 text-sm font-medium hover:bg-muted/50 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-2">
          <User className="size-3.5 text-muted-foreground" />
          <span>{traveler.name}</span>
          {docs.estaStatus && (
            <Badge className={cn("text-[10px] gap-1", estaConfig.className)}>
              <EstaIcon className="size-2.5" />
              ESTA {estaConfig.label}
            </Badge>
          )}
        </div>
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="px-3 pb-3 pt-0">
          {editing ? (
            /* Edit form */
            <form onSubmit={handleSave} className="space-y-3 pt-2">
              <div className="space-y-1.5">
                <label htmlFor={`${traveler.key}-passport`} className="text-xs font-medium">
                  Passport Number
                </label>
                <Input
                  id={`${traveler.key}-passport`}
                  value={form.passportNumber}
                  onChange={(e) => update("passportNumber", e.target.value)}
                  placeholder="e.g. 123456789"
                  className="font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor={`${traveler.key}-passport-expiry`} className="text-xs font-medium">
                  Passport Expiry
                </label>
                <Input
                  id={`${traveler.key}-passport-expiry`}
                  type="date"
                  value={form.passportExpiry}
                  onChange={(e) => update("passportExpiry", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor={`${traveler.key}-esta`} className="text-xs font-medium">
                  ESTA Application Number
                </label>
                <Input
                  id={`${traveler.key}-esta`}
                  value={form.estaNumber}
                  onChange={(e) => update("estaNumber", e.target.value)}
                  placeholder="e.g. U9A123456789"
                  className="font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium">ESTA Status</label>
                <Select
                  value={form.estaStatus || "none"}
                  onValueChange={(v) => update("estaStatus", v === "none" ? "" : v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Not Set</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor={`${traveler.key}-insurance`} className="text-xs font-medium">
                  Travel Insurance Policy #
                </label>
                <Input
                  id={`${traveler.key}-insurance`}
                  value={form.insurancePolicyNumber}
                  onChange={(e) => update("insurancePolicyNumber", e.target.value)}
                  placeholder="e.g. POL-12345678"
                  className="font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor={`${traveler.key}-insurance-phone`} className="text-xs font-medium">
                  Insurance Emergency Phone
                </label>
                <Input
                  id={`${traveler.key}-insurance-phone`}
                  type="tel"
                  value={form.insuranceEmergencyPhone}
                  onChange={(e) => update("insuranceEmergencyPhone", e.target.value)}
                  placeholder="e.g. +44 800 123 4567"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Button type="submit" size="xs" className="flex-1">
                  <Save className="size-3" />
                  Save
                </Button>
                <Button type="button" variant="outline" size="xs" onClick={handleCancel}>
                  <X className="size-3" />
                  Cancel
                </Button>
              </div>
            </form>
          ) : hasData ? (
            /* Display mode */
            <div className="space-y-2 pt-1">
              {/* Reveal toggle */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setRevealed((r) => !r)}
                  className="flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={revealed ? "Hide sensitive fields" : "Show sensitive fields"}
                >
                  {revealed ? (
                    <EyeOff className="size-3" />
                  ) : (
                    <Eye className="size-3" />
                  )}
                  {revealed ? "Hide details" : "Show details"}
                </button>
                <Button variant="ghost" size="icon-xs" onClick={handleEdit} aria-label="Edit">
                  <Edit3 className="size-3" />
                </Button>
              </div>

              {docs.passportNumber && (
                <div className="py-1.5 border-b border-border/50">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                    Passport
                  </p>
                  <p className="text-xs font-mono font-medium mt-0.5 tracking-wide">
                    {revealed ? docs.passportNumber : maskValue(docs.passportNumber)}
                  </p>
                  {docs.passportExpiry && (
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Expires: {formatDate(docs.passportExpiry)}
                    </p>
                  )}
                </div>
              )}

              {docs.estaNumber && (
                <div className="py-1.5 border-b border-border/50">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                    ESTA
                  </p>
                  <p className="text-xs font-mono font-medium mt-0.5 tracking-wide">
                    {revealed ? docs.estaNumber : maskValue(docs.estaNumber)}
                  </p>
                  {docs.estaStatus && (
                    <div className="mt-1">
                      <Badge className={cn("text-[10px] gap-1", estaConfig.className)}>
                        <EstaIcon className="size-2.5" />
                        {estaConfig.label}
                      </Badge>
                    </div>
                  )}
                </div>
              )}

              {docs.insurancePolicyNumber && (
                <div className="py-1.5 border-b border-border/50 last:border-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                    Travel Insurance
                  </p>
                  <p className="text-xs font-mono font-medium mt-0.5 tracking-wide">
                    {revealed ? docs.insurancePolicyNumber : maskValue(docs.insurancePolicyNumber)}
                  </p>
                  {docs.insuranceEmergencyPhone && (
                    <a
                      href={`tel:${docs.insuranceEmergencyPhone}`}
                      className="inline-flex items-center gap-1 text-[10px] text-wc-blue hover:underline mt-1"
                    >
                      <Phone className="size-2.5" />
                      {docs.insuranceEmergencyPhone}
                    </a>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Empty state for this traveler */
            <div className="py-4 text-center">
              <p className="text-xs text-muted-foreground mb-2">
                No documents added yet
              </p>
              <Button variant="outline" size="xs" onClick={handleEdit}>
                <Edit3 className="size-3" />
                Add Details
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

interface TravelDocsProps {
  className?: string;
}

export function TravelDocs({ className }: TravelDocsProps) {
  const [docs, setDocs] = useTravelDocs();

  return (
    <Card className={cn("py-4", className)}>
      <CardContent className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-wc-blue" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              ESTA &amp; Travel Documents
            </p>
          </div>
          <Badge className="bg-red-500/15 text-red-500 border-0 text-[10px]">
            Essential
          </Badge>
        </div>

        {/* Important reminders callout */}
        <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2.5 space-y-1.5">
          <div className="flex items-start gap-2">
            <AlertTriangle className="size-3.5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
              Important Reminders
            </p>
          </div>
          <ul className="space-y-1 ml-5.5">
            {REMINDERS.map((reminder) => (
              <li
                key={reminder.text}
                className={cn(
                  "text-[11px]",
                  reminder.severity === "critical"
                    ? "text-amber-700/90 dark:text-amber-300/90 font-medium"
                    : "text-amber-700/80 dark:text-amber-300/80"
                )}
              >
                {reminder.text}
              </li>
            ))}
          </ul>
        </div>

        {/* Privacy notice */}
        <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
          <Shield className="size-3 text-muted-foreground shrink-0" />
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Stored locally on your device &mdash; never sent to the server. Sensitive fields are masked by default.
          </p>
        </div>

        {/* Traveler sections */}
        <div className="space-y-2">
          {TRAVELERS.map((traveler) => (
            <TravelerSection
              key={traveler.key}
              traveler={traveler}
              docs={docs[traveler.key]}
              allDocs={docs}
              onSave={setDocs}
            />
          ))}
        </div>

        {/* Emergency numbers */}
        <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
          <p className="text-xs font-semibold flex items-center gap-1.5">
            <Phone className="size-3 text-wc-coral" />
            Emergency Numbers
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="space-y-0.5">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                UK Foreign Office (Abroad)
              </p>
              <a
                href="tel:+442070085000"
                className="text-xs font-mono font-medium text-wc-blue hover:underline"
              >
                +44 20 7008 5000
              </a>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                US Emergency
              </p>
              <a
                href="tel:911"
                className="text-xs font-mono font-medium text-wc-coral hover:underline"
              >
                911
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
