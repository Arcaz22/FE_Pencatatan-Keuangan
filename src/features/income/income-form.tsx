import { Form, Input, Select, Textarea } from '@/components/ui/form';
import { incomeCategories } from '@/lib/mock-data';
import { formatCurrency } from '@/utils/currency-utils';

type IncomeFormValues = {
  amount: number;
  description: string;
  category: string;
  date: string;
};

type IncomeFormProps = {
  id?: string;
  onSubmit: (values: IncomeFormValues) => void;
  isLoading?: boolean;
  defaultValues?: IncomeFormValues;
};

export const IncomeForm = ({ onSubmit, id = 'income-form', defaultValues }: IncomeFormProps) => {
  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');

    if (numericValue) {
      e.target.value = formatCurrency(Number(numericValue));
    }
  };

  return (
    <Form<IncomeFormValues>
      onSubmit={onSubmit}
      id={id}
      options={{
        defaultValues: defaultValues
      }}
      resolver={undefined}
    >
      {({ register, formState: { errors } }) => (
        <div className="space-y-4">
          <Input
            label="Jumlah"
            type="text"
            error={errors.amount}
            registration={register('amount', {
              required: 'Jumlah wajib diisi',
              min: {
                value: 1,
                message: 'Jumlah harus lebih dari 0'
              },
              setValueAs: (value: string) => Number(value.replace(/[^0-9]/g, ''))
            })}
            onChange={handleNumberInput}
          />
          <Select
            label="Kategori"
            options={incomeCategories}
            error={errors.category}
            registration={register('category', {
              required: 'Kategori wajib diisi'
            })}
          />
          <Input
            label="Tanggal"
            type="date"
            error={errors.date}
            registration={register('date', {
              required: 'Tanggal wajib diisi'
            })}
          />
          <Textarea
            label="Keterangan"
            error={errors.description}
            registration={register('description', {
              required: 'Keterangan wajib diisi'
            })}
          />
        </div>
      )}
    </Form>
  );
};
