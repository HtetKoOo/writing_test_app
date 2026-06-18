"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";
import { EyeIcon, EyeOffIcon, AlertCircle } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { API_URL } from "@/lib/api";

export default function LoginPage() {
  const { login } = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login({ email, password });
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.response?.data?.message || "Failed to sign in. Please check your credentials.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 relative">
      {/* Theme Toggle - Positioned top-right */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* LEFT SIDE: Graphical / Marketing */}
      <div className="hidden bg-muted lg:block relative bg-gradient-to-br from-slate-900 to-slate-800 text-white p-12 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 15% 50%, var(--gold), transparent 25%)" }}></div>
        <div className="absolute top-0 right-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="relative z-10 flex flex-col h-full justify-between">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gold text-slate-900 font-bold font-serif">
              IE
            </span>
            <span className="font-bold text-lg">IELTS Platform</span>
          </Link>

          <div className="max-w-md mt-16">
            <div className="text-sm font-semibold tracking-widest text-gold/80 uppercase mb-4">Academic Writing Practice</div>
            <h1 className="text-5xl font-bold font-serif tracking-tight mb-6">
              Write with <em className="italic text-gold font-light">purpose.</em>
              <br />
              Score with confidence.
            </h1>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              Practise IELTS Academic and General Writing in a real exam environment with live vocabulary, timed sessions, and curated news.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-200">
                <span className="flex h-6 w-6 rounded-full bg-sage/20 text-sage items-center justify-center text-xs border border-sage/30">✓</span>
                Task 1 & Task 2 writing practice
              </div>
              <div className="flex items-center gap-3 text-slate-200">
                <span className="flex h-6 w-6 rounded-full bg-sage/20 text-sage items-center justify-center text-xs border border-sage/30">✓</span>
                Live dictionary & vocabulary tools
              </div>
              <div className="flex items-center gap-3 text-slate-200">
                <span className="flex h-6 w-6 rounded-full bg-sage/20 text-sage items-center justify-center text-xs border border-sage/30">✓</span>
                Personalised IELTS news feed
              </div>
            </div>
          </div>

          <div className="mt-auto border-t border-white/10 pt-8 max-w-sm">
            <p className="text-sm italic text-slate-400 mb-4">&quot;Going from Band 6 to 7.5 felt impossible — this platform made it feel inevitable.&quot;</p>
            <div className="flex gap-3 items-center">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-sm font-medium">SK</div>
              <div>
                <p className="text-sm font-medium">Selin K. · Thailand</p>
                <p className="text-xs text-gold">Band 7.5 ↑</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Auth Form */}
      <div className="flex items-center justify-center py-12 px-6 sm:px-12 bg-background">
        <div className="mx-auto grid w-full max-w-md gap-8">
          <div className="grid gap-2 text-center lg:text-left">
            <h1 className="text-3xl font-bold font-serif tracking-tight">
              Welcome <em className="italic font-light text-gold">back.</em>
            </h1>
            <p className="text-balance text-muted-foreground">
              Sign in to continue your practice.
            </p>
          </div>

          <div className="grid gap-6">
            <div className="flex flex-col gap-3">
              <Button
                variant="outline"
                className="w-full h-12 flex gap-2"
                onClick={() => window.location.href = `${API_URL}/auth/google`}
              >
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
                  <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                </svg>
                Continue with Google
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 flex gap-2"
                onClick={() => window.location.href = `${API_URL}/auth/github`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                Continue with GitHub
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or sign in with email
                </span>
              </div>
            </div>

            <form onSubmit={onSubmit} className="grid gap-4">
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-muted/50"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm text-muted-foreground hover:text-gold transition-colors"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 bg-muted/50 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full h-12 bg-gold hover:bg-gold-light text-background font-medium" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-semibold text-foreground hover:text-gold transition-colors">
                Create one — it&apos;s free
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
