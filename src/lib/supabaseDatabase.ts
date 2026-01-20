// Supabase Database Adapter
// Adapts Supabase schema to our frontend interfaces

import { supabase } from "@/integrations/supabase/client";
import { NewsArticle, Category } from "./database";

// Supabase schema interfaces (based on actual DB structure)
interface SupabaseCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  article_count: number | null;
  created_at: string;
  updated_at: string;
}

interface SupabaseArticle {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  image_url: string | null;
  author_id: string | null;
  category_id: string | null;
  is_featured: boolean | null;
  is_published: boolean | null;
  view_count: number | null;
  created_at: string;
  updated_at: string;
}

// Convert Supabase data to our frontend format
const convertCategory = (supabaseCat: SupabaseCategory): Category => ({
  id: supabaseCat.id,
  name: {
    ur: supabaseCat.name,
    en: supabaseCat.name,
    ps: supabaseCat.name
  },
  description: supabaseCat.description ? {
    ur: supabaseCat.description,
    en: supabaseCat.description,
    ps: supabaseCat.description
  } : undefined,
  created_at: supabaseCat.created_at,
  updated_at: supabaseCat.updated_at
});

const convertArticle = (supabaseArt: SupabaseArticle): NewsArticle => ({
  id: supabaseArt.id,
  title: {
    ur: supabaseArt.title,
    en: supabaseArt.title,
    ps: supabaseArt.title
  },
  content: supabaseArt.content ? {
    ur: supabaseArt.content,
    en: supabaseArt.content,
    ps: supabaseArt.content
  } : { ur: '', en: '', ps: '' },
  excerpt: supabaseArt.excerpt ? {
    ur: supabaseArt.excerpt,
    en: supabaseArt.excerpt,
    ps: supabaseArt.excerpt
  } : undefined,
  category_id: supabaseArt.category_id || '',
  author: supabaseArt.author_id || 'Unknown',
  published_at: supabaseArt.created_at,
  created_at: supabaseArt.created_at,
  updated_at: supabaseArt.updated_at,
  image: supabaseArt.image_url || undefined,
  featured: supabaseArt.is_featured || false,
  views: supabaseArt.view_count || 0
});

// Convert frontend format to Supabase format
const convertToSupabaseCategory = (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => ({
  name: category.name.en,
  slug: category.name.en.toLowerCase().replace(/\s+/g, '-'),
  description: category.description?.en || null,
  icon: null,
  article_count: 0
});

const convertToSupabaseArticle = (article: Omit<NewsArticle, 'id' | 'created_at' | 'updated_at'>) => ({
  title: article.title.en,
  slug: article.title.en.toLowerCase().replace(/\s+/g, '-'),
  content: article.content.en,
  excerpt: article.excerpt?.en || null,
  image_url: article.image || null,
  author_id: article.author,
  category_id: article.category_id,
  is_featured: article.featured,
  is_published: true,
  view_count: article.views || 0
});

// Real database operations using Supabase
export const realDatabase = {
  async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.log('Supabase categories failed, using mock data');
        return await this.getMockCategories();
      }

      return (data || []).map(convertCategory);
    } catch (error) {
      console.error('Error fetching categories:', error);
      return await this.getMockCategories();
    }
  },

  async createCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
    try {
      const supabaseData = convertToSupabaseCategory(category);
      
      const { data, error } = await supabase
        .from('categories')
        .insert(supabaseData)
        .select()
        .single();

      if (error) throw error;
      return convertCategory(data);
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    try {
      const supabaseUpdates = convertToSupabaseCategory(updates as Omit<Category, 'id' | 'created_at' | 'updated_at'>);
      
      const { data, error } = await supabase
        .from('categories')
        .update(supabaseUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return convertCategory(data);
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  async deleteCategory(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },

  async getNewsArticles(options?: {
    limit?: number;
    category?: string;
    featured?: boolean;
    offset?: number;
  }): Promise<NewsArticle[]> {
    try {
      let query = supabase
        .from('articles')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.category) {
        query = query.eq('category_id', options.category);
      }

      if (options?.featured) {
        query = query.eq('is_featured', true);
      }

      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        console.log('Supabase articles failed, using mock data');
        return await this.getMockArticles(options);
      }

      return (data || []).map(convertArticle);
    } catch (error) {
      console.error('Error fetching articles:', error);
      return await this.getMockArticles(options);
    }
  },

  async createNewsArticle(article: Omit<NewsArticle, 'id' | 'created_at' | 'updated_at'>): Promise<NewsArticle> {
    try {
      const supabaseData = convertToSupabaseArticle(article);
      
      const { data, error } = await supabase
        .from('articles')
        .insert(supabaseData)
        .select()
        .single();

      if (error) throw error;
      return convertArticle(data);
    } catch (error) {
      console.error('Error creating article:', error);
      throw error;
    }
  },

  async updateNewsArticle(id: string, updates: Partial<NewsArticle>): Promise<NewsArticle> {
    try {
      const supabaseUpdates = convertToSupabaseArticle(updates as Omit<NewsArticle, 'id' | 'created_at' | 'updated_at'>);
      
      const { data, error } = await supabase
        .from('articles')
        .update(supabaseUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return convertArticle(data);
    } catch (error) {
      console.error('Error updating article:', error);
      throw error;
    }
  },

  async deleteNewsArticle(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) throw error;
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
      let dbQuery = supabase
        .from('articles')
        .select('*')
        .eq('is_published', true)
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (options?.category) {
        dbQuery = dbQuery.eq('category_id', options.category);
      }

      if (options?.limit) {
        dbQuery = dbQuery.limit(options.limit);
      }

      const { data, error } = await dbQuery;

      if (error) throw error;
      return (data || []).map(convertArticle);
    } catch (error) {
      console.error('Error searching articles:', error);
      return [];
    }
  },

  // Fallback methods
  async getMockCategories(): Promise<Category[]> {
    return [
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
        description: { ur: 'کھیل کی خبریں', en: 'Sports news', ps: 'لوبې خبرونه' },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  },

  async getMockArticles(options?: {
    limit?: number;
    category?: string;
    featured?: boolean;
  }): Promise<NewsArticle[]> {
    const mockArticles: NewsArticle[] = [
      {
        id: '1',
        title: { ur: 'نمائشہ کی تیاری', en: 'Exhibition Preparation', ps: 'نمایش جوړول' },
        content: { ur: 'نمائشہ کی تیاری جاری ہے', en: 'Exhibition preparation is underway', ps: 'نمایش جوړول روان لري' },
        category_id: '1',
        author: 'Admin',
        published_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        featured: true,
        views: 100
      }
    ];

    let articles = [...mockArticles];
    if (options?.category) articles = articles.filter(a => a.category_id === options.category);
    if (options?.featured) articles = articles.filter(a => a.featured);
    if (options?.limit) articles = articles.slice(0, options.limit);
    return articles;
  }
};

export const testDatabaseConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('categories').select('count').single();
    if (error) {
      console.log('❌ Supabase connection failed, using mock data');
      return false;
    }
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.log('❌ Supabase connection failed, using mock data');
    return false;
  }
};
