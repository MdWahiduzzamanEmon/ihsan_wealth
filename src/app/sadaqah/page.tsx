"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { useSadaqahRecords } from "@/hooks/use-sadaqah-records";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { SadaqahForm } from "@/components/sadaqah/sadaqah-form";
import { SadaqahList } from "@/components/sadaqah/sadaqah-list";
import { SadaqahStats } from "@/components/sadaqah/sadaqah-stats";
import { fadeIn } from "@/lib/animations";
import { ArrowLeft, Heart, LogIn, Loader2 } from "lucide-react";

export default function SadaqahPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { records, addRecord, deleteRecord, isLoading } = useSadaqahRecords();

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50/30 via-white to-amber-50/20">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-8">
          {/* Page Title */}
          <motion.div className="mb-8" variants={fadeIn} initial="initial" animate="animate">
            <div className="flex items-center gap-3 mb-2">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-1">
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-emerald-800 flex items-center gap-3">
              <Heart className="h-8 w-8 text-emerald-600" />
              Sadaqah Tracker
              <span className="font-arabic text-xl text-emerald-600/50">متتبع الصدقات</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your voluntary charity and earn continuous rewards
            </p>
          </motion.div>

          {/* Hadith Banner */}
          <motion.div
            className="mb-8 rounded-xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 p-6 text-center relative overflow-hidden"
            variants={fadeIn}
            initial="initial"
            animate="animate"
          >
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="sadaqah-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="20" cy="20" r="8" fill="none" stroke="white" strokeWidth="0.5" />
                    <path d="M20 12L28 20L20 28L12 20Z" fill="none" stroke="white" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#sadaqah-pattern)" />
              </svg>
            </div>
            <div className="relative">
              <p className="font-arabic text-2xl text-amber-300 mb-3 leading-relaxed">
                الصَّدَقَةُ تُطْفِئُ الخَطِيئَةَ كَمَا يُطْفِئُ المَاءُ النَّارَ
              </p>
              <p className="text-emerald-100 text-sm max-w-lg mx-auto">
                &ldquo;Charity extinguishes sin just as water extinguishes fire.&rdquo;
              </p>
              <p className="text-emerald-300/60 text-xs mt-1">
                &mdash; Sunan al-Tirmidhi 2616
              </p>
            </div>
          </motion.div>

          {/* Auth Gate */}
          {authLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              <p className="text-sm text-gray-500">Loading...</p>
            </div>
          ) : !isAuthenticated ? (
            <motion.div
              variants={fadeIn}
              initial="initial"
              animate="animate"
              className="text-center py-16"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
                <LogIn className="h-8 w-8 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Sign in to track your Sadaqah</h2>
              <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                Your donations are saved securely to your account so you can track your giving history across devices.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Link href="/auth/login">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                    Create Account
                  </Button>
                </Link>
              </div>
            </motion.div>
          ) : !isLoading ? (
            <div className="space-y-8">
              {/* Add Form */}
              <SadaqahForm onAdd={addRecord} />

              {/* Stats */}
              <SadaqahStats records={records} />

              {/* Donations List */}
              <SadaqahList records={records} onDelete={deleteRecord} />

              {/* Motivational Footer */}
              {records.length > 0 && (
                <motion.div
                  className="text-center py-6"
                  variants={fadeIn}
                  initial="initial"
                  animate="animate"
                >
                  <p className="font-arabic text-lg text-amber-600/60 mb-1">
                    مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ
                  </p>
                  <p className="text-sm text-muted-foreground">
                    &ldquo;Charity does not decrease wealth.&rdquo; &mdash; Sahih Muslim 2588
                  </p>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              <p className="text-sm text-gray-500">Loading your records...</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
