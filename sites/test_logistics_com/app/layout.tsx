import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';
import { siteContent as content } from '@/components/siteContent';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = { title: { default: content.company_name, template: `%s | ${content.company_name}` }, description: `High-quality ${content.company_name} website built by AI.` };
export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}><Header /><main>{children}</main><Footer /></body>
    </html>
  );
}