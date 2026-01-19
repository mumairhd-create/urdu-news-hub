import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import { articles, categories, Article } from "@/data/articles";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  showSuggestions?: boolean;
}

const SearchBar = ({ value: externalValue, onChange: externalOnChange, placeholder, showSuggestions = true }: SearchBarProps) => {
  const { t, language, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [internalQuery, setInternalQuery] = useState("");
  const [suggestions, setSuggestions] = useState<{
    articles: Article[];
    categories: typeof categories;
  }>({ articles: [], categories: [] });
  const [isOpen, setIsOpen] = useState(false);

  const isControlled = externalValue !== undefined;
  const query = isControlled ? externalValue : internalQuery;
  const onChange = isControlled ? externalOnChange : setInternalQuery;

  useEffect(() => {
    if (query.trim() && showSuggestions) {
      const filteredArticles = articles.filter(
        (article) =>
          (article.title[language] || article.title.ur).toLowerCase().includes(query.toLowerCase()) ||
          (article.excerpt[language] || article.excerpt.ur).toLowerCase().includes(query.toLowerCase()) ||
          (article.content[language] || article.content.ur).toLowerCase().includes(query.toLowerCase())
      ).slice(0, 3);

      const filteredCategories = categories.filter((category) =>
        (category.name[language] || category.name.ur).toLowerCase().includes(query.toLowerCase())
      ).slice(0, 2);

      setSuggestions({
        articles: filteredArticles,
        categories: filteredCategories,
      });
    } else {
      setSuggestions({ articles: [], categories: [] });
    }
  }, [query, language, showSuggestions]);

  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      onChange?.(searchQuery);
      setIsOpen(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const clearSearch = () => {
    onChange?.("");
    setSuggestions({ articles: [], categories: [] });
    setIsOpen(false);
  };

  const defaultPlaceholder = t("searchArticles") || "Search articles...";

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
        <Input
          type="text"
          value={query}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder || defaultPlaceholder}
          className={`pl-10 pr-10 ${isRTL ? "pr-10 pl-10" : ""}`}
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className={`absolute ${isRTL ? "left-1" : "right-1"} top-1/2 -translate-y-1/2 h-6 w-6 p-0`}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isOpen && query.trim() && showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
          {suggestions.categories.length > 0 && (
            <div className="p-3 border-b border-border">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                {t("categories") || "Categories"}
              </h4>
              <div className="flex flex-wrap gap-2">
                {suggestions.categories.map((category) => (
                  <Badge
                    key={category.id}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => {
                      navigate(`/articles?category=${category.id}`);
                      setIsOpen(false);
                    }}
                  >
                    {(category.name[language] || category.name.ur)}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {suggestions.articles.length > 0 && (
            <div className="p-3">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                {t("articles") || "Articles"}
              </h4>
              <div className="space-y-2">
                {suggestions.articles.map((article) => (
                  <div
                    key={article.id}
                    className="p-2 hover:bg-secondary rounded cursor-pointer transition-colors"
                    onClick={() => {
                      navigate(`/article/${article.id}`);
                      setIsOpen(false);
                    }}
                  >
                    <h5 className="font-medium text-sm line-clamp-1">
                      {article.title[language] || article.title.ur}
                    </h5>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {article.excerpt[language] || article.excerpt.ur}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {suggestions.articles.length === 0 && suggestions.categories.length === 0 && (
            <div className="p-4 text-center text-muted-foreground text-sm">
              {t("noResults") || "No results found"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;