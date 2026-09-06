import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/providers/Providers';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'DevFlow — Developer Productivity',
  description: 'A focused workspace for planning projects, tracking tasks, and building momentum.',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary selection:text-white">
        <Providers>
          {children}
          <Toaster 
            position="top-right" 
            toastOptions={{
              style: {
                background: '#111827',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                fontSize: '13px'
              }
            }} 
          />
        </Providers>
      </body>
    </html>
  );
}
