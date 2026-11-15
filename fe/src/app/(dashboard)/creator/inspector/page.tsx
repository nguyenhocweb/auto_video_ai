"use client";

import React, { Suspense } from "react";
import { InspectorStudio } from "@/src/features/creator/inspector/component/InspectorStudio";

export default function CreatorInspectorPage() {
  return (
    <div className="py-6 px-4">
      <Suspense fallback={<div className="text-center py-12 text-xs text-gray-500">Đang nạp AI Inspector Studio...</div>}>
        <InspectorStudio />
      </Suspense>
    </div>
  );
}

