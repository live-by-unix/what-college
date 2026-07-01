import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, BarChart3, Target, Lightbulb, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

const features = [
  {
    icon: BarChart3,
    title: "Smart Analysis",
    description: "Our algorithm compares your GPA, test scores, and extracurriculars against 200+ universities to calculate real admission chances.",
  },
  {
    icon: Target,
    title: "Personalized Ratings",
    description: "Each school is rated as Safety, Match, Reach, or Ultra Reach based on your unique profile.",
  },
  {
    icon: Lightbulb,
    title: "Actionable Advice",
    description: "Get tailored suggestions to strengthen your application — courses, extracurriculars, test prep, and more.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 transition-colors">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100 font-heading">WhatCollege?</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/calculate">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-28 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-sm font-medium mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              200+ Universities Analyzed
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-heading leading-[1.1]">
              Your GPA.{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Your Future.
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Enter your GPAs, test scores, and extracurriculars to instantly see your chances of admission at every major U.S. university — with personalized tips to improve.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/calculate">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 h-12 text-base gap-2 shadow-lg shadow-blue-600/20">
                Start Now
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <p className="text-sm text-slate-400 dark:text-slate-500">Free · No sign-up required</p>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="pb-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center mb-5">
                  <feature.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 font-heading">{feature.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="pb-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 font-heading">How It Works</h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400">Three simple steps to find your best-fit colleges</p>
        </div>
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-8">
          {[
            { step: "01", title: "Build Your Profile", desc: "Enter your GPAs, test scores, AP courses, and extracurricular activities." },
            { step: "02", title: "Get Your Results", desc: "See admission chances and ratings for 200+ universities instantly." },
            { step: "03", title: "Take Action", desc: "Follow personalized suggestions to strengthen your applications." },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              className="text-center"
            >
              <div className="text-5xl font-bold text-blue-100 dark:text-blue-950 font-heading mb-3">{item.step}</div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            <span>WhatCollege?</span>
          </div>
          <p>For informational purposes only. Not an official admissions tool.</p>
        </div>
      </footer>
    </div>
  );
}