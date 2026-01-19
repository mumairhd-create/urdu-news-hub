import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

const Hero = () => {
  const { t, isRTL } = useLanguage();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className="hero-gradient py-16 lg:py-24">
      <div className="container mx-auto text-center">
        <h1 className="text-3xl lg:text-5xl font-bold text-foreground mb-6 animate-slide-up leading-relaxed">
          {t("heroTitle")}{" "}
          <span className="gradient-text">{t("heroHighlight")}</span>
        </h1>
        <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-slide-up leading-relaxed">
          {t("heroSubtitle")}
        </p>
        <div className="flex flex-wrap justify-center gap-4 animate-slide-up">
          <Link to="/articles">
            <Button size="lg" className="gap-2 text-base">
              {t("viewAllArticles")}
              <ArrowIcon className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/categories">
            <Button size="lg" variant="outline" className="text-base">
              {t("viewCategories")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;