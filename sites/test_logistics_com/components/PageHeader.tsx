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