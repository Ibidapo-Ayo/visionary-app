import { create } from "zustand";
import type { BibleReadingPlanData } from "@/types";
import { getBibleReadingDayNumber } from "@/lib/helper";
import { getBibleReadingPlan } from "@/services/supabase/bible";

const getPlanDayNumber = (plan: BibleReadingPlanData | null) => {
  if (!plan?.group_plan_start_date) {
    return null;
  }

  const dayNumber = getBibleReadingDayNumber(plan.group_plan_start_date);

  if (dayNumber === null) {
    return null;
  }

  // Clamp to the plan's actual day range so we never query a day that has no schedule rows.
  return Math.min(Math.max(dayNumber, 1), plan.total_days);
};

export const useBibleReadingPlanStore = create<{
  bibleReadingPlan: BibleReadingPlanData | null;
  bibleReadingPlanDayNumber: number | null;
  isLoadingBibleReadingPlan: boolean;
  bibleReadingPlanError: string | null;
  setBibleReadingPlan: (plan: BibleReadingPlanData | null) => void;
  refreshBibleReadingPlanDayNumber: () => void;
  loadBibleReadingPlan: () => Promise<BibleReadingPlanData | null>;
}>((set, get) => ({
  bibleReadingPlan: null,
  bibleReadingPlanDayNumber: null,
  isLoadingBibleReadingPlan: false,
  bibleReadingPlanError: null,
  setBibleReadingPlan: (plan) => {
    set({
      bibleReadingPlan: plan,
      bibleReadingPlanDayNumber: getPlanDayNumber(plan),
      bibleReadingPlanError: null,
    });
  },
  refreshBibleReadingPlanDayNumber: () => {
    const { bibleReadingPlan } = get();

    set({
      bibleReadingPlanDayNumber: getPlanDayNumber(bibleReadingPlan),
    });
  },
  loadBibleReadingPlan: async () => {
    const { bibleReadingPlan, isLoadingBibleReadingPlan } = get();

    if (isLoadingBibleReadingPlan) {
      return bibleReadingPlan;
    }

    set({ isLoadingBibleReadingPlan: true, bibleReadingPlanError: null });

    try {
      const plan = await getBibleReadingPlan();

      set({
        bibleReadingPlan: plan,
        bibleReadingPlanDayNumber: getPlanDayNumber(plan),
        isLoadingBibleReadingPlan: false,
      });

      return plan;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load Bible reading plan.";

      set({
        bibleReadingPlanError: message,
        isLoadingBibleReadingPlan: false,
      });

      throw error;
    }
  },
}));
