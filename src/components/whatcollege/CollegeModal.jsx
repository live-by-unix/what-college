import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp, BookOpen, Trophy, Lightbulb, GraduationCap, Award, Users, Star } from "lucide-react";

const ratingColors = {
  "Safety": "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  "Match": "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  "Reach": "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  "Ultra Reach": "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
};

const suggestionIcons = {
  gpa: BookOpen,
  rigor: Trophy,
  extracurricular: GraduationCap,
  strategy: Lightbulb,
  major: BookOpen,
  trend: TrendingUp,
  test: Star,
};

function PercentileBar({ label, value, compositeGPA }) {
  const gpa = parseFloat(compositeGPA);
  const percentage = (value / 4.0) * 100;
  const userPercentage = (gpa / 4.0) * 100;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400">{label}</span>
        <span className="font-medium text-slate-700 dark:text-slate-300">{value.toFixed(2)}</span>
      </div>
      <div className="relative h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-slate-300 dark:bg-slate-600 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full border-2 border-white dark:border-slate-800 shadow-sm transition-all duration-500"
          style={{ left: `calc(${Math.min(userPercentage, 100)}% - 6px)` }}
          aria-label={`Your GPA: ${compositeGPA}`}
        />
      </div>
    </div>
  );
}

function BonusChip({ label, value }) {
  const isPositive = value > 0;
  const isNegative = value < 0;
  return (
    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 text-center">
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`text-lg font-bold ${isPositive ? "text-emerald-600 dark:text-emerald-400" : isNegative ? "text-red-500 dark:text-red-400" : "text-slate-700 dark:text-slate-300"}`}>
        {isPositive ? "+" : ""}{value}
      </p>
    </div>
  );
}

export default function CollegeModal({ result, open, onClose, apCourses, extracurriculars, honors, personalFactors }) {
  if (!result) return null;

  const { college, chance, rating, suggestions, compositeGPA, rigorBonus, testBonus, ecBonus, honorsBonus, personalBonus, totalBonus } = result;
  const studentAPs = apCourses || [];
  const studentECs = extracurriculars || [];
  const studentHonors = honors || [];
  const factors = personalFactors || {};
  const activeFactors = [
    factors.firstGen && "First-Gen",
    factors.legacy && "Legacy",
    factors.recruitedAthlete && "Recruited Athlete",
  ].filter(Boolean);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-0 dark:border-slate-700">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-t-2xl">
          <DialogHeader>
            <DialogTitle className="text-white text-xl font-bold font-heading">{college.name}</DialogTitle>
            <DialogDescription className="text-blue-100 mt-1">
              <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{college.state}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-4 mt-5">
            <div className="text-center">
              <div className="text-4xl font-bold text-white">{chance}%</div>
              <p className="text-xs text-blue-200 mt-1">Admission Chance</p>
            </div>
            <Badge variant="outline" className={`${ratingColors[rating]} text-xs px-3 py-1 rounded-full`}>
              {rating}
            </Badge>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* GPA Percentiles */}
          <section>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              GPA Percentiles
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">
              Blue dot = your composite GPA ({compositeGPA})
            </p>
            <div className="space-y-4">
              <PercentileBar label="25th Percentile" value={college.gpa_25} compositeGPA={compositeGPA} />
              <PercentileBar label="50th Percentile (Median)" value={college.gpa_50} compositeGPA={compositeGPA} />
              <PercentileBar label="75th Percentile" value={college.gpa_75} compositeGPA={compositeGPA} />
            </div>
          </section>

          {/* Profile Bonuses */}
          <section>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Your Profile Impact
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <BonusChip label="Difficulty" value={college.difficulty_index} />
              <BonusChip label="Your GPA" value={parseFloat(compositeGPA)} />
              <BonusChip label="Total Bonus" value={totalBonus} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
              <BonusChip label="AP Rigor" value={rigorBonus} />
              <BonusChip label="Test Scores" value={testBonus} />
              <BonusChip label="Extracurriculars" value={ecBonus} />
              <BonusChip label="Honors" value={honorsBonus} />
              <BonusChip label="Personal" value={personalBonus} />
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">Difficulty</p>
                <p className="text-lg font-bold text-slate-700 dark:text-slate-300">{college.difficulty_index}/10</p>
              </div>
            </div>

            {studentAPs.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  Your AP Courses ({studentAPs.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {studentAPs.map(ap => (
                    <Badge key={ap} variant="outline" className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                      {ap}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {studentECs.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Extracurriculars ({studentECs.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {studentECs.map(ec => (
                    <Badge key={ec} variant="outline" className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800">
                      {ec}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {studentHonors.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Honors & Awards ({studentHonors.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {studentHonors.map(h => (
                    <Badge key={h} variant="outline" className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
                      {h}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {activeFactors.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Personal Factors</p>
                <div className="flex flex-wrap gap-1.5">
                  {activeFactors.map(f => (
                    <Badge key={f} variant="outline" className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800">
                      {f}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {college.majors && (
              <div className="mt-3">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Popular Majors</p>
                <div className="flex flex-wrap gap-1.5">
                  {college.majors.map(m => (
                    <Badge key={m} variant="outline" className="text-[10px] px-2 py-0.5 rounded-full bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600">
                      {m}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Improvement Suggestions
              </h3>
              <div className="space-y-3">
                {suggestions.map((s, i) => {
                  const Icon = suggestionIcons[s.type] || Lightbulb;
                  return (
                    <div key={i} className="flex gap-3 p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-100/50 dark:border-blue-900/50">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{s.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{s.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}