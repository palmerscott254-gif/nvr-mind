import type { Metadata } from 'next'
import { ReduxProvider } from '@/lib/Provider'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar' // I'll add the Navbar
import './globals.css'

export const metadata: Metadata = {
  title: 'Scholsey',
  description: 'Scholsey Application',
}

export default function NewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        <ReduxProvider>
          <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Navbar />
              <main className="flex-1 p-8">
                {children}
              </main>
            </div>
          </div>
        </ReduxProvider>
      </body>
    </html>
  )
}
