import type { UserReadingProgressRow } from "@/types/index";
import { supabase } from "./client";
import { USER_READING_PROGRESS_TABLE } from "./constants";

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
