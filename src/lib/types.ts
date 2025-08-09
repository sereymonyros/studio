
export interface Activity {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  website?: string;
  address?: string;
  phoneNumber?: string;
  imageUrls?: string[]; // Add this line
}

export interface Suggestion {
  name: string;
  description: string;
}
