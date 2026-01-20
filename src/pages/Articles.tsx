import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import SearchBar from "@/components/SearchBar";
import TrendingTopics from "@/components/TrendingTopics";
import { database, NewsArticle, Category } from "@/lib/database";
import { useInfiniteData } from "@/hooks/useInfiniteScroll";
import { useLanguage } from "@/hooks/useLanguage";
import { Article } from "@/data/articles";

const Articles = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t, language } = useLanguage();
  
  const selectedCategory = searchParams.get("category") || "all";
  const currentCategory = categories.find(cat => cat.name === selectedCategory);

  // Convert NewsArticle to Article format
  const convertToArticle = (newsArticle: NewsArticle): Article => ({
    id: newsArticle.id,
    title: typeof newsArticle.title === 'string' 
      ? { ur: newsArticle.title, en: newsArticle.title, ps: newsArticle.title }
      : newsArticle.title,
    excerpt: typeof newsArticle.excerpt === 'string'
      ? { ur: newsArticle.excerpt, en: newsArticle.excerpt, ps: newsArticle.excerpt }
      : newsArticle.excerpt || { ur: (typeof newsArticle.content === 'string' ? newsArticle.content : newsArticle.content?.ur || '').substring(0, 150), en: (typeof newsArticle.content === 'string' ? newsArticle.content : newsArticle.content?.en || '').substring(0, 150) },
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
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const convertedArticles = articles.map(convertToArticle);

  const filteredArticles = useMemo(() => {
    return convertedArticles.filter((article) => {
      const articleTitle = article.title[language] || article.title.ur;
      const articleExcerpt = article.excerpt[language] || article.excerpt.ur;
      const matchesSearch =
        articleTitle.includes(searchQuery) ||
        articleExcerpt.includes(searchQuery);
      const matchesCategory =
        selectedCategory === "all" || article.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, language, convertedArticles]);

  // Simulate fetching articles with pagination
  const fetchArticles = async (page: number) => {
    const pageSize = 6;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageResults = filteredArticles.slice(startIndex, endIndex);

    return {
      items: pageResults,
      hasNextPage: endIndex < filteredArticles.length
    };
  };

  const {
    data,
    error,
    resetData
  } = useInfiniteData(convertedArticles, fetchArticles);

  useEffect(() => {
    resetData();
  }, [filteredArticles, resetData]);

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", categoryId);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 main-content-with-header">
        <div className="bg-foreground text-background py-8">
          <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">{currentCategory ? currentCategory.name : (selectedCategory === "all" ? t("allArticles") : selectedCategory)}</h1>
              <p className="text-muted-foreground text-sm mb-6">{currentCategory ? currentCategory.description : t("latestNewsAndArticles")}</p>
              
              {/* Error State */}
              {error && (
                <div className="text-center py-12 mb-6">
                  <p className="text-red-500 mb-4">{error}</p>
                  <button onClick={() => resetData()} className="bg-primary text-primary-foreground px-6 py-2 text-sm font-medium hover:bg-primary/90">
                    {t("tryAgain") || "Try Again"}
                  </button>
                </div>
              )}

              {/* Articles Grid */}
              {data.items.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {data.items.map((article) => <ArticleCard key={article.id} article={article} />)}
                </div>
              )}

              {/* No Results */}
              {!isLoading && data.items.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-lg text-muted-foreground mb-4">{t("noArticlesFound")}</p>
                  <button onClick={() => { setSearchQuery(""); handleCategoryChange("all"); }} className="bg-primary text-primary-foreground px-6 py-2 text-sm font-medium hover:bg-primary/90">{t("clearFilters")}</button>
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

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="space-y-6">
                {/* Search */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3">{t("search") || "Search"}</h3>
                  <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    showSuggestions={false}
                  />
                </div>

                {/* Trending Topics */}
                <TrendingTopics />
              </div>
            </aside>
          </div>
        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Articles;
