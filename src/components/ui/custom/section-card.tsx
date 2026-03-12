"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { slideUp } from "@/lib/animations";
import type { LucideIcon } from "lucide-react";

interface SectionCardProps {
  title: string;
  titleAr?: string;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({
  title,
  titleAr,
  description,
  icon: Icon,
  iconColor = "text-emerald-600",
  iconBg,
  badge,
  children,
  className = "",
}: SectionCardProps) {
  return (
    <motion.div variants={slideUp} initial="initial" animate="animate">
      <Card className={`border-gray-200/80 shadow-sm ${className}`}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2.5 text-emerald-800">
              {Icon && iconBg ? (
                <div className={`h-8 w-8 rounded-xl ${iconBg} flex items-center justify-center shadow-sm`}>
                  <Icon className={`h-4 w-4 ${iconColor}`} />
                </div>
              ) : Icon ? (
                <div className="h-8 w-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Icon className={`h-4 w-4 ${iconColor}`} />
                </div>
              ) : null}
              <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
                <span>{title}</span>
                {titleAr && (
                  <span className="font-arabic text-sm sm:text-base text-emerald-600/50 font-normal">
                    {titleAr}
                  </span>
                )}
              </div>
            </CardTitle>
            {badge}
          </div>
          {description && (
            <CardDescription className="text-gray-400 mt-1 leading-relaxed">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="pt-0">{children}</CardContent>
      </Card>
    </motion.div>
  );
}
