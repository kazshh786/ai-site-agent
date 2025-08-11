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