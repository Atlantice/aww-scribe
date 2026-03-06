"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-50/50 via-background to-background dark:from-purple-950/20" />
      
      <div className="relative mx-auto w-full max-w-7xl px-6 pt-32 pb-20 md:pt-40 md:pb-32">
        {/* Award badge - top center */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex justify-center"
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-amber-200 bg-amber-50/80 px-5 py-2.5 backdrop-blur-sm dark:border-amber-800/50 dark:bg-amber-950/30">
            <Trophy className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
              First Place Winner
            </span>
            <span className="text-sm text-amber-600/60 dark:text-amber-400/60">
              ElevenLabs x Google Cloud Hackathon
            </span>
          </div>
        </motion.div>

        {/* Main headline - Isomorphic style: massive, bold */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="text-purple-600 dark:text-purple-400">Chart less.</span>
            <br />
            <span className="text-foreground">Heal more.</span>
          </h1>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mx-auto mt-8 max-w-2xl text-center text-lg text-muted-foreground md:text-xl"
        >
          AI-powered veterinary documentation that turns exam-room conversations 
          into professional SOAP notes. Built with award-winning technology.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link href="/">
            <Button size="lg" className="h-12 gap-2 bg-purple-600 px-8 text-white hover:bg-purple-700">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <a
            href="https://devpost.com/software/awwscribe"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button 
              variant="outline" 
              size="lg" 
              className="h-12 px-8 border-purple-200 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-950/30"
            >
              View Hackathon Submission
            </Button>
          </a>
        </motion.div>

        {/* Partner logos - minimal, understated */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 flex flex-col items-center gap-4"
        >
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
            Built with
          </span>
          <div className="flex items-center gap-8">
            {/* ElevenLabs */}
            <div className="flex items-center gap-2 text-muted-foreground/70">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="7" y="2" width="3" height="20" rx="1.5" />
                <rect x="14" y="2" width="3" height="20" rx="1.5" />
              </svg>
              <span className="text-sm">ElevenLabs</span>
            </div>
            <div className="h-4 w-px bg-border" />
            {/* Google Cloud */}
            <div className="flex items-center gap-2 text-muted-foreground/70">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              <span className="text-sm">Google Cloud</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Logo watermark - bottom right, subtle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 right-8 hidden opacity-10 lg:block"
      >
        <Image
          src="/images/aww-logo.png"
          alt=""
          width={120}
          height={120}
          className="rounded-3xl"
          aria-hidden="true"
        />
      </motion.div>
    </section>
  )
}
