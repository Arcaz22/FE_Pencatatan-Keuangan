import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { login } from '@/stores/slices/authSlice';
import { showNotification } from '@/stores/slices/notificationSlice';
import { LoginForm } from '@/features/auth/login-form';
import { AuthLayout } from '@/components/layout/auth-layout';
import { paths } from '@/config/paths';
import type { LoginInput } from '@/types/api';

export const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? paths.app.dashboard.path;

  const handleSubmit = async (values: LoginInput) => {
    try {
      const result = await dispatch(login(values)).unwrap();
      dispatch(
        showNotification({
          message: result.message,
          type: 'success'
        })
      );
      navigate(redirectTo);
    } catch (error) {
      dispatch(
        showNotification({
          message: error as string,
          type: 'error'
        })
      );
    }
  };

  return (
    <AuthLayout
      title="Selamat Datang Kembali"
      subtitle="Masuk untuk melanjutkan"
      linkText="Belum punya akun? Daftar disini"
      linkHref={paths.auth.signup.path}
    >
      <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />
    </AuthLayout>
  );
};

export default LoginPage;
