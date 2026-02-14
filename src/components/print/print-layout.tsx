"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export function PrintLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between pt-4 md:pt-6 mb-6 print:hidden">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Button onClick={() => window.print()} variant="outline" size="sm">
          <Printer className="size-4 mr-2" />
          Print
        </Button>
      </div>
      <div className="print:text-black print:bg-white">{children}</div>
    </div>
  );
}
