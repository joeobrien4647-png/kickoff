"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Wifi, Eye, EyeOff, Copy, Pencil, Check, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface WifiAccommodation {
  id: string;
  name: string;
  wifiPassword: string | null;
  city: string;
}

interface WifiVaultProps {
  accommodations: WifiAccommodation[];
}

// ---------------------------------------------------------------------------
// Per-row component
// ---------------------------------------------------------------------------

function WifiRow({ accommodation }: { accommodation: WifiAccommodation }) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [password, setPassword] = useState(accommodation.wifiPassword ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/accommodations/${accommodation.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wifiPassword: password.trim() || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Wi-Fi password saved");
      setEditing(false);
      router.refresh();
    } catch {
      toast.error("Failed to save password");
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setPassword(accommodation.wifiPassword ?? "");
    setEditing(false);
  }

  async function handleCopy() {
    if (!accommodation.wifiPassword) return;
    try {
      await navigator.clipboard.writeText(accommodation.wifiPassword);
      toast.success("Copied!");
    } catch {
      toast.error("Failed to copy");
    }
  }

  // ── Editing mode ──
  if (editing) {
    return (
      <div className="flex items-center gap-2 py-2.5 px-3 border-b last:border-b-0">
        <Wifi className="size-3.5 text-muted-foreground shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium truncate">{accommodation.name}</p>
          <p className="text-[10px] text-muted-foreground">{accommodation.city}</p>
        </div>
        <Input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="h-7 text-xs w-32"
          autoFocus
        />
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={handleCancel}
          disabled={saving}
        >
          <X className="size-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={handleSave}
          disabled={saving}
        >
          <Check className="size-3" />
        </Button>
      </div>
    );
  }

  // ── Display mode ──
  return (
    <div className="flex items-center gap-2 py-2.5 px-3 border-b last:border-b-0">
      <Wifi
        className={cn(
          "size-3.5 shrink-0",
          accommodation.wifiPassword
            ? "text-emerald-500"
            : "text-muted-foreground/40"
        )}
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate">{accommodation.name}</p>
        <p className="text-[10px] text-muted-foreground">{accommodation.city}</p>
      </div>

      {accommodation.wifiPassword ? (
        <div className="flex items-center gap-1">
          <span className="text-xs font-mono tabular-nums max-w-[100px] truncate">
            {visible ? accommodation.wifiPassword : "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"}
          </span>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setVisible(!visible)}
          >
            {visible ? (
              <EyeOff className="size-3" />
            ) : (
              <Eye className="size-3" />
            )}
          </Button>
          <Button variant="ghost" size="icon-xs" onClick={handleCopy}>
            <Copy className="size-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setEditing(true)}
          >
            <Pencil className="size-3" />
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="xs"
          onClick={() => setEditing(true)}
          className="text-xs"
        >
          Add
        </Button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main vault component
// ---------------------------------------------------------------------------

export function WifiVault({ accommodations }: WifiVaultProps) {
  if (accommodations.length === 0) {
    return (
      <Card className="py-4">
        <CardContent className="text-center">
          <Wifi className="size-5 mx-auto text-muted-foreground/40 mb-2" />
          <p className="text-xs text-muted-foreground">
            No accommodations yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  const withPassword = accommodations.filter((a) => a.wifiPassword);
  const withoutPassword = accommodations.filter((a) => !a.wifiPassword);

  return (
    <Card className="py-0 overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2.5 border-b bg-muted/30">
          <Wifi className="size-3.5 text-muted-foreground" />
          <span className="text-xs font-medium">Wi-Fi Passwords</span>
          <span className="text-[10px] text-muted-foreground ml-auto">
            {withPassword.length}/{accommodations.length} saved
          </span>
        </div>

        {/* Rows: show ones with passwords first */}
        {withPassword.map((acc) => (
          <WifiRow key={acc.id} accommodation={acc} />
        ))}
        {withoutPassword.map((acc) => (
          <WifiRow key={acc.id} accommodation={acc} />
        ))}
      </CardContent>
    </Card>
  );
}
