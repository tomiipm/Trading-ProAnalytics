import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ForexSignal, PerformanceStats, WeeklyPerformanceData, Notification } from '@/types/forex';

interface ForexState {
  signals: ForexSignal[];
  filteredSignals: ForexSignal[];
  selectedSignal: ForexSignal | null;
  performanceStats: PerformanceStats;
  weeklyPerformance: WeeklyPerformanceData[];
  activeFilter: string;
  isRefreshing: boolean;
  isDataLoaded: boolean;
  isPremium: boolean;
  premiumExpiryDate: string | null;
  subscriptionType: 'subscription' | null;
  subscriptionStartDate: string | null;
  marketDaysRemaining: number;
  notifications: Notification[];
  unreadNotificationsCount: number;
  isMarketOpen: boolean;
  currentSession: string | null;
  
  // Actions
  setSignals: (signals: ForexSignal[]) => void;
  setSelectedSignal: (signal: ForexSignal) => void;
  toggleFavorite: (id: string) => void;
  setActiveFilter: (filter: string) => void;
  setIsRefreshing: (isRefreshing: boolean) => void;
  setPerformanceStats: (stats: PerformanceStats) => void;
  setWeeklyPerformance: (data: WeeklyPerformanceData[]) => void;
  setPremiumStatus: (isPremium: boolean, expiryDate?: string, subscriptionType?: 'subscription', startDate?: string, marketDaysRemaining?: number) => void;
  addNotification: (notification: Notification) => void;
  markNotificationsAsRead: () => void;
  clearNotifications: () => void;
  clearUserData: () => void;
  setMarketStatus: (isOpen: boolean, session: string | null) => void;
  updateMarketDaysRemaining: (marketDaysRemaining: number, isActive: boolean) => void;
}

export const useForexStore = create<ForexState>()(
  persist(
    (set, get) => ({
      signals: [],
      filteredSignals: [],
      selectedSignal: null,
      performanceStats: {
        totalTrades: 0,
        profitTrades: 0,
        lossTrades: 0,
        openTrades: 0,
        winRate: 0,
        accuracy: 0,
        averageTradesPerDay: '0',
        averageProfitPerDay: '0',
        averageProfitPerTrade: 0,
        averageLossPerTrade: 0,
        riskRewardRatio: 0,
        totalPips: 0,
        dailyPerformance: []
      },
      weeklyPerformance: [],
      activeFilter: 'Active',
      isRefreshing: false,
      isDataLoaded: false,
      isPremium: false,
      premiumExpiryDate: null,
      subscriptionType: null,
      subscriptionStartDate: null,
      marketDaysRemaining: 0,
      notifications: [],
      unreadNotificationsCount: 0,
      isMarketOpen: true,
      currentSession: null,
      
      setSignals: (signals: ForexSignal[]) => {
        set({ 
          signals,
          filteredSignals: filterSignals(signals, get().activeFilter),
          isDataLoaded: true
        });
      },
      
      setSelectedSignal: (signal: ForexSignal) => {
        set({ selectedSignal: signal });
      },
      
      toggleFavorite: (id: string) => {
        const updatedSignals = get().signals.map(signal => 
          signal.id === id ? { ...signal, isFavorite: !signal.isFavorite } : signal
        );
        
        const selectedSignal = get().selectedSignal;
        
        set({ 
          signals: updatedSignals,
          filteredSignals: filterSignals(updatedSignals, get().activeFilter),
          selectedSignal: selectedSignal && selectedSignal.id === id 
            ? { ...selectedSignal, isFavorite: !selectedSignal.isFavorite }
            : selectedSignal
        });
      },
      
      setActiveFilter: (filter: string) => {
        set({ 
          activeFilter: filter,
          filteredSignals: filterSignals(get().signals, filter)
        });
      },
      
      setIsRefreshing: (isRefreshing: boolean) => {
        set({ isRefreshing });
      },
      
      setPerformanceStats: (stats: PerformanceStats) => {
        set({ performanceStats: stats });
      },
      
      setWeeklyPerformance: (data: WeeklyPerformanceData[]) => {
        set({ weeklyPerformance: data });
      },
      
      setPremiumStatus: (isPremium: boolean, expiryDate?: string, subscriptionType?: 'subscription', startDate?: string, marketDaysRemaining?: number) => {
        set({ 
          isPremium,
          premiumExpiryDate: expiryDate || null,
          subscriptionType: subscriptionType || null,
          subscriptionStartDate: startDate || null,
          marketDaysRemaining: marketDaysRemaining || 0
        });
        
        // Add notification about premium status change
        if (isPremium) {
          const notification: Notification = {
            id: Date.now().toString(),
            title: 'Premium Activated',
            message: `Your premium subscription has been activated. Enjoy all premium features for ${marketDaysRemaining} market days!`,
            timestamp: new Date().toISOString(),
            type: 'premium',
            read: false
          };
          get().addNotification(notification);
        } else {
          const notification: Notification = {
            id: Date.now().toString(),
            title: 'Premium Cancelled',
            message: `Your premium subscription has been cancelled. You will lose access to premium features soon.`,
            timestamp: new Date().toISOString(),
            type: 'premium',
            read: false
          };
          get().addNotification(notification);
        }
      },
      
      addNotification: (notification: Notification) => {
        set(state => ({ 
          notifications: [notification, ...state.notifications].slice(0, 50), // Keep only the latest 50 notifications
          unreadNotificationsCount: state.unreadNotificationsCount + 1
        }));
      },
      
      markNotificationsAsRead: () => {
        set(state => ({
          notifications: state.notifications.map(n => ({ ...n, read: true })),
          unreadNotificationsCount: 0
        }));
      },
      
      clearNotifications: () => {
        set({
          notifications: [],
          unreadNotificationsCount: 0
        });
      },
      
      clearUserData: () => {
        console.log("Clearing user data from store");
        
        // Reset user-specific data while keeping some app state
        set({
          selectedSignal: null,
          isPremium: false,
          premiumExpiryDate: null,
          subscriptionType: null,
          subscriptionStartDate: null,
          marketDaysRemaining: 0,
          notifications: [],
          unreadNotificationsCount: 0
        });
        
        // Add a notification to indicate successful logout
        const notification: Notification = {
          id: Date.now().toString(),
          title: 'Logged Out',
          message: 'You have been successfully logged out of your account.',
          timestamp: new Date().toISOString(),
          type: 'system',
          read: false
        };
        
        // We need to add this notification after the state has been reset
        setTimeout(() => {
          const store = useForexStore.getState();
          store.addNotification(notification);
        }, 100);
      },
      
      setMarketStatus: (isOpen: boolean, session: string | null) => {
        set({
          isMarketOpen: isOpen,
          currentSession: session
        });
        
        // Add notification about market status change
        const notification: Notification = {
          id: Date.now().toString(),
          title: isOpen ? 'Market Open' : 'Market Closed',
          message: isOpen ? `Forex market is open. Current session: ${session}.` : 'Forex market is currently closed for the weekend.',
          timestamp: new Date().toISOString(),
          type: 'market',
          read: false
        };
        get().addNotification(notification);
      },
      
      updateMarketDaysRemaining: (marketDaysRemaining: number, isActive: boolean) => {
        set({
          marketDaysRemaining,
          isPremium: isActive
        });
        
        if (!isActive) {
          const notification: Notification = {
            id: Date.now().toString(),
            title: 'Premium Expired',
            message: 'Your premium subscription has expired. Upgrade to continue enjoying premium features.',
            timestamp: new Date().toISOString(),
            type: 'premium',
            read: false
          };
          get().addNotification(notification);
        }
      }
    }),
    {
      name: 'forex-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        signals: state.signals,
        performanceStats: state.performanceStats,
        weeklyPerformance: state.weeklyPerformance,
        isDataLoaded: state.isDataLoaded,
        isPremium: state.isPremium,
        premiumExpiryDate: state.premiumExpiryDate,
        subscriptionType: state.subscriptionType,
        subscriptionStartDate: state.subscriptionStartDate,
        marketDaysRemaining: state.marketDaysRemaining,
        notifications: state.notifications.filter(n => n.read) // Only persist read notifications
      }),
    }
  )
);

// Helper function to filter signals based on active filter
const filterSignals = (signals: ForexSignal[], filter: string): ForexSignal[] => {
  switch (filter) {
    case 'Active':
      return signals.filter(signal => signal.status === 'active' || signal.status === 'pending');
    case 'Last 7 Days':
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return signals.filter(signal => {
        const signalDate = new Date(signal.timestamp.split(' ')[0]);
        return signalDate >= sevenDaysAgo;
      });
    case 'Favorites':
      return signals.filter(signal => signal.isFavorite);
    default:
      return signals;
  }
};