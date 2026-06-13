import { useState } from "react";
import { Users, Star, Eye, Trophy, ArrowRight, Verified } from "lucide-react";
import { creators } from "./data";
import { allAnimations } from "../utils/data-bridge";
import type { AnimationProject } from "../utils/types";

export function CreatorsSection() {
  return (
    <section className="py-20 px-5 sm:px-8 relative">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 40% at 20% 60%, rgba(236,72,153,0.05), transparent 60%)" }} />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(236,72,153,0.12)", border: "1px solid rgba(236,72,153,0.22)" }}>
                <Trophy size={12} style={{ color: "#ec4899" }} />
              </div>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#ec4899", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Featured Creators
              </span>
            </div>
            <h2 style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "clamp(1.7rem,3.5vw,2.6rem)", color: "#f0f0ff", letterSpacing: "-0.03em" }}>
              Meet the{" "}
              <span style={{ background: "linear-gradient(135deg, #f472b6, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Motion Artists
              </span>
            </h2>
          </div>
          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-105"
            style={{ fontFamily: "Inter, sans-serif", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#72729a" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#f0f0ff"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(139,92,246,0.3)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#72729a"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)"; }}
          >
            View All Creators <ArrowRight size={14} />
          </button>
        </div>

        {/* Creator cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {creators.map((c) => <CreatorCard key={c.id} creator={c} />)}
        </div>

        {/* Featured spotlight */}
        <FeaturedSpotlight />
      </div>
    </section>
  );
}

function CreatorCard({ creator }: { creator: typeof creators[0] }) {
  const [hovered, setHovered] = useState(false);
  const [A, B] = creator.gradient;
  const topAnim = allAnimations.find((a: AnimationProject) => a.creator === creator.name);

  return (
    <div
      className="relative p-5 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
      style={{
        background: hovered ? `linear-gradient(135deg, ${A}12, ${B}08)` : "rgba(8,10,28,0.75)",
        border: hovered ? `1px solid ${A}45` : "1px solid rgba(99,62,210,0.12)",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        boxShadow: hovered ? `0 20px 50px rgba(0,0,0,0.4), 0 0 25px ${A}18` : "none",
        backdropFilter: "blur(20px)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* BG glow */}
      <div className="absolute inset-0 pointer-events-none transition-opacity duration-400"
        style={{ background: `radial-gradient(ellipse 80% 60% at 30% 0%, ${A}20, transparent 70%)`, opacity: hovered ? 1 : 0 }} />

      <div className="relative">
        {/* Avatar */}
        <div className="relative mb-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black transition-all duration-300"
            style={{
              fontFamily: "Sora, sans-serif",
              background: `linear-gradient(135deg, ${A}, ${B})`,
              color: "#fff",
              boxShadow: hovered ? `0 0 25px ${A}55` : `0 0 12px ${A}30`,
              transform: hovered ? "scale(1.08)" : "scale(1)",
            }}
          >
            {creator.avatar}
          </div>
          <div
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: "#050816", border: `2px solid ${A}` }}
          >
            <Verified size={10} style={{ color: A }} />
          </div>
        </div>

        <div className="mb-3">
          <p style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "15px", color: "#f0f0ff" }}>{creator.name}</p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#4b5563" }}>{creator.handle}</p>
        </div>

        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#72729a", lineHeight: 1.6, marginBottom: 12 }}>
          {creator.bio}
        </p>

        {/* Specialty tag */}
        <div className="mb-4">
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold"
            style={{ fontFamily: "Inter, sans-serif", background: `${A}15`, color: A, border: `1px solid ${A}30` }}>
            {creator.specialty}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4">
          <div>
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700, fontSize: "14px", color: A }}>{creator.projects}</p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#374151", textTransform: "uppercase", letterSpacing: "0.06em" }}>projects</p>
          </div>
          <div className="w-px h-8" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div>
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700, fontSize: "14px", color: A }}>
              {(creator.followers / 1000).toFixed(1)}K
            </p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#374151", textTransform: "uppercase", letterSpacing: "0.06em" }}>followers</p>
          </div>
        </div>

        <button
          className="w-full py-2.5 rounded-xl text-xs font-semibold transition-all duration-200"
          style={{
            fontFamily: "Inter, sans-serif",
            background: hovered ? `linear-gradient(135deg, ${A}30, ${B}20)` : "rgba(255,255,255,0.04)",
            border: hovered ? `1px solid ${A}50` : "1px solid rgba(255,255,255,0.07)",
            color: hovered ? A : "#4b5563",
          }}
        >
          <Users size={10} className="inline mr-1.5" />
          Follow
        </button>
      </div>
    </div>
  );
}

function FeaturedSpotlight() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative rounded-3xl p-8 overflow-hidden transition-all duration-300"
      style={{
        background: "rgba(8,10,28,0.8)",
        border: hovered ? "1px solid rgba(139,92,246,0.4)" : "1px solid rgba(99,62,210,0.15)",
        backdropFilter: "blur(30px)",
        boxShadow: hovered ? "0 0 60px rgba(139,92,246,0.12)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* BG */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 80% at 0% 50%, rgba(139,92,246,0.1), transparent 60%)" }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 40% 60% at 100% 50%, rgba(236,72,153,0.06), transparent 60%)" }} />

      <div className="relative flex flex-col md:flex-row items-center gap-8">
        {/* Live preview panel */}
        <div
          className="w-full md:w-64 h-48 rounded-2xl shrink-0 overflow-hidden flex items-center justify-center relative"
          style={{ background: "rgba(4,5,18,0.9)", border: "1px solid rgba(139,92,246,0.2)" }}
        >
          <style>{`
            @keyframes sp-orbit { to { transform: rotate(360deg); } }
            @keyframes sp-pulse {
              0%,100%{box-shadow:0 0 12px #ec4899,0 0 25px #ec489955}
              50%{box-shadow:0 0 25px #ec4899,0 0 50px #ec489966}
            }
          `}</style>
          <span className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold z-10"
            style={{ background: "rgba(4,5,18,0.9)", border: "1px solid rgba(139,92,246,0.3)", color: "#a78bfa", backdropFilter: "blur(8px)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE
          </span>
          <div className="relative w-32 h-32 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full" style={{ background: "#ec4899", animation: "sp-pulse 2.5s ease-in-out infinite" }} />
            {[60, 92, 126].map((size, i) => (
              <div key={i} className="absolute rounded-full border"
                style={{
                  width: size, height: size,
                  borderColor: ["#8b5cf6", "#3b82f6", "#ec4899"][i] + "55",
                  animation: `sp-orbit ${[3, 5, 7][i]}s linear infinite ${i % 2 ? "reverse" : ""}`,
                }}>
                <div className="absolute w-2.5 h-2.5 rounded-full"
                  style={{ top: -5, left: "50%", transform: "translateX(-50%)", background: ["#8b5cf6", "#3b82f6", "#ec4899"][i], boxShadow: `0 0 10px ${["#8b5cf6", "#3b82f6", "#ec4899"][i]}` }} />
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm"
              style={{ background: "linear-gradient(135deg, #ec4899, #a855f7)", color: "#fff", fontFamily: "Sora, sans-serif" }}>
              S
            </div>
            <div>
              <p style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "14px", color: "#f0f0ff" }}>stardustfx</p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#4b5563" }}>Particle Systems Specialist</p>
            </div>
            <span className="ml-auto px-3 py-1 rounded-full text-[10px] font-bold"
              style={{ background: "rgba(236,72,153,0.12)", color: "#f472b6", border: "1px solid rgba(236,72,153,0.25)", fontFamily: "Inter, sans-serif" }}>
              🏆 Top Creator
            </span>
          </div>

          <h3 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "1.35rem", color: "#f0f0ff", marginBottom: 8, letterSpacing: "-0.02em" }}>
            Particle Galaxy Field
          </h3>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#4b5563", lineHeight: 1.7, marginBottom: 16 }}>
            An immersive 500-particle canvas system with physics simulation, mouse gravity, and real-time RGB color cycling. Built to run at 60fps on any device.
          </p>

          <div className="flex items-center flex-wrap gap-5">
            <div className="flex items-center gap-1.5" style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "12px", color: "#72729a" }}>
              <Star size={12} className="text-yellow-400 fill-yellow-400" /> 723 stars
            </div>
            <div className="flex items-center gap-1.5" style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "12px", color: "#72729a" }}>
              <Eye size={12} className="text-cyan-400" /> 91.3k views
            </div>
            <div className="flex items-center gap-1.5" style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "12px", color: "#72729a" }}>
              <Users size={12} className="text-violet-400" /> 5.1K followers
            </div>

            <button
              className="ml-auto flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)", color: "#fff", fontFamily: "Inter, sans-serif", boxShadow: "0 0 20px rgba(124,58,237,0.3)" }}>
              View Project <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
