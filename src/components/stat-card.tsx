'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
  };
}

export function StatCard({ title, value, subtitle, icon, trend }: StatCardProps) {
  return (
    <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-400">
          {title}
        </CardTitle>
        {icon && (
          <div className="text-slate-400">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        )}
        {trend && (
          <p className={`text-xs mt-1 ${trend.value >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
