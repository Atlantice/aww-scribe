"use client"

import { motion } from "framer-motion"
import { Trophy, ExternalLink } from "lucide-react"

const proofPoints = [
  {
    type: "award",
    title: "First Place",
    subtitle: "ElevenLabs x Google Cloud Hackathon",
    description:
      "Selected from hundreds of submissions. Judges praised the clinical accuracy, real-time transcription, and polished UX.",
    link: "https://devpost.com/software/awwscribe",
  },
  {
    type: "tech",
    title: "Google Gemini 3.0 Flash",
    subtitle: "Structured SOAP Generation",
    description:
      "Advanced reasoning and structured output mode excels at organizing unstructured speech into standardized documentation formats.",
  },
  {
    type: "tech",
    title: "ElevenLabs Scribe v2",
    subtitle: "Real-Time Transcription",
    description:
      "Voice Activity Detection with veterinary-optimized models. Sub-100ms latency for truly ambient documentation.",
  },
]

const quote = {
  text: "The paperwork is harder than the medicine.",
  attribution: "Every veterinarian, everywhere",
  followup: "AwwScribe was built to change that.",
}

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-[oklch(0.45_0.12_170)]">
            Social Proof
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Validated by the industry
          </h2>
        </motion.div>

        {/* Quote block */}
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-12 max-w-2xl rounded-xl border border-border/60 bg-card p-8 text-center"
        >
          <p className="text-xl font-medium italic text-foreground md:text-2xl">
            {`"${quote.text}"`}
          </p>
          <footer className="mt-4 text-sm text-muted-foreground">
            {"— "}
            {quote.attribution}
          </footer>
          <p className="mt-2 text-sm font-semibold text-[oklch(0.45_0.12_170)]">
            {quote.followup}
          </p>
        </motion.blockquote>

        {/* Proof cards */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {proofPoints.map((point, i) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-xl border border-border/60 bg-card p-6"
            >
              {point.type === "award" && (
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[oklch(0.55_0.12_80/0.1)]">
                  <Trophy className="h-5 w-5 text-[oklch(0.7_0.15_80)]" />
                </div>
              )}
              {point.type === "tech" && (
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[oklch(0.45_0.12_170/0.1)]">
                  <svg
                    className="h-5 w-5 text-[oklch(0.45_0.12_170)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                    />
                  </svg>
                </div>
              )}
              <h3 className="text-lg font-semibold text-foreground">
                {point.title}
              </h3>
              <p className="text-sm font-medium text-[oklch(0.45_0.12_170)]">
                {point.subtitle}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {point.description}
              </p>
              {point.link && (
                <a
                  href={point.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[oklch(0.45_0.12_170)] hover:underline"
                >
                  View submission
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
