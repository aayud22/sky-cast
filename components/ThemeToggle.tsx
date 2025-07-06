import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        tabIndex={-1}
        aria-label="Toggle theme"
        style={{ visibility: "hidden" }}
        className="bg-secondary rounded-full w-11 min-w-11 max-w-11 h-11 flex items-center justify-center border border-border"
      />
    );
  }

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="bg-secondary rounded-full w-11 min-w-11 max-w-11 h-11 flex items-center justify-center border border-border focus:outline-none focus:ring-0 transition-colors"
    >
      {theme === "dark" ? (
        <Moon className="w-6 h-6 text-primary" />
      ) : (
        <Sun className="w-6 h-6 text-yellow-500" />
      )}
    </button>
  );
}
