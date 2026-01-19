import { Link } from "react-router-dom";
import { Building2, Trophy, Cpu, Film, TrendingUp, Heart, LucideIcon } from "lucide-react";
import { Category } from "@/data/articles";
import { useLanguage } from "@/hooks/useLanguage";

const iconMap: Record<string, LucideIcon> = {
  Building2,
  Trophy,
  Cpu,
  Film,
  TrendingUp,
  Heart,
};

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  const Icon = iconMap[category.icon] || Building2;
  const { language, t } = useLanguage();

  // Get category name and description based on language
  const categoryName = category.name[language] || category.name.ur;
  const categoryDescription = category.description[language] || category.description.ur;

  return (
    <Link
      to={`/articles?category=${category.id}`}
      className="group block"
    >
      <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
          <Icon className="h-7 w-7 text-primary" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
          {categoryName}
        </h3>
        <p className="text-muted-foreground text-sm mb-3">
          {categoryDescription}
        </p>
        <span className="text-primary text-sm font-medium">
          {category.articleCount} {t("articles")}
        </span>
      </div>
    </Link>
  );
};

export default CategoryCard;