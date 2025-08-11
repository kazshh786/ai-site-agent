'use client';
import React from 'react';
import PageHeader from '@/components/PageHeader';
import CtaSection from '@/components/CtaSection';
import FadeIn from '@/components/FadeIn';
import { siteContent as content } from '@/components/siteContent';

export default function ContactPage() {
  return (
    <>
      <PageHeader title={content.contact_page.title} headline={content.contact_page.header_headline} image={content.images.contact_header} />
      <div>
        <div>
            <h2>A Deeper Look into Our Contact</h2>
            <p>{content.contact_page.intro_paragraph}</p>
        </div>
      </div>
      <CtaSection />
    </>
  );
}