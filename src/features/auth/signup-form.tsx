import { Button } from '@/components/ui/button';
import { Form, Input } from '@/components/ui/form';

type SignUpValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

type SignUpFormProps = {
  onSubmit: (values: SignUpValues) => void;
  isLoading?: boolean;
};

export const SignUpForm = ({ onSubmit, isLoading }: SignUpFormProps) => {
  return (
    <Form<SignUpValues> onSubmit={onSubmit}>
      {({ register, formState: { errors }, watch }) => (
        <>
          <Input
            label="Email"
            type="email"
            error={errors.email}
            registration={register('email', {
              required: 'Email wajib diisi',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email tidak valid'
              }
            })}
          />
          <Input
            label="Password"
            type="password"
            error={errors.password}
            registration={register('password', {
              required: 'Password wajib diisi',
              minLength: {
                value: 6,
                message: 'Password minimal 6 karakter'
              }
            })}
          />
          <Input
            label="Konfirmasi Password"
            type="password"
            error={errors.confirmPassword}
            registration={register('confirmPassword', {
              required: 'Konfirmasi password wajib diisi',
              validate: (value) => value === watch('password') || 'Password tidak cocok'
            })}
          />
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Masuk
          </Button>
        </>
      )}
    </Form>
  );
};
