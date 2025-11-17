'use client';

import { Info } from 'lucide-react';
import { useState } from 'react';

interface InfoIconProps {
  content: string;
  className?: string;
}

export function InfoIcon({ content, className = '' }: InfoIconProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Extract size classes from className if provided, otherwise use default
  const hasSizeClass = className.includes('h-') || className.includes('w-');
  const iconSizeClass = hasSizeClass ? '' : 'h-4 w-4';

  return (
    <div className="relative inline-block">
      <button
        type="button"
        className="inline-flex items-center justify-center"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        aria-label="Information"
      >
        <Info className={`${iconSizeClass} ${className} text-muted-foreground hover:text-foreground transition-colors cursor-help`} />
      </button>
      {showTooltip && (
        <div className="absolute z-50 left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-72 p-3 text-xs text-popover-foreground bg-popover border border-border rounded-md shadow-lg">
          <p className="leading-relaxed">{content}</p>
          <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-popover"></div>
        </div>
      )}
    </div>
  );
}

