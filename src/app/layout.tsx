import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'UrjaSetu | Smart Urban Energy Issue Reporting & Coordination Platform',
  description:
    'Observe urban resource usage and coordinate public electrical infrastructure repairs transparently. Report non-working streetlights, flickering lights, and damaged poles.',
  keywords: [
    'UrjaSetu',
    'Urban Energy Infrastructure',
    'Streetlight Issue Reporting',
    'Smart City Coordination',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} flex flex-col min-h-screen bg-slate-50 text-slate-900`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
