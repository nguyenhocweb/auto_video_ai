"use client";

import React from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { GeminiKeyTestResponse } from "../type/gemini-key.type";

interface GeminiTestResultCardProps {
  result: GeminiKeyTestResponse | null;
}

export const GeminiTestResultCard: React.FC<GeminiTestResultCardProps> = ({ result }) => {
  if (!result) return null;

  return (
    <div
      className={`p-4 rounded-xl border text-xs space-y-2 animate-[fadeIn_0.2s_ease-out] ${
        result.success
          ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
          : "bg-rose-50/80 border-rose-200 text-rose-900"
      }`}
    >
      <div className="flex items-center gap-2 font-bold text-sm">
        {result.success ? (
          <>
            <FaCheckCircle className="text-emerald-600 text-base shrink-0" />
            <span>Kiểm Tra Thành Công!</span>
          </>
        ) : (
          <>
            <FaTimesCircle className="text-rose-600 text-base shrink-0" />
            <span>Kiểm Tra Thất Bại (Mã: {result.error_code || "Error"})</span>
          </>
        )}
      </div>

      <p className="leading-relaxed font-medium">{result.message}</p>

      {result.success && (
        <div className="pt-2 border-t border-emerald-200/60 flex flex-wrap items-center gap-3 text-[11px] font-semibold text-emerald-800">
          <span>⏱️ Phản hồi: <b>{result.latency_ms}ms</b></span>
          <span>🤖 Model: <b>{result.model}</b></span>
          {result.test_output && (
            <span>💬 Test dịch: <i>"{result.test_output}"</i></span>
          )}
        </div>
      )}
    </div>
  );
};

