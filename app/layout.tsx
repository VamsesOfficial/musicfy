import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geist = Geist({ subsets: ["latin"], variable: '--font-geist-sans' });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: '--font-geist-mono' });

export const metadata: Metadata = {
  title: 'Musicify - Premium Music Streaming Platform',
  description: 'Experience the future of music streaming with Musicify. Discover millions of songs, create playlists, and enjoy seamless playback with our modern, AI-powered music platform.',
  generator: 'v0.app',
  keywords: ['music streaming', 'spotify', 'music player', 'playlist', 'audio'],
  authors: [{ name: 'Musicify Team' }],
  creator: 'Musicify',
  publisher: 'Musicify',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://musicify.vercel.app',
    title: 'Musicify - Premium Music Streaming',
    description: 'Experience the future of music streaming',
    images: [
      {
        url: 'https://musicify.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Musicify',
      },
    ],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#090909',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Musicify" />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
