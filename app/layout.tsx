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
            position="top-left"
            expand={true}
            visibleToasts={5}
            closeButton={false}
            offset="16px"
            gap={8}
            dir="ltr"
            theme="dark"
            toastOptions={{
              style: {
                background: 'rgba(15, 23, 42, 0.9)',
                border: '2px solid rgba(71, 85, 105, 0.6)',
                color: 'white',
                backdropFilter: 'blur(12px)',
                fontSize: '13px',
                padding: '10px 14px',
                minHeight: '40px',
                borderRadius: '8px',
                maxWidth: '380px',
                lineHeight: '1.2',
                fontWeight: '500',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5), 0 1px 0 rgba(255, 255, 255, 0.05) inset',
              },
              duration: 4000,
              className: 'toast-slide-top',
            }}
            richColors={false}
          />
        </Web3Provider>
      </body>
    </html>
  )
}
