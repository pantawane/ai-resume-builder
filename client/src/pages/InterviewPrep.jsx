import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import api from "../configs/api";

const difficultyColor = {
  Easy: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Hard: "bg-red-100 text-red-700",
};

const categories = [
  { key: "technical", label: "💻 Technical", desc: "Based on your skills" },
  { key: "behavioral", label: "🤝 Behavioral", desc: "HR & soft skills" },
  { key: "situational", label: "🎯 Situational", desc: "Scenario based" },
  { key: "resume_based", label: "📄 Resume Based", desc: "From your experience" },
];

const InterviewPrep = () => {
  const { token } = useSelector((state) => state.auth);
  const [allResumes, setAllResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("technical");
  const [expandedIndex, setExpandedIndex] = useState(null);

  // Load resumes
  useState(() => {
    const loadResumes = async () => {
      try {
        const { data } = await api.get("/api/users/resumes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllResumes(data.resumes);
      } catch (error) {
        toast.error("Failed to load resumes");
      }
    };
    loadResumes();
  }, []);

  const handleGenerate = async () => {
    if (!selectedResumeId) {
      toast.error("Please select a resume first");
      return;
    }

    try {
      setLoading(true);
      setQuestions(null);
      setExpandedIndex(null);

      // Get full resume data
      const { data: resumeData } = await api.get(
        `/api/resumes/get/${selectedResumeId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Generate questions
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/ai/interview-questions`,
        {
          resumeData: resumeData.resume,
          jobTitle: jobTitle,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setQuestions(data.questions);
      toast.success("Interview questions ready!");

    } catch (error) {
      toast.error(error.response?.data?.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🎤 Interview Prep
          </h1>
          <p className="text-gray-500">
            AI generates personalized interview questions based on YOUR resume.
            Practice before the real interview!
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

            {/* Resume Selector */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Select Resume
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

            {/* Job Title */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Target Job Title
                <span className="text-gray-400 font-normal"> (optional)</span>
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-xl py-3 font-medium flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            {loading ? (
              <>
                <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating questions...
              </>
            ) : (
              "🎯 Generate Interview Questions"
            )}
          </button>
        </div>

        {/* Questions Section */}
        {questions && (
          <div>
            {/* Candidate Info */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
              <p className="text-green-700 font-medium">
                ✅ Generated for: {questions.candidate_name} — {questions.job_title}
              </p>
              <p className="text-green-600 text-sm mt-1">
                16 personalized questions across 4 categories
              </p>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => {
                    setActiveCategory(cat.key);
                    setExpandedIndex(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeCategory === cat.key
                      ? "bg-green-500 text-white shadow-md"
                      : "bg-white border text-gray-600 hover:border-green-400"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Category Description */}
            <p className="text-sm text-gray-500 mb-4">
              {categories.find((c) => c.key === activeCategory)?.desc}
            </p>

            {/* Questions List */}
            <div className="space-y-3">
              {questions[activeCategory]?.map((q, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl border shadow-sm overflow-hidden"
                >
                  {/* Question Header */}
                  <button
                    onClick={() =>
                      setExpandedIndex(expandedIndex === index ? null : index)
                    }
                    className="w-full text-left p-5 flex items-start justify-between gap-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-green-500 font-bold text-lg mt-0.5">
                        Q{index + 1}
                      </span>
                      <p className="text-gray-800 font-medium">{q.question}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColor[q.difficulty]}`}>
                        {q.difficulty}
                      </span>
                      <span className="text-gray-400">
                        {expandedIndex === index ? "▲" : "▼"}
                      </span>
                    </div>
                  </button>

                  {/* Tip - shown when expanded */}
                  {expandedIndex === index && (
                    <div className="px-5 pb-5 border-t bg-green-50">
                      <p className="text-sm text-green-700 mt-3">
                        <span className="font-semibold">💡 Tip: </span>
                        {q.tip}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewPrep;