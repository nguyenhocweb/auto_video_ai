"use client";

import React from "react";
import { FaShieldAlt, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { SkinSafety } from "../type/inspector.type";

interface PolicyAuditCardProps {
  skinSafety: SkinSafety;
}

export const PolicyAuditCard: React.FC<PolicyAuditCardProps> = ({ skinSafety }) => {
  const isSafe = skinSafety.is_safe;
  const skinPercent = skinSafety.skin_percent ?? Math.round(skinSafety.skin_ratio * 100);

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <FaShieldAlt className={isSafe ? "text-emerald-600" : "text-rose-600"} />
          Kiểm Duyệt Luật Nền Tảng & Nội Dung 18+
        </h4>

        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-bold border inline-flex items-center gap-1 ${
            isSafe
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-rose-50 text-rose-700 border-rose-200"
          }`}
        >
          {isSafe ? <FaCheckCircle className="text-[10px]" /> : <FaExclamationTriangle className="text-[10px]" />}
          {isSafe ? "Chuẩn Policy" : "Cảnh Báo Vi Phạm"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/60">
          <span className="text-[11px] font-semibold text-gray-400 block uppercase">
            Tỷ lệ vùng da người (HSV Skin tone)
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-gray-800">{skinPercent}%</span>
            <span className="text-[11px] text-gray-500">diện tích khung hình</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            {skinPercent < 35
              ? "Tỷ lệ da vừa phải, trang phục kín đáo hợp lệ."
              : skinPercent < 45
              ? "Tỷ lệ da ở ngưỡng nhạy cảm, lưu ý góc chụp bikini/hở lưng."
              : "CẢNH BÁO: Quá nhiều da thịt, AI kiểm duyệt TikTok/FB rất dễ đánh gậy 18+."}
          </p>
        </div>

        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/60">
          <span className="text-[11px] font-semibold text-gray-400 block uppercase">
            Trạng thái quét vi phạm
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            {isSafe ? (
              <span className="text-xs font-bold text-emerald-600">Đạt tiêu chuẩn cộng đồng</span>
            ) : (
              <span className="text-xs font-bold text-rose-600">Nguy cơ vi phạm</span>
            )}
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            {skinSafety.warning || "Ảnh bìa tuân thủ chính sách, không có yếu tố bạo lực hay 18+ phản cảm."}
          </p>
        </div>
      </div>
    </div>
  );
};

