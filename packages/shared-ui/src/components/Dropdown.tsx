import { useState, type ReactNode } from 'react';
import { useOutsideClick } from '@company/shared-hooks';
import { cn } from '../utils';

export interface DropdownItem {
  label: string;
  onSelect: () => void;
  danger?: boolean;
  disabled?: boolean;
}

export interface DropdownProps {
  trigger: ReactNode;
  items: readonly DropdownItem[];
  align?: 'left' | 'right';
  /** Accessible name for the trigger button. */
  label: string;
}

export function Dropdown({ trigger, items, align = 'right', label }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClick<HTMLDivElement>(() => setOpen(false), open);

  return (
    <div
      ref={ref}
      className="relative inline-block"
      onKeyDown={(event) => {
        if (event.key === 'Escape') setOpen(false);
      }}
    >
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
      >
        {trigger}
      </button>
      {open && (
        <ul
          role="menu"
          className={cn(
            'absolute z-40 mt-2 min-w-44 rounded-lg border border-slate-200 bg-white py-1 shadow-lg',
            align === 'right' ? 'right-0' : 'left-0',
          )}
        >
          {items.map((item) => (
            <li key={item.label} role="none">
              <button
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  setOpen(false);
                  item.onSelect();
                }}
                className={cn(
                  'block w-full px-4 py-2 text-left text-sm hover:bg-slate-50 disabled:opacity-50',
                  item.danger ? 'text-red-600' : 'text-slate-700',
                )}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
