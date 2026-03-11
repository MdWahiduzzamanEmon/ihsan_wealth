"use client";

import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  lines?: number;
  className?: string;
}

export function LoadingSkeleton({ lines = 3, className }: LoadingSkeletonProps) {
  return (
    <div className={cn("space-y-3 animate-pulse", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-4 rounded-md bg-muted",
            i === lines - 1 && "w-3/4"
          )}
        />
      ))}
    </div>
  );
}

export function PriceSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="h-7 w-36 rounded-md bg-muted" />
      <div className="h-4 w-24 rounded-md bg-muted/60" />
      <div className="h-4 w-28 rounded-md bg-muted/60" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-6 animate-pulse space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-muted" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-32 rounded bg-muted" />
          <div className="h-3 w-48 rounded bg-muted/60" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-muted/40" />
        <div className="h-4 w-5/6 rounded bg-muted/40" />
      </div>
    </div>
  );
}
