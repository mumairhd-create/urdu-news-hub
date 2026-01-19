import { useState, useEffect, ReactNode } from "react";
import { translations } from "@/constants/translations";
import { LanguageContext, Language } from "./languageContext";

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved === "en" || saved === "ur" || saved === "ps") ? saved : "ur";
  });

  const isRTL = language === "ur" || language === "ps";

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [language, isRTL]);

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};