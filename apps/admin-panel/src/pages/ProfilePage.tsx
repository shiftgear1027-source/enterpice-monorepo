import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toApiError, usersApi } from '@company/shared-api';
import { useAuth, useAuthStore } from '@company/shared-auth';
import { Alert, Button, Card, Input, PageHeader, useToast } from '@company/shared-ui';
import { profileSchema, type ProfileFormValues } from '@company/shared-validation';

export function ProfilePage() {
  const { user } = useAuth();
  const setUser = useAuthStore((state) => state.setUser);
  const toast = useToast();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? '', email: user?.email ?? '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    if (!user) return;
    setError(null);
    try {
      setUser(await usersApi.update(user.id, values));
      toast.success('Profile updated');
    } catch (err) {
      setError(toApiError(err).message);
    }
  });

  return (
    <>
      <PageHeader title="Profile" description="Your personal details." />
      <Card className="max-w-xl">
        <form onSubmit={onSubmit} noValidate className="space-y-5">
          {error && <Alert tone="danger">{error}</Alert>}
          <Input label="Full name" error={errors.name?.message} {...register('name')} />
          <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
          <Input
            label="Role"
            value={user?.role ?? ''}
            readOnly
            disabled
            hint="Only another administrator can change your role."
          />
          <div className="flex justify-end">
            <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
              Save profile
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
}
