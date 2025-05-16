import { Form, Input, Select, Textarea } from '@/components/ui/form';
import { expenseCategories } from '@/lib/mock-data';
import { formatCurrency } from '@/utils/currency-utils';

type ExpenseFormValues = {
  amount: number;
  description: string;
  category: string;
  date: string;
};

type ExpenseFormProps = {
  id?: string;
  onSubmit: (values: ExpenseFormValues) => void;
  isLoading?: boolean;
  defaultValues?: ExpenseFormValues;
};

export const ExpenseForm = ({ onSubmit, id = 'expense-form', defaultValues }: ExpenseFormProps) => {
  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');

    if (numericValue) {
      e.target.value = formatCurrency(Number(numericValue));
    }
  };
  return (
    <Form<ExpenseFormValues>
      onSubmit={onSubmit}
      id={id}
      options={{
        defaultValues: defaultValues
      }}
      resolver={undefined}
    >
      {({ register, formState: { errors } }) => (
        <>
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
              setValueAs: (value: string) => {
                return Number(value.replace(/[^0-9]/g, ''));
              }
            })}
            onChange={handleNumberInput}
          />
          <Select
            label="Kategori"
            options={expenseCategories}
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
        </>
      )}
    </Form>
  );
};
