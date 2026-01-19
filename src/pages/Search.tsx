import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon, Filter } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { database, NewsArticle, Category } from "@/lib/database";
import { Article } from "@/data/articles";
import { useLanguage } from "@/hooks/useLanguage";
import { useInfiniteData } from "@/hooks/useInfiniteScroll";

const Search = () => {
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const categoryFilter = searchParams.get("category") || "";
  const sortBy = searchParams.get("sort") || "relevance";

  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState({
    query,
    category: categoryFilter,
    sort: sortBy
  });

  // Convert NewsArticle to Article format
  const convertToArticle = (newsArticle: NewsArticle): Article => ({
    id: newsArticle.id,
    title: typeof newsArticle.title === 'string' 
      ? { ur: newsArticle.title, en: newsArticle.title, ps: newsArticle.title }
      : newsArticle.title,
    excerpt: typeof newsArticle.excerpt === 'string'
      ? { ur: newsArticle.excerpt, en: newsArticle.excerpt, ps: newsArticle.excerpt }
      : newsArticle.excerpt || { ur: newsArticle.content.toString().substring(0, 150), en: newsArticle.content.toString().substring(0, 150) },
    content: typeof newsArticle.content === 'string'
      ? { ur: newsArticle.content, en: newsArticle.content, ps: newsArticle.content }
      : newsArticle.content,
    author: typeof newsArticle.author === 'string'
      ? { ur: newsArticle.author, en: newsArticle.author, ps: newsArticle.author }
      : newsArticle.author,
    date: newsArticle.date || newsArticle.published_at,
    readTime: typeof newsArticle.readTime === 'string'
      ? { ur: newsArticle.readTime, en: newsArticle.readTime, ps: newsArticle.readTime }
      : newsArticle.readTime || { ur: '5 منٹ', en: '5 min', ps: '5 دقيقه' },
    category: newsArticle.category,
    image: newsArticle.image || 'https://via.placeholder.com/400x300',
    featured: newsArticle.featured
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [articlesData, categoriesData] = await Promise.all([
          database.getNewsArticles(),
          database.getCategories()
        ]);
        setArticles(articlesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      if (!query) {
        setFilteredArticles([]);
        return;
      }

      try {
        let searchResults: NewsArticle[] = [];
        
        if (query) {
          searchResults = await database.searchNews(query, {
            category: categoryFilter || undefined
          });
        } else {
          searchResults = await database.getNewsArticles({
            category: categoryFilter || undefined
          });
        }

        const convertedResults = searchResults.map(convertToArticle);
        
        // Apply sorting
        let sortedResults = convertedResults;
        if (sortBy === "date") {
          sortedResults = convertedResults.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        } else if (sortBy === "title") {
          sortedResults = convertedResults.sort((a, b) => a.title[language].localeCompare(b.title[language]));
        }

        setFilteredArticles(sortedResults);
      } catch (error) {
        console.error('Search error:', error);
        setFilteredArticles([]);
      }
    };

    performSearch();
  }, [query, categoryFilter, sortBy, language, articles]);

  // Simulate fetching search results
  const fetchSearchResults = async (page: number) => {
    const results = [...filteredArticles];

    const pageSize = 6;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageResults = results.slice(startIndex, endIndex);

    return {
      items: pageResults,
      hasNextPage: endIndex < results.length
    };
  };

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    resetData
  } = useInfiniteData(filteredArticles, fetchSearchResults);

  useEffect(() => {
    setActiveFilters({
      query,
      category: categoryFilter,
      sort: sortBy
    });
    resetData();
  }, [query, categoryFilter, sortBy, resetData]);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...activeFilters, [key]: value };
    setActiveFilters(newFilters);
    
    // Update URL
    const params = new URLSearchParams();
    if (newFilters.query) params.set("q", newFilters.query);
    if (newFilters.category) params.set("category", newFilters.category);
    if (newFilters.sort !== "relevance") params.set("sort", newFilters.sort);
    
    window.history.pushState({}, "", `/search?${params.toString()}`);
    resetData();
  };

  const clearFilters = () => {
    handleFilterChange("query", "");
    handleFilterChange("category", "");
    handleFilterChange("sort", "relevance");
  };

  const selectedCategory = categories.find(cat => cat.name === activeFilters.category);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto">
          {/* Search Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
              <div className="flex-1 max-w-2xl">
                <SearchBar
                  value={activeFilters.query}
                  onChange={(value) => handleFilterChange("query", value)}
                  showSuggestions={false}
                />
              </div>
              
              <div className="flex items-center gap-3">
                <Select
                  value={activeFilters.sort}
                  onValueChange={(value) => handleFilterChange("sort", value)}
                >
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">
                      {t("relevance") || "Relevance"}
                    </SelectItem>
                    <SelectItem value="newest">
                      {t("newest") || "Newest"}
                    </SelectItem>
                    <SelectItem value="oldest">
                      {t("oldest") || "Oldest"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {activeFilters.query && (
                <Badge variant="secondary" className="gap-1">
                  <SearchIcon className="h-3 w-3" />
                  {activeFilters.query}
                </Badge>
              )}
              {selectedCategory && (
                <Badge variant="secondary">
                  {selectedCategory.name}
                </Badge>
              )}
              {(activeFilters.query || activeFilters.category) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-6 px-2 text-xs"
                >
                  {t("clearFilters") || "Clear filters"}
                </Button>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {t("searchResults") || "Search Results"}
            </h1>
            <p className="text-muted-foreground">
              {activeFilters.query ? (
                <>
                  {t("showingResultsFor") || "Showing results for"} "<strong>{activeFilters.query}</strong>"
                  {data.items.length > 0 && (
                    <> ({data.items.length} {t("articles") || "articles"})</>
                  )}
                </>
              ) : (
                t("allArticles") || "All Articles"
              )}
            </p>
          </div>

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={() => resetData()}>
                {t("tryAgain") || "Try Again"}
              </Button>
            </div>
          )}

          {/* Results Grid */}
          {data.items.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {data.items.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}

          {/* No Results */}
          {!isLoading && data.items.length === 0 && (
            <div className="text-center py-12">
              <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {t("noResultsFound") || "No results found"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t("tryDifferentKeywords") || "Try different keywords or remove filters"}
              </p>
              <Button onClick={clearFilters}>
                {t("clearAllFilters") || "Clear All Filters"}
              </Button>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="text-center py-8">
              <div className="inline-flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-muted-foreground">
                  {t("loading") || "Loading"}...
                </span>
              </div>
            </div>
          )}

          {/* Load More Trigger */}
          <div ref={data.hasNextPage ? undefined : null} className="h-4" />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Search;
