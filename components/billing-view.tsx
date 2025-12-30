"use client";

import { DollarSign, Calendar, FileText, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { usePatientInvoices } from "@/hooks/use-firestore";

interface BillingViewProps {
  patientId: string | null;
}

export function BillingView({ patientId }: BillingViewProps) {
  const { invoices, isLoading } = usePatientInvoices(patientId);

  // Sort invoices by date (newest first)
  const sortedInvoices = invoices
    ?.slice()
    .sort((a, b) => b.date.getTime() - a.date.getTime()) || [];

  // Calculate totals
  const totalAmount = sortedInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = sortedInvoices
    .filter(inv => inv.status === 'Pending' || inv.status === 'Overdue')
    .reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = sortedInvoices
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid':
        return <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'Pending':
        return <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'Overdue':
        return <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Pending':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'Overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
          <span>Loading billing information...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header with Beta Badge */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Billing & Invoices</h2>
            <p className="text-sm text-muted-foreground">
              {sortedInvoices.length} {sortedInvoices.length === 1 ? 'invoice' : 'invoices'} on record
            </p>
          </div>
        </div>
        <span className="px-2 py-1 text-xs font-medium rounded-md bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
          Beta
        </span>
      </div>

      {/* Summary Cards */}
      {sortedInvoices.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Total Billed
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              ${totalAmount.toFixed(2)}
            </p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Paid
              </span>
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              ${paidAmount.toFixed(2)}
            </p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Outstanding
              </span>
            </div>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              ${pendingAmount.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {/* Invoices List */}
      {sortedInvoices.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <DollarSign className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No Invoices</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            No invoices have been generated for this patient yet. Billing information will appear here once services are rendered.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-3">
          {sortedInvoices.map((invoice) => (
            <div
              key={invoice.id}
              className="p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
            >
              {/* Header Row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-foreground mb-1">
                      Invoice #{invoice.invoiceNumber}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{invoice.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span className="font-semibold text-foreground">${invoice.amount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {getStatusIcon(invoice.status)}
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-md ${getStatusColor(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </div>
              </div>

              {/* Items List */}
              {invoice.items && invoice.items.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Items
                  </p>
                  <div className="space-y-1.5">
                    {invoice.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-foreground">{item.name}</span>
                        <span className="font-medium text-muted-foreground">${item.cost.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Overdue Warning */}
              {invoice.status === 'Overdue' && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-medium">Payment overdue - please contact office</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
