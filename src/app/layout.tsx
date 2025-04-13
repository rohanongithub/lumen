import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import PageBackground from '@/components/PageBackground'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LUMEN',
  description: 'Your music platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PageBackground />
        <Navbar />
        <main className="min-h-screen p-8">
          {children}
        </main>
      </body>
    </html>
  )
} 