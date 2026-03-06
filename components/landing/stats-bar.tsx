"use client"

import { motion } from "framer-motion"

const stats = [
  { value: "<100ms", label: "Latency" },
  { value: "30s", label: "Review time" },
  { value: "95%", label: "Accuracy" },
  { value: "16x", label: "Faster" },
]

export function StatsBar() {
  return (
    <section className="border-y border-border/50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                {stat.value}
              </div>
              <div className="mt-2 text-sm uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
