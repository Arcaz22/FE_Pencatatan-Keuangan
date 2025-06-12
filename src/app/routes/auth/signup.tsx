import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { register } from '@/stores/slices/authSlice';
import { showNotification } from '@/stores/slices/notificationSlice';
import { SignUpForm } from '@/features/auth/signup-form';
import { AuthLayout } from '@/components/layout/auth-layout';
import { paths } from '@/config/paths';
import type { RegisterInput } from '@/types/api';

export const SignUpPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  const handleSubmit = async (values: RegisterInput) => {
    try {
      const result = await dispatch(register(values)).unwrap();
      dispatch(
        showNotification({
          message: result.message,
          type: 'success'
        })
      );
      navigate(paths.auth.login.path);
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
      title="Buat Akun Baru"
      subtitle="Daftar untuk mulai mengelola keuangan Anda"
      linkText="Sudah punya akun? Masuk disini"
      linkHref={paths.auth.login.path}
    >
      <SignUpForm onSubmit={handleSubmit} isLoading={isLoading} />
    </AuthLayout>
  );
};
