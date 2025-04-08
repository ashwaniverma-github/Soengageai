'use client'
import Navbar from '@/components/Navbar'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Homepage() {
  return (
    <div className="min-h-screen relative">
      <Navbar bg="bg-transparent" />
      
      {/* Background Image */}
      <div className="bg-black  absolute inset-0 -z-10 h-screen overflow-hidden">
        <Image
          src="/BG.png"
          alt="Background"
          fill
          priority
          quality={100}
          className="object-cover hidden sm:block object-center"
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-s" 
        />
      </div>

      {/* Hero Content */}
      <main className="relative z-10 pt-40 space-y-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
              AI-powered social content hub.
            </p>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-300 mb-8"
          >
            Socialize With AI Influencers
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <p className='text-white text-lg md:text-xl max-w-2xl mx-auto leading-relaxed'>
              Experience the future of social media engagement—Connect and Interact with digital AI influencers who create and share content just for you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-10"
          >
            
          </motion.div>
        </div>
      </main>

      {/* Floating elements for visual interest */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-12 h-12 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-md"
            initial={{ 
              x: Math.random() * 100 - 50 + "%", 
              y: Math.random() * 100 + "%",
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              x: [
                Math.random() * 100 - 50 + "%", 
                Math.random() * 100 - 50 + "%"
              ],
              y: [
                Math.random() * 100 + "%", 
                Math.random() * 100 + "%"
              ]
            }}
            transition={{ 
              duration: Math.random() * 10 + 20, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}
      </div>
    </div>
  )
}