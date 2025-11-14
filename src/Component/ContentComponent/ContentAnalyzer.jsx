import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUpload, FaTimes, FaSpinner, FaFileImage, FaChartBar, FaExclamationTriangle } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { FiAlertCircle, FiInfo } from 'react-icons/fi';
import toast from 'react-hot-toast';

// Utility to convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
};

// Component for Content Analysis
const ContentAnalyzer = ({ 
  text, 
  setText, 
  analysis, 
  setAnalysis, 
  isLoading, 
  setIsLoading, 
  showReviewPopup, 
  setShowReviewPopup,
  genAI // Pass genAI from parent
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1000) {
      toast.error('File too big (5MB max)! 📏');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image! 🎥');
      return;
    }

    setSelectedFile(file);
    setFilePreview(URL.createObjectURL(file));
    toast.success('Image ready for analysis! ✅');
  };

  const clearFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
  };

  const analyzeContent = async () => {
    if (!text.trim() && !selectedFile) {
      toast.error('Please provide text or an image! ⚠️');
      return;
    }

    setIsLoading(true);

    const contentDesc = text ? `"${text}"` : (selectedFile ? 'An image is provided for analysis.' : 'No content provided.');
    const prompt = `You are CICI, analyzing content for YouTube CCI risks. Evaluate for demonetization, suspension, bans. Provide percentages (0-100) and brief reasons/fixes.

Content: ${contentDesc}

Respond ONLY with a valid JSON object, no markdown, no extra text, no code blocks:
{
  "demonetized": {"risk": number, "reason": "brief reason", "fix": "brief fix"},
  "suspended": {"risk": number, "reason": "brief reason", "fix": "brief fix"},
  "banned": {"risk": number, "reason": "brief reason", "fix": "brief fix"}
}`;

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      let parts = [{ text: prompt }];
      if (selectedFile) {
        const base64 = await fileToBase64(selectedFile);
        parts.push({
          inlineData: {
            mimeType: selectedFile.type,
            data: base64,
          },
        });
      }

      const result = await model.generateContent(parts);
      let jsonStr = result.response.text().trim();

      // Clean up potential markdown code blocks
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.slice(7).trim();
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.slice(3).trim();
      }
      if (jsonStr.endsWith('```')) {
        jsonStr = jsonStr.slice(0, -3).trim();
      }

      // Additional cleanup: remove any leading/trailing non-JSON text if needed
      const jsonMatch = jsonStr.match(/\{[^{}]*(\{[^{}]*\}[^{}]*)*\}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }

      const parsedAnalysis = JSON.parse(jsonStr);
      setAnalysis(parsedAnalysis);
      setShowReviewPopup(true);
      toast.success('Analysis complete! 📊');
    } catch (error) {
      console.error('Error analyzing content:', error);
      toast.error('Failed to analyze content. Check your input! ⚠️');
    } finally {
      setIsLoading(false);
    }
  };

  const parseAnalysis = (analysis) => {
    if (analysis) {
      return {
        riskScores: {
          demonetization: analysis.demonetized?.risk || 0,
          suspension: analysis.suspended?.risk || 0,
          ban: analysis.banned?.risk || 0,
        },
        reasons: {
          demonetization: analysis.demonetized?.reason || '',
          suspension: analysis.suspended?.reason || '',
          ban: analysis.banned?.reason || '',
        },
        fixes: {
          demonetization: analysis.demonetized?.fix || '',
          suspension: analysis.suspended?.fix || '',
          ban: analysis.banned?.fix || '',
        },
      };
    }
    return null;
  };

  const parsed = parseAnalysis(analysis);

  // Render risk badge
  const getRiskBadge = (score) => {
    const badgeStyles = {
      low: 'bg-appleGreen text-white',
      medium: 'bg-yellow-400 text-white',
      high: 'bg-red-500 text-white',
    };
    const level = score < 30 ? 'low' : score < 70 ? 'medium' : 'high';
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
          badgeStyles[level]
        } transition-all duration-300`}
      >
        {score > 70 ? 'High 🚨' : score > 30 ? 'Medium ⚠️' : 'Low 👍'}
      </span>
    );
  };

  // Overall risk score
  const overallRisk = parsed ? Math.round((parsed.riskScores.demonetization + parsed.riskScores.suspension + parsed.riskScores.ban) / 3) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="p-4 mx-auto my-4 w-full mt-10 h-full relative" // Added relative for absolute positioning fallback
    >
      {/* Header */}
      <div className="flex flex-col items-start mb-6">
        <h3 className="text-2xl md:text-3xl font-bold text-brown tracking-tight flex items-center">
          <FaChartBar className="mr-3 text-appleGreen" />
          Content Risk Analyzer
        </h3>
        <p className="text-xs md:text-sm text-brown/60 mt-2">
          Assess your content for YouTube CCI risks: demonetization, suspension, and bans.
        </p>
      </div>

      {/* Input Section */}
      <div className="space-y-6 mb-6">
        {/* Text Input Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-xl shadow-md border border-brown/10"
        >
          <label className="text-sm font-medium text-brown/70 mb-2 flex items-center">
            <FiInfo className="mr-1 text-xs" /> Text or Script
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your video script, description, or thumbnail text here..."
            className="w-full p-3 bg-gray-50 border border-brown/10 rounded-lg focus:ring-2 focus:ring-appleGreen focus:border-transparent placeholder-brown/40 shadow-sm text-sm resize-none h-24"
            disabled={isLoading}
          />
        </motion.div>

        {/* Image Upload Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-4 rounded-xl shadow-md border border-brown/10"
        >
          <label className="block text-sm font-medium text-brown/70 mb-3 flex items-center">
            <FaFileImage className="mr-1 text-xs" /> Or Upload Thumbnail/Image
          </label>
          <div className="flex flex-col md:flex-row items-start gap-3">
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="imageUpload"
                disabled={isLoading}
              />
              <label htmlFor="imageUpload" className={`flex items-center justify-center gap-2 w-full p-3 bg-gradient-to-r from-appleGreen/5 to-yellowGreen/5 border border-appleGreen/20 rounded-lg cursor-pointer hover:shadow-md transition-all duration-300 text-sm font-medium ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <FaUpload className="text-appleGreen" />
                {selectedFile ? `Selected: ${selectedFile.name}` : 'Choose Image'}
              </label>
            </div>
            {selectedFile && (
              <button 
                onClick={clearFile} 
                className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-300 text-sm"
              >
                <FaTimes className="text-xs" />
              </button>
            )}
          </div>
          {filePreview && (
            <div className="mt-3">
              <img src={filePreview} alt="Preview" className="max-w-full h-32 object-cover rounded-lg border border-brown/10 shadow-sm" />
            </div>
          )}
        </motion.div>
      </div>

      {/* Analyze Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={analyzeContent}
        disabled={isLoading || (!text.trim() && !selectedFile)}
        className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl shadow-lg text-sm font-semibold transition-all duration-300 ${
          isLoading || (!text.trim() && !selectedFile)
            ? 'bg-brown/20 cursor-not-allowed text-brown/50 border border-brown/20'
            : 'bg-gradient-to-r from-appleGreen to-yellowGreen text-white hover:shadow-appleGreen/25 border border-appleGreen/30 hover:from-appleGreen/90'
        }`}
      >
        {isLoading ? (
          <>
            <FaSpinner className="animate-spin text-sm" />
            Analyzing...
          </>
        ) : (
          <>
            <FaChartBar className="text-sm" />
            Analyze Content
          </>
        )}
      </motion.button>

      {/* Quick Results Preview */}
      {analysis && !showReviewPopup && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-gradient-to-r from-appleGreen/5 to-yellowGreen/5 rounded-xl p-5 border border-appleGreen/20"
        >
          <h4 className="text-sm font-semibold text-brown mb-3 flex items-center">
            <FaChartBar className="mr-2 text-appleGreen" />
            Quick Risk Summary
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
            {Object.entries(parsed?.riskScores || {}).map(([key, score]) => (
              <div key={key} className="text-center bg-white/50 rounded-lg p-3 shadow-sm">
                <div className="text-xs font-medium text-brown/70 capitalize mb-1">{key.replace('demonetization', 'Demonetization')}</div>
                <div className="text-xl font-bold text-brown mb-1">{score}%</div>
                {getRiskBadge(score)}
              </div>
            ))}
          </div>
          <div className="text-center">
            <button 
              onClick={() => setShowReviewPopup(true)} 
              className="text-xs text-appleGreen font-medium underline hover:text-yellowGreen transition-colors"
            >
              View Detailed Report →
            </button>
          </div>
        </motion.div>
      )}

      {/* Detailed Report Modal - Full Screen Coverage */}
      <AnimatePresence>
        {showReviewPopup && analysis && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4"
            onClick={() => setShowReviewPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 border border-appleGreen/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-brown flex items-center mb-1">
                    <FaExclamationTriangle className="mr-2 text-yellowGreen" />
                    Risk Assessment Report
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-brown">{overallRisk}%</span>
                    <span className="text-sm text-brown/60">Overall Risk Score</span>
                  </div>
                </div>
                <button 
                  onClick={() => setShowReviewPopup(false)} 
                  className="p-2 text-brown/50 hover:text-brown transition-colors"
                  aria-label="Close modal"
                >
                  <MdClose size={24} />
                </button>
              </div>

              {/* Risk Breakdown Cards */}
              <div className="space-y-4 mb-6">
                {Object.entries(parsed?.riskScores || {}).map(([label, score], index) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 border-l-4 border-appleGreen/30 shadow-lg"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-base font-semibold text-brown capitalize">
                        {label.replace('demonetization', 'Demonetization')}
                      </h4>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-brown">{score}%</div>
                        {getRiskBadge(score)}
                      </div>
                    </div>
                    <div className="w-full bg-brown/10 rounded-full h-3 mb-4 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full transition-all duration-1000 ${
                          score < 30 ? 'bg-appleGreen' : 
                          score < 70 ? 'bg-yellowGreen' : 'bg-red-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(score, 100)}%` }}
                      />
                    </div>
                    {parsed?.reasons[label] && (
                      <div className="text-sm text-brown/70 space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                          <FiAlertCircle className="mt-1 text-red-500 flex-shrink-0" />
                          <span><strong>Reason:</strong> {parsed.reasons[label]}</span>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-appleGreen/10 rounded-lg">
                          <FaChartBar className="mt-1 text-appleGreen flex-shrink-0" />
                          <span><strong>Fix:</strong> {parsed.fixes[label]}</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Quick Tips Section */}
              {parsed && Object.values(parsed.fixes).some(fix => fix) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-yellowGreen/10 to-appleGreen/10 rounded-xl p-6 mb-6 border border-yellowGreen/20"
                >
                  <h4 className="text-base font-semibold text-brown mb-4 flex items-center">
                    <FiAlertCircle className="mr-2 text-yellowGreen" />
                    Actionable Tips to Mitigate Risks
                  </h4>
                  <ul className="text-sm text-brown/80 space-y-3 list-none pl-0">
                    {Object.values(parsed.fixes).map((fix, i) => fix && (
                      <li key={i} className="flex items-start gap-3 bg-white/50 p-3 rounded-lg shadow-sm">
                        <span className="flex-shrink-0 mt-1 text-lg">💡</span>
                        <span>{fix}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowReviewPopup(false)}
                className="w-full py-4 px-8 bg-gradient-to-r from-appleGreen to-yellowGreen text-white rounded-xl font-semibold shadow-lg hover:shadow-appleGreen/25 transition-all duration-300 text-base"
              >
                Understood! Let's Create Safely 🚀
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ContentAnalyzer;