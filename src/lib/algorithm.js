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
  const gpa = compositeGPA / 100 * 4.0;
  const { gpa_25, gpa_50, gpa_75 } = college;

  if (gpa >= gpa_75) {
    const range = 4.0 - gpa_75;
    if (range <= 0) return 100;
    return 85 + ((gpa - gpa_75) / range) * 15;
  } else if (gpa >= gpa_50) {
    const range = gpa_75 - gpa_50;
    if (range <= 0) return 70;
    return 55 + ((gpa - gpa_50) / range) * 30;
  } else if (gpa >= gpa_25) {
    const range = gpa_50 - gpa_25;
    if (range <= 0) return 40;
    return 25 + ((gpa - gpa_25) / range) * 30;
  } else {
    if (gpa_25 <= 0) return 0;
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
  let bonus = Math.min(10, 1.5 * count * (1 - count * 0.03));

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

// Step 4c: Test score bonus (SAT/ACT)
function computeTestScoreBonus(profile, college) {
  const { sat, act } = profile;
  let bonus = 0;
  const weight = 0.7 + college.difficulty_index * 0.05;

  if (sat && sat >= 400) {
    if (sat >= 1550) bonus = 8;
    else if (sat >= 1500) bonus = 6;
    else if (sat >= 1450) bonus = 5;
    else if (sat >= 1400) bonus = 4;
    else if (sat >= 1300) bonus = 2;
    else if (sat >= 1200) bonus = 0;
    else bonus = -3;
    bonus *= weight;
  } else if (act && act >= 1) {
    if (act >= 35) bonus = 8;
    else if (act >= 33) bonus = 6;
    else if (act >= 31) bonus = 5;
    else if (act >= 29) bonus = 4;
    else if (act >= 27) bonus = 2;
    else if (act >= 24) bonus = 0;
    else bonus = -3;
    bonus *= weight;
  }

  return bonus;
}

// Step 4d: Extracurricular bonus
function computeExtracurricularBonus(activities) {
  if (!activities || activities.length === 0) return 0;
  const count = activities.length;
  let bonus = Math.min(8, 1.5 * count * (1 - count * 0.04));

  const leadership = activities.filter(a =>
    a.includes("President") || a.includes("Officer") || a.includes("Founder") || a.includes("Leader")
  );
  const research = activities.filter(a =>
    a.includes("Research") || a.includes("Published") || a.includes("Internship")
  );
  bonus += Math.min(3, leadership.length * 1.2);
  bonus += Math.min(2, research.length * 1.0);

  return bonus;
}

// Step 4e: Honors bonus
function computeHonorsBonus(honors) {
  if (!honors || honors.length === 0) return 0;
  return Math.min(5, honors.length * 1.5);
}

// Step 4f: Personal factors bonus
function computePersonalFactorsBonus(factors, college) {
  if (!factors) return 0;
  let bonus = 0;
  if (factors.firstGen) bonus += 2;
  if (factors.legacy && college.difficulty_index >= 7) bonus += 2;
  if (factors.recruitedAthlete) bonus += 4;
  return bonus;
}

// Step 5: Clamp to 0-100
function clamp(value) {
  if (isNaN(value)) return 0;
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
  const ecCount = gpas.extracurriculars ? gpas.extracurriculars.length : 0;
  const honorsCount = gpas.honors ? gpas.honors.length : 0;

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

  // Test score suggestions
  if (gpas.sat && gpas.sat < 1300 && college.difficulty_index >= 7) {
    suggestions.push({
      type: "test",
      title: "Consider Retaking the SAT",
      description: `Your SAT score of ${gpas.sat} is below the typical range for this selective school. Aiming for 1450+ would significantly improve your chances.`,
    });
  }
  if (gpas.act && gpas.act < 28 && college.difficulty_index >= 7) {
    suggestions.push({
      type: "test",
      title: "Consider Retaking the ACT",
      description: `Your ACT score of ${gpas.act} is below the typical range for this selective school. Aiming for 32+ would significantly improve your chances.`,
    });
  }

  // Extracurricular suggestions
  if (ecCount === 0 && college.difficulty_index >= 6) {
    suggestions.push({
      type: "extracurricular",
      title: "Get Involved Outside Class",
      description: "This school values well-rounded applicants. Join clubs, volunteer, or pursue leadership roles in activities you're passionate about.",
    });
  } else if (ecCount > 0 && ecCount < 3 && college.difficulty_index >= 7) {
    suggestions.push({
      type: "extracurricular",
      title: "Deepen Your Extracurriculars",
      description: `You have ${ecCount} activit${ecCount === 1 ? "y" : "ies"}. Selective schools prefer depth — seek leadership roles or state/national-level achievement in your top activities.`,
    });
  }

  // Honors suggestions
  if (honorsCount === 0 && college.difficulty_index >= 8) {
    suggestions.push({
      type: "extracurricular",
      title: "Pursue Recognized Awards",
      description: "Elite schools look for distinguished achievements. Consider National Merit, Scholastic Awards, or state/national competitions.",
    });
  }

  // Positive rigor feedback
  if (apCount >= 8 && college.difficulty_index >= 7) {
    suggestions.push({
      type: "rigor",
      title: "Strong Course Rigor!",
      description: `With ${apCount} AP courses, your academic rigor is impressive. Highlight this in your application — selective schools value this highly.`,
    });
  }

  // Positive extracurricular feedback
  if (ecCount >= 4) {
    const hasLeadership = gpas.extracurriculars && gpas.extracurriculars.some(a =>
      a.includes("President") || a.includes("Officer") || a.includes("Founder") || a.includes("Leader")
    );
    if (hasLeadership) {
      suggestions.push({
        type: "extracurricular",
        title: "Strong Extracurricular Profile!",
        description: `With ${ecCount} activities including leadership roles, your profile stands out. Emphasize your impact and growth in your application essays.`,
      });
    }
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

  return suggestions.slice(0, 6);
}

// Main function
export function predictAdmission(gpas, college) {
  const { composite, normalized } = computeCompositeScore(gpas);
  const baseScore = percentileScore(composite, college);
  const difficultyAdjusted = applyDifficultyAdjustment(baseScore, college.difficulty_index);
  const rigorBonus = computeRigorBonus(gpas.apCourses || [], college);
  const testBonus = computeTestScoreBonus(gpas, college);
  const ecBonus = computeExtracurricularBonus(gpas.extracurriculars || []);
  const honorsBonus = computeHonorsBonus(gpas.honors || []);
  const personalBonus = computePersonalFactorsBonus(gpas.personalFactors || {}, college);
  const totalBonus = rigorBonus + testBonus + ecBonus + honorsBonus + personalBonus;
  const adjusted = difficultyAdjusted + totalBonus;
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
    testBonus: Math.round(testBonus * 10) / 10,
    ecBonus: Math.round(ecBonus * 10) / 10,
    honorsBonus: Math.round(honorsBonus * 10) / 10,
    personalBonus: Math.round(personalBonus * 10) / 10,
    totalBonus: Math.round(totalBonus * 10) / 10,
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