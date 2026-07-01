import React from "react";
import { Check, Users, Award } from "lucide-react";
import { extracurricularCategories, honorsOptions } from "@/lib/extracurriculars";

export default function ExtracurricularsSection({ activities, toggleActivity, honors, toggleHonor }) {
  return (
    <div className="border-t border-slate-100 dark:border-slate-700 pt-6">
      <div className="flex items-center gap-2 mb-1">
        <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Extracurricular Activities</h2>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
        Select all activities you've been involved in. Depth and leadership matter more than quantity.
      </p>

      <div className="space-y-5 max-h-72 overflow-y-auto pr-1 -mr-1">
        {Object.entries(extracurricularCategories).map(([key, cat]) => (
          <div key={key}>
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-2">
              {cat.label}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {cat.items.map(item => {
                const selected = activities.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleActivity(item)}
                    className={`inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                      selected
                        ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700 font-medium"
                        : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                    }`}
                    aria-pressed={selected}
                  >
                    {selected && <Check className="w-3 h-3" />}
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <div className="flex items-center gap-2 mb-1">
          <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Honors & Awards</h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
          Select any notable awards or recognitions you've received.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {honorsOptions.map(honor => {
            const selected = honors.includes(honor);
            return (
              <button
                key={honor}
                type="button"
                onClick={() => toggleHonor(honor)}
                className={`inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                  selected
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 font-medium"
                    : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
                aria-pressed={selected}
              >
                {selected && <Check className="w-3 h-3" />}
                {honor}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}