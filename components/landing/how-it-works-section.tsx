"use client"

import { motion } from "framer-motion"

const steps = [
  {
    number: "01",
    title: "Record",
    description:
      "Hit record and speak naturally during the exam. ElevenLabs Scribe captures everything with Voice Activity Detection.",
  },
  {
    number: "02",
    title: "Generate",
    description:
      "Gemini 3.0 Flash structures your findings into a complete SOAP note with diagnoses, medications, and vitals.",
  },
  {
    number: "03",
    title: "Approve",
    description:
      "Review the color-coded sections, make any edits, and approve in 30 seconds. Go home on time.",
  },
]

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="border-y border-border/50 bg-muted/30 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            How it works
          </p>
          <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Three steps to freedom from after-hours charting.
          </h2>
        </motion.div>

        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <span className="text-6xl font-bold text-purple-100 dark:text-purple-900/50">
                {step.number}
              </span>
              <h3 className="mt-4 text-xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
