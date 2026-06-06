import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const professions = [
  "Software Developer",
  "Data Scientist",
  "Marketing",
  "Sales",
  "Banking",
  "Teacher",
  "HR",
  "Project Manager",
  "General",
];

const BulletSuggestions = () => {
  const { token } = useSelector((state) => state.auth);
  const [bulletText, setBulletText] = useState("");
  const [profession, setProfession] = useState("General");
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleSuggest = async () => {
    if (!bulletText.trim()) {
      toast.error("Please enter a bullet point first");
      return;
    }

    try {
      setLoading(true);
      setSuggestions(null);

      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/ai/suggest-bullets`,
        { bulletText, profession },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuggestions(data.suggestions);
      toast.success("5 suggestions ready!");

    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Copied!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleUse = (text) => {
    setBulletText(text);
    setSuggestions(null);
    toast.success("Loaded! You can improve it further.");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            ✍️ AI Bullet Suggestions
          </h1>
          <p className="text-gray-500">
            Write a basic bullet point → AI rewrites it 5 ways with metrics and impact. 
            Make your resume stand out!
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 mb-6">

          {/* Profession Selector */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Your Profession
            </label>
            <div className="flex flex-wrap gap-2">
              {professions.map((p) => (
                <button
                  key={p}
                  onClick={() => setProfession(p)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    profession === p
                      ? "bg-green-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-700"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Bullet Input */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Your Bullet Point
            </label>
            <textarea
              value={bulletText}
              onChange={(e) => setBulletText(e.target.value)}
              placeholder="e.g. Managed a team and worked on projects..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              Write it simply — AI will make it powerful!
            </p>
          </div>

          {/* Example prompts */}
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">
              💡 Try these examples:
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "Managed a team",
                "Worked on marketing campaigns",
                "Handled customer complaints",
                "Did data analysis",
                "Taught students",
              ].map((example) => (
                <button
                  key={example}
                  onClick={() => setBulletText(example)}
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs hover:bg-green-100 hover:text-green-700 transition"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleSuggest}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-xl py-3 font-medium flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            {loading ? (
              <>
                <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                AI is thinking...
              </>
            ) : (
              "✨ Get 5 Better Versions"
            )}
          </button>
        </div>

        {/* Results */}
        {suggestions && (
          <div>
            {/* Original */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4">
              <p className="text-xs font-semibold text-red-500 mb-1">
                ❌ Original (Weak)
              </p>
              <p className="text-gray-700 text-sm">{suggestions.original}</p>
            </div>

            {/* Suggestions */}
            <p className="text-sm font-semibold text-gray-700 mb-3">
              ✅ 5 Improved Versions:
            </p>
            <div className="space-y-3">
              {suggestions.suggestions.map((s, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl border shadow-sm p-5 hover:border-green-300 transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="size-6 bg-green-500 text-white rounded-full text-xs flex items-center justify-center font-bold shrink-0">
                          {index + 1}
                        </span>
                        <p className="text-gray-800 font-medium text-sm">
                          {s.text}
                        </p>
                      </div>
                      <p className="text-xs text-green-600 ml-8">
                        💡 {s.improvement}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        onClick={() => handleCopy(s.text, index)}
                        className="px-3 py-1.5 border rounded-lg text-xs hover:bg-gray-50 transition text-gray-600"
                      >
                        {copiedIndex === index ? "✅ Copied!" : "📋 Copy"}
                      </button>
                      <button
                        onClick={() => handleUse(s.text)}
                        className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs hover:bg-green-600 transition"
                      >
                        🔄 Improve More
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Try Again */}
            <button
              onClick={handleSuggest}
              className="w-full mt-4 py-3 border-2 border-green-400 text-green-600 rounded-2xl font-medium hover:bg-green-50 transition"
            >
              🔄 Generate 5 More Versions
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulletSuggestions;