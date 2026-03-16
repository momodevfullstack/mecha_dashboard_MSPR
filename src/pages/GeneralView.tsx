import React from "react";
import { useDashboardData } from "../hooks/useDashboardData";
import { useAppContext } from "../context/AppContext";
import { KPICard } from "../components/KPICard";
import { Activity, AlertTriangle, Zap, Package, Timer } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  ComposedChart,
  Line,
} from "recharts";
import { cn } from "../utils/cn";

const COLORS = ["#10b981", "#f43f5e", "#f59e0b", "#3b82f6"];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, value, name }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold">
      {`${(percent * 100).toFixed(0)}% (${value})`}
    </text>
  );
};

export function GeneralView() {
  const { data, loading, error } = useDashboardData();
  const { setSelectedMachineId } = useAppContext();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500">
        <AlertTriangle className="w-12 h-12 text-rose-500 mb-4" />
        <h2 className="text-xl font-semibold text-slate-800">Erreur de chargement</h2>
        <p className="mt-2 text-sm">{error?.message || "Impossible de charger les données."}</p>
      </div>
    );
  }

  const { kpis, charts } = data;

  const pieData = [
    { name: "RAS", value: charts.machineStatusCounts.RAS },
    { name: "ALERTE", value: charts.machineStatusCounts.ALERTE },
  ];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Production Moyenne"
          value={`${kpis.avgProduction} u/h`}
          icon={Package}
          trend={{ value: 2.4, isPositive: true }}
        />
        <KPICard
          title="Taux de Défaut"
          value={`${kpis.avgScrapRate}%`}
          icon={Activity}
          trend={{ value: 0.5, isPositive: false }}
          valueClassName={kpis.avgScrapRate > 3 ? "text-rose-600" : "text-emerald-600"}
        />
        <KPICard
          title="Temps de Cycle Moyen"
          value={`${kpis.avgCycleTime} s`}
          icon={Timer}
          trend={{ value: 0.2, isPositive: true }}
          valueClassName="text-indigo-600"
        />
        <KPICard
          title="Conso. Énergétique"
          value={`${kpis.avgPower} kW`}
          icon={Zap}
          trend={{ value: 1.2, isPositive: false }}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Production by Plant */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
          <h3 className="text-base font-semibold text-slate-800 mb-6">Production Moyenne par Usine</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.productionByPlant} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="plant" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: "#f1f5f9" }}
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Machine Status */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-base font-semibold text-slate-800 mb-6">État du Parc</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  formatter={(value: number, name: string, props: any) => [`${value} machines`, name]}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Error & Temp */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-base font-semibold text-slate-800 mb-6">Température & Taux d'Erreur (Top 15)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={charts.errorTempByMachine.slice(0, 15)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="machineId" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 10 }} dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: "#f1f5f9" }}
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                />
                <Bar yAxisId="left" dataKey="temperature" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Température (°C)" />
                <Line yAxisId="right" type="monotone" dataKey="errorRate" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3, fill: "#f43f5e" }} name="Taux d'Erreur (%)" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Maintenance Heatmap */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <h3 className="text-base font-semibold text-slate-800 mb-6">Score de Maintenance (7 Jours)</h3>
          <div className="flex-1 overflow-auto">
            <div className="min-w-[500px]">
              <div className="grid grid-cols-8 gap-1 mb-2">
                <div className="text-xs font-medium text-slate-500">Machine</div>
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="text-xs font-medium text-slate-500 text-center">J-{7 - i}</div>
                ))}
              </div>
              {charts.maintenanceHeatmap.map((row) => {
                const isAtRisk = data.machines.find(m => m.id === row.machineId)?.status === "ALERTE";
                return (
                <div 
                  key={row.machineId} 
                  onClick={() => setSelectedMachineId(row.machineId)}
                  className="grid grid-cols-8 gap-1 mb-1 items-center cursor-pointer hover:bg-slate-50 rounded-md p-1 transition-colors"
                >
                  <div className="text-xs font-medium text-slate-700 flex items-center gap-1">
                    {isAtRisk && <AlertTriangle className="w-3 h-3 text-rose-500" />}
                    <span className={cn(isAtRisk && "text-rose-600 font-semibold")}>{row.machineId}</span>
                  </div>
                  {Array.from({ length: 7 }).map((_, i) => {
                    const val = row[`day${i + 1}`] as number;
                    // Color logic: < 50 red, 50-80 yellow, > 80 green
                    let bgColor = "bg-emerald-500";
                    if (val < 50) bgColor = "bg-rose-500";
                    else if (val < 80) bgColor = "bg-amber-400";

                    return (
                      <div
                        key={i}
                        className={cn("h-8 rounded-sm flex items-center justify-center text-[10px] text-white font-medium", bgColor)}
                        title={`Score: ${val}`}
                      >
                        {val}
                      </div>
                    );
                  })}
                </div>
              )})}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
