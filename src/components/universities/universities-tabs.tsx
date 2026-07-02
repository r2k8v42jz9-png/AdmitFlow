"use client";

import { Compass, Sparkles } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UniversityExplorer } from "@/components/universities/university-explorer";
import { SmartMatchView } from "@/components/universities/smart-match-view";
import { useT } from "@/lib/i18n";

/**
 * Tab shell for the Universities page — Explorer stays the default tab so
 * nothing changes for anyone who never opens Smart Match.
 */
export function UniversitiesTabs() {
  const { t } = useT();
  return (
    <Tabs defaultValue="explorer">
      <TabsList>
        <TabsTrigger value="explorer">
          <Compass /> {t("uni.tab.explorer")}
        </TabsTrigger>
        <TabsTrigger value="smart-match">
          <Sparkles /> {t("uni.tab.smartMatch")}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="explorer">
        <UniversityExplorer />
      </TabsContent>
      <TabsContent value="smart-match">
        <SmartMatchView />
      </TabsContent>
    </Tabs>
  );
}
