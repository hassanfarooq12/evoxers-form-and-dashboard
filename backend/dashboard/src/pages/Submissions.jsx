import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import Layout from "../Layout";

export default function Submissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/all");
      setSubmissions(res.data || []);
    } catch (e) {
      console.error("Failed to fetch submissions", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return submissions.filter((s) => {
      return (
        (s.full_name || "").toLowerCase().includes(q) ||
        (s.work_email || "").toLowerCase().includes(q) ||
        (s.phone || "").toLowerCase().includes(q)
      );
    });
  }, [submissions, search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this submission?")) return;
    try {
      await api.delete(`/${id}`);
      await fetchSubmissions();
    } catch (e) {
      console.error("Failed to delete submission", e);
    }
  };

  const handleExportCsv = () => {
    if (filtered.length === 0) return;

    const headers = [
      "id",
      "full_name",
      "work_email",
      "phone",
      "created_at",
      "services",
      "web_services",
      "ad_goal",
      "business_model",
    ];

    const rows = filtered.map((s) =>
      headers
        .map((h) => {
          const val = s[h] ?? "";
          return `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(",")
    );

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `submissions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Submissions</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Viewing {filtered.length} of {submissions.length}
          </p>
        </div>
        <button
          onClick={handleExportCsv}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded text-sm"
          disabled={filtered.length === 0}
        >
          Export CSV
        </button>
      </div>

      <div className="mb-4">
        <input
          placeholder="Search by name, email, phone..."
          className="w-full max-w-md px-3 py-2 border rounded bg-white dark:bg-gray-900 dark:border-gray-700"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No submissions found.</p>
      ) : (
        <div className="overflow-auto border border-gray-200 dark:border-gray-700 rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-left">Email</th>
                <th className="px-3 py-2 text-left">Phone</th>
                <th className="px-3 py-2 text-left">Created</th>
                <th className="px-3 py-2 text-left">Services</th>
                <th className="px-3 py-2 text-left">Web Services</th>
                <th className="px-3 py-2 text-left">Ad Goal</th>
                <th className="px-3 py-2 text-left">Business Model</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr
                  key={s.id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-3 py-2">{s.full_name}</td>
                  <td className="px-3 py-2">{s.work_email}</td>
                  <td className="px-3 py-2">{s.phone}</td>
                  <td className="px-3 py-2">
                    {s.created_at
                      ? new Date(s.created_at).toLocaleString()
                      : "-"}
                  </td>
                  <td className="px-3 py-2">{s.services}</td>
                  <td className="px-3 py-2">{s.web_services}</td>
                  <td className="px-3 py-2">{s.ad_goal}</td>
                  <td className="px-3 py-2">{s.business_model}</td>
                  <td className="px-3 py-2 text-right space-x-2">
                    <button
                      className="px-2 py-1 text-xs rounded bg-blue-500 text-white"
                      onClick={() => navigate(`/submissions/${s.id}`)}
                    >
                      View
                    </button>
                    <button
                      className="px-2 py-1 text-xs rounded bg-red-500 text-white"
                      onClick={() => handleDelete(s.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}


