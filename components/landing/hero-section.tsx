"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"

function PartnerLogos() {
  return (
    <div className="flex items-center gap-6">
      <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        Built with
      </span>
      {/* ElevenLabs logo */}
      <div className="flex items-center gap-2 text-muted-foreground">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <rect x="7" y="2" width="3" height="20" rx="1.5" />
          <rect x="14" y="2" width="3" height="20" rx="1.5" />
        </svg>
        <span className="text-sm font-medium text-foreground">ElevenLabs</span>
      </div>
      <div className="h-4 w-px bg-border" />
      {/* Google Cloud logo */}
      <div className="flex items-center gap-2 text-muted-foreground">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 2L2 7l10 5 10-5-10-5z" fill="oklch(0.45 0.12 170)" />
          <path d="M2 17l10 5 10-5" stroke="oklch(0.45 0.12 170)" strokeWidth="2" fill="none" />
          <path d="M2 12l10 5 10-5" stroke="oklch(0.55 0.10 170)" strokeWidth="2" fill="none" />
        </svg>
        <span className="text-sm font-medium text-foreground">Google Cloud</span>
      </div>
    </div>
  )
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      {/* Subtle background glow */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full opacity-[0.07]"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.55 0.15 170), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center text-center">
          {/* First Place Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="relative">
              <div className="flex items-center gap-3 rounded-full border border-[oklch(0.55_0.12_80/0.3)] bg-[oklch(0.55_0.12_80/0.08)] px-6 py-3">
                <Trophy className="h-5 w-5 text-[oklch(0.7_0.15_80)]" />
                <span className="text-sm font-semibold text-[oklch(0.7_0.15_80)]">
                  First Place Winner
                </span>
                <div className="h-4 w-px bg-[oklch(0.55_0.12_80/0.3)]" />
                <span className="text-sm text-muted-foreground">
                  ElevenLabs x Google Cloud Hackathon
                </span>
              </div>
            </div>
          </motion.div>

          {/* Trophy + Headline */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mb-6 flex flex-col items-center gap-6"
          >
            <div className="relative h-40 w-40 md:h-52 md:w-52">
              <Image
                src="/images/trophy.jpg"
                alt="First place trophy from the ElevenLabs x Google Cloud Hackathon"
                fill
                className="rounded-2xl object-cover"
                priority
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-border/50" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="max-w-4xl text-balance text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl"
          >
            The AI scribe that{" "}
            <span className="text-[oklch(0.45_0.12_170)]">won nationally.</span>
            <br />
            Built for veterinarians.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
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
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          >
            <Link href="/">
              <Button
                size="lg"
                className="gap-2 bg-[oklch(0.45_0.12_170)] text-[oklch(0.98_0_0)] hover:bg-[oklch(0.5_0.12_170)] px-8"
              >
                Try AwwScribe Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a
              href="https://devpost.com/software/awwscribe"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg" className="gap-2 px-8">
                View on Devpost
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
          </motion.div>

          {/* Partner Logos */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16"
          >
            <PartnerLogos />
          </motion.div>

          {/* Product Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.9 }}
            className="mt-16 w-full max-w-5xl"
          >
            <div className="relative overflow-hidden rounded-xl border border-border/60 shadow-2xl">
              <Image
                src="/images/product-preview.jpg"
                alt="AwwScribe product interface showing SOAP note generation"
                width={1920}
                height={1080}
                className="w-full"
                priority
              />
              <div className="absolute inset-0 rounded-xl ring-1 ring-border/30" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
