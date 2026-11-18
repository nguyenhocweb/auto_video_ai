"use client";

import React, { useEffect, useState } from "react";
import {
  FaDatabase,
  FaLink,
  FaQuestionCircle,
  FaRedo,
  FaSearch,
  FaSpinner,
  FaTrashAlt,
} from "react-icons/fa";
import { toast } from "sonner";
import { ConfirmModal } from "@/src/core/components/layout/public-ConfirmModal";
import { useDeleteDbTemplate, useGetDbTemplates } from "../hook/useTemplates";
import { ParsedTemplateResult } from "../type/templates.types";
import { TemplateGuideModal } from "./TemplateGuideModal";

interface TemplatePresetItem {
  id: string;
  title: string;
  meta: string;
  tag?: string;
  isDb?: boolean;
}

const DEFAULT_PRESETS: TemplatePresetItem[] = [
  {
    id: "7164622511613725953",
    title: "Mẫu 04: #dnhien#vk (Trái tim anh chẳng còn)",
    meta: "2 tài nguyên • 21.56s • Tác giả: 𝘿𝙣𝙝𝙞𝙚𝙣_",
    tag: "ID: 716462",
  },
  {
    id: "có mình và ta",
    title: "Mẫu 03: CÓ MÌNH VÀ TA (Toàn Nhỏ)",
    meta: "2 tài nguyên • 21.00s • #topxuhuong",
    tag: "Tên mẫu",
  },
  {
    id: "7709090549353090312",
    title: "Mẫu 02: 3 Ảnh Giật Beat & Strobe Rhythmic",
    meta: "3 ảnh • 31.23s • Nhạc beat sync",
    tag: "ID: 090312",
  },
  {
    id: "7444199034253774133",
    title: "Mẫu 01: 1 Video + 1 Ảnh Pan Dọc & Chớp 15Hz",
    meta: "1 video + 1 ảnh • 21.23s • Slide down",
    tag: "ID: 774133",
  },
];

interface TemplateLinkParserCardProps {
  onParsed: (result: ParsedTemplateResult) => void;
  isLoading: boolean;
  onSelectPreset: (templateId: string) => void;
  selectedTemplateId: string;
}

export const TemplateLinkParserCard: React.FC<TemplateLinkParserCardProps> = ({
  isLoading,
  onSelectPreset,
  selectedTemplateId,
}) => {
  const { data: dbData } = useGetDbTemplates();
  const deleteDbMutation = useDeleteDbTemplate();

  const [inputUrl, setInputUrl] = useState<string>("7164622511613725953");
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [presets, setPresets] = useState<TemplatePresetItem[]>(DEFAULT_PRESETS);
  const [deleteTarget, setDeleteTarget] = useState<TemplatePresetItem | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("creator_template_presets");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPresets(parsed);
        }
      }
    } catch {
      // Bỏ qua lỗi
    }
  }, []);

  // Tổng hợp mẫu từ MongoDB Database + Preset cục bộ
  const dbItems: TemplatePresetItem[] = (dbData?.items || []).map((dbItem) => ({
    id: dbItem.template_id,
    title: dbItem.title,
    meta: `${dbItem.total_slots} tài nguyên • ${dbItem.total_duration}s • Tác giả: ${dbItem.author_name}`,
    tag: "MongoDB",
    isDb: true,
  }));

  const allItems: TemplatePresetItem[] = [
    ...dbItems,
    ...presets.filter((p) => !dbItems.some((d) => d.id === p.id)),
  ];

  const handleParse = (overrideId?: string) => {
    const target = overrideId || inputUrl.trim();
    if (!target) return;
    onSelectPreset(target);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    if (deleteTarget.isDb) {
      try {
        await deleteDbMutation.mutateAsync(deleteTarget.id);
        toast.success(`Đã xóa "${deleteTarget.title}" khỏi MongoDB`);
      } catch (err: any) {
        toast.error("Không thể xóa mẫu khỏi MongoDB");
      }
    } else {
      const updated = presets.filter((p) => p.id !== deleteTarget.id);
      setPresets(updated);
      try {
        localStorage.setItem("creator_template_presets", JSON.stringify(updated));
      } catch {
        // Bỏ qua
      }
      toast.success(`Đã xóa "${deleteTarget.title}" khỏi danh sách`);
    }

    setDeleteTarget(null);
  };

  const handleRestoreDefaults = () => {
    setPresets(DEFAULT_PRESETS);
    try {
      localStorage.removeItem("creator_template_presets");
    } catch {
      // Bỏ qua
    }
    toast.info("Đã khôi phục các mẫu mặc định");
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3.5">
      {/* Title Header with Guide Button */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <FaLink className="text-slate-500 text-xs" />
          <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
            Nạp mẫu CapCut
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setIsGuideOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors cursor-pointer group py-0.5 px-2 rounded hover:bg-slate-100"
        >
          <FaQuestionCircle className="text-slate-400 group-hover:text-slate-700 text-xs" />
          <span className="font-medium underline decoration-slate-300 underline-offset-2">
            Hướng dẫn lấy Link / ID
          </span>
        </button>
      </div>

      {/* Input Field + Button */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Dán link CapCut, nhập ID hoặc gõ tên mẫu..."
            className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 pl-8 text-xs text-slate-900 placeholder-slate-400 font-mono focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleParse();
            }}
          />
          <FaSearch className="absolute left-2.5 top-2.5 text-slate-400 text-[10px]" />
        </div>

        <button
          type="button"
          onClick={() => handleParse()}
          disabled={isLoading || !inputUrl.trim()}
          className="px-4 py-2 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-xs"
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin text-xs" />
              <span>Đang đọc kịch bản...</span>
            </>
          ) : (
            <span>Phân tích mẫu</span>
          )}
        </button>
      </div>

      {/* Presets + MongoDB Saved List */}
      <div className="pt-1">
        <div className="flex items-center justify-between mb-1.5">
          <div className="text-[11px] font-mono text-slate-500 flex items-center gap-2">
            <span>Mẫu có sẵn ({allItems.length}):</span>
            {dbItems.length > 0 && (
              <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded font-sans">
                {dbItems.length} mẫu trong Database
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleRestoreDefaults}
            className="text-[11px] font-mono text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <FaRedo className="text-[9px]" /> Khôi phục mặc định
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {allItems.map((p) => {
            const isSelected = selectedTemplateId === p.id;
            return (
              <div
                key={p.id}
                onClick={() => {
                  setInputUrl(p.id);
                  handleParse(p.id);
                }}
                className={`group relative p-2.5 rounded border transition-colors cursor-pointer flex items-start justify-between gap-2 ${
                  isSelected
                    ? "bg-slate-100 border-slate-400 text-slate-900 font-medium"
                    : "bg-slate-50/70 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs truncate">{p.title}</span>
                    {p.isDb ? (
                      <span className="text-[9px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded shrink-0 flex items-center gap-1">
                        <FaDatabase className="text-[8px]" /> DB
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        {p.tag}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">{p.meta}</div>
                </div>

                <button
                  type="button"
                  title="Xóa mẫu này"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteTarget(p);
                  }}
                  className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
                >
                  <FaTrashAlt className="text-xs" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <TemplateGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onSelectSampleId={(sampleId) => {
          setInputUrl(sampleId);
          handleParse(sampleId);
          setIsGuideOpen(false);
        }}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Xác nhận xóa mẫu"
        message={`Bạn có chắc chắn muốn xóa "${deleteTarget?.title}" khỏi danh sách${deleteTarget?.isDb ? " CSDL MongoDB" : ""} không?`}
        confirmText="Xóa mẫu"
        cancelText="Hủy bỏ"
        isDangerous={true}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
