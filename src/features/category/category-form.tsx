import { Form, Input } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CategoryFormValues, CategoryType } from '@/types/api';

const schema = z.object({
  name: z.string().min(1, 'Nama kategori harus diisi'),
  description: z.string().min(1, 'Keterangan harus diisi'),
  type: z.enum(['income', 'expense']).optional()
}) satisfies z.ZodType<Omit<CategoryFormValues, 'type'> & { type?: CategoryType }>;

type CategoryFormProps = {
  onSubmit: (values: CategoryFormValues) => Promise<void>;
  isLoading: boolean;
  defaultType?: CategoryType;
  initialValues?: Partial<CategoryFormValues>;
  id?: string;
};

export const CategoryForm = ({
  onSubmit,
  isLoading,
  defaultType = 'income',
  initialValues,
  id = 'category-form'
}: CategoryFormProps) => {
  const handleSubmit = async (
    values: Omit<CategoryFormValues, 'type'> & { type?: CategoryType }
  ) => {
    const completeValues: CategoryFormValues = {
      ...values,
      type: values.type || defaultType
    };

    await onSubmit(completeValues);
  };

  return (
    <Form<Omit<CategoryFormValues, 'type'> & { type?: CategoryType }>
      id={id}
      onSubmit={handleSubmit}
      resolver={zodResolver(schema)}
    >
      {({ register, formState }) => (
        <>
          <Input
            label="Nama Kategori"
            error={formState.errors.name}
            registration={register('name', {
              value: initialValues?.name || ''
            })}
            disabled={isLoading}
          />
          <Input
            label="Keterangan"
            error={formState.errors.description}
            registration={register('description', {
              value: initialValues?.description || ''
            })}
            disabled={isLoading}
          />
        </>
      )}
    </Form>
  );
};
