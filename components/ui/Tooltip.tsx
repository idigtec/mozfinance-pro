import React from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';

export const TooltipProvider = RadixTooltip.Provider;

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  delayDuration?: number;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  side = 'top',
  align = 'center',
  delayDuration = 150,
  className = '',
}) => {
  if (!content) {
    return <>{children}</>;
  }

  return (
    <RadixTooltip.Root delayDuration={delayDuration}>
      <RadixTooltip.Trigger asChild>
        {children}
      </RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side={side}
          align={align}
          sideOffset={5}
          className={`z-50 overflow-hidden rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 dark:bg-slate-800 dark:text-slate-100 dark:border dark:border-slate-700 pointer-events-none select-none ${className}`}
        >
          {content}
          <RadixTooltip.Arrow className="fill-slate-900 dark:fill-slate-800" />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
};
