import { useQuery } from '@tanstack/react-query';
import { fetchBibleChapter } from '@/services/bible-api';

export const useBibleChapter = (bookName: string | null, chapter: number | null) =>
  useQuery({
    queryKey: ['bible-chapter', bookName, chapter],
    queryFn: () => {
      if (!bookName || chapter == null) {
        throw new Error('Bible chapter query requires a book name and chapter.');
      }

      return fetchBibleChapter(bookName, chapter);
    },
    enabled: !!bookName && chapter != null,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
