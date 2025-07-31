import type { Metadata } from 'next'
import '@fontsource/geist'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Coinday - Latest News & Updates',
  description: 'Stay updated with the latest news and trending stories from around the world.',
  keywords: 'news, updates, trending, stories, coinday',
  authors: [{ name: 'Coinday Team' }],
  openGraph: {
    title: 'Coinday - Latest News & Updates',
    description: 'Stay updated with the latest news and trending stories from around the world.',
    url: 'https://coinday.com',
    siteName: 'Coinday',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Coinday News',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Coinday - Latest News & Updates',
    description: 'Stay updated with the latest news and trending stories from around the world.',
    images: ['/og-image.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="https://ik.imagekit.io/coinday/coinday.io-logo-2.png?updatedAt=1753990031399" />
        <link rel="apple-touch-icon" sizes="180x180" href="https://ik.imagekit.io/coinday/coinday.io-logo-2.png?updatedAt=1753990031399" />
        <link rel="icon" type="image/png" sizes="32x32" href="https://ik.imagekit.io/coinday/coinday.io-logo-2.png?updatedAt=1753990031399" />
        <link rel="icon" type="image/png" sizes="16x16" href="https://ik.imagekit.io/coinday/coinday.io-logo-2.png?updatedAt=1753990031399" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="font-geist bg-black text-white min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}