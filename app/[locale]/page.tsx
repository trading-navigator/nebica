"use client"

import { ChatbotUISVG } from "@/components/icons/chatbotui-svg"
import { IconArrowRight } from "@tabler/icons-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { motion } from "framer-motion"
import HomepageTextAnnimation from "@/components/animmation/HomepageTextAnimation"

export default function HomePage() {
  const { theme } = useTheme()

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#050816] px-4 text-center text-white sm:px-8">
      {/* 🌌 Enhanced AI-Tech Background */}
      <div className="absolute inset-0 z-0 size-full overflow-hidden">
        {/* Base gradient layer */}
        <div className="absolute inset-0 size-full bg-gradient-to-br from-[#111827] via-[#1e293b] to-[#0f172a] opacity-90" />

        {/* Subtle grid pattern */}
        <div className="bg-[radial-gradient(circle,rgba(255,255,255,0.05) 1px,transparent 1px)] absolute inset-0 size-full opacity-20 [background-size:30px_30px]" />

        {/* Animated gradient blobs */}
        <motion.div
          className="absolute left-1/4 top-1/4 size-64 rounded-full bg-blue-600/20 blur-[80px]"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 size-72 rounded-full bg-purple-600/20 blur-[90px]"
          animate={{
            x: [0, -40, 0],
            y: [0, -20, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        {/* Subtle particle animation */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(10)].map(
            (
              _,
              i // Reduce particle count for performance
            ) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white/10"
                style={{
                  width: `${Math.random() * 4 + 1}px`,
                  height: `${Math.random() * 4 + 1}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
                animate={{
                  y: [0, Math.random() * 100 - 50],
                  x: [0, Math.random() * 60 - 30],
                  opacity: [0.2, 0.8, 0.2]
                }}
                transition={{
                  duration: Math.random() * 20 + 10,
                  repeat: Infinity,
                  ease: "linear",
                  delay: Math.random() * 5
                }}
              />
            )
          )}
        </div>
      </div>

      {/* 🌟 Logo Section (placed on top) */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="z-10 my-6 flex items-center justify-center"
      >
        <div
          className="
    
      drop-shadow-[20px_20px_20px_rgba(255,255,255,2.5)] 
    
    "
        >
          <ChatbotUISVG theme="light" scale={0.6} />
        </div>
      </motion.div>

      {/* 🌟 Text Content */}
      <HomepageTextAnnimation />

      {/* 🚀 CTA Button */}
      <motion.div
        className="z-10 mt-6"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Link
          aria-label="Start Chatting" // Improve accessibility
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 hover:from-blue-400 hover:to-purple-500 hover:shadow-xl sm:px-6 sm:text-lg"
          href="/guest/chat"
        >
          Start Chatting
          <IconArrowRight className="ml-2" size={20} />
        </Link>
      </motion.div>
    </div>
  )
}
