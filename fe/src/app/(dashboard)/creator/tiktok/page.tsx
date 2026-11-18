"use client";

import React, { Suspense } from "react";
import { TikTokStudioView } from "@/src/features/creator/tiktok/component/TikTokStudioView";

export default function TikTokCreatorPage() {
  return (
    <div className="py-6 px-4">
      <Suspense
        fallback={
          <div className="text-center py-12 text-xs text-gray-500">
            Đang tải TikTok Studio...
          </div>
        }
      >
        <TikTokStudioView />
      </Suspense>
    </div>
  );
}
