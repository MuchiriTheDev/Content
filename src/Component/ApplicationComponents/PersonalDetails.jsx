import React from 'react';
import { useForm } from 'react-hook-form';
import { FaLock, FaMailBulk, FaUser, FaPhone, FaGlobe, FaHome, FaIdCard, FaLanguage, FaGraduationCap, FaRing } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { MdArrowBack } from 'react-icons/md';
import { Link } from 'react-router-dom';

const PersonalDetails = ({ onNext }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    onNext(data); // Pass data to the next step
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="w-full min-h-screen bg-gray-100 text-fadeBrown flex flex-col items-center justify-start py-8 px-4 md:px-8 overflow-auto"
    >
      {/* Header Section */}
      <div className="w-full  mb-6">
        <div className="flex gap-3 items-center">
          <Link to="/" className="py-2">
            <MdArrowBack size={25} className="text-brown" />
          </Link>
          <h2 className="text-3xl font-extrabold text-brown">
            Personal Details
          </h2>
        </div>
        <p className="text-yellowGreen text-sm mt-2">
          Provide your personal information to begin your application. This helps us verify your identity and tailor your insurance.
        </p>
      </div>

      {/* Form Container */}
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        onSubmit={handleSubmit(onSubmit)}
        className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 gap-y-20 items-center bg-white backdrop-blur-md rounded-xl shadow-2xl border border-appleGreen p-6 "
      >
        {/* Basic Information Section */}
        <div className="space-y-4 w-full h-full">
          <h3 className="text-xl font-bold text-brown border-b-2 border-appleGreen pb-2">Basic Information</h3>
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium mb-1 text-brown">
              Full Name
            </label>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full h-12 border-2 border-appleGreen rounded-lg flex gap-3 items-center"
            >
              <FaUser className="w-fit p-2 h-full text-appleGreen" />
              <input
                className="border-none placeholder:text-gray-600 text-brown bg-transparent outline-none w-full h-full"
                type="text"
                {...register("fullName", { required: "Full name is required" })}
                placeholder="Ex: Jane Mwangi"
              />
            </motion.div>
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
          </div>

          {/* Date of Birth */}
          <div>
            <label htmlFor="dob" className="block text-sm font-medium mb-1 text-brown">
              Date of Birth
            </label>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full h-12 border-2 border-appleGreen rounded-lg flex gap-3 items-center"
            >
              <FaUser className="w-fit p-2 h-full text-appleGreen" />
              <input
                className="border-none placeholder:text-gray-600 text-brown bg-transparent outline-none w-full h-full"
                type="date"
                {...register("dob", { required: "Date of birth is required" })}
              />
            </motion.div>
            {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob.message}</p>}
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium mb-1 text-brown">
              Gender (Optional)
            </label>
            <motion.select
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-transparent outline-none"
              {...register("gender")}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </motion.select>
          </div>
        </div>

        {/* Contact Details Section */}
        <div className='space-y-4 w-full h-full'>
          <h3 className="text-xl font-bold text-brown border-b-2 border-appleGreen pb-2">Contact Details</h3>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1 text-brown">
              Email
            </label>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full h-12 border-2 border-appleGreen rounded-lg flex gap-3 items-center"
            >
              <FaMailBulk className="w-fit p-2 h-full text-appleGreen" />
              <input
                className="border-none placeholder:text-gray-600 text-brown bg-transparent outline-none w-full h-full"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                })}
                placeholder="Ex: janemwangi@gmail.com"
              />
            </motion.div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1 text-brown">
              Phone Number
            </label>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full h-12 border-2 border-appleGreen rounded-lg flex gap-3 items-center"
            >
              <FaPhone className="w-fit p-2 h-full text-appleGreen" />
              <input
                className="border-none placeholder:text-gray-600 text-brown bg-transparent outline-none w-full h-full"
                type="tel"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: { value: /^[0-9]{10,15}$/, message: "Invalid phone number" }
                })}
                placeholder="Ex: 0712345678"
              />
            </motion.div>
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>

          {/* Residential Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-1 text-brown">
              Residential Address
            </label>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full h-12 border-2 border-appleGreen rounded-lg flex gap-3 items-center"
            >
              <FaHome className="w-fit p-2 h-full text-appleGreen" />
              <input
                className="border-none placeholder:text-gray-600 text-brown bg-transparent outline-none w-full h-full"
                type="text"
                {...register("address", { required: "Address is required" })}
                placeholder="Ex: 123 Nairobi St, Nairobi"
              />
            </motion.div>
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
          </div>
        </div>

        {/* Identification Section */}
        <div className='space-y-4 w-full h-full'>
          <h3 className="text-xl font-bold text-brown border-b-2 border-appleGreen pb-2">Identification</h3>
          {/* Nationality */}
          <div>
            <label htmlFor="nationality" className="block text-sm font-medium mb-1 text-brown">
              Nationality
            </label>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full h-12 border-2 border-appleGreen rounded-lg flex gap-3 items-center"
            >
              <FaGlobe className="w-fit p-2 h-full text-appleGreen" />
              <input
                className="border-none placeholder:text-gray-600 text-brown bg-transparent outline-none w-full h-full"
                type="text"
                {...register("nationality", { required: "Nationality is required" })}
                placeholder="Ex: Kenyan"
              />
            </motion.div>
            {errors.nationality && <p className="text-red-500 text-xs mt-1">{errors.nationality.message}</p>}
          </div>

          {/* ID Number */}
          <div>
            <label htmlFor="idNumber" className="block text-sm font-medium mb-1 text-brown">
              ID Number
            </label>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full h-12 border-2 border-appleGreen rounded-lg flex gap-3 items-center"
            >
              <FaIdCard className="w-fit p-2 h-full text-appleGreen" />
              <input
                className="border-none placeholder:text-gray-600 text-brown bg-transparent outline-none w-full h-full"
                type="text"
                {...register("idNumber", { required: "ID number is required" })}
                placeholder="Ex: 12345678"
              />
            </motion.div>
            {errors.idNumber && <p className="text-red-500 text-xs mt-1">{errors.idNumber.message}</p>}
          </div>

          {/* ID Document Upload */}
          <div>
            <label htmlFor="idDocument" className="block text-sm font-medium mb-1 text-brown">
              Upload ID Document
            </label>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full h-16 border-2 border-dashed border-appleGreen rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <FaIdCard className="text-appleGreen mr-2" />
              <input
                className="text-brown file:border-none file:bg-appleGreen file:text-white file:rounded file:px-4 file:py-2"
                type="file"
                accept=".pdf,.jpg,.png"
                {...register("idDocument", { required: "ID document is required" })}
              />
            </motion.div>
            {errors.idDocument && <p className="text-red-500 text-xs mt-1">{errors.idDocument.message}</p>}
          </div>
        </div>

        {/* Additional Information Section */}
        <div className='space-y-4 w-full h-full'>
          <h3 className="text-xl font-bold text-brown border-b-2 border-appleGreen pb-2">Additional Information</h3>
          {/* Primary Language */}
          <div>
            <label htmlFor="language" className="block text-sm font-medium mb-1 text-brown">
              Primary Language(s)
            </label>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full h-12 border-2 border-appleGreen rounded-lg flex gap-3 items-center"
            >
              <FaLanguage className="w-fit p-2 h-full text-appleGreen" />
              <input
                className="border-none placeholder:text-gray-600 text-brown bg-transparent outline-none w-full h-full"
                type="text"
                {...register("language", { required: "Primary language is required" })}
                placeholder="Ex: English, Swahili"
              />
            </motion.div>
            {errors.language && <p className="text-red-500 text-xs mt-1">{errors.language.message}</p>}
          </div>

          {/* Marital Status */}
          <div>
            <label htmlFor="maritalStatus" className="block text-sm font-medium mb-1 text-brown">
              Marital Status (Optional)
            </label>
            <motion.select
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-transparent outline-none"
              {...register("maritalStatus")}
            >
              <option value="">Select Status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
            </motion.select>
          </div>

          {/* Occupation Outside Content Creation */}
          <div>
            <label htmlFor="occupation" className="block text-sm font-medium mb-1 text-brown">
              Other Occupation (Optional)
            </label>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full h-12 border-2 border-appleGreen rounded-lg flex gap-3 items-center"
            >
              <FaUser className="w-fit p-2 h-full text-appleGreen" />
              <input
                className="border-none placeholder:text-gray-600 text-brown bg-transparent outline-none w-full h-full"
                type="text"
                {...register("occupation")}
                placeholder="Ex: Teacher"
              />
            </motion.div>
          </div>

          {/* Educational Background */}
          <div>
            <label htmlFor="education" className="block text-sm font-medium mb-1 text-brown">
              Educational Background (Optional)
            </label>
            <motion.select
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-transparent outline-none"
              {...register("education")}
            >
              <option value="">Select Education</option>
              <option value="highschool">High School</option>
              <option value="bachelors">Bachelor’s Degree</option>
              <option value="masters">Master’s Degree</option>
              <option value="other">Other</option>
            </motion.select>
          </div>
        </div>

        {/* Next Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-fit px-10 py-3 bg-gradient-to-r from-yellowGreen to-appleGreen rounded-lg font-semibold text-brown shadow-lg hover:shadow-yellowGreen/50 transition-all duration-300 transform"
        >
          Next
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default PersonalDetails;