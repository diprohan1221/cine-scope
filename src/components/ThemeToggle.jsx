import React from 'react';
import { useDarkMode } from '../hooks/useDarkMode';
import { FiSun, FiMoon } from 'react-icons/fi'; // Imports the sun and moon icons

function ThemeToggle() {
  // Use our custom hook to get the theme and the toggle function
  const [theme, toggleTheme] = useDarkMode();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <FiMoon className="w-5 h-5" /> // Show moon icon in light mode
      ) : (
        <FiSun className="w-5 h-5" /> // Show sun icon in dark mode
      )}
    </button>
  );
}

export default ThemeToggle;