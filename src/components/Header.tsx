import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X, Clock } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import LanguageToggle from "./LanguageToggle";
import AccessibilityControls from "./AccessibilityControls";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const { t, language } = useLanguage();

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/articles?category=politics", label: t("politics") },
    { href: "/articles?category=sports", label: t("sports") },
    { href: "/articles?category=technology", label: t("technology") },
    { href: "/articles?category=business", label: t("business") },
    { href: "/articles?category=entertainment", label: t("entertainment") },
    { href: "/articles?category=health", label: t("health") },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname + location.search === path;
  };

  const currentDate = new Date().toLocaleDateString(language === "ur" ? "ur-PK" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header>
      {/* Top bar with date and time */}
      <div className="bg-secondary border-b border-border">
        <div className="container mx-auto flex items-center justify-between py-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" />
            <span>{currentDate}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
          <LanguageToggle />
          <AccessibilityControls />
        </div>
            <span className="live-indicator">{t("live")}</span>
          </div>
        </div>
      </div>

      {/* Logo bar */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-2xl">U</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground leading-tight">Umar Media</h1>
                  <span className="text-xs text-muted-foreground">{language === "ur" ? "اردو" : "English"}</span>
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              {isSearchOpen ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={t("search")}
                    className="border border-border px-4 py-2 text-sm w-64 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    autoFocus
                    aria-label="Search articles"
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setIsSearchOpen(false);
                      }
                    }}
                  />
                  <button 
                    onClick={() => setIsSearchOpen(false)} 
                    className="p-2 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    aria-label="Close search"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsSearchOpen(true)} 
                  className="p-2 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  aria-label="Open search"
                >
                  <Search className="h-5 w-5" />
                </button>
              )}
              <button
                className="lg:hidden p-2 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation bar */}
      <nav className="alj-nav">
        <div className="container mx-auto">
          <div className="hidden lg:flex items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`alj-nav-link ${isActive(link.href) ? "active" : ""}`}
                aria-label={`Navigate to ${link.label}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="lg:hidden bg-foreground border-t border-white/10 absolute top-full left-0 right-0 z-40">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="block px-4 py-3 text-background/80 hover:text-background hover:bg-white/10 border-b border-white/10 focus:bg-white/20 focus:outline-none"
              onClick={() => setIsMenuOpen(false)}
              aria-label={`Navigate to ${link.label}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}

      {/* Breaking News Ticker */}
      <div className="breaking-ticker">
        <div className="container mx-auto flex items-center">
          <span className="breaking-label shrink-0">{t("breaking")}</span>
          <div className="overflow-hidden whitespace-nowrap">
            <span className="inline-block animate-scroll text-sm">
              {t("breakingNews")}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;