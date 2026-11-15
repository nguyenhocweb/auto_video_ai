"use client";

import React, { useState } from "react";
import { FaShieldAlt, FaCheck, FaCopy, FaExclamationTriangle, FaSpinner, FaMagic } from "react-icons/fa";
import { useInspectText } from "../hook/useInspectText";
import { TextPolicyInspectResponse } from "../type/inspector.type";

export const TextPolicyTab: React.FC = () => {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<TextPolicyInspectResponse | null>(null);

  const inspectTextMutation = useInspectText();

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    try {
      const res = await inspectTextMutation.mutateAsync(text);
      setResult(res);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyRewritten = () => {
    if (!result?.rewritten_text) return;
    navigator.clipboard.writeText(result.rewritten_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleTexts = [
    "Đây là mẹo làm giàu nhanh bằng bộ môn tài xỉu cực đỉnh kiếm tiền khủng.",
    "Bộ phim hành động bắn súng giết người đẫm máu cực kỳ kịch tính.",
    "Hướng dẫn làm bánh bông lan trứng muối thơm ngon tại nhà đơn giản.",
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <FaShieldAlt className="text-blue-600" />
            Soi Từ Cấm Kịch Bản & Gợi Ý Từ Lóng Né Kiểm Duyệt
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Kiểm tra kịch bản video trước khi thu âm hoặc đăng tải để tránh bị TikTok, Facebook bóp tương tác, tắt kiếm tiền hoặc đánh gậy.
          </p>
        </div>

        {/* Textarea */}
        <div className="space-y-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Dán kịch bản, phụ đề hoặc lời thoại video của bạn vào đây..."
            rows={5}
            className="w-full text-xs p-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
          />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
              <span className="font-semibold text-gray-400">Thử mẫu nhanh:</span>
              {sampleTexts.map((st, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setText(st)}
                  className="px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                >
                  Mẫu {i + 1}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!text.trim() || inspectTextMutation.isPending}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm"
            >
              {inspectTextMutation.isPending ? (
                <>
                  <FaSpinner className="animate-spin text-xs" />
                  <span>Đang soi từ cấm...</span>
                </>
              ) : (
                <>
                  <FaShieldAlt className="text-xs" />
                  <span>Bắt Đầu Kiểm Duyệt</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Kết quả phân tích */}
      {result && (
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                Kết Quả Soi Vi Phạm
              </span>
              <p className="text-xs text-gray-600 mt-0.5 font-medium">{result.summary}</p>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${
                  result.safety_score >= 80
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : result.safety_score >= 50
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-rose-50 text-rose-700 border-rose-200"
                }`}
              >
                <span>Điểm An Toàn: {result.safety_score} / 100</span>
              </div>
            </div>
          </div>

          {/* Danh sách từ vi phạm */}
          {result.violations.length > 0 ? (
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-700">
                Phát hiện {result.violations.length} từ khóa nhạy cảm:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {result.violations.map((v, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg border border-rose-100 bg-rose-50/40 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-rose-700 line-through mr-1.5">
                        {v.word}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-rose-100 text-rose-800 rounded font-semibold uppercase">
                        {v.category}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-gray-500">Thay bằng: </span>
                      <span className="font-bold text-emerald-700">{v.replacement}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/60 flex items-center gap-2 text-xs text-emerald-800 font-medium">
              <FaCheck className="text-emerald-600" />
              <span>Văn bản trong sạch 100%, không chứa từ khóa bạo lực, cờ bạc hay 18+!</span>
            </div>
          )}

          {/* Bản văn bản viết lại né phạt */}
          {result.rewritten_text && result.rewritten_text !== text && (
            <div className="mt-4 p-4 rounded-xl border border-blue-100 bg-blue-50/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                  <FaMagic className="text-blue-600" />
                  Kịch Bản Đã Thay Bằng Từ Lóng Né Phạt (Safe Script)
                </span>
                <button
                  type="button"
                  onClick={handleCopyRewritten}
                  className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-blue-200 shadow-sm transition"
                >
                  {copied ? <FaCheck className="text-emerald-600" /> : <FaCopy />}
                  <span>{copied ? "Đã Sao Chép!" : "Sao Chép Bản Này"}</span>
                </button>
              </div>
              <p className="text-xs text-gray-800 leading-relaxed font-mono bg-white p-3 rounded-lg border border-blue-100/60">
                {result.rewritten_text}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

