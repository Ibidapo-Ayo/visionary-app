import { create } from "zustand";
import type { BibleReadingPlanData } from "@/types";
import { getBibleReadingDayNumber } from "@/lib/helper";
import { getBibleReadingPlan } from "@/services/supabase/bible";

const getPlanDayNumber = (plan: BibleReadingPlanData | null) =>
  plan?.group_plan_start_date ? getBibleReadingDayNumber(plan.group_plan_start_date) : null;

export const useBibleReadingPlanStore = create<{
  bibleReadingPlan: BibleReadingPlanData | null;
  bibleReadingPlanDayNumber: number | null;
  isLoadingBibleReadingPlan: boolean;
  bibleReadingPlanError: string | null;
  setBibleReadingPlan: (plan: BibleReadingPlanData | null) => void;
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
