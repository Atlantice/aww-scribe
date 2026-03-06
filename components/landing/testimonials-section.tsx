"use client"

import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import Image from "next/image"

export function TestimonialsSection() {
  return (
    <section id="proof" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Large quote - Isomorphic style */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <blockquote className="text-center">
            <p className="text-2xl font-medium italic text-foreground md:text-3xl lg:text-4xl">
              &ldquo;The paperwork is harder than the medicine.&rdquo;
            </p>
            <footer className="mt-6 text-sm uppercase tracking-widest text-muted-foreground">
              Every veterinarian, everywhere
            </footer>
          </blockquote>
          <p className="mt-8 text-center text-lg text-purple-600 dark:text-purple-400">
            AwwScribe was built to change that.
          </p>
        </motion.div>

        {/* Award highlight - centered, prominent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl"
        >
          <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50 p-8 text-center dark:border-purple-800/50 dark:from-purple-950/20 dark:to-violet-900/10">
            <p className="text-xs font-medium uppercase tracking-widest text-purple-600 dark:text-purple-400">
              First Place Winner
            </p>
            <h3 className="mt-2 text-2xl font-bold text-foreground">
              ElevenLabs x Google Cloud Hackathon
            </h3>
            <p className="mt-4 text-sm text-muted-foreground">
              Selected from hundreds of submissions for real-time transcription 
              and polished user experience.
            </p>
            <a
              href="https://devpost.com/software/awwscribe"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-purple-600 transition-colors hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
            >
              View submission on Devpost
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </motion.div>

        {/* Tech validation - simple list */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 text-center"
        >
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Powered by industry leaders
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-16">
            <div>
              <p className="text-lg font-semibold text-foreground">Google Gemini 3.0 Flash</p>
              <p className="text-sm text-muted-foreground">Structured SOAP generation</p>
            </div>
            <div className="hidden h-8 w-px bg-border sm:block" />
            <div>
              <p className="text-lg font-semibold text-foreground">ElevenLabs Scribe v2</p>
              <p className="text-sm text-muted-foreground">Real-time transcription</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
