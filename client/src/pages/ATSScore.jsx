import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import api from "../configs/api";

const ATSScore = () => {
  const { token } = useSelector((state) => state.auth);
  const [allResumes, setAllResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [mode, setMode] = useState("basic"); // "basic" or "match"

  // Load user resumes when component mounts
  useState(() => {
    const loadResumes = async () => {
      try {
        setLoadingResumes(true);
        const { data } = await api.get("/api/users/resumes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllResumes(data.resumes);
      } catch (error) {
        toast.error("Failed to load resumes");
      } finally {
        setLoadingResumes(false);
      }
    };
    loadResumes();
  }, []);

  const handleAnalyze = async () => {
    if (!selectedResumeId) {
      toast.error("Please select a resume first");
      return;
    }
    if (mode === "match" && !jobDescription.trim()) {
      toast.error("Please paste a job description");
      return;
    }

    try {
      setLoading(true);
      setAnalysis(null);

      // First get the full resume data
      const { data: resumeData } = await api.get(
        `/api/resumes/get/${selectedResumeId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Send to ATS analyzer
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/ai/analyze-ats`,
        {
          resumeData: resumeData.resume,
          jobDescription: mode === "match" ? jobDescription : null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAnalysis(data.analysis);
      toast.success("Analysis complete!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  // Score color helper
  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-500";
  };

  // Score background color
  const getScoreBg = (score) => {
    if (score >= 80) return "bg-green-100 border-green-200";
    if (score >= 60) return "bg-yellow-100 border-yellow-200";
    return "bg-red-100 border-red-200";
  };

  // Progress bar color
  const getBarColor = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🎯 ATS Score Analyzer
          </h1>
          <p className="text-gray-500">
            Check how well your resume performs against ATS systems used by top companies.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setMode("basic")}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              mode === "basic"
                ? "bg-green-500 text-white shadow-md"
                : "bg-white border text-gray-600 hover:border-green-400"
            }`}
          >
            📊 Basic ATS Score
          </button>
          <button
            onClick={() => setMode("match")}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              mode === "match"
                ? "bg-green-500 text-white shadow-md"
                : "bg-white border text-gray-600 hover:border-green-400"
            }`}
          >
            🎯 Job Match Score
          </button>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 mb-6">

          {/* Resume Selector */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Select Your Resume
            </label>
            <select
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">-- Choose a resume --</option>
              {allResumes.map((resume) => (
                <option key={resume._id} value={resume._id}>
                  {resume.title}
                </option>
              ))}
            </select>
          </div>

          {/* Job Description - only show in match mode */}
          {mode === "match" && (
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Paste Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                rows={6}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
              />
            </div>
          )}

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-xl py-3 font-medium flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            {loading ? (
              <>
                <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing your resume...
              </>
            ) : (
              <>🔍 Analyze Resume</>
            )}
          </button>
        </div>

        {/* Results Section */}
        {analysis && (
          <div className="space-y-6">

            {/* Overall Score Card */}
            <div className={`rounded-2xl border p-6 text-center ${getScoreBg(analysis.overall_score)}`}>
              <p className="text-gray-600 mb-2 font-medium">Overall ATS Score</p>
              <p className={`text-7xl font-bold ${getScoreColor(analysis.overall_score)}`}>
                {analysis.overall_score}
                <span className="text-3xl">/100</span>
              </p>
              {analysis.match_score && (
                <p className="mt-3 text-gray-600">
                  Job Match Score:
                  <span className={`font-bold ml-1 ${getScoreColor(analysis.match_score)}`}>
                    {analysis.match_score}%
                  </span>
                </p>
              )}
              <p className="mt-3 text-gray-700 font-medium italic">
                "{analysis.verdict}"
              </p>
            </div>

            {/* Section Scores */}
            <div className="bg-white rounded-2xl border shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4">
                📋 Section Breakdown
              </h3>
              <div className="space-y-4">
                {Object.entries(analysis.sections).map(([key, score]) => (
                  <div key={key}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600 capitalize">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span className={`text-sm font-bold ${getScoreColor(score)}`}>
                        {score}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-700 ${getBarColor(score)}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Keywords - only in match mode */}
            {analysis.matched_keywords && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border shadow-sm p-6">
                  <h3 className="font-semibold text-green-700 mb-3">
                    ✅ Matched Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.matched_keywords.map((kw, i) => (
                      <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl border shadow-sm p-6">
                  <h3 className="font-semibold text-red-600 mb-3">
                    ❌ Missing Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missing_keywords.map((kw, i) => (
                      <span key={i} className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Strengths & Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 mb-3">
                  💪 Strengths
                </h3>
                <ul className="space-y-2">
                  {analysis.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-green-500 mt-0.5">✓</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-2xl border shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 mb-3">
                  🔧 Improvements
                </h3>
                <ul className="space-y-2">
                  {analysis.improvements.map((imp, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-orange-500 mt-0.5">→</span>
                      {imp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default ATSScore;