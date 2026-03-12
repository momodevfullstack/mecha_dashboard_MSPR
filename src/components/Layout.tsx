import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Factory, TrendingUp, Bell, Zap, Users, Map, Download, Radio } from "lucide-react";
import { cn } from "../utils/cn";
import { NotificationSystem } from "./NotificationSystem";
import { useDashboardData } from "../hooks/useDashboardData";
import { useAppContext } from "../context/AppContext";

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { data } = useDashboardData();
  const { isLiveMode, setIsLiveMode, selectedPlant, setSelectedPlant } = useAppContext();

  const navItems = [
    { path: "/", label: "Direction Générale", icon: LayoutDashboard },
    { path: "/plant", label: "Directeur d'Usine", icon: Factory },
    { path: "/prediction", label: "Modèle & Prédictions", icon: TrendingUp },
    { path: "/energy", label: "Énergie & Carbone", icon: Zap },
    { path: "/hr", label: "Ressources Humaines", icon: Users },
    { path: "/floorplan", label: "Carte de l'Usine", icon: Map },
  ];

  const alertCount = data?.machines.filter((m) => m.status === "ALERTE").length || 0;

  const handleExport = () => {
    window.print();
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div className="flex items-center gap-2 text-indigo-600">
            <Factory className="w-6 h-6" />
            <span className="text-xl font-bold tracking-tight">MECHA</span>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-indigo-600" : "text-slate-400")} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
              AD
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Admin</span>
              <span className="text-xs text-slate-500">admin@mecha.io</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-lg font-semibold text-slate-800">
            {navItems.find((item) => item.path === location.pathname)?.label || 
             (location.pathname === "/notifications" ? "Centre de Notifications" : "Dashboard")}
          </h1>
          <div className="flex items-center gap-4">
            
            {/* Global Filters & Controls */}
            <div className="flex items-center gap-3 border-r border-slate-200 pr-4">
              <select 
                value={selectedPlant}
                onChange={(e) => setSelectedPlant(e.target.value)}
                className="text-sm border-slate-200 rounded-lg text-slate-600 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="All">Toutes les usines</option>
                <option value="France">France</option>
                <option value="Espagne">Espagne</option>
              </select>

              <button
                onClick={() => setIsLiveMode(!isLiveMode)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border",
                  isLiveMode 
                    ? "bg-rose-50 text-rose-600 border-rose-200" 
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                )}
              >
                <Radio className={cn("w-4 h-4", isLiveMode && "animate-pulse")} />
                {isLiveMode ? "Live" : "Standard"}
              </button>

              <button
                onClick={handleExport}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                title="Exporter le rapport"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>

            <Link 
              to="/notifications" 
              className={cn(
                "p-2 relative rounded-full transition-colors",
                location.pathname === "/notifications" 
                  ? "bg-indigo-50 text-indigo-600" 
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              )}
            >
              <Bell className="w-5 h-5" />
              {alertCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {alertCount}
                </span>
              )}
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8 relative">
          {children}
          <NotificationSystem />
        </main>
      </div>
    </div>
  );
}
