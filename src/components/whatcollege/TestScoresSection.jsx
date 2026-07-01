import React from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText } from "lucide-react";

const fields = [
  { key: "sat", label: "SAT Score", min: 400, max: 1600, step: 10, placeholder: "e.g. 1450" },
  { key: "act", label: "ACT Score", min: 1, max: 36, step: 1, placeholder: "e.g. 32" },
];

export default function TestScoresSection({ testScores, setTestScores }) {
  const handleSlider = (key, value) => {
    setTestScores(prev => ({ ...prev, [key]: value[0] }));
  };

  const handleInput = (key, value, min, max) => {
    if (value === "") {
      setTestScores(prev => ({ ...prev, [key]: "" }));
      return;
    }
    const num = parseInt(value);
    if (isNaN(num)) return;
    setTestScores(prev => ({ ...prev, [key]: Math.max(min, Math.min(max, num)) }));
  };

  return (
    <div className="border-t border-slate-100 dark:border-slate-700 pt-6">
      <div className="flex items-center gap-2 mb-1">
        <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Test Scores</h2>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
        Enter your SAT or ACT score if you've taken one. Leave at minimum if test-optional.
      </p>
      <div className="space-y-6">
        {fields.map(field => {
          const value = testScores[field.key];
          const sliderValue = typeof value === "number" ? value : 0;
          return (
            <div key={field.key} className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">{field.label}</Label>
                <Input
                  type="number"
                  step={field.step}
                  min={field.min}
                  max={field.max}
                  value={value}
                  placeholder={field.placeholder}
                  onChange={e => handleInput(field.key, e.target.value, field.min, field.max)}
                  className="w-24 h-8 text-center text-sm font-medium border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-lg"
                  aria-label={`${field.label} value`}
                />
              </div>
              <Slider
                value={[sliderValue]}
                onValueChange={val => handleSlider(field.key, val)}
                min={field.min}
                max={field.max}
                step={field.step}
                className="w-full"
                aria-label={`${field.label} slider`}
              />
              <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500">
                <span>{field.min}</span>
                <span>{field.max}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}