import * as React from 'react';
import { cn } from '@/utils/cn';

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border border-[hsl(var(--border-input))] bg-[hsl(var(--bg-base))]',
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

export { Card };
