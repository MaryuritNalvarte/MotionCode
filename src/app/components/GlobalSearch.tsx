import { useState, useRef, useEffect } from "react";
import { Search, X, TrendingUp, Clock, ArrowRight, Flame } from "lucide-react";
import { allAnimations } from "../utils/data-bridge";
import type { AnimationProject } from "../utils/types";
import { useLang } from "./LangContext";

interface GlobalSearchProps {
  onViewProject: (p: AnimationProject) => void;
}

export function GlobalSearch({ onViewProject }: GlobalSearchProps) {
  const { t } = useLang();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [recent, setRecent] = useState<string[]>(["cursor", "heart", "particles"]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = query.trim().length > 0
    ? allAnimations.filter((a: AnimationProject) =>
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.tags.some((t: string) => t.toLowerCase().includes(query.toLowerCase())) ||
        a.category.toLowerCase().includes(query.toLowerCase()) ||
        a.creator.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : [];

  const showDropdown = focused && (query.length > 0 || true);

  const handleSelect = (p: AnimationProject) => {
    if (!recent.includes(p.title)) setRecent((r) => [p.title, ...r].slice(0, 5));
    setQuery("");
    setFocused(false);
    onViewProject(p);
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
    inputRef.current?.focus();
  };

  // Close on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <div className="px-5 sm:px-8 py-8">
      <div className="max-w-3xl mx-auto" ref={containerRef}>
        {/* Search box */}
        <div
          className="relative transition-all duration-300"
          style={{
            filter: focused ? "drop-shadow(0 0 20px rgba(124,58,237,0.25))" : "none",
            zIndex: focused ? 9998 : 'auto',
          }}
        >
          <div
            className="flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300"
            style={{
              background: "rgba(8,10,28,0.9)",
              border: focused
                ? "1px solid rgba(139,92,246,0.55)"
                : "1px solid rgba(99,62,210,0.2)",
              boxShadow: focused
                ? "0 0 0 4px rgba(139,92,246,0.1)"
                : "none",
              backdropFilter: "blur(20px)",
            }}
          >
            <Search
              size={18}
              style={{ color: focused ? "#8b5cf6" : "#374151", transition: "color 0.2s", flexShrink: 0 }}
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              placeholder={t.searchPlaceholder}
              className="flex-1 bg-transparent outline-none text-base"
              style={{
                fontFamily: "Inter, sans-serif",
                color: "#f0f0ff",
                fontSize: "15px",
              }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="transition-all hover:scale-110"
                style={{ color: "#374151" }}
              >
                <X size={16} />
              </button>
            )}
            {/* Keyboard shortcut hint */}
            {!focused && !query && (
              <kbd
                className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg text-xs"
                style={{ fontFamily: "JetBrains Mono, monospace", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#374151" }}
              >
                /
              </kbd>
            )}
          </div>

          {/* Dropdown */}
          {focused && (
            <div
              className="absolute left-0 right-0 top-full mt-2 rounded-2xl overflow-hidden"
              style={{
                background: "rgba(8,10,28,0.97)",
                border: "1px solid rgba(99,62,210,0.2)",
                backdropFilter: "blur(30px)",
                boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
                animation: "searchDrop 0.18s cubic-bezier(0.16,1,0.3,1)",
                zIndex: 9999,
              }}
            >
              <style>{`@keyframes searchDrop { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }`}</style>

              {results.length > 0 ? (
                <div className="p-2">
                  <div className="px-3 py-2 flex items-center gap-2">
                    <TrendingUp size={11} style={{ color: "#6b5de3" }} />
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#374151", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>
                      Results
                    </span>
                  </div>
                  {results.map((p: AnimationProject) => (
                    <button
                      key={p.id}
                      onClick={() => handleSelect(p)}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-150 text-left"
                      style={{ background: "transparent" }}
                      onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.background = "rgba(139,92,246,0.08)"}
                      onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.background = "transparent"}
                    >
                      <div
                        className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-sm"
                        style={{
                          background: `linear-gradient(135deg, ${p.gradientFrom}20, ${p.gradientTo}15)`,
                          border: `1px solid ${p.gradientFrom}30`,
                        }}
                      >
                        {p.categoryIcon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "13px", color: "#e2e8f0" }}>{p.title}</p>
                        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#374151" }}>
                          {p.category} · {p.difficulty}
                        </p>
                      </div>
                      {p.isTrending && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold shrink-0"
                          style={{ background: "rgba(236,72,153,0.12)", color: "#f472b6", border: "1px solid rgba(236,72,153,0.2)" }}>
                          <Flame size={8} /> HOT
                        </span>
                      )}
                      <ArrowRight size={13} style={{ color: "#374151", flexShrink: 0 }} />
                    </button>
                  ))}
                </div>
              ) : query.trim().length > 0 ? (
                <div className="px-5 py-8 text-center">
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#374151" }}>
                    No results for "<span style={{ color: "#a78bfa" }}>{query}</span>"
                  </p>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#1f2937", marginTop: 4 }}>
                    Try: cursor, glitch, wave, orbit...
                  </p>
                </div>
              ) : (
                <div className="p-2">
                  {/* Recent */}
                  {recent.length > 0 && (
                    <>
                      <div className="px-3 py-2 flex items-center gap-2">
                        <Clock size={11} style={{ color: "#374151" }} />
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#374151", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>
                          Recent
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 px-3 pb-3">
                        {recent.map((r) => (
                          <button key={r} onClick={() => handleExampleClick(r)}
                            className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all hover:scale-105"
                            style={{ fontFamily: "Inter, sans-serif", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#72729a" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#c4b5fd"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(139,92,246,0.3)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#72729a"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.07)"; }}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Quick jumps */}
                  <div className="border-t px-3 py-3" style={{ borderColor: "rgba(99,62,210,0.1)" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp size={11} style={{ color: "#6b5de3" }} />
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#374151", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>
                        Popular Searches
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(t.searchExamples as readonly string[]).map((ex) => (
                        <button key={ex} onClick={() => handleExampleClick(ex)}
                          className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all hover:scale-105"
                          style={{ fontFamily: "JetBrains Mono, monospace", background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.18)", color: "#6b5de3" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(139,92,246,0.15)"; (e.currentTarget as HTMLButtonElement).style.color = "#a78bfa"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(139,92,246,0.08)"; (e.currentTarget as HTMLButtonElement).style.color = "#6b5de3"; }}
                        >
                          {ex}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hint text below */}
        {!focused && (
          <p className="text-center mt-3" style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#1f2937" }}>
            {t.searchHint}
          </p>
        )}
      </div>
    </div>
  );
}
