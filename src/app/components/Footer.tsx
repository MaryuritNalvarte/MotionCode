// Importaciones necesarias para el componente Footer
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Code2, Github, Twitter, Youtube, Heart, Rss, Globe, Zap } from "lucide-react";

// Enlaces del footer - traducidos al español
const LINKS = {
  Plataforma: ["Explorar", "Tendencias", "Categorías", "Nuevos Lanzamientos", "Enviar Animación"],
  Recursos: ["Documentación", "Tutoriales", "Blog", "Registro de Cambios", "Referencia API"],
  Comunidad: ["Discord", "GitHub", "YouTube", "Twitter/X", "Boletín"],
  Empresa:   ["Acerca de", "Carreras", "Kit de Prensa", "Contacto", "Política de Privacidad"],
};

// Redes sociales
const SOCIALS = [
  { Icon: Github,  href: "#", label: "GitHub" },
  { Icon: Twitter, href: "#", label: "Twitter" },
  { Icon: Youtube, href: "#", label: "YouTube" },
  { Icon: Globe,   href: "#", label: "Sitio Web" },
  { Icon: Rss,     href: "#", label: "RSS" },
];

// Badges de tecnologías - mantienen sus nombres originales
const TECH_BADGES = ["HTML5", "CSS3", "JavaScript", "Canvas API", "WebGL", "GSAP", "Three.js", "SVG"];

/**
 * Componente Footer - pie de página principal con enlaces y redes sociales
 * Usa navegación React Router v6
 */
export function Footer() {
  const navigate = useNavigate();
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);

  return (
    <footer
      className="relative pt-16 pb-8 px-5 sm:px-8"
      style={{ borderTop: "1px solid rgba(99,62,210,0.1)" }}
    >
      {/* Top glow */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent)" }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(139,92,246,0.04), transparent 60%)" }} />

      <div className="max-w-7xl mx-auto">
        {/* Tech badges strip */}
        <div className="flex items-center gap-2 flex-wrap mb-12 pb-10"
          style={{ borderBottom: "1px solid rgba(99,62,210,0.08)" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#374151", letterSpacing: "0.08em", textTransform: "uppercase", marginRight: 4 }}>
            Construido con
          </span>
          {TECH_BADGES.map((badge) => (
            <span key={badge}
              className="px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all hover:scale-105 cursor-default"
              style={{ fontFamily: "JetBrains Mono, monospace", background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.15)", color: "#6b5de3" }}>
              {badge}
            </span>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand col — spans 2 on large */}
          <div className="col-span-2">
            {/* Logo - desactivado */}
            <div className="flex items-center gap-2.5 mb-5 group">
              <div className="relative w-9 h-9">
                <div className="absolute inset-0 rounded-xl transition-all duration-300 group-hover:scale-110"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6, #06b6d4)", boxShadow: "0 0 15px rgba(124,58,237,0.4)" }} />
                <Code2 size={18} className="absolute inset-0 m-auto text-white" strokeWidth={2.5} />
              </div>
              <span style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "17px", letterSpacing: "-0.03em" }}>
                <span className="text-white">Motion</span>
                <span style={{ background: "linear-gradient(90deg, #a78bfa, #67e8f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Code</span>
              </span>
            </div>

            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#374151", lineHeight: 1.8, marginBottom: 18, maxWidth: 220 }}>
              La biblioteca de animaciones copiar y pegar líder para desarrolladores frontend modernos. Gratis para siempre.
            </p>

            {/* Status badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl mb-5"
              style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#10b981", fontWeight: 500 }}>
                Todos los sistemas operativos
              </span>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-2 flex-wrap">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a key={label} href={href}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                  style={{
                    background: hoveredSocial === label ? "rgba(139,92,246,0.12)" : "rgba(255,255,255,0.03)",
                    border: hoveredSocial === label ? "1px solid rgba(139,92,246,0.35)" : "1px solid rgba(255,255,255,0.06)",
                    color: hoveredSocial === label ? "#c4b5fd" : "#374151",
                  }}
                  onMouseEnter={() => setHoveredSocial(label)}
                  onMouseLeave={() => setHoveredSocial(null)}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns - desactivados */}
          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <h4 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "13px", color: "#c4c8ff", marginBottom: 14, letterSpacing: "-0.01em", opacity: 0.5 }}>
                {group}
              </h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link}>
                    <span
                      className="block text-xs"
                      style={{ fontFamily: "Inter, sans-serif", color: "#374151", cursor: "not-allowed", opacity: 0.5 }}
                    >
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: "1px solid rgba(99,62,210,0.07)" }}>
          <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#1f1f35" }}>
            © 2026 MotionCode · MIT Licensed
          </p>
          <p className="flex items-center gap-1.5" style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#1f1f35" }}>
            Hecho con <Heart size={10} className="text-pink-500 fill-pink-500 mx-0.5" /> para la comunidad de desarrolladores
          </p>
          <div className="flex items-center gap-4">
            {/* Enlaces desactivados - solo TikTok y YouTube funcionarán */}
            {["Términos", "Privacidad", "Cookies", "Mapa del sitio"].map((item) => (
              <span key={item}
                className="text-[11px]"
                style={{ fontFamily: "Inter, sans-serif", color: "#1f1f35", cursor: "not-allowed", opacity: 0.5 }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
