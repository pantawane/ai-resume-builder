import { useState, useEffect } from "react";
import api from "../configs/api";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const columns = [
  { id: "applied", label: "Applied", emoji: "🔵", color: "border-blue-400", bg: "bg-blue-50", badge: "bg-blue-100 text-blue-700" },
  { id: "interview", label: "Interview", emoji: "🟡", color: "border-yellow-400", bg: "bg-yellow-50", badge: "bg-yellow-100 text-yellow-700" },
  { id: "offer", label: "Offer", emoji: "🟢", color: "border-green-400", bg: "bg-green-50", badge: "bg-green-100 text-green-700" },
  { id: "rejected", label: "Rejected", emoji: "🔴", color: "border-red-400", bg: "bg-red-50", badge: "bg-red-100 text-red-700" },
];

const emptyForm = {
  company: "",
  position: "",
  location: "",
  salary: "",
  status: "applied",
  notes: "",
  jobUrl: "",
};

const JobTracker = () => {
  const { token } = useSelector((state) => state.auth);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editJob, setEditJob] = useState(null);
  const [expandedJob, setExpandedJob] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Load all jobs
  const loadJobs = async () => {
    try {
      const { data } = await api.get("/api/jobs/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(data.jobs);
    } catch (error) {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    loadJobs();
  }, [token]);

  // Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add or update job
  const handleSubmit = async () => {
    if (!formData.company || !formData.position) {
      toast.error("Company and position are required");
      return;
    }

    try {
      setSubmitting(true);

      if (editJob) {
        // Update existing
        const { data } = await api.put("/api/jobs/update", {
          jobId: editJob._id,
          ...formData,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(jobs.map(j => j._id === editJob._id ? data.job : j));
        toast.success("Job updated!");
      } else {
        // Add new
        const { data } = await api.post("/api/jobs/add", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs([data.job, ...jobs]);
        toast.success("Job added!");
      }

      setFormData(emptyForm);
      setShowForm(false);
      setEditJob(null);

    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  // Update job status (move between columns)
  const handleStatusChange = async (jobId, newStatus) => {
    try {
      const { data } = await api.put("/api/jobs/update", {
        jobId,
        status: newStatus,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(jobs.map(j => j._id === jobId ? data.job : j));
      toast.success(`Moved to ${newStatus}!`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  // Delete job
  const handleDelete = async (jobId) => {
    if (!window.confirm("Delete this job application?")) return;
    try {
      await api.delete(`/api/jobs/delete/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(jobs.filter(j => j._id !== jobId));
      toast.success("Deleted!");
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  // Open edit form
  const handleEdit = (job) => {
    setEditJob(job);
    setFormData({
      company: job.company,
      position: job.position,
      location: job.location || "",
      salary: job.salary || "",
      status: job.status,
      notes: job.notes || "",
      jobUrl: job.jobUrl || "",
    });
    setShowForm(true);
  };

  // Stats
  const stats = {
    total: jobs.length,
    applied: jobs.filter(j => j.status === "applied").length,
    interview: jobs.filter(j => j.status === "interview").length,
    offer: jobs.filter(j => j.status === "offer").length,
    rejected: jobs.filter(j => j.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">
              📋 Job Tracker
            </h1>
            <p className="text-gray-500">
              Track all your job applications in one place
            </p>
          </div>
          <button
            onClick={() => { setShowForm(true); setEditJob(null); setFormData(emptyForm); }}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-all active:scale-95 shadow-lg shadow-green-200"
          >
            + Add Job
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          {[
            { label: "Total", value: stats.total, color: "text-gray-800", bg: "bg-white" },
            { label: "Applied", value: stats.applied, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Interview", value: stats.interview, color: "text-yellow-600", bg: "bg-yellow-50" },
            { label: "Offer", value: stats.offer, color: "text-green-600", bg: "bg-green-50" },
            { label: "Rejected", value: stats.rejected, color: "text-red-500", bg: "bg-red-50" },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.bg} rounded-2xl border p-4 text-center`}>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Kanban Board */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="size-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {columns.map((col) => {
              const colJobs = jobs.filter(j => j.status === col.id);
              return (
                <div key={col.id} className={`${col.bg} rounded-2xl border-t-4 ${col.color} p-4`}>

                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-700">
                      {col.emoji} {col.label}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${col.badge}`}>
                      {colJobs.length}
                    </span>
                  </div>

                  {/* Job Cards */}
                  <div className="space-y-3">
                    {colJobs.length === 0 && (
                      <p className="text-center text-gray-400 text-sm py-8">
                        No applications
                      </p>
                    )}
                    {colJobs.map((job) => (
                      <div
                        key={job._id}
                        className="bg-white rounded-xl border shadow-sm p-4 hover:shadow-md transition-all"
                      >
                        {/* Job Header */}
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">
                              {job.company}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {job.position}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleEdit(job)}
                              className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 transition"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDelete(job._id)}
                              className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500 transition"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>

                        {/* Details */}
                        {job.location && (
                          <p className="text-xs text-gray-400 mt-2">
                            📍 {job.location}
                          </p>
                        )}
                        {job.salary && (
                          <p className="text-xs text-gray-400">
                            💰 {job.salary}
                          </p>
                        )}

                        {/* Date */}
                        <p className="text-xs text-gray-300 mt-2">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </p>

                        {/* Notes toggle */}
                        {job.notes && (
                          <button
                            onClick={() => setExpandedJob(expandedJob === job._id ? null : job._id)}
                            className="text-xs text-green-600 mt-2 hover:underline"
                          >
                            {expandedJob === job._id ? "Hide notes ▲" : "Show notes ▼"}
                          </button>
                        )}
                        {expandedJob === job._id && (
                          <p className="text-xs text-gray-500 mt-2 bg-gray-50 rounded p-2">
                            {job.notes}
                          </p>
                        )}

                        {/* Move to column buttons */}
                        <div className="flex flex-wrap gap-1 mt-3">
                          {columns
                            .filter(c => c.id !== col.id)
                            .map(c => (
                              <button
                                key={c.id}
                                onClick={() => handleStatusChange(job._id, c.id)}
                                className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-gray-600"
                              >
                                → {c.label}
                              </button>
                            ))
                          }
                        </div>

                        {/* Job URL */}
                        {job.jobUrl && (
                          <a
                            href={job.jobUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="block text-xs text-blue-500 hover:underline mt-2"
                          >
                            🔗 View Job Posting
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add/Edit Job Modal */}
        {showForm && (
          <div
            onClick={() => { setShowForm(false); setEditJob(null); }}
            className="fixed inset-0 bg-black/50 backdrop-blur z-50 flex items-center justify-center p-4"
          >
            <div
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-5">
                {editJob ? "✏️ Edit Application" : "➕ Add Job Application"}
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">
                    Company Name *
                  </label>
                  <input
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g. Google, TCS, Infosys"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">
                    Position *
                  </label>
                  <input
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder="e.g. Software Engineer, Marketing Manager"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-1">
                      Location
                    </label>
                    <input
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Mumbai, Remote"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-1">
                      Salary
                    </label>
                    <input
                      name="salary"
                      value={formData.salary}
                      onChange={handleChange}
                      placeholder="e.g. 12 LPA"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  >
                    <option value="applied">🔵 Applied</option>
                    <option value="interview">🟡 Interview</option>
                    <option value="offer">🟢 Offer</option>
                    <option value="rejected">🔴 Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">
                    Job URL
                  </label>
                  <input
                    name="jobUrl"
                    value={formData.jobUrl}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/jobs/..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Interview date, recruiter name, anything..."
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => { setShowForm(false); setEditJob(null); }}
                  className="flex-1 py-3 border rounded-xl text-gray-600 hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-xl font-medium transition"
                >
                  {submitting ? "Saving..." : editJob ? "Update" : "Add Job"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default JobTracker;