import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import { usersApi } from '@company/shared-api';
import { ADMIN_ROUTES } from '@company/shared-config';
import { useAsync } from '@company/shared-hooks';
import { Alert, Card, Loader, PageHeader, useToast } from '@company/shared-ui';
import { UserForm } from '../features/users/UserForm';

export function UserEditPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const load = useCallback(() => usersApi.get(id), [id]);
  const { data: user, loading, error } = useAsync(load);

  return (
    <>
      <PageHeader
        title="Edit user"
        description={user ? `Update ${user.name}'s account.` : undefined}
      />
      <Card className="max-w-3xl">
        {loading && !user ? (
          <Loader label="Loading user" />
        ) : error || !user ? (
          <Alert tone="danger" title="User not found">
            {error ?? 'This user does not exist or was deleted.'}
          </Alert>
        ) : (
          <UserForm
            defaultValues={{
              name: user.name,
              email: user.email,
              role: user.role,
              status: user.status,
            }}
            submitLabel="Save changes"
            onCancel={() => navigate(ADMIN_ROUTES.users)}
            onSubmit={async (values) => {
              await usersApi.update(user.id, values);
              toast.success('Changes saved');
              navigate(ADMIN_ROUTES.users);
            }}
          />
        )}
      </Card>
    </>
  );
}
