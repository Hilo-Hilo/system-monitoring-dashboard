import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import './globals.css'

export const metadata: Metadata = {
  title: 'System Monitoring Dashboard',
  description: 'Real-time system resource monitoring for NVIDIA Spark',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Header />
        {children}
      </body>
    </html>
  )
}

