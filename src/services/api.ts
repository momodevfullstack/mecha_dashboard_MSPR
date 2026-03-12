import { DashboardData } from "../types";

export async function fetchDashboardData(): Promise<DashboardData> {
  const response = await fetch(`/api/mecha-metrics?t=${Date.now()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data");
  }
  return response.json();
}
