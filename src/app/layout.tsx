import React from 'react'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import PageBackground from '@/components/PageBackground'
import { TransitionProvider } from '@/components/TransitionProvider'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  themeColor: '#000000',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://lumensounds.vercel.app'),
  title: 'LUMEN',
  description: 'Discover and experience music in a whole new light. LUMEN offers a seamless journey through curated playlists, artist discoveries, and a vibrant community of music lovers.',
  manifest: '/manifest.json',
  icons: {
    icon: '/disc.png',
  },
  openGraph: {
    title: 'LUMEN',
    description: 'Discover and experience music in a whole new light. LUMEN offers a seamless journey through curated playlists, artist discoveries, and a vibrant community of music lovers.',
    images: [{
      url: '/cardimage.png',
      width: 1200,
      height: 630,
      alt: 'LUMEN - Your music platform'
    }],
    type: 'website',
    siteName: 'LUMEN',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LUMEN',
    description: 'Discover and experience music in a whole new light. LUMEN offers a seamless journey through curated playlists, artist discoveries, and a vibrant community of music lovers.',
    images: '/cardimage.png',
    creator: '@lumen',
  },
  other: {
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:locale': 'en_US',
    'og:site_name': 'LUMEN',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta property="og:image" content="/cardimage.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="LUMEN" />
        <meta property="og:locale" content="en_US" />
        <meta name="google-site-verification" content="yQr2lvKsrMS9KjyUJkF3_RmEkCGGlKOw-DSfh1FygeI" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/disc.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "LUMEN",
              "url": "https://lumensounds.vercel.app",
              "logo": {
                "@type": "ImageObject",
                "url": "https://lumensounds.vercel.app/disc.png",
                "width": 192,
                "height": 192
              },
              "sameAs": [
                "https://twitter.com/lumen",
                "https://instagram.com/lumen",
                "https://facebook.com/lumen"
              ],
              "description": "Discover and experience music in a whole new light. LUMEN offers a seamless journey through curated playlists, artist discoveries, and a vibrant community of music lovers."
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <PageBackground />
        <TransitionProvider>
          <Navbar />
          <main>
            {children}
          </main>
        </TransitionProvider>
      </body>
    </html>
  )
} 