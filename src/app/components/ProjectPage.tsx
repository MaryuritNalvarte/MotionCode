import { useState, useEffect } from "react";
import {
  ArrowLeft, Copy, Download, ExternalLink, Check,
  Star, Eye, Heart, Code2, ChevronRight, BookOpen,
  Tag, Share2, Bookmark, Flame, Play,
} from "lucide-react";
import type { AnimationProject } from "../utils/types";
import { allAnimations } from "../utils/data-bridge";
import { useLang } from "./LangContext";

const DIFF_STYLE = {
  Beginner:     { bg: "rgba(16,185,129,0.12)", text: "#10b981", border: "rgba(16,185,129,0.25)" },
  Intermediate: { bg: "rgba(245,158,11,0.12)",  text: "#f59e0b", border: "rgba(245,158,11,0.25)" },
  Advanced:     { bg: "rgba(239,68,68,0.12)",   text: "#ef4444",  border: "rgba(239,68,68,0.25)"  },
};

/* ── Syntax-highlighted code view ── */
const TOKEN_COLORS: Record<string, string> = {
  keyword_css:    "#c084fc",
  keyword_js:     "#fbbf24",
  keyword_html:   "#60a5fa",
  string:         "#34d399",
  comment:        "#4b5563",
  number:         "#fb923c",
  property:       "#67e8f9",
  selector:       "#f472b6",
  punctuation:    "#6b7280",
  plain:          "#e2e8f0",
  tag:            "#60a5fa",
  attr:           "#f472b6",
};

function tokenizeLine(line: string, lang: "html" | "css" | "js"): { text: string; color: string }[] {
  if (/^\s*(\/\/|\/\*|\*)/.test(line)) return [{ text: line, color: TOKEN_COLORS.comment }];

  const tokens: { text: string; color: string }[] = [];
  let rem = line;

  function push(text: string, color: string) { if (text) tokens.push({ text, color }); }

  if (lang === "css") {
    // Very basic: selectors, properties, values, strings
    const parts = rem.split(/(["'][^"']*["']|#[0-9a-fA-F]{3,8}|\d+\.?\d*(px|em|rem|%|vh|vw|s|deg|fr)?|@\w+|\.\w[\w-]*|:\s*|[{}:;,()])/g);
    parts.forEach((p) => {
      if (!p) return;
      if (/^["']/.test(p)) push(p, TOKEN_COLORS.string);
      else if (/^@/.test(p)) push(p, TOKEN_COLORS.keyword_css);
      else if (/^#[0-9a-f]/i.test(p)) push(p, TOKEN_COLORS.number);
      else if (/^\d/.test(p)) push(p, TOKEN_COLORS.number);
      else if (/^\.\w/.test(p)) push(p, TOKEN_COLORS.selector);
      else push(p, TOKEN_COLORS.plain);
    });
  } else if (lang === "js") {
    const kws = ["const","let","var","function","return","if","else","for","while","class","new","this","import","export","default","async","await","=>"];
    const parts = rem.split(/(["'`][^"'`]*["'`]|\b(?:const|let|var|function|return|if|else|for|while|class|new|this|import|export|default|async|await)\b|\d+\.?\d*|[{}();,.:[\]])/g);
    parts.forEach((p) => {
      if (!p) return;
      if (/^["'`]/.test(p)) push(p, TOKEN_COLORS.string);
      else if (kws.includes(p.trim())) push(p, TOKEN_COLORS.keyword_js);
      else if (/^\d/.test(p)) push(p, TOKEN_COLORS.number);
      else if (/^[{}();,.:[\]]$/.test(p)) push(p, TOKEN_COLORS.punctuation);
      else push(p, TOKEN_COLORS.plain);
    });
  } else {
    // HTML
    const parts = rem.split(/(<\/?[\w-]+|["'][^"']*["']|[\w-]+=|>)/g);
    parts.forEach((p) => {
      if (!p) return;
      if (/^<\/?[\w]/.test(p)) push(p, TOKEN_COLORS.tag);
      else if (/^["']/.test(p)) push(p, TOKEN_COLORS.string);
      else if (/[\w-]+=$/.test(p)) push(p, TOKEN_COLORS.attr);
      else push(p, TOKEN_COLORS.plain);
    });
  }
  return tokens.length ? tokens : [{ text: line, color: TOKEN_COLORS.plain }];
}

function CodeView({ code, lang }: { code: string; lang: "html" | "css" | "js" }) {
  const [copied, setCopied] = useState(false);
  const lines = code.split("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const langLabel: Record<string, string> = { html: "index.html", css: "styles.css", js: "main.js" };

  return (
    <div className="rounded-2xl overflow-hidden flex flex-col"
      style={{ background: "rgba(3,4,14,0.95)", border: "1px solid rgba(99,62,210,0.18)", maxHeight: 420 }}>
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-5 py-3 shrink-0"
        style={{ borderBottom: "1px solid rgba(99,62,210,0.12)", background: "rgba(8,10,28,0.6)" }}>
        <div className="flex gap-1.5">
          {["#ef4444", "#f59e0b", "#10b981"].map((c) => (
            <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.6 }} />
          ))}
        </div>
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "12px", color: "#374151", marginLeft: 6 }}>
          {langLabel[lang]}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#1f1f35" }}>
            {lines.length} lines
          </span>
          <button onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105"
            style={{
              fontFamily: "Inter, sans-serif",
              background: copied ? "rgba(16,185,129,0.12)" : "rgba(139,92,246,0.1)",
              color: copied ? "#10b981" : "#a78bfa",
              border: copied ? "1px solid rgba(16,185,129,0.25)" : "1px solid rgba(139,92,246,0.22)",
            }}>
            {copied ? <Check size={11} /> : <Copy size={11} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Lines */}
      <div className="overflow-auto flex-1">
        <table className="w-full border-collapse" style={{ tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: 44 }} />
            <col />
          </colgroup>
          <tbody>
            {lines.map((line, i) => (
              <tr key={i} className="group hover:bg-white/[0.015]">
                <td
                  className="text-right pr-4 pl-3 select-none"
                  style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#1f2937", lineHeight: "20px", verticalAlign: "top", paddingTop: 2 }}
                >
                  {i + 1}
                </td>
                <td className="pr-6 pl-2" style={{ lineHeight: "20px", paddingTop: 2, whiteSpace: "pre" }}>
                  {tokenizeLine(line, lang).map((tok, j) => (
                    <span key={j} style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "12px", color: tok.color }}>
                      {tok.text}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Live preview - usa iframe para cargar los archivos reales de la animación ── */
// Ubicación para insertar código de Google AdSense si se desea monetizar el preview
function LivePreview({ project }: { project: AnimationProject }) {
  // El iframe carga index.html que incluye style.css y script.js
  // Esto garantiza Single Source of Truth: el preview usa los mismos archivos que el code viewer
  const iframeSrc = `/content/${project.slug}/index.html`;

  return (
    <iframe
      src={iframeSrc}
      sandbox="allow-scripts allow-same-origin"
      style={{
        width: '100%',
        height: '100%',
        border: 'none',
        borderRadius: '0',
        overflow: 'hidden',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
      title={`${project.title} Preview`}
      loading="lazy"
    />
  );
}

/* ── Main ProjectPage ── */
interface Props {
  project: AnimationProject;
  onBack: () => void;
  onViewProject: (p: AnimationProject) => void;
}

export function ProjectPage({ project, onBack, onViewProject }: Props) {
  const { t } = useLang();
  const [tab, setTab] = useState<"html" | "css" | "js">("html");
  const [allCopied, setAllCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [codeMap, setCodeMap] = useState({ html: "", css: "", js: "" });
  const diff = DIFF_STYLE[project.difficulty];
  const related = allAnimations.filter((a: AnimationProject) => a.id !== project.id && (a.category === project.category || a.rows?.some(r => project.rows?.includes(r)))).slice(0, 8);
  const trending = allAnimations.filter((a: AnimationProject) => a.isTrending && a.id !== project.id).slice(0, 3);

  // Cargar código de archivos externos
  // Los paths se derivan automáticamente desde el slug
  useEffect(() => {
    const loadCode = async () => {
      const basePath = `/content/${project.slug}`;
      try {
        const [htmlRes, cssRes, jsRes] = await Promise.all([
          fetch(`${basePath}/index.html`),
          fetch(`${basePath}/style.css`),
          fetch(`${basePath}/script.js`),
        ]);
        const [html, css, js] = await Promise.all([
          htmlRes.text(),
          cssRes.text(),
          jsRes.text(),
        ]);
        setCodeMap({ html, css, js });
      } catch (error) {
        console.error('Error loading animation code:', error);
        setCodeMap({ html: "// Error loading code", css: "/* Error loading code */", js: "// Error loading code" });
      }
    };
    loadCode();
  }, [project.slug]);

  const copyAll = () => {
    navigator.clipboard.writeText(codeMap.html + "\n\n" + codeMap.css + "\n\n" + codeMap.js);
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-5 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <button onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:-translate-x-0.5"
            style={{ fontFamily: "Inter, sans-serif", color: "#374151" }}
            onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.color = "#a78bfa"}
            onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.color = "#374151"}
          >
            <ArrowLeft size={15} /> Explore
          </button>
          <span style={{ color: "#1f2937" }}>/</span>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#374151" }}>{project.category}</span>
          <span style={{ color: "#1f2937" }}>/</span>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#6b5de3" }}>{project.title}</span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* ── Main column ── */}
          <div className="xl:col-span-2 flex flex-col gap-7">
            {/* Live preview */}
            <div
              className="relative rounded-3xl overflow-hidden"
              style={{ height: 360, background: "rgba(4,5,18,0.95)", border: "1px solid rgba(139,92,246,0.2)", boxShadow: "0 0 80px rgba(124,58,237,0.08)" }}
            >
              {/* BG glow */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${project.gradientFrom}0a, transparent 70%)` }} />

              <LivePreview project={project} />

              {/* Live badge */}
              <div className="absolute top-5 left-5">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
                  style={{ fontFamily: "Inter, sans-serif", background: "rgba(4,5,18,0.9)", border: "1px solid rgba(139,92,246,0.3)", color: "#a78bfa", backdropFilter: "blur(10px)" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> {t.livePreview}
                </span>
              </div>

              {/* Share/Bookmark */}
              <div className="absolute top-5 right-5 flex gap-2">
                {[
                  { Icon: Bookmark, active: bookmarked, onClick: () => setBookmarked(!bookmarked), activeColor: "#f59e0b" },
                  { Icon: Share2, active: false, onClick: () => {}, activeColor: "#3b82f6" },
                ].map(({ Icon, active, onClick, activeColor }, i) => (
                  <button key={i} onClick={onClick}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                    style={{ background: "rgba(4,5,18,0.85)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(10px)", color: active ? activeColor : "#4b5563" }}>
                    <Icon size={14} className={active ? "fill-current" : ""} />
                  </button>
                ))}
              </div>
            </div>

            {/* Project header card */}
            <div className="rounded-2xl p-6"
              style={{ background: "rgba(8,10,28,0.8)", border: "1px solid rgba(99,62,210,0.15)", backdropFilter: "blur(20px)" }}>
              {/* Title & badges */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                      style={{ fontFamily: "Inter, sans-serif", background: "rgba(59,130,246,0.12)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.22)" }}>
                      {project.categoryIcon} {project.category}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                      style={{ fontFamily: "Inter, sans-serif", background: diff.bg, color: diff.text, border: `1px solid ${diff.border}` }}>
                      {project.difficulty}
                    </span>
                    {project.isTrending && (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold"
                        style={{ fontFamily: "Inter, sans-serif", background: "rgba(236,72,153,0.12)", color: "#f472b6", border: "1px solid rgba(236,72,153,0.22)" }}>
                        <Flame size={9} /> Trending
                      </span>
                    )}
                  </div>
                  <h1 style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "clamp(1.4rem,3vw,1.9rem)", color: "#f0f0ff", letterSpacing: "-0.03em" }}>
                    {project.title}
                  </h1>
                </div>

                {/* Stat pills */}
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => setLiked(!liked)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-all hover:scale-105"
                    style={{ background: liked ? "rgba(236,72,153,0.12)" : "rgba(255,255,255,0.04)", border: liked ? "1px solid rgba(236,72,153,0.28)" : "1px solid rgba(255,255,255,0.06)", color: liked ? "#f472b6" : "#4b5563" }}>
                    <Heart size={12} className={liked ? "fill-current" : ""} />
                    {project.likes + (liked ? 1 : 0)}
                  </button>
                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#4b5563" }}>
                    <Star size={11} className="text-yellow-400 fill-yellow-400" /> {project.stars}
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#4b5563" }}>
                    <Eye size={11} /> {(project.views / 1000).toFixed(1)}k
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-2 flex-wrap mb-5">
                <Tag size={12} style={{ color: "#374151" }} />
                {project.tags.map((tag) => (
                  <span key={tag}
                    className="px-2.5 py-1 rounded-lg text-xs cursor-pointer transition-all hover:scale-105"
                    style={{ fontFamily: "JetBrains Mono, monospace", background: "rgba(255,255,255,0.03)", color: "#374151", border: "1px solid rgba(255,255,255,0.06)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLSpanElement).style.color = "#a78bfa"; (e.currentTarget as HTMLSpanElement).style.borderColor = "rgba(139,92,246,0.3)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLSpanElement).style.color = "#374151"; (e.currentTarget as HTMLSpanElement).style.borderColor = "rgba(255,255,255,0.06)"; }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.03]"
                  style={{ fontFamily: "Inter, sans-serif", background: "linear-gradient(135deg,#7c3aed,#3b82f6)", color: "#fff", boxShadow: "0 0 25px rgba(124,58,237,0.35)" }}>
                  <ExternalLink size={14} /> {t.liveDemo}
                </button>
                <button onClick={copyAll}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.03]"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    background: allCopied ? "rgba(16,185,129,0.12)" : "rgba(139,92,246,0.1)",
                    border: allCopied ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(139,92,246,0.28)",
                    color: allCopied ? "#10b981" : "#a78bfa",
                  }}>
                  {allCopied ? <Check size={14} /> : <Copy size={14} />}
                  {allCopied ? t.copied : t.copyCode}
                </button>
                <button className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.03]"
                  style={{ fontFamily: "Inter, sans-serif", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#72729a" }}>
                  <Download size={14} /> {t.downloadZip}
                </button>
              </div>
            </div>

            {/* Video embed section */}
            {project.video && (
              <div className="rounded-2xl overflow-hidden"
                style={{ background: "rgba(8,10,28,0.8)", border: "1px solid rgba(99,62,210,0.15)", backdropFilter: "blur(20px)" }}>
                <div className="flex items-center gap-2.5 p-5 pb-4"
                  style={{ borderBottom: "1px solid rgba(99,62,210,0.1)" }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(236,72,153,0.12)", border: "1px solid rgba(236,72,153,0.22)" }}>
                    <Play size={13} style={{ color: "#ec4899" }} />
                  </div>
                  <h2 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "16px", color: "#f0f0ff" }}>
                    {t.embedVideo}
                  </h2>
                  <span className="ml-auto px-2.5 py-1 rounded-lg text-[10px] font-semibold capitalize"
                    style={{ fontFamily: "Inter, sans-serif", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#4b5563" }}>
                    {project.video.platform}
                  </span>
                </div>

                {!videoPlaying ? (
                  /* Thumbnail / play button */
                  <div
                    className="relative flex items-center justify-center cursor-pointer group/video"
                    style={{ height: 280, background: "rgba(4,5,18,0.9)" }}
                    onClick={() => setVideoPlaying(true)}
                  >
                    <div className="absolute inset-0 pointer-events-none"
                      style={{ background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${project.gradientFrom}08, transparent 70%)` }} />

                    {/* Play button */}
                    <div
                      className="relative z-10 flex flex-col items-center gap-4 transition-all duration-300 group-hover/video:scale-105"
                    >
                      <div
                        className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300"
                        style={{
                          background: "rgba(255,255,255,0.12)",
                          border: "2px solid rgba(255,255,255,0.25)",
                          backdropFilter: "blur(10px)",
                          boxShadow: `0 0 40px ${project.gradientFrom}40`,
                        }}
                      >
                        <Play size={28} className="text-white fill-white ml-1" />
                      </div>
                      <div className="text-center">
                        <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "14px", color: "#f0f0ff" }}>
                          {t.watchVideo} {project.video.platform.charAt(0).toUpperCase() + project.video.platform.slice(1)}
                        </p>
                        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#4b5563", marginTop: 4 }}>
                          {project.video.label}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Actual embed */
                  <div className="relative" style={{ paddingBottom: "56.25%", height: 0 }}>
                    <iframe
                      src={project.video.url + "?autoplay=1"}
                      title={project.video.label}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Code viewer */}
            <div className="rounded-2xl overflow-hidden"
              style={{ background: "rgba(8,10,28,0.8)", border: "1px solid rgba(99,62,210,0.15)", backdropFilter: "blur(20px)" }}>
              {/* Tabs */}
              <div className="flex items-center gap-1 px-4 pt-4 pb-0"
                style={{ borderBottom: "1px solid rgba(99,62,210,0.1)" }}>
                {(["html", "css", "js"] as const).map((t) => (
                  <button key={t} onClick={() => setTab(t)}
                    className="px-5 py-3 text-xs font-semibold rounded-t-xl transition-all duration-200"
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      color: tab === t ? "#c4b5fd" : "#374151",
                      background: tab === t ? "rgba(139,92,246,0.12)" : "transparent",
                      borderBottom: tab === t ? "2px solid #8b5cf6" : "2px solid transparent",
                    }}>
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>
              <div className="p-4">
                <CodeView code={codeMap[tab]} lang={tab} />
              </div>
            </div>

            {/* AdSense — bottom of main */}
            <div className="rounded-2xl flex flex-col items-center justify-center py-8"
              style={{ background: "rgba(8,10,28,0.4)", border: "1px dashed rgba(99,62,210,0.1)", minHeight: 100 }}>
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#1a1a2e" }}>
                [Google AdSense — Leaderboard 728×90]
              </span>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="flex flex-col gap-5">
            {/* AdSense top */}
            <div className="rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(8,10,28,0.4)", border: "1px dashed rgba(99,62,210,0.1)", minHeight: 180 }}>
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#1a1a2e" }}>
                [AdSense 300×250]
              </span>
            </div>

            {/* Related */}
            <div className="rounded-2xl p-5"
              style={{ background: "rgba(8,10,28,0.8)", border: "1px solid rgba(99,62,210,0.15)", backdropFilter: "blur(20px)" }}>
              <p style={{ fontFamily: "Sora, sans-serif", fontWeight: 600, fontSize: "13px", color: "#f0f0ff", marginBottom: 12 }}>
                {t.relatedAnimations}
              </p>
              <div className="flex flex-col gap-2">
                {(related.length ? related : allAnimations.filter((a: AnimationProject) => a.id !== project.id).slice(0, 4)).map((p: AnimationProject) => (
                  <button key={p.id} onClick={() => onViewProject(p)}
                    className="group flex items-center gap-3 p-3 rounded-xl text-left w-full transition-all duration-200"
                    style={{ background: "rgba(4,5,18,0.6)", border: "1px solid rgba(99,62,210,0.08)" }}
                    onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(139,92,246,0.35)"}
                    onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(99,62,210,0.08)"}
                  >
                    <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-base"
                      style={{ background: `linear-gradient(135deg, ${p.gradientFrom}20, ${p.gradientTo}15)`, border: `1px solid ${p.gradientFrom}30` }}>
                      {p.categoryIcon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate" style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "12px", color: "#c4c8ff", marginBottom: 2 }}>{p.title}</p>
                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#374151" }}>{p.difficulty}</p>
                    </div>
                    <ChevronRight size={13} style={{ color: "#1f2937", flexShrink: 0 }} className="group-hover:text-violet-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            {/* Trending sidebar */}
            <div className="rounded-2xl p-5"
              style={{ background: "rgba(8,10,28,0.8)", border: "1px solid rgba(99,62,210,0.15)", backdropFilter: "blur(20px)" }}>
              <div className="flex items-center gap-2 mb-12 pb-0">
                <Flame size={13} style={{ color: "#ec4899" }} />
                <p style={{ fontFamily: "Sora, sans-serif", fontWeight: 600, fontSize: "13px", color: "#f0f0ff" }}>
                  Trending
                </p>
              </div>
              <div className="flex flex-col gap-2 -mt-8">
                {trending.map((p, i) => (
                  <button key={p.id} onClick={() => onViewProject(p)}
                    className="group flex items-center gap-3 p-3 rounded-xl text-left w-full transition-all"
                    style={{ background: "rgba(4,5,18,0.6)", border: "1px solid rgba(99,62,210,0.08)" }}
                    onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(236,72,153,0.3)"}
                    onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(99,62,210,0.08)"}
                  >
                    <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#1f2937", width: 16, flexShrink: 0 }}>{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="truncate" style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "12px", color: "#c4c8ff" }}>{p.title}</p>
                      <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#374151" }}>{(p.views / 1000).toFixed(1)}k views</p>
                    </div>
                    <ChevronRight size={13} style={{ color: "#1f2937" }} className="group-hover:text-pink-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            {/* AdSense bottom */}
            <div className="rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(8,10,28,0.4)", border: "1px dashed rgba(6,182,212,0.08)", minHeight: 140 }}>
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "#1a1a2e" }}>
                [AdSense 300×600]
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
