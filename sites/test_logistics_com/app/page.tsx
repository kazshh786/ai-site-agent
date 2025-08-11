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

const iconMap: { [key: string]: React.ReactElement } = { LocalShipping: <LocalShippingIcon />, FlightTakeoff: <FlightTakeoffIcon />, Warehouse: <WarehouseIcon />, Language: <LanguageIcon />, TrackChanges: <TrackChangesIcon />, SupportAgent: <SupportAgentIcon />, PriceCheck: <PriceCheckIcon /> };

export default function HomePage() {
  return (
    <>
      <PageHeader title={content.company_name} headline={content.home.hero_headline} image={content.images.hero} primary_cta={content.home.primary_cta} secondary_cta={content.home.secondary_cta} />
      <LogoCloud />
      <div>
        <div>
            <h2>{content.home.about_section_title}</h2>
            <p>{content.home.about_section_content}</p>
        </div>
        <div>
            {content.why_choose_us_list.map((item) => (<div key={item.title}><h3>{item.title}</h3><p>{item.description}</p></div>))}
        </div>
      </div>
      <div>
        <h2>{content.home.services_section_title}</h2>
        <p>{content.home.services_section_subtitle}</p>
        <div>
            {content.services_list.map((service) => (<div key={service.title}><div>{iconMap[service.icon]} {service.title}</div><p>{service.description}</p></div>))}
        </div>
      </div>
      <div>
        <h2>Trusted by businesses worldwide</h2>
        <p>We are proud to be a reliable partner for companies big and small.</p>
        <div>
            {content.stats_list.map((stat) => (<div key={stat.label}><div>{stat.label}</div><div>{stat.value}</div></div>))}
        </div>
      </div>
      <CtaSection />
    </>
  );
}