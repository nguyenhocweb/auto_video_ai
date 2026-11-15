"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaTimes, FaBolt, FaSpinner, FaSave, FaEye, FaEyeSlash } from "react-icons/fa";
import { GeminiKeyItem, GEMINI_MODEL_OPTIONS, GeminiKeyTestResponse } from "../type/gemini-key.type";
import { useTestGeminiKey } from "../hook/useTestGeminiKey";
import { useAddGeminiKey } from "../hook/useAddGeminiKey";
import { useUpdateGeminiKeyModel } from "../hook/useUpdateGeminiKeyModel";
import { GeminiTestResultCard } from "./GeminiTestResultCard";

interface GeminiKeyTesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingKeys: GeminiKeyItem[];
  initialKeyItem?: GeminiKeyItem | null;
}

export const GeminiKeyTesterModal: React.FC<GeminiKeyTesterModalProps> = ({
  isOpen,
  onClose,
  existingKeys,
  initialKeyItem,
}) => {
  const [mounted, setMounted] = useState(false);
  const [selectedKeyId, setSelectedKeyId] = useState<string>("");
  const [customKey, setCustomKey] = useState("");
  const [note, setNote] = useState("");
  const [selectedModel, setSelectedModel] = useState("gemini-2.5-flash");
  const [showKey, setShowKey] = useState(false);
  const [testResult, setTestResult] = useState<GeminiKeyTestResponse | null>(null);

  const testMutation = useTestGeminiKey();
  const addMutation = useAddGeminiKey(() => onClose());
  const updateModelMutation = useUpdateGeminiKeyModel(() => onClose());

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (initialKeyItem) {
      setSelectedKeyId(initialKeyItem.id);
      setSelectedModel(initialKeyItem.model || "gemini-2.5-flash");
      setNote(initialKeyItem.note || "");
      setCustomKey("");
    } else {
      setSelectedKeyId("");
      setCustomKey("");
      setNote("");
      setSelectedModel("gemini-2.5-flash");
    }
    setTestResult(null);
  }, [initialKeyItem, isOpen]);

  if (!isOpen || !mounted) return null;

  const isTestingExisting = Boolean(selectedKeyId);

  const handleTest = () => {
    setTestResult(null);
    if (isTestingExisting) {
      testMutation.mutate({ key_id: selectedKeyId, model: selectedModel }, { onSuccess: setTestResult });
    } else {
      const clean = customKey.trim();
      if (!clean) return;
      testMutation.mutate({ key: clean, model: selectedModel }, { onSuccess: setTestResult });
    }
  };

  const handleSave = () => {
    if (isTestingExisting) {
      updateModelMutation.mutate({ keyId: selectedKeyId, model: selectedModel });
    } else {
      const clean = customKey.trim();
      if (!clean) return;
      addMutation.mutate({ key: clean, note: note.trim() || "Khóa Gemini", model: selectedModel });
    }
  };

  return createPortal(
    <div className="fixed inset-0 w-screen h-screen z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-sm">
              <FaBolt className="text-base" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Kiểm Tra &amp; Lưu Model Cho API Key</h3>
              <p className="text-xs text-gray-500">Test phản hồi trực tiếp với Google AI Studio trước khi lưu</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100">
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {existingKeys.length > 0 && !initialKeyItem && (
            <div className="flex rounded-xl bg-gray-100 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => { setSelectedKeyId(""); setTestResult(null); }}
                className={`flex-1 py-1.5 rounded-lg transition-all ${!selectedKeyId ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
              >
                Nhập Key Mới
              </button>
              <button
                type="button"
                onClick={() => {
                  if (existingKeys[0]) {
                    setSelectedKeyId(existingKeys[0].id);
                    setSelectedModel(existingKeys[0].model || "gemini-2.5-flash");
                  }
                  setTestResult(null);
                }}
                className={`flex-1 py-1.5 rounded-lg transition-all ${selectedKeyId ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
              >
                Kiểm Tra Key Đã Lưu ({existingKeys.length})
              </button>
            </div>
          )}

          {isTestingExisting ? (
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Chọn API Key từ Database</label>
              <select
                value={selectedKeyId}
                onChange={(e) => {
                  setSelectedKeyId(e.target.value);
                  setTestResult(null);
                  const found = existingKeys.find((k) => k.id === e.target.value);
                  if (found) setSelectedModel(found.model || "gemini-2.5-flash");
                }}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium text-gray-800"
              >
                {existingKeys.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.note || "Khóa"} — {k.key_masked} (Model: {k.model || "gemini-2.5-flash"})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Gemini API Key Mới <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    value={customKey}
                    onChange={(e) => { setCustomKey(e.target.value); setTestResult(null); }}
                    placeholder="Dán mã API Key (AIzaSy...)"
                    className="w-full pr-10 pl-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none font-mono focus:bg-white focus:border-blue-500"
                  />
                  <button type="button" onClick={() => setShowKey(!showKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showKey ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Tên Gợi Nhớ (Tùy chọn)</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="VD: Gmail Marketing, Kênh Vietsub 1..."
                  className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-blue-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Chọn Model Gemini</label>
            <select
              value={selectedModel}
              onChange={(e) => { setSelectedModel(e.target.value); setTestResult(null); }}
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none font-semibold text-blue-900 focus:bg-white focus:border-blue-500"
            >
              {GEMINI_MODEL_OPTIONS.map((m) => (
                <option key={m.id} value={m.id}>{m.name} — [{m.badge}]</option>
              ))}
            </select>
            <p className="text-[11px] text-gray-500 mt-1">{GEMINI_MODEL_OPTIONS.find((m) => m.id === selectedModel)?.description}</p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              disabled={testMutation.isPending || (!isTestingExisting && !customKey.trim())}
              onClick={handleTest}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {testMutation.isPending ? (
                <><FaSpinner className="animate-spin text-sm" /> Đang kiểm tra kết nối với Google AI Studio...</>
              ) : (
                <><FaBolt className="text-xs" /> Bắt Đầu Kiểm Tra Key &amp; Model</>
              )}
            </button>
          </div>

          <GeminiTestResultCard result={testResult} />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <span className="text-[11px] text-gray-500">
            {testResult?.success ? "✅ Đã xác minh thành công." : "💡 Nên kiểm tra trước khi lưu."}
          </span>
          <div className="flex items-center gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl">
              Đóng
            </button>
            <button
              type="button"
              disabled={addMutation.isPending || updateModelMutation.isPending || (!isTestingExisting && !customKey.trim())}
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              <FaSave className="text-xs" />
              {isTestingExisting ? "Lưu Model Cho Key Này" : "Lưu Key Vào Database"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
