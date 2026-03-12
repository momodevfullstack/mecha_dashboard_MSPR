import React from "react";
import { useDashboardData } from "../hooks/useDashboardData";
import { AlertTriangle, TrendingUp, Settings, Wrench, Activity } from "lucide-react";
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

  const { defectRatePrediction, trsPrediction } = data.charts;

  // Find the point where actual data ends and prediction begins
  const lastActualIndex = defectRatePrediction.findIndex(d => d.actual === null) - 1;
  const splitTime = lastActualIndex >= 0 ? defectRatePrediction[lastActualIndex].time : "";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Defect Rate Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-base font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Prévision du Taux de Défaut (24h)
            </h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={defectRatePrediction} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} unit="%" />
                  <Tooltip
                    cursor={{ stroke: "#cbd5e1", strokeWidth: 1, strokeDasharray: "3 3" }}
                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  {splitTime && (
                    <ReferenceLine x={splitTime} stroke="#94a3b8" strokeDasharray="3 3" label={{ position: 'top', value: 'Maintenant', fill: '#64748b', fontSize: 12 }} />
                  )}
                  <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: "#10b981" }} name="Historique Réel (%)" />
                  <Line type="monotone" dataKey="predicted" stroke="#6366f1" strokeWidth={3} strokeDasharray="5 5" dot={false} name="Prédiction Modèle (%)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* TRS Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-base font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              Prévision du TRS (24h)
            </h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trsPrediction} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} dy={10} />
                  <YAxis domain={['dataMin - 5', 100]} axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} unit="%" />
                  <Tooltip
                    cursor={{ stroke: "#cbd5e1", strokeWidth: 1, strokeDasharray: "3 3" }}
                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  {splitTime && (
                    <ReferenceLine x={splitTime} stroke="#94a3b8" strokeDasharray="3 3" label={{ position: 'top', value: 'Maintenant', fill: '#64748b', fontSize: 12 }} />
                  )}
                  <Line type="monotone" dataKey="actual" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, fill: "#0ea5e9" }} name="Historique Réel (%)" />
                  <Line type="monotone" dataKey="predicted" stroke="#f59e0b" strokeWidth={3} strokeDasharray="5 5" dot={false} name="Prédiction Modèle (%)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recommendations Panel */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-500" />
              Diagnostic Synthétique
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Le modèle prédictif indique une <strong className="text-rose-600">tendance à la hausse</strong> du taux de défaut global sur les 12 prochaines heures, avec un pic estimé à <strong>3.2%</strong>.
              Cette dégradation est principalement corrélée à l'augmentation de la température sur les machines de l'usine Espagne.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-500" />
              Recommandations Process
            </h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
                <span>Ajuster les paramètres de refroidissement sur les machines M26 à M30.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
                <span>Réduire la vitesse de production de 5% sur les lignes en alerte pour stabiliser la qualité.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-emerald-500" />
              Recommandations Maintenance
            </h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                <span>Planifier une inspection des systèmes de ventilation (Usine Espagne) d'ici 24h.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                <span>Remplacer les filtres sur les machines ayant un score de maintenance &lt; 40.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
