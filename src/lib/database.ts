// Enhanced mock database implementation with better error handling and more realistic data
// This replaces Supabase with local data and mock functions

export interface NewsArticle {
  id: string
  title: { ur: string; en: string; ps?: string }
  content: { ur: string; en: string; ps?: string }
  excerpt?: { ur: string; en: string; ps?: string }
  category_id: string
  subcategory_id?: string
  author: string
  published_at: string
  created_at?: string
  updated_at?: string
  read_time?: number
  image?: string
  featured?: boolean
  tags?: string[]
  priority?: 'low' | 'medium' | 'high'
  status?: 'draft' | 'published' | 'archived'
  views?: number
  breaking?: boolean
  trending?: boolean
}

export interface Category {
  id: string
  name: { ur: string; en: string; ps?: string }
  description?: { ur: string; en: string; ps?: string }
  parent_id?: string
  created_at: string
  updated_at: string
  subcategories?: Category[]
}

export interface CategoryTree extends Category {
  children: CategoryTree[]
}

export interface CategoryWithSubcategories extends Category {
  subcategories: Category[]
}

// Enhanced mock data with more realistic content
const mockCategories: Category[] = [
  {
    id: '1',
    name: { ur: 'سیاست', en: 'Politics', ps: 'سياست' },
    description: { ur: 'سیاسی خبریں اور تجزیے', en: 'Political news and analysis', ps: 'سياسي خبرونه او تحليل' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: { ur: 'کھیل', en: 'Sports', ps: 'لوبې' },
    description: { ur: 'کھیل کی خبریں اور نتائج', en: 'Sports news and results', ps: 'د لوبو خبرونه او پايلي' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: { ur: 'ٹیکنالوجی', en: 'Technology', ps: 'ټيکنالوژي' },
    description: { ur: 'جدید ٹیکنالوجی اور سائنس', en: 'Latest technology and science', ps: 'نوي ټکنالوژي او ساينس' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    name: { ur: 'کاروبار', en: 'Business', ps: 'سوداگرزي' },
    description: { ur: 'کاروباری خبریں اور مارکیٹ تجزیے', en: 'Business news and market analysis', ps: 'سوداگرزي خبرونه او مارکيت تحليل' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    name: { ur: 'تفریح', en: 'Entertainment', ps: 'تفرېح' },
    description: { ur: 'تفریحی خبریں اور شوبز', en: 'Entertainment news and showbiz', ps: 'تفرېحي خبرونه او شوبز' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '6',
    name: { ur: 'صحت', en: 'Health', ps: 'روغتيا' },
    description: { ur: 'صحت کی خبریں اور مشورے', en: 'Health news and advice', ps: 'روغتيا خبرونه او مشورې' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const mockArticles: NewsArticle[] = [
  {
    id: '1',
    title: { ur: 'نئی حکومت کا قیام: قومی اسمبلی میں اعتماد ووٹ کا اعلان', en: 'New Government Formation: Vote of Confidence Announced in National Assembly', ps: 'نوې حکومت جوړول: د ملي شورا د باور اعتماد رایې اعلان' },
    content: { 
      ur: 'اسلام آباد: نئی حکومت کے قیام کے بعد قومی اسمبلی میں اعتماد ووٹ کا اعلان کر دیا گیا ہے۔ وزیر اعظم نے کہا کہ وہ ملک کی ترقی اور خوشحالی کے لیے کام کریں گے۔ اپوزیشن نے اس فیصلے پر سخت ردعمل کا اظہار کیا ہے۔',
      en: 'Islamabad: A vote of confidence has been announced in the National Assembly following the formation of the new government. The Prime Minister stated that they will work for the country\'s development and prosperity. The opposition has expressed strong reaction to this decision.',
      ps: 'اسلام اباد: د نوې حکومت د جوړېدو وروسته په ملي شورا کې د باور اعتماد رایې اعلان شوې دي. لومړي وزير وویل چې د هېواد پرمختیګ او خوشحالي لپاره به کار کوي. مخالفو د دې پریکړې سخت غبرګون ښودلی دی.'
    },
    excerpt: { 
      ur: 'قومی اسمبلی میں اعتماد ووٹ کا اعلان، وزیر اعظم نے ترقی کے وعدے کیے', 
      en: 'Vote of confidence announced in National Assembly, PM promises development', 
      ps: 'په ملي شورا کې د باور اعتماد رایې اعلان، لومړي وزير پرمختیګ ژمنې وکړې' 
    },
    category_id: '1',
    author: 'احمد رضا',
    published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read_time: 8,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    featured: true,
    breaking: true,
    trending: true,
    status: 'published',
    views: 15420,
    tags: ['حکومت', 'قومی اسمبلی', 'سیاست']
  },
  {
    id: '2',
    title: { ur: 'پاکستان کرکٹ ٹیم کی تاریخی فتح', en: 'Pakistan Cricket Team Makes Historic Victory', ps: 'د پاکستان کرکټ ټيم تاريخي بريا' },
    content: { 
      ur: 'پاکستان کرکٹ ٹیم نے آج دبئی میں کھیلے گئے میچ میں بھارت کو 5 وکٹ سے ہرا دیا۔ یہ فتح ٹیم کی تاریخ کی اہم ترین فتحوں میں سے ایک ہے۔ کپتان بابر اعظم نے شاندار پرفارمنس دکھائی۔',
      en: 'Pakistan cricket team defeated India by 5 wickets in a match played in Dubai today. This victory is one of the most important wins in the team\'s history. Captain Babar Azam showed outstanding performance.',
      ps: 'د پاکستان کرکټ ټيم نن دوبۍ کې د لخوا لړې شوې لوبې کې هندوای 5 وکټو سره ماتې کړه. دا بريا د ټيم په تاريخ کې د مهمو بریاوو څخه یوه ده. کپتان بابر اعظم نې ستره کارکړنه وښوده.'
    },
    excerpt: { 
      ur: 'پاکستان نے بھارت کو 5 وکٹ سے ہرایا، بابر اعظم کی شاندر کارکردگی', 
      en: 'Pakistan defeats India by 5 wickets, Babar Azam\'s brilliant performance', 
      ps: 'پاکستان هندوای 5 وکټو سره ماتې کړه، بابر اعظم ستره کارکړنه' 
    },
    category_id: '2',
    author: 'فیضان علی',
    published_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    read_time: 6,
    image: 'https://images.unsplash.com/photo-1540747918344-1263a9a5c5b5?w=800&h=600&fit=crop',
    featured: false,
    trending: true,
    status: 'published',
    views: 8930,
    tags: ['کرکٹ', 'پاکستان', 'بھارت', 'فتح']
  },
  {
    id: '3',
    title: { ur: 'نئی آئی فون 16 سیریز کی لانچنگ', en: 'New iPhone 16 Series Launch', ps: 'نوي آئي فون 16 سريز لانچ کول' },
    content: { 
      ur: 'ایپل نے آئی فون 16 سیریز کو عالمی سطح پر لانچ کر دیا ہے۔ نئی فونز میں تیز رفتار پروسیسر اور بہتر کیمرے ہیں۔ قیمتوں میں اضافے کا اعلان بھی کیا گیا ہے۔',
      en: 'Apple has launched the iPhone 16 series globally. The new phones feature faster processors and better cameras. Price increases have also been announced.',
      ps: 'ایپل آئي فون 16 سريز نړیواله لانچ کړې. نوی فونونه تيز پروسیسر او ښې کیمرې لري. د قیمتو د زیاتوالي اعلان هم شوی دی.'
    },
    excerpt: { 
      ur: 'ایپل نے آئی فون 16 سیریز لانچ کی، نئی خصوصیات کا اعلان', 
      en: 'Apple launches iPhone 16 series, announces new features', 
      ps: 'ایپل آئي فون 16 سريز لانچ کړه، نوی ځانتياوې اعلان کړې' 
    },
    category_id: '3',
    author: 'سارہ یوسف',
    published_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    read_time: 5,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop',
    featured: false,
    status: 'published',
    views: 6780,
    tags: ['ایپل', 'آئی فون', 'ٹیکنالوجی']
  },
  {
    id: '4',
    title: { ur: 'اسٹاک مارکیٹ میں تیزی سے اضافہ', en: 'Rapid Growth in Stock Market', ps: 'په اسټاک مارکیټ کې چټک وده' },
    content: { 
      ur: 'پاکستان اسٹاک ایکسچینج میں آج 1000 پوائنٹس کا اضافہ دیکھا گیا۔ ماہرین کا کہنا ہے کہ یہ معاشی بحران سے بازیابی کا اشارہ ہے۔',
      en: 'Pakistan Stock Exchange saw an increase of 1000 points today. Experts say this indicates recovery from economic crisis.',
      ps: 'په پاکستان اسټاک ایکسچینج کې نن 1000 پوینټه زياتوالی ولیدل شو. پوهان وايي چې دا د اقتصادي بحران څخه بېرته راستنې نښه دی.'
    },
    excerpt: { 
      ur: 'پی ایس ایکس میں 1000 پوائنٹس کا اضافہ', 
      en: 'PSX gains 1000 points', 
      ps: 'په پی ایس ایکس کې 1000 پوینټه زياتوالی' 
    },
    category_id: '4',
    author: 'عمران خان',
    published_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    read_time: 4,
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop',
    featured: false,
    status: 'published',
    views: 4520,
    tags: ['اسٹاک مارکیٹ', 'معیشت', 'پیسے']
  },
  {
    id: '5',
    title: { ur: 'لاہور میں فلم فیسٹیول کا آغاز', en: 'Film Festival Begins in Lahore', ps: 'په لاهور کې د فلم فیستیوال پیل' },
    content: { 
      ur: 'لاہور میں سالانہ فلم فیسٹیول کا آغاز ہو گیا ہے۔ مختلف ممالک کی فلمیں دکھائی جائیں گی۔ فنکاروں نے بڑی تعداد میں شرکت کی ہے۔',
      en: 'The annual film festival has begun in Lahore. Films from different countries will be shown. Artists have participated in large numbers.',
      ps: 'په لاهور کې سالنی فلم فیستیوال پیل شوی دی. بېلابېلو هېوادونو فلمې ښودلې کېږي. فنکارانو په لوی شمیره ګډون کړی دی.'
    },
    excerpt: { 
      ur: 'لاہور فلم فیسٹیول کا آغاز، بین الاقوامی فلمیں شامل', 
      en: 'Lahore film festival begins, international films included', 
      ps: 'لاهور فلم فیستیوال پیل شوی، نړیوال فلمې شاملې' 
    },
    category_id: '5',
    author: 'عائشہ محمود',
    published_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    read_time: 3,
    image: 'https://images.unsplash.com/photo-1489599809568-359f7dc8bfc2?w=800&h=600&fit=crop',
    featured: false,
    status: 'published',
    views: 3210,
    tags: ['فلم فیسٹیول', 'لاہور', 'تفریح']
  },
  {
    id: '6',
    title: { ur: 'زمینی صحت: نئی بیماریوں کا خطرہ', en: 'Global Health: Threat of New Diseases', ps: 'نړیواله روغتيا: د نويو ناروغيو خطره' },
    content: { 
      ur: 'صحت کے ماہرین نے نئی بیماریوں کے خطرے سے آگاہ کیا ہے۔ انہوں نے حفاظتی تدابیر کی اہمیت پر زور دیا ہے۔',
      en: 'Health experts have warned about the threat of new diseases. They have emphasized the importance of preventive measures.',
      ps: 'روغتيا پوهانو د نويو ناروغيو د خطر څخه خبرتیا ورکړې. دوی د خپلواکو تدابیرو اهمیت ته ټينګار کړی دی.'
    },
    excerpt: { 
      ur: 'صحت کے ماہرین نے نئی بیماریوں سے آگاہ کیا', 
      en: 'Health experts warn about new diseases', 
      ps: 'روغتيا پوهانو د نويو ناروغيو څخه خبرتیا ورکړه' 
    },
    category_id: '6',
    author: 'ڈاکٹر فہد احمد',
    published_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    read_time: 7,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop',
    featured: false,
    status: 'published',
    views: 2890,
    tags: ['صحت', 'بیماریاں', 'حفاظت']
  }
];

export const database = {
  // Enhanced Categories with error handling
  async getCategories(): Promise<Category[]> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 100));
      return [...mockCategories];
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      throw new Error('Failed to load categories');
    }
  },

  async getCategory(id: string): Promise<Category | null> {
    try {
      await new Promise(resolve => setTimeout(resolve, 50));
      return mockCategories.find(cat => cat.id === id) || null;
    } catch (error) {
      console.error(`Failed to fetch category ${id}:`, error);
      throw new Error(`Failed to load category: ${id}`);
    }
  },

  async createCategory(category: Omit<Category, 'id' | 'created_at'>) {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    mockCategories.push(newCategory)
    return newCategory
  },

  async updateCategory(id: string, category: Partial<Omit<Category, 'id' | 'created_at'>>) {
    const index = mockCategories.findIndex(cat => cat.id === id)
    if (index === -1) throw new Error('Category not found')
    
    mockCategories[index] = {
      ...mockCategories[index],
      ...category,
      updated_at: new Date().toISOString()
    }
    return mockCategories[index]
  },

  async deleteCategory(id: string) {
    const index = mockCategories.findIndex(cat => cat.id === id)
    if (index === -1) throw new Error('Category not found')
    mockCategories.splice(index, 1)
  },

  // Hierarchical category operations
  async getCategoryTree(): Promise<CategoryTree[]> {
    return mockCategories.map(cat => ({
      ...cat,
      children: []
    }))
  },

  async getCategoryWithSubcategories(id: string): Promise<CategoryWithSubcategories | null> {
    const category = mockCategories.find(cat => cat.id === id)
    if (!category) return null
    
    return {
      ...category,
      subcategories: []
    }
  },

  async getRootCategories(): Promise<Category[]> {
    return mockCategories.filter(cat => !cat.parent_id)
  },

  async getSubcategories(parentId: string): Promise<Category[]> {
    return mockCategories.filter(cat => cat.parent_id === parentId)
  },

  // Enhanced News Articles with better filtering and error handling
  async getNewsArticles(filters?: {
    category_id?: string
    subcategory_id?: string
    featured?: boolean
    status?: string
    priority?: string
    tags?: string[]
    limit?: number
    offset?: number
    breaking?: boolean
    trending?: boolean
  }): Promise<NewsArticle[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 150));
      
      let filteredArticles = [...mockArticles];
      
      // Apply filters with better logic
      if (filters?.category_id) {
        filteredArticles = filteredArticles.filter(article => article.category_id === filters.category_id);
      }
      if (filters?.featured !== undefined) {
        filteredArticles = filteredArticles.filter(article => article.featured === filters.featured);
      }
      if (filters?.status) {
        filteredArticles = filteredArticles.filter(article => article.status === filters.status);
      }
      if (filters?.breaking !== undefined) {
        filteredArticles = filteredArticles.filter(article => article.breaking === filters.breaking);
      }
      if (filters?.trending !== undefined) {
        filteredArticles = filteredArticles.filter(article => article.trending === filters.trending);
      }
      if (filters?.tags && filters.tags.length > 0) {
        filteredArticles = filteredArticles.filter(article => 
          filters.tags!.some(tag => article.tags?.includes(tag))
        );
      }
      
      // Sort by published date (newest first)
      filteredArticles.sort((a, b) => 
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
      );
      
      // Apply pagination
      if (filters?.limit) {
        const start = filters?.offset || 0;
        filteredArticles = filteredArticles.slice(start, start + filters.limit);
      }
      
      return filteredArticles;
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      throw new Error('Failed to load articles');
    }
  },

  async getNewsArticle(id: string) {
    return mockArticles.find(article => article.id === id) || null
  },

  async createNewsArticle(article: Omit<NewsArticle, 'id' | 'created_at' | 'updated_at' | 'views'>) {
    const newArticle: NewsArticle = {
      ...article,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      views: 0,
      status: article.status || 'published'
    }
    mockArticles.push(newArticle)
    return newArticle
  },

  async updateNewsArticle(id: string, article: Partial<NewsArticle>) {
    const index = mockArticles.findIndex(article => article.id === id)
    if (index === -1) throw new Error('Article not found')
    
    mockArticles[index] = {
      ...mockArticles[index],
      ...article,
      updated_at: new Date().toISOString()
    }
    return mockArticles[index]
  },

  async deleteNewsArticle(id: string) {
    const index = mockArticles.findIndex(article => article.id === id)
    if (index === -1) throw new Error('Article not found')
    mockArticles.splice(index, 1)
  },

  // Enhanced search functionality
  async searchNews(query: string, filters?: {
    category_id?: string
    subcategory_id?: string
    tags?: string[]
  }): Promise<NewsArticle[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      if (!query.trim()) {
        return [];
      }
      
      const searchQuery = query.toLowerCase().trim();
      let filteredArticles = mockArticles.filter(article => {
        // Search in title, content, and excerpt for all languages
        const searchableText = [
          ...Object.values(article.title),
          ...Object.values(article.content),
          ...(article.excerpt ? Object.values(article.excerpt) : []),
          article.author,
          ...(article.tags || [])
        ].join(' ').toLowerCase();
        
        return searchableText.includes(searchQuery);
      });
      
      // Apply additional filters
      if (filters?.category_id) {
        filteredArticles = filteredArticles.filter(article => article.category_id === filters.category_id);
      }
      if (filters?.tags && filters.tags.length > 0) {
        filteredArticles = filteredArticles.filter(article => 
          filters.tags!.some(tag => article.tags?.includes(tag))
        );
      }
      
      // Sort by relevance (simple implementation: prioritize exact matches in title)
      filteredArticles.sort((a, b) => {
        const aTitleMatch = Object.values(a.title).some(title => 
          title.toLowerCase().includes(searchQuery)
        );
        const bTitleMatch = Object.values(b.title).some(title => 
          title.toLowerCase().includes(searchQuery)
        );
        
        if (aTitleMatch && !bTitleMatch) return -1;
        if (!aTitleMatch && bTitleMatch) return 1;
        
        // Then sort by published date
        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
      });
      
      return filteredArticles;
    } catch (error) {
      console.error('Search failed:', error);
      throw new Error('Search failed');
    }
  },

  // Get articles by category
  async getArticlesByCategory(categoryId: string) {
    return mockArticles.filter(article => article.category_id === categoryId)
  },

  // Get featured articles
  async getFeaturedArticles() {
    return mockArticles.filter(article => article.featured)
  },

  // Get trending articles (most viewed)
  async getTrendingArticles(limit: number = 10) {
    return mockArticles
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, limit)
  },

  // Statistics
  async getStats() {
    return {
      totalArticles: mockArticles.length,
      publishedArticles: mockArticles.filter(article => article.status === 'published').length,
      totalCategories: mockCategories.length,
      featuredArticles: mockArticles.filter(article => article.featured).length,
      draftArticles: mockArticles.filter(article => article.status === 'draft').length
    }
  }
}
