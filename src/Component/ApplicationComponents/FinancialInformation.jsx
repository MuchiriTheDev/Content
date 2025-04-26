import React, { useEffect } from 'react';
import { FaExclamationCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useWatch } from 'react-hook-form';

const FinancialInformation = ({ register, errors, control, getValues, setValue }) => {
  // Watch paymentMethod.type to conditionally render details fields
  const paymentMethodType = useWatch({
    control,
    name: 'financialInfo.paymentMethod.type',
    defaultValue: 'Mpesa',
  });

  // Reset details fields when paymentMethod.type changes
  useEffect(() => {
    setValue('financialInfo.paymentMethod.details', {
      mobileNumber: '',
      accountNumber: '',
      email: '',
      otherDetails: '',
    });
  }, [paymentMethodType, setValue]);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h3 className="text-2xl md:text-3xl font-bold text-brown text-center">
          Financial Information
        </h3>
        <p className="text-gray-600 mt-2 text-sm md:text-base text-center">
          Provide your financial details to calculate your insurance premium and set up payment.
        </p>
      </div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white border-2 border-appleGreen rounded-xl p-4 md:p-6 shadow-lg hover:shadow-appleGreen/30 transition-shadow duration-300"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Monthly Earnings */}
          <div>
            <label className="block text-sm font-medium mb-1 text-brown">
              Monthly Earnings <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              {...register('financialInfo.monthlyEarnings', {
                required: 'Monthly earnings are required',
                min: {
                  value: 0,
                  message: 'Earnings cannot be negative',
                },
              })}
              className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
              placeholder="e.g., 50000"
            />
            {errors.financialInfo?.monthlyEarnings && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <FaExclamationCircle /> {errors.financialInfo.monthlyEarnings.message}
              </p>
            )}
          </div>

          {/* Currency */}
          <div>
            <label className="block text-sm font-medium mb-1 text-brown">
              Currency <span className="text-red-500">*</span>
            </label>
            <select
              {...register('financialInfo.currency', {
                required: 'Currency is required',
              })}
              className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
            >
              <option value="Ksh">Ksh</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
            {errors.financialInfo?.currency && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <FaExclamationCircle /> {errors.financialInfo.currency.message}
              </p>
            )}
          </div>

          {/* Payment Method Type */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1 text-brown">
              Payment Method <span className="text-red-500">*</span>
            </label>
            <select
              {...register('financialInfo.paymentMethod.type', {
                required: 'Payment method is required',
              })}
              className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
            >
              <option value="Mpesa">Mpesa</option>
              <option value="Bank">Bank</option>
              <option value="PayPal">PayPal</option>
              <option value="Other">Other</option>
            </select>
            {errors.financialInfo?.paymentMethod?.type && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <FaExclamationCircle /> {errors.financialInfo.paymentMethod.type.message}
              </p>
            )}
          </div>

          {/* Conditional Details Fields */}
          {paymentMethodType === 'Mpesa' && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-brown">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('financialInfo.paymentMethod.details.mobileNumber', {
                  required: 'Mobile number is required for Mpesa',
                  pattern: {
                    value: /^\+?[1-9]\d{1,14}$/,
                    message: 'Invalid phone number (e.g., +254712345678)',
                  },
                })}
                className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                placeholder="e.g., +254712345678"
              />
              {errors.financialInfo?.paymentMethod?.details?.mobileNumber && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationCircle /> {errors.financialInfo.paymentMethod.details.mobileNumber.message}
                </p>
              )}
            </div>
          )}

          {paymentMethodType === 'Bank' && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-brown">
                Account Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('financialInfo.paymentMethod.details.accountNumber', {
                  required: 'Account number is required for Bank',
                  pattern: {
                    value: /^[A-Za-z0-9-]+$/,
                    message: 'Account number must be alphanumeric',
                  },
                })}
                className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                placeholder="e.g., 1234567890"
              />
              {errors.financialInfo?.paymentMethod?.details?.accountNumber && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationCircle /> {errors.financialInfo.paymentMethod.details.accountNumber.message}
                </p>
              )}
            </div>
          )}

          {paymentMethodType === 'PayPal' && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-brown">
                PayPal Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                {...register('financialInfo.paymentMethod.details.email', {
                  required: 'Email is required for PayPal',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Invalid email address',
                  },
                })}
                className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                placeholder="e.g., yourname@example.com"
              />
              {errors.financialInfo?.paymentMethod?.details?.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationCircle /> {errors.financialInfo.paymentMethod.details.email.message}
                </p>
              )}
            </div>
          )}

          {paymentMethodType === 'Other' && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-brown">
                Payment Details
              </label>
              <input
                type="text"
                {...register('financialInfo.paymentMethod.details.otherDetails')}
                className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                placeholder="e.g., Describe your payment method"
              />
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FinancialInformation;