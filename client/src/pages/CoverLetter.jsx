import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { Copy, Download, Sparkles, FileText } from "lucide-react";

const CoverLetter = () => {

  // Form state - stores what user types
  const [formData, setFormData] = useState({
    userName: "",
    jobTitle: "",
    companyName: "",
    skills: "",
    experience: "",
  });

  // Stores the AI generated cover letter
  const [coverLetter, setCoverLetter] = useState("");

  // Loading state - shows spinner while AI is working
  const [loading, setLoading] = useState(false);

  // Get token from Redux store (for authentication)
  const { token } = useSelector((state) => state.auth);

  // Updates form when user types
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Called when user clicks "Generate" button
  const handleGenerate = async () => {
    // Validate required fields
    if (!formData.userName || !formData.jobTitle || !formData.companyName) {
      toast.error("Please fill in your name, job title and company name");
      return;
    }

    try {
      setLoading(true);
      console.log("Token:", token);
      // Send data to our new backend route
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/ai/cover-letter`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Save the response
      setCoverLetter(data.coverLetter);
      toast.success("Cover letter generated!");

    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    toast.success("Copied to clipboard!");
  };

  // Download as .txt file
  const handleDownload = () => {
    const blob = new Blob([coverLetter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cover-letter-${formData.companyName}.txt`;
    a.click();
    toast.success("Downloaded!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="text-green-600 size-8" />
            <h1 className="text-3xl font-bold text-gray-800">
              Cover Letter Generator
            </h1>
          </div>
          <p className="text-gray-500">
            Fill in the details below and let AI write a professional cover letter for you in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT - Input Form */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Your Details
            </h2>

            <div className="space-y-4">

              {/* Your Name */}
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  placeholder="e.g. Vansh Pantawane"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              {/* Job Title */}
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">
                  Job Title Applying For *
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  placeholder="e.g. Software Engineer, Marketing Manager"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              {/* Company Name */}
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="e.g. Google, Tata Consultancy Services"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              {/* Skills */}
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">
                  Your Key Skills
                  <span className="text-gray-400 font-normal"> (optional)</span>
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g. React, Node.js, Leadership, Excel"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              {/* Experience */}
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">
                  Years of Experience
                  <span className="text-gray-400 font-normal"> (optional)</span>
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="">Select experience</option>
                  <option value="Fresher">Fresher (0 years)</option>
                  <option value="1-2 years">1-2 years</option>
                  <option value="3-5 years">3-5 years</option>
                  <option value="5-10 years">5-10 years</option>
                  <option value="10+ years">10+ years</option>
                </select>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-xl py-3 font-medium flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                {loading ? (
                  <>
                    <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    Generate Cover Letter
                  </>
                )}
              </button>

            </div>
          </div>

          {/* RIGHT - Output */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-700">
                Generated Cover Letter
              </h2>

              {/* Action buttons - only show when letter is generated */}
              {coverLetter && (
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-sm px-3 py-1.5 border rounded-lg hover:bg-gray-50 transition"
                  >
                    <Copy className="size-3.5" />
                    Copy
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1 text-sm px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                  >
                    <Download className="size-3.5" />
                    Download
                  </button>
                </div>
              )}
            </div>

            {/* Cover Letter Display */}
            {coverLetter ? (
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full h-96 text-sm text-gray-700 leading-relaxed resize-none focus:outline-none border border-gray-100 rounded-lg p-3"
              />
            ) : (
              // Empty state
              <div className="h-96 flex flex-col items-center justify-center text-gray-400">
                <FileText className="size-16 mb-3 opacity-20" />
                <p className="text-sm">
                  Fill the form and click Generate
                </p>
                <p className="text-xs mt-1">
                  Your cover letter will appear here
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CoverLetter;