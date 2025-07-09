import type { Metadata } from 'next'
import './globals.css'
import { Web3Provider } from '@/components/providers/web3-provider'

export const metadata: Metadata = {
  title: 'Nadmon - Collect, Battle, and Trade Digital Creatures',
  description: 'A blockchain-based creature collection and battling game on Monad. Collect unique NFT monsters, battle other players, and build your legendary collection.',
  generator: 'Next.js',
  metadataBase: new URL('https://nadmon.kadzu.dev'),
  
  // Open Graph
  openGraph: {
    title: 'Nadmon - Collect, Battle, and Trade Digital Creatures',
    description: 'A blockchain-based creature collection and battling game on Monad. Collect unique NFT monsters, battle other players, and build your legendary collection.',
    url: 'https://nadmon.kadzu.dev',
    siteName: 'Nadmon',
    images: [
      {
        url: '/OG.png',
        width: 1200,
        height: 630,
        alt: 'Nadmon - Digital Creature Collection Game',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Nadmon - Collect, Battle, and Trade Digital Creatures',
    description: 'A blockchain-based creature collection and battling game on Monad. Collect unique NFT monsters, battle other players, and build your legendary collection.',
    images: ['/OG.png'],
    creator: '@nadmon_game',
    site: '@nadmon_game',
  },

  // Additional metadata
  keywords: [
    'Nadmon',
    'NFT',
    'blockchain game',
    'digital creatures',
    'monster collection',
    'battle game',
    'Monad',
    'web3 gaming',
    'cryptocurrency',
    'trading cards',
    'digital collectibles'
  ],
  
  // Robot instructions
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

  // Additional tags
  category: 'gaming',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  )
}
