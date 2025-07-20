import { createContext, useCallback, useContext, useState } from "react";
import React from "react";

type ThemeContextType = {
  theme: "light" | "dark";
  setTheme: (_: { theme: "light" | "dark" }) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("Theme context not provided");
  }
  return context;
};

export const ThemeProvider = ({
  children,
  theme,
}: {
  theme?: "dark" | "light";
  children: React.ReactNode;
}) => {
  const [themeState, setThemeState] = useState(theme ?? "dark");
  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);
  return (
    <ThemeContext.Provider
      value={{
        theme: themeState ?? "dark",
        setTheme: ({ theme: newTheme }) => setThemeState(newTheme),
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
