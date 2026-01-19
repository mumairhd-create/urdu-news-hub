import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryCard from "@/components/CategoryCard";
import { categories } from "@/data/articles";
import { useLanguage } from "@/hooks/useLanguage";

const Categories = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8 lg:py-12">
        <div className="container mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {t("allCategories")}
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t("selectCategory")}
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Categories;