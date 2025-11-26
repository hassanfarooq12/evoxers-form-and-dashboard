import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAdminLoggedIn, loginAdmin } from "../auth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdminLoggedIn()) {
      navigate("/submissions");
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      loginAdmin();
      navigate("/submissions");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          Admin Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
              Username
            </label>
            <input
              className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
              Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
          )}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}


