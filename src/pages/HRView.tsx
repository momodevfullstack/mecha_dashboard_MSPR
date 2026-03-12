import React from "react";
import { useDashboardData } from "../hooks/useDashboardData";
import { useAppContext } from "../context/AppContext";
import { Users, AlertTriangle, UserCheck, GraduationCap } from "lucide-react";
import { cn } from "../utils/cn";

export function HRView() {
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

  const { hrData } = data;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-base font-semibold text-slate-800 mb-6 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          Opérateurs sur Ligne
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pb-3 px-4 text-sm font-semibold text-slate-500">Opérateur</th>
                <th className="pb-3 px-4 text-sm font-semibold text-slate-500">Machine</th>
                <th className="pb-3 px-4 text-sm font-semibold text-slate-500">Équipe</th>
                <th className="pb-3 px-4 text-sm font-semibold text-slate-500">Efficacité</th>
                <th className="pb-3 px-4 text-sm font-semibold text-slate-500">Niveau de Formation</th>
              </tr>
            </thead>
            <tbody>
              {hrData.map((hr, idx) => (
                <tr 
                  key={idx} 
                  onClick={() => setSelectedMachineId(hr.machineId)}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                        {hr.operatorName.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="font-medium text-slate-800">{hr.operatorName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600 font-mono">{hr.machineId}</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                      {hr.shift}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-slate-200 rounded-full h-2 max-w-[100px]">
                        <div
                          className={cn(
                            "h-2 rounded-full",
                            hr.efficiency >= 90 ? "bg-emerald-500" : hr.efficiency >= 80 ? "bg-amber-500" : "bg-rose-500"
                          )}
                          style={{ width: `${hr.efficiency}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-slate-700">{hr.efficiency}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <GraduationCap
                          key={i}
                          className={cn(
                            "w-4 h-4",
                            i < hr.trainingLevel ? "text-indigo-600" : "text-slate-200"
                          )}
                        />
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
