export interface iNotification {
  id?: string;
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  is_dismissable?: boolean;
}

export class Notification implements iNotification {
  id?: string;
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  is_dismissable?: boolean;
}
