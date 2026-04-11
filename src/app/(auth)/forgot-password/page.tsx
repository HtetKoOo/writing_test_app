"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { KeyRound, MailCheck, ArrowLeft, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"request" | "sent">("request");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep("sent");
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <header className="absolute top-0 w-full p-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gold text-slate-900 font-bold font-serif">
            IE
          </span>
          <span className="font-bold text-lg">IELTS Platform</span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <Card className="w-full max-w-[440px] shadow-lg border-muted">
          {step === "request" && (
            <>
              <CardHeader className="text-center pt-8 pb-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-4">
                  <KeyRound className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl font-serif">Forgot your password?</CardTitle>
                <CardDescription className="text-base mt-2">
                  Enter your email and we&apos;ll send you a secure link to reset your password.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmit} className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`h-12 ${error ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    />
                    {error && <span className="text-xs text-destructive mt-1">{error}</span>}
                  </div>
                  <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium mt-2" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending reset link...
                      </>
                    ) : (
                      "Send reset link"
                    )}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex justify-center pb-8">
                <Link href="/login" className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to sign in
                </Link>
              </CardFooter>
            </>
          )}

          {step === "sent" && (
            <>
              <CardHeader className="text-center pt-8 pb-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600 mb-4">
                  <MailCheck className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl font-serif">Check your inbox</CardTitle>
                <CardDescription className="text-base mt-2">
                  If an account exists for <strong className="text-foreground">{email}</strong>, a reset link is on its way. The link expires in <strong>30 minutes</strong>.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-6">
                  Can&apos;t find it? Check your spam folder.
                </p>
                <Button variant="outline" className="w-full h-12 font-medium" onClick={() => setStep("request")}>
                  Resend email
                </Button>
              </CardContent>
              <CardFooter className="flex justify-center pb-8">
                <Link href="/login" className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to sign in
                </Link>
              </CardFooter>
            </>
          )}
        </Card>
      </main>
    </div>
  );
}
