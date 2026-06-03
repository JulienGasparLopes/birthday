"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface RevealSectionProps {
  className?: string;
  children: ReactNode;
}

export function RevealSection({ className, children }: RevealSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimKey((k) => k + 1);
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className={className}>
      <div key={animKey} className="contents">
        {children}
      </div>
    </section>
  );
}
