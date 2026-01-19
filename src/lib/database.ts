// Mock database implementation for frontend-only development
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

// Mock data
const mockCategories: Category[] = [
  {
    id: '1',
    name: { ur: 'سیاست', en: 'Politics', ps: 'سياست' },
    description: { ur: 'سیاسی خبریں', en: 'Political news', ps: 'سياسي خبرونه' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: { ur: 'کھیل', en: 'Sports', ps: 'لوبې' },
    description: { ur: 'کھیل کی خبریں', en: 'Sports news', ps: 'د لوبو خبرونه' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: { ur: 'ٹیکنالوجی', en: 'Technology', ps: 'ټيکنالوژي' },
    description: { ur: 'ٹیکنالوجی کی خبریں', en: 'Technology news', ps: 'ټکنالوژي خبرونه' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

const mockArticles: NewsArticle[] = [
  {
    id: '1',
    title: { ur: 'نئی حکومت کا قیام', en: 'New Government Formation', ps: 'نوې حکومت جوړول' },
    content: { ur: 'نئی حکومت کا قیام عمل میں آ گیا ہے۔', en: 'New government formation is underway.', ps: 'نوې حکومت جوړېدل په پړاو کې دي.' },
    excerpt: { ur: 'نئی حکومت کا قیام عمل میں آ گیا ہے۔', en: 'New government formation is underway.', ps: 'نوې حکومت جوړېدل په پړاو کې دي.' },
    category_id: '1',
    author: 'محمد احمد',
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    read_time: 5,
    image: 'https://via.placeholder.com/400x300',
    featured: true,
    status: 'published',
    views: 1500
  },
  {
    id: '2',
    title: { ur: 'کرکٹ ورلڈ کپ', en: 'Cricket World Cup', ps: 'کريکټ نړيوال کپ' },
    content: { ur: 'کرکٹ ورلڈ کپ کا آغاز ہو گیا ہے۔', en: 'Cricket World Cup has started.', ps: 'کريکټ نړيوال کپ پيل شوی.' },
    excerpt: { ur: 'کرکٹ ورلڈ کپ کا آغاز ہو گیا ہے۔', en: 'Cricket World Cup has started.', ps: 'کريکټ نړيوال کپ پيل شوی.' },
    category_id: '2',
    author: 'علی رضا',
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    read_time: 3,
    image: 'https://via.placeholder.com/400x300',
    featured: false,
    status: 'published',
    views: 800
  },
  {
    id: '3',
    title: { ur: 'نئی ٹیکنالوجی', en: 'New Technology', ps: 'نوې ټکنالوژي' },
    content: { ur: 'نیئ ٹیکنالوجی متعارف کروائی گئی ہے۔', en: 'New technology has been introduced.', ps: 'نوې ټکنالوژي معرفي شوه.' },
    excerpt: { ur: 'نیئ ٹیکنالوجی متعارف کروائی گئی ہے۔', en: 'New technology has been introduced.', ps: 'نوې ټکنالوژي معرفي شوه.' },
    category_id: '3',
    author: 'سارہ خان',
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    read_time: 4,
    image: 'https://via.placeholder.com/400x300',
    featured: false,
    status: 'published',
    views: 600
  }
]

export const database = {
  // Categories
  async getCategories() {
    return mockCategories
  },

  async getCategory(id: string) {
    return mockCategories.find(cat => cat.id === id) || null
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

  // News articles
  async getNewsArticles(filters?: {
    category_id?: string
    subcategory_id?: string
    featured?: boolean
    status?: string
    priority?: string
    tags?: string[]
    limit?: number
    offset?: number
  }) {
    let filteredArticles = [...mockArticles]
    
    // Apply filters
    if (filters?.category_id) {
      filteredArticles = filteredArticles.filter(article => article.category_id === filters.category_id)
    }
    if (filters?.featured !== undefined) {
      filteredArticles = filteredArticles.filter(article => article.featured === filters.featured)
    }
    if (filters?.status) {
      filteredArticles = filteredArticles.filter(article => article.status === filters.status)
    }
    
    // Apply pagination
    if (filters?.limit) {
      const start = filters?.offset || 0
      filteredArticles = filteredArticles.slice(start, start + filters.limit)
    }
    
    return filteredArticles
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

  // Search functionality
  async searchNews(query: string, filters?: {
    category_id?: string
    subcategory_id?: string
    tags?: string[]
  }) {
    let filteredArticles = mockArticles.filter(article => 
      article.title.ur.toLowerCase().includes(query.toLowerCase()) ||
      article.title.en.toLowerCase().includes(query.toLowerCase()) ||
      article.content.ur.toLowerCase().includes(query.toLowerCase()) ||
      article.content.en.toLowerCase().includes(query.toLowerCase())
    )
    
    if (filters?.category_id) {
      filteredArticles = filteredArticles.filter(article => article.category_id === filters.category_id)
    }
    
    return filteredArticles
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
