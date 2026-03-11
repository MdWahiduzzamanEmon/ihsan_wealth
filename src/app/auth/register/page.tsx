"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/components/providers/auth-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { fadeIn } from "@/lib/animations";
import { UserPlus, Loader2, Mail, Lock, User } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error, confirmed } = await signUp(email, password, name);
    if (error) {
      setError(error);
      setLoading(false);
    } else if (confirmed) {
      // Email confirmation disabled — user is auto-logged in
      router.push("/");
    } else {
      // Email confirmation enabled — show check email message
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50/30 via-white to-amber-50/20 px-4">
        <motion.div className="w-full max-w-md text-center" variants={fadeIn} initial="initial" animate="animate">
          <Card>
            <CardContent className="pt-8 pb-8 space-y-4">
              <div className="h-16 w-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center">
                <Mail className="h-8 w-8 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-emerald-800">Check Your Email</h2>
              <p className="text-sm text-muted-foreground">
                We&apos;ve sent a confirmation link to <strong>{email}</strong>.
                Please verify your email to complete registration.
              </p>
              <Link href="/auth/login">
                <Button className="bg-emerald-600 hover:bg-emerald-700">Go to Login</Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50/30 via-white to-amber-50/20 px-4">
      <motion.div
        className="w-full max-w-md"
        variants={fadeIn}
        initial="initial"
        animate="animate"
      >
        <div className="text-center mb-8">
          <p className="font-arabic text-2xl text-emerald-600/60 mb-2">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
          <h1 className="text-3xl font-bold text-emerald-800">Create Account</h1>
          <p className="text-muted-foreground mt-1">Save your Zakat calculations across years</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-emerald-600" />
              Register
            </CardTitle>
            <CardDescription>Create a free account to track your Zakat history</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-emerald-600 hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
