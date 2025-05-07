"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, Dimensions, Platform } from "react-native"
import { darkTheme } from "@/constants/colors"
import Svg, { Path, Line, Circle, Text as SvgText } from "react-native-svg"
import { fetchHistoricalMarketData } from "@/services/api"

interface ChartComponentProps {
  pair: string
  type: string
}

export default function ChartComponent({ pair, type }: ChartComponentProps) {
  const width = Dimensions.get("window").width - 32 // Account for margin
  const height = 200
  const [chartData, setChartData] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadChartData = async () => {
      setLoading(true)
      setError(null)
      try {
        // Fetch real historical data for the last 60 points (e.g., last 60 days or minutes if available)
        const historicalData = await fetchHistoricalMarketData(pair, 60)
        if (historicalData && historicalData.length > 0) {
          const prices = historicalData.map((item: any) => item.price)
          setChartData(prices.slice(-60)) // Take the last 60 points
        } else {
          throw new Error("No data available")
        }
        setLoading(false)
      } catch (err) {
        console.error("Error loading chart data:", err)
        setError("Failed to load chart data")
        setLoading(false)
        // Fallback to empty data or minimal mock data if needed
        setChartData([])
      }
    }

    loadChartData()
  }, [pair])

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.chartContainer}>
          <Text style={styles.loadingText}>Loading chart data...</Text>
        </View>
      </View>
    )
  }

  if (error || chartData.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.chartContainer}>
          <Text style={styles.errorText}>{error || "No data available for chart"}</Text>
        </View>
      </View>
    )
  }

  // Find min and max values for scaling
  const minValue = Math.min(...chartData)
  const maxValue = Math.max(...chartData)
  const range = maxValue - minValue

  // Calculate points for the SVG path
  const points = chartData
    .map((value, index) => {
      const x = (index / (chartData.length - 1)) * width
      const y = height - ((value - minValue) / range) * height
      return `${x},${y}`
    })
    .join(" ")

  // Create path for line chart
  const path = `M ${points}`

  // Determine chart color based on signal type
  const chartColor = type === "BUY" ? darkTheme.buy : darkTheme.sell

  // Calculate grid lines (5 horizontal lines)
  const gridLines = []
  for (let i = 0; i < 5; i++) {
    const y = (height / 5) * (i + 1)
    gridLines.push(
      <Line
        key={`grid-${i}`}
        x1="0"
        y1={y}
        x2={width}
        y2={y}
        stroke={darkTheme.chartGrid}
        strokeWidth="0.5"
        strokeDasharray="5,5"
      />,
    )
  }

  // Calculate price labels for Y-axis
  const priceLabels = []
  for (let i = 0; i < 5; i++) {
    const y = (height / 5) * (i + 1)
    const price = maxValue - range * (i / 5)
    priceLabels.push(
      <SvgText
        key={`price-${i}`}
        x={width - 40}
        y={y + 5}
        fill={darkTheme.secondaryText}
        fontSize="10"
        textAnchor="end"
      >
        {price.toFixed(4)}
      </SvgText>,
    )
  }

  // Add time labels for X-axis
  const timeLabels = []
  for (let i = 0; i < 5; i++) {
    const x = (width / 4) * i
    const label = i === 0 ? "60d ago" : i === 4 ? "Now" : `${60 - i * 15}d ago`
    timeLabels.push(
      <SvgText
        key={`time-${i}`}
        x={x}
        y={height + 15}
        fill={darkTheme.secondaryText}
        fontSize="10"
        textAnchor={i === 0 ? "start" : i === 4 ? "end" : "middle"}
      >
        {label}
      </SvgText>,
    )
  }

  // Add key points (high and low)
  const highPoint = Math.max(...chartData)
  const lowPoint = Math.min(...chartData)
  const highIndex = chartData.indexOf(highPoint)
  const lowIndex = chartData.indexOf(lowPoint)

  const highX = (highIndex / (chartData.length - 1)) * width
  const highY = height - ((highPoint - minValue) / range) * height
  const lowX = (lowIndex / (chartData.length - 1)) * width
  const lowY = height - ((lowPoint - minValue) / range) * height

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        {Platform.OS === "web" ? (
          <Text style={styles.webWarningText}>Interactive charts are not supported on web. View in mobile app.</Text>
        ) : (
          <Svg width={width} height={height + 20} style={styles.chart}>
            {/* Grid lines */}
            {gridLines}

            {/* Price line */}
            <Path d={path} fill="none" stroke={chartColor} strokeWidth="2" />

            {/* Latest price point */}
            <Circle
              cx={width}
              cy={height - ((chartData[chartData.length - 1] - minValue) / range) * height}
              r="4"
              fill={chartColor}
              stroke={darkTheme.cardBackground}
              strokeWidth="1"
            />

            {/* High point */}
            <Circle
              cx={highX}
              cy={highY}
              r="4"
              fill={darkTheme.success}
              stroke={darkTheme.cardBackground}
              strokeWidth="1"
            />
            <SvgText x={highX} y={highY - 15} fill={darkTheme.success} fontSize="10" textAnchor="middle">
              High
            </SvgText>

            {/* Low point */}
            <Circle
              cx={lowX}
              cy={lowY}
              r="4"
              fill={darkTheme.danger}
              stroke={darkTheme.cardBackground}
              strokeWidth="1"
            />
            <SvgText x={lowX} y={lowY + 15} fill={darkTheme.danger} fontSize="10" textAnchor="middle">
              Low
            </SvgText>

            {/* Price labels on Y-axis */}
            {priceLabels}

            {/* Time labels on X-axis */}
            {timeLabels}
          </Svg>
        )}
      </View>
      <View style={styles.chartFooter}>
        <Text style={styles.chartText}>{pair} Price Movement (Last 60 days)</Text>
        <Text style={styles.aiText}>Market Data Analysis - Real Data from FMP API</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.cardBackground,
    borderRadius: 8,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
    padding: 10,
  },
  chartContainer: {
    height: 230,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  chart: {
    backgroundColor: "transparent",
  },
  chartFooter: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  chartText: {
    color: darkTheme.text,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 4,
  },
  aiText: {
    color: darkTheme.accent,
    fontSize: 12,
    textAlign: "center",
    fontStyle: "italic",
  },
  loadingText: {
    color: darkTheme.secondaryText,
    fontSize: 14,
    textAlign: "center",
  },
  errorText: {
    color: darkTheme.danger,
    fontSize: 14,
    textAlign: "center",
  },
  webWarningText: {
    color: darkTheme.secondaryText,
    fontSize: 14,
    textAlign: "center",
    padding: 20,
  },
})
