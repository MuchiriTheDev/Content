import React from 'react'
import { motion } from 'framer-motion'
import { useState } from 'react'

const DashboardAnalytics = () => {
  return (
    <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="p-6 bg-white rounded-xl shadow-2xl border border-appleGreen"
      >
        <h3 className="text-xl md:text-2xl font-extrabold text-brown mb-4">Analytics</h3>
        <p className="text-brown">More detailed analytics coming soon...</p>
      </motion.div>
  )
}

export default DashboardAnalytics