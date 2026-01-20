import { useState, useEffect } from 'react';
import { Search, Filter, X, Clock, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { database, NewsArticle, Category } from '@/lib/database';
import { ArticleCardSkeleton } from '@/components/ui/skeleton';
import ArticleCard from '@/components/ArticleCard';
import { useLanguage } from '@/hooks/useLanguage';

interface SearchFilters {
  query: string;
  category_id?: string;
  tags: string[];
  dateRange?: 'today' | 'week' | 'month' | 'year';
  sortBy?: 'relevance' | 'date' | 'popularity';
}

const EnhancedSearch = () => {
  const { t, language, isRTL } = useLanguage();
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    tags: [],
    sortBy: 'relevance'
  });
  const [results, setResults] = useState<NewsArticle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Common search suggestions
  const commonSuggestions = [
    'حکومت', 'سیاست', 'کرکٹ', 'پاکستان', 'ٹیکنالوجی', 'معیشت',
    'government', 'politics', 'cricket', 'pakistan', 'technology', 'economy'
  ];

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (filters.query.length > 2) {
      generateSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [filters.query]);

  const loadCategories = async () => {
    try {
      const categoriesData = await database.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const generateSuggestions = () => {
    const query = filters.query.toLowerCase();
    const filtered = commonSuggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(query)
    ).slice(0, 5);
    setSuggestions(filtered);
  };

  const handleSearch = async (searchQuery?: string) => {
    const query = searchQuery || filters.query;
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const searchFilters = {
        category_id: filters.category_id,
        tags: filters.tags.length > 0 ? filters.tags : undefined
      };

      const searchResults = await database.searchNews(query, searchFilters);
      
      // Apply additional sorting if needed
      if (filters.sortBy === 'popularity') {
        searchResults.sort((a, b) => (b.views || 0) - (a.views || 0));
      } else if (filters.sortBy === 'date') {
        searchResults.sort((a, b) => 
          new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
        );
      }

      setResults(searchResults);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string | boolean | string[]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleTagToggle = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      tags: [],
      sortBy: 'relevance'
    });
    setResults([]);
    setSearched(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setFilters(prev => ({ ...prev, query: suggestion }));
    handleSearch(suggestion);
    setSuggestions([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6">
        {/* Search Header */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              {t("search") || "Search"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder={t("searchPlaceholder") || "Search for news, articles, topics..."}
                  value={filters.query}
                  onChange={(e) => handleFilterChange('query', e.target.value)}
                  className={`pr-10 ${isRTL ? 'pl-10' : ''}`}
                />
                <Button
                  type="submit"
                  size="sm"
                  className={`absolute ${isRTL ? 'left-2' : 'right-2'} top-1/2 transform -translate-y-1/2`}
                  disabled={loading || !filters.query.trim()}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-card border border-border rounded-md shadow-lg max-h-40 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-3 py-2 hover:bg-accent text-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              {/* Filter Toggle */}
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  {showFilters ? (t("hideFilters") || "Hide Filters") : (t("showFilters") || "Show Filters")}
                  {(filters.category_id || filters.tags.length > 0) && (
                    <Badge variant="secondary" className="ml-1">
                      {Object.values(filters).filter(Boolean).length - 1}
                    </Badge>
                  )}
                </Button>

                <div className="flex items-center gap-2">
                  <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">{t("relevance") || "Relevance"}</SelectItem>
                      <SelectItem value="date">{t("date") || "Date"}</SelectItem>
                      <SelectItem value="popularity">{t("popularity") || "Popularity"}</SelectItem>
                    </SelectContent>
                  </Select>

                  {(filters.category_id || filters.tags.length > 0) && (
                    <Button type="button" variant="ghost" size="sm" onClick={clearFilters}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t("category") || "Category"}
                    </label>
                    <Select value={filters.category_id || ''} onValueChange={(value) => handleFilterChange('category_id', value || '')}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectCategory") || "Select category"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">{t("allCategories") || "All Categories"}</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name[language] || category.name.en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t("tags") || "Tags"}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['سیاست', 'کھیل', 'ٹیکنالوجی', 'کاروبار', 'صحت', 'Politics', 'Sports', 'Technology', 'Business', 'Health'].map((tag) => (
                        <div key={tag} className="flex items-center space-x-2">
                          <Checkbox
                            id={`tag-${tag}`}
                            checked={filters.tags.includes(tag)}
                            onCheckedChange={() => handleTagToggle(tag)}
                          />
                          <label htmlFor={`tag-${tag}`} className="text-sm cursor-pointer">
                            {tag}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searched && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {t("searchResults") || "Search Results"} ({results.length})
              </h2>
              {results.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {t("lastUpdated") || "Last updated"}: {new Date().toLocaleTimeString()}
                </div>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }, (_, i) => (
                  <ArticleCardSkeleton key={i} />
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-6">
                {/* Trending Topics */}
                {filters.query && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <h3 className="font-semibold">{t("relatedTopics") || "Related Topics"}</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {results.slice(0, 5).map((article) => (
                          article.tags?.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                              {tag}
                            </Badge>
                          ))
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Results Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((article) => {
                    // Convert NewsArticle to Article format for ArticleCard
                    const convertedArticle = {
                      id: article.id,
                      title: article.title,
                      excerpt: article.excerpt || { ur: '', en: '', ps: '' },
                      content: article.content,
                      author: { ur: article.author, en: article.author, ps: article.author },
                      date: article.published_at,
                      readTime: { 
                        ur: `${article.read_time || 5} منٹ`, 
                        en: `${article.read_time || 5} min`, 
                        ps: `${article.read_time || 5} دقیقه` 
                      },
                      category: categories.find(cat => cat.id === article.category_id)?.name[language] || 'Uncategorized',
                      image: article.image || 'https://via.placeholder.com/400x300',
                      featured: article.featured
                    };
                    return <ArticleCard key={article.id} article={convertedArticle} />;
                  })}
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {t("noResults") || "No results found"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {t("noResultsMessage") || "Try adjusting your search terms or filters"}
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    {t("clearFilters") || "Clear Filters"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedSearch;
