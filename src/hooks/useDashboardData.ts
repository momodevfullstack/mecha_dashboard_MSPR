import { useState, useEffect } from "react";
import { DashboardData } from "../types";
import { fetchDashboardData } from "../services/api";
import { useAppContext } from "../context/AppContext";

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { isLiveMode, selectedPlant } = useAppContext();

  useEffect(() => {
    let isMounted = true;

    async function loadData(isInitial = false) {
      try {
        if (isInitial) setLoading(true);
        const result = await fetchDashboardData();
        if (isMounted) {
          // Filter data based on selectedPlant
          if (selectedPlant !== 'All') {
            result.machines = result.machines.filter(m => m.plant === selectedPlant);
            // Recalculate KPIs based on filtered machines
            const machines = result.machines;
            if (machines.length > 0) {
              const totalProduction = machines.reduce((sum, m) => sum + m.productionSpeed, 0);
              result.kpis.avgProduction = Number((totalProduction / machines.length).toFixed(0));
              result.kpis.avgScrapRate = Number((machines.reduce((sum, m) => sum + m.defectRate, 0) / machines.length).toFixed(2));
              result.kpis.machinesAtRisk = machines.filter(m => m.status === "ALERTE").length;
              result.kpis.avgPower = Number((machines.reduce((sum, m) => sum + m.powerConsumption, 0) / machines.length).toFixed(1));
              result.kpis.totalCO2 = Number((machines.reduce((sum, m) => sum + m.co2Emissions, 0)).toFixed(1));
              result.kpis.estimatedCost = Number((result.kpis.totalCO2 * 0.15 * 24).toFixed(2));
            }
          }
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Unknown error"));
        }
      } finally {
        if (isMounted && isInitial) {
          setLoading(false);
        }
      }
    }

    loadData(true);

    const delay = isLiveMode ? 2000 : 30000;
    const interval = setInterval(() => loadData(false), delay);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isLiveMode, selectedPlant]);

  return { data, loading, error };
}
