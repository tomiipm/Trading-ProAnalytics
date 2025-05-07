// Define color scheme for the app
export const COLORS = {
  dark: {
    background: "#121212",
    cardBackground: "#1E1E1E",
    text: "#FFFFFF",
    secondaryText: "#A0A0A0",
    accent: "#3F51B5", // Changed to blue accent
    secondary: "#FF9800", // Orange secondary
    buy: "#4CAF50", // Green for buy signals
    sell: "#F44336", // Red for sell signals
    neutral: "#A0A0A0",
    border: "#2D2D2D",
    success: "#4CAF50",
    danger: "#F44336",
    chart: "#3F51B5", // Chart color matching accent
    chartGrid: "#2D2D2D",
    progressStart: "#FF9800", // Progress start matching secondary
    progressEnd: "#3F51B5", // Progress end matching accent
    cardBorder: "rgba(255, 255, 255, 0.08)",
    premium: "#FFC107", // Gold for premium features
  },
  light: {
    background: "#F5F5F5",
    cardBackground: "#FFFFFF",
    text: "#121212",
    secondaryText: "#757575",
    accent: "#3F51B5", // Changed to blue accent
    secondary: "#FF9800", // Orange secondary
    buy: "#4CAF50", // Green for buy signals
    sell: "#F44336", // Red for sell signals
    neutral: "#757575",
    border: "#E0E0E0",
    success: "#4CAF50",
    danger: "#F44336",
    chart: "#3F51B5", // Chart color matching accent
    chartGrid: "#E0E0E0",
    progressStart: "#FF9800", // Progress start matching secondary
    progressEnd: "#3F51B5", // Progress end matching accent
    cardBorder: "rgba(0, 0, 0, 0.08)",
    premium: "#FFC107", // Gold for premium features
  },
}

// Export the dark theme directly to avoid undefined issues
export const darkTheme = COLORS.dark
export const lightTheme = COLORS.light

export default COLORS
