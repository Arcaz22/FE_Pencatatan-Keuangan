import { Button } from '@/components/ui/button';
import { Form, Input } from '@/components/ui/form';
import { RegisterInput } from '@/types/api';

type SignUpValues = {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
};

type SignUpFormProps = {
  onSubmit: (values: RegisterInput) => Promise<void>;
  isLoading?: boolean;
};

export const SignUpForm = ({ onSubmit, isLoading }: SignUpFormProps) => {
  const handleSubmit = (values: SignUpValues) => {
    return onSubmit(values);
  };

  return (
    <Form<SignUpValues> onSubmit={handleSubmit}>
      {({ register, formState: { errors }, watch }) => (
        <div className="space-y-4">
          <Input
            label="Nama"
            type="text"
            error={errors.name}
            registration={register('name', {
              required: 'Nama wajib diisi'
            })}
          />

          <Input
            label="Email"
            type="email"
            error={errors.email}
            registration={register('email', {
              required: 'Email wajib diisi'
            })}
          />

          <Input
            label="Password"
            type="password"
            error={errors.password}
            registration={register('password', {
              required: 'Password wajib diisi',
              minLength: {
                value: 8,
                message: 'Password minimal 8 karakter'
              }
            })}
          />

          <Input
            label="Konfirmasi Password"
            type="password"
            error={errors.confirm_password}
            registration={register('confirm_password', {
              required: 'Konfirmasi password wajib diisi',
              validate: (value) => value === watch('password') || 'Password tidak cocok'
            })}
          />

          <Button type="submit" className="w-full mt-6" isLoading={isLoading} disabled={isLoading}>
            Daftar
          </Button>
        </div>
      )}
    </Form>
  );
};
