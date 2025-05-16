import { Button } from '@/components/ui/button';
import { Form, Input } from '@/components/ui/form';

type LoginValues = {
  email: string;
  password: string;
};

type LoginFormProps = {
  onSubmit: (values: LoginValues) => void;
  isLoading?: boolean;
};

export const LoginForm = ({ onSubmit, isLoading }: LoginFormProps) => {
  return (
    <Form<LoginValues> onSubmit={onSubmit}>
      {({ register, formState: { errors } }) => (
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
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Masuk
          </Button>
        </>
      )}
    </Form>
  );
};
