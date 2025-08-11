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