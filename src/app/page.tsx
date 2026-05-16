"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Newspaper, Save, Target, TrendingUp, PenTool, User as UserIcon, LogOut } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Home() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* NAV */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gold text-background font-bold font-serif">
                IE
              </span>
              <span className="font-bold">IELTS Platform</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link href="#features" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Features
              </Link>
              <Link href="/student/practice" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Practice
              </Link>
              <Link href="/student/vocabulary" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Vocabulary
              </Link>
              <Link href="/student/news" className="transition-colors hover:text-foreground/80 text-foreground/60">
                News
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link href={`/${user?.role}`} className="hidden md:block">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full bg-muted">
                      <UserIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name || user?.email}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/${user?.role}`}>Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="hidden md:flex">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gold hover:bg-gold-light text-background">Get Started</Button>
                </Link>
              </>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden w-full py-24 lg:py-32">
          {/* Subtle background glow mimicking the canvas gradient */}
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-gold to-sage opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
          </div>
          
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-8 rounded-full border bg-muted/50 text-sm font-medium">
              <span className="flex h-2 w-2 rounded-full bg-gold mr-2"></span>
              Trusted by 50,000+ IELTS candidates
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground font-serif mb-6">
              Write with <em className="italic text-gold font-light">confidence.</em>
              <br />
              Score higher.
            </h1>
            
            <p className="mx-auto max-w-[42rem] text-muted-foreground sm:text-xl sm:leading-8 mb-10">
              The most complete IELTS writing platform — real exam simulations, live vocabulary tools, and AI-powered feedback to push your band score further.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="h-12 px-8 bg-gold hover:bg-gold-light text-background w-full sm:w-auto text-base">
                  Start Practising Free
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="h-12 px-8 w-full sm:w-auto text-base">
                  See how it works
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-20 pt-10 border-t grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-bold font-mono text-foreground">50k+</span>
                <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Students</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-bold font-mono text-gold">+1.5</span>
                <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Avg. Band Gain</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-bold font-mono text-foreground">12k+</span>
                <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Essays</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-bold font-mono text-foreground">98%</span>
                <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Satisfaction</span>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="w-full py-24 bg-muted/40">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-sm font-semibold tracking-widest text-gold uppercase mb-2">Everything you need</p>
              <h2 className="text-3xl md:text-4xl font-bold font-serif tracking-tight">
                Built for serious <em className="italic font-light">IELTS</em> candidates.
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-background shadow-sm border-muted transition-all hover:border-gold/50 hover:shadow-md">
                <CardHeader>
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
                    <PenTool className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">Exam-Accurate Writing</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    Simulate real IELTS test conditions with timed sessions, a distraction-free editor, and word-count tracking.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-background shadow-sm border-muted transition-all hover:border-gold/50 hover:shadow-md">
                <CardHeader>
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">Live Vocabulary Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    Look up any word mid-essay with real dictionary definitions, phonetics. Insert high-band vocabulary directly into your writing.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-background shadow-sm border-muted transition-all hover:border-gold/50 hover:shadow-md">
                <CardHeader>
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
                    <Newspaper className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">News Reading Practice</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    Build reading stamina and topic knowledge with curated news articles on IELTS themes — environment, tech, and more.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-background shadow-sm border-muted transition-all hover:border-gold/50 hover:shadow-md">
                <CardHeader>
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
                    <Save className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">Auto-Save & Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    Never lose a word. Your essays are saved automatically as you type, with a full draft history so you review over time.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-background shadow-sm border-muted transition-all hover:border-gold/50 hover:shadow-md">
                <CardHeader>
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
                    <Target className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">Practice & Exam Modes</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    Switch between Practice Mode with all learning aids, and Exam Mode that disables tools to replicate real test pressure.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-background shadow-sm border-muted transition-all hover:border-gold/50 hover:shadow-md">
                <CardHeader>
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">Progress Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    Track your word count growth, session history, and essay count over time. See exactly how your writing is improving week by week.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full py-24 lg:py-32 text-center">
          <div className="container mx-auto px-4 max-w-3xl">
            <p className="text-sm font-semibold tracking-widest text-gold uppercase mb-4">Ready to begin?</p>
            <h2 className="text-3xl md:text-5xl font-bold font-serif tracking-tight mb-6">
              Your Band 7+ starts <em className="italic font-light">today.</em>
            </h2>
            <p className="text-xl text-muted-foreground mb-10">
              Join thousands of students who are already writing with purpose, building vocabulary, and walking into the exam room with confidence.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="h-14 px-8 bg-gold hover:bg-gold-light text-background w-full sm:w-auto text-lg border-2 border-transparent">
                  Create Free Account
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="h-14 px-8 w-full sm:w-auto text-lg border-2">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t py-8 mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-serif font-bold text-lg">
            IELTS Platform
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 IELTS Platform. Built for learners.
          </p>
        </div>
      </footer>
    </div>
  );
}
