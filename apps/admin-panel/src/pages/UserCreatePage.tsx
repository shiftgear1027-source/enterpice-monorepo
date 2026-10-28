import { useNavigate } from 'react-router';
import { usersApi } from '@company/shared-api';
import { ADMIN_ROUTES } from '@company/shared-config';
import { Card, PageHeader, useToast } from '@company/shared-ui';
import { UserForm } from '../features/users/UserForm';

export function UserCreatePage() {
  const navigate = useNavigate();
  const toast = useToast();

  return (
    <>
      <PageHeader
        title="Add user"
        description="Create an account and choose what they can access."
      />
      <Card className="max-w-3xl">
        <UserForm
          submitLabel="Create user"
          onCancel={() => navigate(ADMIN_ROUTES.users)}
          onSubmit={async (values) => {
            const created = await usersApi.create(values);
            toast.success(`${created.name} was added`);
            navigate(ADMIN_ROUTES.users);
          }}
        />
      </Card>
    </>
  );
}
