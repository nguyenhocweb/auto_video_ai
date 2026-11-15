"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaTimes, FaBolt, FaExternalLinkAlt, FaEye, FaEyeSlash, FaInfoCircle } from "react-icons/fa";
import { useAddGroqKey } from "../hook/useAddGroqKey";
import { GROQ_MODEL_OPTIONS } from "../type/groq-key.type";

interface AddGroqKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddGroqKeyModal: React.FC<AddGroqKeyModalProps> = ({ isOpen, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const [key, setKey] = useState("");
  const [note, setNote] = useState("");
  const [model, setModel] = useState("qwen/qwen3.8-27b");
  const [showKey, setShowKey] = useState(false);
  const [validationError, setValidationError] = useState("");

  const addMutation = useAddGroqKey(() => {
    setKey("");
    setNote("");
    setModel("qwen/qwen3.8-27b");
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
      setValidationError("Vui lòng nhập Groq API Key.");
      return;
    }
    if (cleanKey.length < 15) {
      setValidationError("Groq API Key thường có độ dài ít nhất 30-50 ký tự (bắt đầu bằng gsk_...).");
      return;
    }
    setValidationError("");
    addMutation.mutate({ key: cleanKey, note: note.trim(), model });
  };

  return createPortal(
    <div className="fixed inset-0 w-screen h-screen z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-amber-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center">
              <FaBolt className="text-base" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Thêm Groq API Key Mới</h3>
              <p className="text-xs text-gray-500">Ưu tiên dịch trước Gemini với tốc độ ~500 words/s</p>
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
          <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <FaInfoCircle className="text-sm flex-shrink-0 text-amber-600" />
              <span>Cách lấy Groq API Key miễn phí (Không cần thẻ):</span>
            </div>
            <p className="leading-relaxed text-amber-900">
              Truy cập{" "}
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noreferrer"
                className="font-bold underline text-amber-700 hover:text-amber-900 inline-flex items-center gap-1"
              >
                Groq Console (console.groq.com/keys) <FaExternalLinkAlt className="text-[10px]" />
              </a>{" "}
              $\rightarrow$ Đăng nhập bằng Gmail $\rightarrow$ Bấm <b>Create API Key</b>. Miễn phí 14.400 requests/ngày!
            </p>
          </div>

          {/* Input API Key */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Groq API Key <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={key}
                onChange={(e) => {
                  setKey(e.target.value);
                  if (validationError) setValidationError("");
                }}
                placeholder="Dán mã API Key (bắt đầu bằng gsk_...)"
                className={`w-full pr-10 pl-3.5 py-2.5 text-sm bg-gray-50 border rounded-xl outline-none font-mono transition-all ${
                  validationError
                    ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    : "border-gray-200 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
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
              placeholder="VD: Groq Gmail 1, Groq cá nhân..."
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
            />
          </div>

          {/* Select Model */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Chỉ Định Model Groq Cho Key
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none font-semibold text-amber-950 focus:bg-white focus:border-amber-500"
            >
              {GROQ_MODEL_OPTIONS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} — [{m.badge}]
                </option>
              ))}
            </select>
            <p className="text-[11px] text-gray-400 mt-1">
              {GROQ_MODEL_OPTIONS.find((m) => m.id === model)?.description}
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
              className="px-5 py-2.5 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-xl shadow-sm shadow-amber-500/25 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {addMutation.isPending ? "Đang lưu..." : "Lưu vào Kho Groq"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

