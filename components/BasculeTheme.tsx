"use client";

import { useEffect, useState } from "react";

export function BasculeTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stocke = window.localStorage.getItem("theme_tictactoe") as
      | "light"
      | "dark"
      | null;
    if (stocke) {
      setTheme(stocke);
      document.documentElement.setAttribute("data-theme", stocke);
    }
  }, []);

  function changerTheme() {
    const nouveau = theme === "light" ? "dark" : "light";
    setTheme(nouveau);
    document.documentElement.setAttribute("data-theme", nouveau);
    window.localStorage.setItem("theme_tictactoe", nouveau);
  }

  return (
    <label className="swap swap-rotate">
      <input
        type="checkbox"
        checked={theme === "dark"}
        onChange={changerTheme}
      />
      {/* Icône mode sombre */}
  <img
    src="/light-mode.svg"
    className="swap-on w-6 h-6"
    alt="activer mode sombre"
  />

  {/* Icône mode clair */}
  <img
    src="/dakrMode.svg"
    className="swap-off w-6 h-6"
    alt="activer mode clair"
  />
    </label>
  );
}
