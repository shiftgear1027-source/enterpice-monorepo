import { useState } from 'react';
import { STORAGE_KEYS } from '@company/shared-config';
import { useLocalStorage } from '@company/shared-hooks';
import { Button, Card, Checkbox, PageHeader, Select, useToast } from '@company/shared-ui';

interface AdminSettings {
  emailAlerts: boolean;
  weeklyDigest: boolean;
  pageSize: string;
}

const defaults: AdminSettings = { emailAlerts: true, weeklyDigest: false, pageSize: '8' };

export function SettingsPage() {
  const toast = useToast();
  const [saved, setSaved] = useLocalStorage<AdminSettings>(STORAGE_KEYS.settings, defaults);
  const [draft, setDraft] = useState<AdminSettings>(saved);

  return (
    <>
      <PageHeader title="Settings" description="Preferences are stored in this browser only." />
      <Card className="max-w-xl" title="Notifications">
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            setSaved(draft);
            toast.success('Settings saved');
          }}
        >
          <Checkbox
            label="Security alerts"
            description="Email me when an admin account changes."
            checked={draft.emailAlerts}
            onChange={(e) => setDraft({ ...draft, emailAlerts: e.target.checked })}
          />
          <Checkbox
            label="Weekly digest"
            description="A summary of new and suspended users."
            checked={draft.weeklyDigest}
            onChange={(e) => setDraft({ ...draft, weeklyDigest: e.target.checked })}
          />
          <Select
            label="Rows per page"
            value={draft.pageSize}
            onChange={(e) => setDraft({ ...draft, pageSize: e.target.value })}
            options={[
              { value: '8', label: '8' },
              { value: '16', label: '16' },
              { value: '24', label: '24' },
            ]}
          />
          <div className="flex justify-end">
            <Button type="submit">Save settings</Button>
          </div>
        </form>
      </Card>
    </>
  );
}
