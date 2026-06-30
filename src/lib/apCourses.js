// Common AP Courses grouped by category
export const apCourses = [
  // STEM
  { name: "AP Calculus AB", category: "STEM" },
  { name: "AP Calculus BC", category: "STEM" },
  { name: "AP Statistics", category: "STEM" },
  { name: "AP Computer Science A", category: "STEM" },
  { name: "AP Computer Science Principles", category: "STEM" },
  { name: "AP Biology", category: "STEM" },
  { name: "AP Chemistry", category: "STEM" },
  { name: "AP Physics 1", category: "STEM" },
  { name: "AP Physics 2", category: "STEM" },
  { name: "AP Physics C: Mechanics", category: "STEM" },
  { name: "AP Physics C: E&M", category: "STEM" },
  { name: "AP Environmental Science", category: "STEM" },

  // Humanities & Social Sciences
  { name: "AP English Language", category: "Humanities" },
  { name: "AP English Literature", category: "Humanities" },
  { name: "AP US History", category: "Humanities" },
  { name: "AP World History", category: "Humanities" },
  { name: "AP European History", category: "Humanities" },
  { name: "AP US Government", category: "Humanities" },
  { name: "AP Comparative Government", category: "Humanities" },
  { name: "AP Human Geography", category: "Humanities" },
  { name: "AP Psychology", category: "Humanities" },
  { name: "AP Microeconomics", category: "Humanities" },
  { name: "AP Macroeconomics", category: "Humanities" },

  // Arts
  { name: "AP Art History", category: "Arts" },
  { name: "AP Music Theory", category: "Arts" },
  { name: "AP Studio Art", category: "Arts" },

  // World Languages
  { name: "AP Spanish Language", category: "Languages" },
  { name: "AP Spanish Literature", category: "Languages" },
  { name: "AP French Language", category: "Languages" },
  { name: "AP German Language", category: "Languages" },
  { name: "AP Latin", category: "Languages" },
  { name: "AP Chinese Language", category: "Languages" },
  { name: "AP Japanese Language", category: "Languages" },
];

export const apCategoryColors = {
  STEM: "bg-blue-50 text-blue-700 border-blue-200",
  Humanities: "bg-purple-50 text-purple-700 border-purple-200",
  Arts: "bg-pink-50 text-pink-700 border-pink-200",
  Languages: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export const apCategoryLabels = {
  STEM: "STEM",
  Humanities: "Humanities & Social Sciences",
  Arts: "Arts",
  Languages: "World Languages",
};

// Group courses by category for display
export const apCoursesByCategory = apCourses.reduce((acc, course) => {
  if (!acc[course.category]) acc[course.category] = [];
  acc[course.category].push(course);
  return acc;
}, {});

export default apCourses;