import { useState, useEffect } from "react";
import { ArrowRight, Play, TrendingUp } from "lucide-react";
import { ParticleField } from "./ParticleField";
import { useLang } from "./LangContext";

const SNIPPETS = [
  { code: "@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }", top: "14%", left: "3%", delay: 0 },
  { code: "canvas.getContext('2d').fillStyle = '#8b5cf6';", top: "22%", right: "2%", delay: 0.8 },
  { code: "transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);", top: "72%", left: "2%", delay: 1.6 },
  { code: "const particle = new Particle({ gravity: 0.02 });", top: "78%", right: "3%", delay: 0.4 },
  { code: "filter: blur(0) drop-shadow(0 0 12px #7c3aed);", top: "44%", left: "1%", delay: 1.2 },
  { code: "requestAnimationFrame(animate);", top: "48%", right: "1%", delay: 2 },
];

const BADGE_ITEMS = [
  { icon: "✨", text: "CSS Only" },
  { icon: "⚡", text: "Canvas API" },
  { icon: "🌌", text: "Particles" },
  { icon: "🎲", text: "Three.js" },
];

export function HeroSection({ onNavigate }: { onNavigate: (p: string) => void }) {
  const { t, lang } = useLang();
  const WORDS = t.heroWords as readonly string[];
  const [mounted, setMounted] = useState(false);
  const [wordIdx, setWordIdx] = useState(0);
  const [wordVisible, setWordVisible] = useState(true);

  useEffect(() => {
    setTimeout(() => setMounted(true), 80);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordVisible(false);
      setTimeout(() => {
        setWordIdx((i) => (i + 1) % WORDS.length);
        setWordVisible(true);
      }, 350);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Layered background */}
      <div className="absolute inset-0">
        {/* Main radial gradients */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 90% 70% at 50% -5%, rgba(124,58,237,0.28) 0%, transparent 65%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 55% at 85% 60%, rgba(6,182,212,0.12) 0%, transparent 60%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 50% at 15% 75%, rgba(236,72,153,0.1) 0%, transparent 60%)" }} />
        {/* Noise texture effect via repeated gradient */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(139,92,246,0.08) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Interactive particles */}
      <ParticleField />

      {/* Floating code snippets */}
      <style>{`
        @keyframes snippetFloat {
          0%,100% { transform: translateY(0px) rotate(-1.5deg); opacity:0.45; }
          50% { transform: translateY(-14px) rotate(0.5deg); opacity:0.7; }
        }
        @keyframes wordIn {
          from { opacity:0; transform: translateY(12px) scale(0.96); }
          to   { opacity:1; transform: translateY(0) scale(1); }
        }
        @keyframes wordOut {
          from { opacity:1; transform: translateY(0) scale(1); }
          to   { opacity:0; transform: translateY(-12px) scale(0.96); }
        }
        @keyframes heroFadeIn {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes badgeSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes orb {
          0%,100% { transform: scale(1) translate(0,0); }
          33%     { transform: scale(1.05) translate(20px,-15px); }
          66%     { transform: scale(0.96) translate(-15px,10px); }
        }
        @keyframes glowPulse {
          0%,100% { box-shadow: 0 0 25px rgba(124,58,237,0.45), 0 0 50px rgba(124,58,237,0.15), 0 8px 30px rgba(0,0,0,0.4); }
          50%     { box-shadow: 0 0 45px rgba(124,58,237,0.7), 0 0 80px rgba(124,58,237,0.25), 0 8px 30px rgba(0,0,0,0.4); }
        }
        @keyframes gradientFlow {
          0%,100% { background-position: 0% 50%; }
          50%     { background-position: 100% 50%; }
        }
      `}</style>

      {SNIPPETS.map((s, i) => (
        <div
          key={i}
          className="absolute hidden xl:block"
          style={{
            top: s.top,
            left: s.left,
            right: s.right,
            animation: `snippetFloat ${5 + (i % 3)}s ease-in-out ${s.delay}s infinite`,
            opacity: mounted ? undefined : 0,
            transition: "opacity 1.2s ease",
          }}
        >
          <div
            className="px-3 py-2 rounded-xl text-xs whitespace-nowrap max-w-xs truncate"
            style={{
              fontFamily: "JetBrains Mono, monospace",
              background: "rgba(8,10,28,0.85)",
              border: "1px solid rgba(139,92,246,0.28)",
              color: "#a78bfa",
              backdropFilter: "blur(12px)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px rgba(139,92,246,0.05) inset",
            }}
          >
            <span style={{ color: "#ec4899" }}>{"// "}</span>
            <span style={{ color: "#67e8f9" }}>{s.code.split(":")[0]}</span>
            {s.code.includes(":") && <span style={{ color: "#e2e8f0" }}>{s.code.slice(s.code.indexOf(":"))}</span>}
          </div>
        </div>
      ))}

      {/* Main content */}
      <div
        className="relative z-10 text-center px-5 max-w-5xl mx-auto pt-28 pb-16"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(32px)",
          transition: "opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* Live badge */}
        <div
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full mb-8"
          style={{
            background: "rgba(139,92,246,0.08)",
            border: "1px solid rgba(139,92,246,0.25)",
            backdropFilter: "blur(12px)",
          }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#a78bfa", fontWeight: 500 }}>
            {t.updatedWeekly}
          </span>
          <span
            className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
            style={{ background: "rgba(236,72,153,0.15)", color: "#f472b6", border: "1px solid rgba(236,72,153,0.25)" }}
          >
            <TrendingUp size={10} />
            NEW
          </span>
        </div>

        {/* Headline */}
        <h1
          className="mb-4"
          style={{
            fontFamily: "Sora, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(2.6rem, 8vw, 6rem)",
            lineHeight: 1.0,
            letterSpacing: "-0.04em",
          }}
        >
          <span
            className="block"
            style={{
              background: "linear-gradient(180deg, #ffffff 0%, rgba(240,240,255,0.7) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {t.heroLine1}
          </span>
          <span
            className="block"
            style={{
              backgroundImage: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 25%, #3b82f6 50%, #06b6d4 75%, #ec4899 100%)",
              backgroundSize: "300% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "gradientFlow 5s ease infinite",
              minHeight: "1.1em",
            }}
          >
            <span
              style={{
                display: "inline-block",
                animation: wordVisible ? "wordIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards" : "wordOut 0.3s ease forwards",
              }}
            >
              {WORDS[wordIdx]}
            </span>
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="mb-10 mx-auto max-w-2xl"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "clamp(1rem, 2.2vw, 1.2rem)",
            color: "#7272a0",
            lineHeight: 1.75,
            fontWeight: 400,
          }}
        >
          {t.heroSubtitle}{" "}
          <span style={{ color: "#a78bfa", fontWeight: 500 }}>HTML</span>,{" "}
          <span style={{ color: "#67e8f9", fontWeight: 500 }}>CSS</span>{" "}
          {lang === "es" ? "y" : "and"}{" "}
          <span style={{ color: "#f472b6", fontWeight: 500 }}>JavaScript</span>{" "}
          {t.heroSubtitleEnd}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <button
            onClick={() => onNavigate("explore")}
            className="group relative w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "15px",
              background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
              color: "#fff",
              animation: "glowPulse 3s ease-in-out infinite",
            }}
          >
            <span>{t.exploreAnimations}</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
          </button>

          <button
            onClick={() => onNavigate("trending")}
            className="group w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "15px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#c4c8ff",
              backdropFilter: "blur(12px)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(139,92,246,0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)";
            }}
          >
            <Play size={15} className="text-violet-400 fill-violet-400 group-hover:scale-110 transition-transform" />
            <span>{t.viewTrending}</span>
          </button>
        </div>

        {/* Category badges */}
        <div className="flex items-center justify-center gap-3 flex-wrap mb-12">
          {BADGE_ITEMS.map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all duration-200 hover:scale-105"
              style={{
                fontFamily: "Inter, sans-serif",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                color: "#72729a",
                backdropFilter: "blur(8px)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLSpanElement).style.background = "rgba(139,92,246,0.1)";
                (e.currentTarget as HTMLSpanElement).style.borderColor = "rgba(139,92,246,0.3)";
                (e.currentTarget as HTMLSpanElement).style.color = "#c4b5fd";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLSpanElement).style.background = "rgba(255,255,255,0.03)";
                (e.currentTarget as HTMLSpanElement).style.borderColor = "rgba(255,255,255,0.07)";
                (e.currentTarget as HTMLSpanElement).style.color = "#72729a";
              }}
            >
              {item.icon} {item.text}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ opacity: mounted ? 0.5 : 0, transition: "opacity 1.5s ease 1s" }}
      >
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#4b5563", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Scroll
        </span>
        <div className="w-px h-8 rounded-full overflow-hidden" style={{ background: "rgba(139,92,246,0.2)" }}>
          <div
            className="w-full rounded-full"
            style={{ height: "50%", background: "linear-gradient(to bottom, #8b5cf6, transparent)", animation: "scanline 1.5s ease-in-out infinite" }}
          />
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #050816)" }}
      />
    </section>
  );
}
