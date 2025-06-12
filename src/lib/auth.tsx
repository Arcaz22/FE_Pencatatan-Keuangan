import {
  ReactNode,
  useEffect,
  useMemo,
  useState,
  createContext,
  useContext,
  useCallback
} from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { getUser, login as loginAction, logout as logoutAction } from '@/stores/slices/authSlice';
import { showNotification } from '@/stores/slices/notificationSlice';
import { paths } from '@/config/paths';
import { LoginInput, User } from '@/types/api';
import { getToken, removeToken } from '@/lib/api-client'; // Import helper functions
import { SkeletonLoader } from '@/components/ui/skeleton';

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (data: LoginInput) => Promise<{ user: User; token: string; message: string }>;
  logout: () => Promise<boolean>;
  isAuthenticated: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const { user, token, isLoading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const storedToken = getToken();

    if (storedToken) {
      if (!user || !token) {
        dispatch(getUser())
          .unwrap()
          .catch((error) => {
            removeToken();
            console.error('Failed to get user:', error);
          });
      }
    }
  }, [dispatch, user, token]);

  useEffect(() => {
    if (error) {
      dispatch(
        showNotification({
          message: error,
          type: 'error'
        })
      );
    }
  }, [error, dispatch]);

  const login = useCallback(
    async (data: LoginInput) => {
      try {
        const result = await dispatch(loginAction(data)).unwrap();

        dispatch(
          showNotification({
            message: result.message,
            type: 'success'
          })
        );

        return result;
      } catch (err) {
        const errorMessage = typeof err === 'string' ? err : 'Login gagal';
        throw new Error(errorMessage);
      }
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    try {
      await dispatch(logoutAction()).unwrap();

      dispatch(
        showNotification({
          message: 'Berhasil logout',
          type: 'success'
        })
      );

      return true;
    } catch (err) {
      console.error('Logout error:', err);

      dispatch(
        showNotification({
          message: 'Gagal logout, silakan coba lagi',
          type: 'error'
        })
      );

      return false;
    }
  }, [dispatch]);

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
      isAuthenticated: !!token,
      isLoading
    }),
    [user, token, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading || showLoader) {
    return <SkeletonLoader />;
  }

  if (!isAuthenticated) {
    const redirectPath = `${paths.auth.login.path}?redirectTo=${encodeURIComponent(location.pathname)}`;
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}
