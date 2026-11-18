"use client";

import React, { useEffect, useState } from "react";
import { FaDesktop, FaExclamationTriangle, FaFilm, FaPlay, FaSpinner } from "react-icons/fa";
import { FadeIn } from "@/src/core/components/animation/FadeIn";
import {
  useExportToCapCutDesktop,
  useGetTemplates,
  useParseTemplate,
  useRenderTemplate,
} from "../hook/useTemplates";
import { TemplateLinkParserCard } from "./TemplateLinkParserCard";
import { TemplateTimelineVisualizer } from "./TemplateTimelineVisualizer";
import { TemplateSlotCard } from "./TemplateSlotCard";
import { TemplateResultModal } from "./TemplateResultModal";
import { CapCutPcProjectModal } from "./CapCutPcProjectModal";
import { generateSampleSlotFiles } from "./TemplateSampleMediaHelper";
import {
  CreateCapCutDesktopResponse,
  ParsedTemplateResult,
  TemplateRenderResponse,
} from "../type/templates.types";

export const TemplateStudioView: React.FC = () => {
  const { data: templateData } = useGetTemplates();
  const parseMutation = useParseTemplate();
  const renderMutation = useRenderTemplate();
  const exportPcMutation = useExportToCapCutDesktop();

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("7164622511613725953");
  const [parsedData, setParsedData] = useState<ParsedTemplateResult | null>(null);
  const [slotFiles, setSlotFiles] = useState<Record<number, File | null>>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [renderResult, setRenderResult] = useState<TemplateRenderResponse | null>(null);
  const [pcResult, setPcResult] = useState<CreateCapCutDesktopResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPcModalOpen, setIsPcModalOpen] = useState(false);

  useEffect(() => {
    handleParseTemplate("7164622511613725953");
  }, []);

  const handleParseTemplate = async (urlOrId: string) => {
    setErrorMsg(null);
    try {
      const res = await parseMutation.mutateAsync({ urlOrId });
      setParsedData(res);
      setSelectedTemplateId(res.template_id);
      setSlotFiles({});
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || "Không thể phân tích kịch bản mẫu này";
      setErrorMsg(msg);
    }
  };

  const handleSlotFileSelect = (slotId: number, file: File | null) => {
    setSlotFiles((prev) => ({ ...prev, [slotId]: file }));
  };

  const handleQuickSampleTest = () => {
    setErrorMsg(null);
    if (!parsedData) return;
    const newFiles = generateSampleSlotFiles(parsedData.slots);
    setSlotFiles((prev) => ({ ...prev, ...newFiles }));
  };

  const handleStartRender = async () => {
    setErrorMsg(null);
    if (!parsedData) return;

    for (const slot of parsedData.slots) {
      if (slot.is_replaceable && !slotFiles[slot.slot_id]) {
        setErrorMsg(`Thiếu tệp cho Slot ${slot.slot_id} (${slot.slot_type})`);
        return;
      }
    }

    try {
      const mappedId =
        parsedData.slots.length <= 2
          ? "t01_beat_drop"
          : "t02_three_photos";

      const res = await renderMutation.mutateAsync({
        template_id: mappedId,
        slot_files: slotFiles,
        video_file: slotFiles[1]?.type.startsWith("video/") ? slotFiles[1] : null,
        image_file: slotFiles[2]?.type.startsWith("image/") ? slotFiles[2] : null,
        audio_file: slotFiles[4]?.type.startsWith("audio/") ? slotFiles[4] : null,
      });

      setRenderResult(res);
      setIsModalOpen(true);
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || "Lỗi khi kết xuất video";
      setErrorMsg(msg);
    }
  };

  const handleExportToCapCutPc = async () => {
    setErrorMsg(null);
    if (!parsedData) return;

    for (const slot of parsedData.slots) {
      if (slot.is_replaceable && !slotFiles[slot.slot_id]) {
        setErrorMsg(`Thiếu tệp cho Slot ${slot.slot_id} (${slot.slot_type})`);
        return;
      }
    }

    try {
      const res = await exportPcMutation.mutateAsync({
        template_id: parsedData.template_id,
        template_url: parsedData.template_url,
        project_title: parsedData.title,
        slot_files: slotFiles,
      });
      setPcResult(res);
      setIsPcModalOpen(true);
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || "Lỗi khi xuất vào CapCut PC";
      setErrorMsg(msg);
    }
  };

  return (
    <FadeIn>
      <div className="space-y-4 max-w-5xl mx-auto pb-10">
        {/* Studio Top Navigation Bar (Light) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <FaFilm className="text-slate-600 text-xs" />
              <h1 className="text-sm font-semibold text-slate-900 tracking-tight">
                Mẫu video CapCut
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                Hybrid Render Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Phân tích cấu trúc kịch bản từ link mẫu và nạp media tương ứng
            </p>
          </div>

          <div className="text-[11px] font-mono text-slate-500">
            Cloudinary CDN • Tự động giải phóng ổ cứng
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded text-rose-700 text-xs flex items-center gap-2.5">
            <FaExclamationTriangle className="text-xs shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1. Ingest Link Card */}
        <TemplateLinkParserCard
          selectedTemplateId={selectedTemplateId}
          onSelectPreset={handleParseTemplate}
          isLoading={parseMutation.isPending}
          onParsed={(data) => {
            setParsedData(data);
            setSelectedTemplateId(data.template_id);
          }}
        />

        {/* 2. Timeline Track with Save to DB button */}
        {parsedData && <TemplateTimelineVisualizer parsedData={parsedData} />}

        {/* 3. Media Asset Slots */}
        {parsedData && (
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  Tài nguyên đầu vào ({parsedData.slots.length} vị trí)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Nạp media tương ứng với kịch bản timeline đã phân tích
                </p>
              </div>

              <button
                type="button"
                onClick={handleQuickSampleTest}
                className="px-3 py-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-mono transition-colors cursor-pointer self-start sm:self-auto"
              >
                Nạp dữ liệu mẫu
              </button>
            </div>

            {/* Slots Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {parsedData.slots.map((slot) => (
                <TemplateSlotCard
                  key={slot.slot_id}
                  slot={{
                    slot_id: slot.slot_id,
                    slot_type: slot.slot_type,
                    title: `Slot ${slot.slot_id}`,
                    description: `Từ ${slot.start_time}s đến ${slot.end_time}s`,
                    start_time: slot.start_time,
                    duration: slot.duration,
                    required: slot.is_replaceable,
                  }}
                  file={slotFiles[slot.slot_id] || null}
                  onFileSelect={(f) => handleSlotFileSelect(slot.slot_id, f)}
                />
              ))}
            </div>

            {/* Render Bottom Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
              <span className="text-[11px] font-mono text-slate-500">
                Xuất gốc PC: 100% Hiệu ứng • Hỗ trợ 4K/60FPS
              </span>

              <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleExportToCapCutPc}
                  disabled={exportPcMutation.isPending || renderMutation.isPending}
                  className="w-full sm:w-auto px-4 py-2.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer shadow-xs active:scale-98"
                >
                  {exportPcMutation.isPending ? (
                    <>
                      <FaSpinner className="animate-spin text-xs" />
                      <span>Đang tạo dự án PC...</span>
                    </>
                  ) : (
                    <>
                      <FaDesktop className="text-xs" />
                      <span>Xuất vào CapCut PC (100% Gốc)</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleStartRender}
                  disabled={renderMutation.isPending || exportPcMutation.isPending}
                  className="w-full sm:w-auto px-4 py-2.5 rounded bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer shadow-xs active:scale-98"
                >
                  {renderMutation.isPending ? (
                    <>
                      <FaSpinner className="animate-spin text-xs" />
                      <span>Đang kết xuất...</span>
                    </>
                  ) : (
                    <>
                      <FaPlay className="text-[10px]" />
                      <span>Render Web (Nhanh)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Result Web */}
        <TemplateResultModal
          isOpen={isModalOpen}
          result={renderResult}
          onClose={() => setIsModalOpen(false)}
        />

        {/* Modal Result CapCut PC */}
        <CapCutPcProjectModal
          isOpen={isPcModalOpen}
          result={pcResult}
          onClose={() => setIsPcModalOpen(false)}
        />
      </div>
    </FadeIn>
  );
};
