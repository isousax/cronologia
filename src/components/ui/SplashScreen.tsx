import { motion } from 'framer-motion'

export default function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-b from-purple-900 to-indigo-900"
    >
      <div className="flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Carregando...
        </h1>

        {/* Loader girando */}
        <div className="w-14 h-14 border-4 border-white border-t-transparent rounded-full animate-spin mb-6" />

      </div>
    </motion.div>
  )
}