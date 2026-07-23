export const LIMITS = {
  free: {
    expensesPerMonth: 50,
    customCategories: 0,
    historyMonths: 3,
    receipts: false,
    pdfExport: false,
    pdfImport: false,
  },
  premium: {
    expensesPerMonth: Infinity,
    customCategories: Infinity,
    historyMonths: Infinity,
    receipts: true,
    pdfExport: true,
    pdfImport: true,
  },
} as const;

export const limitsFor = (plan: "free" | "premium") => LIMITS[plan];