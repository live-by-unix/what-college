import React from "react";
import { UserCheck } from "lucide-react";
import { personalFactorsList } from "@/lib/extracurriculars";
import { Switch } from "@/components/ui/switch";

export default function PersonalFactorsSection({ factors, toggleFactor }) {
  return (
    <div className="border-t border-slate-100 dark:border-slate-700 pt-6">
      <div className="flex items-center gap-2 mb-1">
        <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Personal Factors</h2>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
        These background factors can influence admissions at some institutions.
      </p>
      <div className="space-y-3">
        {personalFactorsList.map(factor => (
          <div
            key={factor.key}
            className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{factor.label}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{factor.description}</p>
            </div>
            <Switch
              checked={!!factors[factor.key]}
              onCheckedChange={() => toggleFactor(factor.key)}
              aria-label={factor.label}
            />
          </div>
        ))}
      </div>
    </div>
  );
}