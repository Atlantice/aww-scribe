"use client"

import { Search, CreditCard } from "lucide-react"
import { UnderConstruction } from "./under-construction"

interface BillingsScreenProps {
  selectedPatientId: string | null
}

export function BillingsScreen({ selectedPatientId }: BillingsScreenProps) {
  return (
    <div className="flex h-full">
      {/* Left Panel - Search and Filters */}
      <div className="w-80 flex-shrink-0 flex flex-col bg-white dark:bg-[#0a0a0a] border-r border-border">
        {/* Header */}
        <div className="p-4 border-b border-border space-y-3">
          <h2 className="font-semibold text-lg text-foreground">Billing</h2>

          {/* Payment Status Tabs */}
          <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-900 rounded-lg">
            <button className="flex-1 px-3 py-1.5 text-xs font-medium rounded-md bg-white dark:bg-gray-800 shadow-sm text-foreground transition-all duration-200">
              All
            </button>
            <button className="flex-1 px-3 py-1.5 text-xs font-medium rounded-md text-muted-foreground hover:text-foreground transition-all duration-200">
              Unpaid
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search invoices..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-gray-900 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            />
          </div>
        </div>

        {/* Empty Billing List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 space-y-2">
            {/* Empty state placeholder */}
            <div className="p-8 text-center text-sm text-muted-foreground">
              No billing records yet
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Under Construction */}
      <div className="flex-1 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-950/50 dark:to-gray-900">
        <UnderConstruction
          icon={CreditCard}
          title="Billing"
          description="Manage all billing and payment information for your pet's care. View invoices, track payments, download receipts, and make secure payments online. Stay on top of your pet's healthcare expenses with detailed billing history and payment tracking."
        />
      </div>
    </div>
  )
}
