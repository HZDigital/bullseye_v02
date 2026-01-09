import { marked } from "marked";

// Function to convert markdown to HTML
export const markdownToHtml = (markdown: string): string => {
  if (!markdown || typeof markdown !== 'string') return '';
  return marked.parse(markdown, {async: false});
};

// Function to check if a string is likely markdown
export const isMarkdown = (text: string): boolean => {
  if (!text || typeof text !== 'string') return false;
  // Check for common markdown syntax
  return /(\*\*|__|##|>\s|\[.*\]\(.*\)|!\[.*\]\(.*\)|```|-\s|\*\s|\d\.\s)/.test(text);
};