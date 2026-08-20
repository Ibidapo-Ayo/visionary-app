export interface BibleVerse {
  book_id: string;
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface BibleChapterResponse {
  reference: string;
  verses: BibleVerse[];
  text: string;
  translation_id: string;
  translation_name: string;
  translation_note: string;
}

const BIBLE_API_BASE_URL = 'https://bible-api.com';

const formatBookNameForBibleApi = (bookName: string) =>
  bookName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .join('+');

export const fetchBibleChapter = async (bookName: string, chapter: number): Promise<BibleChapterResponse> => {
  const formattedBookName = formatBookNameForBibleApi(bookName);

  if (!formattedBookName || !Number.isInteger(chapter) || chapter < 1) {
    throw new Error('Invalid Bible chapter request.');
  }

  const response = await fetch(`${BIBLE_API_BASE_URL}/${formattedBookName}+${chapter}`);

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(errorText || `Unable to fetch ${bookName} ${chapter}.`);
  }

  return (await response.json()) as BibleChapterResponse;
};
