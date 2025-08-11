'use client';
import React from 'react';
import PageHeader from '@/components/PageHeader';
import CtaSection from '@/components/CtaSection';
import FadeIn from '@/components/FadeIn';
import { siteContent as content } from '@/components/siteContent';

export default function AboutPage() {
  return (
    <>
      <PageHeader title={content.about_page.title} headline={content.about_page.header_headline} image={content.images.about_header} />
      <div>
        <div>
            <h2>A Deeper Look into Our About</h2>
            <p>{content.about_page.intro_paragraph}</p>
        </div>
      </div>
      <CtaSection />
    </>
  );
}