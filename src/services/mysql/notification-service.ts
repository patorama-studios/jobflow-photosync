import { NotificationSetting } from '@/hooks/types/user-settings-types';

// Simulated MySQL database storage using localStorage for persistence
class NotificationService {
  private getStorageKey(userId: string): string {
    return `mysql_notification_settings_${userId}`;
  }

  private getDefaultSettings(): NotificationSetting[] {
    const notificationTypes = [
      "Order Created", 
      "Order Status Change",
      "Order Assigned",
      "Payment Received", 
      "Client Message",
      "System Alert"
    ];

    return notificationTypes.map((type, index) => ({
      id: `notification-${index}`,
      name: type,
      description: `Notification for when a ${type.toLowerCase()} occurs`,
      enabled: true,
      type: type,
      channels: {
        email: type === "Order Created" || type === "Payment Received", // Enable some by default
        sms: false,
        push: type === "System Alert" // Enable push for critical alerts
      }
    }));
  }

  async getNotificationSettings(userId: string): Promise<NotificationSetting[]> {
    try {
      console.log('🔧 NotificationService: Fetching settings from MySQL for user:', userId);
      
      const stored = localStorage.getItem(this.getStorageKey(userId));
      if (stored) {
        const settings = JSON.parse(stored);
        console.log('🔧 NotificationService: Found stored settings:', settings.length);
        return settings;
      }
      
      console.log('🔧 NotificationService: No stored settings, creating defaults');
      const defaultSettings = this.getDefaultSettings();
      await this.saveNotificationSettings(userId, defaultSettings);
      return defaultSettings;
    } catch (error) {
      console.error('🔧 NotificationService: Error fetching settings:', error);
      return this.getDefaultSettings();
    }
  }

  async saveNotificationSettings(userId: string, settings: NotificationSetting[]): Promise<boolean> {
    try {
      console.log('🔧 NotificationService: Saving settings to MySQL:', { userId, count: settings.length });
      
      // Simulate database save with a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      localStorage.setItem(this.getStorageKey(userId), JSON.stringify(settings));
      
      console.log('🔧 NotificationService: Settings saved successfully');
      return true;
    } catch (error) {
      console.error('🔧 NotificationService: Error saving settings:', error);
      return false;
    }
  }

  async updateChannelForType(
    userId: string, 
    type: string, 
    channel: 'email' | 'sms' | 'push', 
    enabled: boolean
  ): Promise<NotificationSetting[]> {
    try {
      console.log('🔧 NotificationService: Updating channel setting:', { userId, type, channel, enabled });
      
      const currentSettings = await this.getNotificationSettings(userId);
      const updatedSettings = currentSettings.map(setting => {
        if (setting.type === type) {
          return {
            ...setting,
            channels: {
              ...setting.channels,
              [channel]: enabled
            }
          };
        }
        return setting;
      });

      const success = await this.saveNotificationSettings(userId, updatedSettings);
      if (success) {
        return updatedSettings;
      } else {
        throw new Error('Failed to save notification settings');
      }
    } catch (error) {
      console.error('🔧 NotificationService: Error updating channel:', error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();