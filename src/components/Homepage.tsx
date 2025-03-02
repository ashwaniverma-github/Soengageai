'use client'
import Navbar from '@/components/Navbar'
import Image from 'next/image'
import { Button } from "@/components/ui/button"

export default function Homepage() {
  return (
    <div className="min-h-screen relative ">
      <Navbar bg="bg-transparent" />
      
      {/* Background Image */}
      <div className="absolute inset-0 -z-10 h-screen w-scree overflow-hidden p-10">
        <Image
          src="/BG.png"
          alt="Background"
          fill
          priority
          quality={100}
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" />
      </div>

      {/* Hero Content */}
      <main className="relative z-10 pt-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
              
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in-up delay-100">
          AI-powered social content hub.
          </p>

          <h1 className="text-2xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-6 animate-fade-in-up">
            Socialise With AI Models
          </h1>

        </div>
      </main>
    </div>
  )
}