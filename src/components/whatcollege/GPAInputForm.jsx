import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight, Info, BookOpen, Check } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { apCoursesByCategory, apCategoryLabels } from "@/lib/apCourses";
import TestScoresSection from "@/components/whatcollege/TestScoresSection";
import ExtracurricularsSection from "@/components/whatcollege/ExtracurricularsSection";
import PersonalFactorsSection from "@/components/whatcollege/PersonalFactorsSection";

const gpaFields = [
  { key: "unweighted", label: "Unweighted GPA", max: 4.0, step: 0.01, tooltip: "Your GPA on a standard 4.0 scale without extra weight for honors/AP classes." },
  { key: "weighted", label: "Weighted GPA", max: 5.0, step: 0.01, tooltip: "Your GPA including bonus points for AP, IB, and Honors courses (up to 5.0)." },
  { key: "academic", label: "Academic GPA", max: 4.0, step: 0.01, tooltip: "GPA calculated from core academic subjects only (Math, Science, English, Social Studies, Foreign Language)." },
  { key: "grade10to12", label: "10–12 GPA", max: 4.0, step: 0.01, tooltip: "Your GPA from grades 10 through 12 only, showing your most recent academic performance." },
];

export default function GPAInputForm({ onSubmit }) {
  const [gpas, setGpas] = useState({ unweighted: 3.5, weighted: 3.8, academic: 3.5, grade10to12: 3.5 });
  const [selectedAPs, setSelectedAPs] = useState([]);
  const [testScores, setTestScores] = useState({ sat: "", act: "" });
  const [extracurriculars, setExtracurriculars] = useState([]);
  const [honors, setHonors] = useState([]);
  const [personalFactors, setPersonalFactors] = useState({ firstGen: false, legacy: false, recruitedAthlete: false });
  const [errors, setErrors] = useState({});

  const handleSliderChange = (key, value) => {
    setGpas(prev => ({ ...prev, [key]: value[0] }));
    setErrors(prev => ({ ...prev, [key]: null }));
  };

  const handleInputChange = (key, value, max) => {
    const num = parseFloat(value);
    if (value === "" || value === ".") { setGpas(prev => ({ ...prev, [key]: value })); return; }
    if (isNaN(num)) return;
    if (num < 0) { setErrors(prev => ({ ...prev, [key]: "GPA cannot be negative" })); return; }
    if (num > max) { setErrors(prev => ({ ...prev, [key]: `Maximum is ${max}` })); return; }
    setErrors(prev => ({ ...prev, [key]: null }));
    setGpas(prev => ({ ...prev, [key]: num }));
  };

  const toggleAP = (apName) => {
    setSelectedAPs(prev => prev.includes(apName) ? prev.filter(a => a !== apName) : [...prev, apName]);
  };

  const toggleActivity = (item) => {
    setExtracurriculars(prev => prev.includes(item) ? prev.filter(a => a !== item) : [...prev, item]);
  };

  const toggleHonor = (item) => {
    setHonors(prev => prev.includes(item) ? prev.filter(a => a !== item) : [...prev, item]);
  };

  const toggleFactor = (key) => {
    setPersonalFactors(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    gpaFields.forEach(field => {
      const val = parseFloat(gpas[field.key]);
      if (isNaN(val) || val < 0 || val > field.max) {
        newErrors[field.key] = `Enter a valid GPA (0–${field.max})`;
      }
    });
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    onSubmit({
      unweighted: parseFloat(gpas.unweighted),
      weighted: parseFloat(gpas.weighted),
      academic: parseFloat(gpas.academic),
      grade10to12: parseFloat(gpas.grade10to12),
      apCourses: selectedAPs,
      sat: typeof testScores.sat === "number" ? testScores.sat : null,
      act: typeof testScores.act === "number" ? testScores.act : null,
      extracurriculars,
      honors,
      personalFactors,
    });
  };

  const isValid = gpaFields.every(f => {
    const val = parseFloat(gpas[f.key]);
    return !isNaN(val) && val >= 0 && val <= f.max;
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* GPA Inputs */}
      {gpaFields.map((field) => {
        const value = typeof gpas[field.key] === "string" ? gpas[field.key] : gpas[field.key];
        const sliderValue = typeof value === "number" ? value : parseFloat(value) || 0;
        return (
          <div key={field.key} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor={field.key} className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {field.label}
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" aria-label={`Info about ${field.label}`}>
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[240px] text-xs">
                      {field.tooltip}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id={field.key}
                type="number"
                step={field.step}
                min={0}
                max={field.max}
                value={value}
                onChange={(e) => handleInputChange(field.key, e.target.value, field.max)}
                className="w-20 h-8 text-center text-sm font-medium border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-lg"
                aria-label={`${field.label} value`}
              />
            </div>
            <Slider
              value={[sliderValue]}
              onValueChange={(val) => handleSliderChange(field.key, val)}
              max={field.max}
              step={field.step}
              className="w-full"
              aria-label={`${field.label} slider`}
            />
            <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500">
              <span>0.00</span>
              <span>{field.max.toFixed(1)}</span>
            </div>
            {errors[field.key] && (
              <p role="alert" className="text-xs text-red-500 mt-1">{errors[field.key]}</p>
            )}
          </div>
        );
      })}

      {/* Test Scores */}
      <TestScoresSection testScores={testScores} setTestScores={setTestScores} />

      {/* AP Courses */}
      <div className="border-t border-slate-100 dark:border-slate-700 pt-6">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">AP Courses</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Select all AP courses you've taken or plan to take. This helps us assess your academic rigor.
        </p>

        {selectedAPs.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {selectedAPs.map(ap => (
              <button
                key={ap}
                type="button"
                onClick={() => toggleAP(ap)}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                {ap}
                <span className="text-blue-200 hover:text-white">×</span>
              </button>
            ))}
          </div>
        )}

        <div className="space-y-5 max-h-80 overflow-y-auto pr-1 -mr-1">
          {Object.entries(apCoursesByCategory).map(([category, courses]) => (
            <div key={category}>
              <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-2">
                {apCategoryLabels[category]}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {courses.map(course => {
                  const selected = selectedAPs.includes(course.name);
                  return (
                    <button
                      key={course.name}
                      type="button"
                      onClick={() => toggleAP(course.name)}
                      className={`inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                        selected
                          ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700 font-medium"
                          : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                      }`}
                      aria-pressed={selected}
                    >
                      {selected && <Check className="w-3 h-3" />}
                      {course.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Extracurriculars & Honors */}
      <ExtracurricularsSection
        activities={extracurriculars}
        toggleActivity={toggleActivity}
        honors={honors}
        toggleHonor={toggleHonor}
      />

      {/* Personal Factors */}
      <PersonalFactorsSection factors={personalFactors} toggleFactor={toggleFactor} />

      <Button
        type="submit"
        disabled={!isValid}
        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-base font-medium gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-40 disabled:shadow-none transition-all"
      >
        Calculate My Chances
        <ArrowRight className="w-4 h-4" />
      </Button>
    </form>
  );
}