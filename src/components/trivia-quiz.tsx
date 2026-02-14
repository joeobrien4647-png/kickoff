"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import {
  Trophy,
  Star,
  ChevronRight,
  Check,
  X,
  Lightbulb,
  Share2,
  RotateCcw,
  Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  TRIVIA_QUESTIONS,
  TRIVIA_CATEGORIES,
  type TriviaCategory,
  type TriviaQuestion,
} from "@/lib/trivia";

// ── Constants ──────────────────────────────────────────────────────────
const STORAGE_KEY = "kickoff_trivia_best";
const QUICK_COUNT = 5;
const FULL_COUNT = 10;

const CATEGORY_COLORS: Record<TriviaCategory, string> = {
  history: "bg-wc-gold/15 text-wc-gold border-wc-gold/30",
  players: "bg-wc-teal/15 text-wc-teal border-wc-teal/30",
  hosts: "bg-wc-blue/15 text-wc-blue border-wc-blue/30",
  records: "bg-wc-coral/15 text-wc-coral border-wc-coral/30",
  england: "bg-red-500/15 text-red-400 border-red-500/30",
  culture: "bg-purple-500/15 text-purple-400 border-purple-500/30",
};

type QuizMode = "start" | "playing" | "results";

interface AnswerRecord {
  questionId: number;
  selectedIndex: number;
  correct: boolean;
  category: TriviaCategory;
}

// ── Helpers ────────────────────────────────────────────────────────────

/** Fisher-Yates shuffle */
function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getPerformanceMessage(score: number, total: number) {
  const ratio = score / total;
  if (ratio === 1) return "Perfect score! You're a World Cup encyclopedia!";
  if (ratio >= 0.7) return "Impressive! The lads will be jealous.";
  if (ratio >= 0.4) return "Not bad! You know your stuff.";
  return "Might want to brush up before kickoff...";
}

function loadBestScore(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw == null) return null;
    const parsed = JSON.parse(raw);
    return typeof parsed === "number" ? parsed : null;
  } catch {
    return null;
  }
}

function saveBestScore(score: number, total: number) {
  if (typeof window === "undefined") return;
  try {
    const prev = loadBestScore();
    // Store as a ratio * 100 so different quiz lengths are comparable
    const pct = Math.round((score / total) * 100);
    if (prev == null || pct > prev) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pct));
    }
  } catch {
    // silently ignore
  }
}

// ── Component ──────────────────────────────────────────────────────────

export function TriviaQuiz() {
  const [mode, setMode] = useState<QuizMode>("start");
  const [selectedCategories, setSelectedCategories] = useState<Set<TriviaCategory>>(
    new Set()
  );
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [bestScorePct, setBestScorePct] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Load best score on mount
  useEffect(() => {
    setBestScorePct(loadBestScore());
  }, []);

  // ── Derived ────────────────────────────────────────────────────────
  const currentQuestion = questions[currentIndex] ?? null;
  const isAnswered = selectedOption !== null;
  const isCorrect =
    isAnswered && currentQuestion
      ? selectedOption === currentQuestion.correctIndex
      : false;

  const score = useMemo(
    () => answers.filter((a) => a.correct).length,
    [answers]
  );

  const categoryBreakdown = useMemo(() => {
    const map = new Map<TriviaCategory, { correct: number; total: number }>();
    for (const a of answers) {
      const entry = map.get(a.category) ?? { correct: 0, total: 0 };
      entry.total++;
      if (a.correct) entry.correct++;
      map.set(a.category, entry);
    }
    return map;
  }, [answers]);

  // ── Actions ────────────────────────────────────────────────────────

  const toggleCategory = useCallback((cat: TriviaCategory) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }, []);

  const startQuiz = useCallback(
    (count: number) => {
      const pool =
        selectedCategories.size === 0
          ? TRIVIA_QUESTIONS
          : TRIVIA_QUESTIONS.filter((q) => selectedCategories.has(q.category));

      const picked = shuffle(pool).slice(0, Math.min(count, pool.length));
      setQuestions(picked);
      setCurrentIndex(0);
      setAnswers([]);
      setSelectedOption(null);
      setMode("playing");
    },
    [selectedCategories]
  );

  const handleAnswer = useCallback(
    (optionIndex: number) => {
      if (isAnswered || !currentQuestion) return;
      setSelectedOption(optionIndex);
      const correct = optionIndex === currentQuestion.correctIndex;
      setAnswers((prev) => [
        ...prev,
        {
          questionId: currentQuestion.id,
          selectedIndex: optionIndex,
          correct,
          category: currentQuestion.category,
        },
      ]);
    },
    [isAnswered, currentQuestion]
  );

  const nextQuestion = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      // Quiz complete
      const finalScore = answers.filter((a) => a.correct).length;
      saveBestScore(finalScore, questions.length);
      setBestScorePct(loadBestScore());
      setMode("results");
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
    }
  }, [currentIndex, questions.length, answers]);

  const resetQuiz = useCallback(() => {
    setMode("start");
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedOption(null);
    setCopied(false);
  }, []);

  const shareScore = useCallback(async () => {
    const text = `I scored ${score}/${questions.length} on World Cup Trivia! Think you can beat me? \u{1F3C6}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: ignore silently
    }
  }, [score, questions.length]);

  // ── Render: Start ──────────────────────────────────────────────────

  if (mode === "start") {
    return (
      <Card className="py-4">
        <CardContent className="space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-xl bg-wc-gold/15">
              <Trophy className="size-5 text-wc-gold" />
            </div>
            <div>
              <h2 className="text-base font-bold">World Cup Trivia</h2>
              <p className="text-xs text-muted-foreground">
                Test your knowledge before the real thing
              </p>
            </div>
          </div>

          {/* Best score */}
          {bestScorePct != null && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Star className="size-3.5 text-wc-gold" />
              <span>
                Previous best:{" "}
                <span className="font-semibold text-foreground">
                  {bestScorePct}%
                </span>
              </span>
            </div>
          )}

          {/* Category chips */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Categories
            </p>
            <div className="flex flex-wrap gap-1.5">
              {TRIVIA_CATEGORIES.map((cat) => {
                const active =
                  selectedCategories.size === 0 ||
                  selectedCategories.has(cat.value);
                return (
                  <button
                    key={cat.value}
                    onClick={() => toggleCategory(cat.value)}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium border transition-all",
                      active
                        ? CATEGORY_COLORS[cat.value]
                        : "bg-muted/50 text-muted-foreground border-transparent opacity-50"
                    )}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
            {selectedCategories.size > 0 && (
              <button
                onClick={() => setSelectedCategories(new Set())}
                className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Start buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => startQuiz(FULL_COUNT)}
              className="bg-wc-gold text-black hover:bg-wc-gold/90 font-semibold"
            >
              <Trophy className="size-4" />
              Play {FULL_COUNT} Questions
            </Button>
            <Button
              variant="outline"
              onClick={() => startQuiz(QUICK_COUNT)}
              className="font-semibold"
            >
              <Zap className="size-4" />
              Quick {QUICK_COUNT}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ── Render: Playing ────────────────────────────────────────────────

  if (mode === "playing" && currentQuestion) {
    const progress = ((currentIndex + 1) / questions.length) * 100;
    const categoryLabel =
      TRIVIA_CATEGORIES.find((c) => c.value === currentQuestion.category)
        ?.label ?? currentQuestion.category;

    return (
      <Card className="py-4">
        <CardContent className="space-y-4">
          {/* Progress header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Q{currentIndex + 1} of {questions.length}
              </span>
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] border",
                  CATEGORY_COLORS[currentQuestion.category]
                )}
              >
                {categoryLabel}
              </Badge>
            </div>

            {/* Progress bar */}
            <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-wc-gold transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <p className="text-sm font-semibold leading-relaxed">
            {currentQuestion.question}
          </p>

          {/* Options 2x2 grid */}
          <div className="grid grid-cols-2 gap-2">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectOption = idx === currentQuestion.correctIndex;

              let optionStyle = "border-border hover:border-wc-gold/50 hover:bg-wc-gold/5";

              if (isAnswered) {
                if (isCorrectOption) {
                  optionStyle =
                    "border-emerald-500/50 bg-emerald-500/10 text-emerald-400";
                } else if (isSelected) {
                  optionStyle =
                    "border-red-500/50 bg-red-500/10 text-red-400";
                } else {
                  optionStyle = "border-border opacity-40";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={isAnswered}
                  className={cn(
                    "relative rounded-lg border px-3 py-2.5 text-left text-xs font-medium transition-all",
                    "disabled:cursor-default",
                    optionStyle
                  )}
                >
                  <div className="flex items-start gap-2">
                    {isAnswered && isCorrectOption && (
                      <Check className="size-3.5 shrink-0 mt-0.5 text-emerald-400" />
                    )}
                    {isAnswered && isSelected && !isCorrectOption && (
                      <X className="size-3.5 shrink-0 mt-0.5 text-red-400" />
                    )}
                    <span>{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Answer feedback */}
          {isAnswered && (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Correct / Wrong */}
              <p
                className={cn(
                  "text-sm font-bold",
                  isCorrect ? "text-emerald-400" : "text-red-400"
                )}
              >
                {isCorrect ? "Correct!" : "Nope!"}
              </p>

              {/* Fun fact */}
              <div className="flex gap-2 rounded-lg bg-wc-blue/8 border border-wc-blue/20 p-3">
                <Lightbulb className="size-4 shrink-0 text-wc-blue mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {currentQuestion.funFact}
                </p>
              </div>

              {/* Next button */}
              <Button
                onClick={nextQuestion}
                className="w-full bg-wc-gold text-black hover:bg-wc-gold/90 font-semibold"
              >
                {currentIndex + 1 >= questions.length ? "See Results" : "Next"}
                <ChevronRight className="size-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // ── Render: Results ────────────────────────────────────────────────

  if (mode === "results") {
    return (
      <Card className="py-4">
        <CardContent className="space-y-5">
          {/* Score */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center">
              <Trophy className="size-8 text-wc-gold" />
            </div>
            <p className="text-4xl font-black tabular-nums">
              {score}
              <span className="text-lg text-muted-foreground font-medium">
                /{questions.length}
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              {getPerformanceMessage(score, questions.length)}
            </p>
          </div>

          {/* Category breakdown */}
          {categoryBreakdown.size > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                By Category
              </p>
              <div className="space-y-1.5">
                {Array.from(categoryBreakdown.entries()).map(
                  ([cat, { correct, total }]) => {
                    const label =
                      TRIVIA_CATEGORIES.find((c) => c.value === cat)?.label ??
                      cat;
                    const pct = Math.round((correct / total) * 100);
                    return (
                      <div key={cat} className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] min-w-[4.5rem] justify-center border",
                            CATEGORY_COLORS[cat]
                          )}
                        >
                          {label}
                        </Badge>
                        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-700",
                              pct === 100
                                ? "bg-emerald-400"
                                : pct >= 50
                                  ? "bg-wc-gold"
                                  : "bg-wc-coral"
                            )}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium tabular-nums min-w-[2.5rem] text-right">
                          {correct}/{total}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={resetQuiz}
              className="bg-wc-gold text-black hover:bg-wc-gold/90 font-semibold"
            >
              <RotateCcw className="size-4" />
              Play Again
            </Button>
            <Button
              variant="outline"
              onClick={shareScore}
              className="font-semibold"
            >
              <Share2 className="size-4" />
              {copied ? "Copied!" : "Share Score"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Fallback (shouldn't reach)
  return null;
}
