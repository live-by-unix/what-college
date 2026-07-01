import React from "react";
import { motion } from "framer-motion";
import { MapPin, TrendingUp, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ratingConfig = {
  "Safety": { bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800" },
  "Match": { bg: "bg-blue-50 dark:bg-blue-950/40", text: "text-blue-700 dark:text-blue-400", border: "border-blue-200 dark:border-blue-800" },
  "Reach": { bg: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-700 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800" },
  "Ultra Reach": { bg: "bg-red-50 dark:bg-red-950/40", text: "text-red-700 dark:text-red-400", border: "border-red-200 dark:border-red-800" },
};

function ChanceRing({ chance, rating }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (chance / 100) * circumference;
  const colors = {
    "Safety": "#10b981",
    "Match": "#3b82f6",
    "Reach": "#f59e0b",
    "Ultra Reach": "#ef4444",
  };
  const color = colors[rating] || "#3b82f6";

  return (
    <div className="relative w-[72px] h-[72px] shrink-0" role="img" aria-label={`${chance}% chance of admission`}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="currentColor" strokeWidth="5" className="text-slate-100 dark:text-slate-700" />
        <circle
          cx="32" cy="32" r={radius} fill="none"
          stroke={color} strokeWidth="5" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{chance}%</span>
      </div>
    </div>
  );
}

export default function CollegeCard({ result, index, onClick }) {
  const { college, chance, rating, compositeGPA } = result;
  const config = ratingConfig[rating];

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.5) }}
      onClick={() => onClick(result)}
      className="w-full text-left bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 hover:shadow-md hover:border-slate-200 dark:hover:border-slate-600 transition-all group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
      aria-label={`${college.name} — ${chance}% chance, rated ${rating}. Click for details.`}
    >
      <div className="flex items-center gap-4">
        <ChanceRing chance={chance} rating={rating} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {college.name}
              </h3>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <MapPin className="w-3 h-3" />
                  {college.state}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <TrendingUp className="w-3 h-3" />
                  Difficulty {college.difficulty_index}/10
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-400 dark:group-hover:text-blue-500 transition-colors shrink-0 mt-0.5" />
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Badge variant="outline" className={`text-[10px] px-2 py-0.5 rounded-full ${config.bg} ${config.text} ${config.border}`}>
              {rating}
            </Badge>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              Your GPA: {compositeGPA} · Median: {college.gpa_50.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}