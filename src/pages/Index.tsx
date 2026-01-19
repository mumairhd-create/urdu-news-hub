import { useState, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import { database, NewsArticle, Category } from "@/lib/database";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const Index = () => {
  const { t, isRTL, language } = useLanguage();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  // Memoize article conversion to prevent unnecessary re-computations
  const convertedArticles = useMemo(() => {
    return articles.map((newsArticle) => {
      // Standardize the article structure
      return {
        id: newsArticle.id,
        title: typeof newsArticle.title === 'string' 
          ? { ur: newsArticle.title, en: newsArticle.title, ps: newsArticle.title }
          : newsArticle.title,
        excerpt: typeof newsArticle.excerpt === 'string'
          ? { ur: newsArticle.excerpt, en: newsArticle.excerpt, ps: newsArticle.excerpt }
          : newsArticle.excerpt || { 
              ur: newsArticle.content.ur?.substring(0, 150) || '', 
              en: newsArticle.content.en?.substring(0, 150) || '', 
              ps: newsArticle.content.ps?.substring(0, 150) || '' 
            },
        content: typeof newsArticle.content === 'string'
          ? { ur: newsArticle.content, en: newsArticle.content, ps: newsArticle.content }
          : newsArticle.content,
        author: typeof newsArticle.author === 'string'
          ? { ur: newsArticle.author, en: newsArticle.author, ps: newsArticle.author }
          : newsArticle.author,
        date: newsArticle.published_at,
        readTime: { 
          ur: `${newsArticle.read_time || 5} منٹ`, 
          en: `${newsArticle.read_time || 5} min`, 
          ps: `${newsArticle.read_time || 5} دقیقه` 
        },
        category: categories.find(cat => cat.id === newsArticle.category_id)?.name[language] || 'Uncategorized',
        image: newsArticle.image || 'https://via.placeholder.com/400x300',
        featured: newsArticle.featured
      };
    });
  }, [articles, categories, language]);

  // Memoize filtered articles
  const featuredArticles = useMemo(() => 
    convertedArticles.filter(article => article.featured).slice(0, 4), 
    [convertedArticles]
  );

  const politicsArticles = useMemo(() => 
    convertedArticles.filter(article => article.category === 'سیاست' || article.category === 'Politics').slice(0, 2), 
    [convertedArticles]
  );

  const sportsArticles = useMemo(() => 
    convertedArticles.filter(article => article.category === 'کھیل' || article.category === 'Sports').slice(0, 2), 
    [convertedArticles]
  );

  const techArticles = useMemo(() => 
    convertedArticles.filter(article => article.category === 'ٹیکنالوجی' || article.category === 'Technology').slice(0, 3), 
    [convertedArticles]
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [articlesData, categoriesData] = await Promise.all([
          database.getNewsArticles({ limit: 20 }),
          database.getCategories()
        ]);
        
        setArticles(articlesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t("loading") || "Loading..."}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
          >
            {t("retry") || "Retry"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 main-content-with-header">
        <section className="container mx-auto py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {featuredArticles[0] && <ArticleCard article={featuredArticles[0]} variant="featured" />}
            </div>
            <div className="space-y-4">
              <h2 className="alj-section-title">{t("importantNews")}</h2>
              {featuredArticles.slice(1, 4).map((article) => (
                <ArticleCard key={article.id} article={article} variant="small" />
              ))}
            </div>
          </div>
        </section>
        <section className="bg-secondary py-6">
          <div className="container mx-auto">
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <Link 
                  key={cat.id} 
                  to={`/articles?category=${cat.id}`} 
                  className="shrink-0 px-4 py-2 bg-card hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium border border-border"
                  aria-label={`View ${cat.name[language] || cat.name.en} articles`}
                >
                  {cat.name[language] || cat.name.en}
                </Link>
              ))}
            </div>
          </div>
        </section>
        <section className="container mx-auto py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="alj-section-title">{t("latestNews")}</h2>
                  <Link 
                    to="/articles" 
                    className="text-primary text-sm flex items-center gap-1 hover:underline"
                    aria-label="View all latest news articles"
                  >
                    {t("seeMore")}
                    <ChevronIcon className="h-4 w-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {convertedArticles.slice(0, 4).map((article) => (
                    <ArticleCard key={article.id} article={article} variant="medium" />
                  ))}
                </div>
              </div>
              <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="alj-section-title">{t("politics")}</h2>
                  <Link 
                    to="/articles?category=politics" 
                    className="text-primary text-sm flex items-center gap-1 hover:underline"
                    aria-label="View all politics articles"
                  >
                    {t("seeMore")}
                    <ChevronIcon className="h-4 w-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {politicsArticles.slice(0, 2).map((article) => (
                    <ArticleCard key={article.id} article={article} variant="medium" />
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="alj-section-title">{t("sports")}</h2>
                  <Link 
                    to="/articles?category=sports" 
                    className="text-primary text-sm flex items-center gap-1 hover:underline"
                    aria-label="View all sports articles"
                  >
                    {t("seeMore")}
                    <ChevronIcon className="h-4 w-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sportsArticles.slice(0, 2).map((article) => (
                    <ArticleCard key={article.id} article={article} variant="medium" />
                  ))}
                </div>
              </div>
            </div>
            <aside className="lg:col-span-4">
              <div className="mb-8">
                <h2 className="alj-section-title">{t("videoNews")}</h2>
                <div className="space-y-4">
                  <div className="text-muted-foreground text-center py-8">
                    <p>Video content coming soon...</p>
                  </div>
                </div>
                <Link 
                  to="/videos" 
                  className="text-primary text-sm flex items-center gap-1 hover:underline mt-4"
                  aria-label="View all videos"
                >
                  {t("seeMore")}
                  <ChevronIcon className="h-4 w-4" />
                </Link>
              </div>
              <div className="mb-8">
                <h2 className="alj-section-title">{t("videos")}</h2>
                <div className="relative aspect-video bg-foreground mb-4">
                  <img 
                    src="https://via.placeholder.com/400x300" 
                    alt="Video thumbnail" 
                    className="w-full h-full object-cover opacity-80" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-primary flex items-center justify-center">
                      <Play className="h-8 w-8 text-primary-foreground fill-primary-foreground" />
                    </div>
                  </div>
                </div>
                <h3 className="text-sm font-bold text-foreground leading-relaxed">
                  {t("latestVideoReports")}
                </h3>
              </div>
              <div className="mb-8">
                <h2 className="alj-section-title">{t("mostRead")}</h2>
                <div className="space-y-0">
                  {convertedArticles.slice(0, 5).map((article, index) => (
                    <Link 
                      key={article.id} 
                      to={`/article/${article.id}`} 
                      className="group flex gap-3 py-3 border-b border-border hover:bg-accent/50 transition-colors"
                      aria-label={`Read article: ${article.title[language]}`}
                    >
                      <span className="text-3xl font-bold text-primary/30 group-hover:text-primary transition-colors">
                        {index + 1}
                      </span>
                      <h3 className="text-sm font-bold text-foreground leading-relaxed group-hover:text-primary transition-colors flex-1">
                        {article.title[language]}
                      </h3>
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="alj-section-title">{t("technology")}</h2>
                {techArticles.slice(0, 3).map((article) => (
                  <ArticleCard key={article.id} article={article} variant="list" />
                ))}
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;