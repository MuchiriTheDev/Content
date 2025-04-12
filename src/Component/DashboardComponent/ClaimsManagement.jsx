import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const ClaimsManagement = () => {
  return (
    <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="p-6 bg-white rounded-xl shadow-2xl border border-appleGreen"
      >
        <h3 className="text-xl md:text-2xl font-extrabold text-brown mb-4">Claims</h3>
        <p className="text-brown mt-2">Latest Claim: $2,000 - Paid</p>
        <div className="mt-5 ">
        <Link
            to={'/claim'}
          className=" w-full py-3 px-4 bg-gradient-to-r from-yellowGreen to-appleGreen rounded-lg font-semibold text-brown shadow-lg hover:shadow-yellowGreen/50 transition-all duration-300"
        >
          File a Claim
        </Link>
        </div>
      </motion.div>
  )
}

export default ClaimsManagement