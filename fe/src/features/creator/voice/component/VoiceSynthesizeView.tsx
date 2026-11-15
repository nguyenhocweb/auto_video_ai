"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { VoiceSynthesizeCard } from "./VoiceSynthesizeCard";
import { AudioRecordingsList } from "./AudioRecordingsList";
import { FadeIn } from "@/src/core/components/animation/FadeIn";

export const VoiceSynthesizeView: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const profileIdFromUrl = searchParams.get("profileId") || "";

  const [selectedProfileId, setSelectedProfileId] = useState<string>(profileIdFromUrl);

  useEffect(() => {
    if (profileIdFromUrl) {
      setSelectedProfileId(profileIdFromUrl);
    }
  }, [profileIdFromUrl]);

  return (
    <FadeIn className="space-y-8">
      <VoiceSynthesizeCard
        selectedProfileId={selectedProfileId}
        onSelectProfile={(id) => setSelectedProfileId(id)}
        onOpenManageModal={() => router.push("/creator/voice/library")}
        onOpenTrainingForm={() => router.push("/creator/voice/record")}
      />

      <AudioRecordingsList />
    </FadeIn>
  );
};
