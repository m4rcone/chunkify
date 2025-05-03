import { useEffect, useState } from "react";

export function useTheme() {
  const [isDarkTheme, setIsDarkMode] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const isDark = storedTheme === "dark";
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }
    localStorage.setItem("theme", isDarkTheme ? "dark" : "light");
    document.documentElement.classList.toggle("dark", isDarkTheme);
  }, [isDarkTheme]);

  const handleToggle = () => {
    if (!isReady) {
      return;
    }
    setIsDarkMode((prevState) => !prevState);
  };

  return { isDarkTheme, toggleDarkMode: handleToggle, isReady };
}
