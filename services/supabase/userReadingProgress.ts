import type { CompletedScheduleDay, UserReadingProgressRow } from "@/types/index";
import { supabase } from "./client";
import { READING_SCHEDULE_TABLE, USER_READING_PROGRESS_TABLE } from "./constants";

type UpsertUserReadingProgressInput = {
  userId: string;
  scheduleId: string;
};

export const getCompletedUserReadingProgress = async (
  userId: string,
): Promise<UserReadingProgressRow[]> => {
  const response = await supabase
    .from(USER_READING_PROGRESS_TABLE)
    .select("id, user_id, schedule_id, completed, completed_at")
    .eq("user_id", userId)
    .eq("completed", true);

  if (response.error) {
    throw response.error;
  }

  return (response.data ?? []) as UserReadingProgressRow[];
};

/** Joins the user's completed schedule_ids against reading_schedule to resolve each chapter's plan day number. */
export const getCompletedScheduleDaysForUser = async (
  userId: string,
): Promise<CompletedScheduleDay[]> => {
  const completedProgress = await getCompletedUserReadingProgress(userId);
  const scheduleIds = Array.from(new Set(completedProgress.map((row) => row.schedule_id)));

  if (!scheduleIds.length) {
    return [];
  }

  const scheduleResponse = await supabase
    .from(READING_SCHEDULE_TABLE)
    .select("id, day_number")
    .in("id", scheduleIds);

  if (scheduleResponse.error) {
    throw scheduleResponse.error;
  }

  const dayNumberByScheduleId = new Map(
    ((scheduleResponse.data ?? []) as { id: string; day_number: number }[]).map((row) => [row.id, row.day_number]),
  );

  return completedProgress
    .map((row) => {
      const dayNumber = dayNumberByScheduleId.get(row.schedule_id);
      return dayNumber !== undefined ? { scheduleId: row.schedule_id, dayNumber } : null;
    })
    .filter((entry): entry is CompletedScheduleDay => entry !== null);
};

export const upsertUserReadingProgress = async ({
  userId,
  scheduleId,
}: UpsertUserReadingProgressInput): Promise<UserReadingProgressRow> => {
  const response = await supabase
    .from(USER_READING_PROGRESS_TABLE)
    .upsert(
      {
        user_id: userId,
        schedule_id: scheduleId,
        completed: true,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,schedule_id" },
    )
    .select("id, user_id, schedule_id, completed, completed_at")
    .single();

  if (response.error) {
    throw response.error;
  }

  return response.data as UserReadingProgressRow;
};
