import { useState, useEffect } from 'react';

type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 768) return 'mobile';
      if (width < 1024) return 'tablet';
      return 'desktop';
    }
    return 'desktop';
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setBreakpoint('mobile');
      } else if (width < 1024) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('desktop');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
};

export const useIsMobile = () => {
  const breakpoint = useBreakpoint();
  return breakpoint === 'mobile';
};

export const useIsTablet = () => {
  const breakpoint = useBreakpoint();
  return breakpoint === 'tablet';
};

export const useIsDesktop = () => {
  const breakpoint = useBreakpoint();
  return breakpoint === 'desktop';
};