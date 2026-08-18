import type { StreakRecord } from "@/types/index";
import { supabase } from "./client";
import { STREAKS_TABLE } from "./constants";
import { toDateKey } from "@/lib/helper";

const STREAK_COLUMNS = "id, user_id, current_streak, longest_streak, last_read_date, total_days_completed, created_at, updated_at";

export const getStreakForUser = async (userId: string): Promise<StreakRecord | null> => {
  const response = await supabase
    .from(STREAKS_TABLE)
    .select(STREAK_COLUMNS)
    .eq("user_id", userId)
    .maybeSingle<StreakRecord>();

  if (response.error) {
    throw response.error;
  }

  return response.data;
};

const daysBetween = (fromDateKey: string, toDateKeyValue: string) => {
  const from = new Date(`${fromDateKey}T00:00:00`);
  const to = new Date(`${toDateKeyValue}T00:00:00`);
  return Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
};

/**
 * Call once a user finishes both the morning and evening reading for today.
 * Reads the existing streak row, applies the streak rules, and writes the result
 * straight to the `streaks` table — safe to call more than once per day since
 * `last_read_date` guards against counting the same day twice.
 */
export const completeReadingDay = async (userId: string): Promise<StreakRecord> => {
  const today = toDateKey(new Date());
  const existing = await getStreakForUser(userId);

  if (!existing) {
    const response = await supabase
      .from(STREAKS_TABLE)
      .insert({
        user_id: userId,
        current_streak: 1,
        longest_streak: 1,
        last_read_date: today,
        total_days_completed: 1,
      })
      .select(STREAK_COLUMNS)
      .single<StreakRecord>();

    if (response.error) {
      throw response.error;
    }

    return response.data;
  }

  if (existing.last_read_date === today) {
    return existing;
  }

  const isConsecutiveDay = existing.last_read_date ? daysBetween(existing.last_read_date, today) === 1 : false;
  const currentStreak = isConsecutiveDay ? existing.current_streak + 1 : 1;
  const longestStreak = Math.max(existing.longest_streak, currentStreak);

  const response = await supabase
    .from(STREAKS_TABLE)
    .update({
      current_streak: currentStreak,
      longest_streak: longestStreak,
      last_read_date: today,
      total_days_completed: existing.total_days_completed + 1,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .select(STREAK_COLUMNS)
    .single<StreakRecord>();

  if (response.error) {
    throw response.error;
  }

  return response.data;
};

