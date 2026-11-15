"use client";

import React, { Suspense } from "react";
import { DouyinConfigView } from "@/src/features/creator/douyin/component/DouyinConfigView";

export default function DouyinConfigPage() {
  return (
    <div className="py-6 px-4">
      <Suspense
        fallback={
          <div className="text-center py-12 text-xs text-gray-500">
            Đang nạp cấu hình Douyin...
          </div>
        }
      >
        <DouyinConfigView />
      </Suspense>
    </div>
  );
}

