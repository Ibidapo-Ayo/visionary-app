import type { CompletedScheduleDay, UserReadingProgressRow } from "@/types/index";
import { supabase } from "./client";
import { READING_SCHEDULE_TABLE, USER_READING_PROGRESS_TABLE } from "./constants";

type UpsertUserReadingProgressInput = {
  userId: string;
  scheduleId: string;
};

export const getScheduleDayMetadata = async (
  scheduleId: string,
): Promise<{ dayNumber: number; session: CompletedScheduleDay['session'] }> => {
  const response = await supabase
    .from(READING_SCHEDULE_TABLE)
    .select('day_number, session')
    .eq('id', scheduleId)
    .single();

  if (response.error) {
    throw response.error;
  }

  return {
    dayNumber: response.data.day_number,
    session: response.data.session,
  };
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
  const response = await supabase
    .from(USER_READING_PROGRESS_TABLE)
    .select(`schedule_id, ${READING_SCHEDULE_TABLE}!inner(day_number, session)`)
    .eq("user_id", userId)
    .eq("completed", true);

  if (response.error) {
    throw response.error;
  }

  return (response.data ?? []).map((row): CompletedScheduleDay => {
    const typedRow = row as { schedule_id: string } & Record<string, unknown>;
    const schedule = typedRow[READING_SCHEDULE_TABLE] as { day_number: number; session: CompletedScheduleDay['session'] };

    return {
      scheduleId: typedRow.schedule_id,
      dayNumber: schedule.day_number,
      session: schedule.session,
    };
  });
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
