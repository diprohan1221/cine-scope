import React from 'react';
import { motion } from 'framer-motion';

function ConfirmationModal({ isOpen, message, onConfirm, onCancel, confirmText = "Yes", cancelText = "No" }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-6 rounded-lg shadow-xl w-full max-w-sm"
      >
        <p className="text-lg text-center mb-6">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-6 py-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            // Highlighting the "Yes" button in red as you requested for a sign-out action
            className="px-6 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default ConfirmationModal;