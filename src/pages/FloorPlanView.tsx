import React from "react";
import { useDashboardData } from "../hooks/useDashboardData";
import { Map, AlertTriangle } from "lucide-react";
import { cn } from "../utils/cn";
import { useAppContext } from "../context/AppContext";

export function FloorPlanView() {
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
      </div>
    );
  }

  const { machines } = data;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[600px] relative overflow-hidden">
        <h3 className="text-base font-semibold text-slate-800 mb-6 flex items-center gap-2 absolute top-6 left-6 z-10">
          <Map className="w-5 h-5 text-indigo-600" />
          Plan de l'Usine (Temps Réel)
        </h3>
        
        {/* Floor Plan Background grid */}
        <div className="absolute inset-0 bg-slate-50 opacity-50" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

        {/* Machines */}
        <div className="absolute inset-0 top-16 p-8">
          {machines.map((machine) => (
            <div
              key={machine.id}
              onClick={() => setSelectedMachineId(machine.id)}
              className={cn(
                "absolute w-12 h-12 rounded-lg shadow-md flex items-center justify-center text-xs font-bold cursor-pointer transition-transform hover:scale-110",
                machine.status === "ALERTE" 
                  ? "bg-rose-500 text-white animate-pulse" 
                  : "bg-emerald-500 text-white"
              )}
              style={{
                left: `${machine.x}%`,
                top: `${machine.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              title={`${machine.id} - ${machine.plant}`}
            >
              {machine.id}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
