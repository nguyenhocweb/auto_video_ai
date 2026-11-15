"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface DubbingVideoPreviewModalProps {
  url: string | null;
  onClose: () => void;
}

export const DubbingVideoPreviewModal: React.FC<DubbingVideoPreviewModalProps> = ({
  url,
  onClose,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!url || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
    >
      <div
        className="bg-black rounded-2xl overflow-hidden max-w-2xl w-full max-h-[85vh] relative shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <video controls autoPlay src={url} className="w-full max-h-[80vh] object-contain" />
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-white bg-black/60 hover:bg-black/90 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-md transition-colors"
        >
          ✕ Đóng
        </button>
      </div>
    </div>,
    document.body
  );
};

