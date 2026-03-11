"use client";

import { motion } from "framer-motion";
import { Radio, RefreshCw, AlertTriangle } from "lucide-react";

interface LiveBadgeProps {
  isLive: boolean;
  loading?: boolean;
  timestamp?: string;
  className?: string;
}

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export function LiveBadge({ isLive, loading, timestamp, className = "" }: LiveBadgeProps) {
  if (loading) {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700 ${className}`}>
        <RefreshCw className="h-3 w-3 animate-spin" />
        Fetching...
      </span>
    );
  }

  if (isLive) {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 ${className}`}>
        <motion.span
          className="relative flex h-2 w-2"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-600" />
        </motion.span>
        LIVE
        {timestamp && (
          <span className="text-green-600/70 ml-0.5">&middot; {timeAgo(timestamp)}</span>
        )}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700 ${className}`}>
      <AlertTriangle className="h-3 w-3" />
      Estimated
    </span>
  );
}
