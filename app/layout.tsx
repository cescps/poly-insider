import type { Metadata } from "next"
import { Inter, Instrument_Serif } from "next/font/google"
import "./globals.css"
import Navigation from "@/components/Navigation"

const inter = Inter({ subsets: ["latin"] })
const instrumentSerif = Instrument_Serif({ 
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-instrument-serif"
})

export const metadata: Metadata = {
  title: "Antimental - Against overthinking",
  description: "Track large trades from new wallets on Polymarket",
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: "Antimental - Against overthinking",
    description: "Track large trades from new wallets on Polymarket",
    images: [
      {
        url: '/preview.png',
        width: 1200,
        height: 630,
        alt: 'Antimental Preview',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Antimental - Against overthinking",
    description: "Track large trades from new wallets on Polymarket",
    images: ['/preview.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${instrumentSerif.variable}`}>
        <Navigation />
        {children}
      </body>
    </html>
  )
}