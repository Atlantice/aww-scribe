"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="border-t border-border/50 bg-card/30 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Stop charting. Start healing.
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Join the award-winning platform that turns exam-room conversations
            into professional SOAP notes. Your patients are waiting.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/">
              <Button
                size="lg"
                className="gap-2 bg-[oklch(0.45_0.12_170)] text-[oklch(0.98_0_0)] hover:bg-[oklch(0.5_0.12_170)] px-8"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a
              href="https://devpost.com/software/awwscribe"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg" className="px-8">
                See the Devpost Submission
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
