"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"

function PartnerLogos() {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
      <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        Built with
      </span>
      <div className="flex items-center gap-6">
        {/* ElevenLabs */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <rect x="7" y="2" width="3" height="20" rx="1.5" />
            <rect x="14" y="2" width="3" height="20" rx="1.5" />
          </svg>
          <span className="text-sm font-medium text-foreground">ElevenLabs</span>
        </div>
        <div className="h-4 w-px bg-border" />
        {/* Google Cloud */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#EA4335" />
            <path d="M2 17l10 5 10-5" stroke="#34A853" strokeWidth="2" fill="none" />
            <path d="M2 12l10 5 10-5" stroke="#FBBC05" strokeWidth="2" fill="none" />
          </svg>
          <span className="text-sm font-medium text-foreground">Google Cloud</span>
        </div>
      </div>
    </div>
  )
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      {/* Soft lavender background glow */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[700px] w-[900px] rounded-full opacity-[0.08]"
        style={{
          background:
            "radial-gradient(ellipse at center, #8b5cf6, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center text-center">
          {/* First Place Badge — large, prominent */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-10"
          >
            <div className="relative flex flex-col items-center gap-6">
              {/* Logo */}
              <div className="relative">
                <div className="glow-container flex items-center justify-center">
                  <Image
                    src="/images/aww-logo.png"
                    alt="AwwScribe logo"
                    width={120}
                    height={120}
                    className="rounded-3xl"
                    priority
                  />
                </div>
              </div>

              {/* Award pill */}
              <div className="flex items-center gap-3 rounded-full border border-amber-300/40 bg-amber-50 px-6 py-3 dark:border-amber-500/30 dark:bg-amber-950/30">
                <Trophy className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                  First Place Winner
                </span>
                <div className="h-4 w-px bg-amber-300/50 dark:bg-amber-500/30" />
                <span className="text-sm text-muted-foreground">
                  ElevenLabs x Google Cloud Hackathon
                </span>
              </div>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-4xl text-balance text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl"
          >
            The AI scribe that{" "}
            <span className="text-purple-600 dark:text-purple-400">won nationally.</span>
            <br />
            Built for veterinarians.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl"
          >
            AwwScribe turns exam-room conversations into professional SOAP notes
            in seconds. Speak naturally, review in 30 seconds, and reclaim your
            evenings.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          >
            <Link href="/">
              <Button size="lg" className="gap-2 bg-purple-600 text-white hover:bg-purple-700 px-8">
                Try AwwScribe Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a
              href="https://devpost.com/software/awwscribe"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg" className="gap-2 px-8 border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-900/20">
                View on Devpost
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
          </motion.div>

          {/* Partner Logos */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-16"
          >
            <PartnerLogos />
          </motion.div>

          {/* Product Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.85 }}
            className="mt-16 w-full max-w-5xl"
          >
            <div className="relative overflow-hidden rounded-xl border border-purple-200/60 dark:border-purple-800/40 shadow-2xl shadow-purple-500/5">
              <Image
                src="/images/product-preview.jpg"
                alt="AwwScribe product interface showing SOAP note generation"
                width={1920}
                height={1080}
                className="w-full"
                priority
              />
              <div className="absolute inset-0 rounded-xl ring-1 ring-purple-500/10" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
