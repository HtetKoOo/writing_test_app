"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Newspaper, ExternalLink, Bookmark, Clock, Flame, Check, Plus, Trash2, Trophy, X, Book, Sparkles } from "lucide-react";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard-header";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  // In-app Reader and Vocab/Bookmark states
  const [savedArticles, setSavedArticles] = useState<any[]>([]);
  const [savedVocab, setSavedVocab] = useState<string[]>([]);
  const [readArticleIds, setReadArticleIds] = useState<string[]>([]);
  const [readCount, setReadCount] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);

  // Word dictionary lookup states
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [lookupResult, setLookupResult] = useState<any | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [showBadgeCelebration, setShowBadgeCelebration] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsRes, catRes] = await Promise.all([
          api.get('/news/feed'),
          api.get('/news/categories')
        ]);
        
        // Correctly extract arrays from object wrappers returned by backend API
        const articlesList = newsRes.data.data?.articles || (Array.isArray(newsRes.data.data) ? newsRes.data.data : []);
        const categoriesList = catRes.data.data?.categories || (Array.isArray(catRes.data.data) ? catRes.data.data : []);

        setNews(articlesList);
        setCategories(["All", "Saved", ...categoriesList]);
      } catch (error) {
        console.error("Failed to fetch news data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Load Local Storage values
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem('savedArticles');
      if (saved) setSavedArticles(JSON.parse(saved));

      const vocab = localStorage.getItem('savedVocab');
      if (vocab) setSavedVocab(JSON.parse(vocab));

      const todayStr = new Date().toISOString().split('T')[0];
      const dailyReadIds = localStorage.getItem(`readArticleIds_${todayStr}`);
      if (dailyReadIds) {
        const parsed = JSON.parse(dailyReadIds);
        setReadArticleIds(parsed);
        setReadCount(parsed.length);
      }
    }
  }, []);

  const formatTimeAgo = (dateStr: string) => {
    if (!dateStr) return "Published recently";
    try {
      const d = new Date(dateStr.replace(" ", "T")); // handle YYYY-MM-DD HH:mm:ss format
      const seconds = Math.floor((new Date().getTime() - d.getTime()) / 1000);
      if (isNaN(seconds)) return "Published recently";
      if (seconds < 60) return "Just now";
      
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m ago`;
      
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    } catch (e) {
      return "Published recently";
    }
  };

  const handleArticleClick = (article: any) => {
    setSelectedArticle(article);
    setSelectedWord(null);
    setLookupResult(null);
    setLookupError(null);
    
    // Automatically mark as read after 3 seconds of opening
    setTimeout(() => {
      markArticleAsRead(article.article_id || article.link);
    }, 3000);
  };

  const markArticleAsRead = (articleId: string) => {
    if (!articleId) return;
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Read list of read ids for today
    const stored = localStorage.getItem(`readArticleIds_${todayStr}`);
    const parsed = stored ? JSON.parse(stored) : [];
    
    if (parsed.includes(articleId)) return;
    
    const updated = [...parsed, articleId];
    setReadArticleIds(updated);
    setReadCount(updated.length);
    localStorage.setItem(`readArticleIds_${todayStr}`, JSON.stringify(updated));
    
    if (updated.length === 3) {
      setShowBadgeCelebration(true);
    }
  };

  const toggleSaveArticle = (article: any) => {
    const isSaved = savedArticles.some(a => a.article_id === article.article_id);
    let updated;
    if (isSaved) {
      updated = savedArticles.filter(a => a.article_id !== article.article_id);
    } else {
      updated = [...savedArticles, article];
    }
    setSavedArticles(updated);
    localStorage.setItem('savedArticles', JSON.stringify(updated));
  };

  const toggleSaveVocab = (wordObj: any) => {
    if (!wordObj || !wordObj.word) return;
    const wordKey = wordObj.word.toLowerCase();
    const isSaved = savedVocab.includes(wordKey);
    let updated;
    if (isSaved) {
      updated = savedVocab.filter(w => w !== wordKey);
    } else {
      updated = [...savedVocab, wordKey];
    }
    setSavedVocab(updated);
    localStorage.setItem('savedVocab', JSON.stringify(updated));
  };

  const handleWordLookup = async (rawWord: string) => {
    const cleanWord = rawWord.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!cleanWord || cleanWord.length < 2) return;
    
    setSelectedWord(rawWord);
    setLookupLoading(true);
    setLookupError(null);
    setLookupResult(null);
    
    try {
      const response = await api.get(`/writing-tasks/vocab/${cleanWord}`);
      if (response.data?.data) {
        setLookupResult(response.data.data);
      } else {
        throw new Error("No data");
      }
    } catch (err) {
      try {
        const response = await api.get(`/vocab/${cleanWord}`);
        if (response.data?.data) {
          setLookupResult(response.data.data);
        } else {
          throw new Error("No data");
        }
      } catch (err2) {
        setLookupError(`"${rawWord}" was not found in our IELTS academic dictionary.`);
      }
    } finally {
      setLookupLoading(false);
    }
  };

  const renderInteractiveText = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\s+)/);
    return parts.map((part, index) => {
      if (/^\s+$/.test(part)) {
        return <span key={index}>{part}</span>;
      }
      
      const wordMatch = part.match(/^([^\w]*)([\w'-]+)([^\w]*)$/);
      if (!wordMatch) {
        return <span key={index}>{part}</span>;
      }
      
      const [, before, wordClean, after] = wordMatch;
      return (
        <span key={index}>
          {before}
          <span 
            className="cursor-pointer hover:bg-emerald-500/20 hover:text-emerald-400 border-b border-dashed border-zinc-600 hover:border-emerald-400 px-0.5 rounded transition-all duration-150 inline-block font-sans"
            onClick={(e) => {
              e.stopPropagation();
              handleWordLookup(wordClean);
            }}
          >
            {wordClean}
          </span>
          {after}
        </span>
      );
    });
  };

  const filteredNews = activeCategory === "All" 
    ? news 
    : activeCategory === "Saved"
    ? savedArticles
    : news.filter(item => {
        if (!item.category) return false;
        if (Array.isArray(item.category)) {
          return item.category.includes(activeCategory.toLowerCase()) || item.category.includes(activeCategory);
        }
        return String(item.category).toLowerCase() === activeCategory.toLowerCase();
      });

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader
        title="Global News Feed"
        titleClassName="text-2xl font-serif text-emerald-500"
        description="Practice reading with articles relevant to IELTS topics."
      />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto">
          {/* Categories */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-24 bg-white/5 rounded-full shrink-0" />
              ))
            ) : (
              categories.map((cat) => (
                <Button 
                  key={cat} 
                  variant={activeCategory === cat ? 'default' : 'outline'}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-6 h-10 shrink-0 ${activeCategory === cat ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'border-white/10 text-zinc-400 hover:text-white hover:bg-white/5'}`}
                >
                  {cat === "All" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Button>
              ))
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main News List */}
            <div className="lg:col-span-3 space-y-6">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="bg-[#1a211e] border-white/5 rounded-3xl shadow-none overflow-hidden h-[200px] flex">
                    <Skeleton className="w-[30%] h-full bg-white/5" />
                    <div className="p-6 flex-1 flex flex-col gap-4">
                      <Skeleton className="h-6 w-3/4 bg-white/5" />
                      <Skeleton className="h-4 w-full bg-white/5" />
                      <Skeleton className="h-4 w-1/2 bg-white/5 mt-auto" />
                    </div>
                  </Card>
                ))
              ) : filteredNews.length === 0 ? (
                <div className="py-20 text-center bg-white/5 rounded-3xl">
                  <p className="text-zinc-500">No news found for this category.</p>
                </div>
              ) : (
                filteredNews.map((item, i) => {
                  const categoryName = Array.isArray(item.category) 
                    ? item.category[0] 
                    : item.category || "General";
                  
                  const formattedCategory = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

                  return (
                    <Card 
                      key={i} 
                      onClick={() => handleArticleClick(item)}
                      className="bg-[#1a211e] border-white/5 rounded-3xl shadow-none overflow-hidden group hover:border-emerald-500/30 transition-all cursor-pointer"
                    >
                      <div className="flex flex-col md:flex-row h-full">
                        <div className="md:w-1/3 relative overflow-hidden h-48 md:h-auto bg-zinc-800">
                          <img 
                            src={item.image_url || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000&auto=format&fit=crop"} 
                            alt={item.title}
                            onError={(e) => {
                              (e.target as HTMLImageElement).onerror = null;
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000&auto=format&fit=crop";
                            }}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60"
                          />
                          <Badge className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border-none text-[10px] font-bold tracking-widest uppercase text-white">
                            {formattedCategory}
                          </Badge>
                        </div>
                        <div className="p-6 md:w-2/3 flex flex-col">
                          <div className="flex items-center gap-3 text-[10px] font-bold text-emerald-500 tracking-widest uppercase mb-3">
                            {item.source_name || "Global Times"} • {item.readTime || "5 min read"}
                          </div>
                          <h3 className="text-xl font-bold text-white font-serif group-hover:text-emerald-400 transition-colors mb-3 leading-tight">
                            {item.title}
                          </h3>
                          <p className="text-zinc-500 text-sm line-clamp-2 mb-6">
                            {item.description || item.summary || "Explore the latest developments in this topic. Perfect for building vocabulary and topic knowledge for Task 2 essays."}
                          </p>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSaveArticle(item);
                                }}
                                className="h-8 text-zinc-500 hover:text-white hover:bg-white/5 px-2 gap-2"
                              >
                                <Bookmark className={`size-4 ${savedArticles.some(a => a.article_id === item.article_id) ? 'fill-emerald-500 text-emerald-500' : ''}`} />
                                {savedArticles.some(a => a.article_id === item.article_id) ? 'Saved' : 'Save'}
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleArticleClick(item);
                                }}
                                className="h-8 text-zinc-500 hover:text-white hover:bg-white/5 px-2 gap-2"
                              >
                                <ExternalLink className="size-4" /> Read
                              </Button>
                            </div>
                            <span className="text-[10px] text-zinc-600 font-medium italic">
                              {formatTimeAgo(item.pubDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
              <Card className="bg-[#111614] border-white/5 rounded-3xl shadow-none">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                    <Flame className="size-4 text-orange-500" /> Trending Topics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {["Environment", "AI & Robotics", "Public Health", "Space Exploration"].map((topic, i) => {
                    const counts = [12, 8, 15, 6];
                    return (
                      <div key={i} className="flex items-center justify-between group cursor-pointer" onClick={() => setActiveCategory(topic)}>
                        <span className="text-sm text-zinc-400 group-hover:text-white transition-colors">{topic}</span>
                        <Badge variant="outline" className="text-[9px] border-white/5 text-zinc-600 group-hover:border-emerald-500/30 group-hover:text-emerald-500">
                          {counts[i]}
                        </Badge>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card className="bg-emerald-600/10 border-emerald-500/20 rounded-3xl shadow-none p-6">
                <h4 className="text-sm font-bold text-white mb-2">Reading Challenge</h4>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  Read 3 articles today to unlock the **Academic Explorer** badge.
                </p>
                <div className="w-full bg-black/20 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${Math.min(100, (readCount / 3) * 100)}%` }} />
                </div>
                <p className="text-[10px] text-zinc-500 mt-2 text-right">{readCount}/3 completed</p>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Article Reader Sheet */}
      <Sheet open={!!selectedArticle} onOpenChange={(open) => { if (!open) { setSelectedArticle(null); setSelectedWord(null); setLookupResult(null); } }}>
        <SheetContent className="w-full sm:max-w-4xl bg-[#0f1412] border-white/5 text-white p-0 flex flex-col h-full" showCloseButton={true}>
          <SheetHeader className="sr-only">
            <SheetTitle>{selectedArticle?.title || "Article Reader"}</SheetTitle>
            <SheetDescription>
              {selectedArticle?.description || "Read IELTS articles"}
            </SheetDescription>
          </SheetHeader>
          {selectedArticle && (
            <div className="flex flex-col md:flex-row h-full overflow-hidden">
              {/* Left Column: Article Body */}
              <div className={`flex-1 flex flex-col h-full overflow-y-auto p-6 md:p-8 transition-all ${selectedWord ? 'md:max-w-[60%] border-r border-white/5' : ''}`}>
                <div className="flex items-center justify-between mb-4 mt-6">
                  <Badge className="bg-emerald-600 text-white hover:bg-emerald-700 uppercase text-[10px] tracking-wider px-2.5 py-1">
                    {Array.isArray(selectedArticle.category) ? selectedArticle.category[0] : selectedArticle.category || "General"}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-zinc-400 hover:text-white"
                    onClick={() => toggleSaveArticle(selectedArticle)}
                  >
                    <Bookmark className={`size-4 mr-2 ${savedArticles.some(a => a.article_id === selectedArticle.article_id) ? 'fill-emerald-500 text-emerald-500' : ''}`} />
                    {savedArticles.some(a => a.article_id === selectedArticle.article_id) ? 'Saved' : 'Save'}
                  </Button>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold font-serif text-white mb-4 leading-tight">
                  {selectedArticle.title}
                </h2>

                <div className="flex items-center gap-3 text-xs text-zinc-500 mb-6 pb-6 border-b border-white/5">
                  <span className="font-semibold text-emerald-500">{selectedArticle.source_name || "Global Times"}</span>
                  <span>•</span>
                  <span>{selectedArticle.readTime || "5 min read"}</span>
                  <span>•</span>
                  <span>{formatTimeAgo(selectedArticle.pubDate)}</span>
                </div>

                {selectedArticle.image_url && (
                  <div className="w-full h-48 md:h-64 relative rounded-2xl overflow-hidden mb-6 bg-zinc-800 shrink-0">
                    <img
                      src={selectedArticle.image_url}
                      alt={selectedArticle.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).onerror = null;
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000&auto=format&fit=crop";
                      }}
                      className="absolute inset-0 w-full h-full object-cover opacity-80"
                    />
                  </div>
                )}

                <div className="prose prose-invert max-w-none text-zinc-300 text-base md:text-lg leading-relaxed space-y-6 font-serif">
                  <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 text-xs font-sans text-emerald-400 mb-4 flex items-center gap-2">
                    <Sparkles className="size-4 shrink-0" />
                    <span>Click on any word to search its definition, phonetic, and synonyms instantly.</span>
                  </div>

                  <p className="whitespace-pre-line leading-loose tracking-wide">
                    {renderInteractiveText(selectedArticle.description || selectedArticle.summary || "")}
                  </p>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 flex flex-wrap items-center gap-4">
                  <Button
                    onClick={() => selectedArticle.link && window.open(selectedArticle.link, '_blank')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 h-11"
                  >
                    <ExternalLink className="size-4" /> Open Original Article
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      markArticleAsRead(selectedArticle.article_id || selectedArticle.link);
                    }}
                    className="border-white/10 text-zinc-300 hover:text-white rounded-xl h-11"
                    disabled={readArticleIds.includes(selectedArticle.article_id || selectedArticle.link)}
                  >
                    {readArticleIds.includes(selectedArticle.article_id || selectedArticle.link) ? (
                      <span className="flex items-center gap-1.5"><Check className="size-4 text-emerald-500" /> Completed</span>
                    ) : (
                      "Mark as Read"
                    )}
                  </Button>
                </div>
              </div>

              {/* Right Column: Dictionary Panel */}
              {selectedWord && (
                <div className="w-full md:w-[40%] bg-[#151c19] border-t md:border-t-0 border-white/5 p-6 flex flex-col h-[350px] md:h-full shrink-0">
                  <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4 shrink-0 mt-6 md:mt-0">
                    <div className="flex items-center gap-2 text-zinc-400 text-xs uppercase font-bold tracking-wider">
                      <Book className="size-4 text-emerald-500" /> IELTS Dictionary
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => { setSelectedWord(null); setLookupResult(null); }}
                      className="rounded-full text-zinc-500 hover:text-white size-8"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>

                  <div className="flex-1 overflow-y-auto min-h-0 space-y-4 no-scrollbar">
                    {lookupLoading ? (
                      <div className="py-12 space-y-4">
                        <Skeleton className="h-8 w-24 bg-white/5" />
                        <Skeleton className="h-4 w-full bg-white/5" />
                        <Skeleton className="h-4 w-3/4 bg-white/5" />
                        <Skeleton className="h-20 w-full bg-white/5 rounded-xl" />
                      </div>
                    ) : lookupError ? (
                      <div className="py-12 text-center">
                        <div className="text-zinc-500 text-sm mb-2">{lookupError}</div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`https://dictionary.cambridge.org/dictionary/english/${selectedWord}`, '_blank')}
                          className="border-white/10 text-xs"
                        >
                          Search Cambridge Dictionary <ExternalLink className="size-3 ml-1" />
                        </Button>
                      </div>
                    ) : lookupResult ? (
                      <div className="space-y-6">
                        <div>
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className="text-2xl font-serif font-bold text-white leading-tight">
                              {lookupResult.word}
                            </h3>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleSaveVocab(lookupResult)}
                              className={`h-8 border-white/10 hover:bg-emerald-600/10 text-xs px-2.5 rounded-lg ${savedVocab.includes(lookupResult.word.toLowerCase()) ? 'bg-emerald-600/10 text-emerald-400 border-emerald-500/30' : 'text-zinc-400'}`}
                            >
                              {savedVocab.includes(lookupResult.word.toLowerCase()) ? (
                                <span className="flex items-center gap-1"><Check className="size-3" /> Saved</span>
                              ) : (
                                <span className="flex items-center gap-1"><Plus className="size-3" /> Save Word</span>
                              )}
                            </Button>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-500">
                            <span className="text-emerald-500 italic">{lookupResult.partOfSpeech || "academic"}</span>
                            {lookupResult.phonetic && (
                              <>
                                <span>•</span>
                                <span>{lookupResult.phonetic}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Definition</span>
                          <p className="text-zinc-200 text-sm leading-relaxed">
                            {lookupResult.definition}
                          </p>
                        </div>

                        {lookupResult.examples && lookupResult.examples.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Example Usage</span>
                            <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-zinc-400 text-xs italic space-y-2 leading-relaxed">
                              {lookupResult.examples.map((ex: string, index: number) => (
                                <div key={index}>"{ex}"</div>
                              ))}
                            </div>
                          </div>
                        )}

                        {lookupResult.synonyms && lookupResult.synonyms.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Synonyms</span>
                            <div className="flex flex-wrap gap-1.5">
                              {lookupResult.synonyms.map((syn: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  onClick={() => handleWordLookup(syn)}
                                  className="text-[10px] border-white/5 hover:border-emerald-500/30 hover:text-emerald-400 bg-white/5 cursor-pointer"
                                >
                                  {syn}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Badge Celebration Dialog */}
      {showBadgeCelebration && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <Card className="bg-[#111614] border-emerald-500/30 max-w-md w-full rounded-3xl p-8 text-center space-y-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />
            <div className="mx-auto w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30 animate-bounce">
              <Trophy className="size-10 text-emerald-400" />
            </div>
            
            <div className="space-y-2">
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 uppercase tracking-widest text-[10px] font-bold">
                Badge Unlocked
              </Badge>
              <h3 className="text-2xl font-bold text-white font-serif">Academic Explorer</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Congratulations! You have completed today's Reading Challenge by reading 3 IELTS topic articles.
              </p>
            </div>
            
            <Button
              onClick={() => setShowBadgeCelebration(false)}
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
            >
              Excellent, Continue
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
