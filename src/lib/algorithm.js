/**
 * WhatCollege? Admission Prediction Algorithm
 */

// Step 1: Normalize GPA to 0-100 scale
function normalizeGPA(gpa, maxScale = 4.0) {
  return Math.min((gpa / maxScale) * 100, 100);
}

// Step 2: Compute composite GPA score
function computeCompositeScore(gpas) {
  const { unweighted, weighted, academic, grade10to12 } = gpas;
  const normalized = {
    unweighted: normalizeGPA(unweighted, 4.0),
    weighted: normalizeGPA(weighted, 5.0),
    academic: normalizeGPA(academic, 4.0),
    grade10to12: normalizeGPA(grade10to12, 4.0),
  };
  const composite =
    normalized.unweighted * 0.35 +
    normalized.weighted * 0.25 +
    normalized.academic * 0.20 +
    normalized.grade10to12 * 0.20;
  return { composite, normalized };
}

// Step 3: Percentile comparison
function percentileScore(compositeGPA, college) {
  const gpa = compositeGPA / 100 * 4.0; // convert back to 4.0 scale for comparison
  const { gpa_25, gpa_50, gpa_75 } = college;

  if (gpa >= gpa_75) {
    return 85 + ((gpa - gpa_75) / (4.0 - gpa_75)) * 15;
  } else if (gpa >= gpa_50) {
    return 55 + ((gpa - gpa_50) / (gpa_75 - gpa_50)) * 30;
  } else if (gpa >= gpa_25) {
    return 25 + ((gpa - gpa_25) / (gpa_50 - gpa_25)) * 30;
  } else {
    return Math.max(0, (gpa / gpa_25) * 25);
  }
}

// Step 4: Difficulty adjustment
function applyDifficultyAdjustment(baseScore, difficultyIndex) {
  return baseScore - (difficultyIndex * 3.5);
}

// Step 4b: AP rigor bonus — offsets difficulty penalty
function computeRigorBonus(apCourses, college) {
  if (!apCourses || apCourses.length === 0) return 0;

  const count = apCourses.length;
  // Base bonus: diminishing returns per AP
  // 1 AP = +1.5, 5 APs = +5.3, 10 APs = +7.6, capped at +10
  let bonus = Math.min(10, 1.5 * count * (1 - count * 0.03));

  // Category alignment bonus: APs in subjects the college is known for
  const stemAPs = apCourses.filter(a =>
    a.includes("Calculus") || a.includes("Computer Science") || a.includes("Physics") ||
    a.includes("Chemistry") || a.includes("Biology") || a.includes("Statistics") ||
    a.includes("Environmental Science")
  );
  const humanitiesAPs = apCourses.filter(a =>
    a.includes("English") || a.includes("History") || a.includes("Government") ||
    a.includes("Economics") || a.includes("Psychology") || a.includes("Geography")
  );

  if (college.majors) {
    const isSTEMCollege = college.majors.some(m =>
      ["Engineering", "Computer Science", "Physics", "Mathematics", "Chemistry", "Biology"].includes(m)
    );
    const isHumanitiesCollege = college.majors.some(m =>
      ["Economics", "Government", "Political Science", "History", "English", "International Relations"].includes(m)
    );

    if (isSTEMCollege && stemAPs.length > 0) {
      bonus += Math.min(3, stemAPs.length * 0.8);
    }
    if (isHumanitiesCollege && humanitiesAPs.length > 0) {
      bonus += Math.min(2, humanitiesAPs.length * 0.6);
    }
  }

  return bonus;
}

// Step 5: Clamp to 0-100
function clamp(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

// Step 6: Determine rating
function getRating(chance) {
  if (chance < 15) return "Ultra Reach";
  if (chance < 40) return "Reach";
  if (chance < 75) return "Match";
  return "Safety";
}

// Step 7: Generate suggestions
function generateSuggestions(gpas, normalized, college, chance, apCourses) {
  const suggestions = [];
  const { unweighted, weighted, academic, grade10to12 } = normalized;
  const weakest = Object.entries({ unweighted, weighted, academic, grade10to12 })
    .sort(([, a], [, b]) => a - b);
  const weakestKey = weakest[0][0];

  const nameMap = {
    unweighted: "Unweighted GPA",
    weighted: "Weighted GPA",
    academic: "Academic GPA",
    grade10to12: "10-12 GPA"
  };

  const apCount = apCourses ? apCourses.length : 0;

  // Weakest GPA
  if (weakest[0][1] < 85) {
    suggestions.push({
      type: "gpa",
      title: `Strengthen your ${nameMap[weakestKey]}`,
      description: `Your ${nameMap[weakestKey]} is your weakest area. Focus on improving grades in core academic courses.`,
    });
  }

  // AP rigor suggestions
  const stemAPs = apCourses ? apCourses.filter(a =>
    a.includes("Calculus") || a.includes("Computer Science") || a.includes("Physics") ||
    a.includes("Chemistry") || a.includes("Biology") || a.includes("Statistics") ||
    a.includes("Environmental Science")
  ) : [];

  if (college.difficulty_index >= 8) {
    if (apCount === 0) {
      suggestions.push({
        type: "rigor",
        title: "Take AP/IB Courses",
        description: "This highly selective school expects significant academic rigor. Aim for 8+ AP courses by graduation to remain competitive.",
      });
    } else if (apCount < 5) {
      suggestions.push({
        type: "rigor",
        title: "Add More AP Courses",
        description: `You've taken ${apCount} AP course${apCount === 1 ? "" : "s"}. For this highly selective school, aim for 8+ APs — especially in your areas of interest.`,
      });
    }
    suggestions.push({
      type: "extracurricular",
      title: "Develop Leadership & Depth",
      description: "Highly selective schools value deep involvement. Lead clubs, compete nationally, or pursue meaningful research projects.",
    });
  } else if (college.difficulty_index >= 5) {
    if (apCount === 0) {
      suggestions.push({
        type: "rigor",
        title: "Add AP/Honors Courses",
        description: "Consider taking 4-6 AP courses to strengthen your academic profile for this competitive school.",
      });
    } else if (apCount < 4) {
      suggestions.push({
        type: "rigor",
        title: "Add a Few More APs",
        description: `You've taken ${apCount} AP course${apCount === 1 ? "" : "s"}. Adding 2-3 more would strengthen your profile for this school.`,
      });
    }
  }

  // STEM-specific AP suggestions
  if (college.majors && college.majors.some(m => ["Engineering", "Computer Science", "Mathematics", "Physics"].includes(m))) {
    if (gpas.academic < 3.7 || stemAPs.length === 0) {
      const missing = [];
      if (!apCourses || !apCourses.some(a => a.includes("Calculus"))) missing.push("AP Calculus");
      if (!apCourses || !apCourses.some(a => a.includes("Physics"))) missing.push("AP Physics");
      if (!apCourses || !apCourses.some(a => a.includes("Computer Science"))) missing.push("AP Computer Science");
      suggestions.push({
        type: "major",
        title: "Take STEM AP Courses",
        description: `This school is strong in STEM. ${missing.length > 0 ? `Consider adding: ${missing.join(", ")}.` : "Your STEM APs align well with this school."}`,
      });
    }
  }

  // Business/Economics AP suggestions
  if (college.majors && college.majors.some(m => ["Business", "Economics", "Finance"].includes(m))) {
    const hasEconAP = apCourses && apCourses.some(a => a.includes("Economics"));
    if (!hasEconAP) {
      suggestions.push({
        type: "major",
        title: "Take AP Economics",
        description: "This school is strong in business. AP Microeconomics or Macroeconomics would align well with your interests.",
      });
    }
  }

  // Positive rigor feedback
  if (apCount >= 8 && college.difficulty_index >= 7) {
    suggestions.push({
      type: "rigor",
      title: "Strong Course Rigor!",
      description: `With ${apCount} AP courses, your academic rigor is impressive. Highlight this in your application — selective schools value this highly.`,
    });
  }

  // Chance-based suggestions
  if (chance < 30) {
    suggestions.push({
      type: "strategy",
      title: "Focus on Stand-Out Factors",
      description: "With a lower admission chance, strong essays, letters of recommendation, and unique experiences become critical differentiators.",
    });
  }

  // Grade trend
  if (gpas.grade10to12 > gpas.unweighted) {
    suggestions.push({
      type: "trend",
      title: "Great Upward Trend!",
      description: "Your improving grades in 10-12 show growth — highlight this trajectory in your application essays.",
    });
  } else if (gpas.grade10to12 < gpas.unweighted - 0.2) {
    suggestions.push({
      type: "trend",
      title: "Address Grade Dip",
      description: "Your recent grades have dipped. Consider how to explain this and show recovery in your application.",
    });
  }

  return suggestions.slice(0, 5);
}

// Main function
export function predictAdmission(gpas, college) {
  const { composite, normalized } = computeCompositeScore(gpas);
  const baseScore = percentileScore(composite, college);
  const difficultyAdjusted = applyDifficultyAdjustment(baseScore, college.difficulty_index);
  const rigorBonus = computeRigorBonus(gpas.apCourses || [], college);
  const adjusted = difficultyAdjusted + rigorBonus;
  const chance = clamp(adjusted);
  const rating = getRating(chance);
  const suggestions = generateSuggestions(gpas, normalized, college, chance, gpas.apCourses || []);

  return {
    chance,
    rating,
    suggestions,
    compositeGPA: (composite / 100 * 4.0).toFixed(2),
    normalized,
    rigorBonus: Math.round(rigorBonus * 10) / 10,
  };
}

// Process all colleges
export function predictAll(gpas, colleges) {
  return colleges.map(college => ({
    college,
    ...predictAdmission(gpas, college),
  }));
}

export { getRating };