// Define types for forex data

export interface Signal {
  id: string
  pair: string
  type: "BUY" | "SELL"
  entryPrice: number
  stopLoss: number
  takeProfit1: number
  takeProfit2: number
  takeProfit3: number | null
  timestamp: string
  status: "active" | "completed" | "pending"
  probability: number
  pips?: number
  isFavorite: boolean
  isPremium?: boolean
  analysis?: string
  chart?: string
}

// Updated to use lowercase status values to match Signal type
export interface ForexSignal {
  id: string
  pair: string
  type: "BUY" | "SELL"
  entryPrice: number
  stopLoss: number
  takeProfit1: number
  takeProfit2: number
  takeProfit3: number | null
  timestamp: string
  status: "active" | "completed" | "pending" // Changed from uppercase to lowercase
  probability: number
  pips?: number
  isFavorite: boolean
  isPremium?: boolean
  analysis?: string
  chart?: string
}

export interface PerformanceStats {
  totalTrades: number
  profitTrades: number
  lossTrades: number
  openTrades: number
  winRate: number
  accuracy: number
  averageTradesPerDay: string
  averageProfitPerDay: string
  averageProfitPerTrade: number
  averageLossPerTrade: number
  riskRewardRatio: number
  totalPips: number
  dailyPerformance: DailyPerformance[]
}

export interface DailyPerformance {
  date: string
  pips: number
  trades: number
  cumulativePips?: number
}

export interface WeeklyPerformanceData {
  day: string
  pips: number
  trades: number
}

export interface Notification {
  id: string
  title: string
  message: string
  timestamp: string
  type: "signal" | "market" | "account" | "premium" | "system"
  read: boolean
  data?: any
}

export interface UserProfile {
  email: string
  name?: string
  isPremium: boolean
  premiumExpiryDate?: string
  subscriptionType?: "subscription"
  joinDate: string
  preferences: {
    notificationsEnabled: boolean
    darkMode: boolean
    language: string
  }
}

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  duration: number // in days
  features: string[]
}
