"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaTimes, FaKey, FaExternalLinkAlt, FaEye, FaEyeSlash, FaInfoCircle } from "react-icons/fa";
import { useAddGeminiKey } from "../hook/useAddGeminiKey";
import { GEMINI_MODEL_OPTIONS } from "../type/gemini-key.type";

interface AddGeminiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddGeminiKeyModal: React.FC<AddGeminiKeyModalProps> = ({ isOpen, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const [key, setKey] = useState("");
  const [note, setNote] = useState("");
  const [model, setModel] = useState("gemini-2.5-flash");
  const [showKey, setShowKey] = useState(false);
  const [validationError, setValidationError] = useState("");

  const addMutation = useAddGeminiKey(() => {
    setKey("");
    setNote("");
    setModel("gemini-2.5-flash");
    setValidationError("");
    onClose();
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = key.trim();
    if (!cleanKey) {
      setValidationError("Vui lòng nhập API Key.");
      return;
    }
    if (cleanKey.length < 15) {
      setValidationError("Gemini API Key thường có độ dài ít nhất 30-40 ký tự (bắt đầu bằng AIzaSy...).");
      return;
    }
    setValidationError("");
    addMutation.mutate({ key: cleanKey, note: note.trim(), model });
  };

  return createPortal(
    <div className="fixed inset-0 w-screen h-screen z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <FaKey className="text-base" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Thêm Gemini API Key Mới</h3>
              <p className="text-xs text-gray-500">Lưu vào Database và tự động xoay tua đa chìa khóa</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Guide Alert */}
          <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-xl text-xs text-blue-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-blue-700">
              <FaInfoCircle className="text-sm flex-shrink-0" />
              <span>Cách lấy API Key hoàn toàn miễn phí:</span>
            </div>
            <p className="leading-relaxed text-blue-800">
              Truy cập{" "}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="font-bold underline text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
              >
                Google AI Studio <FaExternalLinkAlt className="text-[10px]" />
              </a>{" "}
              và bấm <b>Create API key</b>. Mỗi tài khoản Google được cấp hạn mức miễn phí 15 requests/phút (1,500 requests/ngày).
            </p>
            <p className="text-gray-500 text-[11px]">
              💡 <b>Mẹo:</b> Thêm từ 2-5 Keys từ các tài khoản Google khác nhau để hệ thống tự động xoay tua, không bao giờ bị nghẽn hay gián đoạn khi làm video!
            </p>
          </div>

          {/* Input API Key */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Gemini API Key <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={key}
                onChange={(e) => {
                  setKey(e.target.value);
                  if (validationError) setValidationError("");
                }}
                placeholder="Dán mã API Key (VD: AIzaSy...)"
                className={`w-full pr-10 pl-3.5 py-2.5 text-sm bg-gray-50 border rounded-xl outline-none font-mono transition-all ${
                  validationError
                    ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    : "border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showKey ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {validationError && (
              <p className="text-xs text-red-500 mt-1">{validationError}</p>
            )}
          </div>

          {/* Input Note */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Ghi chú gợi nhớ (Tùy chọn)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="VD: Gmail chính, Kênh phụ 1, Mail marketing..."
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Gợi nhớ tài khoản sở hữu key để bạn dễ dàng quản lý khi cần đổi key.
            </p>
          </div>

          {/* Select Model */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Chỉ Định Model Gemini Cho Key
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none font-semibold text-blue-900 focus:bg-white focus:border-blue-500"
            >
              {GEMINI_MODEL_OPTIONS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} — [{m.badge}]
                </option>
              ))}
            </select>
            <p className="text-[11px] text-gray-400 mt-1">
              {GEMINI_MODEL_OPTIONS.find((m) => m.id === model)?.description}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              disabled={addMutation.isPending}
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={addMutation.isPending}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-sm shadow-blue-500/25 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {addMutation.isPending ? "Đang lưu..." : "Lưu vào Database"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

