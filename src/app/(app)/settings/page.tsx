import type { Metadata } from "next";
import { PageContainer, PageHeader } from "@/components/app/page-header";
import { SettingsPanels } from "@/components/settings/settings-panels";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account, appearance, notifications and subscription.",
};

export default function SettingsPage() {
  return (
    <PageContainer className="max-w-4xl">
      <PageHeader title="Settings" description="Manage your account, preferences and subscription." />
      <div className="mt-7">
        <SettingsPanels />
      </div>
    </PageContainer>
  );
}
