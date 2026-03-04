"use client"

import { motion } from "framer-motion"
import {
  Mic,
  FileText,
  Brain,
  Shield,
  Clock,
  Stethoscope,
} from "lucide-react"

const features = [
  {
    icon: Mic,
    title: "Ambient Listening",
    description:
      "Real-time transcription via ElevenLabs Scribe v2 with sub-100ms latency. Just speak naturally during the exam.",
  },
  {
    icon: Brain,
    title: "Gemini-Powered SOAP Notes",
    description:
      "Google Gemini 3.0 Flash structures your verbal findings into organized Subjective, Objective, Assessment, and Plan sections.",
  },
  {
    icon: FileText,
    title: "Complete Documentation",
    description:
      "Diagnoses with codes, medications with dosages, vitals, follow-up recommendations, and provider attestation. All from your voice.",
  },
  {
    icon: Clock,
    title: "30-Second Review",
    description:
      "What used to take 8-10 minutes of manual charting is now a 30-second review-and-approve workflow.",
  },
  {
    icon: Shield,
    title: "You Stay in Control",
    description:
      "AwwScribe captures what you say. It never generates diagnoses or treatment recommendations. Your clinical authority, preserved.",
  },
  {
    icon: Stethoscope,
    title: "Vet-Optimized Vocabulary",
    description:
      'Accurately transcribes terms like "borborygmi," "carpus," and "pruritus" thanks to veterinary-tuned models.',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Features
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Everything your practice needs to chart faster
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
            Award-winning AI that listens, structures, and documents — so you can
            focus on the patient in front of you.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group rounded-xl border border-border/60 bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
