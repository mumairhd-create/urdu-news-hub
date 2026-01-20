// Mock authentication implementation for frontend-only development
// This replaces Supabase auth with local mock functions
// In production, replace with proper authentication service

export interface AuthUser {
  id: string
  email: string
  role?: string
  created_at?: string
  updated_at?: string
}

export interface Profile {
  id: string
  role: string
  created_at: string
  updated_at: string
}

// Environment-based configuration
const isDevelopment = import.meta.env.DEV;
const DEMO_MODE = isDevelopment;

// Demo users for development only
const DEMO_USERS = {
  admin: {
    email: 'admin@umarmedia.dev',
    password: 'admin123',
    role: 'admin'
  },
  editor: {
    email: 'editor@umarmedia.dev',
    password: 'editor123',
    role: 'editor'
  },
  user: {
    email: 'user@umarmedia.dev',
    password: 'user123',
    role: 'user'
  }
};

// Input validation
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

// Sanitize input
const sanitizeInput = (input: string): string => {
  return input.trim().replace(/<script[^>]*>.*?<\/script>/gi, '');
};

export const auth = {
  // Login function with improved security
  async login(email: string, password: string) {
    // Input validation
    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }
    
    if (!validatePassword(password)) {
      throw new Error('Password must be at least 6 characters');
    }
    
    const sanitizedEmail = sanitizeInput(email);
    
    // Demo mode for development
    if (DEMO_MODE) {
      const adminUser = DEMO_USERS.admin;
      const editorUser = DEMO_USERS.editor;
      const regularUser = DEMO_USERS.user;
      
      if (sanitizedEmail === adminUser.email && password === adminUser.password) {
        const demoUser: AuthUser = {
          id: 'demo-admin-id',
          email: sanitizedEmail,
          role: adminUser.role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        return demoUser;
      }
      
      if (sanitizedEmail === editorUser.email && password === editorUser.password) {
        const demoUser: AuthUser = {
          id: 'demo-editor-id',
          email: sanitizedEmail,
          role: editorUser.role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        return demoUser;
      }
      
      if (sanitizedEmail === regularUser.email && password === regularUser.password) {
        const demoUser: AuthUser = {
          id: 'demo-user-id',
          email: sanitizedEmail,
          role: regularUser.role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        return demoUser;
      }
      
      throw new Error('Invalid credentials');
    }
    
    // Production implementation would go here
    // For now, throw error to indicate production auth needed
    throw new Error('Authentication service not configured for production');
  },

  // Logout function
  async logout() {
    // Mock logout - in production, clear session/tokens
    return true;
  },

  // Get current user
  async getCurrentUser() {
    // Mock current user - in production, check session/localStorage
    return null;
  },

  // Sign up function with validation
  async signUp(email: string, password: string, role: 'admin' | 'editor' | 'user' = 'user') {
    // Input validation
    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }
    
    if (!validatePassword(password)) {
      throw new Error('Password must be at least 6 characters');
    }
    
    const sanitizedEmail = sanitizeInput(email);
    
    // Mock sign up - in production, check for existing users
    const newUser: AuthUser = {
      id: Date.now().toString(),
      email: sanitizedEmail,
      role: role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return newUser;
  },

  // Listen to auth changes (mock implementation)
  onAuthStateChange(_callback: (user: AuthUser | null) => void) {
    // Mock auth state change listener
    // In production, this would listen to auth service events
    return {
      subscription: {
        unsubscribe: () => {
          // Mock unsubscribe
        }
      }
    };
  },

  // Get user profile
  async getProfile(userId: string): Promise<Profile | null> {
    // Input validation
    if (!userId || userId.trim() === '') {
      return null;
    }
    
    const sanitizedUserId = sanitizeInput(userId);
    
    // Mock profile retrieval
    if (sanitizedUserId === 'demo-admin-id') {
      return {
        id: sanitizedUserId,
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
    
    if (sanitizedUserId === 'demo-user-id') {
      return {
        id: sanitizedUserId,
        role: 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
    
    return null;
  },

  // Update user profile
  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    // Input validation
    if (!userId || userId.trim() === '') {
      throw new Error('User ID is required');
    }
    
    const sanitizedUserId = sanitizeInput(userId);
    
    // Mock profile update
    const updatedProfile: Profile = {
      id: sanitizedUserId,
      role: updates.role || 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return updatedProfile;
  },

  // Check if user has admin role
  async isAdmin(userId: string): Promise<boolean> {
    if (!userId || userId.trim() === '') {
      return false;
    }
    
    const profile = await this.getProfile(userId);
    return profile?.role === 'admin';
  },

  // Check if user has specific role
  async hasRole(userId: string, requiredRole: 'admin' | 'editor' | 'user'): Promise<boolean> {
    if (!userId || userId.trim() === '') {
      return false;
    }
    
    const profile = await this.getProfile(userId);
    return profile?.role === requiredRole;
  },

  // Authorization middleware for admin operations
  async requireAdmin(userId: string): Promise<void> {
    const isUserAdmin = await this.isAdmin(userId);
    if (!isUserAdmin) {
      throw new Error('Unauthorized: Admin access required');
    }
  },

  // Update user role
  async updateRole(userId: string, newRole: 'admin' | 'editor' | 'user'): Promise<Profile> {
    // Input validation
    if (!userId || userId.trim() === '') {
      throw new Error('User ID is required');
    }
    
    if (!['admin', 'editor', 'user'].includes(newRole)) {
      throw new Error('Invalid role specified');
    }
    
    const sanitizedUserId = sanitizeInput(userId);
    
    // Mock role update
    const updatedProfile: Profile = {
      id: sanitizedUserId,
      role: newRole,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return updatedProfile;
  }
};
