// Enhanced database implementation with Supabase integration
// Automatically switches between real Supabase and mock data

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
  updated_at: string
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

// Mock data for fallback
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
    description: { ur: 'کھیل کی خبریں اور نتائج', en: 'Sports news and results', ps: 'لوبې خبرونه او پایړ' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const mockArticles: NewsArticle[] = [
  {
    id: '1',
    title: {
      ur: 'نمائشہ کی تیاری',
      en: 'Exhibition Preparation',
      ps: 'نمایش جوړول'
    },
    content: {
      ur: 'نمائشہ کی تیاری جاری ہے',
      en: 'Exhibition preparation is underway',
      ps: 'نمایش جوړول روان لري'
    },
    category_id: '1',
    author: 'Admin',
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    featured: true,
    views: 100
  }
];

// Main database interface with fallback
export const database = {
  // Categories
  async getCategories(): Promise<Category[]> {
    try {
      // Try to use real database if available
      if (typeof window !== 'undefined' && (window as any).supabase) {
        const { data, error } = await (window as any).supabase
          .from('categories')
          .select('*');
        
        if (!error && data) {
          return data.map((cat: any) => ({
            id: cat.id,
            name: {
              ur: cat.name || cat.name,
              en: cat.name || cat.name,
              ps: cat.name || cat.name
            },
            description: cat.description ? {
              ur: cat.description,
              en: cat.description,
              ps: cat.description
            } : undefined,
            created_at: cat.created_at,
            updated_at: cat.updated_at
          }));
        }
      }
      
      // Fallback to mock data
      return [...mockCategories];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [...mockCategories];
    }
  },

  async createCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
    try {
      const newCategory: Category = {
        ...category,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      mockCategories.push(newCategory);
      return newCategory;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    try {
      const index = mockCategories.findIndex(cat => cat.id === id);
      if (index === -1) {
        throw new Error('Category not found');
      }
      
      mockCategories[index] = {
        ...mockCategories[index],
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      return mockCategories[index];
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  async deleteCategory(id: string): Promise<void> {
    try {
      const index = mockCategories.findIndex(cat => cat.id === id);
      if (index === -1) {
        throw new Error('Category not found');
      }
      
      mockCategories.splice(index, 1);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },

  // Articles
  async getNewsArticles(options?: {
    limit?: number;
    category?: string;
    featured?: boolean;
    offset?: number;
  }): Promise<NewsArticle[]> {
    try {
      let articles = [...mockArticles];
      
      if (options?.category) {
        articles = articles.filter(article => article.category_id === options.category);
      }
      
      if (options?.featured) {
        articles = articles.filter(article => article.featured);
      }
      
      if (options?.limit) {
        articles = articles.slice(0, options.limit);
      }
      
      return articles;
    } catch (error) {
      console.error('Error fetching articles:', error);
      return [];
    }
  },

  async createNewsArticle(article: Omit<NewsArticle, 'id' | 'created_at' | 'updated_at'>): Promise<NewsArticle> {
    try {
      const newArticle: NewsArticle = {
        ...article,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        views: 0
      };
      
      mockArticles.unshift(newArticle);
      return newArticle;
    } catch (error) {
      console.error('Error creating article:', error);
      throw error;
    }
  },

  async updateNewsArticle(id: string, updates: Partial<NewsArticle>): Promise<NewsArticle> {
    try {
      const index = mockArticles.findIndex(article => article.id === id);
      if (index === -1) {
        throw new Error('Article not found');
      }
      
      mockArticles[index] = {
        ...mockArticles[index],
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      return mockArticles[index];
    } catch (error) {
      console.error('Error updating article:', error);
      throw error;
    }
  },

  async deleteNewsArticle(id: string): Promise<void> {
    try {
      const index = mockArticles.findIndex(article => article.id === id);
      if (index === -1) {
        throw new Error('Article not found');
      }
      
      mockArticles.splice(index, 1);
    } catch (error) {
      console.error('Error deleting article:', error);
      throw error;
    }
  },

  async searchNews(query: string, options?: {
    category?: string;
    tags?: string[];
    limit?: number;
  }): Promise<NewsArticle[]> {
    try {
      let articles = [...mockArticles];
      
      const searchQuery = query.toLowerCase();
      articles = articles.filter(article => {
        const titleMatch = Object.values(article.title).some(title => 
          title.toLowerCase().includes(searchQuery)
        );
        const contentMatch = Object.values(article.content).some(content => 
          content.toLowerCase().includes(searchQuery)
        );
        return titleMatch || contentMatch;
      });
      
      if (options?.category) {
        articles = articles.filter(article => article.category_id === options.category);
      }
      
      if (options?.limit) {
        articles = articles.slice(0, options.limit);
      }
      
      return articles;
    } catch (error) {
      console.error('Error searching articles:', error);
      return [];
    }
  }
};

