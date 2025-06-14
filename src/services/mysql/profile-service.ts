import { UserProfile } from '@/hooks/types/user-settings-types';

// Simulated MySQL database storage using localStorage for persistence
class ProfileService {
  private getStorageKey(userId: string): string {
    return `mysql_profile_${userId}`;
  }

  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      console.log('🔧 ProfileService: Fetching profile from MySQL for user:', userId);
      
      const stored = localStorage.getItem(this.getStorageKey(userId));
      if (stored) {
        const profile = JSON.parse(stored);
        console.log('🔧 ProfileService: Found stored profile:', profile);
        return profile;
      }
      
      console.log('🔧 ProfileService: No stored profile found');
      return null;
    } catch (error) {
      console.error('🔧 ProfileService: Error fetching profile:', error);
      return null;
    }
  }

  async saveProfile(userId: string, profile: UserProfile): Promise<boolean> {
    try {
      console.log('🔧 ProfileService: Saving profile to MySQL:', { userId, profile });
      
      // Simulate database save with a delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      localStorage.setItem(this.getStorageKey(userId), JSON.stringify(profile));
      
      console.log('🔧 ProfileService: Profile saved successfully');
      return true;
    } catch (error) {
      console.error('🔧 ProfileService: Error saving profile:', error);
      return false;
    }
  }

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      console.log('🔧 ProfileService: Updating profile in MySQL:', { userId, updates });
      
      const currentProfile = await this.getProfile(userId);
      if (!currentProfile) {
        console.log('🔧 ProfileService: No existing profile, cannot update');
        return null;
      }

      const updatedProfile = {
        ...currentProfile,
        ...updates,
        updated_at: new Date().toISOString()
      };

      const success = await this.saveProfile(userId, updatedProfile);
      if (success) {
        return updatedProfile;
      }
      
      return null;
    } catch (error) {
      console.error('🔧 ProfileService: Error updating profile:', error);
      return null;
    }
  }
}

export const profileService = new ProfileService();