// DEPRECATED: This file provides compatibility for existing imports
// New code should use @/integrations/mysql/client instead

import { db } from '@/integrations/mysql/mock-client';
import { auth } from '@/integrations/mysql/mock-client';

console.warn('DEPRECATED: Using Supabase client compatibility layer. Please migrate to MySQL client.');

// Mock data for development
const mockData = {
  orders: [
    { id: 1, client_id: 1, status: 'completed', total_amount: 500, date: '2024-01-15' },
    { id: 2, client_id: 2, status: 'pending', total_amount: 750, date: '2024-01-20' },
  ],
  clients: [
    { id: 1, name: 'John Doe', email: 'john@example.com', company: 'ABC Corp' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', company: 'XYZ Inc' },
  ],
  users: [
    { id: 1, email: 'photographer@example.com', role: 'photographer' },
    { id: 2, email: 'admin@example.com', role: 'admin' },
  ]
};

// Enhanced compatibility object for existing code
export const supabase = {
  // Database operations compatibility
  from: (table: string) => ({
    select: (columns = '*') => ({
      eq: (column: string, value: any) => ({
        eq: (column2: string, value2: any) => ({
          maybeSingle: async () => {
            try {
              console.log(`🔧 Mock Query: SELECT ${columns} FROM ${table} WHERE ${column} = ${value} AND ${column2} = ${value2}`);
              const tableData = mockData[table as keyof typeof mockData] || [];
              const result = tableData.find((item: any) => item[column] === value && item[column2] === value2);
              return { data: result || null, error: null };
            } catch (error) {
              return { data: null, error };
            }
          },
          single: async () => {
            try {
              console.log(`🔧 Mock Query: SELECT ${columns} FROM ${table} WHERE ${column} = ${value} AND ${column2} = ${value2}`);
              const tableData = mockData[table as keyof typeof mockData] || [];
              const result = tableData.find((item: any) => item[column] === value && item[column2] === value2);
              return { data: result || null, error: null };
            } catch (error) {
              return { data: null, error };
            }
          }
        }),
        maybeSingle: async () => {
          try {
            console.log(`🔧 Mock Query: SELECT ${columns} FROM ${table} WHERE ${column} = ${value}`);
            const tableData = mockData[table as keyof typeof mockData] || [];
            const result = tableData.find((item: any) => item[column] === value);
            return { data: result || null, error: null };
          } catch (error) {
            return { data: null, error };
          }
        },
        single: async () => {
          try {
            console.log(`🔧 Mock Query: SELECT ${columns} FROM ${table} WHERE ${column} = ${value}`);
            const tableData = mockData[table as keyof typeof mockData] || [];
            const result = tableData.find((item: any) => item[column] === value);
            return { data: result || null, error: null };
          } catch (error) {
            return { data: null, error };
          }
        }
      }),
      not: (column: string, operator: string, value: any) => ({
        async then(resolve: any) {
          try {
            console.log(`🔧 Mock Query: SELECT ${columns} FROM ${table} WHERE NOT ${column} ${operator} ${value}`);
            const tableData = mockData[table as keyof typeof mockData] || [];
            return resolve({ data: tableData, error: null });
          } catch (error) {
            return resolve({ data: null, error });
          }
        }
      }),
      order: (column: string, options?: any) => ({
        async then(resolve: any) {
          try {
            console.log(`🔧 Mock Query: SELECT ${columns} FROM ${table} ORDER BY ${column}`);
            const tableData = mockData[table as keyof typeof mockData] || [];
            return resolve({ data: tableData, error: null });
          } catch (error) {
            return resolve({ data: null, error });
          }
        }
      }),
      async then(resolve: any) {
        try {
          console.log(`🔧 Mock Query: SELECT ${columns} FROM ${table}`);
          const tableData = mockData[table as keyof typeof mockData] || [];
          return resolve({ data: tableData, error: null });
        } catch (error) {
          return resolve({ data: null, error });
        }
      }
    }),
    insert: (data: any) => ({
      async select(columns = '*') {
        try {
          console.log(`🔧 Mock Insert: INSERT INTO ${table}`, data);
          const result = await db.insert(table, data);
          return { data: result, error: null };
        } catch (error) {
          return { data: null, error };
        }
      },
      async then(resolve: any) {
        try {
          console.log(`🔧 Mock Insert: INSERT INTO ${table}`, data);
          const result = { id: Math.floor(Math.random() * 1000), ...data };
          return resolve({ data: result, error: null });
        } catch (error) {
          return resolve({ data: null, error });
        }
      }
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        async select(columns = '*') {
          try {
            console.log(`🔧 Mock Update: UPDATE ${table} SET ${JSON.stringify(data)} WHERE ${column} = ${value}`);
            const result = await db.update(table, data, { [column]: value });
            return { data: result, error: null };
          } catch (error) {
            return { data: null, error };
          }
        },
        async then(resolve: any) {
          try {
            console.log(`🔧 Mock Update: UPDATE ${table} SET ${JSON.stringify(data)} WHERE ${column} = ${value}`);
            return resolve({ data: { ...data, [column]: value }, error: null });
          } catch (error) {
            return resolve({ data: null, error });
          }
        }
      })
    }),
    delete: () => ({
      eq: (column: string, value: any) => ({
        async then(resolve: any) {
          try {
            console.log(`🔧 Mock Delete: DELETE FROM ${table} WHERE ${column} = ${value}`);
            return resolve({ data: null, error: null });
          } catch (error) {
            return resolve({ data: null, error });
          }
        }
      })
    }),
    upsert: (data: any) => ({
      async select(columns = '*') {
        try {
          console.log(`🔧 Mock Upsert: UPSERT INTO ${table}`, data);
          const result = { id: Math.floor(Math.random() * 1000), ...data };
          return { data: result, error: null };
        } catch (error) {
          return { data: null, error };
        }
      },
      async then(resolve: any) {
        try {
          console.log(`🔧 Mock Upsert: UPSERT INTO ${table}`, data);
          const result = { id: Math.floor(Math.random() * 1000), ...data };
          return resolve({ data: result, error: null });
        } catch (error) {
          return resolve({ data: null, error });
        }
      }
    })
  }),
  
  // Auth operations compatibility
  auth: {
    signUp: async (options: { email: string; password: string; options?: any }) => {
      try {
        console.log('🔧 Mock Auth: Sign up attempt', options.email);
        const userData = options.options?.data || {};
        const result = await auth.signUp(options.email, options.password, userData);
        return { data: result.data, error: result.success ? null : new Error(result.error) };
      } catch (error) {
        return { data: null, error };
      }
    },
    
    signInWithPassword: async (options: { email: string; password: string }) => {
      try {
        console.log('🔧 Mock Auth: Sign in attempt', options.email);
        const result = await auth.signInWithPassword(options.email, options.password);
        return { data: result.data, error: result.success ? null : new Error(result.error) };
      } catch (error) {
        return { data: null, error };
      }
    },
    
    signOut: async () => {
      try {
        console.log('🔧 Mock Auth: Sign out');
        await auth.signOut();
        return { error: null };
      } catch (error) {
        return { error };
      }
    },
    
    resetPasswordForEmail: async (email: string) => {
      console.log('🔧 Mock Auth: Password reset for', email);
      return { data: null, error: null };
    },
    
    getUser: async () => {
      console.log('🔧 Mock Auth: Get user');
      return { 
        data: { 
          user: { 
            id: 'mock-user', 
            email: 'demo@example.com' 
          } 
        }, 
        error: null 
      };
    },
    
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      console.log('🔧 Mock Auth: Setting up auth state change listener');
      // Simulate successful auth state
      setTimeout(() => {
        callback('SIGNED_IN', { user: { id: 'mock-user', email: 'demo@example.com' } });
      }, 100);
      
      return {
        data: {
          subscription: {
            unsubscribe: () => console.log('🔧 Mock Auth: Auth state change unsubscribed')
          }
        }
      };
    }
  },
  
  // Storage operations (mock)
  storage: {
    from: (bucket: string) => ({
      upload: async (path: string, file: any) => {
        console.log(`🔧 Mock Storage: Upload to ${bucket}/${path}`);
        return { data: { path }, error: null };
      },
      createSignedUrl: async (path: string, expiresIn: number) => {
        console.log(`🔧 Mock Storage: Create signed URL for ${path}`);
        return { data: { signedUrl: `https://mock-storage.com/${path}` }, error: null };
      }
    })
  },
  
  // Functions (mock)
  functions: {
    invoke: async (functionName: string, options: any) => {
      console.log(`🔧 Mock Function: Invoke ${functionName}`, options);
      return { data: { success: true }, error: null };
    }
  }
};