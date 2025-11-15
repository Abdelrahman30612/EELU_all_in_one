import type { Lecture } from '../types';

/**
 * Fetches data from a published Google Sheet CSV URL and parses it.
 * @param url The public CSV URL of the Google Sheet.
 * @returns A promise that resolves to an array of Lecture objects.
 */
export const fetchAndParseSheet = async (url: string): Promise<Lecture[]> => {
  // Add a cache-busting parameter to ensure the latest data is fetched.
  const fetchUrl = `${url}&_=${new Date().getTime()}`;
  const response = await fetch(fetchUrl);
  if (!response.ok) {
    throw new Error(`فشلت استجابة الشبكة: ${response.statusText}`);
  }
  const text = await response.text();
  return parseCSV(text);
};

/**
 * Parses a CSV string into an array of Lecture objects.
 * This parser handles six columns and trims quotes.
 * It skips the header row and any empty lines.
 * @param csvText The CSV data as a string.
 * @returns An array of Lecture objects.
 */
const parseCSV = (csvText: string): Lecture[] => {
  const lines = csvText.trim().split(/\r?\n/);

  // Helper to trim quotes from a string, e.g., "value" -> value
  const trimQuotes = (str: string): string => {
    return str.startsWith('"') && str.endsWith('"') ? str.slice(1, -1).replace(/""/g, '"') : str;
  };

  const lectures: Lecture[] = [];
  // Start from the second line (index 1) to skip the header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue; // Skip empty lines

    // Basic CSV parsing for up to 6 columns.
    const parts: string[] = [];
    let currentPart = '';
    let inQuotes = false;
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        if (inQuotes && line[j + 1] === '"') {
          currentPart += '"'; // Escaped quote
          j++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        parts.push(currentPart);
        currentPart = '';
      } else {
        currentPart += char;
      }
    }
    parts.push(currentPart);

    if (parts.length >= 5) {
      // Order from sheet: Subject, Title, URL, Level, Category, Instructor
      const [subject, title, url, level, category] = parts.slice(0, 5).map(p => trimQuotes(p.trim()));
      // Instructor is optional, in the 6th column
      const instructor = parts.length > 5 ? trimQuotes(parts[5].trim()) : 'غير محدد';
      
      if (level && subject && title && url && category) {
          lectures.push({ level, subject, title, url, category, instructor });
      }
    }
  }

  return lectures;
};
