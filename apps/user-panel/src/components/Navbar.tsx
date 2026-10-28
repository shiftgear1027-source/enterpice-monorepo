import { NavLink, useNavigate } from 'react-router';
import { useAuth } from '@company/shared-auth';
import { USER_ROUTES } from '@company/shared-config';
import { cn, Dropdown } from '@company/shared-ui';
import { getInitials } from '@company/shared-utils';
import { useToggle } from '@company/shared-hooks';

const links = [
  { to: USER_ROUTES.dashboard, label: 'Home' },
  { to: USER_ROUTES.products, label: 'Products' },
  { to: USER_ROUTES.profile, label: 'Profile' },
  { to: USER_ROUTES.settings, label: 'Account' },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-brand-50 text-brand-800'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  );

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const menu = useToggle(false);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <span className="text-lg font-semibold tracking-tight text-brand-800">Shopfront</span>
          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Dropdown
            label="Account menu"
            trigger={
              <span className="grid size-9 place-items-center rounded-full bg-brand-100 text-xs font-semibold text-brand-800">
                {getInitials(user?.name ?? '')}
              </span>
            }
            items={[
              { label: 'Profile', onSelect: () => navigate(USER_ROUTES.profile) },
              {
                label: 'Sign out',
                danger: true,
                onSelect: () => {
                  void logout().then(() => navigate(USER_ROUTES.login));
                },
              },
            ]}
          />
          <button
            type="button"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            aria-label="Toggle navigation"
            aria-expanded={menu.on}
            onClick={menu.toggle}
          >
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d={menu.on ? 'M6 6l12 12M18 6L6 18' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
      </div>
      {menu.on && (
        <nav
          aria-label="Mobile"
          className="flex flex-col gap-1 border-t border-slate-200 p-3 md:hidden"
        >
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} onClick={menu.setFalse}>
              {l.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
