import { useEffect, useState } from "react";
const STORAGE_KEY = "assessment-theme";
export default function useTheme() {
const [theme, setTheme] = useState(() => {
try {
const savedTheme = localStorage.getItem(STORAGE_KEY);
  if (savedTheme === "light" || savedTheme === "dark") {
  return savedTheme;
  }
} catch {
// Continue with the default theme if storage is unavailable.
}

return "light";
});
useEffect(() => {
document.documentElement.classList.toggle("dark", theme === "dark");
try {
  localStorage.setItem(STORAGE_KEY, theme);
} catch {
 // The theme still works for the current session.
}
}, [theme]);
const toggleTheme = () => {
setTheme((currentTheme) =>
currentTheme === "light" ? "dark" : "light"
);
};
return { theme, toggleTheme };
}