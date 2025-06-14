// Completely mocked client with no Node.js dependencies

export interface User {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
  updated_at: string;
  email_verified: boolean;
}

export interface AuthResult {
  success: boolean;
  data?: {
    user: User;
    session: {
      access_token: string;
      token_type: string;
      expires_in: number;
      user: User;
    };
  };
  error?: string;
}

// Mock authentication service
export const auth = {
  async signUp(email: string, password: string, userData: any): Promise<AuthResult> {
    console.log('🔧 Mock Auth: Sign up attempt', { email });
    
    const mockUser: User = {
      id: `user-${Date.now()}`,
      email,
      full_name: userData.fullName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      email_verified: false
    };

    return {
      success: true,
      data: {
        user: mockUser,
        session: {
          access_token: `mock-token-${Date.now()}`,
          token_type: 'bearer',
          expires_in: 86400,
          user: mockUser
        }
      }
    };
  },

  async signInWithPassword(email: string, password: string): Promise<AuthResult> {
    console.log('🔧 Mock Auth: Sign in attempt', { email });
    
    // Check for admin credentials
    if (email === 'hi@patorama.com.au' && password === 'Patorama1') {
      const adminUser: User = {
        id: 'admin-user-id',
        email: 'hi@patorama.com.au',
        full_name: 'Admin User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email_verified: true
      };

      return {
        success: true,
        data: {
          user: adminUser,
          session: {
            access_token: `admin-token-${Date.now()}`,
            token_type: 'bearer',
            expires_in: 86400,
            user: adminUser
          }
        }
      };
    }
    
    // Invalid credentials
    return {
      success: false,
      error: 'Invalid email or password'
    };
  },

  async getUser(token: string): Promise<User | null> {
    console.log('🔧 Mock Auth: getUser called with token:', token ? 'Token exists' : 'No token');
    
    // If no token provided, return null
    if (!token) {
      console.log('🔧 Mock Auth: No token provided, returning null');
      return null;
    }
    
    // Check if it's a valid admin token
    if (token?.startsWith('admin-token-')) {
      console.log('🔧 Mock Auth: Valid admin token found');
      return {
        id: 'admin-user-id',
        email: 'hi@patorama.com.au',
        full_name: 'Admin User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email_verified: true
      };
    }
    
    // Check if it's a valid mock token  
    if (token?.startsWith('mock-token-')) {
      console.log('🔧 Mock Auth: Valid mock token found');
      return {
        id: 'demo-user-id',
        email: 'demo@example.com',
        full_name: 'Demo User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email_verified: true
      };
    }
    
    // Invalid token
    console.log('🔧 Mock Auth: Invalid token, returning null');
    return null;
  },

  async signOut(): Promise<{ success: boolean }> {
    console.log('🔧 Mock Auth: Sign out');
    return { success: true };
  }
};

// Mock database client
export const db = {
  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    console.log('🔧 Mock DB: Query', { sql, params });
    return [];
  },

  async queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
    console.log('🔧 Mock DB: QueryOne', { sql, params });
    return null;
  },

  async insert(table: string, data: Record<string, any>): Promise<{ insertId: number }> {
    console.log('🔧 Mock DB: Insert', { table, data });
    return { insertId: Math.floor(Math.random() * 1000) };
  },

  async update(table: string, data: Record<string, any>, where: Record<string, any>): Promise<{ affectedRows: number }> {
    console.log('🔧 Mock DB: Update', { table, data, where });
    return { affectedRows: 1 };
  },

  async delete(table: string, where: Record<string, any>): Promise<{ affectedRows: number }> {
    console.log('🔧 Mock DB: Delete', { table, where });
    return { affectedRows: 1 };
  },

  async select<T = any>(table: string, options: any = {}): Promise<T[]> {
    console.log('🔧 Mock DB: Select', { table, options });
    return [];
  }
};

console.log('🔧 Using completely mocked MySQL services for browser compatibility');