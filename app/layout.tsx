import type { Metadata } from 'next'
import './globals.css'
import { Web3Provider } from '@/components/providers/web3-provider'

export const metadata: Metadata = {
  title: 'Nadmon - Collect, Battle, and Trade Digital Creatures',
  description: 'A blockchain-based creature collection and battling game',
  generator: 'Next.js',
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
