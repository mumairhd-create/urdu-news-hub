import { createContext } from "react";

type Language = "ur" | "en" | "ps";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
export type { Language, LanguageContextType };
