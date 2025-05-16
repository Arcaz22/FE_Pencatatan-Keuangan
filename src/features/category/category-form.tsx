import { Form, Input } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CategoryFormValues } from '@/types/api';

const schema = z.object({
  name: z.string().min(1, 'Nama kategori harus diisi'),
  description: z.string().optional()
}) satisfies z.ZodType<CategoryFormValues>;

type CategoryFormProps = {
  onSubmit: (values: CategoryFormValues) => Promise<void>;
  isLoading: boolean;
};

export const CategoryForm = ({ onSubmit, isLoading }: CategoryFormProps) => {
  return (
    <Form<CategoryFormValues> id="category-form" onSubmit={onSubmit} resolver={zodResolver(schema)}>
      {({ register, formState }) => (
        <>
          <Input
            label="Nama Kategori"
            error={formState.errors.name}
            registration={register('name')}
            disabled={isLoading}
          />
          <Input
            label="Keterangan"
            error={formState.errors.description}
            registration={register('description')}
            disabled={isLoading}
          />
        </>
      )}
    </Form>
  );
};
