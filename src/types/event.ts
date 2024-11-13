export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  type: 'text' | 'image' | 'video';
  color: string;
  mediaUrl?: string;
  notified?: boolean;
  snoozedUntil?: Date;
}

export interface EventFormData {
  title: string;
  description: string;
  date: Date;
  time: string;
  type: 'text' | 'image' | 'video';
  color: string;
  mediaUrl?: string;
}