
import { db } from '@/integrations/mysql/mock-client';

/**
 * Service for user profile operations
 */
export const profileService = {
  /**
   * Get user profile by ID
   */
  getProfile: async (userId: string) => {
    try {
      if (!userId) throw new Error('User ID is required');
      
      console.log('Fetching profile for user ID:', userId);
      
      const profile = await db.queryOne(
        'SELECT id, email, full_name, username, phone, avatar_url, role, created_at, updated_at, email_verified FROM profiles WHERE id = ?',
        [userId]
      );
      
      console.log('Profile data:', profile);
      return profile;
    } catch (error: any) {
      console.error('Error in getProfile:', error.message);
      return null;
    }
  },
  
  /**
   * Update user profile
   */
  updateProfile: async (userId: string, updates: { 
    full_name?: string; 
    username?: string; 
    phone?: string;
    avatar_url?: string;
    role?: string;
  }) => {
    try {
      if (!userId) throw new Error('User ID is required');
      
      console.log('Updating profile for user ID:', userId, 'with data:', updates);
      
      // Check if profile exists
      const existingProfile = await db.queryOne(
        'SELECT id FROM profiles WHERE id = ?',
        [userId]
      );
      
      if (existingProfile) {
        // Update existing profile
        console.log('Updating existing profile');
        const updateData = {
          ...updates,
          updated_at: new Date()
        };
        
        await db.update('profiles', updateData, { id: userId });
      } else {
        // Create new profile
        console.log('Creating new profile');
        const insertData = {
          id: userId,
          ...updates,
          created_at: new Date(),
          updated_at: new Date(),
          email_verified: false
        };
        
        await db.insert('profiles', insertData);
      }
      
      return true;
    } catch (error: any) {
      console.error('Error in updateProfile:', error.message);
      return false;
    }
  }
};
