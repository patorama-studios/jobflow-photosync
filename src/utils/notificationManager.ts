
type NotificationType = 'email' | 'sms' | 'push';
type NotificationEvent = 
  | 'appointment_assigned'
  | 'appointment_canceled'
  | 'appointment_postponed'
  | 'appointment_reminder'
  | 'appointment_rescheduled'
  | 'appointment_scheduled'
  | 'appointment_summary'
  | 'appointment_unassigned'
  | 'customer_team_invitation'
  | 'order_payment_processed'
  | 'order_received'
  | 'team_member_invitation';

interface NotificationPreference {
  type: NotificationType;
  enabled: boolean;
}

interface UserNotificationPreferences {
  [key: string]: { // user ID
    [key in NotificationEvent]: {
      [key in NotificationType]: boolean;
    };
  };
}

// Mock preferences - in a real app, this would come from the database
const mockPreferences: UserNotificationPreferences = {
  'default': {
    appointment_assigned: { email: true, sms: false, push: true },
    appointment_canceled: { email: true, sms: true, push: true },
    appointment_postponed: { email: true, sms: true, push: true },
    appointment_reminder: { email: true, sms: true, push: true },
    appointment_rescheduled: { email: true, sms: true, push: true },
    appointment_scheduled: { email: true, sms: false, push: true },
    appointment_summary: { email: true, sms: false, push: true },
    appointment_unassigned: { email: true, sms: false, push: true },
    customer_team_invitation: { email: true, sms: false, push: false },
    order_payment_processed: { email: true, sms: false, push: true },
    order_received: { email: true, sms: false, push: true },
    team_member_invitation: { email: true, sms: false, push: false },
  }
};

export const notificationManager = {
  /**
   * Send a notification based on user preferences
   */
  sendNotification: async (
    userId: string,
    event: NotificationEvent,
    data: any
  ): Promise<boolean> => {
    // Get user preferences, or use default if not found
    const userPreferences = mockPreferences[userId] || mockPreferences.default;
    
    if (!userPreferences) {
      console.error(`No notification preferences found for user ${userId}`);
      return false;
    }
    
    const eventPreferences = userPreferences[event];
    
    if (!eventPreferences) {
      console.error(`No preferences found for event ${event}`);
      return false;
    }
    
    // Send notifications based on preferences
    const promises: Promise<boolean>[] = [];
    
    if (eventPreferences.email) {
      promises.push(notificationManager.sendEmail(event, data));
    }
    
    if (eventPreferences.sms) {
      promises.push(notificationManager.sendSMS(event, data));
    }
    
    if (eventPreferences.push) {
      promises.push(notificationManager.sendPushNotification(event, data));
    }
    
    // Wait for all notifications to be sent
    const results = await Promise.all(promises);
    
    // Return true if at least one notification was sent successfully
    return results.some(result => result);
  },
  
  /**
   * Send an email notification
   */
  sendEmail: async (event: NotificationEvent, data: any): Promise<boolean> => {
    // In a real app, this would call an API to send an email
    console.log(`[EMAIL] Sending ${event} notification:`, data);
    return true;
  },
  
  /**
   * Send an SMS notification
   */
  sendSMS: async (event: NotificationEvent, data: any): Promise<boolean> => {
    // In a real app, this would call an API to send an SMS
    console.log(`[SMS] Sending ${event} notification:`, data);
    return true;
  },
  
  /**
   * Send a push notification
   */
  sendPushNotification: async (event: NotificationEvent, data: any): Promise<boolean> => {
    // In a real app, this would call an API to send a push notification
    console.log(`[PUSH] Sending ${event} notification:`, data);
    return true;
  },
  
  /**
   * Notify a client about a rescheduled appointment
   */
  notifyClientAboutReschedule: async (
    clientEmail: string,
    clientName: string,
    oldDateTime: string,
    newDateTime: string,
    address: string
  ): Promise<boolean> => {
    // In a real app, this would call the appropriate notification service
    console.log(`Notifying ${clientName} (${clientEmail}) about rescheduled appointment:`, {
      oldDateTime,
      newDateTime,
      address
    });
    
    return true;
  }
};
