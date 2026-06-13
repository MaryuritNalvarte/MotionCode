import { useState } from "react";
import { Send, CheckCircle, Sparkles, Zap, Code2, Star } from "lucide-react";

const PERKS = [
  { icon: Zap,    text: "Weekly animation drops" },
  { icon: Code2,  text: "Exclusive code packs" },
  { icon: Star,   text: "Early access to new features" },
];

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setState("loading");
    setTimeout(() => { setState("done"); setEmail(""); }, 1200);
    setTimeout(() => setState("idle"), 5000);
  };

  return (
    <section className="py-20 px-5 sm:px-8 relative">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(124,58,237,0.07), transparent 70%)" }} />

      <div className="max-w-3xl mx-auto">
        {/* Glassmorphism card */}
        <div
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: "rgba(8,10,28,0.75)",
            border: "1px solid rgba(139,92,246,0.22)",
            backdropFilter: "blur(40px)",
            boxShadow: "0 0 80px rgba(124,58,237,0.1), 0 40px 80px rgba(0,0,0,0.4)",
          }}
        >
          {/* Top glow stripe */}
          <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, #8b5cf6, #06b6d4, #ec4899, transparent)" }} />

          {/* Animated bg blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)", animation: "blob1 8s ease-in-out infinite" }} />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(6,182,212,0.08), transparent 70%)", animation: "blob2 10s ease-in-out infinite" }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(236,72,153,0.06), transparent 70%)", animation: "blob1 12s ease-in-out infinite reverse" }} />
          </div>

          <style>{`
            @keyframes blob1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,-20px) scale(1.1)} }
            @keyframes blob2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-20px,30px) scale(0.9)} }
          `}</style>

          {/* Decorative particles */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="absolute w-1 h-1 rounded-full"
                style={{
                  left: `${6 + (i * 6)}%`, top: `${8 + (i * 11) % 80}%`,
                  background: ["#8b5cf6", "#06b6d4", "#ec4899"][i % 3],
                  opacity: 0.35,
                  animation: `blob1 ${3 + (i % 4)}s ease-in-out ${i * 0.4}s infinite`,
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative px-8 py-12 sm:px-14 sm:py-14 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)" }}>
              <Sparkles size={13} style={{ color: "#a78bfa" }} />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#a78bfa", fontWeight: 600 }}>
                Join 12,000+ developers
              </span>
            </div>

            <h2
              style={{
                fontFamily: "Sora, sans-serif", fontWeight: 900,
                fontSize: "clamp(1.6rem,4vw,2.5rem)",
                color: "#f0f0ff", letterSpacing: "-0.03em", marginBottom: 10,
              }}
            >
              Get the hottest animations
              <br />
              <span style={{
                backgroundImage: "linear-gradient(135deg, #a78bfa, #67e8f9, #f472b6)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                delivered weekly
              </span>
            </h2>

            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "15px", color: "#4b5563", marginBottom: 28, lineHeight: 1.7 }}>
              Exclusive animation packs, tutorials and early access — straight to your inbox, every Thursday.
            </p>

            {/* Perks */}
            <div className="flex items-center justify-center gap-6 flex-wrap mb-8">
              {PERKS.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)" }}>
                    <Icon size={11} style={{ color: "#a78bfa" }} />
                  </div>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#72729a" }}>{text}</span>
                </div>
              ))}
            </div>

            {/* Form */}
            {state === "done" ? (
              <div
                className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl mx-auto max-w-md"
                style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)" }}
              >
                <CheckCircle size={20} style={{ color: "#10b981" }} />
                <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, color: "#10b981", fontSize: "15px" }}>
                  You're in! Check your inbox 🎉
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <div className="flex-1 relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder="your@email.com"
                    required
                    className="w-full px-5 py-4 rounded-2xl text-sm outline-none transition-all duration-200"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      background: "rgba(4,5,18,0.8)",
                      border: focused ? "1px solid rgba(139,92,246,0.55)" : "1px solid rgba(99,62,210,0.2)",
                      color: "#f0f0ff",
                      boxShadow: focused ? "0 0 0 3px rgba(139,92,246,0.12)" : "none",
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={state === "loading"}
                  className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-sm font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] disabled:opacity-80 whitespace-nowrap"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
                    color: "#fff",
                    boxShadow: "0 0 25px rgba(124,58,237,0.4), 0 4px 15px rgba(0,0,0,0.3)",
                  }}
                >
                  {state === "loading" ? (
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <><Send size={14} /> Subscribe Free</>
                  )}
                </button>
              </form>
            )}

            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#2d2d45", marginTop: 14 }}>
              No spam · Unsubscribe anytime · Free forever
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
