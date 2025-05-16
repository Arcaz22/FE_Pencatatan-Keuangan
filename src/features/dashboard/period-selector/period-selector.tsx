import { getMonthName } from '@/utils/date-utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type PeriodSelectorProps = {
  currentMonth: number;
  currentYear: number;
  onPrevious: () => void;
  onNext: () => void;
};

export const PeriodSelector = ({
  currentMonth,
  currentYear,
  onPrevious,
  onNext
}: PeriodSelectorProps) => {
  return (
    <div className="flex items-center space-x-2">
      <button onClick={onPrevious} className="p-2 rounded-md hover:bg-[hsl(var(--bg-secondary))]">
        <ChevronLeft className="size-5 text-[hsl(var(--text-secondary))]" />
      </button>
      <span className="font-medium text-[hsl(var(--text-primary))]">
        {getMonthName(currentMonth)} {currentYear}
      </span>
      <button onClick={onNext} className="p-2 rounded-md hover:bg-[hsl(var(--bg-secondary))]">
        <ChevronRight className="size-5 text-[hsl(var(--text-secondary))]" />
      </button>
    </div>
  );
};
