import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutAdmin } from "./auth";

export default function Layout({ children }) {
  const [theme, setTheme] = useState(
    localStorage.getItem("dashboard-theme") || "light"
  );
  const navigate = useNavigate();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("dashboard-theme", theme);
  }, [theme]);

  const handleLogout = () => {
    logoutAdmin();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Admin Dashboard
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/submissions"
            className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100"
          >
            Submissions
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <button
            onClick={() =>
              setTheme((prev) => (prev === "light" ? "dark" : "light"))
            }
            className="w-full px-3 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm"
          >
            Toggle {theme === "light" ? "Dark" : "Light"} Mode
          </button>
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2 rounded bg-red-500 text-white text-sm hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}


