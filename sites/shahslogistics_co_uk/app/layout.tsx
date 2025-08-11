import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import React from 'react'; // Explicitly import React for React.ReactNode type

import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My Next.js Application',
  description: 'A Next.js 14+ App Router project.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main>{children}</main> {/* Wrap children in a <main> tag for semantics, optional but good practice */}
        <Footer />
      </body>
    </html>
  );
}