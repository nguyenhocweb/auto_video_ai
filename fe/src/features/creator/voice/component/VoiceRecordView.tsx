"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { VoiceTrainingCard } from "./VoiceTrainingCard";
import { toast } from "sonner";

export const VoiceRecordView: React.FC = () => {
  const router = useRouter();

  const handleProfileCreated = (newProfileId: string) => {
    toast.success("Huấn luyện kiểu giọng thành công!", {
      action: {
        label: "Đọc kịch bản ngay",
        onClick: () => router.push(`/creator/voice?profileId=${newProfileId}`),
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Thẻ Huấn Luyện & Thu Âm Giọng (Trực Tiếp Phòng Thu Inline) */}
      <VoiceTrainingCard
        onProfileCreated={handleProfileCreated}
        isOpenDefault={true}
      />
    </div>
  );
};
