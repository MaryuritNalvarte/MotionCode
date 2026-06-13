import { useState, useMemo } from "react";
import { ArrowLeft, Filter, SlidersHorizontal, LayoutGrid, Rows3 } from "lucide-react";
import { allAnimations } from "../utils/data-bridge";
import { categories } from "./data";
import type { AnimationProject } from "../utils/types";
import { AnimationCard } from "./AnimationCard";
import { useLang } from "./LangContext";

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "new",     label: "Newest" },
  { value: "stars",   label: "Most Starred" },
  { value: "az",      label: "A → Z" },
];

const DIFF_OPTIONS = ["All", "Beginner", "Intermediate", "Advanced"] as const;

interface CategoryPageProps {
  categoryId: string;   // e.g. "css" | "javascript" | "particles" | "trending" | "new"
  onBack: () => void;
  onViewProject: (p: AnimationProject) => void;
}

export function CategoryPage({ categoryId, onBack, onViewProject }: CategoryPageProps) {
  const { t } = useLang();
  const [sort, setSort] = useState("popular");
  const [difficulty, setDifficulty] = useState<"All" | "Beginner" | "Intermediate" | "Advanced">("All");
  const [columns, setColumns] = useState<3 | 4>(4);
  const [visibleCount, setVisibleCount] = useState(12);

  // Find category meta
  const catMeta = categories.find((c) => c.id === categoryId);
  const isSpecial = categoryId === "trending" || categoryId === "new";

  const catLabel = catMeta?.name ?? (categoryId === "trending" ? t.trendingTitle : categoryId.charAt(0).toUpperCase() + categoryId.slice(1));
  const catIcon  = catMeta?.icon ?? (categoryId === "trending" ? "🔥" : "✨");
  const [gradA, gradB] = catMeta?.gradient ?? ["#8b5cf6", "#3b82f6"];

  // Filter
  const baseItems = useMemo(() => {
    let items = allAnimations;
    if (categoryId === "trending") items = items.filter((a: AnimationProject) => a.isTrending);
    else if (categoryId === "new")  items = items.filter((a: AnimationProject) => a.isNew);
    else items = items.filter((a: AnimationProject) => a.rows?.includes(categoryId) || a.categorySlug === categoryId);
    if (difficulty !== "All") items = items.filter((a: AnimationProject) => a.difficulty === difficulty);
    return items;
  }, [categoryId, difficulty]);

  const sorted = useMemo(() => {
    const arr = [...baseItems];
    if (sort === "popular") arr.sort((a: AnimationProject, b: AnimationProject) => b.views - a.views);
    if (sort === "new")     arr.sort((a: AnimationProject, b: AnimationProject) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    if (sort === "stars")   arr.sort((a: AnimationProject, b: AnimationProject) => b.stars - a.stars);
    if (sort === "az")      arr.sort((a: AnimationProject, b: AnimationProject) => a.title.localeCompare(b.title));
    return arr;
  }, [baseItems, sort]);

  const visible = sorted.slice(0, visibleCount);

  return (
    <div className="min-h-screen pt-24 pb-20 px-5 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium transition-all hover:-translate-x-0.5 duration-200"
            style={{ fontFamily: "Inter, sans-serif", color: "#374151" }}
            onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.color = "#a78bfa"}
            onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.color = "#374151"}
          >
            <ArrowLeft size={15} /> {t.explore}
          </button>
          <span style={{ color: "#1f2937" }}>/</span>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#6b5de3" }}>{catLabel}</span>
        </div>

        {/* Page header */}
        <div className="relative rounded-3xl p-8 mb-10 overflow-hidden"
          style={{ background: "rgba(8,10,28,0.8)", border: "1px solid rgba(99,62,210,0.15)", backdropFilter: "blur(20px)" }}>
          {/* Gradient blobs */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 80% at 0% 50%, ${gradA}12, transparent 60%)` }} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 40% 60% at 100% 0%, ${gradB}0a, transparent 60%)` }} />

          <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
              style={{
                background: `linear-gradient(135deg, ${gradA}20, ${gradB}15)`,
                border: `1px solid ${gradA}35`,
                boxShadow: `0 0 30px ${gradA}25`,
              }}
            >
              {catIcon}
            </div>
            <div className="flex-1">
              <h1
                style={{
                  fontFamily: "Sora, sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
                  letterSpacing: "-0.03em",
                  color: "#f0f0ff",
                  marginBottom: 6,
                }}
              >
                {catLabel}
              </h1>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#4b5563", lineHeight: 1.6 }}>
                {catMeta?.description ?? t.trendingSubtitle}
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="text-center">
                <p style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "1.8rem", background: `linear-gradient(135deg, ${gradA}, ${gradB})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", letterSpacing: "-0.04em" }}>
                  {sorted.length}
                </p>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#374151", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  animations
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ad space — below header */}
        <div className="mb-8">
          <div className="w-full rounded-2xl flex items-center justify-center"
            style={{ minHeight: 64, background: "rgba(8,10,28,0.4)", border: "1px dashed rgba(99,62,210,0.08)" }}>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#1a1a2e" }}>
              [Google AdSense — Category Header 728×90]
            </span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          {/* Difficulty filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Filter size={13} className="text-gray-600" />
            {DIFF_OPTIONS.map((d) => (
              <button key={d} onClick={() => setDifficulty(d)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all hover:scale-105"
                style={{
                  fontFamily: "Inter, sans-serif",
                  background: difficulty === d ? "rgba(139,92,246,0.18)" : "rgba(255,255,255,0.03)",
                  color: difficulty === d ? "#c4b5fd" : "#4b5563",
                  border: difficulty === d ? "1px solid rgba(139,92,246,0.4)" : "1px solid rgba(255,255,255,0.06)",
                }}>
                {d}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal size={13} className="text-gray-600" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium outline-none cursor-pointer"
                style={{
                  fontFamily: "Inter, sans-serif",
                  background: "rgba(8,10,28,0.9)",
                  border: "1px solid rgba(99,62,210,0.2)",
                  color: "#72729a",
                }}
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Column toggle */}
            <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <button onClick={() => setColumns(3)}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                style={{ background: columns === 3 ? "rgba(139,92,246,0.2)" : "transparent", color: columns === 3 ? "#c4b5fd" : "#374151" }}>
                <Rows3 size={13} />
              </button>
              <button onClick={() => setColumns(4)}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                style={{ background: columns === 4 ? "rgba(139,92,246,0.2)" : "transparent", color: columns === 4 ? "#c4b5fd" : "#374151" }}>
                <LayoutGrid size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Count */}
        <p className="mb-6" style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#374151" }}>
          Showing <span style={{ color: "#a78bfa" }}>{Math.min(visibleCount, sorted.length)}</span> of <span style={{ color: "#a78bfa" }}>{sorted.length}</span> animations
        </p>

        {/* Grid */}
        {visible.length > 0 ? (
          <div className={`grid gap-5 ${
            columns === 3
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          }`}>
            {visible.map((project, idx) => (
              <div key={project.id}>
                <AnimationCard project={project} onView={onViewProject} />
                {/* Ad every 8 cards */}
                {(idx + 1) % 8 === 0 && idx < visible.length - 1 && (
                  <div className="col-span-full mt-2 mb-2">
                    <div className="w-full rounded-2xl flex items-center justify-center"
                      style={{ minHeight: 64, background: "rgba(8,10,28,0.4)", border: "1px dashed rgba(99,62,210,0.08)" }}>
                      <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#1a1a2e" }}>
                        [Google AdSense — Grid Mid]
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "15px", color: "#374151" }}>
              No animations found for this filter.
            </p>
          </div>
        )}

        {/* Load more */}
        {visibleCount < sorted.length && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setVisibleCount((c) => c + 12)}
              className="px-8 py-3.5 rounded-2xl text-sm font-semibold transition-all hover:scale-[1.03]"
              style={{
                fontFamily: "Inter, sans-serif",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(139,92,246,0.2)",
                color: "#a78bfa",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(139,92,246,0.1)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(139,92,246,0.45)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.03)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(139,92,246,0.2)"; }}
            >
              Load More ({sorted.length - visibleCount} remaining)
            </button>
          </div>
        )}

        {/* Footer ad */}
        <div className="mt-12">
          <div className="w-full rounded-2xl flex items-center justify-center"
            style={{ minHeight: 90, background: "rgba(8,10,28,0.4)", border: "1px dashed rgba(99,62,210,0.08)" }}>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#1a1a2e" }}>
              [Google AdSense — Category Footer]
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
