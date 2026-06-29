"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function CallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // A fallback timeout: if redirect hasn't occurred in 5 seconds, show error or redirect to login.
    const timer = setTimeout(() => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("Sign in process timed out or failed. Please try again.");
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, var(--gold), transparent 30%)" }}></div>
      <div className="absolute top-0 right-0 w-full h-full bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>

      <div className="relative z-10 max-w-md w-full bg-slate-900/60 backdrop-blur-md border border-white/5 rounded-2xl p-8 text-center shadow-2xl flex flex-col items-center gap-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold text-slate-950 font-bold font-serif text-lg">
          IE
        </div>

        {error ? (
          <div className="animate-in fade-in duration-300 flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-destructive/15 border border-destructive/30 text-destructive flex items-center justify-center">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold font-serif text-slate-100">Authentication Failed</h2>
            <p className="text-sm text-slate-400 leading-relaxed">{error}</p>
            <Button
              className="mt-2 bg-gold hover:bg-gold-light text-slate-950 font-medium h-11 px-6"
              onClick={() => router.push("/login")}
            >
              Back to Sign In
            </Button>
          </div>
        ) : (
          <div className="animate-in fade-in duration-300 flex flex-col items-center gap-4">
            <svg className="animate-spin h-10 w-10 text-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h2 className="text-xl font-bold font-serif text-slate-100">Completing Sign In</h2>
            <p className="text-sm text-slate-400">Verifying credentials and setting up your workspace...</p>
          </div>
        )}
      </div>
    </div>
  );
}
