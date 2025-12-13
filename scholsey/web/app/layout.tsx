import type { Metadata } from 'next'
import { ReduxProvider } from '@/lib/Provider'
import Navbar from '@/components/Navbar'
import './globals.css'

export const metadata: Metadata = {
  title: 'Scholsey',
  description: 'Scholsey Application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-950 text-gray-100 antialiased">
        <ReduxProvider>
          <div className="flex flex-col h-screen overflow-hidden">
            <Navbar />
            <main className="flex-1 overflow-y-auto">
              <div className="p-6 sm:p-8 md:p-10 max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </ReduxProvider>
      </body>
    </html>
  )
}
