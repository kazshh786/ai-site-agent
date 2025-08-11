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