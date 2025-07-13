/**
 * Convert a string to a URL-friendly slug
 * Handles Turkish characters properly
 * 
 * @param text The text to slugify
 * @returns A URL-friendly slug
 */
export function slugify(text: string): string {
  if (!text) return '';
  
  // Turkish character mapping
  const turkishMap: { [key: string]: string } = {
    ç: "c", Ç: "C", ğ: "g", Ğ: "G", ı: "i", İ: "I",
    ö: "o", Ö: "O", ş: "s", Ş: "S", ü: "u", Ü: "U",
  };

  // Replace Turkish characters
  let result = text.toString();
  for (const [turkishChar, latinChar] of Object.entries(turkishMap)) {
    result = result.replace(new RegExp(turkishChar, "g"), latinChar);
  }

  return result
    .toLowerCase()
    .replace(/\s+/g, "-")        // Replace spaces with -
    .replace(/[^\w\-]+/g, "")    // Remove all non-word chars
    .replace(/\-\-+/g, "-")      // Replace multiple - with single -
    .replace(/^-+/, "")          // Trim - from start of text
    .replace(/-+$/, "");         // Trim - from end of text
} 