
export interface Activity {
  id: string;
  title: string;
  title_km?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  website?: string;
  websiteText?: string; // Add this line
  address?: string;
  youtubeUrl?: string; // Add this line
  imageUrls?: string[]; // Add this line
}

export interface Suggestion {
  name: string;
  description: string;
}
