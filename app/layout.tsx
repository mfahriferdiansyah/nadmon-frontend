import type { Metadata } from 'next'
import './globals.css'
import { Web3Provider } from '@/components/providers/web3-provider'
import { Toaster } from 'sonner'

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
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                backdropFilter: 'blur(10px)',
              },
            }}
            richColors
          />
        </Web3Provider>
      </body>
    </html>
  )
}
