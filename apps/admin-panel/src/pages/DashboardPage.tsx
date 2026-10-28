import { useCallback } from 'react';
import { Link } from 'react-router';
import { usersApi } from '@company/shared-api';
import { useAuth } from '@company/shared-auth';
import { ADMIN_ROUTES } from '@company/shared-config';
import { useAsync } from '@company/shared-hooks';
import {
  Alert,
  Button,
  Card,
  Loader,
  PageHeader,
  Table,
  type TableColumn,
} from '@company/shared-ui';
import type { User } from '@company/shared-types';
import { formatDate, formatNumber } from '@company/shared-utils';
import { StatusBadge } from '../features/users/userBadges';

const columns: TableColumn<User>[] = [
  {
    key: 'name',
    header: 'Name',
    render: (u) => <span className="font-medium text-slate-900">{u.name}</span>,
  },
  { key: 'email', header: 'Email', render: (u) => u.email },
  { key: 'status', header: 'Status', render: (u) => <StatusBadge status={u.status} /> },
  { key: 'created', header: 'Joined', render: (u) => formatDate(u.createdAt) },
];

export function DashboardPage() {
  const { user } = useAuth();
  const load = useCallback(() => usersApi.list({ page: 1, pageSize: 100 }), []);
  const { data, loading, error, reload } = useAsync(load);

  const users = data?.items ?? [];
  const stats = [
    { label: 'Total users', value: data?.meta.total ?? 0 },
    { label: 'Active', value: users.filter((u) => u.status === 'active').length },
    { label: 'Administrators', value: users.filter((u) => u.role === 'admin').length },
    { label: 'Suspended', value: users.filter((u) => u.status === 'suspended').length },
  ];
  const recent = [...users].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  return (
    <>
      <PageHeader
        title={`Welcome back, ${user?.name.split(' ')[0] ?? 'there'}`}
        description="Here is how your user base looks today."
        actions={
          <Link to={ADMIN_ROUTES.userCreate}>
            <Button>Add user</Button>
          </Link>
        }
      />

      {error && (
        <Alert tone="danger" title="Could not load users" className="mb-6">
          {error}{' '}
          <button className="font-medium underline" onClick={reload}>
            Try again
          </button>
        </Alert>
      )}

      {loading && !data ? (
        <Loader label="Loading dashboard" />
      ) : (
        <>
          <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <dt className="text-sm text-slate-500">{stat.label}</dt>
                <dd className="mt-2 text-3xl font-semibold tracking-tight">
                  {formatNumber(stat.value)}
                </dd>
              </div>
            ))}
          </dl>

          <Card
            className="mt-8"
            padded={false}
            title="Recently joined"
            actions={
              <Link
                to={ADMIN_ROUTES.users}
                className="text-sm font-medium text-brand-700 hover:underline"
              >
                View all users
              </Link>
            }
          >
            <Table
              columns={columns}
              data={recent}
              rowKey={(u) => u.id}
              caption="Recently joined users"
              emptyTitle="No users yet"
              emptyDescription="Add your first user to get started."
            />
          </Card>
        </>
      )}
    </>
  );
}
