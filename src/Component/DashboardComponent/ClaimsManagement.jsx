import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { backendUrl } from '../../App';
import { FiTrash2, FiPlus, FiAlertCircle, FiClock, FiCheck, FiX, FiEye } from 'react-icons/fi'; // Icons for actions + status + view
import ClaimComponentPopup from '../ClaimsComponents/ClaimComponentPopup';
import { GeneralContext } from '../../Context/GeneralContext';

const ClaimsManagement = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const { claimId, setClaimId } = useContext(GeneralContext); // State to hold the claim ID for the popup
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, claimId: null });
  const [viewAllOpen, setViewAllOpen] = useState(false); // Inline toggle for full history view
  const [fullHistory, setFullHistory] = useState([]); // Full claims data for "View All"
  const navigate = useNavigate();

  // Fetch claims on component mount
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`${backendUrl}/claims/my-claims`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        let fetchedClaims = response.data.claims || [];
        
        // TEMP: Add one fake claim for demo (remove after testing)
        if (fetchedClaims.length === 0) {
          const fakeClaim = {
            _id: 'demo-claim-123456',
            claimDetails: {
              platform: 'YouTube',
              incidentType: 'Video demonetization',
            },
            evaluation: {
              payoutAmount: 23520,
              revenueDropPercent: 85,
            },
            statusHistory: {
              history: [
                { status: 'Submitted', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
                { status: 'Under Review', date: new Date() },
              ],
            },
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          };
          fetchedClaims = [fakeClaim]; // Comment out this line after demo
          console.log('Demo fake claim added—remove in production');
        }
        
        setClaims(fetchedClaims);
        setFullHistory(fetchedClaims); // Initialize full history
        setLoading(false);
      } catch (err) {
        console.error('Fetch claims error:', err.response?.data || err.message);
        setError('Failed to load claims. Please try again.');
        setLoading(false);
        toast.error('Failed to load claims.');
      }
    };
    fetchClaims();
  }, []);

  // Toggle full history view (inline "View All")
  const handleViewAllToggle = () => {
    setViewAllOpen(!viewAllOpen);
    if (!viewAllOpen) {
      // If opening, ensure full data (already fetched)
      toast.info('Showing full history—close to return to summary.');
    }
  };

  // Handle claim deletion (only for 'Submitted')
  const handleDeleteClaim = async (claimId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${backendUrl}/claims/${claimId}/delete`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClaims(claims.filter((claim) => claim._id !== claimId));
      setFullHistory(fullHistory.filter((claim) => claim._id !== claimId)); // Update full view too
      setDeleteModal({ open: false, claimId: null });
      toast.success('Claim deleted successfully.', {
        style: { background: '#A3E635', color: '#4A2C2A' },
      });
    } catch (err) {
      console.error('Delete error:', err.response?.data || err.message);
      toast.error('Failed to delete claim.');
    }
  };

  // Render status badge with icon (CCI statuses)
  const getStatusBadge = (status) => {
    const statusConfig = {
      Submitted: { class: 'bg-yellow-200 text-yellow-900', icon: FiClock },
      'Under Review': { class: 'bg-blue-200 text-blue-900', icon: FiClock },
      'AI Reviewed': { class: 'bg-purple-200 text-purple-900', icon: FiCheck },
      'Manual Review': { class: 'bg-indigo-200 text-indigo-900', icon: FiClock },
      Approved: { class: 'bg-green-200 text-green-900', icon: FiCheck },
      Rejected: { class: 'bg-red-200 text-red-900', icon: FiX },
      Paid: { class: 'bg-appleGreen text-brown', icon: FiCheck },
      Reinstated: { class: 'bg-orange-200 text-orange-900', icon: FiAlertCircle },
    };
    const config = statusConfig[status] || { class: 'bg-gray-200 text-gray-900', icon: FiClock };
    const Icon = config.icon;
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${config.class} transition-all duration-300`}
      >
        <Icon className="mr-1 w-3 h-3" aria-hidden="true" />
        {status}
      </span>
    );
  };

  // Get payout display (CCI: Use evaluation.payoutAmount; fallback 0)
  const getPayoutDisplay = (claim) => {
    const payout = claim.evaluation?.payoutAmount || 0;
    const drop = claim.evaluation?.revenueDropPercent || 0;
    return payout > 0 ? `KSh ${payout} (${drop}% drop)` : 'Pending Verification';
  };

  // Get latest status
  const getLatestStatus = (claim) => claim.statusHistory?.history[claim.statusHistory.history.length - 1]?.status || 'Unknown';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl border border-appleGreen mx-auto my-10"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl md:text-2xl font-bold text-brown tracking-tight">
          My Claims ({claims.length})
        </h3>
        <Link
          to="/claim"
          className="inline-flex text-xs md:text-sm items-center px-2 md:px-4 py-2.5 bg-gradient-to-r from-yellowGreen to-appleGreen rounded-lg font-semibold text-brown shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          <FiPlus className="mr-2" />
          File a New Claim
        </Link>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-16">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="inline-block h-12 w-12 border-4 border-appleGreen border-t-transparent rounded-full"
          ></motion.div>
          <p className="text-brown mt-4 text-lg font-medium">Loading claims...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-100 text-red-900 p-5 rounded-lg mb-6 flex items-center"
        >
          <FiAlertCircle className="mr-3 text-xl" />
          {error}
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && !error && claims.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <p className="text-brown text-lg font-medium mb-4">
            No claims found. Ready to protect your income?
          </p>
          <Link
            to="/claim"
            className="mt-4 inline-block px-6 py-3 bg-appleGreen text-brown rounded-lg font-semibold hover:bg-yellowGreen transition-colors duration-300"
          >
            File Your First Claim
          </Link>
        </motion.div>
      )}

      {/* Claims List (Summary View) */}
      {!loading && !error && claims.length > 0 && !viewAllOpen && (
        <div className="space-y-2">
          {claims.slice(0, 3).map((claim) => {  // Show recent 3 in summary
            const latestStatus = getLatestStatus(claim);
            const isDeletable = latestStatus === 'Submitted';
            return (
              <motion.div
                key={claim._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white p-4 md:p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-appleGreen/50 cursor-pointer"
                onClick={() => setClaimId(claim._id)} // Open popup for details/progress
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                  {/* Left Column: ID & Date */}
                  <div className="md:col-span-1">
                    <p className="text-sm text-gray-500">Claim ID</p>
                    <p className="text-brown font-semibold">{claim._id.slice(-6)}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Filed on {new Date(claim.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>

                  {/* Middle Columns: Details */}
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Incident</p>
                    <div className="flex items-center gap-2">
                      <span className="text-brown font-medium">{claim.claimDetails.incidentType}</span>
                      <span className="text-xs text-gray-500">on YouTube</span>
                    </div>
                    {claim.evaluation?.revenueDropPercent && (
                      <p className="text-xs text-gray-600 mt-1">
                        Drop: {claim.evaluation.revenueDropPercent}% (verified)
                      </p>
                    )}
                  </div>

                  {/* Right Column: Amount & Status */}
                  <div className="text-right md:text-left">
                    <p className="text-sm text-gray-500">Payout</p>
                    <p className="text-lg font-bold text-appleGreen">
                      {getPayoutDisplay(claim)}
                    </p>
                    <div className="mt-2">
                      {getStatusBadge(latestStatus)}
                    </div>
                    {isDeletable && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteModal({ open: true, claimId: claim._id });
                        }}
                        className="mt-2 text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition-colors duration-200"
                        title="Delete Claim (Submitted only)"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Mini-Timeline (CCI: Visual status history) */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Progress</p>
                  <div className="flex items-center space-x-2">
                    {claim.statusHistory?.history.map((step, index) => (
                      <div key={index} className="flex items-center space-x-1 text-xs">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            index < claim.statusHistory.history.length - 1
                              ? 'bg-appleGreen'
                              : latestStatus === 'Paid' || latestStatus === 'Approved'
                              ? 'bg-appleGreen'
                              : 'bg-gray-300'
                          }`}
                        />
                        <span className="text-gray-600">{step.status}</span>
                        <span className="text-gray-400">({new Date(step.date).toLocaleDateString('short')})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
          {/* View All Button (Inline Toggle) */}
          {claims.length > 3 && (
            <motion.button
              onClick={handleViewAllToggle}
              className="w-full py-3 px-4 bg-appleGreen/10 text-appleGreen rounded-lg font-semibold hover:bg-appleGreen/20 transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <FiEye />
              View All History ({claims.length})
            </motion.button>
          )}
        </div>
      )}

      {/* Full History View (Inline "View All") */}
      {!loading && !error && claims.length > 0 && viewAllOpen && (
        <div className="space-y-4">
          <motion.button
            onClick={handleViewAllToggle}
            className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <FiEye />
            Back to Summary
          </motion.button>
          {fullHistory.map((claim) => {
            const latestStatus = getLatestStatus(claim);
            const isDeletable = latestStatus === 'Submitted';
            return (
              <motion.div
                key={claim._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white p-4 md:p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-appleGreen/50 cursor-pointer"
                onClick={() => setClaimId(claim._id)} // Open popup for details/progress
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                  {/* Left Column: ID & Date */}
                  <div className="md:col-span-1">
                    <p className="text-sm text-gray-500">Claim ID</p>
                    <p className="text-brown font-semibold">{claim._id.slice(-6)}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Filed on {new Date(claim.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>

                  {/* Middle Columns: Details */}
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Incident</p>
                    <div className="flex items-center gap-2">
                      <span className="text-brown font-medium">{claim.claimDetails.incidentType}</span>
                      <span className="text-xs text-gray-500">on YouTube</span>
                    </div>
                    {claim.evaluation?.revenueDropPercent && (
                      <p className="text-xs text-gray-600 mt-1">
                        Drop: {claim.evaluation.revenueDropPercent}% (verified)
                      </p>
                    )}
                  </div>

                  {/* Right Column: Amount & Status */}
                  <div className="text-right md:text-left">
                    <p className="text-sm text-gray-500">Payout</p>
                    <p className="text-lg font-bold text-appleGreen">
                      {getPayoutDisplay(claim)}
                    </p>
                    <div className="mt-2">
                      {getStatusBadge(latestStatus)}
                    </div>
                    {isDeletable && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteModal({ open: true, claimId: claim._id });
                        }}
                        className="mt-2 text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition-colors duration-200"
                        title="Delete Claim (Submitted only)"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Mini-Timeline (CCI: Visual status history) */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Progress</p>
                  <div className="flex items-center space-x-2">
                    {claim.statusHistory?.history.map((step, index) => (
                      <div key={index} className="flex items-center space-x-1 text-xs">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            index < claim.statusHistory.history.length - 1
                              ? 'bg-appleGreen'
                              : latestStatus === 'Paid' || latestStatus === 'Approved'
                              ? 'bg-appleGreen'
                              : 'bg-gray-300'
                          }`}
                        />
                        <span className="text-gray-600">{step.status}</span>
                        <span className="text-gray-400">({new Date(step.date).toLocaleDateString('short')})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Claims Count & Summary */}
      {claims.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 p-4 bg-appleGreen/10 rounded-lg text-brown text-sm font-medium flex justify-between items-center"
        >
          <span>Total Claims: {claims.length}</span>
          {!viewAllOpen && claims.length > 3 && (
            <button onClick={handleViewAllToggle} className="text-yellowGreen hover:underline flex items-center gap-1">
              <FiEye /> View All History
            </button>
          )}
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <h4 className="text-xl font-bold text-brown mb-4">
                Confirm Deletion
              </h4>
              <p className="text-brown mb-6">
                Are you sure you want to delete this claim? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setDeleteModal({ open: false, claimId: null })}
                  className="px-5 py-2 bg-gray-200 text-brown rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteClaim(deleteModal.claimId)}
                  className="px-5 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors duration-300"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Claim Details Popup */}
      <ClaimComponentPopup />
    </motion.div>
  );
};

// Helper: Get payout display (CCI-aligned)
const getPayoutDisplay = (claim) => {
  const payout = claim.evaluation?.payoutAmount || 0;
  const drop = claim.evaluation?.revenueDropPercent || 0;
  return payout > 0 ? `KSh ${payout} (${drop}% drop)` : 'Pending Verification';
};

export default ClaimsManagement;