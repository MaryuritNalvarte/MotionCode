import { useState } from "react";
import { ArrowLeft, Flame, TrendingUp, Filter } from "lucide-react";
import { allAnimations } from "../utils/data-bridge";
import type { AnimationProject } from "../utils/types";
import { AnimationCard } from "./AnimationCard";
import { useLang } from "./LangContext";

const PERIODS = ["This Week", "This Month", "All Time"];
const CATEGORIES = ["All", "CSS", "JavaScript", "Canvas", "Cursors", "Loading", "Three.js"];

interface TrendingPageProps {
  onBack: () => void;
  onViewProject: (p: AnimationProject) => void;
}

export function TrendingPage({ onBack, onViewProject }: TrendingPageProps) {
  const { t } = useLang();
  const [period, setPeriod] = useState("This Week");
  const [category, setCategory] = useState("All");

  const items = allAnimations
    .filter((a: AnimationProject) => a.isTrending || a.views > 30000)
    .filter((a: AnimationProject) => category === "All" || a.category === category)
    .sort((a: AnimationProject, b: AnimationProject) => b.views - a.views);

  const top3 = items.slice(0, 3);
  const rest = items.slice(3);

  return (
    <div className="min-h-screen pt-24 pb-20 px-5 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <button onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium transition-all hover:-translate-x-0.5"
            style={{ fontFamily: "Inter, sans-serif", color: "#374151" }}
            onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.color = "#a78bfa"}
            onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.color = "#374151"}
          >
            <ArrowLeft size={15} /> {t.explore}
          </button>
          <span style={{ color: "#1f2937" }}>/</span>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#ec4899" }}>{t.trendingTitle}</span>
        </div>

        {/* Header */}
        <div className="relative rounded-3xl p-8 mb-8 overflow-hidden"
          style={{ background: "rgba(8,10,28,0.8)", border: "1px solid rgba(236,72,153,0.18)", backdropFilter: "blur(20px)" }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 80% at 0% 50%, rgba(236,72,153,0.1), transparent 65%)" }} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 40% 60% at 100% 50%, rgba(139,92,246,0.07), transparent 65%)" }} />

          <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
              style={{ background: "rgba(236,72,153,0.12)", border: "1px solid rgba(236,72,153,0.28)", boxShadow: "0 0 30px rgba(236,72,153,0.2)" }}>
              🔥
            </div>
            <div className="flex-1">
              <h1 style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "clamp(1.6rem,3.5vw,2.4rem)", letterSpacing: "-0.03em", color: "#f0f0ff", marginBottom: 6 }}>
                {t.trendingTitle}
              </h1>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#4b5563" }}>
                {t.trendingSubtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Ad below header */}
        <div className="mb-8">
          <div className="w-full rounded-2xl flex items-center justify-center"
            style={{ minHeight: 64, background: "rgba(8,10,28,0.4)", border: "1px dashed rgba(236,72,153,0.08)" }}>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#1a1a2e" }}>
              [Google AdSense — Trending 728×90]
            </span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          {/* Period tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            {PERIODS.map((p) => (
              <button key={p} onClick={() => setPeriod(p)}
                className="px-4 py-2 rounded-lg text-xs font-medium transition-all"
                style={{
                  fontFamily: "Inter, sans-serif",
                  background: period === p ? "rgba(236,72,153,0.18)" : "transparent",
                  color: period === p ? "#f472b6" : "#374151",
                  border: period === p ? "1px solid rgba(236,72,153,0.35)" : "1px solid transparent",
                }}>
                {p}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Filter size={13} className="text-gray-600" />
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCategory(c)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all hover:scale-105"
                style={{
                  fontFamily: "Inter, sans-serif",
                  background: category === c ? "rgba(139,92,246,0.18)" : "rgba(255,255,255,0.03)",
                  color: category === c ? "#c4b5fd" : "#4b5563",
                  border: category === c ? "1px solid rgba(139,92,246,0.4)" : "1px solid rgba(255,255,255,0.06)",
                }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Podium — top 3 */}
        {top3.length >= 3 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp size={15} style={{ color: "#ec4899" }} />
              <h2 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "16px", color: "#f0f0ff" }}>
                Top 3 This Week
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {top3.map((p: AnimationProject, i: number) => (
                <div key={p.id} className="relative">
                  {/* Rank badge */}
                  <div
                    className="absolute -top-3 -left-3 z-20 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black"
                    style={{
                      fontFamily: "Sora, sans-serif",
                      background: ["linear-gradient(135deg,#f59e0b,#fcd34d)", "linear-gradient(135deg,#6b7280,#9ca3af)", "linear-gradient(135deg,#92400e,#ca8a04)"][i],
                      color: "#fff",
                      boxShadow: `0 0 15px ${["rgba(245,158,11,0.6)","rgba(107,114,128,0.5)","rgba(146,64,14,0.5)"][i]}`,
                    }}
                  >
                    {i + 1}
                  </div>
                  <AnimationCard project={p} onView={onViewProject} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rest */}
        {rest.length > 0 && (
          <>
            <div className="flex items-center gap-2 mb-5">
              <Flame size={15} style={{ color: "#f59e0b" }} />
              <h2 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "16px", color: "#f0f0ff" }}>
                Also Trending
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {rest.map((p: AnimationProject, idx: number) => (
                <div key={p.id}>
                  <AnimationCard project={p} onView={onViewProject} />
                  {(idx + 1) % 8 === 0 && (
                    <div className="col-span-full mt-2 mb-2">
                      <div className="w-full rounded-2xl flex items-center justify-center"
                        style={{ minHeight: 64, background: "rgba(8,10,28,0.4)", border: "1px dashed rgba(99,62,210,0.08)" }}>
                        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#1a1a2e" }}>
                          [Google AdSense — Between Results]
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Footer ad */}
        <div className="mt-12">
          <div className="w-full rounded-2xl flex items-center justify-center"
            style={{ minHeight: 90, background: "rgba(8,10,28,0.4)", border: "1px dashed rgba(99,62,210,0.08)" }}>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#1a1a2e" }}>
              [Google AdSense — Trending Footer]
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
