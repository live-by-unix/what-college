import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight, Info, BookOpen, Check } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { apCoursesByCategory, apCategoryLabels } from "@/lib/apCourses";

const gpaFields = [
  {
    key: "unweighted",
    label: "Unweighted GPA",
    max: 4.0,
    step: 0.01,
    tooltip: "Your GPA on a standard 4.0 scale without extra weight for honors/AP classes.",
  },
  {
    key: "weighted",
    label: "Weighted GPA",
    max: 5.0,
    step: 0.01,
    tooltip: "Your GPA including bonus points for AP, IB, and Honors courses (up to 5.0).",
  },
  {
    key: "academic",
    label: "Academic GPA",
    max: 4.0,
    step: 0.01,
    tooltip: "GPA calculated from core academic subjects only (Math, Science, English, Social Studies, Foreign Language).",
  },
  {
    key: "grade10to12",
    label: "10–12 GPA",
    max: 4.0,
    step: 0.01,
    tooltip: "Your GPA from grades 10 through 12 only, showing your most recent academic performance.",
  },
];

export default function GPAInputForm({ onSubmit }) {
  const [gpas, setGpas] = useState({
    unweighted: 3.5,
    weighted: 3.8,
    academic: 3.5,
    grade10to12: 3.5,
  });
  const [selectedAPs, setSelectedAPs] = useState([]);
  const [errors, setErrors] = useState({});

  const handleSliderChange = (key, value) => {
    setGpas(prev => ({ ...prev, [key]: value[0] }));
    setErrors(prev => ({ ...prev, [key]: null }));
  };

  const handleInputChange = (key, value, max) => {
    const num = parseFloat(value);
    if (value === "" || value === ".") {
      setGpas(prev => ({ ...prev, [key]: value }));
      return;
    }
    if (isNaN(num)) return;
    if (num < 0) {
      setErrors(prev => ({ ...prev, [key]: "GPA cannot be negative" }));
      return;
    }
    if (num > max) {
      setErrors(prev => ({ ...prev, [key]: `Maximum is ${max}` }));
      return;
    }
    setErrors(prev => ({ ...prev, [key]: null }));
    setGpas(prev => ({ ...prev, [key]: num }));
  };

  const toggleAP = (apName) => {
    setSelectedAPs(prev =>
      prev.includes(apName)
        ? prev.filter(a => a !== apName)
        : [...prev, apName]
    );
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
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit({
      unweighted: parseFloat(gpas.unweighted),
      weighted: parseFloat(gpas.weighted),
      academic: parseFloat(gpas.academic),
      grade10to12: parseFloat(gpas.grade10to12),
      apCourses: selectedAPs,
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
                <Label htmlFor={field.key} className="text-sm font-medium text-slate-700">
                  {field.label}
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="text-slate-400 hover:text-slate-600 transition-colors" aria-label={`Info about ${field.label}`}>
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
                className="w-20 h-8 text-center text-sm font-medium border-slate-200 rounded-lg"
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
            <div className="flex justify-between text-xs text-slate-400">
              <span>0.00</span>
              <span>{field.max.toFixed(1)}</span>
            </div>
            {errors[field.key] && (
              <p role="alert" className="text-xs text-red-500 mt-1">{errors[field.key]}</p>
            )}
          </div>
        );
      })}

      {/* Divider */}
      <div className="border-t border-slate-100 pt-6">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-semibold text-slate-900">AP Courses</h2>
        </div>
        <p className="text-xs text-slate-500 mb-4">
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
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
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
                          ? "bg-blue-50 text-blue-700 border-blue-300 font-medium"
                          : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
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