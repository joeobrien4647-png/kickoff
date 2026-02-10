"use client";

import { Button } from "@/components/ui/button";
import { Printer, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function PrintActions() {
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex items-center gap-2 mb-6 print:hidden">
      <Button variant="outline" size="sm" onClick={() => window.print()}>
        <Printer className="size-4 mr-2" /> Print
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={async () => {
          await navigator.clipboard.writeText(window.location.href);
          setCopied(true);
          toast.success("Link copied!");
          setTimeout(() => setCopied(false), 2000);
        }}
      >
        {copied ? (
          <Check className="size-4 mr-2" />
        ) : (
          <Copy className="size-4 mr-2" />
        )}
        {copied ? "Copied!" : "Copy Link"}
      </Button>
    </div>
  );
}
