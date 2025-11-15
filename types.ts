
export interface Lecture {
  level: string;
  subject: string;
  title: string;
  url: string; // Direct content URL (e.g., .mp4, .pdf)
  category: string; // e.g., 'Lectures', 'Material'
  instructor: string; // Added for instructor filtering
}
