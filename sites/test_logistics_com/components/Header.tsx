'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { siteContent as content } from './siteContent';

const navItems = [ { name: 'Home', href: '/' }, { name: 'About', href: '/about' }, { name: 'Services', href: '/services' }, { name: 'Pricing', href: '/pricing' }, { name: 'Blog', href: '/blog' }, ];

export default function Header() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900"><LocalShippingIcon />{content.company_name}</Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (<Link key={item.name} href={item.href}>{item.name}</Link>))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Link href="/contact">{content.home.primary_cta}</Link>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button type="button" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="space-y-1 pb-3 pt-2">
            {navItems.map((item) => (<Link key={item.name} href={item.href} className="block py-2 pl-3 pr-4">{item.name}</Link>))}
            <Link href="/contact" className="block py-2 pl-3 pr-4">{content.home.primary_cta}</Link>
          </div>
        </div>
      )}
    </nav>
  );
}