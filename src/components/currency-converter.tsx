"use client";

import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const RATE = 1.27; // 1 GBP = 1.27 USD

export function CurrencyConverter() {
  const [amount, setAmount] = useState("");
  const [isGbpToUsd, setIsGbpToUsd] = useState(true);

  const numericAmount = parseFloat(amount) || 0;
  const converted = isGbpToUsd
    ? numericAmount * RATE
    : numericAmount / RATE;

  const fromCurrency = isGbpToUsd ? "GBP" : "USD";
  const toCurrency = isGbpToUsd ? "USD" : "GBP";
  const fromSymbol = isGbpToUsd ? "\u00A3" : "$";
  const toSymbol = isGbpToUsd ? "$" : "\u00A3";

  return (
    <Card className="py-4">
      <CardContent className="space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Currency
        </p>

        {/* Input row */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              {fromSymbol}
            </span>
            <Input
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-7 tabular-nums"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsGbpToUsd((prev) => !prev)}
            aria-label={`Swap to ${toCurrency} to ${fromCurrency}`}
          >
            <ArrowLeftRight className="size-4" />
          </Button>
        </div>

        {/* Direction label */}
        <p className="text-xs text-muted-foreground text-center">
          {fromCurrency} &rarr; {toCurrency}
        </p>

        {/* Result */}
        {numericAmount > 0 && (
          <p className="text-center text-lg font-semibold tabular-nums">
            {toSymbol}
            {converted.toFixed(2)}
          </p>
        )}

        <p className="text-[10px] text-muted-foreground/60 text-center">
          Rate: 1 GBP = {RATE} USD
        </p>
      </CardContent>
    </Card>
  );
}
