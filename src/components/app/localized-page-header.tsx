"use client";

import { PageHeader } from "@/components/app/page-header";
import { useT } from "@/lib/i18n";

/** Client wrapper so server route pages can render a localized page header. */
export function LocalizedPageHeader({ titleKey, descKey }: { titleKey: string; descKey: string }) {
  const { t } = useT();
  return <PageHeader title={t(titleKey)} description={t(descKey)} />;
}
