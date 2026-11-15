import React from "react";
import { VoiceStudioHeader } from "@/src/features/creator/voice/component/VoiceStudioHeader";
import { FadeIn } from "@/src/core/components/animation/FadeIn";

export const metadata = {
  title: "AI Voice Studio | Video AI Platform",
  description: "Phòng thu âm AI, nhái giọng và thiết kế giọng nói cho Video tự động",
};

export default function VoiceStudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <VoiceStudioHeader />
      <FadeIn>{children}</FadeIn>
    </div>
  );
}

