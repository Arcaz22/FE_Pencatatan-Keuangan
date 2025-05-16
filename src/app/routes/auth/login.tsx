import { AuthLayout } from '@/components/layout/auth-layout';
import { LoginForm } from '../../../features/auth/login-form';
import { paths } from '@/config/paths';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { useState } from 'react';

type LoginValues = {
  email: string;
  password: string;
};

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? paths.app.dashboard.path;

  const handleSubmit = async (values: LoginValues) => {
    try {
      setIsLoading(true);
      setError('');
      await login(values.email, values.password);
      navigate(redirectTo);
    } catch {
      setError('Email atau password salah');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Selamat Datang Kembali"
      subtitle="Masuk untuk melanjutkan"
      linkText="Belum punya akun? Daftar disini"
      linkHref="/signup"
    >
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
      <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />
    </AuthLayout>
  );
};

export default LoginPage;
