// Browser-compatible client that will make API calls instead of direct DB connections

interface User {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
  updated_at: string;
  email_verified: boolean;
}

interface AuthResult {
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

// Mock authentication for browser compatibility
class BrowserAuthService {
  async signUp(email: string, password: string, userData: any): Promise<AuthResult> {
    // In a real implementation, this would make an API call to your backend
    console.log('Mock sign up:', { email, userData });
    
    // Mock successful response
    const mockUser: User = {
      id: 'mock-user-id',
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
          access_token: 'mock-jwt-token',
          token_type: 'bearer',
          expires_in: 86400,
          user: mockUser
        }
      }
    };
  }

  async signInWithPassword(email: string, password: string): Promise<AuthResult> {
    console.log('Mock sign in:', { email });
    
    // Mock successful response
    const mockUser: User = {
      id: 'mock-user-id',
      email,
      full_name: 'Mock User',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      email_verified: true
    };

    return {
      success: true,
      data: {
        user: mockUser,
        session: {
          access_token: 'mock-jwt-token',
          token_type: 'bearer',
          expires_in: 86400,
          user: mockUser
        }
      }
    };
  }

  async getUser(token: string): Promise<User | null> {
    if (token === 'mock-jwt-token') {
      return {
        id: 'mock-user-id',
        email: 'mock@example.com',
        full_name: 'Mock User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email_verified: true
      };
    }
    return null;
  }

  async signOut(): Promise<{ success: boolean }> {
    return { success: true };
  }
}

// Mock database client for browser
class BrowserDatabaseClient {
  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    console.log('Mock query:', { sql, params });
    return [];
  }

  async queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
    console.log('Mock queryOne:', { sql, params });
    return null;
  }

  async insert(table: string, data: Record<string, any>): Promise<{ insertId: number }> {
    console.log('Mock insert:', { table, data });
    return { insertId: 1 };
  }

  async update(table: string, data: Record<string, any>, where: Record<string, any>): Promise<{ affectedRows: number }> {
    console.log('Mock update:', { table, data, where });
    return { affectedRows: 1 };
  }

  async delete(table: string, where: Record<string, any>): Promise<{ affectedRows: number }> {
    console.log('Mock delete:', { table, where });
    return { affectedRows: 1 };
  }

  async select<T = any>(table: string, options: any = {}): Promise<T[]> {
    console.log('Mock select:', { table, options });
    return [];
  }
}

export const auth = new BrowserAuthService();
export const db = new BrowserDatabaseClient();

console.warn('Using browser-compatible mock services. Set up a proper backend API for production.');