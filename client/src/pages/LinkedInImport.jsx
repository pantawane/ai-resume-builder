import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import pdfToText from "react-pdftotext";

const steps = [
  {
    number: "1",
    title: "Go to your LinkedIn Profile",
    description: 'Open LinkedIn and go to your profile page',
    icon: "🔗",
  },
  {
    number: "2",
    title: 'Click "More" button',
    description: 'Find the "More" button below your profile photo',
    icon: "⋯",
  },
  {
    number: "3",
    title: "Save to PDF",
    description: 'Click "Save to PDF" — LinkedIn generates your profile as PDF',
    icon: "📄",
  },
  {
    number: "4",
    title: "Upload here",
    description: "Upload that PDF below and AI will fill your resume!",
    icon: "⬆️",
  },
];

const LinkedInImport = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [pdfFile, setPdfFile] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    } else {
      toast.error("Please upload a PDF file only");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    } else {
      toast.error("Please upload a PDF file only");
    }
  };

  const handleImport = async () => {
    if (!pdfFile) {
      toast.error("Please upload your LinkedIn PDF first");
      return;
    }

    try {
      setLoading(true);
      toast.loading("Reading your LinkedIn profile...", { id: "import" });

      // Extract text from PDF using react-pdftotext
      const pdfText = await pdfToText(pdfFile);

      toast.loading("AI is analyzing your profile...", { id: "import" });

      // Send to backend
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/ai/import-linkedin`,
        {
          pdfText,
          title: title || "My LinkedIn Resume",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("LinkedIn profile imported!", { id: "import" });

      // Navigate to resume builder with the new resume
      navigate(`/app/builder/${data.resumeId}`);

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Import failed. Try again.",
        { id: "import" }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🔗 LinkedIn Import
          </h1>
          <p className="text-gray-500">
            Import your LinkedIn profile and AI will automatically fill your entire resume in seconds!
          </p>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-800 mb-5">
            📋 How to Import (4 Simple Steps)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl"
              >
                <div className="size-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                  {step.number}
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">
                    {step.icon} {step.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* LinkedIn button */}
          <a
            href="https://www.linkedin.com/in/me"
            target="_blank"
            rel="noreferrer"
            className="mt-5 w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
          >
            <span>🔗</span>
            Open My LinkedIn Profile
          </a>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h2 className="font-semibold text-gray-800 mb-4">
            ⬆️ Upload LinkedIn PDF
          </h2>

          {/* Resume Title */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Resume Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. My LinkedIn Resume"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* PDF Upload */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              dragOver
                ? "border-green-500 bg-green-50"
                : pdfFile
                ? "border-green-400 bg-green-50"
                : "border-gray-300 hover:border-green-400"
            }`}
          >
            {pdfFile ? (
              <div>
                <p className="text-4xl mb-2">📄</p>
                <p className="text-green-700 font-medium">{pdfFile.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {(pdfFile.size / 1024).toFixed(1)} KB
                </p>
                <button
                  onClick={() => setPdfFile(null)}
                  className="mt-3 text-xs text-red-500 hover:text-red-700"
                >
                  ✕ Remove file
                </button>
              </div>
            ) : (
              <div>
                <p className="text-4xl mb-3">📤</p>
                <p className="text-gray-600 font-medium">
                  Drag & drop your LinkedIn PDF here
                </p>
                <p className="text-gray-400 text-sm mt-1">or</p>
                <label
                  htmlFor="linkedin-pdf"
                  className="mt-3 inline-block px-6 py-2 bg-green-500 text-white rounded-xl text-sm cursor-pointer hover:bg-green-600 transition"
                >
                  Browse File
                </label>
                <input
                  id="linkedin-pdf"
                  type="file"
                  accept=".pdf"
                  hidden
                  onChange={handleFileChange}
                />
                <p className="text-xs text-gray-400 mt-3">
                  Only PDF files accepted
                </p>
              </div>
            )}
          </div>

          {/* Import Button */}
          <button
            onClick={handleImport}
            disabled={loading || !pdfFile}
            className="w-full mt-4 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-xl py-4 font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            {loading ? (
              <>
                <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                AI is importing your profile...
              </>
            ) : (
              "🚀 Import & Build Resume"
            )}
          </button>

          <p className="text-xs text-gray-400 text-center mt-3">
            Your PDF is processed locally and never stored on our servers
          </p>
        </div>

      </div>
    </div>
  );
};

export default LinkedInImport;