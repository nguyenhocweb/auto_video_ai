"use client";

import React, { Suspense } from "react";
import { GeminiSettingsView } from "@/src/features/creator/settings/component/GeminiSettingsView";

export default function CreatorSettingsPage() {
  return (
    <div className="py-6 px-4">
      <Suspense
        fallback={
          <div className="text-center py-12 text-xs text-gray-500">
            Đang nạp cấu hình hệ thống...
          </div>
        }
      >
        <GeminiSettingsView />
      </Suspense>
    </div>
  );
}

