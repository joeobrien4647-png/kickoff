"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Eye, EyeOff, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TripSettings, Traveler } from "@/lib/schema";
import { formatDate } from "@/lib/dates";

interface SettingsViewProps {
  trip: TripSettings | null;
  travelers: Traveler[];
}

export function SettingsView({ trip, travelers }: SettingsViewProps) {
  const { theme, setTheme } = useTheme();
  const [codeRevealed, setCodeRevealed] = useState(false);
  const [exporting, setExporting] = useState(false);

  const maskedCode = trip?.tripCode
    ? trip.tripCode.slice(0, 2) + "\u2022".repeat(trip.tripCode.length - 2)
    : "";

  async function handleExport() {
    setExporting(true);
    try {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Export failed");
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "kickoff-data.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Data exported successfully");
    } catch {
      toast.error("Failed to export data");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* ---- Section 1: Appearance ---- */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how Kickoff looks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <Moon className="size-5 text-muted-foreground" />
              ) : (
                <Sun className="size-5 text-muted-foreground" />
              )}
              <div>
                <p className="text-sm font-medium">Theme</p>
                <p className="text-xs text-muted-foreground">
                  {theme === "dark" ? "Dark" : "Light"} mode
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <>
                  <Sun className="size-4 mr-1.5" />
                  Light
                </>
              ) : (
                <>
                  <Moon className="size-4 mr-1.5" />
                  Dark
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ---- Section 2: Trip Info ---- */}
      <Card>
        <CardHeader>
          <CardTitle>Trip Info</CardTitle>
          <CardDescription>Your trip details (read-only)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {trip ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Trip Name</p>
                  <p className="text-sm font-medium">{trip.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Trip Code</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium font-mono">
                      {codeRevealed ? trip.tripCode : maskedCode}
                    </p>
                    <button
                      onClick={() => setCodeRevealed(!codeRevealed)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={
                        codeRevealed ? "Hide trip code" : "Reveal trip code"
                      }
                    >
                      {codeRevealed ? (
                        <EyeOff className="size-3.5" />
                      ) : (
                        <Eye className="size-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Dates</p>
                  <p className="text-sm font-medium">
                    {formatDate(trip.startDate)} &ndash;{" "}
                    {formatDate(trip.endDate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Currency</p>
                  <p className="text-sm font-medium">{trip.currency}</p>
                </div>
              </div>

              {travelers.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Travelers
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {travelers.map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5"
                      >
                        <span className="text-base">{t.emoji}</span>
                        <span
                          className="size-2.5 rounded-full"
                          style={{ backgroundColor: t.color }}
                        />
                        <span className="text-sm font-medium">{t.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              No trip configured yet.
            </p>
          )}
        </CardContent>
      </Card>

      {/* ---- Section 3: Data Export ---- */}
      <Card>
        <CardHeader>
          <CardTitle>Data Export</CardTitle>
          <CardDescription>
            Download all trip data as a JSON file
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={exporting}
          >
            <Download className="size-4 mr-1.5" />
            {exporting ? "Exporting..." : "Export All Data"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
