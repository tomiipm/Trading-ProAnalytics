"use client"

import { useState, useEffect } from "react"
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { useRouter } from "expo-router"
import { BarChart2, Filter, Star, Clock, Zap, RefreshCw, Globe } from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useForexStore } from "@/store/forex-store"
import SignalCard from "@/components/SignalCard"
import { darkTheme } from "@/constants/colors"
import type { Signal } from "@/types/forex"
import { useForexData } from "@/hooks/useForexData"
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"

const { width } = Dimensions.get("window")

export default function SignalsScreen() {
  const router = useRouter()
  const { signals, setSignals, setSelectedSignal, isPremium, addNotification, isMarketOpen, currentSession } =
    useForexStore()
  const { isLoading, error, refreshData, isApiAvailable } = useForexData()
  const [activeTab, setActiveTab] = useState("active")

  // Animation values for refresh icon
  const refreshRotation = useSharedValue(0)

  useEffect(() => {
    // Simulate receiving a new notification after 5 seconds
    const timer = setTimeout(() => {
      addNotification({
        id: `notification-${Date.now()}`,
        title: "New Trading Signal",
        message: "A new EUR/USD trading opportunity is available. Check it out now!",
        timestamp: new Date().toISOString(),
        read: false,
        type: "signal",
      })
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const handleSignalPress = (signal: Signal) => {
    setSelectedSignal(signal)
    router.push("/signal-details")
  }

  const handlePremiumPress = () => {
    router.push("/premium")
  }

  const handleAccountPress = () => {
    router.push("/account")
  }

  const handleRefresh = () => {
    refreshData()
    // Animate refresh icon
    refreshRotation.value = withSpring(refreshRotation.value + 360)
  }

  const filteredSignals = () => {
    switch (activeTab) {
      case "active":
        return signals.filter((signal) => signal.status === "active")
      case "recent":
        return signals.filter((signal) => signal.status === "completed")
      case "favorites":
        return signals.filter((signal) => signal.isFavorite)
      default:
        return signals
    }
  }

  const refreshAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${refreshRotation.value}deg` }],
    }
  })

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <BarChart2 size={width > 400 ? 24 : 22} color={darkTheme.text} />
        <Text style={styles.title}>Trading Signals</Text>
      </View>

      <View style={styles.headerButtons}>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Animated.View style={refreshAnimatedStyle}>
            <RefreshCw size={width > 400 ? 20 : 18} color={darkTheme.accent} />
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.accountButton} onPress={handleAccountPress}>
          <Text style={styles.accountButtonText}>Account</Text>
        </TouchableOpacity>

        {!isPremium && (
          <TouchableOpacity style={styles.premiumButton} onPress={handlePremiumPress}>
            <Zap size={width > 400 ? 16 : 14} color="#000" />
            <Text style={styles.premiumButtonText}>Premium</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === "active" && styles.activeTab]}
        onPress={() => setActiveTab("active")}
      >
        <Text style={[styles.tabText, activeTab === "active" && styles.activeTabText]}>Active</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === "recent" && styles.activeTab]}
        onPress={() => setActiveTab("recent")}
      >
        <Text style={[styles.tabText, activeTab === "recent" && styles.activeTabText]}>Last 7 Days</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === "favorites" && styles.activeTab]}
        onPress={() => setActiveTab("favorites")}
      >
        <Text style={[styles.tabText, activeTab === "favorites" && styles.activeTabText]}>Favorites</Text>
      </TouchableOpacity>
    </View>
  )

  const renderPremiumBanner = () => {
    if (isPremium) return null

    return (
      <TouchableOpacity onPress={handlePremiumPress}>
        <LinearGradient
          colors={["rgba(255, 193, 7, 0.2)", "rgba(255, 193, 7, 0.05)"]}
          style={styles.premiumBanner}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.premiumBannerContent}>
            <View style={styles.premiumIconContainer}>
              <Zap size={width > 400 ? 20 : 18} color={darkTheme.premium} />
            </View>
            <View style={styles.premiumBannerTextContainer}>
              <Text style={styles.premiumBannerTitle}>Upgrade to Premium</Text>
              <Text style={styles.premiumBannerDescription}>Get unlimited signals and advanced analytics</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  const renderStatusBar = () => {
    if (isApiAvailable === null) return null

    return (
      <View style={styles.statusContainer}>
        <View style={[styles.statusBar, isApiAvailable ? styles.statusBarOnline : styles.statusBarOffline]}>
          <Text style={styles.statusBarText}>
            {isApiAvailable ? "Real-Time Data: Online" : "Real-Time Data: Offline (Using Mock Data)"}
          </Text>
        </View>
        <View style={[styles.statusBar, isMarketOpen ? styles.marketOpen : styles.marketClosed]}>
          <Globe
            size={width > 400 ? 14 : 12}
            color={isMarketOpen ? darkTheme.success : darkTheme.danger}
            style={styles.marketIcon}
          />
          <Text style={styles.statusBarText}>
            {isMarketOpen ? `Market: Open (${currentSession} Session)` : "Market: Closed"}
          </Text>
        </View>
      </View>
    )
  }

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      {activeTab === "active" ? (
        <>
          <Clock size={width > 400 ? 40 : 36} color={darkTheme.secondaryText} style={styles.emptyIcon} />
          <Text style={styles.emptyTitle}>No Active Signals</Text>
          <Text style={styles.emptyText}>
            There are no active trading signals at the moment. Check back soon for new opportunities.
          </Text>
        </>
      ) : activeTab === "favorites" ? (
        <>
          <Star size={width > 400 ? 40 : 36} color={darkTheme.secondaryText} style={styles.emptyIcon} />
          <Text style={styles.emptyTitle}>No Favorites Yet</Text>
          <Text style={styles.emptyText}>
            You haven't added any signals to your favorites yet. Tap the star icon on any signal to add it to your
            favorites.
          </Text>
        </>
      ) : (
        <>
          <Filter size={width > 400 ? 40 : 36} color={darkTheme.secondaryText} style={styles.emptyIcon} />
          <Text style={styles.emptyTitle}>No Recent Signals</Text>
          <Text style={styles.emptyText}>
            There are no completed signals from the last 7 days. Check the active tab for current opportunities.
          </Text>
        </>
      )}
    </View>
  )

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <StatusBar style="light" />

      <FlatList
        data={filteredSignals()}
        renderItem={({ item }) => <SignalCard signal={item} onPress={() => handleSignalPress(item)} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {renderHeader()}
            {renderStatusBar()}
            {renderTabs()}
            {renderPremiumBanner()}
          </>
        }
        ListEmptyComponent={renderEmptyState}
        refreshing={isLoading}
        onRefresh={refreshData}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: width > 400 ? 16 : 12,
    paddingTop: width > 400 ? 16 : 12,
    paddingBottom: width > 400 ? 8 : 6,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: width > 400 ? 24 : 20,
    fontWeight: "700",
    color: darkTheme.text,
    marginLeft: width > 400 ? 8 : 6,
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  refreshButton: {
    padding: width > 400 ? 8 : 6,
    marginRight: width > 400 ? 8 : 6,
  },
  accountButton: {
    paddingHorizontal: width > 400 ? 12 : 10,
    paddingVertical: width > 400 ? 6 : 5,
    borderRadius: 16,
    backgroundColor: "rgba(108, 92, 231, 0.1)",
    marginRight: width > 400 ? 8 : 6,
  },
  accountButtonText: {
    color: darkTheme.accent,
    fontWeight: "500",
    fontSize: width > 400 ? 14 : 12,
  },
  premiumButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: width > 400 ? 12 : 10,
    paddingVertical: width > 400 ? 6 : 5,
    borderRadius: 16,
    backgroundColor: darkTheme.premium,
  },
  premiumButtonText: {
    color: "#000",
    fontWeight: "600",
    marginLeft: width > 400 ? 4 : 3,
    fontSize: width > 400 ? 14 : 12,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: width > 400 ? 16 : 12,
    marginTop: width > 400 ? 16 : 12,
    marginBottom: width > 400 ? 16 : 12,
  },
  tab: {
    paddingVertical: width > 400 ? 8 : 6,
    paddingHorizontal: width > 400 ? 16 : 12,
    borderRadius: 20,
    marginRight: width > 400 ? 8 : 6,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  activeTab: {
    backgroundColor: darkTheme.accent,
  },
  tabText: {
    color: darkTheme.secondaryText,
    fontWeight: "500",
    fontSize: width > 400 ? 14 : 12,
  },
  activeTabText: {
    color: "#FFF",
  },
  listContent: {
    paddingHorizontal: width > 400 ? 16 : 12,
    paddingBottom: 20,
    flexGrow: 1,
  },
  premiumBanner: {
    borderRadius: 16,
    marginBottom: width > 400 ? 16 : 12,
    borderWidth: 1,
    borderColor: "rgba(255, 193, 7, 0.3)",
  },
  premiumBannerContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: width > 400 ? 16 : 12,
  },
  premiumIconContainer: {
    width: width > 400 ? 40 : 36,
    height: width > 400 ? 40 : 36,
    borderRadius: width > 400 ? 20 : 18,
    backgroundColor: "rgba(255, 193, 7, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: width > 400 ? 12 : 10,
  },
  premiumBannerTextContainer: {
    flex: 1,
  },
  premiumBannerTitle: {
    fontSize: width > 400 ? 16 : 14,
    fontWeight: "600",
    color: darkTheme.text,
    marginBottom: width > 400 ? 4 : 2,
  },
  premiumBannerDescription: {
    fontSize: width > 400 ? 14 : 12,
    color: darkTheme.secondaryText,
  },
  statusContainer: {
    marginBottom: width > 400 ? 16 : 12,
  },
  statusBar: {
    paddingVertical: width > 400 ? 8 : 6,
    paddingHorizontal: width > 400 ? 12 : 10,
    borderRadius: 8,
    marginBottom: width > 400 ? 8 : 6,
    flexDirection: "row",
    alignItems: "center",
  },
  statusBarOnline: {
    backgroundColor: "rgba(76, 175, 80, 0.1)",
  },
  statusBarOffline: {
    backgroundColor: "rgba(244, 67, 54, 0.1)",
  },
  marketOpen: {
    backgroundColor: "rgba(76, 175, 80, 0.1)",
  },
  marketClosed: {
    backgroundColor: "rgba(244, 67, 54, 0.1)",
  },
  marketIcon: {
    marginRight: width > 400 ? 8 : 6,
  },
  statusBarText: {
    color: darkTheme.text,
    fontSize: width > 400 ? 14 : 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: width > 400 ? 40 : 30,
  },
  emptyIcon: {
    marginBottom: width > 400 ? 16 : 12,
  },
  emptyTitle: {
    fontSize: width > 400 ? 18 : 16,
    fontWeight: "600",
    color: darkTheme.text,
    marginBottom: width > 400 ? 8 : 6,
    textAlign: "center",
  },
  emptyText: {
    fontSize: width > 400 ? 14 : 12,
    color: darkTheme.secondaryText,
    textAlign: "center",
    paddingHorizontal: width > 400 ? 20 : 15,
    lineHeight: width > 400 ? 20 : 18,
  },
})
