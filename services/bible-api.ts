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
const BIBLE_API_TIMEOUT_MS = 12000;

const hasText = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;

const isBibleVerse = (value: unknown): value is BibleVerse => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const verse = value as Record<string, unknown>;
  return (
    hasText(verse.book_id) &&
    hasText(verse.book_name) &&
    Number.isInteger(verse.chapter) &&
    Number.isInteger(verse.verse) &&
    hasText(verse.text)
  );
};

const isBibleChapterResponse = (value: unknown): value is BibleChapterResponse => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const payload = value as Record<string, unknown>;
  const verses = payload.verses;

  return (
    hasText(payload.reference) &&
    hasText(payload.text) &&
    hasText(payload.translation_id) &&
    hasText(payload.translation_name) &&
    hasText(payload.translation_note) &&
    Array.isArray(verses) &&
    verses.length > 0 &&
    verses.every((verse) => isBibleVerse(verse))
  );
};

const createRequestSignal = (timeoutMs: number) => {
  const supportsTimeout =
    typeof AbortSignal !== 'undefined' &&
    typeof (AbortSignal as { timeout?: (ms: number) => AbortSignal }).timeout === 'function';

  if (supportsTimeout) {
    return {
      signal: (AbortSignal as { timeout: (ms: number) => AbortSignal }).timeout(timeoutMs),
      cleanup: () => {},
    };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  return {
    signal: controller.signal,
    cleanup: () => clearTimeout(timer),
  };
};

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

  const { signal, cleanup } = createRequestSignal(BIBLE_API_TIMEOUT_MS);

  let response: Response;

  try {
    response = await fetch(`${BIBLE_API_BASE_URL}/${formattedBookName}+${chapter}`, { signal });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (error instanceof Error && (error.name === 'AbortError' || /aborted|timed?\s*out/i.test(message))) {
      throw new Error(`Request timed out while fetching ${bookName} ${chapter}.`);
    }

    throw error;
  } finally {
    cleanup();
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(errorText || `Unable to fetch ${bookName} ${chapter}.`);
  }

  const payload = await response.json().catch(() => null);
  if (!payload || typeof payload !== 'object') {
    throw new Error(`Unable to fetch ${bookName} ${chapter}.`);
  }

  const payloadError = (payload as { error?: unknown }).error;
  if (hasText(payloadError)) {
    throw new Error(payloadError);
  }

  if (!isBibleChapterResponse(payload)) {
    throw new Error(`Unable to fetch ${bookName} ${chapter}.`);
  }

  return payload;
};
