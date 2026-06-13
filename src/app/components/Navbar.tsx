// Importaciones necesarias para el componente Navbar
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Code2, Globe, ChevronDown, Check } from "lucide-react";
import { useLang } from "../hooks/useLang";

// Opciones de idioma disponibles
const LANG_OPTIONS = [
  { code: "en" as const, flag: "🇺🇸", label: "English", short: "EN" },
  { code: "es" as const, flag: "🇪🇸", label: "Español", short: "ES" },
];

/**
 * Componente Navbar - navegación principal con selector de idioma
 * Usa React Router v6 para navegación en lugar de routing basado en estado
 */
export function Navbar() {
  const navigate = useNavigate();
  const { lang, setLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Cerrar dropdown de idioma al hacer clic fuera
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  // Enlaces de navegación - eliminado "Creadores" ya que solo el usuario creará animaciones
  const navLinks = [
    { label: t.explore,    path: "/" },
    { label: t.trending,   path: "/trending" },
  ];

  const currentLang = LANG_OPTIONS.find((l) => l.code === lang)!;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(5,8,22,0.92)" : "rgba(5,8,22,0.0)",
        backdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
        borderBottom: scrolled ? "1px solid rgba(99,62,210,0.15)" : "1px solid transparent",
        boxShadow: scrolled ? "0 1px 40px rgba(0,0,0,0.4)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-[68px] flex items-center gap-4">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 shrink-0 group"
        >
          <div className="relative w-9 h-9">
            <div
              className="absolute inset-0 rounded-xl transition-all duration-300 group-hover:scale-110"
              style={{
                background: "linear-gradient(135deg, #7c3aed 0%, #3b82f6 50%, #06b6d4 100%)",
                boxShadow: "0 0 20px rgba(124,58,237,0.5)",
              }}
            />
            <Code2 size={18} className="absolute inset-0 m-auto text-white" strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "17px", letterSpacing: "-0.03em" }}>
            <span className="text-white">Motion</span>
            <span style={{
              background: "linear-gradient(90deg, #a78bfa, #67e8f9)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>Code</span>
          </span>
        </button>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1 flex-1">
          {navLinks.map((link) => {
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className="relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  fontFamily: "Inter, sans-serif",
                  color: "#72729a",
                  background: "transparent",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "#e2e8f0";
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "#72729a";
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                }}
              >
                {link.label}
              </button>
            );
          })}
        </div>

        {/* Lado derecho - selector de idioma */}
        <div className="hidden md:flex items-center gap-2 ml-auto">
          {/* Selector de idioma */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                fontFamily: "Inter, sans-serif",
                background: langOpen ? "rgba(139,92,246,0.12)" : "rgba(255,255,255,0.04)",
                border: langOpen ? "1px solid rgba(139,92,246,0.35)" : "1px solid rgba(255,255,255,0.07)",
                color: langOpen ? "#c4b5fd" : "#72729a",
              }}
              onMouseEnter={(e) => {
                if (!langOpen) {
                  (e.currentTarget as HTMLButtonElement).style.color = "#c4b5fd";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(139,92,246,0.3)";
                }
              }}
              onMouseLeave={(e) => {
                if (!langOpen) {
                  (e.currentTarget as HTMLButtonElement).style.color = "#72729a";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.07)";
                }
              }}
            >
              <Globe size={13} />
              <span>{currentLang.flag} {currentLang.short}</span>
              <ChevronDown
                size={12}
                style={{ transition: "transform 0.2s", transform: langOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>

            {/* Dropdown */}
            {langOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-40 rounded-2xl overflow-hidden z-50"
                style={{
                  background: "rgba(8,10,28,0.97)",
                  border: "1px solid rgba(139,92,246,0.22)",
                  backdropFilter: "blur(30px)",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.05)",
                  animation: "dropIn 0.18s cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                <style>{`@keyframes dropIn { from{opacity:0;transform:translateY(-6px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }`}</style>
                <div className="p-1.5">
                  {LANG_OPTIONS.map((opt) => (
                    <button
                      key={opt.code}
                      onClick={() => { setLang(opt.code); setLangOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all duration-150"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        background: lang === opt.code ? "rgba(139,92,246,0.15)" : "transparent",
                        color: lang === opt.code ? "#c4b5fd" : "#72729a",
                      }}
                      onMouseEnter={(e) => {
                        if (lang !== opt.code) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
                      }}
                      onMouseLeave={(e) => {
                        if (lang !== opt.code) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                      }}
                    >
                      <span className="text-base">{opt.flag}</span>
                      <span className="flex-1 text-left font-medium">{opt.label}</span>
                      {lang === opt.code && <Check size={12} style={{ color: "#8b5cf6" }} />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* spacer */}
          <div style={{ width: 8 }} />
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden ml-auto w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#e2e8f0" }}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: mobileOpen ? "500px" : "0",
          borderTop: mobileOpen ? "1px solid rgba(99,62,210,0.12)" : "1px solid transparent",
          background: "rgba(5,8,22,0.97)",
          backdropFilter: "blur(30px)",
        }}
      >
        <div className="px-5 py-4 flex flex-col gap-1">
          {/* Enlaces de navegación móvil */}
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => { navigate(link.path); setMobileOpen(false); }}
              className="text-left px-4 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                fontFamily: "Inter, sans-serif",
                color: "#72729a",
                background: "transparent",
              }}
            >
              {link.label}
            </button>
          ))}

          {/* Mobile language switcher */}
          <div className="flex items-center gap-2 mt-1 mb-1">
            {LANG_OPTIONS.map((opt) => (
              <button
                key={opt.code}
                onClick={() => setLang(opt.code)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all flex-1 justify-center"
                style={{
                  fontFamily: "Inter, sans-serif",
                  background: lang === opt.code ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.04)",
                  border: lang === opt.code ? "1px solid rgba(139,92,246,0.3)" : "1px solid rgba(255,255,255,0.07)",
                  color: lang === opt.code ? "#c4b5fd" : "#72729a",
                }}
              >
                {opt.flag} {opt.label}
              </button>
            ))}
          </div>

          {/* Mobile actions removed */}
        </div>
      </div>
    </nav>
  );
}

function IconBtn({ children, onClick, title }: { children: React.ReactNode; onClick?: () => void; title?: string }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#72729a" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = "#c4b5fd";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(139,92,246,0.35)";
        (e.currentTarget as HTMLButtonElement).style.background = "rgba(139,92,246,0.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = "#72729a";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.07)";
        (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
      }}
    >
      {children}
    </button>
  );
}
