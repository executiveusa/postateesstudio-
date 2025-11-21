import React from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  return (
    <div className="relative group/tooltip flex items-center">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-brand-bg border border-surface-border text-text-primary text-xs rounded-md shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-300 pointer-events-none z-10 whitespace-nowrap">
        {content}
      </div>
    </div>
  );
};
