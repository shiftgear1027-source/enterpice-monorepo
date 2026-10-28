import type { User } from '@company/shared-types';
import { Badge, type BadgeTone } from '@company/shared-ui';
import { capitalize } from '@company/shared-utils';

const statusTone: Record<User['status'], BadgeTone> = {
  active: 'success',
  inactive: 'neutral',
  suspended: 'danger',
};

export const RoleBadge = ({ role }: { role: User['role'] }) => (
  <Badge tone={role === 'admin' ? 'info' : 'neutral'}>{capitalize(role)}</Badge>
);

export const StatusBadge = ({ status }: { status: User['status'] }) => (
  <Badge tone={statusTone[status]}>{capitalize(status)}</Badge>
);
