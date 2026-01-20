// Article Management Component - Extracted from Admin
// Fixed syntax issues
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useLanguage } from "@/hooks/useLanguage"
import { database, NewsArticle, Category } from "@/lib/cleanDatabase"
import { validateInput } from "@/lib/validation"
import { Plus, Edit, Trash2, Eye } from "lucide-react"

interface ArticleManagementProps {
  categories: Category[];
  onArticleUpdate: () => void;
}

export const ArticleManagement: React.FC<ArticleManagementProps> = ({ categories, onArticleUpdate }) => {
  const { language } = useLanguage();
  const [articlesList, setArticlesList] = useState<NewsArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: { ur: "", en: "", ps: "" },
    content: { ur: "", en: "", ps: "" },
    category_id: "",
    author: "",
    published_at: ""
  });

  useEffect(() => {
    loadArticles();
  }, [categories]);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const articles = await database.getNewsArticles();
      setArticlesList(articles);
      setErrors([]);
    } catch (error) {
      setErrors(['Failed to load articles']);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: { ur: "", en: "", ps: "" },
      content: { ur: "", en: "", ps: "" },
      category_id: "",
      author: "",
      published_at: ""
    });
    setErrors([]);
  };

  const validateFormData = () => {
    const validation = validateInput.article(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return false;
    }
    return true;
  };

  const handleEditArticle = (article: NewsArticle) => {
    setSelectedArticle(article);
    setFormData({
      title: {
        ur: typeof article.title === 'string' ? article.title : (article.title?.ur || ''),
        en: typeof article.title === 'string' ? article.title : (article.title?.en || ''),
        ps: typeof article.title === 'string' ? '' : (article.title?.ps || '')
      },
      content: {
        ur: typeof article.content === 'string' ? article.content : (article.content?.ur || ''),
        en: typeof article.content === 'string' ? article.content : (article.content?.en || ''),
        ps: typeof article.content === 'string' ? '' : (article.content?.ps || '')
      },
      category_id: article.category_id,
      author: article.author,
      published_at: article.published_at
    });
    setIsEditDialogOpen(true);
    setErrors([]);
  };

  const handleAddArticle = async () => {
    if (!validateFormData()) return;

    setLoading(true);
    try {
      await database.createNewsArticle(formData);
      await loadArticles();
      resetForm();
      setIsAddDialogOpen(false);
      onArticleUpdate();
    } catch (error) {
      setErrors(['Failed to add article']);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateArticle = async () => {
    if (!selectedArticle || !validateFormData()) return;

    setLoading(true);
    try {
      await database.updateNewsArticle(selectedArticle.id, formData);
      await loadArticles();
      setIsEditDialogOpen(false);
      resetForm();
      onArticleUpdate();
    } catch (error) {
      setErrors(['Failed to update article']);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    try {
      await database.deleteNewsArticle(id);
      await loadArticles();
      onArticleUpdate();
    } catch (error) {
      setErrors(['Failed to delete article']);
    }
  };

  const getArticleTitle = (article: NewsArticle): string => {
    if (typeof article.title === 'string') return article.title;
    return article.title?.[language as keyof typeof article.title] || article.title?.en || '';
  };

  const getArticleContent = (article: NewsArticle): string => {
    if (typeof article.content === 'string') return article.content;
    return article.content?.[language as keyof typeof article.content] || article.content?.en || '';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">
          {language === "ur" ? "مضامین کا انتظام" : "Article Management"}
        </h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {language === "ur" ? "نیا مضمون" : "New Article"}
        </Button>
      </div>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {language === "ur" ? "نیا مضمون شامل کریں" : "Add New Article"}
              </DialogTitle>
              <DialogDescription>
                {language === "ur" ? "نیا مضمون شامل کرنے کے لیے تفصیلات درج کریں" : "Fill in the details to add a new article"}
              </DialogDescription>
            </DialogHeader>
            
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                {errors.map((error, index) => (
                  <p key={index} className="text-red-600 text-sm">{error}</p>
                ))}
              </div>
            )}

            <ArticleForm
              formData={formData}
              setFormData={setFormData}
              categories={categories}
              language={language}
            />
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                {language === "ur" ? "منسوخ کریں" : "Cancel"}
              </Button>
              <Button onClick={handleAddArticle} disabled={loading}>
                {loading ? (language === "ur" ? "شامل ہو رہا ہے..." : "Adding...") : (language === "ur" ? "شامل کریں" : "Add")}
              </Button>
            </div>
        </DialogContent>
      </Dialog>

      {loading && articlesList.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">{language === "ur" ? "لوڈ ہو رہا ہے..." : "Loading..."}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {articlesList.map((article) => (
            <Card key={article.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {getArticleTitle(article)}
                    </CardTitle>
                    <CardDescription>
                      {getArticleContent(article).substring(0, 150)}...
                    </CardDescription>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-sm text-muted-foreground">
                        {categories.find(c => c.id === article.category_id)?.name[language as keyof typeof categories[0]['name']] || categories.find(c => c.id === article.category_id)?.name.en}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/article/${article.id}`, '_blank')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditArticle(article)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {language === "ur" ? "مضمون حذف کریں؟" : "Delete Article?"}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {language === "ur" 
                              ? "کیا آپ واقعی اس مضمون کو حذف کرنا چاہتے ہیں؟ یہ عمل واپس نہیں کیا جا سکتا۔"
                              : "Are you sure you want to delete this article? This action cannot be undone."
                            }
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            {language === "ur" ? "منسوخ کریں" : "Cancel"}
                          </AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteArticle(article.id)}>
                            {language === "ur" ? "حذف کریں" : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {language === "ur" ? "مضمون ترمیم کریں" : "Edit Article"}
            </DialogTitle>
            <DialogDescription>
              {language === "ur" ? "مضمون کی تفصیلات ترمیم کریں" : "Edit article details"}
            </DialogDescription>
          </DialogHeader>
          
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              {errors.map((error, index) => (
                <p key={index} className="text-red-600 text-sm">{error}</p>
              ))}
            </div>
          )}

          <ArticleForm
            formData={formData}
            setFormData={setFormData}
            categories={categories}
            language={language}
          />
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              {language === "ur" ? "منسوخ کریں" : "Cancel"}
            </Button>
            <Button onClick={handleUpdateArticle} disabled={loading}>
              {loading ? (language === "ur" ? "اپڈیٹ ہو رہا ہے..." : "Updating...") : (language === "ur" ? "اپڈیٹ کریں" : "Update")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Article Form Component
interface ArticleFormProps {
  formData: any;
  setFormData: (data: any) => void;
  categories: Category[];
  language: string;
}

const ArticleForm: React.FC<ArticleFormProps> = ({ formData, setFormData, categories, language }) => {
  return (
    <div className="grid gap-4 py-4">
      {/* Urdu */}
      <div className="space-y-2 p-4 bg-muted rounded">
        <h3 className="font-medium text-foreground">اردو</h3>
        <div>
          <Label htmlFor="title_ur">عنوان</Label>
          <Input
            id="title_ur"
            value={formData.title.ur}
            onChange={(e) => setFormData({ 
              ...formData, 
              title: { ...formData.title, ur: e.target.value } 
            })}
            placeholder="مثال: سیاست"
            dir="rtl"
          />
        </div>
        <div>
          <Label htmlFor="content_ur">متن</Label>
          <Textarea
            id="content_ur"
            value={formData.content.ur}
            onChange={(e) => setFormData({ 
              ...formData, 
              content: { ...formData.content, ur: e.target.value } 
            })}
            placeholder="سیاسی خبروں کی تفصیل"
            rows={3}
            dir="rtl"
          />
        </div>
      </div>
      
      {/* English */}
      <div className="space-y-2 p-4 bg-muted rounded">
        <h3 className="font-medium text-foreground">English</h3>
        <div>
          <Label htmlFor="title_en">Title</Label>
          <Input
            id="title_en"
            value={formData.title.en}
            onChange={(e) => setFormData({ 
              ...formData, 
              title: { ...formData.title, en: e.target.value } 
            })}
            placeholder="e.g: Politics"
          />
        </div>
        <div>
          <Label htmlFor="content_en">Content</Label>
          <Textarea
            id="content_en"
            value={formData.content.en}
            onChange={(e) => setFormData({ 
              ...formData, 
              content: { ...formData.content, en: e.target.value } 
            })}
            placeholder="Political news and updates"
            rows={3}
          />
        </div>
      </div>
      
      {/* Pashto */}
      <div className="space-y-2 p-4 bg-muted rounded">
        <h3 className="font-medium text-foreground">پښتو</h3>
        <div>
          <Label htmlFor="title_ps">نوم</Label>
          <Input
            id="title_ps"
            value={formData.title.ps}
            onChange={(e) => setFormData({ 
              ...formData, 
              title: { ...formData.title, ps: e.target.value } 
            })}
            placeholder="مثال: سیاست"
            dir="rtl"
          />
        </div>
        <div>
          <Label htmlFor="content_ps">تفصیل</Label>
          <Textarea
            id="content_ps"
            value={formData.content.ps}
            onChange={(e) => setFormData({ 
              ...formData, 
              content: { ...formData.content, ps: e.target.value } 
            })}
            placeholder="سیاسی خبروں کی تفصیل"
            rows={3}
            dir="rtl"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="author">
          {language === "ur" ? "مصنف" : "Author"}
        </Label>
        <Input
          id="author"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="category">
          {language === "ur" ? "زمرہ" : "Category"}
        </Label>
        <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
          <SelectTrigger>
            <SelectValue placeholder={language === "ur" ? "زمرہ منتخب کریں" : "Select category"} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name[language as keyof typeof category.name] || category.name.en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
