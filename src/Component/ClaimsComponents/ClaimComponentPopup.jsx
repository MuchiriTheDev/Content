import React, { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes,
  FaExclamationCircle,
  FaFileAlt,
  FaLink,
  FaCalendarAlt,
  FaShieldAlt,
  FaCheckCircle,
  FaRedo,
} from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import { backendUrl } from '../../App';
import { GeneralContext } from '../../Context/GeneralContext';

const ClaimComponentPopup = ({ claimId }) => {
  const [claimDetails, setClaimDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setClaimId } = useContext(GeneralContext);

  const onClose = () => {
    setClaimId(null);
    setClaimDetails(null);
    setError(null);
    setLoading(false);
  };

  const fetchClaimDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/claims/${claimId}/claim`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.data.success) {
        setClaimDetails(response.data.claim);
        toast.success('Claim details fetched successfully!', {
          style: { background: '#AAC624', color: '#4F391A' },
        });
      } else {
        throw new Error('Failed to fetch claim details');
      }
    } catch (error) {
      console.error('Error fetching claim details:', error);
      setError('Failed to fetch claim details.');
      toast.error('Failed to fetch claim details!', {
        style: { background: '#f44336', color: '#ffffff' },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!claimId) return;
    fetchClaimDetails();
  }, [claimId]);

  if (!claimId) return null;

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <div className="bg-white px-8 py-6 rounded-xl shadow-lg flex items-center gap-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-appleGreen"></div>
          <p className="text-brown text-base font-medium">Loading Claim...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <div className="bg-white px-8 py-6 rounded-xl shadow-lg flex flex-col items-center gap-4">
          <FaExclamationCircle className="text-red-500" size={24} />
          <p className="text-red-500 text-base font-medium">{error}</p>
          <div className="flex gap-4">
            <button
              onClick={fetchClaimDetails}
              className="px-4 py-2 bg-appleGreen text-white rounded-lg font-medium hover:bg-yellowGreen transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-appleGreen"
            >
              <FaRedo size={16} className="inline mr-2" />
              Retry
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-brown rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-appleGreen"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!claimDetails) return null;

  const {
    _id,
    claimDetails: details,
    statusHistory,
    evaluation,
    evidence,
    createdAt,
    resolutionDeadline,
  } = claimDetails;

  const currentStatus =
    statusHistory?.history[statusHistory.history.length - 1]?.status || 'Unknown';
  const incidentDate = details?.incidentDate
    ? new Date(details.incidentDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'N/A';
  const createdDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'N/A';
  const deadlineDate = resolutionDeadline
    ? new Date(resolutionDeadline).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'N/A';

  return (
    <AnimatePresence>
      {claimId && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white w-full sm:w-[640px] max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl border border-appleGreen/10 scrollbar-custom"
          >
            {/* Sticky Header */}
            <div className="sticky top-0 bg-white z-10 p-6 border-b border-appleGreen/10">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-brown flex items-center gap-2">
                  <FaShieldAlt className="text-appleGreen" size={20} />
                  Claim Details
                </h2>
                <button
                  onClick={onClose}
                  className="text-brown hover:text-appleGreen p-2 rounded-full hover:bg-fadeBrown transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-appleGreen"
                  aria-label="Close claim details popup"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              <p className="text-gray-500 text-sm mt-2">Claim ID: {_id.slice(-6)}</p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Claim Overview */}
              <section className="bg-fadeBrown p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-brown flex items-center gap-2 mb-4">
                  <FaCheckCircle className="text-appleGreen" size={20} />
                  Claim Overview
                </h3>
                <div className="space-y-4 text-base">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Platform</p>
                      <p className="text-brown font-medium">{details?.platform || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Incident Type</p>
                      <p className="text-brown font-medium">{details?.incidentType || 'N/A'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Incident Date</p>
                    <p className="text-brown font-medium flex items-center gap-2">
                      <FaCalendarAlt className="text-appleGreen" size={16} />
                      {incidentDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        currentStatus === 'AI Reviewed'
                          ? 'bg-purple-100 text-purple-800'
                          : currentStatus === 'Submitted'
                          ? 'bg-yellow-100 text-yellow-800'
                          : currentStatus === 'Approved'
                          ? 'bg-appleGreen/20 text-brown'
                          : currentStatus === 'Rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {currentStatus}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Reported Earnings Loss</p>
                    <p className="text-brown font-medium">
                      {details?.reportedEarningsLoss
                        ? `${details.reportedEarningsLoss} ${details.currency}`
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Filed On</p>
                    <p className="text-brown font-medium flex items-center gap-2">
                      <FaCalendarAlt className="text-appleGreen" size={16} />
                      {createdDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Resolution Deadline</p>
                    <p className="text-brown font-medium flex items-center gap-2">
                      <FaCalendarAlt className="text-appleGreen" size={16} />
                      {deadlineDate}
                    </p>
                  </div>
                </div>
              </section>

              {/* Incident Description */}
              <section className="bg-fadeBrown p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-brown flex items-center gap-2 mb-4">
                  <FaFileAlt className="text-appleGreen" size={20} />
                  Incident Description
                </h3>
                <div className="bg-white p-4 rounded-md max-h-48 overflow-y-auto">
                  <p className="text-brown text-base leading-relaxed">
                    {details?.incidentDescription || 'No description provided'}
                  </p>
                </div>
              </section>

              {/* Evidence */}
              <section className="bg-fadeBrown p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-brown flex items-center gap-2 mb-4">
                  <FaLink className="text-appleGreen" size={20} />
                  Evidence
                </h3>
                <div className="space-y-4">
                  {evidence?.files?.length > 0 && (
                    <div>
                      <p className="text-brown font-medium flex items-center gap-2 mb-2">
                        <FaFileAlt className="text-appleGreen" size={16} />
                        Uploaded Files
                      </p>
                      <ul className="ml-6 list-disc text-brown text-base space-y-2">
                        {evidence.files.map((file) => (
                          <li key={file._id}>
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline text-yellowGreen hover:text-appleGreen transition-colors duration-200"
                            >
                              {file.description || 'View File'}
                            </a>{' '}
                            <span className="text-gray-500 text-sm">
                              (Uploaded:{' '}
                              {file.uploadedAt
                                ? new Date(file.uploadedAt).toLocaleDateString('en-US')
                                : 'N/A'})
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {evidence?.affectedContent?.length > 0 && (
                    <div>
                      <p className="text-brown font-medium flex items-center gap-2 mb-2">
                        <FaLink className="text-appleGreen" size={16} />
                        Affected Content
                      </p>
                      <ul className="ml-6 list-disc text-brown text-base space-y-2">
                        {evidence.affectedContent.map((content) => (
                          <li key={content._id}>
                            <a
                              href={content.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline text-yellowGreen hover:text-appleGreen transition-colors duration-200"
                            >
                              {content.description || content.url}
                            </a>{' '}
                            <span className="text-gray-500 text-sm">
                              ({content.mediaType || 'N/A'})
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {evidence?.additionalNotes && (
                    <div>
                      <p className="text-brown font-medium flex items-center gap-2 mb-2">
                        <FaFileAlt className="text-appleGreen" size={16} />
                        Additional Notes
                      </p>
                      <div className="bg-white p-4 rounded-md">
                        <p className="text-brown text-base leading-relaxed">
                          {evidence.additionalNotes}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* AI Evaluation */}
              {evaluation?.aiAnalysis && (
                <section className="bg-fadeBrown p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-brown flex items-center gap-2 mb-4">
                    <FaExclamationCircle className="text-appleGreen" size={20} />
                    AI Evaluation
                  </h3>
                  <div className="bg-white p-4 rounded-md">
                    <p className="text-brown font-medium flex items-center gap-2 mb-2">
                      <FaCheckCircle
                        className={
                          evaluation.aiAnalysis.isValid
                            ? 'text-appleGreen'
                            : 'text-red-500'
                        }
                        size={16}
                      />
                      Valid: {evaluation.aiAnalysis.isValid ? 'Yes' : 'No'} (Confidence:{' '}
                      {evaluation.aiAnalysis.confidenceScore}%)
                    </p>
                    <ul className="ml-6 list-disc text-brown text-base space-y-2">
                      {evaluation.aiAnalysis.reasons.map((reason, index) => (
                        <li key={index}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}
            </div>

            {/* Sticky Footer */}
            <div className="sticky bottom-0 bg-white z-10 p-6 border-t border-appleGreen/10">
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="px-6 py-2 bg-appleGreen text-white rounded-lg font-medium hover:bg-yellowGreen transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-appleGreen"
                >
                  Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ClaimComponentPopup;