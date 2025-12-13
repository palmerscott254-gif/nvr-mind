'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      className={`${
        isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
      } transition-all duration-300 ease-out`}
    >
      {children}
    </div>
  );
}
