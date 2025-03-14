
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  time: string;
  link?: string;
  text?: string;
  details?: string;
  date?: string;
  category?: string;
}
