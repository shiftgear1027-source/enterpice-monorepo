import { BrowserRouter } from 'react-router';
import { useAuthBootstrap } from '@company/shared-auth';
import { ToastProvider } from '@company/shared-ui';
import { AppRoutes } from '../routes/AppRoutes';

export function App() {
  useAuthBootstrap();
  return (
    <ToastProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ToastProvider>
  );
}
