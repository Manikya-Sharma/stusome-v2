"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/themeContext";
import { Button } from "../ui/button";

export default function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button variant="ghost" onClick={() => toggleTheme()}>
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </Button>
  );
}
