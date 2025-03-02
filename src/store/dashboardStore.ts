import { DashboardEntry } from "@/types";
import { create } from "zustand";

interface DashboardState {
  insights: DashboardEntry | null;
  loading: boolean;
  error: string | null;
  fetchDashboard: (userId: string) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  insights: null,
  loading: false,
  error: null,

  fetchDashboard: async (userId: string) => {
    try {
      set({ loading: true, error: null });

      const DASHBOARD_UPDATE_URL = process.env.EXPO_PUBLIC_UPDATE_DASHBOARD_URL;

      const response = await fetch(`${DASHBOARD_UPDATE_URL}?userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Error fetching dashboard insights: ${response.statusText}`,
        );
      }

      const data = await response.json();
      set({ insights: data.data, loading: false });
    } catch (error: any) {
      console.error("Error fetching dashboard insights:", error);
      set({ error: error.message, loading: false });
    }
  },
}));
