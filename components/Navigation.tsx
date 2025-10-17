"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const Navigation = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  useEffect(() => {
    // Keyboard shortcuts for navigation
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger if no input/textarea is focused
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key) {
        case "1":
          router.push("/")
          break
        case "2":
          router.push("/smart")
          break
        case "3":
          router.push("/strategies")
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [router])

  const toggleDarkMode = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  const links = [
    { href: "/", label: "Insider" },
    { href: "/smart", label: "Smart Traders" },
    { href: "/strategies", label: "Strategies" },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-6">
        {/* Centered Brand */}
        <div className="flex justify-center items-center mb-4">
          <Link href="/" className="flex flex-col items-center text-center gap-3">
            <div className="flex items-center gap-3 md:gap-4">
              <Image 
                src="/logo.png" 
                alt="Antimental Logo" 
                width={48} 
                height={48}
                className="object-contain md:w-16 md:h-16"
              />
              <div className="text-gray-900 dark:text-white" style={{ fontFamily: 'var(--font-instrument-serif)' }}>
                <span className="text-5xl md:text-6xl font-normal">Antimental</span>
              </div>
            </div>
            <span className="text-lg md:text-xl font-light text-gray-600 dark:text-gray-400" style={{ fontFamily: 'var(--font-instrument-serif)' }}>
              Against overthinking
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            className="absolute right-4 top-6 text-gray-600 dark:text-gray-300"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Ticker */}
      <div className="container mx-auto px-4">
        <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
          <iframe
            key={isDark ? "dark" : "light"}
            src={`https://ticker.polymarket.com/embed?category=Breaking News&theme=${isDark ? "dark" : "light"}&speed=1&showPrices=true`}
            width="100%"
            height="43"
            style={{ border: "none", overflow: "hidden", display: "block" }}
            scrolling="no"
            title="Polymarket Ticker"
          />
        </div>
      </div>
      
      {/* Floating Tabs */}
      <div className="container mx-auto px-4 pt-3 pb-3">
        <div className="flex space-x-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navigation

