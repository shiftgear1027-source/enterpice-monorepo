import { NavLink } from 'react-router';
import { ADMIN_ROUTES } from '@company/shared-config';
import { cn } from '@company/shared-ui';
import { useUiStore } from '../app/uiStore';
import { DashboardIcon, ProfileIcon, SettingsIcon, UsersIcon } from './icons';

const navItems = [
  { to: ADMIN_ROUTES.dashboard, label: 'Dashboard', icon: <DashboardIcon /> },
  { to: ADMIN_ROUTES.users, label: 'Users', icon: <UsersIcon /> },
  { to: ADMIN_ROUTES.profile, label: 'Profile', icon: <ProfileIcon /> },
  { to: ADMIN_ROUTES.settings, label: 'Settings', icon: <SettingsIcon /> },
];

export function Sidebar() {
  const open = useUiStore((state) => state.sidebarOpen);
  const setOpen = useUiStore((state) => state.setSidebarOpen);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-brand-950 text-brand-100 transition-transform lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center gap-3 px-6">
          <span className="grid size-8 place-items-center rounded-lg bg-brand-500 text-sm font-bold text-white">
            C
          </span>
          <span className="text-base font-semibold text-white">Console</span>
        </div>
        <nav aria-label="Main" className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-brand-200 hover:bg-white/5 hover:text-white',
                )
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
        <p className="px-6 py-4 text-xs text-brand-300">Admin Panel · v1.0</p>
      </aside>
    </>
  );
}
