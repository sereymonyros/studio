export interface Activity {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  website?: string;
  address?: string;
  imageUrl?: string;
}

export interface Suggestion {
  name: string;
  description: string;
}
