// Settings page at /settings: currency display preferences.

import { CurrencySettings } from "@/components/CurrencySettings";
import { PageHeader } from "@/components/ui/PageHeader";
import { pageClass } from "@/lib/ui";

export const metadata = { title: "Settings · Unhook" };

export default function SettingsPage() {
  return (
    <main className={pageClass}>
      <PageHeader title="Settings" description="How Unhook displays your money." />
      <CurrencySettings />
    </main>
  );
}
