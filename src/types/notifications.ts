
export interface Notification {
  id: number;
  text: string;
  read: boolean;
  time: string;
  date: string;
  category: 'order' | 'payment' | 'system' | 'delivery';
  link?: string;
  details?: string;
}
