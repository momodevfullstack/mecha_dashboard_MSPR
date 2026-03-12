import React from "react";
import { useDashboardData } from "../hooks/useDashboardData";
import { AlertTriangle, Wrench, Thermometer, Activity, CheckCircle2 } from "lucide-react";

export function NotificationsView() {
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

  const alertMachines = data.machines.filter((m) => m.status === "ALERTE");

  const getRepairSuggestion = (machine: any) => {
    if (machine.temperature > 85) {
      return {
        issue: "Surchauffe critique détectée",
        action: "Vérifier et nettoyer le système de refroidissement. Remplacer le fluide caloporteur si nécessaire.",
        icon: Thermometer,
        color: "text-rose-500",
        bg: "bg-rose-100"
      };
    } else if (machine.defectRate > 5) {
      return {
        issue: "Taux de défaut anormalement élevé",
        action: "Recalibrer les capteurs de précision et vérifier l'alignement de l'axe principal.",
        icon: Activity,
        color: "text-amber-500",
        bg: "bg-amber-100"
      };
    } else if (machine.maintenanceScore < 40) {
      return {
        issue: "Score de maintenance critique",
        action: "Planifier une révision générale immédiate. Remplacer les pièces d'usure (courroies, filtres).",
        icon: Wrench,
        color: "text-indigo-500",
        bg: "bg-indigo-100"
      };
    } else {
      return {
        issue: "Anomalie de production",
        action: "Effectuer un diagnostic complet du système électrique et mécanique.",
        icon: AlertTriangle,
        color: "text-orange-500",
        bg: "bg-orange-100"
      };
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Centre de Notifications</h2>
          <p className="text-slate-500 mt-1">Gérez les alertes et planifiez les interventions de maintenance.</p>
        </div>
        <div className="flex items-center gap-2 bg-rose-50 text-rose-700 px-4 py-2 rounded-lg font-medium">
          <AlertTriangle className="w-5 h-5" />
          <span>{alertMachines.length} Alertes Actives</span>
        </div>
      </div>

      {alertMachines.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800">Aucune alerte</h3>
          <p className="text-slate-500 mt-2 max-w-md">
            Toutes les machines fonctionnent de manière optimale. Aucun problème détecté sur le parc.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {alertMachines.map((machine) => {
            const suggestion = getRepairSuggestion(machine);
            const Icon = suggestion.icon;

            return (
              <div key={machine.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 items-start md:items-center transition-all hover:shadow-md">
                <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${suggestion.bg} ${suggestion.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold text-slate-800">Machine {machine.id}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                      {machine.plant}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-700">
                      Urgent
                    </span>
                  </div>
                  <p className="text-slate-900 font-medium mb-1">{suggestion.issue}</p>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    <strong className="text-slate-700">Action requise :</strong> {suggestion.action}
                  </p>
                </div>

                <div className="shrink-0 grid grid-cols-2 gap-x-6 gap-y-2 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100 w-full md:w-auto">
                  <div>
                    <span className="text-slate-500 block text-xs mb-0.5">Température</span>
                    <span className={`font-semibold ${machine.temperature > 85 ? 'text-rose-600' : 'text-slate-700'}`}>
                      {machine.temperature}°C
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs mb-0.5">Taux Défaut</span>
                    <span className={`font-semibold ${machine.defectRate > 5 ? 'text-rose-600' : 'text-slate-700'}`}>
                      {machine.defectRate}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs mb-0.5">Score Maint.</span>
                    <span className={`font-semibold ${machine.maintenanceScore < 40 ? 'text-rose-600' : 'text-slate-700'}`}>
                      {machine.maintenanceScore}/100
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs mb-0.5">Production</span>
                    <span className="font-semibold text-slate-700">
                      {machine.productionSpeed} u/h
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
