import React from "react";
import { motion } from "framer-motion";
import { Shield, Target, TrendingUp, AlertTriangle } from "lucide-react";

export default function StatsSummary({ results }) {
  const safety = results.filter(r => r.rating === "Safety").length;
  const match = results.filter(r => r.rating === "Match").length;
  const reach = results.filter(r => r.rating === "Reach").length;
  const ultraReach = results.filter(r => r.rating === "Ultra Reach").length;

  const stats = [
    { label: "Safety", count: safety, icon: Shield, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
    { label: "Match", count: match, icon: Target, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/40" },
    { label: "Reach", count: reach, icon: TrendingUp, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/40" },
    { label: "Ultra Reach", count: ultraReach, icon: AlertTriangle, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/40" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 text-center"
        >
          <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center mx-auto mb-2`}>
            <stat.icon className={`w-4 h-4 ${stat.color}`} />
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">{stat.count}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}