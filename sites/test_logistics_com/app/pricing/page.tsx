'use client';
import React from 'react';
import PageHeader from '@/components/PageHeader';
import CtaSection from '@/components/CtaSection';
import FadeIn from '@/components/FadeIn';
import { siteContent as content } from '@/components/siteContent';

export default function PricingPage() {
  return (
    <>
      <PageHeader title={content.pricing_page.title} headline={content.pricing_page.header_headline} image={content.images.pricing_header} />
      <div>
        <div>
            <h2>A Deeper Look into Our Pricing</h2>
            <p>{content.pricing_page.intro_paragraph}</p>
        </div>
      </div>
      <CtaSection />
    </>
  );
}