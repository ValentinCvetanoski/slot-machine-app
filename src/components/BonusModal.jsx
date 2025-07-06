import React from "react";
import { motion } from "framer-motion";

export default function BonusModal({ onClose }) {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-panel p-8 rounded-xl text-center shadow-neon"
        initial={{ scale: 0.7 }} animate={{ scale: 1 }}
      >
        <h2 className="text-accent text-2xl mb-4">🚀 Bonus Round!</h2>
        <p className="text-gray-300">3+ BONUS symbols — enjoy free spins!</p>
        <button
          className="mt-6 px-6 py-2 bg-accent text-bg rounded-lg"
          onClick={onClose}
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}
