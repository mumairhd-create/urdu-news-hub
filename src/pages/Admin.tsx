import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useLanguage } from "@/hooks/useLanguage"
import { AuthUser } from "@/lib/auth"
import { database, NewsArticle, Category } from "@/lib/database"
import { safeSecureStorage, safeInitializeSecureCode } from '@/lib/safeAuth'
import { Plus, Edit, Trash2, Eye, Settings, BarChart3, FileText, Users, TrendingUp, LogOut, Key } from "lucide-react"
import { SimpleLogin } from "@/components/SimpleLogin"
import { CategoryManager } from "@/components/CategoryManager"

const Admin = () => {
  const { language } = useLanguage();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [articlesList, setArticlesList] = useState<NewsArticle[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("articles");
  const [formData, setFormData] = useState({
    title: { ur: "", en: "", ps: "" },
    content: { ur: "", en: "", ps: "" },
    category_id: "",
    author: "",
    published_at: ""
  });

  // Initialize secure authentication and check existing session
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Initialize secure code system
        safeInitializeSecureCode();
        
        // Check for existing valid session
        const session = safeSecureStorage.getSession();
        if (session) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            role: session.user.role,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          await loadData();
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);


  const handleLogout = async () => {
    safeSecureStorage.clearSession();
    setUser(null);
  };

  const loadData = async () => {
    try {
      const [articlesData, categoriesData] = await Promise.all([
        database.getNewsArticles(),
        database.getCategories()
      ]);
      
      setArticlesList(articlesData);
      setCategoriesList(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
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
  };

  const handleAddArticle = async () => {
    try {
      const newArticle = {
        title: formData.title,
        content: formData.content,
        category_id: formData.category_id,
        author: formData.author,
        published_at: formData.published_at || new Date().toISOString()
      };

      await database.createNewsArticle(newArticle);
      await loadData();
      resetForm();
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding article:', error);
    }
  };

  const handleUpdateArticle = async () => {
    if (!selectedArticle) return;

    try {
      await database.updateNewsArticle(selectedArticle.id, {
        title: formData.title,
        content: formData.content,
        category_id: formData.category_id,
        author: formData.author,
        published_at: formData.published_at
      });
      
      await loadData();
      setIsEditDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error updating article:', error);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    try {
      await database.deleteNewsArticle(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting article:', error);
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

  const stats = {
    totalArticles: articlesList.length,
    featuredArticles: 0,
    totalCategories: categoriesList.length,
    totalViews: articlesList.reduce((acc) => acc + Math.floor(Math.random() * 10000), 0)
  };

  if (loading) {
    return <SimpleLogin onLogin={setUser} />;
  }

  if (!user) {
    return <SimpleLogin onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen bg-muted p-6" dir={language === "ur" ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {language === "ur" ? "ایڈمن پینل" : "Admin Panel"}
            </h1>
            <p className="text-muted-foreground">
              {language === "ur" ? "نیوز ہب کی انتظامیہ" : "News Hub Management"}
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            {language === "ur" ? "لاگ آؤٹ" : "Logout"}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === "ur" ? "کل مضامین" : "Total Articles"}
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalArticles}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === "ur" ? "خاص مضامین" : "Featured Articles"}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.featuredArticles}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === "ur" ? "کل زمرے" : "Total Categories"}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCategories}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === "ur" ? "کل دیکھے گئے" : "Total Views"}
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="articles">
              {language === "ur" ? "مضامین" : "Articles"}
            </TabsTrigger>
            <TabsTrigger value="categories">
              {language === "ur" ? "زمرے" : "Categories"}
            </TabsTrigger>
            <TabsTrigger value="settings">
              {language === "ur" ? "ترتیبات" : "Settings"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="articles" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">
                {language === "ur" ? "مضامین کا انتظام" : "Article Management"}
              </h2>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    {language === "ur" ? "نیا مضمون" : "New Article"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {language === "ur" ? "نیا مضمون شامل کریں" : "Add New Article"}
                    </DialogTitle>
                    <DialogDescription>
                      {language === "ur" ? "نیا مضمون شامل کرنے کے لیے تفصیلات درج کریں" : "Fill in the details to add a new article"}
                    </DialogDescription>
                  </DialogHeader>
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
                          {categoriesList.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name[language as keyof typeof category.name] || category.name.en}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      {language === "ur" ? "منسوخ کریں" : "Cancel"}
                    </Button>
                    <Button onClick={handleAddArticle}>
                      {language === "ur" ? "شامل کریں" : "Add"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

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
                          <Badge variant="secondary">
                            {categoriesList.find(c => c.id === article.category_id)?.name[language as keyof Category['name']] || categoriesList.find(c => c.id === article.category_id)?.name.en}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const url = `${window.location.origin}/article/${article.id}`;
                            window.open(url, '_blank', 'noopener,noreferrer');
                          }}
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
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <CategoryManager />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">
                {language === "ur" ? "ترتیبات" : "Settings"}
              </h2>
              <Button>
                <Settings className="h-4 w-4 mr-2" />
                {language === "ur" ? "ترتیبات محفوظ کریں" : "Save Settings"}
              </Button>
            </div>

            {/* Login Code Info - Hidden */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  {language === "ur" ? "لاگ ان کوڈ معلومات" : "Login Code Info"}
                </CardTitle>
                <CardDescription>
                  {language === "ur" ? "ایڈمن لاگ ان کوڈ" : "Admin login code"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-yellow-800 text-sm">
                    {language === "ur" ? "سیکیورٹی کی وجہ سے کوڈ چھپا ہوا ہے - براؤزر انسپکٹر سے بھی نہیں دیکھا جا سکتا" : "Code hidden for security - cannot be viewed even in browser inspector"}
                  </p>
                </div>

                <div className="text-center text-xs text-muted-foreground">
                  <p>
                    {language === "ur" ? "صرف ایڈمن کو کوڈ معلوم ہے" : "Only admin knows the code"}
                  </p>
                  <p className="mt-1">
                    {language === "ur" ? "کوڈ تبدیل نہیں کیا جا سکتا" : "Code cannot be changed"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {language === "ur" ? "عمومی ترتیبات" : "General Settings"}
                </CardTitle>
                <CardDescription>
                  {language === "ur" ? "ویب سائٹ کی عمومی ترتیبات" : "Website general settings"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="siteName">
                      {language === "ur" ? "ویب سائٹ کا نام" : "Site Name"}
                    </Label>
                    <Input
                      id="siteName"
                      defaultValue={language === "ur" ? "اردو نیوز ہب" : "Urdu News Hub"}
                    />
                  </div>
                  <div>
                    <Label htmlFor="adminEmail">
                      {language === "ur" ? "ایڈمن ای میل" : "Admin Email"}
                    </Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      defaultValue="admin@urdunewshub.com"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="maintenance" />
                  <Label htmlFor="maintenance">
                    {language === "ur" ? "میٹیننس موڈ" : "Maintenance Mode"}
                  </Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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
            <div className="grid gap-4 py-4">
              {/* Urdu */}
              <div className="space-y-2 p-4 bg-muted rounded">
                <h3 className="font-medium text-foreground">اردو</h3>
                <div>
                  <Label htmlFor="editTitle_ur">عنوان</Label>
                  <Input
                    id="editTitle_ur"
                    value={formData.title.ur}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      title: { ...formData.title, ur: e.target.value } 
                    })}
                    dir="rtl"
                  />
                </div>
                <div>
                  <Label htmlFor="editContent_ur">متن</Label>
                  <Textarea
                    id="editContent_ur"
                    value={formData.content.ur}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      content: { ...formData.content, ur: e.target.value } 
                    })}
                    rows={3}
                    dir="rtl"
                  />
                </div>
              </div>
              
              {/* English */}
              <div className="space-y-2 p-4 bg-muted rounded">
                <h3 className="font-medium text-foreground">English</h3>
                <div>
                  <Label htmlFor="editTitle_en">Title</Label>
                  <Input
                    id="editTitle_en"
                    value={formData.title.en}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      title: { ...formData.title, en: e.target.value } 
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="editContent_en">Content</Label>
                  <Textarea
                    id="editContent_en"
                    value={formData.content.en}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      content: { ...formData.content, en: e.target.value } 
                    })}
                    rows={3}
                  />
                </div>
              </div>
              
              {/* Pashto */}
              <div className="space-y-2 p-4 bg-muted rounded">
                <h3 className="font-medium text-foreground">پښتو</h3>
                <div>
                  <Label htmlFor="editTitle_ps">نوم</Label>
                  <Input
                    id="editTitle_ps"
                    value={formData.title.ps || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      title: { ...formData.title, ps: e.target.value } 
                    })}
                    dir="rtl"
                  />
                </div>
                <div>
                  <Label htmlFor="editContent_ps">تفصیل</Label>
                  <Textarea
                    id="editContent_ps"
                    value={formData.content.ps || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      content: { ...formData.content, ps: e.target.value } 
                    })}
                    rows={3}
                    dir="rtl"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="editAuthor">
                  {language === "ur" ? "مصنف" : "Author"}
                </Label>
                <Input
                  id="editAuthor"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="editCategory">
                  {language === "ur" ? "زمرہ" : "Category"}
                </Label>
                <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === "ur" ? "زمرہ منتخب کریں" : "Select category"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesList.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name[language as keyof typeof category.name] || category.name.en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                {language === "ur" ? "منسوخ کریں" : "Cancel"}
              </Button>
              <Button onClick={handleUpdateArticle}>
                {language === "ur" ? "اپڈیٹ کریں" : "Update"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Admin;
