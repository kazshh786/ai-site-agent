# FILE 3: design_writer.py
# This script is the "Design Engine". It contains all the logic for writing
# the theme, component, and configuration files for the site.
# It now writes the correct PostCSS config to resolve the build error.

from pathlib import Path

def write_tailwind_config(path: Path):
    """
    Creates the tailwind.config.ts and the CORRECT postcss.config.js file.
    """
    tailwind_config_content = """
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
        colors: {
            primary: '#1D4ED8', // A professional blue
            secondary: '#9333EA', // A vibrant purple
            accent: '#F59E0B', // A warm accent
            neutral: {
                DEFAULT: '#404040',
                light: '#F5F5F5',
                dark: '#171717',
            }
        }
    },
  },
  plugins: [],
};
export default config;
"""
    # FIX: This is the correct configuration for modern Tailwind CSS
    # It explicitly uses the @tailwindcss/postcss plugin as required by the error log.
    postcss_config_content = """
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    'autoprefixer': {},
  },
}
"""
    (path / 'tailwind.config.ts').write_text(tailwind_config_content.strip())
    (path / 'postcss.config.js').write_text(postcss_config_content.strip())
    print("[✔] Wrote tailwind.config.ts and CORRECT postcss.config.js")


def write_globals_css(path: Path):
    """
    Writes a globals.css file that uses @apply to create semantic
    CSS classes based on the Tailwind utilities.
    """
    css_content = """
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn {
    @apply inline-flex items-center justify-center px-6 py-3 font-semibold tracking-wide transition-all duration-300 ease-in-out;
  }
  .btn-primary {
    @apply btn bg-primary text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transform;
  }
  .btn-secondary {
    @apply btn bg-transparent text-primary border-2 border-primary rounded-full hover:bg-primary hover:text-white;
  }
  .header-nav {
    @apply bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50;
  }
  .nav-link {
    @apply inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-primary hover:text-primary;
  }
  .card {
    @apply bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6;
  }
  .footer {
    @apply bg-neutral-dark text-gray-300;
  }
  .footer-link {
    @apply text-sm leading-6 hover:text-white transition-colors;
  }
  .section-title {
    @apply text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl;
  }
  .section-subtitle {
    @apply text-base font-semibold leading-7 text-primary;
  }
  .section-intro {
    @apply mt-2 text-lg leading-8 text-gray-600;
  }
  .section-title-inverted {
    @apply text-3xl font-bold tracking-tight text-white sm:text-4xl;
  }
  .section-intro-inverted {
    @apply mt-2 text-lg leading-8 text-gray-300;
  }
  .stats-section {
      @apply bg-neutral-dark py-24 sm:py-32;
  }
}

html {
  scroll-behavior: smooth;
}

.fade-in-section {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}
.fade-in-section.is-visible {
    opacity: 1;
    transform: translateY(0);
}
"""
    (path / 'app' / 'globals.css').write_text(css_content.strip())
    print("[✔] Wrote app/globals.css with semantic component classes.")


def write_static_files(path: Path):
    """Writes all static .tsx files using semantic class names."""
    print("[•] Writing all static component and page files...")
    comp_dir = path / 'components'
    app_dir = path / 'app'
    
    comp_dir.mkdir(exist_ok=True)
    app_dir.mkdir(exist_ok=True)

    (comp_dir / 'FadeIn.tsx').write_text("""
'use client';
import React, { useRef, useEffect, useState } from 'react';
export default function FadeIn({ children }: { children: React.ReactNode }) {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { setVisible(true); }
      });
    });
    const { current } = domRef;
    if (current) {
      observer.observe(current);
      return () => observer.unobserve(current);
    }
  }, []);
  return (<div ref={domRef} className={`fade-in-section ${isVisible ? 'is-visible' : ''}`}>{children}</div>);
}
""".strip())
    print("  [✔] Wrote components/FadeIn.tsx")
    
    (comp_dir / 'LogoCloud.tsx').write_text("""
'use client';
import React from 'react';
import { siteContent as content } from '@/components/siteContent';

interface Logo {
  name: string;
}

export default function LogoCloud() {
  if (!content.client_logos || content.client_logos.length === 0) return null;
  return (
    <div className="bg-neutral-light py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-lg font-semibold leading-8 text-gray-900">
          {content.home.testimonials_section_title || "Trusted by the world’s most innovative teams"}
        </h2>
        <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
          {content.client_logos.map((logo: Logo) => (
            <img key={logo.name} className="col-span-2 max-h-12 w-full object-contain lg:col-span-1" src={`https://placehold.co/158x48/FFFFFF/CCCCCC?text=${logo.name.replace(/ /g, '+')}`} alt={logo.name} width={158} height={48} />
          ))}
        </div>
      </div>
    </div>
  );
}
""".strip())
    print("  [✔] Wrote components/LogoCloud.tsx")

    (comp_dir / 'CtaSection.tsx').write_text("""
'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { siteContent as content } from '@/components/siteContent';
export default function CtaSection() {
  return (
    <div className="relative isolate overflow-hidden">
      <Image src={content.images.cta_background} alt="CTA background" fill objectFit="cover" className="-z-10" />
      <div className="absolute inset-0 bg-black/60 -z-10" />
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="section-title-inverted">{content.final_cta.headline}</h2>
          <p className="section-intro-inverted">{content.final_cta.subheadline}</p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href={content.final_cta.button_link} className="btn btn-primary">
              {content.final_cta.button_text}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
""".strip())
    print("  [✔] Wrote components/CtaSection.tsx")
    
    (comp_dir / 'PageHeader.tsx').write_text("""
'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
interface PageHeaderProps { title: string; headline: string; image: string; primary_cta?: string; secondary_cta?: string; }
export default function PageHeader({ title, headline, image, primary_cta, secondary_cta }: PageHeaderProps) {
  return (
    <div className="relative isolate overflow-hidden h-[60vh] min-h-[500px] flex items-center justify-center">
      <Image src={image} alt={`${title} header background`} fill objectFit="cover" className="-z-10" priority />
      <div className="absolute inset-0 bg-black/60 -z-10" />
      <div className="mx-auto max-w-4xl text-center text-white px-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">{title}</h1>
        <p className="mt-6 text-lg leading-8">{headline}</p>
        {primary_cta && <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/contact" className="btn btn-primary">{primary_cta}</Link>
            {secondary_cta && <Link href="/services" className="btn btn-secondary text-white border-white hover:bg-white hover:text-black">{secondary_cta} <span aria-hidden="true">→</span></Link>}
        </div>}
      </div>
    </div>
  );
}
""".strip())
    print("  [✔] Wrote components/PageHeader.tsx")
    
    (app_dir / 'layout.tsx').write_text("""
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';
import { siteContent } from '@/components/siteContent';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = { title: { default: siteContent.company_name, template: `%s | ${siteContent.company_name}` }, description: `High-quality ${siteContent.company_name} website built by AI.` };
export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white`}><Header /><main>{children}</main><Footer /></body>
    </html>
  );
}
""".strip())
    print("  [✔] Wrote app/layout.tsx")

    (comp_dir / 'Header.tsx').write_text("""
'use client';
import React from 'react';
import Link from 'next/link';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { siteContent } from './siteContent';
const navItems = [ { name: 'Home', href: '/' }, { name: 'About', href: '/about' }, { name: 'Services', href: '/services' }, { name: 'Pricing', href: '/pricing' }, { name: 'Blog', href: '/blog' }, ];
export default function Header() {
  return (
    <Disclosure as="nav" className="header-nav">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900"><LocalShippingIcon />{siteContent.company_name}</Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navItems.map((item) => (<Link key={item.name} href={item.href} className="nav-link">{item.name}</Link>))}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <Link href="/contact" className="btn btn-primary">{siteContent.home.primary_cta}</Link>
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
                  <span className="sr-only">Open main menu</span>
                  {open ? (<XMarkIcon className="block h-6 w-6" aria-hidden="true" />) : (<Bars3Icon className="block h-6 w-6" aria-hidden="true" />)}
                </Disclosure.Button>
              </div>
            </div>
          </div>
          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navItems.map((item) => (<Disclosure.Button key={item.name} as={Link} href={item.href} className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-primary hover:bg-gray-50 hover:text-gray-700">{item.name}</Disclosure.Button>))}
              <Disclosure.Button as={Link} href="/contact" className="block border-l-4 border-primary py-2 pl-3 pr-4 text-base font-medium text-primary bg-indigo-50">{siteContent.home.primary_cta}</Disclosure.Button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
""".strip())
    print("  [✔] Wrote components/Header.tsx")

    (comp_dir / 'Footer.tsx').write_text("""
'use client';
import Link from 'next/link';
import { siteContent as content } from './siteContent';
export default function Footer() {
  return (
    <footer className="footer">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <nav className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
          <div className="pb-6"><Link href="/" className="footer-link">Home</Link></div>
          <div className="pb-6"><Link href="/about" className="footer-link">About</Link></div>
          <div className="pb-6"><Link href="/services" className="footer-link">Services</Link></div>
          <div className="pb-6"><Link href="/contact" className="footer-link">Contact</Link></div>
        </nav>
        <div className="mt-10 text-center">
            <p className="text-xs leading-5">&copy; {content.current_year} {content.company_name}. All rights reserved.</p>
            <p className="text-xs leading-5 mt-2">{content.contact.address} | {content.contact.phone} | {content.contact.email}</p>
        </div>
      </div>
    </footer>
  );
}
""".strip())
    print("  [✔] Wrote components/Footer.tsx")
    
    (app_dir / 'page.tsx').write_text("""
'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import LanguageIcon from '@mui/icons-material/Language';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import PageHeader from '@/components/PageHeader';
import CtaSection from '@/components/CtaSection';
import FadeIn from '@/components/FadeIn';
import LogoCloud from '@/components/LogoCloud';
import { siteContent as content } from '@/components/siteContent';

const iconMap: { [key: string]: React.ReactElement } = { LocalShipping: <LocalShippingIcon className="h-8 w-8 text-primary" />, FlightTakeoff: <FlightTakeoffIcon className="h-8 w-8 text-primary" />, Warehouse: <WarehouseIcon className="h-8 w-8 text-primary" />, Language: <LanguageIcon className="h-8 w-8 text-primary" />, TrackChanges: <TrackChangesIcon className="h-8 w-8 text-white" />, SupportAgent: <SupportAgentIcon className="h-8 w-8 text-white" />, PriceCheck: <PriceCheckIcon className="h-8 w-8 text-white" /> };

export default function HomePage() {
  return (
    <>
      <PageHeader title={content.company_name} headline={content.home.hero_headline} image={content.images.hero} primary_cta={content.home.primary_cta} secondary_cta={content.home.secondary_cta} />
      <LogoCloud />
      <div className="py-24 sm:py-32"><div className="mx-auto max-w-7xl px-6 lg:px-8"><FadeIn><div className="mx-auto grid max-w-2xl grid-cols-1 items-start gap-x-8 gap-y-16 sm:gap-y-24 lg:mx-0 lg:max-w-none lg:grid-cols-2">
        <div><div className="text-base leading-7 lg:max-w-lg"><p className="section-subtitle">About Us</p><h1 className="section-title">{content.home.about_section_title}</h1><div className="max-w-xl"><p className="mt-6">{content.home.about_section_content}</p></div></div></div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-l border-gray-900/10 pl-8 md:grid-cols-2">{content.why_choose_us_list.map((item) => (<div key={item.title}><div className="font-semibold text-gray-900">{item.title}</div><div className="mt-2 text-gray-600">{item.description}</div></div>))}</div>
      </div></FadeIn></div></div>
      <div className="bg-neutral-light py-24 sm:py-32"><div className="mx-auto max-w-7xl px-6 lg:px-8"><FadeIn><div className="mx-auto max-w-2xl lg:text-center"><p className="section-subtitle">Our Services</p><h2 className="section-title">{content.home.services_section_title}</h2><p className="section-intro">{content.home.services_section_subtitle}</p></div><div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"><dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">{content.services_list.map((service) => (<div key={service.title} className="flex flex-col card"><dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">{iconMap[service.icon]} {service.title}</dt><dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600"><p className="flex-auto">{service.description}</p></dd></div>))}</dl></div></FadeIn></div></div>
      <div className="stats-section"><div className="mx-auto max-w-7xl px-6 lg:px-8"><FadeIn><div className="mx-auto max-w-2xl lg:max-w-none"><div className="text-center"><h2 className="section-title-inverted">Trusted by businesses worldwide</h2><p className="section-intro-inverted">We are proud to be a reliable partner for companies big and small.</p></div><dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">{content.stats_list.map((stat) => (<div key={stat.label} className="flex flex-col bg-white/5 p-8"><dt className="text-sm font-semibold leading-6 text-gray-300">{stat.label}</dt><dd className="order-first text-3xl font-semibold tracking-tight text-white">{stat.value}</dd></div>))}</dl></div></FadeIn></div></div>
      <CtaSection />
    </>
  );
}
""".strip())
    print("  [✔] Wrote app/page.tsx")

    for page_name in ['about', 'services', 'pricing', 'blog', 'contact']:
        page_dir = app_dir / page_name
        page_dir.mkdir(exist_ok=True)
        
        title_prop = f"{{content.{page_name}_page.title}}"
        headline_prop = f"{{content.{page_name}_page.header_headline}}"
        image_prop = f"{{content.images.{page_name}_header}}"
        intro_prop = f"{{content.{page_name}_page.intro_paragraph}}"

        page_content = f"""
'use client';
import React from 'react';
import PageHeader from '@/components/PageHeader';
import CtaSection from '@/components/CtaSection';
import FadeIn from '@/components/FadeIn';
import {{ siteContent as content }} from '@/components/siteContent';

export default function {page_name.capitalize()}Page() {{
  return (
    <>
      <PageHeader title={title_prop} headline={headline_prop} image={image_prop} />
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeIn>
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="section-title">
                A Deeper Look into Our {page_name.capitalize()}
              </h2>
              <p className="section-intro">
                {intro_prop}
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
      <CtaSection />
    </>
  );
}}
"""
        (page_dir / 'page.tsx').write_text(page_content.strip())
        print(f"  [✔] Wrote app/{page_name}/page.tsx")
