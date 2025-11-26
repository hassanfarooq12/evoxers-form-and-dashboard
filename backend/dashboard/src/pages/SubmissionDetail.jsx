import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import Layout from "../Layout";

export default function SubmissionDetail() {
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOne = async () => {
      try {
        const res = await api.get(`/${id}`);
        setSubmission(res.data);
      } catch (e) {
        console.error("Failed to fetch submission", e);
      } finally {
        setLoading(false);
      }
    };
    fetchOne();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    );
  }

  if (!submission) {
    return (
      <Layout>
        <p className="text-red-500">Submission not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-3 py-2 rounded bg-blue-500 text-white text-sm"
        >
          Back
        </button>
      </Layout>
    );
  }

  const entries = Object.entries(submission);

  return (
    <Layout>
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-3 py-2 rounded bg-gray-200 dark:bg-gray-700 text-sm"
      >
        Back
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-2">Submission Details</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {entries.map(([key, value]) => (
            <div
              key={key}
              className="border border-gray-200 dark:border-gray-700 rounded p-3"
            >
              <p className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">
                {key}
              </p>
              <p className="text-sm break-words">
                {value == null || value === "" ? "—" : String(value)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}


