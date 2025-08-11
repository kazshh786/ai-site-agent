'use client';
import Link from 'next/link';
import { siteContent as content } from './siteContent';
export default function Footer() {
  return (
    <footer>
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <nav className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
          <div className="pb-6"><Link href="/">Home</Link></div>
          <div className="pb-6"><Link href="/about">About</Link></div>
          <div className="pb-6"><Link href="/services">Services</Link></div>
          <div className="pb-6"><Link href="/contact">Contact</Link></div>
        </nav>
        <div className="mt-10 text-center">
            <p className="text-xs leading-5">&copy; {content.current_year} {content.company_name}. All rights reserved.</p>
            <p className="text-xs leading-5 mt-2">{content.contact.address} | {content.contact.phone} | {content.contact.email}</p>
        </div>
      </div>
    </footer>
  );
}