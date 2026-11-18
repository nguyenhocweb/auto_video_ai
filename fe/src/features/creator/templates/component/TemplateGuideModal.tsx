"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FaCheck, FaCopy, FaExternalLinkAlt, FaInfoCircle, FaTimes } from "react-icons/fa";

interface TemplateGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSampleId?: (sampleId: string) => void;
}

export const TemplateGuideModal: React.FC<TemplateGuideModalProps> = ({
  isOpen,
  onClose,
  onSelectSampleId,
}) => {
  const [mounted, setMounted] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    if (onSelectSampleId) {
      onSelectSampleId(text);
    }
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return createPortal(
    <div className="fixed inset-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Central Card */}
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center text-xs">
              <FaInfoCircle />
            </span>
            <div>
              <h3 className="text-xs font-semibold text-slate-900">
                Hướng dẫn lấy Link hoặc ID mẫu CapCut
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                Áp dụng cho CapCut, TikTok và Douyin
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded transition-colors cursor-pointer"
          >
            <FaTimes className="text-xs" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
          {/* Method 1 */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                1
              </span>
              <h4 className="font-semibold text-slate-900">
                Lấy Link trực tiếp từ ứng dụng CapCut hoặc TikTok
              </h4>
            </div>
            <p className="text-slate-600 pl-7 text-[11px]">
              Khi bạn lướt thấy video sử dụng mẫu CapCut ưng ý trên điện thoại hoặc máy tính:
            </p>
            <ol className="list-decimal pl-11 space-y-1 text-slate-600 text-[11px]">
              <li>Bấm vào biểu tượng <strong>Chia sẻ (Share)</strong> trên màn hình video.</li>
              <li>Chọn <strong>Sao chép liên kết (Copy Link)</strong>.</li>
              <li>Dán nguyên đường link vừa sao chép vào ô nạp mẫu. Hệ thống sẽ tự động bóc tách ID mẫu.</li>
            </ol>
            <div className="ml-7 p-2 bg-white border border-slate-200 rounded font-mono text-[10px] text-slate-600 break-all">
              Ví dụ: https://www.capcut.com/template-detail/7709090549353090312
            </div>
          </div>

          {/* Method 2 */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                2
              </span>
              <h4 className="font-semibold text-slate-900">
                Lấy ID mẫu từ thanh địa chỉ trình duyệt Web
              </h4>
            </div>
            <p className="text-slate-600 pl-7 text-[11px]">
              Nếu bạn đang mở mẫu trên trang web <strong>capcut.com</strong>:
            </p>
            <ul className="list-disc pl-11 space-y-1 text-slate-600 text-[11px]">
              <li>
                Nhìn vào thanh địa chỉ URL, ID mẫu là dãy số dài ở cuối đường link sau chữ <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">template-detail/</code>.
              </li>
              <li>
                Chỉ cần sao chép dãy số này (ví dụ: <code className="bg-slate-200 px-1 py-0.5 rounded font-bold text-slate-900">7709090549353090312</code>) và dán vào ô nhập.
              </li>
            </ul>
          </div>

          {/* Sample quick copy section */}
          <div className="space-y-1.5 pt-1">
            <div className="font-medium text-slate-900 text-[11px]">
              Mẫu ID thử nghiệm mẫu có thể sao chép ngay:
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded hover:border-slate-300 transition-colors">
                <div>
                  <div className="font-mono font-medium text-slate-900 text-[11px]">
                    7709090549353090312
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Mẫu 02: 3 Ảnh Giật Beat & Strobe Rhythmic (31.23s)
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy("7709090549353090312", 1)}
                  className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedIndex === 1 ? (
                    <>
                      <FaCheck className="text-emerald-600 text-[9px]" /> Đã sao chép
                    </>
                  ) : (
                    <>
                      <FaCopy className="text-[9px]" /> Sao chép & dùng
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded hover:border-slate-300 transition-colors">
                <div>
                  <div className="font-mono font-medium text-slate-900 text-[11px]">
                    7444199034253774133
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Mẫu 01: 1 Video + 1 Ảnh Pan Dọc & Chớp 15Hz (21.23s)
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy("7444199034253774133", 2)}
                  className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedIndex === 2 ? (
                    <>
                      <FaCheck className="text-emerald-600 text-[9px]" /> Đã sao chép
                    </>
                  ) : (
                    <>
                      <FaCopy className="text-[9px]" /> Sao chép & dùng
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-5 py-3 border-t border-slate-100 bg-slate-50/70">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer shadow-xs"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
