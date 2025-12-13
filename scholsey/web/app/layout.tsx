import type { Metadata } from 'next'
import { ReduxProvider } from '@/lib/Provider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageTransition from '@/components/PageTransition'
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
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <PageTransition>
                <div className="p-6 sm:p-8 md:p-10 max-w-7xl mx-auto">
                  {children}
                </div>
              </PageTransition>
            </main>
            <Footer />
          </div>
        </ReduxProvider>
      </body>
    </html>
  )
}
