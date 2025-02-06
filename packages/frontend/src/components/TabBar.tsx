'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useState, useRef, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

const tabs = [
  'Overview',
  'Integrations',
  'Activity',
  'Domains',
  'Usage',
  'Monitoring',
];

export function TabBar() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverStyle, setHoverStyle] = useState({});
  const [activeStyle, setActiveStyle] = useState({
    left: '0px',
    width: '0px',
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (hoveredIndex !== null) {
      const hoveredElement = tabRefs.current[hoveredIndex];
      if (hoveredElement) {
        const { offsetLeft, offsetWidth } = hoveredElement;
        setHoverStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    }
  }, [hoveredIndex]);

  useEffect(() => {
    const activeElement = tabRefs.current[activeIndex];
    if (activeElement) {
      const { offsetLeft, offsetWidth } = activeElement;
      setActiveStyle({
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`,
      });
    }
  }, [activeIndex]);

  useEffect(() => {
    requestAnimationFrame(() => {
      const overviewElement = tabRefs.current[0];
      if (overviewElement) {
        const { offsetLeft, offsetWidth } = overviewElement;
        setActiveStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    });
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div
      className={`fixed relative inset-x-0 top-0 z-10 flex w-full flex-col items-center justify-center gap-4 border-b border-gray-950/5 px-4 shadow-none dark:border-white/10 ${
        isDarkMode ? 'bg-transparent' : ''
      }`}
    >
      <div className="flex h-[30px]">{/* LOGO */}</div>
      <div className="mb-[6px] flex justify-between">
        <div className="relative">
          {/* Hover Highlight */}
          <div
            className="absolute flex h-[30px] items-center rounded-[6px] bg-[#0e0f1114] transition-all duration-300 ease-out dark:bg-[#ffffff1a]"
            style={{
              ...hoverStyle,
              opacity: hoveredIndex !== null ? 1 : 0,
            }}
          />

          {/* Active Indicator */}
          <div
            className="absolute bottom-[-6px] h-[2px] bg-[#0e0f11] transition-all duration-300 ease-out dark:bg-white"
            style={activeStyle}
          />

          {/* Tabs */}
          <div className="relative flex items-center space-x-[6px]">
            {tabs.map((tab, index) => (
              <div
                key={index}
                ref={(el) => (tabRefs.current[index] = el)}
                className={`h-[30px] cursor-pointer px-3 py-2 transition-colors duration-300 ${
                  index === activeIndex
                    ? 'text-[#0e0e10] dark:text-white'
                    : 'text-[#0e0f1199] dark:text-[#ffffff99]'
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setActiveIndex(index)}
              >
                <div className="flex h-full items-center justify-center whitespace-nowrap text-sm font-[var(--www-mattmannucci-me-geist-regular-font-family)] leading-5">
                  {tab}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
