// Real Supabase Database Connection
// Connects frontend to actual Supabase backend

import { supabase } from "@/integrations/supabase/client";
import { NewsArticle, Category } from "./database";

// Real database operations using Supabase
export const realDatabase = {
  // Categories
  async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to mock data if Supabase fails
      return await this.getMockCategories();
    }
  },

  async createCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          ...category,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
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

  // Articles
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
        .order('published_at', { ascending: false });

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.category) {
        query = query.eq('category_id', options.category);
      }

      if (options?.featured) {
        query = query.eq('featured', true);
      }

      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching articles:', error);
      // Fallback to mock data if Supabase fails
      return await this.getMockArticles(options);
    }
  },

  async createNewsArticle(article: Omit<NewsArticle, 'id' | 'created_at' | 'updated_at'>): Promise<NewsArticle> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .insert({
          ...article,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating article:', error);
      throw error;
    }
  },

  async updateNewsArticle(id: string, updates: Partial<NewsArticle>): Promise<NewsArticle> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
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
        .or(`title.en.ilike.%${query}%,title.ur.ilike.%${query}%,content.en.ilike.%${query}%,content.ur.ilike.%${query}%`)
        .order('published_at', { ascending: false });

      if (options?.category) {
        dbQuery = dbQuery.eq('category_id', options.category);
      }

      if (options?.limit) {
        dbQuery = dbQuery.limit(options.limit);
      }

      const { data, error } = await dbQuery;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching articles:', error);
      return [];
    }
  },

  // Fallback methods for when Supabase is not available
  async getMockCategories(): Promise<Category[]> {
    // Import mock data as fallback
    const { mockCategories } = await import('./database');
    return mockCategories;
  },

  async getMockArticles(options?: {
    limit?: number;
    category?: string;
    featured?: boolean;
  }): Promise<NewsArticle[]> {
    const { mockArticles } = await import('./database');
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
  }
};

// Test connection function
export const testDatabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('count')
      .single();

    if (error) {
      console.log('Supabase connection failed, using mock data');
      return false;
    }

    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.log('❌ Supabase connection failed, using mock data');
    return false;
  }
};
