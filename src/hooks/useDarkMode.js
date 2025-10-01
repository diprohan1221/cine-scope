import { useState, useEffect } from 'react';

// This is our custom hook that will manage the theme logic
export function useDarkMode() {
  // Check localStorage for a saved theme, otherwise default to 'light'
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // This function will be called by our button to switch the theme
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // This effect runs whenever the `theme` state changes
  useEffect(() => {
    const root = window.document.documentElement; // Gets the <html> element

    // Remove the old theme class and add the new one
    root.classList.remove('light', 'dark');
    root.classList.add(theme);

    // Save the user's preference in their browser for next time
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Return the current theme and the function to toggle it
  return [theme, toggleTheme];
}