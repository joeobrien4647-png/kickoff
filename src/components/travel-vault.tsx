"use client";

import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from "react";
import {
  Shield,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Edit3,
  Plane,
  Car,
  Hotel,
  CreditCard,
  FileText,
  Phone,
  Lock,
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface VaultDocument {
  id: string;
  type: string;
  label: string;
  value: string;
  notes: string;
}

// ---------------------------------------------------------------------------
// Preset document categories
// ---------------------------------------------------------------------------

const DOCUMENT_TYPES = [
  { value: "passport", label: "Passport", icon: FileText, color: "text-wc-blue" },
  { value: "esta", label: "ESTA", icon: Shield, color: "text-wc-teal" },
  { value: "insurance", label: "Travel Insurance", icon: FileText, color: "text-wc-coral" },
  { value: "flight", label: "Flight Confirmation", icon: Plane, color: "text-wc-blue" },
  { value: "car", label: "Car Rental", icon: Car, color: "text-wc-gold" },
  { value: "hotel", label: "Hotel Confirmation", icon: Hotel, color: "text-wc-teal" },
  { value: "emergency", label: "Emergency Contact", icon: Phone, color: "text-wc-coral" },
  { value: "bank", label: "Bank / Card", icon: CreditCard, color: "text-wc-gold" },
  { value: "other", label: "Other", icon: Lock, color: "text-muted-foreground" },
] as const;

type DocumentTypeValue = (typeof DOCUMENT_TYPES)[number]["value"];

const STORAGE_KEY = "kickoff_vault";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getDocTypeConfig(type: string) {
  return DOCUMENT_TYPES.find((dt) => dt.value === type) ?? DOCUMENT_TYPES[8]; // fallback to "other"
}

/** Masks all but the last 4 characters of a value. */
function maskValue(value: string): string {
  if (value.length <= 4) return value.replace(/./g, "\u2022");
  return "\u2022".repeat(value.length - 4) + value.slice(-4);
}

// ---------------------------------------------------------------------------
// localStorage store (useSyncExternalStore for hydration-safe reads)
// ---------------------------------------------------------------------------

type Listener = () => void;

const vaultStore = {
  listeners: new Set<Listener>(),

  getSnapshot(): string {
    try {
      return localStorage.getItem(STORAGE_KEY) ?? "[]";
    } catch {
      return "[]";
    }
  },

  getServerSnapshot(): string {
    return "[]";
  },

  subscribe(listener: Listener): () => void {
    vaultStore.listeners.add(listener);

    // Also listen for cross-tab changes
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) listener();
    }
    window.addEventListener("storage", onStorage);

    return () => {
      vaultStore.listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  },

  write(docs: VaultDocument[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
    } catch {
      // Storage full or unavailable
    }
    // Notify all subscribers in this tab
    for (const listener of vaultStore.listeners) {
      listener();
    }
  },
};

function useVaultDocuments(): [VaultDocument[], (next: VaultDocument[]) => void] {
  const raw = useSyncExternalStore(
    vaultStore.subscribe,
    vaultStore.getSnapshot,
    vaultStore.getServerSnapshot,
  );

  let docs: VaultDocument[];
  try {
    docs = JSON.parse(raw);
  } catch {
    docs = [];
  }

  const setDocs = useCallback((next: VaultDocument[]) => {
    vaultStore.write(next);
  }, []);

  return [docs, setDocs];
}

// ---------------------------------------------------------------------------
// Document Card
// ---------------------------------------------------------------------------

function DocumentCard({
  doc,
  onEdit,
  onDelete,
}: {
  doc: VaultDocument;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const config = getDocTypeConfig(doc.type);
  const Icon = config.icon;

  function handleDelete() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    onDelete();
  }

  // Auto-dismiss the confirmation after 3 seconds
  useEffect(() => {
    if (!confirming) return;
    const timer = setTimeout(() => setConfirming(false), 3000);
    return () => clearTimeout(timer);
  }, [confirming]);

  return (
    <Card className="py-4 gap-3">
      <CardContent className="space-y-3">
        {/* Header row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Icon className={cn("size-4 shrink-0", config.color)} />
            <span className="text-sm font-semibold truncate">{doc.label}</span>
          </div>
          <Badge variant="secondary" className="text-[10px] shrink-0">
            {config.label}
          </Badge>
        </div>

        {/* Value row -- masked by default */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setRevealed((r) => !r)}
            className="flex items-center gap-2 min-w-0 group text-left"
            aria-label={revealed ? "Hide value" : "Reveal value"}
          >
            {revealed ? (
              <EyeOff className="size-3.5 text-muted-foreground shrink-0 group-hover:text-foreground transition-colors" />
            ) : (
              <Eye className="size-3.5 text-muted-foreground shrink-0 group-hover:text-foreground transition-colors" />
            )}
            <span
              className={cn(
                "font-mono text-sm tracking-wide break-all",
                revealed ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {revealed ? doc.value : maskValue(doc.value)}
            </span>
          </button>
        </div>

        {/* Notes */}
        {doc.notes && (
          <p className="text-xs text-muted-foreground leading-relaxed pl-5.5">
            {doc.notes}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1.5 pt-1">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onEdit}
            aria-label="Edit document"
          >
            <Edit3 className="size-3" />
          </Button>
          <Button
            variant={confirming ? "destructive" : "ghost"}
            size={confirming ? "xs" : "icon-xs"}
            onClick={handleDelete}
            aria-label={confirming ? "Confirm delete" : "Delete document"}
          >
            {confirming ? (
              <>
                <Trash2 className="size-3" />
                <span className="text-[10px]">Confirm</span>
              </>
            ) : (
              <Trash2 className="size-3" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Inner Form (mounted fresh via key when sheet opens)
// ---------------------------------------------------------------------------

function VaultFormFields({
  editingDoc,
  onSave,
  onClose,
}: {
  editingDoc: VaultDocument | null;
  onSave: (doc: VaultDocument) => void;
  onClose: () => void;
}) {
  const isEditing = editingDoc !== null;

  // Initial values derived from editingDoc (or defaults for add mode).
  // No effect needed -- this component remounts when the sheet key changes.
  const [type, setType] = useState<DocumentTypeValue>(
    (editingDoc?.type as DocumentTypeValue) ?? "passport"
  );
  const [label, setLabel] = useState(editingDoc?.label ?? "");
  const [value, setValue] = useState(editingDoc?.value ?? "");
  const [notes, setNotes] = useState(editingDoc?.notes ?? "");

  function handleTypeChange(newType: DocumentTypeValue) {
    setType(newType);
    if (!isEditing && !label.trim()) {
      setLabel(getDocTypeConfig(newType).label);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;

    onSave({
      id: editingDoc?.id ?? crypto.randomUUID(),
      type,
      label: label.trim() || getDocTypeConfig(type).label,
      value: value.trim(),
      notes: notes.trim(),
    });

    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      {/* Type */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Type</label>
        <Select value={type} onValueChange={(v) => handleTypeChange(v as DocumentTypeValue)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DOCUMENT_TYPES.map((dt) => (
              <SelectItem key={dt.value} value={dt.value}>
                {dt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Label */}
      <div className="space-y-1.5">
        <label htmlFor="vault-label" className="text-sm font-medium">
          Label
        </label>
        <Input
          id="vault-label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder={getDocTypeConfig(type).label}
        />
      </div>

      {/* Value */}
      <div className="space-y-1.5">
        <label htmlFor="vault-value" className="text-sm font-medium">
          Value <span className="text-destructive">*</span>
        </label>
        <Input
          id="vault-value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. ABC1234567"
          required
        />
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <label htmlFor="vault-notes" className="text-sm font-medium">
          Notes
        </label>
        <Input
          id="vault-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional — e.g. expiry date, phone number"
        />
      </div>

      <SheetFooter className="px-0">
        <Button type="submit" className="w-full" disabled={!value.trim()}>
          {isEditing ? "Save Changes" : "Add Document"}
        </Button>
      </SheetFooter>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Add / Edit Sheet
// ---------------------------------------------------------------------------

function VaultSheet({
  open,
  onOpenChange,
  editingDoc,
  formRevision,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingDoc: VaultDocument | null;
  /** Incremented by the parent each time the sheet opens, so the form remounts fresh. */
  formRevision: number;
  onSave: (doc: VaultDocument) => void;
}) {
  const isEditing = editingDoc !== null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {isEditing ? "Edit Document" : "Add Document"}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update this document reference."
              : "Store an important number or reference."}
          </SheetDescription>
        </SheetHeader>

        {open && (
          <VaultFormFields
            key={formRevision}
            editingDoc={editingDoc}
            onSave={onSave}
            onClose={() => onOpenChange(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// Empty State
// ---------------------------------------------------------------------------

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
      <div className="size-16 rounded-full bg-muted flex items-center justify-center">
        <Lock className="size-7 text-muted-foreground" />
      </div>
      <div className="space-y-1.5">
        <p className="text-sm font-semibold">No documents yet</p>
        <p className="text-xs text-muted-foreground max-w-[240px] mx-auto leading-relaxed">
          Add your passport, ESTA, hotel confirmations and other important
          references so they are always at your fingertips.
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={onAdd}>
        <Plus className="size-3.5" />
        Add your first document
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function TravelVault() {
  const [documents, setDocuments] = useVaultDocuments();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<VaultDocument | null>(null);
  const formRevisionRef = useRef(0);
  const [formRevision, setFormRevision] = useState(0);

  function handleSave(doc: VaultDocument) {
    const exists = documents.some((d) => d.id === doc.id);
    if (exists) {
      setDocuments(documents.map((d) => (d.id === doc.id ? doc : d)));
    } else {
      setDocuments([...documents, doc]);
    }
  }

  function handleDelete(id: string) {
    setDocuments(documents.filter((d) => d.id !== id));
  }

  function openAdd() {
    setEditingDoc(null);
    formRevisionRef.current += 1;
    setFormRevision(formRevisionRef.current);
    setSheetOpen(true);
  }

  function openEdit(doc: VaultDocument) {
    setEditingDoc(doc);
    formRevisionRef.current += 1;
    setFormRevision(formRevisionRef.current);
    setSheetOpen(true);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="pt-4 md:pt-6 space-y-1">
        <div className="flex items-center gap-2">
          <Shield className="size-6 text-wc-blue" />
          <h1 className="text-2xl font-bold">Travel Vault</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Keep all your important numbers in one place.
        </p>
      </section>

      {/* Privacy notice */}
      <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2.5">
        <Lock className="size-3.5 text-muted-foreground shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          Stored locally on your device &mdash; never sent to the server.
        </p>
      </div>

      {/* Document grid */}
      {documents.length === 0 ? (
        <EmptyState onAdd={openAdd} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onEdit={() => openEdit(doc)}
              onDelete={() => handleDelete(doc.id)}
            />
          ))}
        </div>
      )}

      {/* Floating add button */}
      <Button
        onClick={openAdd}
        size="icon-lg"
        className="fixed bottom-6 right-4 z-40 rounded-full shadow-lg bg-wc-blue text-white hover:bg-wc-blue/90"
        aria-label="Add document"
      >
        <Plus className="size-5" />
      </Button>

      {/* Add / Edit Sheet */}
      <VaultSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        editingDoc={editingDoc}
        formRevision={formRevision}
        onSave={handleSave}
      />
    </div>
  );
}
