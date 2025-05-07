"use client"
import { StyleSheet, View, TouchableOpacity, Text, Dimensions } from "react-native"
import { Bell } from "lucide-react-native"
import { useRouter } from "expo-router"
import { darkTheme } from "@/constants/colors"
import { useForexStore } from "@/store/forex-store"

const { width } = Dimensions.get("window")

interface NotificationBellProps {
  size?: number
  color?: string
}

export default function NotificationBell({
  size = width > 400 ? 24 : 22,
  color = darkTheme.text,
}: NotificationBellProps) {
  const router = useRouter()
  const { unreadNotificationsCount } = useForexStore()

  const handlePress = () => {
    router.push("/notifications")
  }

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Bell size={size} color={color} />
      {unreadNotificationsCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unreadNotificationsCount > 99 ? "99+" : unreadNotificationsCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    padding: width > 400 ? 8 : 10,
    marginRight: width > 400 ? 0 : 5,
  },
  badge: {
    position: "absolute",
    top: width > 400 ? 2 : 5,
    right: width > 400 ? 2 : 5,
    backgroundColor: darkTheme.danger,
    borderRadius: 10,
    minWidth: width > 400 ? 20 : 18,
    height: width > 400 ? 20 : 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#FFF",
    fontSize: width > 400 ? 10 : 9,
    fontWeight: "700",
  },
})
