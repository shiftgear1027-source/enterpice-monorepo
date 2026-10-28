import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toApiError } from '@company/shared-api';
import { Alert, Button, Input, Select } from '@company/shared-ui';
import { userFormSchema, type UserFormValues } from '@company/shared-validation';

const roleOptions = [
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
] as const;

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' },
] as const;

export interface UserFormProps {
  defaultValues?: Partial<UserFormValues>;
  submitLabel: string;
  onSubmit: (values: UserFormValues) => Promise<void>;
  onCancel: () => void;
}

export function UserForm({ defaultValues, submitLabel, onSubmit, onCancel }: UserFormProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: { name: '', email: '', role: 'user', status: 'active', ...defaultValues },
  });

  const submit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await onSubmit(values);
    } catch (error) {
      const apiError = toApiError(error);
      const mapped = Object.entries(apiError.fieldErrors ?? {}).filter(([name]) => name in values);
      if (mapped.length > 0) {
        mapped.forEach(([name, messages]) =>
          setError(name as keyof UserFormValues, { message: messages[0] ?? apiError.message }),
        );
      } else {
        setFormError(apiError.message);
      }
    }
  });

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      {formError && (
        <Alert tone="danger" title="Could not save user">
          {formError}
        </Alert>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Full name"
          autoComplete="off"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Email"
          type="email"
          autoComplete="off"
          error={errors.email?.message}
          {...register('email')}
        />
        <Select
          label="Role"
          options={roleOptions}
          error={errors.role?.message}
          {...register('role')}
        />
        <Select
          label="Status"
          options={statusOptions}
          error={errors.status?.message}
          {...register('status')}
        />
      </div>
      <div className="flex justify-end gap-2 border-t border-slate-100 pt-5">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
