import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toApiError, usersApi } from '@company/shared-api';
import { useAuth } from '@company/shared-auth';
import { ADMIN_ROUTES, APP_CONSTANTS } from '@company/shared-config';
import { useAsync, useDebounce, usePagination } from '@company/shared-hooks';
import type { User } from '@company/shared-types';
import {
  Alert,
  Button,
  Card,
  Dropdown,
  Input,
  Modal,
  PageHeader,
  Pagination,
  Table,
  useToast,
  type TableColumn,
} from '@company/shared-ui';
import { formatDate, getInitials } from '@company/shared-utils';
import { RoleBadge, StatusBadge } from '../features/users/userBadges';

export function UsersPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { user: currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, APP_CONSTANTS.searchDebounceMs);
  const [pendingDelete, setPendingDelete] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [total, setTotal] = useState(0);
  const pagination = usePagination({ pageSize: APP_CONSTANTS.defaultPageSize, total });
  const { page, pageSize, goTo, reset } = pagination;

  const load = useCallback(
    () =>
      usersApi.list({ page, pageSize, search: debouncedSearch }).then((result) => {
        setTotal(result.meta.total);
        return result;
      }),
    [page, pageSize, debouncedSearch],
  );
  const { data, loading, error, reload } = useAsync(load);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await usersApi.remove(pendingDelete.id);
      toast.success(`${pendingDelete.name} was deleted`);
      setPendingDelete(null);
      reload();
    } catch (err) {
      toast.error(toApiError(err).message);
    } finally {
      setDeleting(false);
    }
  };

  const columns: TableColumn<User>[] = [
    {
      key: 'name',
      header: 'User',
      render: (u) => (
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-100 text-xs font-semibold text-brand-800">
            {getInitials(u.name)}
          </span>
          <div>
            <p className="font-medium text-slate-900">{u.name}</p>
            <p className="text-slate-500">{u.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'role', header: 'Role', render: (u) => <RoleBadge role={u.role} /> },
    { key: 'status', header: 'Status', render: (u) => <StatusBadge status={u.status} /> },
    { key: 'created', header: 'Joined', render: (u) => formatDate(u.createdAt) },
    {
      key: 'actions',
      header: <span className="sr-only">Actions</span>,
      className: 'text-right',
      render: (u) => (
        <Dropdown
          label={`Actions for ${u.name}`}
          trigger={
            <span className="rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100">•••</span>
          }
          items={[
            { label: 'Edit', onSelect: () => navigate(ADMIN_ROUTES.userEdit(u.id)) },
            {
              label: 'Delete',
              danger: true,
              disabled: u.id === currentUser?.id,
              onSelect: () => setPendingDelete(u),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Users"
        description="Everyone who can sign in to your applications."
        actions={
          <Link to={ADMIN_ROUTES.userCreate}>
            <Button>Add user</Button>
          </Link>
        }
      />

      {error && (
        <Alert tone="danger" title="Could not load users" className="mb-4">
          {error}
        </Alert>
      )}

      <Card padded={false}>
        <div className="border-b border-slate-200 p-4">
          <div className="max-w-xs">
            <Input
              aria-label="Search users"
              placeholder="Search by name or email"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                reset();
              }}
            />
          </div>
        </div>
        <Table
          columns={columns}
          data={data?.items ?? []}
          rowKey={(u) => u.id}
          loading={loading && !data}
          caption="Users"
          emptyTitle={debouncedSearch ? 'No users match your search' : 'No users yet'}
          emptyDescription={
            debouncedSearch ? 'Try a different name or email.' : 'Add a user to get started.'
          }
        />
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={total}
          pageSize={pageSize}
          onPageChange={goTo}
        />
      </Card>

      <Modal
        open={pendingDelete !== null}
        onClose={() => !deleting && setPendingDelete(null)}
        title="Delete user"
        footer={
          <>
            <Button variant="secondary" onClick={() => setPendingDelete(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => void confirmDelete()} loading={deleting}>
              Delete user
            </Button>
          </>
        }
      >
        Delete <strong className="text-slate-900">{pendingDelete?.name}</strong>? They will lose
        access immediately and this cannot be undone.
      </Modal>
    </>
  );
}
