import React, { useState, useMemo } from "react";
import { useDashboardData } from "../hooks/useDashboardData";
import { useAppContext } from "../context/AppContext";
import { KPICard } from "../components/KPICard";
import { Activity, AlertTriangle, Zap, Package, Filter } from "lucide-react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
  Cell,
  AreaChart,
  Area,
  LineChart,
  Line,
} from "recharts";
import { cn } from "../utils/cn";

export function PlantManagerView() {
  const { data, loading, error } = useDashboardData();
  const { setSelectedMachineId } = useAppContext();
  const [selectedPlantFilter, setSelectedPlantFilter] = useState<string>("Toutes");

  const filteredMachines = useMemo(() => {
    if (!data || !data.machines) return [];
    if (selectedPlantFilter === "Toutes") return data.machines;
    return data.machines.filter((m) => m.plant === selectedPlantFilter);
  }, [data, selectedPlantFilter]);

  const localKpis = useMemo(() => {
    if (filteredMachines.length === 0) return null;
    const totalProd = filteredMachines.reduce((sum, m) => sum + m.productionSpeed, 0);
    const avgProd = totalProd / filteredMachines.length;
    const avgScrap = filteredMachines.reduce((sum, m) => sum + m.defectRate, 0) / filteredMachines.length;
    const atRisk = filteredMachines.filter((m) => m.status === "ALERTE").length;
    const avgTemp = filteredMachines.reduce((sum, m) => sum + m.temperature, 0) / filteredMachines.length;

    return {
      avgProduction: Number(avgProd.toFixed(0)),
      avgScrapRate: Number(avgScrap.toFixed(2)),
      machinesAtRisk: atRisk,
      avgTemp: Number(avgTemp.toFixed(1)),
    };
  }, [filteredMachines]);

  const trsData = useMemo(() => {
    const baseTrs = selectedPlantFilter === "France" ? 88 : selectedPlantFilter === "Espagne" ? 82 : 85;
    return Array.from({ length: 24 }, (_, i) => {
      const time = `${i.toString().padStart(2, "0")}:00`;
      // Add some random variation (-3 to +3)
      const noise = Math.random() * 6 - 3;
      const trs = Math.min(100, Math.max(0, baseTrs + noise));
      return { time, trs: Number(trs.toFixed(1)) };
    });
  }, [selectedPlantFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !data || !localKpis) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500">
        <AlertTriangle className="w-12 h-12 text-rose-500 mb-4" />
        <h2 className="text-xl font-semibold text-slate-800">Erreur de chargement</h2>
        <p className="mt-2 text-sm">{error?.message || "Impossible de charger les données."}</p>
      </div>
    );
  }

  const plants = ["Toutes", ...Array.from(new Set((data?.machines || []).map((m) => m.plant)))];

  const scatterData = filteredMachines.map((m) => ({
    id: m.id,
    temperature: m.temperature,
    defectRate: m.defectRate,
    status: m.status,
  }));

  const alertMachines = filteredMachines.filter((m) => m.status === "ALERTE");

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <Filter className="w-5 h-5 text-slate-400" />
        <span className="text-sm font-medium text-slate-700">Filtrer par usine :</span>
        <div className="flex gap-2">
          {plants.map((plant) => (
            <button
              key={plant}
              onClick={() => setSelectedPlantFilter(plant)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                selectedPlantFilter === plant
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {plant}
            </button>
          ))}
        </div>
      </div>

      {/* Local KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Production Moyenne (Locale)"
          value={`${localKpis.avgProduction} u/h`}
          icon={Package}
        />
        <KPICard
          title="Taux de Défaut Moyen"
          value={`${localKpis.avgScrapRate}%`}
          icon={Activity}
          valueClassName={localKpis.avgScrapRate > 3 ? "text-rose-600" : "text-emerald-600"}
        />
        <KPICard
          title="Machines en Alerte"
          value={localKpis.machinesAtRisk}
          icon={AlertTriangle}
          valueClassName={localKpis.machinesAtRisk > 0 ? "text-rose-600" : "text-emerald-600"}
        />
        <KPICard
          title="Température Moyenne"
          value={`${localKpis.avgTemp} °C`}
          icon={Zap}
        />
      </div>

      {/* TRS Evolution Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-base font-semibold text-slate-800 mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-500" />
          Évolution du TRS (Taux de Rendement Synthétique) - {selectedPlantFilter}
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTrs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} dy={10} />
              <YAxis domain={[(dataMin: number) => Math.max(0, dataMin - 5), 100]} axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} unit="%" />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
              <Area type="monotone" dataKey="trs" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorTrs)" name="TRS (%)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scatter Plot */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-1">
          <h3 className="text-base font-semibold text-slate-800 mb-6">Température vs Taux de Défaut</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis type="number" dataKey="temperature" name="Température" unit="°C" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis type="number" dataKey="defectRate" name="Taux Défaut" unit="%" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <ZAxis range={[60, 60]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                <Scatter name="Machines" data={scatterData} fill="#8884d8">
                  {scatterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.status === "ALERTE" ? "#f43f5e" : "#10b981"} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alert List */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2 flex flex-col">
          <h3 className="text-base font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            Machines en Alerte
          </h3>
          <div className="flex-1 overflow-auto">
            {alertMachines.length === 0 ? (
              <div className="flex items-center justify-center h-full text-slate-500 italic">
                No machines in alert
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-4 rounded-tl-lg font-semibold">Machine_ID</th>
                    <th className="px-4 py-4 font-semibold">Usine</th>
                    <th className="px-4 py-4 font-semibold">TRS</th>
                    <th className="px-4 py-4 font-semibold">Taux Défaut</th>
                    <th className="px-4 py-4 font-semibold">Température</th>
                    <th className="px-4 py-4 font-semibold">Score Maint.</th>
                    <th className="px-4 py-4 rounded-tr-lg font-semibold text-right">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {alertMachines.map((m) => {
                    // Calcul simulé du TRS pour la machine
                    const machineTrs = Math.max(0, 100 - m.defectRate - (m.temperature > 80 ? 15 : 0) - (100 - m.maintenanceScore) * 0.2).toFixed(1);
                    const trsHistory = Array.from({ length: 10 }, () => ({
                      value: Math.max(0, Number(machineTrs) + (Math.random() * 8 - 4))
                    }));
                    
                    return (
                      <tr key={m.id} onClick={() => setSelectedMachineId(m.id)} className="hover:bg-slate-50/80 transition-colors cursor-pointer">
                        <td className="px-4 py-4 font-bold text-slate-900">{m.id}</td>
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            {m.plant}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <span className={cn("font-semibold w-12", Number(machineTrs) < 75 ? "text-rose-600" : "text-amber-600")}>
                              {machineTrs}%
                            </span>
                            <div className="w-16 h-6">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trsHistory}>
                                  <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
                                  <Line type="monotone" dataKey="value" stroke={Number(machineTrs) < 75 ? "#e11d48" : "#d97706"} strokeWidth={2} dot={false} isAnimationActive={false} />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center gap-1 text-rose-600 font-semibold bg-rose-50 px-2 py-1 rounded-md text-sm">
                            {m.defectRate}%
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={cn(
                            "font-medium",
                            m.temperature > 85 ? "text-rose-600" : m.temperature > 75 ? "text-amber-600" : "text-slate-600"
                          )}>
                            {m.temperature}°C
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 w-16 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={cn("h-full rounded-full", m.maintenanceScore < 40 ? "bg-rose-500" : "bg-amber-500")}
                                style={{ width: `${m.maintenanceScore}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-slate-600 w-6">{m.maintenanceScore}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-100 text-rose-700 border border-rose-200 rounded-full text-xs font-bold shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                            {m.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
