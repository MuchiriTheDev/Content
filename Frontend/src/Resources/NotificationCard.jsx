import React from 'react'
import { FaBell } from 'react-icons/fa'
import { motion } from 'framer-motion'

const NotificationCard = () => {
  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="hidden md:block fixed top-16 right-4 w-72 p-6 bg-white rounded-xl shadow-2xl border border-appleGreen z-20"
    >
     <h3 className="text-xl font-extrabold text-brown flex items-center gap-2">
            <FaBell /> Notifications
     </h3>
     <p className="text-brown text-sm mt-2">YouTube: Video demonetized</p>
     <p className="text-yellowGreen text-sm mt-1">Payment due in 3 days</p>
    </motion.div>
  )
}

export default NotificationCard