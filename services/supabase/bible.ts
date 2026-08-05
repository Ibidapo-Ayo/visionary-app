import type { BibleReadingPlanData, DayReading, ReadingScheduleData } from "@/types";
import { supabase } from "./client";
import { BIBLE_BOOKS_TABLE, BIBLE_READING_PLAN_TABLE, READING_SCHEDULE_TABLE } from "./constants";

export const getBibleReadingPlan = async (): Promise<BibleReadingPlanData | null> => {
  try {
    const response = await supabase.from(BIBLE_READING_PLAN_TABLE).select("*");
    if (response.error) {
      throw response.error;
    }

    return (response.data?.[0] as BibleReadingPlanData | undefined) ?? null;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

type ReadingScheduleRow = {
  id: string;
  session: "morning" | "evening";
  order_number: number;
  bible_book_id: number;
  chapter: number;
};

type BibleBookRow = {
  id: number;
  name: string;
  abbreviation: string;
  testament: string;
  total_chapters: number;
};

export const getReadingScheduleByDay = async (
  planId: string,
  dayNumber: number
): Promise<ReadingScheduleData> => {
  try {
    const response = await supabase
      .from(READING_SCHEDULE_TABLE)
      .select("id, session, order_number, bible_book_id, chapter")
      .eq("plan_id", planId)
      .eq("day_number", dayNumber)
      .order("session")
      .order("order_number");

    if (response.error) {
      throw response.error;
    }

    const scheduleRows = (response.data ?? []) as ReadingScheduleRow[];
    const bibleBookIds = Array.from(new Set(scheduleRows.map((row) => row.bible_book_id)));
    const booksResponse = bibleBookIds.length
      ? await supabase
          .from(BIBLE_BOOKS_TABLE)
          .select("id, name, abbreviation, testament, total_chapters")
          .in("id", bibleBookIds)
      : { data: [], error: null };

    if (booksResponse.error) {
      throw booksResponse.error;
    }

    const bibleBooksById = new Map(
      ((booksResponse.data ?? []) as BibleBookRow[]).map((book) => [book.id, book])
    );

    const schedule: ReadingScheduleData = {
      morning: [],
      evening: [],
    };

    scheduleRows.forEach((row) => {
      const bibleBook = bibleBooksById.get(row.bible_book_id);
      const reading: DayReading = {
        id: row.id,
        orderNumber: row.order_number,
        bookName: bibleBook?.name ?? "",
        chapter: row.chapter,
      };

      schedule[row.session].push(reading);
    });

    schedule.morning.sort((firstReading, secondReading) => firstReading.orderNumber - secondReading.orderNumber);
    schedule.evening.sort((firstReading, secondReading) => firstReading.orderNumber - secondReading.orderNumber);

    return schedule;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
