import type { Metadata } from "next";
import { ProfileView } from "@/components/profile/profile-view";

export const metadata: Metadata = {
  title: "Profile",
  description: "Your academic profile, test scores, preferences and admission readiness.",
};

export default function ProfilePage() {
  return <ProfileView />;
}
