"use client"

import { motion } from "framer-motion"

const steps = [
  {
    step: "01",
    title: "Record",
    description:
      "Hit record and speak naturally during the exam. AwwScribe listens via ElevenLabs Scribe v2 with Voice Activity Detection.",
  },
  {
    step: "02",
    title: "Generate",
    description:
      "Stop recording and Gemini 3.0 Flash instantly structures your findings into a professional SOAP note with diagnoses, meds, and vitals.",
  },
  {
    step: "03",
    title: "Review & Approve",
    description:
      "Scan the color-coded SOAP sections, make any edits, and approve in 30 seconds. Done. Go home on time.",
  },
]

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="border-y border-border/50 bg-card/30 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-[oklch(0.45_0.12_170)]">
            How It Works
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Three steps. Zero after-hours charting.
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative"
            >
              <div className="text-6xl font-bold text-[oklch(0.45_0.12_170/0.1)]">
                {item.step}
              </div>
              <h3 className="mt-2 text-xl font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
              {i < steps.length - 1 && (
                <div className="absolute right-0 top-8 hidden h-px w-12 bg-border md:block" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
