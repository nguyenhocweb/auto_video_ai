import React from "react";
import { VoiceLibraryView } from "@/src/features/creator/voice/component/VoiceLibraryView";

export const metadata = {
  title: "Kho Giọng Đã Lưu | Video AI Platform",
  description: "Danh sách và quản lý các kiểu giọng nói đã lưu trữ trên MongoDB và Cloudinary",
};

export default function VoiceLibraryPage() {
  return <VoiceLibraryView />;
}

