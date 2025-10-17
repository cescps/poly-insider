"use client"

import { useEffect, useState } from "react"

const Ticker = () => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check initial theme
    const checkTheme = () => {
      const isDarkMode = document.documentElement.classList.contains("dark")
      setIsDark(isDarkMode)
    }

    checkTheme()

    // Watch for theme changes
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800">
      <iframe
        key={isDark ? "dark" : "light"}
        src={`https://ticker.polymarket.com/embed?category=Breaking News&theme=${isDark ? "dark" : "light"}&speed=1&showPrices=true`}
        width="100%"
        height="60"
        style={{ border: "none", overflow: "hidden", backgroundColor: "transparent", display: "block" }}
        scrolling="no"
        title="Polymarket Ticker"
      />
    </div>
  )
}

export default Ticker

