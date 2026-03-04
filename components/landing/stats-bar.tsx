"use client"

import { motion } from "framer-motion"

const stats = [
  { value: "<100ms", label: "Transcription latency" },
  { value: "30s", label: "Review time per note" },
  { value: "95%", label: "Documentation accuracy" },
  { value: "16x", label: "Faster than manual charting" },
]

export function StatsBar() {
  return (
    <section className="border-y border-purple-100 dark:border-purple-900/30 bg-gradient-to-r from-purple-50/50 to-violet-50/50 dark:from-purple-950/10 dark:to-violet-950/10">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl font-bold tracking-tight text-purple-600 dark:text-purple-400 md:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
