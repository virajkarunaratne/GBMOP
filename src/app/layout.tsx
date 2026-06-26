import type { Metadata } from 'next'
import { AuthProvider } from '@/contexts/AuthContext'
import './globals.css'

export const metadata: Metadata = {
  title: 'GMOP - Godayana Marketing Operations Platform',
  description: 'Premium marketing operations platform for digital agencies',
  keywords: ['marketing', 'operations', 'project management', 'content planning'],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0B6BA2',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-neutral-150 text-neutral-900">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
