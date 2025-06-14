import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from './client';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.VITE_JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '24h';

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

class AuthService {
  /**
   * Generate JWT token
   */
  private generateToken(user: User): string {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        full_name: user.full_name 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  /**
   * Verify JWT token
   */
  async verifyToken(token: string): Promise<any> {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  /**
   * Hash password
   */
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Verify password
   */
  private async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * Register a new user
   */
  async signUp(email: string, password: string, userData: {
    firstName?: string;
    lastName?: string;
    fullName?: string;
  }): Promise<AuthResult> {
    try {
      // Check if user already exists
      const existingUser = await db.queryOne<User>(
        'SELECT * FROM profiles WHERE email = ?',
        [email]
      );

      if (existingUser) {
        return {
          success: false,
          error: 'User already exists with this email'
        };
      }

      // Hash password
      const hashedPassword = await this.hashPassword(password);
      const userId = uuidv4();
      const fullName = userData.fullName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim();

      // Create user
      await db.insert('profiles', {
        id: userId,
        email: email,
        password_hash: hashedPassword,
        full_name: fullName,
        email_verified: false,
        created_at: new Date(),
        updated_at: new Date()
      });

      // Get the created user
      const user = await db.queryOne<User>(
        'SELECT id, email, full_name, created_at, updated_at, email_verified FROM profiles WHERE id = ?',
        [userId]
      );

      if (!user) {
        return {
          success: false,
          error: 'Failed to create user'
        };
      }

      // Generate token
      const token = this.generateToken(user);

      return {
        success: true,
        data: {
          user,
          session: {
            access_token: token,
            token_type: 'bearer',
            expires_in: 86400, // 24 hours in seconds
            user
          }
        }
      };
    } catch (error: any) {
      console.error('Error in signUp:', error);
      return {
        success: false,
        error: error.message || 'Registration failed'
      };
    }
  }

  /**
   * Sign in with email and password
   */
  async signInWithPassword(email: string, password: string): Promise<AuthResult> {
    try {
      // Get user with password hash
      const user = await db.queryOne<User & { password_hash: string }>(
        'SELECT * FROM profiles WHERE email = ?',
        [email]
      );

      if (!user) {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }

      // Verify password
      const isValidPassword = await this.verifyPassword(password, user.password_hash);
      if (!isValidPassword) {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }

      // Update last login
      await db.update('profiles', 
        { updated_at: new Date() },
        { id: user.id }
      );

      // Remove password hash from user object
      const { password_hash, ...userWithoutPassword } = user;

      // Generate token
      const token = this.generateToken(userWithoutPassword);

      return {
        success: true,
        data: {
          user: userWithoutPassword,
          session: {
            access_token: token,
            token_type: 'bearer',
            expires_in: 86400, // 24 hours in seconds
            user: userWithoutPassword
          }
        }
      };
    } catch (error: any) {
      console.error('Error in signInWithPassword:', error);
      return {
        success: false,
        error: error.message || 'Login failed'
      };
    }
  }

  /**
   * Get user by token
   */
  async getUser(token: string): Promise<User | null> {
    try {
      const decoded = await this.verifyToken(token);
      const user = await db.queryOne<User>(
        'SELECT id, email, full_name, created_at, updated_at, email_verified FROM profiles WHERE id = ?',
        [decoded.id]
      );
      return user;
    } catch (error) {
      return null;
    }
  }

  /**
   * Sign out (client-side token removal)
   */
  async signOut(): Promise<{ success: boolean }> {
    // Since we're using JWT tokens, sign out is mainly handled on the client side
    // by removing the token from storage
    return { success: true };
  }

  /**
   * Request password reset
   */
  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const user = await db.queryOne<User>(
        'SELECT * FROM profiles WHERE email = ?',
        [email]
      );

      if (!user) {
        // Don't reveal if email exists for security
        return { success: true };
      }

      // In a real application, you would:
      // 1. Generate a reset token
      // 2. Store it in the database with expiration
      // 3. Send an email with the reset link
      
      console.log('Password reset requested for:', email);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Password reset failed'
      };
    }
  }
}

export const auth = new AuthService();