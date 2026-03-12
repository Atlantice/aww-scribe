"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const cards = [
  {
    label: "OUR TECH",
    title: "Powered by ElevenLabs & Google Gemini",
    description:
      "Real-time transcription with sub-100ms latency. Advanced AI structuring for accurate SOAP notes.",
  },
  {
    label: "OUR MISSION",
    title: "Give veterinarians their evenings back",
    description:
      "What takes 8-10 minutes of manual charting now takes 30 seconds to review and approve.",
  },
  {
    label: "OUR APPROACH",
    title: "You speak. We document. You approve.",
    description:
      "AwwScribe captures what you say. It never generates diagnoses. Your clinical authority, preserved.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section intro */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Our goal
          </p>
          <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            We&apos;re using AI to transform veterinary documentation.
          </h2>
        </motion.div>

        {/* Cards grid - Isomorphic style */}
        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-2xl border border-border/50 bg-card p-8 transition-all hover:border-purple-200 hover:bg-purple-50/30 dark:hover:border-purple-800 dark:hover:bg-purple-950/10"
            >
              <p className="text-xs font-medium uppercase tracking-widest text-purple-600 dark:text-purple-400">
                {card.label}
              </p>
              <h3 className="mt-4 text-xl font-semibold text-foreground">
                {card.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {card.description}
              </p>
              <div className="mt-6">
                <ArrowRight className="h-5 w-5 text-muted-foreground/50 transition-transform group-hover:translate-x-1 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Try it link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-purple-600 transition-colors hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
          >
            Try AwwScribe now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
