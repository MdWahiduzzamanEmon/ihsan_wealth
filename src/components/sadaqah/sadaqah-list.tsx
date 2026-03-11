"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { Trash2, Heart, ListChecks } from "lucide-react";
import { SADAQAH_CATEGORIES, type SadaqahRecord } from "./sadaqah-form";

interface SadaqahListProps {
  records: SadaqahRecord[];
  onDelete: (id: string) => void;
}

export function SadaqahList({ records, onDelete }: SadaqahListProps) {
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const groups: Record<string, SadaqahRecord[]> = {};
    const sorted = [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    for (const record of sorted) {
      const d = new Date(record.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(record);
    }

    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [records]);

  const handleDelete = (id: string) => {
    if (confirmId === id) {
      onDelete(id);
      setConfirmId(null);
    } else {
      setConfirmId(id);
      setTimeout(() => setConfirmId(null), 3000);
    }
  };

  const formatMonthLabel = (key: string) => {
    const [year, month] = key.split("-");
    const d = new Date(parseInt(year), parseInt(month) - 1);
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const getCategoryInfo = (categoryValue: string) => {
    return SADAQAH_CATEGORIES.find((c) => c.value === categoryValue) || SADAQAH_CATEGORIES[6];
  };

  if (records.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="border-dashed border-emerald-200">
          <CardContent className="py-12 text-center">
            <div className="h-16 w-16 mx-auto rounded-full bg-emerald-50 flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-emerald-300" />
            </div>
            <h3 className="text-lg font-semibold text-emerald-800 mb-1">
              No donations yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-3">
              Start recording your Sadaqah to track your generosity and earn continuous rewards.
            </p>
            <p className="font-arabic text-base text-amber-600/70">
              مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              &ldquo;Charity does not decrease wealth.&rdquo; &mdash; Sahih Muslim
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-800">
            <ListChecks className="h-5 w-5 text-emerald-600" />
            Donation History
            <span className="font-arabic text-base text-emerald-600/50 font-normal">
              سجل التبرعات
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {grouped.map(([monthKey, monthRecords]) => (
            <motion.div key={monthKey} variants={staggerItem}>
              {/* Month Header */}
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-sm font-semibold text-emerald-700">
                  {formatMonthLabel(monthKey)}
                </h3>
                <div className="flex-1 h-px bg-emerald-100" />
                <span className="text-xs text-muted-foreground">
                  {monthRecords.length} donation{monthRecords.length !== 1 ? "s" : ""} &middot; $
                  {monthRecords.reduce((s, r) => s + r.amount, 0).toFixed(2)}
                </span>
              </div>

              {/* Records */}
              <AnimatePresence mode="popLayout">
                <div className="space-y-2">
                  {monthRecords.map((record) => {
                    const catInfo = getCategoryInfo(record.category);
                    const CatIcon = catInfo.icon;
                    return (
                      <motion.div
                        key={record.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, scale: 0.95 }}
                        transition={{ duration: 0.25 }}
                        className="flex items-center gap-3 rounded-lg border border-muted bg-white p-3 hover:border-emerald-200 transition-colors group"
                      >
                        {/* Category Icon */}
                        <div
                          className="h-9 w-9 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${catInfo.color}15` }}
                        >
                          <CatIcon className="h-4 w-4" style={{ color: catInfo.color }} />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-emerald-800">
                              ${record.amount.toFixed(2)}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {record.category}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                            <span>
                              {new Date(record.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                            {record.notes && (
                              <>
                                <span>&middot;</span>
                                <span className="truncate">{record.notes}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Delete */}
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleDelete(record.id)}
                          className={`shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                            confirmId === record.id
                              ? "text-red-600 bg-red-50 opacity-100"
                              : "text-muted-foreground hover:text-red-500 hover:bg-red-50"
                          }`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              </AnimatePresence>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
