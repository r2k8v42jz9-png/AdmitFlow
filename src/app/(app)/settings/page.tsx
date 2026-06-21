import type { Metadata } from "next";
import { PageContainer } from "@/components/app/page-header";
import { LocalizedPageHeader } from "@/components/app/localized-page-header";
import { SettingsPanels } from "@/components/settings/settings-panels";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account, appearance, notifications and subscription.",
};

export default function SettingsPage() {
  return (
    <PageContainer className="max-w-4xl">
      <LocalizedPageHeader titleKey="page.settings.title" descKey="page.settings.desc" />
      <div className="mt-7">
        <SettingsPanels />
      </div>
    </PageContainer>
  );
}
