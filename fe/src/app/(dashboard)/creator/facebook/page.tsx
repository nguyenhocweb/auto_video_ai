"use client";

import React, { Suspense } from "react";
import { FacebookStudioView } from "@/src/features/creator/facebook/component/FacebookStudioView";

export default function FacebookCreatorPage() {
  return (
    <div className="py-6 px-4">
      <Suspense fallback={<div className="text-center py-12 text-xs text-gray-500">Đang nạp Facebook Studio...</div>}>
        <FacebookStudioView />
      </Suspense>
    </div>
  );
}

