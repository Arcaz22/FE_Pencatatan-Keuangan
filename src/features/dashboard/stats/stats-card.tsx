import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/utils/currency-utils';
import { LucideIcon } from 'lucide-react';

type StatsCardProps = {
  title: string;
  amount: number;
  icon: LucideIcon;
  variant: 'success' | 'danger' | 'primary';
};

export const StatsCard = ({ title, amount, icon: Icon, variant }: StatsCardProps) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return {
          text: 'text-[hsl(var(--bg-success))]',
          bg: 'bg-[hsl(var(--bg-success))]/20'
        };
      case 'danger':
        return {
          text: 'text-[hsl(var(--bg-destructive))]',
          bg: 'bg-[hsl(var(--bg-destructive))]/20'
        };
      default:
        return {
          text: 'text-[hsl(var(--bg-primary))]',
          bg: 'bg-[hsl(var(--bg-primary))]/20'
        };
    }
  };

  const variantClasses = getVariantClasses();

  return (
    <Card className="p-6 shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[hsl(var(--text-secondary))]">{title}</p>
          <h3 className={`text-2xl font-bold ${variantClasses.text}`}>{formatCurrency(amount)}</h3>
        </div>
        <div className={`rounded-full ${variantClasses.bg} p-3`}>
          <Icon className={`size-5 ${variantClasses.text}`} />
        </div>
      </div>
    </Card>
  );
};
