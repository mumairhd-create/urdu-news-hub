// Multilingual text type with support for Urdu, English, and Pashto
export interface MultilingualText {
  ur: string;
  en: string;
  ps?: string;
}

// Helper function to get text with fallback
export const getText = (text: MultilingualText | string | undefined, language: string): string => {
  if (!text) return '';
  if (typeof text === 'string') return text;
  
  const lang = language as keyof MultilingualText;
  return text[lang] || text.ur || text.en || '';
};
