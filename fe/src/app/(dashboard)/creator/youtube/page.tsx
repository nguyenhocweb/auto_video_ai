"use client";

import React, { Suspense } from "react";
import { YouTubeStudioView } from "@/src/features/creator/youtube/component/YouTubeStudioView";

export default function YouTubeCreatorPage() {
  return (
    <div className="py-6 px-4">
      <Suspense
        fallback={
          <div className="text-center py-12 text-xs text-gray-500">
            Đang nạp YouTube Studio...
          </div>
        }
      >
        <YouTubeStudioView />
      </Suspense>
    </div>
  );
}

