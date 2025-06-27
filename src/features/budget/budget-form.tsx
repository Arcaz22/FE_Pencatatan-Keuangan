import { useEffect, useState } from 'react';
import { Form, Input, Select } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatCurrency } from '@/utils/currency-utils';
import { BudgetFormValues } from '@/types/api';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import {
  fetchCategories,
  selectCategories,
  selectCategoryLoading
} from '@/stores/slices/categorySlice';

const schema = z.object({
  amount: z.number().min(1, 'Jumlah wajib diisi'),
  category: z.string().min(1, 'Kategori wajib diisi'),
  effective_from: z.string().min(1, 'Tanggal mulai wajib diisi'),
  effective_to: z.string().min(1, 'Tanggal berakhir wajib diisi'),
  is_active: z.boolean().optional().default(true)
});

type BudgetFormProps = {
  onSubmit: (values: BudgetFormValues) => void;
  isLoading?: boolean;
  initialValues?: Partial<BudgetFormValues>;
  id?: string;
};

export const BudgetForm = ({
  onSubmit,
  isLoading = false,
  initialValues,
  id = 'budget-form'
}: BudgetFormProps) => {
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

  const handleSubmit = async (values: BudgetFormValues) => {
    const formattedValues: BudgetFormValues = {
      ...values,
      is_active: true,
      amount: Number(values.amount.toString().replace(/[^0-9]/g, '')),
      effective_from: new Date(values.effective_from).toISOString(),
      effective_to: new Date(values.effective_to).toISOString()
    };

    await onSubmit(formattedValues);
  };

  return (
    <Form<BudgetFormValues> id={id} onSubmit={handleSubmit} resolver={zodResolver(schema)}>
      {({ register, formState }) => (
        <>
          <Input
            label="Jumlah"
            type="text"
            error={formState.errors.amount}
            registration={register('amount', {
              setValueAs: (value) => {
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
            label="Tanggal Mulai"
            type="date"
            error={formState.errors.effective_from}
            registration={register('effective_from', {
              value: initialValues?.effective_from
                ? new Date(initialValues.effective_from).toISOString().split('T')[0]
                : ''
            })}
            disabled={isLoading}
          />
          <Input
            label="Tanggal Berakhir"
            type="date"
            error={formState.errors.effective_to}
            registration={register('effective_to', {
              value: initialValues?.effective_to
                ? new Date(initialValues.effective_to).toISOString().split('T')[0]
                : ''
            })}
            disabled={isLoading}
          />
          {/* <RadioGroup
            label="Status"
            options={[
              { label: 'Aktif', value: 'true' },
              { label: 'Tidak Aktif', value: 'false' }
            ]}
            error={formState.errors.is_active}
            registration={register('is_active', {
              setValueAs: (v) => v === 'true',
              required: true
            })}
            defaultValue={(initialValues?.is_active ?? true) ? 'true' : 'false'}
            disabled={isLoading}
          /> */}
        </>
      )}
    </Form>
  );
};
