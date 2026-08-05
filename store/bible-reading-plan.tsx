import { create } from "zustand";
import type { BibleReadingPlanData } from "@/types";
import { getBibleReadingPlan } from "@/services/supabase/bible";

export const useBibleReadingPlanStore = create<{
  bibleReadingPlan: BibleReadingPlanData | null;
  isLoadingBibleReadingPlan: boolean;
  bibleReadingPlanError: string | null;
  setBibleReadingPlan: (plan: BibleReadingPlanData | null) => void;
  loadBibleReadingPlan: () => Promise<BibleReadingPlanData | null>;
}>((set, get) => ({
  bibleReadingPlan: null,
  isLoadingBibleReadingPlan: false,
  bibleReadingPlanError: null,
  setBibleReadingPlan: (plan) => {
    set({ bibleReadingPlan: plan, bibleReadingPlanError: null });
  },
  loadBibleReadingPlan: async () => {
    const { bibleReadingPlan, isLoadingBibleReadingPlan } = get();

    if (isLoadingBibleReadingPlan) {
      return bibleReadingPlan;
    }

    set({ isLoadingBibleReadingPlan: true, bibleReadingPlanError: null });

    try {
      const plan = await getBibleReadingPlan();

      console.log("Loaded Bible reading plan:", plan);

      set({
        bibleReadingPlan: plan,
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
