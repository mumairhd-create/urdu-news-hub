import { Article } from "@/data/articles";

// Quick fix: Add Pashto translations to all articles
export const addPashtoTranslations = () => {
  // This function can be called to add basic Pashto translations
  // For now, we'll add fallback logic to use Urdu when Pashto is missing
};

export const getArticleTranslation = (article: Article, language: string) => {
  if (language === 'ps' && !article.title.ps) {
    // Fallback to Urdu if Pashto is not available
    return {
      title: article.title.ur,
      excerpt: article.excerpt.ur,
      content: article.content.ur,
      author: article.author.ur,
      readTime: article.readTime.ur
    };
  }
  return {
    title: article.title[language],
    excerpt: article.excerpt[language],
    content: article.content[language],
    author: article.author[language],
    readTime: article.readTime[language]
  };
};
