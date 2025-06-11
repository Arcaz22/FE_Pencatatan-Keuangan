import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AuthProvider } from '@/lib/auth';
import { GlobalNotification } from '@/components/ui/notification';

function App() {
  return (
    <>
      <GlobalNotification />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  );
}

export default App;
