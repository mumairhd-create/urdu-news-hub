import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="container mx-auto py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">U</span>
              </div>
              <div>
                <h2 className="text-lg font-bold">Umar Media</h2>
              </div>
            </div>
            <p className="text-background/60 text-sm leading-relaxed">
              {t("footerAbout")}
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-8 h-8 bg-white/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold mb-4 text-background/90">{t("categories")}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/articles?category=politics" className="text-background/60 hover:text-primary transition-colors">{t("politics")}</Link></li>
              <li><Link to="/articles?category=sports" className="text-background/60 hover:text-primary transition-colors">{t("sports")}</Link></li>
              <li><Link to="/articles?category=technology" className="text-background/60 hover:text-primary transition-colors">{t("technology")}</Link></li>
              <li><Link to="/articles?category=business" className="text-background/60 hover:text-primary transition-colors">{t("business")}</Link></li>
              <li><Link to="/articles?category=entertainment" className="text-background/60 hover:text-primary transition-colors">{t("entertainment")}</Link></li>
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h3 className="text-sm font-bold mb-4 text-background/90">{t("more")}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-background/60 hover:text-primary transition-colors">{t("aboutUs")}</Link></li>
              <li><Link to="/" className="text-background/60 hover:text-primary transition-colors">{t("contactUs")}</Link></li>
              <li><Link to="/" className="text-background/60 hover:text-primary transition-colors">{t("privacyPolicy")}</Link></li>
              <li><Link to="/" className="text-background/60 hover:text-primary transition-colors">{t("termsOfUse")}</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-bold mb-4 text-background/90">{t("newsletter")}</h3>
            <p className="text-background/60 text-sm mb-4">{t("newsletterText")}</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder={t("yourEmail")}
                className="flex-1 bg-white/10 border-0 px-3 py-2 text-sm text-background placeholder:text-background/40 focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button className="bg-primary hover:bg-primary/90 px-4 py-2 text-sm font-medium transition-colors">
                <Mail className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto py-4">
          <p className="text-center text-background/50 text-xs">
            {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
