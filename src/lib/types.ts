export interface Activity {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  address?: string;
  website?: string;
}

export interface Suggestion {
  name: string;
  description: string;
}
