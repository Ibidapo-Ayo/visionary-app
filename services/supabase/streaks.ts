import type { StreakRecord } from "@/types/index";
import { supabase } from "./client";
import { STREAKS_TABLE } from "./constants";

const STREAK_COLUMNS = "id, user_id, current_streak, longest_streak, last_read_date, total_days_completed, created_at, updated_at";

/** Returns today's date as YYYY-MM-DD, matching the `streaks.last_read_date` column type. */
const toDateOnly = (date: Date): string => date.toISOString().slice(0, 10);

const getTodayDateOnly = (): string => toDateOnly(new Date());

const getYesterdayDateOnly = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return toDateOnly(yesterday);
};

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

/**
 * Call whenever the app loads streak data. Reads the row directly from the `streaks`
 * table and, if `last_read_date` is more than 1 day old, resets `current_streak` to 0
 * in the database before returning the row.
 */
export const syncStreakStatus = async (userId: string): Promise<StreakRecord | null> => {
  const existing = await getStreakForUser(userId);
  if (!existing) {
    return null;
  }

  const today = getTodayDateOnly();
  const yesterday = getYesterdayDateOnly();

  if (existing.current_streak === 0 || existing.last_read_date === today || existing.last_read_date === yesterday) {
    return existing;
  }

  const response = await supabase
    .from(STREAKS_TABLE)
    .update({ current_streak: 0 })
    .eq("user_id", userId)
    .select(STREAK_COLUMNS)
    .maybeSingle<StreakRecord>();

  if (response.error) {
    throw response.error;
  }

  return response.data ?? existing;
};

/**
 * Call once a user finishes both the morning and evening reading for today.
 * Reads the current row from `streaks`, computes the updated values in the
 * client, and writes them back with insert/update against `user_id` — no
 * database migrations or stored procedures involved. Same-day calls are
 * idempotent: if `last_read_date` is already today, the existing row is returned.
 */
export const completeReadingDay = async (userId: string): Promise<StreakRecord> => {
  const existing = await getStreakForUser(userId);
  const today = getTodayDateOnly();

  if (existing?.last_read_date === today) {
    return existing;
  }

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

  const yesterday = getYesterdayDateOnly();
  const nextCurrentStreak = existing.last_read_date === yesterday ? existing.current_streak + 1 : 1;

  const response = await supabase
    .from(STREAKS_TABLE)
    .update({
      current_streak: nextCurrentStreak,
      longest_streak: Math.max(existing.longest_streak, nextCurrentStreak),
      last_read_date: today,
      total_days_completed: existing.total_days_completed + 1,
    })
    .eq("user_id", userId)
    .select(STREAK_COLUMNS)
    .single<StreakRecord>();

  if (response.error) {
    throw response.error;
  }

  return response.data;
};

