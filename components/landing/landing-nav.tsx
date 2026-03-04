"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/landing" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[oklch(0.45_0.12_170)] text-[oklch(0.98_0_0)]">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20h9" />
              <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.855z" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            AwwScribe
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            How It Works
          </a>
          <a href="#testimonials" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Proof
          </a>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              Log In
            </Button>
          </Link>
          <Link href="/">
            <Button
              size="sm"
              className="bg-[oklch(0.45_0.12_170)] text-[oklch(0.98_0_0)] hover:bg-[oklch(0.5_0.12_170)]"
            >
              Get Started
            </Button>
          </Link>
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border/50 bg-background md:hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-6">
              <a
                href="#features"
                className="text-sm text-muted-foreground"
                onClick={() => setMobileOpen(false)}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-sm text-muted-foreground"
                onClick={() => setMobileOpen(false)}
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                className="text-sm text-muted-foreground"
                onClick={() => setMobileOpen(false)}
              >
                Proof
              </a>
              <div className="flex flex-col gap-2 pt-2">
                <Link href="/">
                  <Button variant="outline" size="sm" className="w-full">
                    Log In
                  </Button>
                </Link>
                <Link href="/">
                  <Button
                    size="sm"
                    className="w-full bg-[oklch(0.45_0.12_170)] text-[oklch(0.98_0_0)] hover:bg-[oklch(0.5_0.12_170)]"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
