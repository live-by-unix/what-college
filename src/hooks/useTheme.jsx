import { useState, useEffect } from "react";

const THEME_KEY = "whatcollege-theme";

function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

let currentTheme = getInitialTheme();

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

if (typeof window !== "undefined") {
  applyTheme(currentTheme);
}

export function useTheme() {
  const [theme, setThemeState] = useState(currentTheme);

  useEffect(() => {
    const handler = () => setThemeState(currentTheme);
    window.addEventListener("themechange", handler);
    return () => window.removeEventListener("themechange", handler);
  }, []);

  const toggleTheme = () => {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_KEY, currentTheme);
    applyTheme(currentTheme);
    window.dispatchEvent(new Event("themechange"));
  };

  return { theme, toggleTheme };
}