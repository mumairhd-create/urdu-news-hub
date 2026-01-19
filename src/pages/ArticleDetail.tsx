import { useParams, Link } from "react-router-dom";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, Clock, User, Calendar, Facebook, Twitter, Share2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import ReadingProgress from "@/components/ReadingProgress";
import LazyImage from "@/components/LazyImage";
import { getArticleById, getArticlesByCategory, getCategoryById, articles } from "@/data/articles";
import { useLanguage } from "@/hooks/useLanguage";

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const article = getArticleById(id || "");
  const { t, isRTL, language } = useLanguage();
  const contentRef = useRef<HTMLElement>(null);

  const getCategoryName = (categoryId: string) => {
    return t(categoryId) || categoryId;
  };

  // Get content based on current language with fallback to Urdu
  const title = article?.title[language] || article?.title.ur;
  const content = article?.content[language] || article?.content.ur;
  const author = article?.author[language] || article?.author.ur;
  const readTime = article?.readTime[language] || article?.readTime.ur;

  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground mb-4">{t("articleNotFound")}</h1>
            <Link to="/articles" className="bg-primary text-primary-foreground px-6 py-2 text-sm">{t("backToArticles")}</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const category = getCategoryById(article.category);
  const relatedArticles = getArticlesByCategory(article.category).filter((a) => a.id !== article.id).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ReadingProgress target={contentRef} />
      <Header />
      <main className="flex-1 main-content-with-header">
        <div className="bg-secondary border-b border-border">
          <div className="container mx-auto py-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Link to="/" className="hover:text-primary">{t("home")}</Link>
              <ChevronIcon className="h-3 w-3" />
              {category && (
                <>
                  <Link to={`/articles?category=${category.id}`} className="hover:text-primary">{getCategoryName(category.id)}</Link>
                  <ChevronIcon className="h-3 w-3" />
                </>
              )}
              <span className="text-foreground line-clamp-1">{title}</span>
            </div>
          </div>
        </div>

        <article ref={contentRef} className="py-8">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8">
                {category && (
                  <span className="inline-block bg-primary text-primary-foreground px-2 py-0.5 text-xs font-bold mb-4">
                    {getCategoryName(category.id)}
                  </span>
                )}
                
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-6 leading-relaxed">
                  {title}
                </h1>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm mb-6 pb-6 border-b border-border">
                  <span className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    {author}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {new Date(article.date).toLocaleDateString(language === "ur" ? "ur-PK" : "en-US")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {readTime}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-sm text-muted-foreground">{t("share")}:</span>
                  <button className="w-8 h-8 bg-[#1877f2] text-white flex items-center justify-center hover:opacity-80"><Facebook className="h-4 w-4" /></button>
                  <button className="w-8 h-8 bg-[#1da1f2] text-white flex items-center justify-center hover:opacity-80"><Twitter className="h-4 w-4" /></button>
                  <button className="w-8 h-8 bg-secondary text-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground"><Share2 className="h-4 w-4" /></button>
                </div>
                <div className="aspect-video mb-6">
                  <LazyImage
                    src={article.image}
                    alt={title || ""}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="prose max-w-none">
                  {content?.split("\n\n").map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-foreground/90 leading-loose mb-6 text-lg"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-border">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-muted-foreground">{t("tags")}:</span>
                    <span className="px-3 py-1 bg-secondary text-sm hover:bg-primary hover:text-primary-foreground cursor-pointer">{category ? getCategoryName(category.id) : ""}</span>
                    <span className="px-3 py-1 bg-secondary text-sm hover:bg-primary hover:text-primary-foreground cursor-pointer">{t("pakistan")}</span>
                    <span className="px-3 py-1 bg-secondary text-sm hover:bg-primary hover:text-primary-foreground cursor-pointer">{t("news")}</span>
                  </div>
                </div>
              </div>
              <aside className="lg:col-span-4">
                <div className="sticky top-32">
                  <h2 className="alj-section-title mb-4">{t("readMore")}</h2>
                  {articles.slice(0, 5).map((a) => <ArticleCard key={a.id} article={a} variant="list" />)}
                </div>
              </aside>
            </div>
          </div>
        </article>

        {relatedArticles.length > 0 && (
          <section className="bg-secondary py-8">
            <div className="container mx-auto">
              <h2 className="alj-section-title mb-6">{t("relatedArticles")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedArticles.map((ra) => <ArticleCard key={ra.id} article={ra} variant="medium" />)}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ArticleDetail;
