import { Link as RouterLink, LinkProps } from 'react-router';
import { cn } from '@/utils/cn';

export const Link = ({ className, children, ...props }: LinkProps) => {
  return (
    <RouterLink
      className={cn(
        'text-[hsl(var(--text-primary))] hover:text-[hsl(var(--text-primary))]/80',
        className
      )}
      {...props}
    >
      {children}
    </RouterLink>
  );
};
