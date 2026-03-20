import React from "react";
import { useDashboardData } from "../hooks/useDashboardData";
import { AlertTriangle, TrendingUp, Activity, ShieldAlert, Cpu, Search, AlertCircle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  ScatterChart,
  Scatter,
  ZAxis,
  AreaChart,
  Area,
  ComposedChart
} from "recharts";
import { cn } from "../utils/cn";

export function PredictionView() {
  const { data, loading, error } = useDashboardData();

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

  const { machinePredictions, anomalyData, qualityDrift } = data.charts;

  // Find the point where actual data ends and prediction begins for Quality Drift
  const lastActualIndex = qualityDrift.findIndex(d => d.defectRate === null) - 1;
  const splitTime = lastActualIndex >= 0 ? qualityDrift[lastActualIndex].time : "";

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Modèles d'Intelligence Artificielle</h2>
          <p className="text-sm text-slate-500">Supervision avancée via Machine Learning (XGBoost, Isolation Forest)</p>
        </div>
        <div className="flex gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Modèles Actifs
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Predictive Maintenance (XGBoost) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-1 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-600" />
              Maintenance Prédictive
            </h3>
            <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-md">XGBoost</span>
          </div>
          <p className="text-sm text-slate-500 mb-4">Probabilité de panne à 7 jours basée sur l'historique et la télémétrie.</p>
          
          <div className="flex-1 overflow-auto pr-2 space-y-4">
            {machinePredictions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 py-8">
                <ShieldAlert className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">Aucune machine à risque détectée.</p>
              </div>
            ) : (
              machinePredictions.map((pred, idx) => (
                <div key={pred.machineId} className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-800">{pred.machineId}</span>
                    <span className={cn(
                      "text-sm font-bold px-2 py-0.5 rounded-full",
                      pred.failureProbability > 80 ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                    )}>
                      {pred.failureProbability}% Risque
                    </span>
                  </div>
                  
                  <div className="space-y-2 mt-3">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Facteurs d'influence (Feature Importance)</p>
                    {pred.topFeatures.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <div className="w-24 truncate text-slate-600">{feat.name}</div>
                        <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full rounded-full", i === 0 ? "bg-indigo-500" : i === 1 ? "bg-indigo-400" : "bg-indigo-300")} 
                            style={{ width: `${feat.contribution}%` }}
                          />
                        </div>
                        <div className="w-8 text-right font-medium text-slate-700">{feat.contribution}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Anomaly Detection (Isolation Forest) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <Search className="w-5 h-5 text-emerald-600" />
              Détection d'Anomalies (Temps Réel)
            </h3>
            <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-md">Isolation Forest</span>
          </div>
          <p className="text-sm text-slate-500 mb-6">Identification des comportements déviants (Puissance vs Température) non détectables par des seuils simples.</p>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" dataKey="temperature" name="Température" unit="°C" tick={{ fill: "#64748b", fontSize: 12 }} domain={['auto', 'auto']} />
                <YAxis type="number" dataKey="power" name="Puissance" unit="kW" tick={{ fill: "#64748b", fontSize: 12 }} domain={['auto', 'auto']} />
                <ZAxis type="category" dataKey="isAnomaly" name="Anomalie" />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  formatter={(value: any, name: string) => [value, name === 'isAnomaly' ? 'Est Anomalie' : name]}
                />
                <Legend verticalAlign="top" height={36} />
                <Scatter name="Comportement Normal" data={anomalyData.filter(d => !d.isAnomaly)} fill="#94a3b8" />
                <Scatter name="Anomalie Détectée" data={anomalyData.filter(d => d.isAnomaly)} fill="#f43f5e" shape="cross" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quality Drift (Predictive Quality) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              Dérive Qualité & Taux de Défaut
            </h3>
            <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-md">Régression Avancée</span>
          </div>
          <p className="text-sm text-slate-500 mb-6">Anticipation des dérives de production avant le dépassement des limites de contrôle qualité.</p>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={qualityDrift} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} unit="%" domain={[0, 6]} />
                <Tooltip
                  cursor={{ stroke: "#cbd5e1", strokeWidth: 1, strokeDasharray: "3 3" }}
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                
                {/* Control Limits */}
                <ReferenceLine y={4.0} stroke="#f43f5e" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Limite Supérieure (UCL)', fill: '#f43f5e', fontSize: 10 }} />
                <ReferenceLine y={1.0} stroke="#10b981" strokeDasharray="3 3" label={{ position: 'insideBottomLeft', value: 'Limite Inférieure (LCL)', fill: '#10b981', fontSize: 10 }} />
                
                {splitTime && (
                  <ReferenceLine x={splitTime} stroke="#94a3b8" strokeDasharray="3 3" label={{ position: 'top', value: 'Maintenant', fill: '#64748b', fontSize: 12 }} />
                )}
                
                <Line type="monotone" dataKey="defectRate" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, fill: "#0ea5e9" }} name="Taux Réel (%)" />
                <Line type="monotone" dataKey="predictedDrift" stroke="#f59e0b" strokeWidth={3} strokeDasharray="5 5" dot={false} name="Dérive Prédite (%)" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
