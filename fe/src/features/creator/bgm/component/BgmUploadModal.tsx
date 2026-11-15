"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaTimes, FaCloudUploadAlt, FaMusic, FaShieldAlt, FaSearch, FaFilm } from "react-icons/fa";
import { useUploadBgm } from "../hook/useUploadBgm";
import { useCheckCopyrightFile } from "../hook/useCheckCopyright";
import { BgmAudioTrimmer } from "./BgmAudioTrimmer";
import { BgmCopyrightReportCard } from "./BgmCopyrightReportCard";

interface BgmUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BgmUploadModal: React.FC<BgmUploadModalProps> = ({ isOpen, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [mood, setMood] = useState("chill");
  const [tags, setTags] = useState("");
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(30);
  const [sanitizeAudio, setSanitizeAudio] = useState(true);

  const uploadMutation = useUploadBgm();
  const scanMutation = useCheckCopyrightFile();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleScan = () => {
    if (!file) return;
    scanMutation.mutate(file, {
      onSuccess: (data) => {
        if (data.risk_level === "danger" || data.has_copyright) {
          setSanitizeAudio(true);
        }
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    uploadMutation.mutate(
      {
        file,
        title: title.trim() || undefined,
        mood,
        tags,
        start_time: startTime,
        end_time: endTime,
        sanitize_audio: sanitizeAudio,
      },
      {
        onSuccess: () => {
          setFile(null);
          setTitle("");
          setTags("");
          setStartTime(0);
          setEndTime(30);
          scanMutation.reset();
          onClose();
        },
      }
    );
  };

  const modalContent = (
    <div className="fixed inset-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-5 sm:p-6 border border-gray-100 flex flex-col max-h-[92vh]">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
              <FaMusic className="text-sm" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Tải Lên & Khử Bản Quyền Nhạc</h3>
              <p className="text-[11px] text-gray-500">Quét kiểm tra bản quyền, cắt đoạn điệp khúc & bẻ vân tay Content ID</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg transition-colors"
          >
            <FaTimes className="text-sm" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 mt-3.5 overflow-y-auto pr-1">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-gray-700">
                Chọn File Âm Thanh hoặc Video (.mp3, .wav, .m4a, .mp4, .mov, .webm...) <span className="text-red-500">*</span>
              </label>
              {file && (
                <button
                  type="button"
                  disabled={scanMutation.isPending}
                  onClick={handleScan}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200 transition-colors"
                >
                  <FaSearch className="text-[10px]" />
                  {scanMutation.isPending ? "Đang quét..." : "Quét Bản Quyền Ngay"}
                </button>
              )}
            </div>
            <input
              type="file"
              accept="audio/*,video/*,.mp3,.wav,.m4a,.aac,.ogg,.flac,.mp4,.mov,.webm,.mkv,.avi"
              required
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  setFile(f);
                  scanMutation.reset();
                  if (!title) setTitle(f.name.replace(/\.[^/.]+$/, ""));
                }
              }}
              className="w-full text-xs text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
            />

            {/* Thông báo tự động tách nhạc nếu là file video */}
            {file && (file.type.startsWith("video/") || /\.(mp4|mov|webm|mkv|avi|m4v)$/i.test(file.name)) && (
              <div className="mt-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 animate-fadeIn">
                <FaFilm className="text-emerald-600 shrink-0 text-sm" />
                <span>
                  <strong>Đã chọn file Video:</strong> Hệ thống sẽ tự động bóc tách riêng phần âm thanh và chỉ lưu file nhạc MP3 sạch vào kho (không lưu video)!
                </span>
              </div>
            )}
          </div>

          {/* Hiển thị kết quả thẩm định bản quyền */}
          {scanMutation.data && <BgmCopyrightReportCard result={scanMutation.data} />}

          {/* Interactive Trimmer khi đã chọn file */}
          {file && (
            <BgmAudioTrimmer
              file={file}
              startTime={startTime}
              endTime={endTime}
              onRangeChange={(s, e) => {
                setStartTime(s);
                setEndTime(e);
              }}
            />
          )}

          {/* AI Audio Sanitizer Toggle Banner */}
          <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-xl p-3 flex items-start gap-2.5">
            <input
              type="checkbox"
              id="sanitizeAudio"
              checked={sanitizeAudio}
              onChange={(e) => setSanitizeAudio(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-indigo-600 rounded-sm cursor-pointer accent-indigo-600 shrink-0"
            />
            <label htmlFor="sanitizeAudio" className="text-xs text-slate-700 cursor-pointer select-none">
              <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                <FaShieldAlt className="text-indigo-600" />
                Khử bản quyền AI (Audio DSP Content ID Bypass)
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Bẻ dấu vân tay âm thanh số (Pitch +2.5%, Tempo Warp, Stereo Phase Shift) & chuẩn hóa âm lượng phát sóng chuẩn -14 LUFS.
              </p>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Tên Bản Nhạc (Ghi nhớ)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Nhạc Lofi Trend TikTok 2026..."
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Thể Loại Cảm Xúc (Mood) <span className="text-red-500">*</span>
              </label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold outline-none focus:border-indigo-500 bg-white"
              >
                <option value="chill">Chill / Lofi (Thủ công, mộc, trồng cây)</option>
                <option value="upbeat">Upbeat / Sôi động (Hot girl, thời trang, nhảy)</option>
                <option value="funny">Hài hước / Pets (Chó mèo, tình huống bựa)</option>
                <option value="asmr">ASMR / Nấu ăn (Nấu nướng, rửa xe, cạo rêu)</option>
                <option value="cinematic">Cinematic (Kịch tính, sinh tồn, chế máy)</option>
                <option value="general">Khác / Đa dụng</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Thẻ Tag (Cách nhau bởi dấu phẩy)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="VD: trend, remix, viral"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              disabled={!file || uploadMutation.isPending}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <FaCloudUploadAlt className="text-sm" />
              {uploadMutation.isPending ? "Đang xử lý DSP & Lưu..." : "Lưu Vào Kho Nhạc Sạch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
