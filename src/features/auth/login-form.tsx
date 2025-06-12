import { Button } from '@/components/ui/button';
import { Form, Input } from '@/components/ui/form';
import { LoginInput } from '@/types/api';

type LoginFormProps = {
  onSubmit: (values: LoginInput) => Promise<void>;
  isLoading?: boolean;
};

export const LoginForm = ({ onSubmit, isLoading }: LoginFormProps) => {
  const handleSubmit = (values: LoginInput) => {
    return onSubmit(values);
  };

  return (
    <Form<LoginInput> onSubmit={handleSubmit}>
      {({ register, formState: { errors } }) => (
        <div className="space-y-4">
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
              required: 'Password wajib diisi'
            })}
          />

          <Button type="submit" className="w-full mt-6" isLoading={isLoading} disabled={isLoading}>
            Masuk
          </Button>
        </div>
      )}
    </Form>
  );
};
