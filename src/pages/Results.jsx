import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, ArrowLeft, ArrowUpDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import colleges from "@/lib/colleges";
import { predictAll } from "@/lib/algorithm";
import SearchAndFilter from "@/components/whatcollege/SearchAndFilter";
import CollegeCard from "@/components/whatcollege/CollegeCard";
import CollegeModal from "@/components/whatcollege/CollegeModal";
import PDFExportButton from "@/components/whatcollege/PDFExportButton";
import StatsSummary from "@/components/whatcollege/StatsSummary";
import ThemeToggle from "@/components/ThemeToggle";

const difficultyRanges = {
  "All Levels": [0, 10],
  "Easy (1-3)": [1, 3],
  "Moderate (4-6)": [4, 6],
  "Hard (7-8)": [7, 8],
  "Elite (9-10)": [9, 10],
};

export default function Results() {
  const params = new URLSearchParams(window.location.search);

  const apCoursesParam = params.get("aps") || "";
  const apCourses = apCoursesParam ? apCoursesParam.split(",").filter(Boolean) : [];
  const ecsParam = params.get("ecs") || "";
  const extracurriculars = ecsParam ? ecsParam.split("|").filter(Boolean) : [];
  const honParam = params.get("hon") || "";
  const honors = honParam ? honParam.split("|").filter(Boolean) : [];

  const gpas = {
    unweighted: parseFloat(params.get("uw")) || 3.5,
    weighted: parseFloat(params.get("w")) || 3.8,
    academic: parseFloat(params.get("ac")) || 3.5,
    grade10to12: parseFloat(params.get("g")) || 3.5,
    apCourses,
    sat: params.get("sat") ? parseInt(params.get("sat")) : null,
    act: params.get("act") ? parseInt(params.get("act")) : null,
    extracurriculars,
    honors,
    personalFactors: {
      firstGen: params.get("fg") === "1",
      legacy: params.get("leg") === "1",
      recruitedAthlete: params.get("ath") === "1",
    },
  };

  const allResults = useMemo(() => predictAll(gpas, colleges), [gpas.unweighted, gpas.weighted, gpas.academic, gpas.grade10to12, apCoursesParam, ecsParam, honParam]);

  const [filters, setFilters] = useState({
    search: "",
    rating: "All Ratings",
    state: "All States",
    difficulty: "All Levels",
    major: "All Majors",
  });
  const [sortBy, setSortBy] = useState("chance-desc");
  const [selectedResult, setSelectedResult] = useState(null);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredResults = useMemo(() => {
    let filtered = allResults;

    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(r => r.college.name.toLowerCase().includes(q));
    }
    if (filters.rating !== "All Ratings") {
      filtered = filtered.filter(r => r.rating === filters.rating);
    }
    if (filters.state !== "All States") {
      filtered = filtered.filter(r => r.college.state === filters.state);
    }
    if (filters.difficulty !== "All Levels") {
      const [min, max] = difficultyRanges[filters.difficulty];
      filtered = filtered.filter(r => r.college.difficulty_index >= min && r.college.difficulty_index <= max);
    }
    if (filters.major !== "All Majors") {
      filtered = filtered.filter(r => r.college.majors?.includes(filters.major));
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "chance-desc": return b.chance - a.chance;
        case "chance-asc": return a.chance - b.chance;
        case "name-asc": return a.college.name.localeCompare(b.college.name);
        case "difficulty-desc": return b.college.difficulty_index - a.college.difficulty_index;
        default: return b.chance - a.chance;
      }
    });

    return filtered;
  }, [allResults, filters, sortBy]);

  const profileParts = [
    `UW: ${gpas.unweighted}`,
    `W: ${gpas.weighted}`,
    `Acad: ${gpas.academic}`,
    `10-12: ${gpas.grade10to12}`,
  ];
  if (gpas.sat) profileParts.push(`SAT: ${gpas.sat}`);
  if (gpas.act) profileParts.push(`ACT: ${gpas.act}`);
  if (apCourses.length) profileParts.push(`${apCourses.length} AP`);
  if (extracurriculars.length) profileParts.push(`${extracurriculars.length} EC`);
  if (honors.length) profileParts.push(`${honors.length} Honor${honors.length === 1 ? "" : "s"}`);
  if (gpas.personalFactors.firstGen) profileParts.push("First-Gen");
  if (gpas.personalFactors.legacy) profileParts.push("Legacy");
  if (gpas.personalFactors.recruitedAthlete) profileParts.push("Athlete");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 transition-colors">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100 font-heading">WhatCollege?</span>
          </Link>
          <div className="flex items-center gap-2">
            <PDFExportButton results={filteredResults} gpas={gpas} />
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <Link to="/calculate" className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-4">
              <ArrowLeft className="w-3.5 h-3.5" />
              Edit Profile
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 font-heading">Your Results</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {profileParts.join(" · ")}
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-6"
          >
            <StatsSummary results={allResults} />
          </motion.div>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mb-4"
          >
            <SearchAndFilter filters={filters} onFilterChange={handleFilterChange} />
          </motion.div>

          {/* Sort & count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {filteredResults.length} {filteredResults.length === 1 ? "university" : "universities"}
            </p>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-8 text-xs rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 min-w-[140px]" aria-label="Sort results">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chance-desc" className="text-xs">Highest Chance</SelectItem>
                  <SelectItem value="chance-asc" className="text-xs">Lowest Chance</SelectItem>
                  <SelectItem value="name-asc" className="text-xs">Name (A-Z)</SelectItem>
                  <SelectItem value="difficulty-desc" className="text-xs">Most Difficult</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* College list */}
          <div className="space-y-3">
            {filteredResults.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                <p className="text-slate-500 dark:text-slate-400 text-sm">No universities match your filters.</p>
                <button
                  onClick={() => setFilters({ search: "", rating: "All Ratings", state: "All States", difficulty: "All Levels", major: "All Majors" })}
                  className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              filteredResults.map((result, i) => (
                <CollegeCard
                  key={result.college.id}
                  result={result}
                  index={i}
                  onClick={setSelectedResult}
                />
              ))
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      <CollegeModal
        result={selectedResult}
        open={!!selectedResult}
        onClose={() => setSelectedResult(null)}
        apCourses={apCourses}
        extracurriculars={extracurriculars}
        honors={honors}
        personalFactors={gpas.personalFactors}
      />
    </div>
  );
}