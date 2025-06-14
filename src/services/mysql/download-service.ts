import { DownloadSettings } from '@/hooks/types/user-settings-types';

// Simulated MySQL database storage using localStorage for persistence
class DownloadService {
  private getStorageKey(userId: string): string {
    return `mysql_download_settings_${userId}`;
  }

  private getDefaultSettings(): DownloadSettings {
    return {
      automaticDownloads: false,
      downloadPath: "/Downloads/Photorama",
      qualityPreference: "high",
      organizationMethod: "date",
      maxDimension: 2000,
      imageQuality: 85,
      dpi: "300",
      fileNaming: "original"
    };
  }

  async getDownloadSettings(userId: string): Promise<DownloadSettings> {
    try {
      console.log('🔧 DownloadService: Fetching settings from MySQL for user:', userId);
      
      const stored = localStorage.getItem(this.getStorageKey(userId));
      if (stored) {
        const settings = JSON.parse(stored);
        console.log('🔧 DownloadService: Found stored settings:', settings);
        return settings;
      }
      
      console.log('🔧 DownloadService: No stored settings, creating defaults');
      const defaultSettings = this.getDefaultSettings();
      await this.saveDownloadSettings(userId, defaultSettings);
      return defaultSettings;
    } catch (error) {
      console.error('🔧 DownloadService: Error fetching settings:', error);
      return this.getDefaultSettings();
    }
  }

  async saveDownloadSettings(userId: string, settings: DownloadSettings): Promise<boolean> {
    try {
      console.log('🔧 DownloadService: Saving settings to MySQL:', { userId, settings });
      
      // Simulate database save with a delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      localStorage.setItem(this.getStorageKey(userId), JSON.stringify(settings));
      
      console.log('🔧 DownloadService: Settings saved successfully');
      return true;
    } catch (error) {
      console.error('🔧 DownloadService: Error saving settings:', error);
      return false;
    }
  }

  async updateDownloadSettings(userId: string, updates: Partial<DownloadSettings>): Promise<DownloadSettings | null> {
    try {
      console.log('🔧 DownloadService: Updating settings in MySQL:', { userId, updates });
      
      const currentSettings = await this.getDownloadSettings(userId);
      const updatedSettings = {
        ...currentSettings,
        ...updates
      };

      const success = await this.saveDownloadSettings(userId, updatedSettings);
      if (success) {
        return updatedSettings;
      }
      
      return null;
    } catch (error) {
      console.error('🔧 DownloadService: Error updating settings:', error);
      return null;
    }
  }
}

export const downloadService = new DownloadService();