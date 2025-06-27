import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cn } from '@/utils/cn';
import { FormItem, FormControl, FormLabel, FormMessage } from './form';
import { forwardRef } from 'react';

type RadioOption = {
  label: string;
  value: string;
};

type FormEvent = {
  target: {
    name?: string;
    value?: string;
  };
};

type RadioGroupProps = {
  label?: React.ReactNode;
  error?: { message?: string };
  options: RadioOption[];
  defaultValue?: string;
  value?: string; // Add controlled value prop
  registration?: {
    name?: string;
    onChange?: (e: { target: { name?: string; value: string } }) => void;
    onBlur?: (e: FormEvent) => void;
    ref?: React.Ref<HTMLInputElement>;
    [key: string]: unknown;
  };
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  disabled?: boolean;
};

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({
    label,
    error,
    registration,
    options,
    defaultValue,
    value,
    orientation = 'horizontal',
    className,
    disabled
  }, ref) => {
    const { name, onChange, onBlur, ...registrationRest } = registration || {};

    // Use controlled value if provided, otherwise fall back to defaultValue
    const currentValue = value !== undefined ? value : defaultValue;

    const handleValueChange = (newValue: string) => {
      if (onChange) {
        onChange({
          target: { name, value: newValue }
        });
      }
    };

    const handleBlur = () => {
      if (onBlur) {
        onBlur({
          target: { name, value: currentValue }
        });
      }
    };

    return (
      <FormItem className={className} ref={ref}>
        {label && <FormLabel>{label}</FormLabel>}
        <FormControl>
          <RadioGroupPrimitive.Root
            className={cn('flex gap-4', orientation === 'vertical' && 'flex-col')}
            value={currentValue} // Use value instead of defaultValue for controlled component
            defaultValue={value === undefined ? defaultValue : undefined} // Only use defaultValue when uncontrolled
            name={name}
            onValueChange={handleValueChange}
            onBlur={handleBlur}
            disabled={disabled}
            {...registrationRest}
          >
            {options.map((option: RadioOption) => (
              <div key={option.value} className="flex items-center gap-2">
                <RadioGroupPrimitive.Item
                  id={`radio-${name}-${option.value}`}
                  value={option.value}
                  className={cn(
                    'h-4 w-4 rounded-full border border-[hsl(var(--border-input))] bg-[hsl(var(--bg-base))] text-[hsl(var(--text-primary))] focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2',
                    'data-[state=checked]:border-[hsl(var(--bg-primary))] data-[state=checked]:bg-[hsl(var(--bg-base))]',
                    disabled && 'opacity-50 cursor-not-allowed'
                  )}
                  aria-label={option.label}
                  disabled={disabled}
                >
                  <RadioGroupPrimitive.Indicator className="flex h-full w-full items-center justify-center after:block after:h-2 after:w-2 after:rounded-full after:bg-[hsl(var(--bg-primary))]" />
                </RadioGroupPrimitive.Item>
                <label
                  htmlFor={`radio-${name}-${option.value}`}
                  className={cn(
                    'text-sm font-medium text-[hsl(var(--text-primary))] cursor-pointer select-none',
                    disabled && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {option.label}
                </label>
              </div>
            ))}
          </RadioGroupPrimitive.Root>
        </FormControl>
        {error?.message && <FormMessage>{error.message}</FormMessage>}
      </FormItem>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';
