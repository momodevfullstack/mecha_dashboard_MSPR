import React from "react";
import { useAppContext } from "../context/AppContext";
import { useDashboardData } from "../hooks/useDashboardData";
import { X, Activity, Thermometer, Wrench, Zap, Leaf, User, AlertTriangle } from "lucide-react";
import { cn } from "../utils/cn";

export function MachineModal() {
  const { selectedMachineId, setSelectedMachineId } = useAppContext();
  const { data } = useDashboardData();

  if (!selectedMachineId || !data) return null;

  const machine = data.machines.find(m => m.id === selectedMachineId);

  if (!machine) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm",
              machine.status === "ALERTE" ? "bg-rose-500" : "bg-emerald-500"
            )}>
              {machine.id}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Détails Machine</h2>
              <p className="text-sm text-slate-500">Usine {machine.plant}</p>
            </div>
          </div>
          <button 
            onClick={() => setSelectedMachineId(null)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Statut Actuel</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 mb-2">
                  <Activity className="w-4 h-4" />
                  <span className="text-xs font-medium">Taux de Défaut</span>
                </div>
                <div className={cn("text-xl font-bold", machine.defectRate > 5 ? "text-rose-600" : "text-slate-800")}>
                  {machine.defectRate}%
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 mb-2">
                  <Thermometer className="w-4 h-4" />
                  <span className="text-xs font-medium">Température</span>
                </div>
                <div className={cn("text-xl font-bold", machine.temperature > 80 ? "text-rose-600" : "text-slate-800")}>
                  {machine.temperature}°C
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 mb-2">
                  <Wrench className="w-4 h-4" />
                  <span className="text-xs font-medium">Score Maint.</span>
                </div>
                <div className={cn("text-xl font-bold", machine.maintenanceScore < 50 ? "text-amber-600" : "text-slate-800")}>
                  {machine.maintenanceScore}/100
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 mb-2">
                  <Zap className="w-4 h-4" />
                  <span className="text-xs font-medium">Puissance</span>
                </div>
                <div className="text-xl font-bold text-slate-800">
                  {machine.powerConsumption} kW
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Informations Complémentaires</h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-600">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Opérateur Actuel</span>
                </div>
                <span className="text-sm font-bold text-slate-800">{machine.operator}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-600">
                  <Leaf className="w-4 h-4" />
                  <span className="text-sm font-medium">Émissions CO2</span>
                </div>
                <span className="text-sm font-bold text-slate-800">{machine.co2Emissions} kg/h</span>
              </div>
            </div>

            <div className="pt-4">
              <button className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Créer un Ticket d'Intervention
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
