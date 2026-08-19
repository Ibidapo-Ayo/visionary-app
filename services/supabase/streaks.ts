import type { StreakRecord } from "@/types/index";
import { supabase } from "./client";
import { STREAKS_TABLE } from "./constants";

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

/**
 * Call once a user finishes both the morning and evening reading for today.
 * Uses a single database function so insert/update logic is atomic and
 * same-day calls stay idempotent under concurrent requests.
 */
export const completeReadingDay = async (userId: string): Promise<StreakRecord> => {
  const response = await supabase.rpc("complete_reading_day_atomic", {
    p_user_id: userId,
  });

  if (response.error) {
    throw response.error;
  }

  const streak = Array.isArray(response.data) ? response.data[0] : response.data;
  if (!streak) {
    throw new Error("[supabase] complete_reading_day_atomic returned no streak row.");
  }

  return streak as StreakRecord;
};

