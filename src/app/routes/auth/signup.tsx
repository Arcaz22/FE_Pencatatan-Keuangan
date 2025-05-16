import { AuthLayout } from '@/components/layout/auth-layout';
import { paths } from '@/config/paths';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { SignUpForm } from '@/features/auth/signup-form';

type SignUpValues = {
  email: string;
  password: string;
};

export const SignUpPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? paths.app.dashboard.path;

  const handleSubmit = async (values: SignUpValues) => {
    await login(values.email, values.password);
    navigate(redirectTo);
  };

  return (
    <AuthLayout
      title="Buat Akun Baru"
      subtitle="Daftar untuk mulai mengelola keuangan Anda"
      linkText="Sudah punya akun? Masuk disini"
      linkHref="/login"
    >
      <SignUpForm onSubmit={handleSubmit} />
    </AuthLayout>
  );
};

export default SignUpPage;
