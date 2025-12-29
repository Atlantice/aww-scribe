"use client"

import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"

interface UnderConstructionProps {
  icon: LucideIcon
  title: string
  description: string
  comingSoonText?: string
}

export function UnderConstruction({
  icon: Icon,
  title,
  description,
  comingSoonText = "This feature is coming soon",
}: UnderConstructionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-center h-full"
    >
      <div className="text-center max-w-md px-6">
        {/* Icon with subtle animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/20 mb-6"
        >
          <Icon className="w-10 h-10 text-purple-600 dark:text-purple-400" />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-semibold text-foreground mb-3"
        >
          {title}
        </motion.h2>

        {/* Coming Soon Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800/40 mb-4"
        >
          <div className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400 animate-pulse" />
          <span className="text-sm font-medium text-purple-900 dark:text-purple-300">
            {comingSoonText}
          </span>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-muted-foreground leading-relaxed"
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  )
}
