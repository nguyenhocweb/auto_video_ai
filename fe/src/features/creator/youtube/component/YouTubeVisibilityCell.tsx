"use client";

import React from "react";
import { FaGlobe, FaLock, FaLink } from "react-icons/fa";

interface YouTubeVisibilityCellProps {
  status?: string;
}

export const YouTubeVisibilityCell: React.FC<YouTubeVisibilityCellProps> = ({
  status = "public",
}) => {
  const norm = (status || "public").toLowerCase();

  if (norm === "private") {
    return (
      <span className="inline-flex items-center gap-1.5 text-gray-600 font-medium text-xs">
        <FaLock className="text-gray-400 text-[10px]" />
        <span>Riêng tư</span>
      </span>
    );
  }

  if (norm === "unlisted") {
    return (
      <span className="inline-flex items-center gap-1.5 text-indigo-600 font-medium text-xs">
        <FaLink className="text-indigo-400 text-[10px]" />
        <span>Không công khai</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-gray-800 font-semibold text-xs">
      <FaGlobe className="text-gray-600 text-[11px]" />
      <span>Công khai</span>
    </span>
  );
};
