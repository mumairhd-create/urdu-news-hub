import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Globe, ChevronDown } from "lucide-react";

interface Language {
  code: "ur" | "en" | "ps";
  name: string;
  flag: string;
}

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const languages: Language[] = [
    { code: "ur", name: "اردو", flag: "🇵🇰" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ps", name: "پښتو", flag: "🇦🇫" }
  ];

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === language) || languages[0];
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-secondary hover:bg-secondary/80 border border-border transition-colors"
        aria-label="Select language"
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="flex items-center gap-1">
          {getCurrentLanguage().flag}
          <ChevronDown className="h-3 w-3 transition-transform duration-200" />
        </span>
      </button>

      {isOpen && (
        <div ref={dropdownRef} className="absolute top-full right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 min-w-[120px] overflow-hidden">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left hover:bg-secondary transition-colors flex items-center gap-2 ${
                  language === lang.code ? 'bg-primary text-primary-foreground' : 'text-foreground'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageToggle;