import { useTheme } from "app/hooks/use-theme";
import { Moon, Sun } from "lucide-react";

export function DarkModeToggle() {
  const { isDarkTheme, toggleDarkMode } = useTheme();

  return (
    <div className="bg-light-gray dark:bg-very-dark-gray flex justify-center rounded-md py-3.5">
      <button
        onClick={toggleDarkMode}
        className="text-medium-gray flex items-center gap-6"
      >
        <span>
          <Sun width={20} height={20} />
        </span>
        <div className="bg-main-purple hover:bg-main-purple-hover w-10 cursor-pointer rounded-full p-1">
          <div
            className={`h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${isDarkTheme ? "translate-x-5" : ""}`}
          />
        </div>
        <span>
          <Moon width={20} height={20} />
        </span>
      </button>
    </div>
  );
}
