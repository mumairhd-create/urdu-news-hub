import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { Article, getCategoryById } from "@/data/articles";
import { useLanguage } from "@/hooks/useLanguage";
import LazyImage from "@/components/LazyImage";

interface ArticleCardProps {
  article: Article;
  variant?: "featured" | "large" | "medium" | "small" | "list";
}

const ArticleCard = ({ article, variant = "medium" }: ArticleCardProps) => {
  const { language } = useLanguage();
  const category = getCategoryById(article.category);

  // Get content based on current language with fallback to Urdu
  const title = article.title[language] || article.title.ur;
  const excerpt = article.excerpt[language] || article.excerpt.ur;
  const author = article.author[language] || article.author.ur;
  const readTime = article.readTime[language] || article.readTime.ur;
  const categoryName = category?.name[language] || category?.name.ur || "";

  // Featured - Full width hero
  if (variant === "featured") {
    return (
      <Link to={`/article/${article.id}`} className="group block alj-featured-card h-[450px] lg:h-[500px]">
        <LazyImage
          src={article.image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 lg:p-10">
          {category && (
            <span className="text-primary-foreground bg-primary px-2 py-0.5 text-xs font-bold w-fit mb-3">
              {categoryName}
            </span>
          )}
          <h2 className="text-2xl lg:text-4xl font-bold text-white mb-3 leading-relaxed group-hover:text-primary transition-colors">
            {title}
          </h2>
          <p className="text-white/80 text-sm lg:text-base mb-4 line-clamp-2 max-w-2xl">
            {excerpt}
          </p>
          <div className="flex items-center gap-4 text-white/60 text-xs">
            <span>{author}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {readTime}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // Large - Sidebar featured
  if (variant === "large") {
    return (
      <Link to={`/article/${article.id}`} className="group block">
        <div className="relative aspect-video overflow-hidden mb-3">
          <LazyImage
            src={article.image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        {category && (
          <span className="alj-category">{categoryName}</span>
        )}
        <h3 className="text-lg font-bold text-foreground leading-relaxed group-hover:text-primary transition-colors mb-2">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
          {excerpt}
        </p>
        <div className="alj-timestamp">
          <Clock className="h-3 w-3" />
          <span>{readTime}</span>
        </div>
      </Link>
    );
  }

  // Small - Compact with small image
  if (variant === "small") {
    return (
      <Link to={`/article/${article.id}`} className="group flex gap-3 alj-card">
        <div className="w-24 h-20 shrink-0 overflow-hidden">
          <LazyImage
            src={article.image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-foreground leading-relaxed group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
          <div className="alj-timestamp mt-2">
            <Clock className="h-3 w-3" />
            <span>{readTime}</span>
          </div>
        </div>
      </Link>
    );
  }

  // List - Text only
  if (variant === "list") {
    return (
      <Link to={`/article/${article.id}`} className="group block py-3 border-b border-border last:border-0">
        <h3 className="text-sm font-bold text-foreground leading-relaxed group-hover:text-primary transition-colors">
          {title}
        </h3>
        <div className="alj-timestamp mt-1">
          <Clock className="h-3 w-3" />
          <span>{readTime}</span>
        </div>
      </Link>
    );
  }

  // Medium - Default card
  return (
    <Link to={`/article/${article.id}`} className="group block alj-card">
      <div className="relative aspect-video overflow-hidden mb-3">
        <LazyImage
          src={article.image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      {category && (
        <span className="alj-category">{categoryName}</span>
      )}
      <h3 className="text-base font-bold text-foreground leading-relaxed group-hover:text-primary transition-colors mb-2">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
        {excerpt}
      </p>
      <div className="alj-timestamp">
        <Clock className="h-3 w-3" />
        <span>{readTime}</span>
      </div>
    </Link>
  );
};

export default ArticleCard;