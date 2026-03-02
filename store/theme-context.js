import { createContext, useState } from "react";
import { GlobalStyles } from "../constants/styles";

export const ThemeContext = createContext({
  isDark: true,
  colors: {},
  toggleTheme: () => {},
});

export function ThemeContextProvider({ children }) {
  const [isDark, setIsDark] = useState(true);

  function toggleTheme() {
    setIsDark(!isDark);
  }

  const colors = {
    background: isDark ? GlobalStyles.colors.gray700 : "#f4f5f7",

    card: isDark ? GlobalStyles.colors.gray500 : "#ffffff",

    header: isDark ? GlobalStyles.colors.gray700 : "#ffffff",

    text: isDark ? "white" : "#1f2937",

    textMuted: isDark ? GlobalStyles.colors.primary100 : "#6b7280",

    primary: isDark ? GlobalStyles.colors.primary500 : "#3b82f6",

    accent: isDark ? "white" : "#3b82f6",

    error: isDark ? GlobalStyles.colors.error500 : "#ef4444",
  };

  return (
    <ThemeContext.Provider value={{ isDark, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
