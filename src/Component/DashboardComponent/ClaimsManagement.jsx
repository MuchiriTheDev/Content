import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { backendUrl } from '../../App';
import { FiTrash2, FiPlus, FiAlertCircle } from 'react-icons/fi'; // Icons for actions
import ClaimComponentPopup from '../ClaimsComponents/ClaimComponentPopup';
import { GeneralContext } from '../../Context/GeneralContext';

const ClaimsManagement = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const { claimId, setClaimId } = useContext(GeneralContext); // State to hold the claim ID for the popup
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, claimId: null });
  const navigate = useNavigate();

  // Fetch claims on component mount
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/claims/my-claims`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setClaims(response.data.claims);
        setLoading(false);
      } catch (err) {
        setError('Failed to load claims. Please try again.');
        setLoading(false);
        toast.error('Failed to load claims.');
      }
    };
    fetchClaims();
  }, []);

  // Handle claim deletion
  const handleDeleteClaim = async (claimId) => {
    try {
      await axios.delete(`${backendUrl}/claims/${claimId}/delete`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setClaims(claims.filter((claim) => claim._id !== claimId));
      setDeleteModal({ open: false, claimId: null });
      toast.success('Claim deleted successfully.', {
        style: { background: '#A3E635', color: '#4A2C2A' },
      });
    } catch (err) {
      toast.error('Failed to delete claim.');
    }
  };

  // Render status badge
  const getStatusBadge = (status) => {
    const statusStyles = {
      Submitted: 'bg-yellow-200 text-yellow-900',
      'Under Review': 'bg-blue-200 text-blue-900',
      'AI Reviewed': 'bg-purple-200 text-purple-900',
      'Manual Review': 'bg-indigo-200 text-indigo-900',
      Approved: 'bg-green-200 text-green-900',
      Rejected: 'bg-red-200 text-red-900',
      Paid: 'bg-appleGreen text-brown',
    };
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
          statusStyles[status] || 'bg-gray-200 text-gray-900'
        } transition-all duration-300`}
      >
        {status}
      </span>
    );
  };

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
          My Claims
        </h3>
        <Link
          to="/claims"
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
      {error && (
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
          <p className="text-brown text-lg font-medium">
            No claims found. Start by filing a new claim.
          </p>
          <Link
            to="/claims"
            className="mt-4 inline-block px-6 py-3 bg-appleGreen text-brown rounded-lg font-semibold hover:bg-yellowGreen transition-colors duration-300"
          >
            File Your First Claim
          </Link>
        </motion.div>
      )}

      {/* Claims List */}
      {!loading && !error && claims.length > 0 && (
        <div className="grid gap-4 md:gap-6">
          {claims.map((claim) => (
            <motion.div
              key={claim._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white p-4 md:p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-appleGreen cursor-pointer"
              onClick={() => setClaimId(claim._id)}
            >
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
                {/* Claim ID */}
                <div>
                  <p className="text-sm text-gray-500">Claim ID</p>
                  <p className="text-brown font-medium">{claim._id.slice(-6)}</p>
                </div>
                {/* Platform */}
                <div>
                  <p className="text-sm text-gray-500">Platform</p>
                  <p className="text-brown font-medium">
                    {claim.claimDetails.platform}
                  </p>
                </div>
                {/* Incident Type */}
                <div>
                  <p className="text-sm text-gray-500">Incident Type</p>
                  <p className="text-brown font-medium">
                    {claim.claimDetails.incidentType}
                  </p>
                </div>
                {/* Amount */}
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="text-brown font-medium">
                    {claim.claimDetails.reportedEarningsLoss}{' '}
                    {claim.claimDetails.currency}
                  </p>
                </div>
                {/* Status and Actions */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    {getStatusBadge(
                      claim.statusHistory.history[
                        claim.statusHistory.history.length - 1
                      ].status
                    )}
                  </div>
                  {claim.statusHistory.history[
                    claim.statusHistory.history.length - 1
                  ].status === 'Submitted' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteModal({ open: true, claimId: claim._id });
                      }}
                      className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition-colors duration-200"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  )}
                </div>
              </div>
              {/* Date */}
              <p className="text-sm text-gray-500 mt-4">
                Filed on{' '}
                {new Date(claim.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Claims Count */}
      {claims.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-brown text-sm font-medium"
        >
          Showing {claims.length} claim{claims.length > 1 ? 's' : ''}
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
                Are you sure you want to delete this claim? This action cannot be
                undone.
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
    </motion.div>
  );
};

export default ClaimsManagement;