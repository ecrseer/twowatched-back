export function randomId() {
  return Math.random().toString(36).substring(2);
}
export interface iNotification {
  title: string;
  description: string;
  type: string;
}
