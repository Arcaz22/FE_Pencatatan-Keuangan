import { paths } from '@/config/paths';
import { ProtectedRoute } from '@/lib/auth';
import { createBrowserRouter, Navigate, useParams } from 'react-router-dom';
import { DashboardPage } from './routes/app/dashboard';
import { RouterErrorBoundary } from '@/components/errors/error-boundary';
import { CategoryType } from '@/types/api';

export const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <RouterErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to={paths.auth.login.path} replace />
      },
      {
        path: paths.auth.signup.path,
        lazy: async () => {
          const { SignUpPage } = await import('./routes/auth/signup');
          return {
            element: <SignUpPage />
          };
        }
      },
      {
        path: paths.auth.login.path,
        lazy: async () => {
          const { LoginPage } = await import('./routes/auth/login');
          return {
            element: <LoginPage />
          };
        }
      },
      {
        path: paths.app.dashboard.path,
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        )
      },
      {
        path: `${paths.app.income.path}`,
        lazy: async () => {
          const { IncomePage } = await import('./routes/app/income/page');
          return {
            element: (
              <ProtectedRoute>
                <IncomePage />
              </ProtectedRoute>
            )
          };
        }
      },
      {
        path: `${paths.app.expense.path}`,
        lazy: async () => {
          const { ExpensePage } = await import('./routes/app/expense/page');
          return {
            element: (
              <ProtectedRoute>
                <ExpensePage />
              </ProtectedRoute>
            )
          };
        }
      },
      {
        path: '/category/:type',
        lazy: async () => {
          const { CategoryRoute } = await import('./routes/app/category');
          return {
            Component: () => {
              const { type } = useParams();
              return (
                <ProtectedRoute>
                  <CategoryRoute type={type as CategoryType} />
                </ProtectedRoute>
              );
            }
          };
        }
      },
      {
        path: 'budget',
        children: [
          {
            index: true,
            async lazy() {
              const { BudgetPage } = await import('./routes/app/budget/budget');
              return {
                element: (
                  <ProtectedRoute>
                    <BudgetPage />
                  </ProtectedRoute>
                )
              };
            }
          }
        ]
      }
    ]
  }
]);
