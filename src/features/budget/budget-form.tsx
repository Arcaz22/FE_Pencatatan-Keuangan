import { Form, Input, Select } from '@/components/ui/form';
import { expenseCategories } from '@/lib/mock-data';
import { formatCurrency } from '@/utils/currency-utils';

type BudgetFormValues = {
  amount: number;
  category: string;
  month: string;
  year: string;
};

type BudgetFormProps = {
  onSubmit: (values: BudgetFormValues) => void;
  isLoading?: boolean;
};

export const BudgetForm = ({ onSubmit }: BudgetFormProps) => {
  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');

    if (numericValue) {
      e.target.value = formatCurrency(Number(numericValue));
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => ({
    label: new Date(0, i).toLocaleString('id-ID', { month: 'long' }),
    value: String(i + 1)
  }));

  return (
    <Form<BudgetFormValues> onSubmit={onSubmit}>
      {({ register, formState: { errors } }) => (
        <>
          <Select
            label="Kategori"
            options={expenseCategories}
            error={errors.category}
            registration={register('category', {
              required: 'Kategori wajib diisi'
            })}
          />
          <Input
            label="Batas Anggaran"
            type="text"
            error={errors.amount}
            registration={register('amount', {
              required: 'Jumlah wajib diisi',
              min: {
                value: 1,
                message: 'Jumlah harus lebih dari 0'
              },
              setValueAs: (value: string) => {
                return Number(value.replace(/[^0-9]/g, ''));
              }
            })}
            onChange={handleNumberInput}
          />
          <Select
            label="Bulan"
            options={months}
            error={errors.month}
            registration={register('month', {
              required: 'Bulan wajib diisi'
            })}
          />
          <Select
            label="Tahun"
            options={years.map((year) => ({ label: String(year), value: String(year) }))}
            error={errors.year}
            registration={register('year', {
              required: 'Tahun wajib diisi'
            })}
          />
        </>
      )}
    </Form>
  );
};
