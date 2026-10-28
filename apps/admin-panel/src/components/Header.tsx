import { useNavigate } from 'react-router';
import { useAuth } from '@company/shared-auth';
import { ADMIN_ROUTES } from '@company/shared-config';
import { Dropdown } from '@company/shared-ui';
import { getInitials } from '@company/shared-utils';
import { useUiStore } from '../app/uiStore';
import { MenuIcon } from './icons';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-8">
      <button
        type="button"
        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open navigation"
      >
        <MenuIcon />
      </button>
      <div className="hidden lg:block" />
      <Dropdown
        label="Account menu"
        trigger={
          <span className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-slate-100">
            <span className="grid size-8 place-items-center rounded-full bg-brand-100 text-xs font-semibold text-brand-800">
              {getInitials(user?.name ?? '')}
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-medium leading-tight text-slate-900">
                {user?.name}
              </span>
              <span className="block text-xs text-slate-500">{user?.email}</span>
            </span>
          </span>
        }
        items={[
          { label: 'Profile', onSelect: () => navigate(ADMIN_ROUTES.profile) },
          { label: 'Settings', onSelect: () => navigate(ADMIN_ROUTES.settings) },
          {
            label: 'Sign out',
            danger: true,
            onSelect: () => {
              void logout().then(() => navigate(ADMIN_ROUTES.login));
            },
          },
        ]}
      />
    </header>
  );
}
