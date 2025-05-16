import * as React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { paths } from '@/config/paths';
import { User } from '@/types/api';

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
};

const VALID_CREDENTIALS = {
  email: 'test@gmail.com',
  password: 'password'
};

const AuthContext = React.createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email: string, password: string) => {
    if (email === VALID_CREDENTIALS.email && password === VALID_CREDENTIALS.password) {
      const userData = {
        id: '1',
        email: VALID_CREDENTIALS.email,
        name: 'Test User'
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      throw new Error('Invalid email or password');
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = React.useMemo(
    () => ({
      user,
      login,
      logout,
      isAuthenticated: !!user
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={paths.auth.login.getHref(location.pathname)} replace />;
  }

  return <>{children}</>;
}
