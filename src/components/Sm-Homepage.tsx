'use client'
import SignupModal from "@/sm-components/SignupModal"
import Navbar from "./Navbar"
import { motion, Variants, Transition } from "framer-motion"
import { useEffect, useState } from "react"

// Properly typed variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.2,
      when: "beforeChildren"
    } 
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.8, 
      ease: "easeOut" 
    } 
  }
}

const typingTransition: Transition = {
  duration: 1.5,
  ease: "easeInOut",
  repeat: Infinity,
  repeatType: "reverse" as const
}

const typingVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: typingTransition
  }
}

export default function SmHomepage() {
  const [isMounted, setIsMounted] = useState(false)
  const [signupOpen , setSignupOpen] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/30 to-black/80" />
      
      <Navbar bg="bg-transparent" />
      
      <motion.main 
        className="relative z-10 pt-24 px-4"
        initial="hidden"
        animate={isMounted ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto text-center flex flex-col items-center">
          <motion.div 
            className="mb-8"
            variants={itemVariants}
            animate={{
              y: [-10, 10, -10],
              transition: {
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse" as const,
                ease: "easeInOut"
              }
            }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-400 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </motion.div>

          <motion.p 
            className="text-lg text-white/85 mb-6 max-w-xs mx-auto"
            variants={itemVariants}
          >
            Your gateway to AI-powered social interactions
            <motion.span
              className="ml-1 inline-block w-1 h-5 bg-white/80"
              variants={typingVariants}
            />
          </motion.p>

          <motion.h1 
            className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-200 mb-8"
            variants={itemVariants}
          >
            Connect with Intelligent Personalities
          </motion.h1>

          <motion.div 
            className="flex flex-col gap-4 w-full max-w-xs"
            variants={itemVariants}
          >
            <motion.button 

            onClick={()=>{setSignupOpen(true)}}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-400 text-white px-6 py-3 rounded-2xl font-semibold"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0px 5px 15px rgba(139, 92, 246, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Start Chatting
            </motion.button>
          </motion.div>
        </div>
      </motion.main>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-transparent to-transparent z-20" />
      <motion.div 
        className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          repeatType: "mirror" as const 
        }}
      />
      <motion.div 
        className="absolute -bottom-40 -right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 2, 
          delay: 1, 
          repeat: Infinity, 
          repeatType: "mirror" as const 
        }}
      />

      <SignupModal isOpen={signupOpen} onClose={()=>{setSignupOpen(false)}}/>
    </div>
  )
}