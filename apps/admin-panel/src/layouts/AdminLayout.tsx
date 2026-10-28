import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { useUiStore } from '../app/uiStore';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';

export function AdminLayout() {
  const { pathname } = useLocation();
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname, setSidebarOpen]);

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="lg:pl-64">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
