// DashboardAnalytics.js (Updated: Integrate VideoViewer Component)
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { backendUrl } from '../../App';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  FaYoutube, FaExclamationTriangle, FaCheckCircle, 
  FaSync, FaDownload, FaShareAlt, FaComment, 
  FaEye, FaThumbsUp, FaCalendar, FaRobot
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useReactToPrint } from 'react-to-print';
import { BsFillLightbulbFill } from 'react-icons/bs';
import { FiInfo } from 'react-icons/fi';
import VideoViewer from '../../Resources/VideoViewer';  // ← Import the new component

const DashboardAnalytics = () => {
  const [report, setReport] = useState(null);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);  // Now holds { video, aiAnalysis }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `CCI_Analytics_${new Date().toISOString().split('T')[0]}`,
    onAfterPrint: () => toast.success('PDF downloaded')
  });

  useEffect(() => {
    const goOnline = () => { setIsOnline(true); toast.success('Back online'); };
    const goOffline = () => { setIsOnline(false); toast.error('No internet'); };
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [rep, vid] = await Promise.all([
        axios.get(`${backendUrl}/analytics/youtube-report`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get(`${backendUrl}/analytics/videos`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
      ]);

      setReport(rep.data.data);
      setVideos(vid.data.data.videos);
      toast.success('Analytics loaded');
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to load analytics';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openVideoPopup = async (videoId) => {
    try {
      const res = await axios.get(`${backendUrl}/analytics/video/${videoId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSelectedVideo(res.data.data);  // Now { video, aiAnalysis }
    } catch (err) {
      toast.error('Failed to load video details');
    }
  };

  const closeVideoPopup = () => {
    setSelectedVideo(null);
  };

  const shareAnalytics = () => {
    if (!report?.performance) return;
    const { totalViews, estimatedRevenueKSh } = report.performance;
    const text = `CCI Analytics:\nViews: ${Number(totalViews).toLocaleString()}\nRevenue: KSh ${Number(estimatedRevenueKSh).toLocaleString()}\nMonetized: ${report.monetized ? 'Yes' : 'No'}\nhttps://cci.app`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const getRiskBadge = (score) => {
    const s = Number(score);
    if (s < 30) return <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-appleGreen/40 border border-brown text-brown"><FaCheckCircle className="mr-1 text-xs" /> Low Risk</span>;
    if (s < 60) return <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-yellow-100 border border-yellow-800 text-yellow-800"><FaExclamationTriangle className="mr-1 text-xs" /> Medium</span>;
    return <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-red-100 border border-red-800 text-red-800"><FaExclamationTriangle className="mr-1 text-xs" /> High Risk</span>;
  };

  if (loading) {
    return (
      <div className="space-y-3 p-3">
        <div className="h-8 bg-gray-200 rounded-lg animate-pulse" />
        <div className="grid grid-cols-2 gap-2">
          {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />)}
        </div>
        <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center bg-red-50 rounded-lg border border-red-200">
        <p className="font-medium text-red-700 text-sm">Error</p>
        <p className="text-xs text-red-600 mt-1">{error}</p>
        <button onClick={fetchData} className="mt-2 px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg flex items-center gap-1 mx-auto hover:bg-red-700 transition">
          <FaSync className={loading ? 'animate-spin' : ''} size={10} /> Retry
        </button>
      </div>
    );
  }

  const { performance = {}, contentTips = [], commentAnalysis = {}, viewsHistory = [], earningsHistory = [], monetized = false } = report || {};
  const { totalViews = 0, estimatedRevenueKSh = 0, engagementRate = 0, subscribersGained = 0, subGrowthRate = 0 } = performance;
  const viewsGrowth = report?.trends?.viewsGrowth ?? null;

  return (
    <>
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-1 text-xs z-50">
          Offline — Data may be stale
        </div>
      )}

      <div ref={printRef} className="space-y-4 p-3 bg-gray-50">
        {/* Header */}
        <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-lg shadow-lg p-3 border border-appleGreen/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-brown">Platform:</span>
              <div className="flex gap-1">
                <button className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-medium rounded-lg shadow-sm">
                  <FaYoutube size={12} /> YouTube
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {monetized ? (
                <span className="px-2 py-0.5 bg-appleGreen/40 border border-brown text-brown text-xs font-medium rounded-full">Monetized</span>
              ) : (
                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded-full border border-orange-800">Not Monetized</span>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-1 mt-2">
            <button onClick={handlePrint} className="p-1.5 rounded-lg bg-fadeBrown/40 hover:bg-fadeBrown/60 transition text-xs" title="Download PDF"><FaDownload size={10} className="text-brown" /></button>
            <button onClick={shareAnalytics} className="p-1.5 rounded-lg bg-fadeBrown/40 hover:bg-fadeBrown/60 transition text-xs" title="Share"><FaShareAlt size={10} className="text-brown" /></button>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Total Views', value: Number(totalViews).toLocaleString(), change: viewsGrowth != null ? `${viewsGrowth > 0 ? '+' : ''}${viewsGrowth.toFixed(0)}%` : 'N/A' },
            { label: 'Revenue (KSh)', value: Number(estimatedRevenueKSh).toLocaleString(), change: '' },
            { label: 'Engagement', value: `${Number(engagementRate).toFixed(1)}%`, change: '' },
            { label: 'Subs Gained', value: `+${Number(subscribersGained).toLocaleString()}`, change: subGrowthRate ? `+${subGrowthRate.toFixed(1)}%` : '' },
          ].map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ scale: 1.02 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-lg shadow-lg p-3 flex flex-col gap-1 border border-appleGreen/20 hover:shadow-xl transition-all text-xs">
              <p className="font-medium text-brown">{m.label}</p>
              <p className="font-bold text-brown">{m.value}</p>
              {m.change && <p className={`font-medium text-xs ${m.change.includes('+') ? 'text-appleGreen' : 'text-red-600'}`}>{m.change} vs last</p>}
            </motion.div>
          ))}
        </div>

        {/* Comment Reality Alert */}
        {commentAnalysis.fakeCommentAlert && (
          <div className="bg-red-50 border border-red-300 rounded-lg p-3 flex items-center gap-2 text-xs">
            <FaExclamationTriangle className="text-red-600 text-sm" />
            <div>
              <p className="font-medium text-red-800">Fake Comment Alert</p>
              <p className="text-red-700">{commentAnalysis.fakeCommentAlert}</p>
            </div>
          </div>
        )}

        {/* Comment Sentiment */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow-lg p-3 border border-appleGreen/20">
          <h3 className="text-sm font-semibold text-brown mb-2 text-xs">AI Comment Insights</h3>
          <div className="grid grid-cols-3 gap-2 text-center mb-2">
            <div className="p-2 bg-appleGreen/20 rounded-lg"><p className="font-bold text-appleGreen text-xs">{commentAnalysis.positive || 0}</p><p className="text-xs text-brown">Positive</p></div>
            <div className="p-2 bg-yellow-100 rounded-lg"><p className="font-bold text-yellow-800 text-xs">{commentAnalysis.neutral || 0}</p><p className="text-xs text-brown">Neutral</p></div>
            <div className="p-2 bg-red-100 rounded-lg"><p className="font-bold text-red-800 text-xs">{commentAnalysis.negative || 0}</p><p className="text-xs text-brown">Negative</p></div>
          </div>
          {commentAnalysis.examples?.negative?.[0] && (
            <div className="mb-2 p-2 bg-red-50 rounded-lg border border-red-200 text-xs">
              <p className="font-medium text-red-800">Sample Negative:</p>
              <p className="italic text-gray-600 mt-1">"{commentAnalysis.examples.negative[0]}"</p>
            </div>
          )}
          <div className="space-y-2 mt-2">
            <p className="text-xs font-medium text-brown">Key Lessons:</p>
            {commentAnalysis.lessons?.length > 0 ? (
              <ul className="space-y-1">{commentAnalysis.lessons.map((l, i) => <li key={i} className="text-xs text-gray-600 flex items-start gap-1"><span className="text-appleGreen">•</span> {l}</li>)}</ul>
            ) : <p className="text-xs text-gray-500 italic">No lessons detected</p>}
          </div>
        </motion.div>

        {/* AI Coach Tips */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-brown text-xs">AI Coach Tips ({contentTips.length})</h3>
          <div className="space-y-2">
            {contentTips.map((tip, i) => (
              <motion.div key={i} initial={{ x: -15, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.08 }} className="bg-white border rounded-lg shadow-lg p-3 flex flex-col gap-2 border-appleGreen/20 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-brown">{tip.tip}</h4>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full font-medium bg-appleGreen/40 border border-brown text-brown text-xs">{tip.nicheFit || 'All'}</span>
                </div>
                <div className="flex items-start gap-1"><FiInfo className="text-appleGreen text-xs mt-0.5" /><p className="text-gray-600">{tip.action}</p></div>
                <p className="italic text-brown font-medium text-xs">Benefit: {tip.benefit}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Views Chart */}
        {viewsHistory.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-lg shadow-lg p-3 border border-appleGreen/20">
            <p className="text-sm font-semibold text-brown mb-2 text-xs">Views (Last 30 Days)</p>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={viewsHistory}>
                  <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric' })} tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} />
                  <Tooltip formatter={(v) => `${Number(v).toLocaleString()} views`} contentStyle={{ backgroundColor: '#fff', border: '1px solid #AAC624', borderRadius: '6px', fontSize: '10px' }} />
                  <Line type="monotone" dataKey="views" stroke="#AAC624" strokeWidth={2} dot={{ fill: '#AAC624', r: 3 }} activeDot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* Earnings Chart */}
        {monetized && earningsHistory.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-lg shadow-lg p-3 border border-appleGreen/20">
            <p className="text-sm font-semibold text-brown mb-2 text-xs">Earnings (KSh, Last 30 Days)</p>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={earningsHistory}>
                  <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric' })} tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} />
                  <Tooltip formatter={(v) => `KSh ${Number(v).toLocaleString()}`} contentStyle={{ backgroundColor: '#fff', border: '1px solid #AAC624', borderRadius: '6px', fontSize: '10px' }} />
                  <Line type="monotone" dataKey="amount" stroke="#7BBF2A" strokeWidth={2} dot={{ fill: '#AAC624', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* Recent Videos */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-brown text-xs">Recent Videos</h3>
            <span className="text-xs text-gray-600">{videos.length} total</span>
          </div>
          <div className="space-y-2">
            {videos.slice(0, 5).map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => openVideoPopup(v.id)}
                className="bg-white rounded-lg shadow-lg p-3 flex items-center gap-3 border border-appleGreen/20 hover:shadow-xl transition-all cursor-pointer text-xs"
              >
                <img src={v.thumbnail} alt="" className="w-16 h-12 object-cover rounded-md" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-brown truncate">{v.title}</p>
                  <div className="flex items-center gap-2 mt-1 text-gray-600">
                    <span><FaEye className="inline mr-1 text-xs" />{Number(v.views).toLocaleString()}</span>
                    <span>•</span>
                    <span><FaCalendar className="inline mr-1 text-xs" />{new Date(v.publishedAt).toLocaleDateString('en-GB')}</span>
                  </div>
                </div>
                {v.commentReality?.isReal === false && v.commentReality?.reportedCount > 0 && (
                  <FaExclamationTriangle className="text-red-600 text-xs" title="Fake comments detected" />
                )}
                <div className="text-xs text-brown">Watch & Analyze</div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="text-center text-xs text-gray-400 mt-4 print:block hidden">
          Generated by CCI • Confidence. Clarity. Control. • cci.app
        </div>
      </div>

      {/* Video Popup (Updated: Use VideoViewer Component) */}
      {selectedVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={closeVideoPopup}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2"
        >
          <VideoViewer
            video={selectedVideo.video}
            aiAnalysis={selectedVideo.aiAnalysis}
            onClose={closeVideoPopup}
          />
        </motion.div>
      )}
    </>
  );
};

export default DashboardAnalytics;