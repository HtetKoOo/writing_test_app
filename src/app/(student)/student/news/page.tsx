"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Newspaper, ExternalLink, Bookmark, Clock, Flame } from "lucide-react";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsRes, catRes] = await Promise.all([
          api.get('/news/feed'),
          api.get('/news/categories')
        ]);
        setNews(newsRes.data.data || []);
        setCategories(["All", ...(catRes.data.data || [])]);
      } catch (error) {
        console.error("Failed to fetch news data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredNews = activeCategory === "All" 
    ? news 
    : news.filter(item => item.category === activeCategory);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-[#111614]">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden text-zinc-400 hover:text-white" />
          <div>
            <h1 className="text-2xl font-bold text-white font-serif tracking-tight text-emerald-500">Global News Feed</h1>
            <p className="text-zinc-500 text-sm mt-1">Practice reading with articles relevant to IELTS topics.</p>
          </div>
        </div>
      </header>

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
                  {cat}
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
                filteredNews.map((item, i) => (
                  <Card key={i} className="bg-[#1a211e] border-white/5 rounded-3xl shadow-none overflow-hidden group hover:border-emerald-500/30 transition-all cursor-pointer">
                    <div className="flex flex-col md:flex-row h-full">
                      <div className="md:w-1/3 relative overflow-hidden h-48 md:h-auto bg-zinc-800">
                        <img 
                          src={item.imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000&auto=format&fit=crop"} 
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60"
                        />
                        <Badge className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border-none text-[10px] font-bold tracking-widest uppercase">
                          {item.category}
                        </Badge>
                      </div>
                      <div className="p-6 md:w-2/3 flex flex-col">
                        <div className="flex items-center gap-3 text-[10px] font-bold text-emerald-500 tracking-widest uppercase mb-3">
                          {item.source || "Global Times"} • {item.readTime || "5 min read"}
                        </div>
                        <h3 className="text-xl font-bold text-white font-serif group-hover:text-emerald-400 transition-colors mb-3 leading-tight">
                          {item.title}
                        </h3>
                        <p className="text-zinc-500 text-sm line-clamp-2 mb-6">
                          {item.description || item.summary || "Explore the latest developments in this topic. Perfect for building vocabulary and topic knowledge for Task 2 essays."}
                        </p>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" className="h-8 text-zinc-500 hover:text-white hover:bg-white/5 px-2 gap-2">
                              <Bookmark className="size-4" /> Save
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 text-zinc-500 hover:text-white hover:bg-white/5 px-2 gap-2">
                              <ExternalLink className="size-4" /> Read
                            </Button>
                          </div>
                          <span className="text-[10px] text-zinc-600 font-medium italic">
                            Published 2 hours ago
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              ))}
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
                  {["Environment", "AI & Robotics", "Public Health", "Space Exploration"].map((topic, i) => (
                    <div key={i} className="flex items-center justify-between group cursor-pointer">
                      <span className="text-sm text-zinc-400 group-hover:text-white transition-colors">{topic}</span>
                      <Badge variant="outline" className="text-[9px] border-white/5 text-zinc-600 group-hover:border-emerald-500/30 group-hover:text-emerald-500">
                        {Math.floor(Math.random() * 20) + 5}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-emerald-600/10 border-emerald-500/20 rounded-3xl shadow-none p-6">
                <h4 className="text-sm font-bold text-white mb-2">Reading Challenge</h4>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  Read 3 articles today to unlock the **Academic Explorer** badge.
                </p>
                <div className="w-full bg-black/20 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-2/3" />
                </div>
                <p className="text-[10px] text-zinc-500 mt-2 text-right">2/3 completed</p>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
