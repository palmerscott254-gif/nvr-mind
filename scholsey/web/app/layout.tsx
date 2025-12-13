import type { Metadata } from 'next'
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
    <html lang="en">
      <body
        className="relative min-h-screen text-white"
        style={{
          backgroundColor: '#0b1329',
          backgroundImage:
            'linear-gradient(rgba(5,10,26,0.7), rgba(5,10,26,0.9)), url(https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="fixed inset-0 bg-gradient-to-br from-blue-900/85 via-purple-900/80 to-slate-900/85 -z-10"></div>
        {children}
      </body>
    </html>
  )
}
