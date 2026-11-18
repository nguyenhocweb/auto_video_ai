"use client";

import React, { useState } from "react";
import { FaCheck, FaClock, FaDatabase, FaFilm, FaImage, FaMusic, FaSpinner } from "react-icons/fa";
import { toast } from "sonner";
import { useSaveTemplateToDb } from "../hook/useTemplates";
import { ParsedTemplateResult } from "../type/templates.types";

interface TemplateTimelineVisualizerProps {
  parsedData: ParsedTemplateResult;
  onSavedToDb?: () => void;
}

export const TemplateTimelineVisualizer: React.FC<TemplateTimelineVisualizerProps> = ({
  parsedData,
  onSavedToDb,
}) => {
  const total = Math.max(1, parsedData.total_duration);
  const saveMutation = useSaveTemplateToDb();
  const [isSaved, setIsSaved] = useState<boolean>(!!parsedData.is_saved_in_db);

  const handleSaveToDb = async () => {
    try {
      await saveMutation.mutateAsync({
        template_id: parsedData.template_id,
        title: parsedData.title,
        author_name: parsedData.author_name || "CapCut Creator",
        total_duration: parsedData.total_duration,
        total_slots: parsedData.total_slots,
        image_slots_count: parsedData.image_slots_count,
        video_slots_count: parsedData.video_slots_count,
        slots: parsedData.slots,
        cover_url: parsedData.cover_url || null,
        video_url: parsedData.video_url || null,
        music_title: parsedData.music_title || null,
        source_url: parsedData.source_url || null,
      });
      setIsSaved(true);
      toast.success(`Đã lưu mẫu "${parsedData.title}" vào CSDL MongoDB thành công!`);
      onSavedToDb?.();
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || "Lỗi khi lưu mẫu vào Database";
      toast.error(msg);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3.5">
      {/* Header Info + Save to DB Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 border-b border-slate-100">
        <div>
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-0.5 flex items-center gap-2">
            <span>Cấu trúc kịch bản timeline</span>
            {parsedData.author_name && (
              <span className="text-slate-500 font-sans normal-case">• Tác giả: {parsedData.author_name}</span>
            )}
          </div>
          <h3 className="text-sm font-semibold text-slate-900">{parsedData.title}</h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Metadata Badges */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <div className="px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-1.5">
              <FaClock className="text-slate-400 text-[10px]" />
              <span>{parsedData.total_duration}s</span>
            </div>

            <div className="px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-1.5">
              <FaImage className="text-slate-400 text-[10px]" />
              <span>
                {parsedData.image_slots_count > 0 && `${parsedData.image_slots_count} ảnh`}
                {parsedData.video_slots_count > 0 && ` • ${parsedData.video_slots_count} video`}
              </span>
            </div>

            {parsedData.has_audio && (
              <div className="px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-1.5">
                <FaMusic className="text-slate-400 text-[10px]" />
                <span className="truncate max-w-[140px]">
                  {parsedData.music_title || "Nhạc nền gốc"}
                </span>
              </div>
            )}
          </div>

          {/* Button Lưu vào Database MongoDB */}
          <button
            type="button"
            onClick={handleSaveToDb}
            disabled={saveMutation.isPending || isSaved}
            className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs ${
              isSaved
                ? "bg-emerald-50 border border-emerald-200 text-emerald-700 cursor-default"
                : "bg-slate-900 hover:bg-slate-800 text-white"
            }`}
          >
            {saveMutation.isPending ? (
              <>
                <FaSpinner className="animate-spin text-xs" />
                <span>Đang lưu CSDL...</span>
              </>
            ) : isSaved ? (
              <>
                <FaCheck className="text-emerald-600 text-[10px]" />
                <span>Đã lưu trong Database</span>
              </>
            ) : (
              <>
                <FaDatabase className="text-[10px]" />
                <span>Lưu mẫu vào Database</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* NLE Timeline Track Visualizer */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] font-mono text-slate-400 px-0.5">
          <span>00:00.00</span>
          {parsedData.total_duration > 20 && (
            <span className="text-amber-600 font-medium">Beat Drop Transition</span>
          )}
          <span>{parsedData.total_duration.toFixed(2)}s</span>
        </div>

        <div className="relative w-full h-10 bg-slate-100 rounded border border-slate-200 flex overflow-hidden">
          {parsedData.slots.map((s, idx) => {
            const widthPct = Math.max(8, (s.duration / total) * 100);
            return (
              <div
                key={s.slot_id}
                style={{ width: `${widthPct}%` }}
                className={`relative h-full border-r border-white flex flex-col justify-center px-2 select-none transition-colors ${
                  idx % 2 === 0
                    ? "bg-slate-200 hover:bg-slate-300/80"
                    : "bg-slate-300/60 hover:bg-slate-300"
                }`}
              >
                <div className="flex items-center gap-1 text-[11px] font-medium text-slate-900 truncate">
                  {s.slot_type === "video" ? (
                    <FaFilm className="text-[9px] text-slate-500 shrink-0" />
                  ) : (
                    <FaImage className="text-[9px] text-slate-500 shrink-0" />
                  )}
                  <span className="truncate">Slot {s.slot_id}</span>
                </div>
                <div className="text-[9px] font-mono text-slate-500 truncate">
                  {s.duration}s
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Slot Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-0.5">
        {parsedData.slots.map((s) => (
          <div
            key={s.slot_id}
            className="p-2.5 rounded bg-slate-50 border border-slate-200 text-[11px]"
          >
            <div className="flex items-center justify-between font-mono mb-1">
              <span className="font-semibold text-slate-900">Slot {s.slot_id}</span>
              <span className="text-slate-600 font-medium text-[10px] px-1.5 py-0.5 bg-white border border-slate-200 rounded">
                {s.slot_type === "video" ? "Video / Ảnh" : "Ảnh / Video"}
              </span>
            </div>
            <div className="font-mono text-[10px] text-slate-500 flex items-center justify-between">
              <span>{s.start_time}s - {s.end_time}s</span>
              <span className="text-slate-800 font-semibold">{s.duration}s</span>
            </div>
            {s.video_width && s.video_height && (
              <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                Độ phân giải: {s.video_width}x{s.video_height}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
