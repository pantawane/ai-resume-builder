import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const professions = [
  // Tech
  { category: "💻 Technology", items: ["Software Developer", "Full Stack Developer", "Data Scientist", "UI/UX Designer", "DevOps Engineer", "Cybersecurity Analyst"] },
  // Business
  { category: "💼 Business", items: ["MBA Graduate", "Business Analyst", "Product Manager", "Project Manager", "Operations Manager"] },
  // Finance
  { category: "🏦 Finance & Banking", items: ["Investment Banker", "Financial Analyst", "Chartered Accountant", "Bank Manager", "Financial Advisor"] },
  // Marketing
  { category: "📢 Marketing & Sales", items: ["Digital Marketing Manager", "Sales Executive", "Content Creator", "Brand Manager", "SEO Specialist"] },
  // Education
  { category: "📚 Education", items: ["Teacher", "Professor", "School Principal", "Education Counselor", "Corporate Trainer"] },
  // Healthcare
  { category: "🏥 Healthcare", items: ["Doctor", "Nurse", "Pharmacist", "Medical Researcher", "Healthcare Administrator"] },
  // Creative
  { category: "🎨 Creative", items: ["Graphic Designer", "Video Editor", "Photographer", "Architect", "Fashion Designer"] },
  // Fresher
  { category: "🎓 Fresher / Entry Level", items: ["Engineering Fresher", "MBA Fresher", "Arts Graduate", "Science Graduate", "Commerce Graduate"] },
];

const colorSchemes = [
  { label: "Professional Blue", value: "professional blue and white with navy accents" },
  { label: "Executive Black", value: "black and white with gold accents" },
  { label: "Modern Green", value: "white with green accents, clean minimal" },
  { label: "Creative Purple", value: "purple gradient with white, creative modern" },
  { label: "Corporate Gray", value: "gray and white with dark blue accents" },
  { label: "Bold Red", value: "white with bold red accents, powerful" },
];

const styles = [
  { label: "Modern & Clean", value: "modern clean with good whitespace" },
  { label: "Traditional", value: "traditional formal conservative" },
  { label: "Creative Bold", value: "creative bold with unique layout" },
  { label: "Minimal", value: "minimal simple elegant" },
  { label: "Two Column", value: "two column layout with sidebar" },
];

const TemplateGenerator = () => {
  const { token } = useSelector((state) => state.auth);
  const [selectedProfession, setSelectedProfession] = useState("");
  const [selectedColor, setSelectedColor] = useState(colorSchemes[0].value);
  const [selectedStyle, setSelectedStyle] = useState(styles[0].value);
  const [templateHTML, setTemplateHTML] = useState("");
  const [loading, setLoading] = useState(false);
  const [generationCount, setGenerationCount] = useState(0);

  const handleGenerate = async () => {
    if (!selectedProfession) {
      toast.error("Please select a profession first!");
      return;
    }

    try {
      setLoading(true);
      setTemplateHTML("");

      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/ai/generate-template`,
        {
          profession: selectedProfession,
          colorScheme: selectedColor,
          style: selectedStyle,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTemplateHTML(data.templateHTML);
      setGenerationCount((prev) => prev + 1);
      toast.success("Template generated!");

    } catch (error) {
      toast.error(error.response?.data?.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  // Download the template as HTML file
  const handleDownload = () => {
    const blob = new Blob([templateHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedProfession}-resume-template.html`;
    a.click();
    toast.success("Template downloaded!");
  };

  // Copy HTML code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(templateHTML);
    toast.success("HTML code copied!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            ✨ AI Template Generator
          </h1>
          <p className="text-gray-500">
            Generate unlimited professional resume templates tailored for your profession using AI.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT - Controls */}
          <div className="lg:col-span-1 space-y-5">

            {/* Profession Selector */}
            <div className="bg-white rounded-2xl border shadow-sm p-5">
              <h2 className="font-semibold text-gray-700 mb-4">
                1️⃣ Select Your Profession
              </h2>
              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {professions.map((group) => (
                  <div key={group.category}>
                    <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                      {group.category}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <button
                          key={item}
                          onClick={() => setSelectedProfession(item)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            selectedProfession === item
                              ? "bg-green-500 text-white shadow-md scale-105"
                              : "bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-700"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Color Scheme */}
            <div className="bg-white rounded-2xl border shadow-sm p-5">
              <h2 className="font-semibold text-gray-700 mb-3">
                2️⃣ Color Scheme
              </h2>
              <div className="space-y-2">
                {colorSchemes.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all ${
                      selectedColor === color.value
                        ? "bg-green-500 text-white font-medium"
                        : "bg-gray-50 text-gray-600 hover:bg-green-50"
                    }`}
                  >
                    {color.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Style */}
            <div className="bg-white rounded-2xl border shadow-sm p-5">
              <h2 className="font-semibold text-gray-700 mb-3">
                3️⃣ Layout Style
              </h2>
              <div className="space-y-2">
                {styles.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => setSelectedStyle(style.value)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all ${
                      selectedStyle === style.value
                        ? "bg-green-500 text-white font-medium"
                        : "bg-gray-50 text-gray-600 hover:bg-green-50"
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-2xl py-4 font-semibold text-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-green-200"
            >
              {loading ? (
                <>
                  <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  AI is designing...
                </>
              ) : (
                <>
                  ✨ {generationCount > 0 ? "Regenerate Template" : "Generate Template"}
                </>
              )}
            </button>

            {/* Selected Info */}
            {selectedProfession && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700">
                <p className="font-medium">Generating for:</p>
                <p>{selectedProfession}</p>
              </div>
            )}

          </div>

          {/* RIGHT - Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border shadow-sm p-5 h-full min-h-96">

              {/* Preview Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-700">
                  👁️ Live Preview
                </h2>
                {templateHTML && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopyCode}
                      className="px-4 py-2 border rounded-xl text-sm hover:bg-gray-50 transition text-gray-600"
                    >
                      📋 Copy HTML
                    </button>
                    <button
                      onClick={handleDownload}
                      className="px-4 py-2 bg-green-500 text-white rounded-xl text-sm hover:bg-green-600 transition"
                    >
                      ⬇️ Download
                    </button>
                  </div>
                )}
              </div>

              {/* Template Preview */}
              {loading ? (
                <div className="h-96 flex flex-col items-center justify-center text-gray-400">
                  <div className="size-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-sm font-medium text-gray-500">
                    AI is creating your template...
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    This takes 10-15 seconds
                  </p>
                </div>
              ) : templateHTML ? (
                <iframe
                  srcDoc={templateHTML}
                  className="w-full rounded-xl border"
                  style={{ height: "700px" }}
                  title="Resume Template Preview"
                />
              ) : (
                <div className="h-96 flex flex-col items-center justify-center text-gray-400">
                  <p className="text-5xl mb-4">📄</p>
                  <p className="text-sm font-medium">
                    Select a profession and click Generate
                  </p>
                  <p className="text-xs mt-1">
                    AI will create a unique template just for you
                  </p>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TemplateGenerator;