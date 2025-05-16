import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/utils/cn';

import { Spinner } from '../spinner';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[hsl(var(--ring))] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-[hsl(var(--bg-primary))] text-[hsl(var(--text-white))] shadow hover:bg-[hsl(var(--bg-primary))]/90',
        destructive:
          'bg-[hsl(var(--bg-destructive))] text-[hsl(var(--text-white))] shadow-sm hover:bg-[hsl(var(--bg-destructive))]/90',
        outline:
          'border border-[hsl(var(--border-input))] bg-[hsl(var(--bg-base))] shadow-sm hover:bg-[hsl(var(--bg-secondary))] hover:text-[hsl(var(--text-primary))]',
        secondary:
          'bg-[hsl(var(--bg-secondary))] text-[hsl(var(--text-secondary))] shadow-sm hover:bg-[hsl(var(--bg-secondary))]/80',
        ghost: 'hover:bg-[hsl(var(--bg-secondary))] hover:text-[hsl(var(--text-secondary))]',
        link: 'text-[hsl(var(--text-primary))] underline-offset-4 hover:underline',
        success:
          'bg-[hsl(var(--bg-success))] text-[hsl(var(--text-white))] shadow hover:bg-[hsl(var(--bg-success))]/90',
        warning:
          'bg-[hsl(var(--bg-warning))] text-[hsl(var(--text-white))] shadow hover:bg-[hsl(var(--bg-warning))]/90',
        info: 'bg-[hsl(var(--bg-info))] text-[hsl(var(--text-white))] shadow hover:bg-[hsl(var(--bg-info))]/90'
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'size-9'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isLoading?: boolean;
    icon?: React.ReactNode;
    variant?:
      | 'default'
      | 'destructive'
      | 'outline'
      | 'secondary'
      | 'ghost'
      | 'link'
      | 'success'
      | 'warning'
      | 'info';
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, isLoading, icon, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
        {isLoading && <Spinner size="sm" className="text-current" />}
        {!isLoading && icon && <span className="mr-2">{icon}</span>}
        <span className="mx-2">{children}</span>
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
