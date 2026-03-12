import React from "react";
import { cn } from "../utils/cn";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  valueClassName?: string;
}

export function KPICard({ title, value, icon: Icon, trend, className, valueClassName }: KPICardProps) {
  return (
    <div className={cn("bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between", className)}>
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        <div className="p-2 bg-slate-50 rounded-lg">
          <Icon className="w-5 h-5 text-slate-700" />
        </div>
      </div>
      <div className="mt-4">
        <p className={cn("text-3xl font-semibold text-slate-900", valueClassName)}>{value}</p>
        {trend && (
          <div className="flex items-center mt-2">
            <span
              className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-emerald-600" : "text-rose-600"
              )}
            >
              {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-slate-400 ml-2">vs last hour</span>
          </div>
        )}
      </div>
    </div>
  );
}
