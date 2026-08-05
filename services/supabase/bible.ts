import type { BibleReadingPlanData } from "@/types";
import { supabase } from "./client";
import { BIBLE_READING_PLAN_TABLE } from "./constants";

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
