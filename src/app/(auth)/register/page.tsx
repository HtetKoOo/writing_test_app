"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ThemeToggle } from "@/components/theme-toggle";
import { EyeIcon, EyeOffIcon, AlertCircle } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { API_URL } from "@/lib/api";

export default function RegisterPage() {
  const { register: registerAuth } = useAuth();
  const [passwordVisible1, setPasswordVisible1] = useState(false);
  const [passwordVisible2, setPasswordVisible2] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Strength checker logic
  const checkStr = (pw: string) => {
    if (!pw) return 0;
    let s = 0;
    if (pw.length >= 8) s++;
    if (pw.length >= 12) s++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
    if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) s++;
    return Math.max(1, s);
  };

  const strLevel = checkStr(password);
  const strLabels = ["", "Weak", "Fair", "Strong", "Great!"];
  const strColors = [
    "bg-muted",
    "bg-red-500",     // weak
    "bg-orange-500",  // fair
    "bg-amber-500",   // strong
    "bg-green-500"    // great
  ];
  const currentColorClass = password ? strColors[strLevel] : "bg-muted";
  const currentLabel = password ? strLabels[strLevel] : "";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await registerAuth({ name, email, password });
      if (res && !res.loggedIn) {
        setSuccessMessage(res.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.response?.data?.message || "Failed to create account. Please try again.");
    } finally {
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
            <div className="text-sm font-semibold tracking-widest text-gold/80 uppercase mb-4">Get Started Today</div>
            <h1 className="text-5xl font-bold font-serif tracking-tight mb-6">
              Your path to <em className="italic text-gold font-light">Band 7+</em>
              <br />
              starts here.
            </h1>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              Create your free account and begin practising with real IELTS-style writing tasks today.
            </p>
            
            <div className="space-y-6 mt-8">
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-sm font-mono font-bold text-gold">01</div>
                <div>
                  <h3 className="font-semibold text-slate-100">Create your account</h3>
                  <p className="text-sm text-slate-400">Sign up in seconds with Google or email.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-sm font-mono font-bold text-gold">02</div>
                <div>
                  <h3 className="font-semibold text-slate-100">Choose a writing task</h3>
                  <p className="text-sm text-slate-400">Task 1 or Task 2 — timed or open practice.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-sm font-mono font-bold text-gold">03</div>
                <div>
                  <h3 className="font-semibold text-slate-100">Use vocabulary tools</h3>
                  <p className="text-sm text-slate-400">Search any word and insert it mid-essay.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-auto pt-8 border-t border-white/10 max-w-sm">
            <div className="flex flex-col gap-2">
              <span className="text-sm text-slate-400">Average band improvement after 30 days</span>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden relative">
                   <div className="absolute top-0 left-0 h-full w-[75%] bg-gold rounded-full"></div>
                </div>
                <span className="text-sm font-bold text-gold">+1.5 bands</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Auth Form */}
      <div className="flex items-center justify-center py-12 px-6 sm:px-12 bg-background">
        {successMessage ? (
          <div className="mx-auto grid w-full max-w-md gap-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 text-gold mx-auto mb-6 border border-gold/20 animate-in zoom-in duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold font-serif tracking-tight">
              Verify your <em className="italic font-light text-gold">email.</em>
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {successMessage}
            </p>
            <div className="mt-4">
              <Link href="/login" className="w-full">
                <Button className="w-full h-12 bg-gold hover:bg-gold-light text-background font-medium">
                  Go to Sign In
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="mx-auto grid w-full max-w-md gap-8">
            <div className="grid gap-2 text-center lg:text-left">
              <h1 className="text-3xl font-bold font-serif tracking-tight">
                Create <em className="italic font-light text-gold">account.</em>
              </h1>
              <p className="text-balance text-muted-foreground">
                Join thousands of IELTS candidates improving their writing.
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
                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or register with email
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
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 bg-muted/50"
                  />
                </div>

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
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={passwordVisible1 ? "text" : "password"}
                      placeholder="At least 8 characters"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 bg-muted/50 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setPasswordVisible1(!passwordVisible1)}
                    >
                      {passwordVisible1 ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </button>
                  </div>
                  {/* Dynamically build strength bars component */}
                  {password && (
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex flex-1 gap-1 h-1.5">
                        {[1, 2, 3, 4].map(idx => (
                          <div 
                            key={idx} 
                            className={`flex-1 rounded-full ${idx <= strLevel ? currentColorClass : "bg-muted"}`} 
                          />
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground w-12 text-right">
                        {currentLabel}
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirm password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={passwordVisible2 ? "text" : "password"}
                      placeholder="Repeat your password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-12 bg-muted/50 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setPasswordVisible2(!passwordVisible2)}
                    >
                      {passwordVisible2 ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </button>
                  </div>
                  {confirmPassword && confirmPassword !== password && (
                    <div className="text-xs text-destructive mt-1">Passwords do not match</div>
                  )}
                </div>

                <div className="flex items-center space-x-2 my-2">
                  <Checkbox id="terms" required />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
                  >
                    I agree to the <Link href="#" className="underline underline-offset-4 hover:text-foreground">Terms of Service</Link> and <Link href="#" className="underline underline-offset-4 hover:text-foreground">Privacy Policy</Link>
                  </label>
                </div>

                <Button type="submit" className="w-full h-12 bg-gold hover:bg-gold-light text-background font-medium" disabled={isLoading || (confirmPassword !== password) || password.length < 8}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
              
              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-foreground hover:text-gold transition-colors">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
