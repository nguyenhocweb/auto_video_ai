"use client";

import React from "react";
import { FaLightbulb, FaCheck } from "react-icons/fa";

interface ActionableTipsCardProps {
  advice: string[];
}

export const ActionableTipsCard: React.FC<ActionableTipsCardProps> = ({ advice }) => {
  if (!advice || advice.length === 0) return null;

  return (
    <div className="bg-amber-50/50 rounded-2xl border border-amber-200/80 p-5 shadow-sm space-y-3">
      <div className="flex items-center gap-2 border-b border-amber-200/50 pb-2.5">
        <div className="w-6 h-6 rounded-md bg-amber-500 text-white flex items-center justify-center">
          <FaLightbulb className="text-xs" />
        </div>
        <h4 className="text-sm font-bold text-amber-900">
          Gợi Ý Nâng Điểm Viral & Tránh Bị Bóp Tương Tác
        </h4>
      </div>

      <ul className="space-y-2">
        {advice.map((tip, idx) => (
          <li key={idx} className="flex items-start gap-2.5 text-xs text-amber-900/90 leading-relaxed">
            <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
              {idx + 1}
            </span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

