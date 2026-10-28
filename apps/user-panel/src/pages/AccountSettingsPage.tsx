import { useState } from 'react';
import { STORAGE_KEYS } from '@company/shared-config';
import { useLocalStorage } from '@company/shared-hooks';
import { Button, Card, Checkbox, PageHeader, useToast } from '@company/shared-ui';

interface AccountSettings {
  orderUpdates: boolean;
  promotions: boolean;
}

const defaults: AccountSettings = { orderUpdates: true, promotions: false };

export function AccountSettingsPage() {
  const toast = useToast();
  const [saved, setSaved] = useLocalStorage<AccountSettings>(STORAGE_KEYS.settings, defaults);
  const [draft, setDraft] = useState<AccountSettings>(saved);

  return (
    <>
      <PageHeader
        title="Account settings"
        description="Preferences are stored in this browser only."
      />
      <Card className="max-w-xl" title="Email preferences">
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            setSaved(draft);
            toast.success('Preferences saved');
          }}
        >
          <Checkbox
            label="Order updates"
            description="Shipping and delivery notifications."
            checked={draft.orderUpdates}
            onChange={(e) => setDraft({ ...draft, orderUpdates: e.target.checked })}
          />
          <Checkbox
            label="Promotions"
            description="Occasional offers and new arrivals."
            checked={draft.promotions}
            onChange={(e) => setDraft({ ...draft, promotions: e.target.checked })}
          />
          <div className="flex justify-end">
            <Button type="submit">Save preferences</Button>
          </div>
        </form>
      </Card>
    </>
  );
}
