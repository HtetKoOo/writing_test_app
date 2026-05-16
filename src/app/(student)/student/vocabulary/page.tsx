"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Book, Volume2, Sparkles, MessageSquare, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function VocabularyPage() {
  const [word, setWord] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!word.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/writing-tasks/vocab/${word.trim()}`);
      setResult(response.data.data);
      if (!history.includes(word.trim())) {
        setHistory(prev => [word.trim(), ...prev.slice(0, 4)]);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Word not found. Please try another one.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-[#111614]">
        <div>
          <h1 className="text-2xl font-bold text-white font-serif tracking-tight">Vocabulary Builder</h1>
          <p className="text-zinc-500 text-sm mt-1">Enhance your writing with high-band academic words.</p>
        </div>
      </header>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-[1000px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Column */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <form onSubmit={handleSearch} className="relative group">
                <div className="absolute inset-0 bg-gold/10 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity rounded-3xl" />
                <div className="relative flex gap-3 p-2 rounded-2xl bg-[#1a211e] border border-white/10 group-focus-within:border-gold/50 transition-all">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-500" />
                    <Input 
                      placeholder="Enter a word (e.g. 'Paradigm', 'Mitigate')..." 
                      value={word}
                      onChange={(e) => setWord(e.target.value)}
                      className="pl-12 bg-transparent border-none text-lg h-14 focus-visible:ring-0 text-white placeholder:text-zinc-600"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="bg-gold hover:bg-gold-light text-slate-900 font-bold px-8 rounded-xl h-14"
                    disabled={loading}
                  >
                    {loading ? "Searching..." : "Search"}
                  </Button>
                </div>
              </form>
            </section>

            {loading && (
              <Card className="bg-[#1a211e] border-white/5 rounded-3xl shadow-none p-8">
                <Skeleton className="h-10 w-48 bg-white/5 mb-6" />
                <Skeleton className="h-6 w-full bg-white/5 mb-4" />
                <Skeleton className="h-6 w-full bg-white/5 mb-4" />
                <Skeleton className="h-32 w-full bg-white/5 rounded-2xl" />
              </Card>
            )}

            {error && (
              <div className="p-8 text-center bg-red-500/5 border border-red-500/20 rounded-3xl">
                <p className="text-red-400 font-medium">{error}</p>
              </div>
            )}

            {result && (
              <Card className="bg-[#1a211e] border-white/5 rounded-3xl shadow-none overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-gradient-to-r from-gold/20 to-transparent p-8 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-4xl font-bold text-white font-serif">{result.word}</h2>
                    <Button variant="ghost" size="icon" className="size-12 rounded-full bg-white/5 text-gold hover:bg-gold/20">
                      <Volume2 className="size-6" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-400 font-mono text-sm">
                    <span className="italic">{result.partOfSpeech || "noun"}</span>
                    <span>•</span>
                    <span>{result.phonetic || "/ˈpærədaɪm/"}</span>
                  </div>
                </div>
                
                <CardContent className="p-8 space-y-8">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Book className="size-4" /> Definition
                    </h3>
                    <p className="text-zinc-200 text-lg leading-relaxed">
                      {result.definition || "A typical example or pattern of something; a model."}
                    </p>
                  </div>

                  {result.examples && result.examples.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <MessageSquare className="size-4" /> Use in a sentence
                      </h3>
                      <div className="space-y-3">
                        {result.examples.map((ex: string, i: number) => (
                          <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 italic text-zinc-400">
                            "{ex}"
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-6 border-t border-white/5 flex flex-wrap gap-2">
                    {result.synonyms?.map((syn: string, i: number) => (
                      <Badge key={i} className="bg-zinc-800 text-zinc-400 hover:text-gold transition-colors cursor-pointer">
                        {syn}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            <Card className="bg-[#111614] border-white/5 rounded-3xl shadow-none">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                  <History className="size-4" /> Recent Searches
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {history.length === 0 ? (
                  <p className="text-zinc-600 text-xs italic">Your search history will appear here.</p>
                ) : (
                  history.map((h, i) => (
                    <button 
                      key={i} 
                      onClick={() => { setWord(h); handleSearch(); }}
                      className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-gold/10 hover:text-gold transition-all text-sm text-zinc-400"
                    >
                      {h}
                    </button>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gold/20 to-transparent border-gold/20 rounded-3xl shadow-none">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                  <Sparkles className="size-4 text-gold" /> Band 7+ Tip
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Don't just use long words. Use them **accurately**. Academic vocabulary should fit the context and collocate correctly with surrounding words.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
