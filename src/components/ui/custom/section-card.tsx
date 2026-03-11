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
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-emerald-800">
              {Icon && iconBg ? (
                <div className={`h-6 w-6 rounded-full ${iconBg} flex items-center justify-center`}>
                  <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
                </div>
              ) : Icon ? (
                <Icon className={`h-5 w-5 ${iconColor}`} />
              ) : null}
              {title}
              {titleAr && (
                <span className="font-arabic text-base text-emerald-600/50 font-normal">
                  {titleAr}
                </span>
              )}
            </CardTitle>
            {badge}
          </div>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  );
}
