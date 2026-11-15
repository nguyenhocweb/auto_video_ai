"use client";

import React, { useState } from "react";
import { FaLanguage, FaSearch, FaClock, FaSyncAlt } from "react-icons/fa";
import { SubtitleSegment } from "../type/dubbing.type";

interface SubtitleTimelineEditorProps {
  segments: SubtitleSegment[];
  onChangeSegment: (id: number, newTranslatedText: string) => void;
  onRetranslateAll: () => void;
  isTranslating: boolean;
}

export const SubtitleTimelineEditor: React.FC<SubtitleTimelineEditorProps> = ({
  segments,
  onChangeSegment,
  onRetranslateAll,
  isTranslating,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSegments = segments.filter(
    (s) =>
      s.text_origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.text_translated.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatSec = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = (sec % 60).toFixed(1);
    return `${mins.toString().padStart(2, "0")}:${secs.padStart(4, "0")}`;
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <FaLanguage className="text-blue-600 text-lg" />
          <h3 className="font-bold text-gray-900 text-sm">
            Biên Tập Lời Thoại & Phụ Đề ({segments.length} câu)
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input
              type="text"
              placeholder="Tìm kiếm câu thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-44"
            />
          </div>

          <button
            type="button"
            onClick={onRetranslateAll}
            disabled={isTranslating}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
          >
            <FaSyncAlt className={`text-xs ${isTranslating ? "animate-spin" : ""}`} />
            {isTranslating ? "Đang Dịch..." : "Dịch Lại Tất Cả"}
          </button>
        </div>
      </div>

      {/* Danh sách các câu thoại cuộn mượt */}
      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
        {filteredSegments.length === 0 ? (
          <div className="text-center py-8 text-xs text-gray-400">
            Không tìm thấy câu thoại nào phù hợp.
          </div>
        ) : (
          filteredSegments.map((seg) => (
            <div
              key={seg.id}
              className="p-3 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-blue-50/20 hover:border-blue-200 transition-all space-y-2 text-xs"
            >
              <div className="flex items-center justify-between text-gray-500">
                <span className="font-bold text-gray-700">#{seg.id + 1}</span>
                <div className="flex items-center gap-1 text-[11px] bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-600 font-mono">
                  <FaClock className="text-gray-400 text-[10px]" />
                  <span>
                    {formatSec(seg.start)} ➔ {formatSec(seg.end)} ({seg.duration}s)
                  </span>
                </div>
              </div>

              {/* Câu tiếng Trung gốc */}
              <div className="bg-white/80 p-2 rounded border border-gray-200/60 text-gray-700 font-sans">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-semibold mb-0.5">
                  Thoại gốc (Tiếng Trung):
                </span>
                {seg.text_origin}
              </div>

              {/* Câu tiếng Việt có thể chỉnh sửa */}
              <div>
                <span className="text-[10px] text-blue-600 uppercase tracking-wider block font-semibold mb-0.5">
                  Bản dịch tiếng Việt (Có thể chỉnh sửa trực tiếp):
                </span>
                <textarea
                  rows={2}
                  value={seg.text_translated}
                  onChange={(e) => onChangeSegment(seg.id, e.target.value)}
                  placeholder="Nhập hoặc chỉnh sửa bản dịch tiếng Việt..."
                  className="w-full text-xs p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none text-gray-800 font-medium"
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

