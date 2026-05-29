import type { Metadata } from "next";
import { MentorChat } from "@/components/mentor/mentor-chat";

export const metadata: Metadata = {
  title: "AI Mentor",
  description: "Chat with your personalized AdmitFlow AI mentor about universities, essays, scholarships and deadlines.",
};

export default function MentorPage() {
  return <MentorChat />;
}
