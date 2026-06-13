import { useEffect, useRef, useState } from "react";
import { Code2, Users, Eye, Zap, Globe, Star } from "lucide-react";

const STATS = [
  { icon: Code2,  value: 500,  suffix: "+",  label: "Total Animations", sub: "Pure copy-paste ready", color: "#8b5cf6", glow: "rgba(139,92,246,0.3)" },
  { icon: Users,  value: 50,   suffix: "K+", label: "Developers",        sub: "Using our code daily",   color: "#06b6d4", glow: "rgba(6,182,212,0.3)" },
  { icon: Eye,    value: 2.4,  suffix: "M",  label: "Monthly Views",      sub: "Across all projects",   color: "#ec4899", glow: "rgba(236,72,153,0.3)" },
  { icon: Globe,  value: 180,  suffix: "+",  label: "Countries",          sub: "Worldwide reach",       color: "#10b981", glow: "rgba(16,185,129,0.3)" },
  { icon: Star,   value: 99,   suffix: "%",  label: "Satisfaction",       sub: "5-star rated projects", color: "#f59e0b", glow: "rgba(245,158,11,0.3)" },
  { icon: Zap,    value: 100,  suffix: "%",  label: "Free Forever",       sub: "No paywalls, ever",     color: "#3b82f6", glow: "rgba(59,130,246,0.3)" },
];

function useCounter(target: number, decimals = 0) {
  const [val, setVal] = useState(0);
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true); }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    const dur = 1800;
    const fps = 60;
    const steps = (dur / 1000) * fps;
    let step = 0;
    const id = setInterval(() => {
      step++;
      const t = step / steps;
      // ease-out cubic
      const ease = 1 - Math.pow(1 - t, 3);
      setVal(Number((target * ease).toFixed(decimals)));
      if (step >= steps) { setVal(target); clearInterval(id); }
    }, 1000 / fps);
    return () => clearInterval(id);
  }, [active, target, decimals]);

  return { val, ref };
}

function StatCard({ stat }: { stat: typeof STATS[0] }) {
  const [hov, setHov] = useState(false);
  const decimals = stat.value < 10 ? 1 : 0;
  const { val, ref } = useCounter(stat.value, decimals);
  const Icon = stat.icon;

  return (
    <div
      ref={ref}
      className="relative p-6 rounded-2xl overflow-hidden cursor-default transition-all duration-400"
      style={{
        background: hov ? `linear-gradient(135deg, ${stat.color}10, rgba(8,10,28,0.9))` : "rgba(8,10,28,0.7)",
        border: hov ? `1px solid ${stat.color}45` : "1px solid rgba(99,62,210,0.12)",
        transform: hov ? "translateY(-4px) scale(1.02)" : "translateY(0) scale(1)",
        boxShadow: hov ? `0 20px 50px rgba(0,0,0,0.4), 0 0 30px ${stat.glow}` : "none",
        backdropFilter: "blur(20px)",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* BG glow */}
      <div className="absolute inset-0 pointer-events-none transition-opacity duration-400"
        style={{ background: `radial-gradient(ellipse 70% 70% at 50% 0%, ${stat.color}15, transparent 70%)`, opacity: hov ? 1 : 0 }} />

      <div className="relative">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-all duration-300"
          style={{
            background: `${stat.color}15`,
            border: `1px solid ${stat.color}30`,
            boxShadow: hov ? `0 0 20px ${stat.color}40` : "none",
          }}
        >
          <Icon size={19} style={{ color: stat.color }} />
        </div>

        <div
          style={{
            fontFamily: "Sora, sans-serif",
            fontWeight: 900,
            fontSize: "2.4rem",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            background: `linear-gradient(135deg, ${stat.color}, ${stat.color}88)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: 6,
          }}
        >
          {decimals ? val.toFixed(decimals) : Math.round(val)}{stat.suffix}
        </div>

        <p style={{ fontFamily: "Sora, sans-serif", fontWeight: 600, fontSize: "14px", color: "#c4c8ff", marginBottom: 3 }}>{stat.label}</p>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#374151" }}>{stat.sub}</p>
      </div>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="py-20 px-5 sm:px-8 relative">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(139,92,246,0.05), transparent 70%)" }} />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "clamp(1.7rem,3.5vw,2.6rem)", color: "#f0f0ff", letterSpacing: "-0.03em", marginBottom: 12 }}>
            Trusted by{" "}
            <span style={{ background: "linear-gradient(135deg, #a78bfa, #f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Developers Worldwide
            </span>
          </h2>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "15px", color: "#4b5563", maxWidth: 440, margin: "0 auto" }}>
            Numbers that prove MotionCode is the go-to animation library.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {STATS.map((s) => <StatCard key={s.label} stat={s} />)}
        </div>
      </div>
    </section>
  );
}
