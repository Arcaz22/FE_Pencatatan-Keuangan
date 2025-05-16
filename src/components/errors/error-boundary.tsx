import NotFoundRoute from '@/app/routes/not-found';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { MainErrorFallback } from './main';

export const RouterErrorBoundary = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <NotFoundRoute />;
    }
  }

  return <MainErrorFallback />;
};
