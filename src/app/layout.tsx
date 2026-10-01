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
    'Idea Lab Prototype',
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
        {/* Prototype Header Banner */}
        <div className="bg-slate-900 text-slate-300 text-[11px] font-medium py-1.5 px-4 text-center border-b border-slate-800 flex items-center justify-center gap-2">
          <span className="bg-blue-600 text-white font-bold text-[9px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
            Idea Lab Prototype
          </span>
          <span>
            Urban Resource Coordination System • Energy & Electrical Infrastructure Focus
          </span>
        </div>

        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
