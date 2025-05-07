// This file is deprecated and kept for reference or fallback purposes only.
// The application now uses real data from Financial Modeling Prep API.
// Mock data generation has been disabled as per user request to use real data.

import type { ForexSignal, PerformanceStats, WeeklyPerformanceData } from "@/types/forex"

// This function is no longer used as we're fetching real data
export const generateMockSignals = (): ForexSignal[] => {
  console.warn("Mock data generation is disabled. Use real data from API instead.")
  return []
}

// This function is no longer used as we're fetching real data
export const generatePerformanceStats = (): PerformanceStats => {
  console.warn("Mock performance stats generation is disabled. Use real data from API instead.")
  return {
    totalTrades: 0,
    profitTrades: 0,
    lossTrades: 0,
    openTrades: 0,
    winRate: 0,
    accuracy: 0,
    averageTradesPerDay: "0",
    averageProfitPerDay: "0",
    averageProfitPerTrade: 0,
    averageLossPerTrade: 0,
    riskRewardRatio: 0,
    totalPips: 0,
    dailyPerformance: [],
  }
}

// This function is no longer used as we're fetching real data
export const generateWeeklyPerformance = (): WeeklyPerformanceData[] => {
  console.warn("Mock weekly performance generation is disabled. Use real data from API instead.")
  return []
}
