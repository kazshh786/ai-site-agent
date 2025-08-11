'use client';
import React from 'react';
import PageHeader from '@/components/PageHeader';
import CtaSection from '@/components/CtaSection';
import FadeIn from '@/components/FadeIn';
import { siteContent as content } from '@/components/siteContent';

export default function ServicesPage() {
  return (
    <>
      <PageHeader title={content.services_page.title} headline={content.services_page.header_headline} image={content.images.services_header} />
      <div>
        <div>
            <h2>A Deeper Look into Our Services</h2>
            <p>{content.services_page.intro_paragraph}</p>
        </div>
      </div>
      <CtaSection />
    </>
  );
}