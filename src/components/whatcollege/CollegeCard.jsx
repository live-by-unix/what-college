import React from "react";
import { motion } from "framer-motion";
import { MapPin, TrendingUp, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ratingConfig = {
  "Safety": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", ring: "ring-emerald-100" },
  "Match": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", ring: "ring-blue-100" },
  "Reach": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", ring: "ring-amber-100" },
  "Ultra Reach": { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", ring: "ring-red-100" },
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
        <circle cx="32" cy="32" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="5" />
        <circle
          cx="32" cy="32" r={radius} fill="none"
          stroke={color} strokeWidth="5" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-slate-800">{chance}%</span>
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
      className="w-full text-left bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md hover:border-slate-200 transition-all group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label={`${college.name} — ${chance}% chance, rated ${rating}. Click for details.`}
    >
      <div className="flex items-center gap-4">
        <ChanceRing chance={chance} rating={rating} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                {college.name}
              </h3>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="w-3 h-3" />
                  {college.state}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                  <TrendingUp className="w-3 h-3" />
                  Difficulty {college.difficulty_index}/10
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-400 transition-colors shrink-0 mt-0.5" />
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Badge variant="outline" className={`text-[10px] px-2 py-0.5 rounded-full ${config.bg} ${config.text} ${config.border}`}>
              {rating}
            </Badge>
            <span className="text-[10px] text-slate-400">
              Your GPA: {compositeGPA} · Median: {college.gpa_50.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}