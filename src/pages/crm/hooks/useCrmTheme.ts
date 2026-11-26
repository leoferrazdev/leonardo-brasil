import { useEffect, useState } from "react";

export type CrmTheme = "dark" | "light";

const THEME_STORAGE_KEY = "crm_theme";
const THEME_EVENT = "crm-theme-change";

function readStoredTheme(): CrmTheme {
  if (typeof window === "undefined") return "dark";
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  return saved === "light" ? "light" : "dark";
}

export function useCrmTheme() {
  const [theme, setTheme] = useState<CrmTheme>(readStoredTheme);

  useEffect(() => {
    document.documentElement.dataset.crmTheme = theme;
  }, [theme]);

  useEffect(() => {
    const handleSync = (e: Event) => {
      const custom = e as CustomEvent<CrmTheme>;
      if (custom.detail === "dark" || custom.detail === "light") {
        setTheme(custom.detail);
      }
    };
    window.addEventListener(THEME_EVENT, handleSync);
    return () => window.removeEventListener(THEME_EVENT, handleSync);
  }, []);

  const toggleTheme = () => {
    const next: CrmTheme = theme === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_STORAGE_KEY, next);
    setTheme(next);
    window.dispatchEvent(new CustomEvent<CrmTheme>(THEME_EVENT, { detail: next }));
  };

  return { theme, toggleTheme, isDark: theme === "dark" };
}
