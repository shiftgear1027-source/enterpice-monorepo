import { useId, type ComponentProps } from 'react';
import { cn } from '../utils';

export interface CheckboxProps extends Omit<ComponentProps<'input'>, 'type'> {
  label: string;
  description?: string;
}

export function Checkbox({ label, description, id, className, ...rest }: CheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <div className="flex items-start gap-3">
      <input
        id={inputId}
        type="checkbox"
        className={cn('mt-0.5 size-4 rounded border-slate-300 accent-brand-600', className)}
        {...rest}
      />
      <label htmlFor={inputId} className="text-sm">
        <span className="font-medium text-slate-800">{label}</span>
        {description && <span className="block text-slate-500">{description}</span>}
      </label>
    </div>
  );
}
