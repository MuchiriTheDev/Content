// VideoViewer.js (New Component: Comprehensive YouTube Video Viewer with Embed, AI Insights, and Comments)
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaThumbsUp, FaComment, FaEye, FaCalendar, FaShareAlt, FaDownload, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { FiInfo } from 'react-icons/fi';
import toast from 'react-hot-toast';

const VideoViewer = ({ video, aiAnalysis, onClose }) => {
  const [isExpandedComments, setIsExpandedComments] = useState(false);

  const shareVideo = () => {
    const text = `Check out this video: "${video.title}" on YouTube! Views: ${Number(video.views).toLocaleString()}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}%0Ahttps://youtu.be/${video.id}`;
    window.open(url, '_blank');
    toast.success('Shared to WhatsApp');
  };

  const downloadTranscript = () => {
    // Placeholder: In a real app, fetch transcript via backend/YouTube API
    toast.info('Transcript download coming soon! (Requires backend integration)');
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'Positive': return 'bg-appleGreen/10 border-appleGreen text-appleGreen';
      case 'Negative': return 'bg-red-50 border-red-300 text-red-800';
      default: return 'bg-gray-50 border-gray-300 text-gray-700';
    }
  };

  const getSentimentBadge = (sentiment) => {
    const colors = {
      Positive: 'bg-appleGreen/40 border-appleGreen text-appleGreen',
      Negative: 'bg-red-200 border-red-300 text-red-800',
      Neutral: 'bg-gray-200 border-gray-300 text-gray-700'
    };
    return <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${colors[sentiment] || colors.Neutral}`}>
      {sentiment === 'Positive' ? <FaCheckCircle className="mr-1 text-xs" /> : <FaExclamationTriangle className="mr-1 text-xs" />}
      {sentiment}
    </span>;
  };

  const getRealityBadge = () => {
    if (video.commentReality?.isReal === false && video.commentReality?.reportedCount > 0) {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 border border-red-300 text-red-800">
        <FaExclamationTriangle className="mr-1 text-xs" /> Fake Comments Alert ({video.commentReality.reportedCount} reported)
      </span>;
    }
    return null;
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-4 border border-appleGreen text-xs"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4 sticky top-0 bg-white z-10 pb-2 border-b border-gray-200">
        <h2 className="font-bold text-brown text-sm flex items-center gap-2">
          <FiInfo className="text-appleGreen" />
          AI Video Analysis: {video.title}
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={shareVideo} className="p-1.5 rounded hover:bg-gray-100 transition" title="Share"><FaShareAlt className="text-brown text-sm" /></button>
          <button onClick={downloadTranscript} className="p-1.5 rounded hover:bg-gray-100 transition" title="Download Transcript"><FaDownload className="text-brown text-sm" /></button>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-gray-100 transition" title="Close"><FaTimes className="text-brown text-sm" /></button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Video Player & Metadata */}
        <div className="space-y-4">
          {/* YouTube Embed */}
          <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg">
            <iframe
              src={`https://www.youtube.com/embed/${video.id}?autoplay=0&rel=0&modestbranding=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
              loading="lazy"
            />
            {getRealityBadge() && <div className="absolute top-2 right-2 z-20">{getRealityBadge()}</div>}
          </div>

          {/* Video Metadata */}
          <div className="space-y-2">
            <h3 className="font-semibold text-brown text-sm truncate">{video.title}</h3>
            <div className="flex flex-wrap items-center gap-4 text-gray-600 text-xs">
              <span className="flex items-center gap-1"><FaEye className="text-xs" />{Number(video.views).toLocaleString()} views</span>
              <span className="flex items-center gap-1"><FaThumbsUp className="text-xs" />{Number(video.likes).toLocaleString()} likes</span>
              <span className="flex items-center gap-1"><FaComment className="text-xs" />{video.commentCount} comments</span>
              <span className="flex items-center gap-1"><FaCalendar className="text-xs" />{new Date(video.publishedAt).toLocaleDateString('en-GB')}</span>
            </div>
            <p className="text-gray-600 italic text-xs line-clamp-3">{video.niche ? `Niche: ${video.niche}` : 'Niche: Unknown'}</p>
          </div>
        </div>

        {/* AI Analysis & Comments */}
        <div className="space-y-4">
          {/* Sentiment Summary */}
          {aiAnalysis?.summary ? (
            <div className="bg-appleGreen/10 p-3 rounded-lg border border-appleGreen">
              <h4 className="font-semibold text-brown mb-2 text-xs flex items-center gap-1">Sentiment Overview</h4>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-appleGreen/20 rounded">
                  <p className="font-bold text-appleGreen text-xs">{aiAnalysis.summary.positive || 0}</p>
                  <p className="text-xs text-brown">Positive</p>
                </div>
                <div className="p-2 bg-gray-100 rounded">
                  <p className="font-bold text-gray-700 text-xs">{aiAnalysis.summary.neutral || 0}</p>
                  <p className="text-xs text-brown">Neutral</p>
                </div>
                <div className="p-2 bg-red-100 rounded">
                  <p className="font-bold text-red-800 text-xs">{aiAnalysis.summary.negative || 0}</p>
                  <p className="text-xs text-brown">Negative</p>
                </div>
              </div>
              {aiAnalysis.summary.nicheAlignment && (
                <p className="mt-2 text-xs text-brown">Niche Alignment: {aiAnalysis.summary.nicheAlignment}/100</p>
              )}
            </div>
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg text-center text-xs text-gray-500 italic">No AI sentiment analysis available</div>
          )}

          {/* Improvement Suggestions (from aiAnalysis if available, or fallback) */}
          <div className="space-y-2">
            <h4 className="font-semibold text-brown text-xs">AI Suggestions</h4>
            <ul className="space-y-1 text-xs text-gray-600">
              {aiAnalysis?.improvement?.length > 0 ? (
                aiAnalysis.improvement.slice(0, 3).map((suggestion, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-appleGreen mt-0.5">•</span>
                    {suggestion}
                  </li>
                ))
              ) : (
                <li className="flex items-start gap-1">
                  <span className="text-appleGreen mt-0.5">•</span>
                  Engage more with comments to boost positivity
                </li>
              )}
            </ul>
          </div>

          {/* Comments Section */}
          <div className="space-y-2">
            <h4 className="font-semibold text-brown text-xs flex items-center justify-between">
              Comments ({video.comments?.length || 0})
              <button
                onClick={() => setIsExpandedComments(!isExpandedComments)}
                className="text-xs text-appleGreen hover:underline"
              >
                {isExpandedComments ? 'Show Less' : 'Show All'}
              </button>
            </h4>
            <div className={`max-h-48 overflow-y-auto space-y-2 ${isExpandedComments ? 'max-h-96' : ''}`}>
              {video.comments?.length > 0 ? (
                video.comments.slice(0, isExpandedComments ? 50 : 10).map((comment, i) => {
                  const analysis = aiAnalysis?.comments?.[i];
                  const sentiment = analysis?.sentiment || 'Neutral';
                  return (
                    <div key={i} className={`p-3 rounded-lg border ${getSentimentColor(sentiment)}`}>
                      <p className="text-gray-700 text-xs mb-1 line-clamp-2">{comment}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">AI: {analysis?.reason || 'No reason provided'}</span>
                        {getSentimentBadge(sentiment)}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-gray-500 italic text-center py-4">No comments available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200 text-center text-xs text-gray-400">
        Analyzed by CCI AI Coach • Watch time may vary • Report issues to support@cci.app
      </div>
    </motion.div>
  );
};

export default VideoViewer;