"use client";

import Link from "next/link";
import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { KeyRound, ShieldCheck, XCircle, ArrowLeft, Loader2, EyeIcon, EyeOffIcon } from "lucide-react";

export default function ResetPasswordPage() {
  const [step, setStep] = useState<"validating" | "invalid" | "form" | "done">("validating");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Requirements checks
  const hasLen = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNum = /\d/.test(password);

  // Derive strength
  let strLevel = 0;
  if (password.length > 0) {
    if (hasLen) strLevel++;
    if (hasUpper && hasLower) strLevel++;
    if (hasNum) strLevel++;
    if (password.length >= 12 && /[^A-Za-z0-9]/.test(password)) strLevel++;
  }

  const strClasses = ["", "s1", "s2", "s3", "s4"];
  const strLabels = ["", "Weak", "Fair", "Strong", "Great!"];
  
  const currentStrClass = password ? strClasses[strLevel] || "s4" : "";
  const currentStrLabel = password ? strLabels[strLevel] || "Great!" : "";

  // Simulate token validation hook
  useEffect(() => {
    const timer = setTimeout(() => {
      // Fake validation logic
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("token") === "invalid") {
          setStep("invalid");
        } else {
          setStep("form");
        }
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!hasLen || !hasUpper || !hasLower || !hasNum) return;
    if (password !== confirmPassword) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep("done");
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
          
          {/* Validating link */}
          {step === "validating" && (
            <div className="py-24 flex flex-col items-center justify-center text-center">
              <Loader2 className="h-10 w-10 animate-spin text-muted-foreground mb-4" />
              <p className="text-muted-foreground font-medium">Validating your reset link…</p>
            </div>
          )}

          {/* Invalid token */}
          {step === "invalid" && (
            <>
              <CardHeader className="text-center pt-8 pb-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-destructive mb-4">
                  <XCircle className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl font-serif">Link expired</CardTitle>
                <CardDescription className="text-base mt-2">
                  This reset link is invalid or has expired. Links are only valid for 30 minutes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/forgot-password">
                  <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 font-medium text-white">
                    Request a new link
                  </Button>
                </Link>
              </CardContent>
            </>
          )}

          {/* Form */}
          {step === "form" && (
            <>
              <CardHeader className="text-center pt-8 pb-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-4">
                  <KeyRound className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl font-serif">Set new password</CardTitle>
                <CardDescription className="text-base mt-2">
                  Choose a strong password for your IELTS Platform account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form id="resetForm" noValidate onSubmit={handleSubmit} className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="password">New password</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder="New password"
                        autoComplete="new-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 bg-muted/50 pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                      </button>
                    </div>
                    
                    {password && (
                      <div className="mt-1 flex items-center gap-2">
                        <div className="flex flex-1 gap-1 h-1.5">
                          {[1, 2, 3, 4].map(idx => {
                            let bgClass = "bg-muted";
                            if (idx <= strLevel) {
                              if (strLevel === 1) bgClass = "bg-red-500";
                              if (strLevel === 2) bgClass = "bg-orange-500";
                              if (strLevel === 3) bgClass = "bg-amber-500";
                              if (strLevel === 4) bgClass = "bg-green-500";
                            }
                            return <div key={idx} className={`flex-1 rounded-full ${bgClass}`} />
                          })}
                        </div>
                        <span className="text-xs font-semibold text-muted-foreground w-12 text-right">
                          {currentStrLabel}
                        </span>
                      </div>
                    )}
                    
                    {/* Req List */}
                    <div className="mt-2 text-[0.75rem] text-muted-foreground flex gap-3 flex-wrap">
                      <span className={hasLen ? "text-green-600 font-medium" : ""}>
                        {hasLen ? "✓" : "○"} 8+ characters
                      </span>
                      <span className={hasUpper ? "text-green-600 font-medium" : ""}>
                        {hasUpper ? "✓" : "○"} Uppercase
                      </span>
                      <span className={hasLower ? "text-green-600 font-medium" : ""}>
                        {hasLower ? "✓" : "○"} Lowercase
                      </span>
                      <span className={hasNum ? "text-green-600 font-medium" : ""}>
                        {hasNum ? "✓" : "○"} Number
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm password</Label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        placeholder="Confirm new password"
                        autoComplete="new-password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="h-12 bg-muted/50 pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                      </button>
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <span className="text-xs text-destructive mt-1">Passwords do not match.</span>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium mt-2"
                    disabled={isSubmitting || !hasLen || !hasUpper || !hasLower || !hasNum || password !== confirmPassword}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      "Reset password"
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

          {/* Success */}
          {step === "done" && (
            <>
              <CardHeader className="text-center pt-8 pb-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600 mb-4">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl font-serif">Password updated</CardTitle>
                <CardDescription className="text-base mt-2">
                  Your password has been reset. You can now sign in with your new password.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/login">
                  <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium">
                    Go to sign in
                  </Button>
                </Link>
              </CardContent>
            </>
          )}

        </Card>
      </main>
    </div>
  );
}
