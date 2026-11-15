"use client";

import React from "react";
import { FaCheckCircle, FaExclamationTriangle, FaShieldAlt, FaCompactDisc } from "react-icons/fa";
import { CopyrightCheckResult } from "../type/bgm.type";

interface BgmCopyrightReportCardProps {
  result: CopyrightCheckResult;
}

export const BgmCopyrightReportCard: React.FC<BgmCopyrightReportCardProps> = ({ result }) => {
  const isDanger = result.risk_level === "danger";
  const isWarning = result.risk_level === "warning";
  const isSafe = result.risk_level === "safe";

  const borderColor = isDanger
    ? "border-red-300 bg-red-50/70 text-red-900"
    : isWarning
    ? "border-amber-300 bg-amber-50/70 text-amber-900"
    : "border-emerald-300 bg-emerald-50/70 text-emerald-900";

  return (
    <div className={`p-4 rounded-2xl border transition-all space-y-2.5 ${borderColor}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isDanger && <FaExclamationTriangle className="text-red-600 text-base shrink-0" />}
          {isWarning && <FaShieldAlt className="text-amber-600 text-base shrink-0" />}
          {isSafe && <FaCheckCircle className="text-emerald-600 text-base shrink-0" />}
          <h4 className="font-bold text-xs sm:text-sm">
            {isDanger
              ? "CẢNH BÁO BẢN QUYỀN NGUY HIỂM"
              : isWarning
              ? "CẢNH BÁO: BẢN QUYỀN THƯƠNG MẠI"
              : "KẾT QUẢ QUÉT: SẠCH BẢN QUYỀN (SAFE)"}
          </h4>
        </div>

        <span
          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
            isDanger
              ? "bg-red-100 border-red-300 text-red-800"
              : isWarning
              ? "bg-amber-100 border-amber-300 text-amber-800"
              : "bg-emerald-100 border-emerald-300 text-emerald-800"
          }`}
        >
          {result.risk_level}
        </span>
      </div>

      {(result.matched_title || result.matched_artist) && (
        <div className="bg-white/80 rounded-xl p-2.5 border border-black/5 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-gray-800">
            <FaCompactDisc className="text-indigo-600 shrink-0" />
            <span>Bài hát: {result.matched_title || "Không rõ tiêu đề"}</span>
          </div>
          {result.matched_artist && (
            <p className="text-[11px] text-gray-600 ml-5">
              Nghệ sĩ / Ca sĩ: <span className="font-semibold text-gray-800">{result.matched_artist}</span>
            </p>
          )}
          {result.matched_label && (
            <p className="text-[11px] text-gray-600 ml-5">
              Hãng đĩa / Sở hữu: <span className="font-semibold text-gray-800">{result.matched_label}</span>
            </p>
          )}
        </div>
      )}

      <div className="text-xs space-y-1">
        <p className="text-[11px] leading-relaxed opacity-90">{result.details}</p>
        <p className="text-[11px] font-semibold leading-relaxed">
          👉 <span className="underline">Khuyến nghị:</span> {result.recommendation}
        </p>
      </div>
    </div>
  );
};

