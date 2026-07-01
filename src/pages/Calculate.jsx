import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, ArrowLeft } from "lucide-react";
import GPAInputForm from "@/components/whatcollege/GPAInputForm";
import ThemeToggle from "@/components/ThemeToggle";

export default function Calculate() {
  const navigate = useNavigate();

  const handleSubmit = (gpas) => {
    const params = new URLSearchParams({
      uw: gpas.unweighted,
      w: gpas.weighted,
      ac: gpas.academic,
      g: gpas.grade10to12,
      aps: (gpas.apCourses || []).join(","),
      ecs: (gpas.extracurriculars || []).join("|"),
      hon: (gpas.honors || []).join("|"),
    });
    if (gpas.sat) params.set("sat", gpas.sat);
    if (gpas.act) params.set("act", gpas.act);
    if (gpas.personalFactors?.firstGen) params.set("fg", "1");
    if (gpas.personalFactors?.legacy) params.set("leg", "1");
    if (gpas.personalFactors?.recruitedAthlete) params.set("ath", "1");
    navigate(`/results?${params.toString()}`);
  };

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
          <ThemeToggle />
        </div>
      </nav>

      <main className="pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-6">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </Link>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 font-heading">
              Build Your Profile
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">
              Enter your GPAs, test scores, AP courses, and extracurriculars to see your admission chances across 200+ universities.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6 sm:p-8"
          >
            <GPAInputForm onSubmit={handleSubmit} />
          </motion.div>
        </div>
      </main>
    </div>
  );
}