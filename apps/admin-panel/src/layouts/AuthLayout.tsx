import type { ReactNode } from 'react';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,5fr)_minmax(0,4fr)]">
      <div className="hidden flex-col justify-between bg-brand-950 p-12 text-brand-100 lg:flex">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-lg bg-brand-500 font-bold text-white">
            C
          </span>
          <span className="text-lg font-semibold text-white">Console</span>
        </div>
        <div className="max-w-md">
          <h1 className="text-3xl font-semibold leading-tight text-white">
            Manage accounts and access in one place.
          </h1>
          <p className="mt-4 text-brand-200">
            Create users, adjust roles and keep an eye on who can sign in.
          </p>
        </div>
        <p className="text-sm text-brand-300">Admin Panel</p>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
