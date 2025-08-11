'use client';
import React from 'react';
import PageHeader from '@/components/PageHeader';
import CtaSection from '@/components/CtaSection';
import FadeIn from '@/components/FadeIn';
import { siteContent as content } from '@/components/siteContent';

export default function BlogPage() {
  return (
    <>
      <PageHeader title={content.blog_page.title} headline={content.blog_page.header_headline} image={content.images.blog_header} />
      <div>
        <div>
            <h2>A Deeper Look into Our Blog</h2>
            <p>{content.blog_page.intro_paragraph}</p>
        </div>
      </div>
      <CtaSection />
    </>
  );
}