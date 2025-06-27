import { useEffect, useState } from 'react';
import { Form, Input, Select, Textarea } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatCurrency } from '@/utils/currency-utils';
import { ExpenseFormValues } from '@/types/api';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import {
  fetchCategories,
  selectCategories,
  selectCategoryLoading
} from '@/stores/slices/categorySlice';

const schema = z.object({
  amount: z.number().min(1, 'Jumlah wajib diisi'),
  description: z.string().min(1, 'Keterangan wajib diisi'),
  category: z.string().min(1, 'Kategori wajib diisi'),
  date: z.string().min(1, 'Tanggal wajib diisi')
});

type ExpenseFormProps = {
  onSubmit: (values: ExpenseFormValues) => void;
  isLoading?: boolean;
  initialValues?: Partial<ExpenseFormValues>;
  id?: string;
};

export const ExpenseForm = ({
  onSubmit,
  isLoading = false,
  initialValues,
  id = 'expense-form'
}: ExpenseFormProps) => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  const categoriesLoading = useAppSelector(selectCategoryLoading);
  const [expenseCategories, setExpenseCategories] = useState<{ label: string; value: string }[]>(
    []
  );
  const [formattedAmount, setFormattedAmount] = useState<string>('');

  useEffect(() => {
    dispatch(
      fetchCategories({
        type: 'expense',
        limit: 100
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (initialValues?.amount) {
      setFormattedAmount(formatCurrency(initialValues.amount));
    }
  }, [initialValues?.amount]);

  useEffect(() => {
    if (categories.length > 0) {
      const formattedCategories = categories.map((category) => ({
        label: category.name,
        value: category.id
      }));

      if (!initialValues?.category && !initialValues?.category_id) {
        formattedCategories.unshift({ label: 'Pilih kategori', value: '' });
      }

      setExpenseCategories(formattedCategories);
    }
  }, [categories, initialValues?.category, initialValues?.category_id]);

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');

    if (numericValue) {
      const formatted = formatCurrency(Number(numericValue));
      setFormattedAmount(formatted);
      e.target.value = formatted;
    } else {
      setFormattedAmount('');
      e.target.value = '';
    }
  };

  const handleSubmit = async (values: ExpenseFormValues) => {
    const formattedValues: ExpenseFormValues = {
      ...values,
      amount: Number(values.amount.toString().replace(/[^0-9]/g, '')),
      date: new Date(values.date).toISOString()
    };

    await onSubmit(formattedValues);
  };

  return (
    <Form<ExpenseFormValues> id={id} onSubmit={handleSubmit} resolver={zodResolver(schema)}>
      {({ register, formState }) => (
        <>
          <Input
            label="Jumlah"
            type="text"
            error={formState.errors.amount}
            registration={register('amount', {
              setValueAs: (value: string) => {
                return Number(value.replace(/[^\d]/g, ''));
              },
              required: 'Jumlah wajib diisi',
              min: {
                value: 1,
                message: 'Jumlah harus lebih dari 0'
              }
            })}
            onChange={handleNumberInput}
            disabled={isLoading}
            value={formattedAmount}
          />
          <Select
            label="Kategori"
            options={expenseCategories}
            error={formState.errors.category}
            registration={register('category', {
              required: 'Kategori wajib diisi',
              value: initialValues?.category || ''
            })}
            disabled={isLoading || categoriesLoading}
            placeholder={categoriesLoading ? 'Memuat kategori...' : 'Pilih kategori'}
          />
          <Input
            label="Tanggal"
            type="date"
            error={formState.errors.date}
            registration={register('date', {
              value: initialValues?.date
                ? new Date(initialValues.date).toISOString().split('T')[0]
                : ''
            })}
            disabled={isLoading}
          />
          <Textarea
            label="Keterangan"
            error={formState.errors.description}
            registration={register('description', {
              required: 'Keterangan wajib diisi',
              value: initialValues?.description || ''
            })}
            disabled={isLoading}
          />
        </>
      )}
    </Form>
  );
};
