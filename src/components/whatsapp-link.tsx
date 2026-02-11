"use client";

import { MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const WHATSAPP_URL =
  "https://wa.me/?text=Hey%20lads%20%F0%9F%8F%86";

export function WhatsAppLink() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <Card className="border-green-500/20 bg-green-500/5 py-4 transition-colors hover:bg-green-500/10">
        <CardContent className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-green-500/15">
            <MessageCircle className="size-5 text-green-600" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium">WhatsApp Group</p>
            <p className="text-xs text-muted-foreground">
              Message the lads
            </p>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}
