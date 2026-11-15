"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaTimes, FaBolt, FaSpinner, FaSave, FaEye, FaEyeSlash } from "react-icons/fa";
import { GroqKeyItem, GROQ_MODEL_OPTIONS, GroqKeyTestResponse } from "../type/groq-key.type";
import { useTestGroqKey } from "../hook/useTestGroqKey";
import { useAddGroqKey } from "../hook/useAddGroqKey";
import { useUpdateGroqKeyModel } from "../hook/useUpdateGroqKeyModel";
import { GroqTestResultCard } from "./GroqTestResultCard";

interface GroqKeyTesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingKeys: GroqKeyItem[];
  initialKeyItem?: GroqKeyItem | null;
}

export const GroqKeyTesterModal: React.FC<GroqKeyTesterModalProps> = ({
  isOpen,
  onClose,
  existingKeys,
  initialKeyItem,
}) => {
  const [mounted, setMounted] = useState(false);
  const [selectedKeyId, setSelectedKeyId] = useState<string>("");
  const [customKey, setCustomKey] = useState("");
  const [note, setNote] = useState("");
  const [selectedModel, setSelectedModel] = useState("qwen/qwen3.8-27b");
  const [showKey, setShowKey] = useState(false);
  const [testResult, setTestResult] = useState<GroqKeyTestResponse | null>(null);

  const testMutation = useTestGroqKey();
  const addMutation = useAddGroqKey(() => onClose());
  const updateModelMutation = useUpdateGroqKeyModel(() => onClose());

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (initialKeyItem) {
      setSelectedKeyId(initialKeyItem.id);
      setSelectedModel(initialKeyItem.model || "qwen/qwen3.8-27b");
      setNote(initialKeyItem.note || "");
      setCustomKey("");
    } else {
      setSelectedKeyId("");
      setCustomKey("");
      setNote("");
      setSelectedModel("qwen/qwen3.8-27b");
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
      addMutation.mutate({ key: clean, note: note.trim() || "Khóa Groq Cloud", model: selectedModel });
    }
  };

  return createPortal(
    <div className="fixed inset-0 w-screen h-screen z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-amber-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <FaBolt className="text-lg" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Kiểm Tra &amp; Lưu Model Cho Groq Key</h3>
              <p className="text-xs text-gray-500">Test phản hồi trực tiếp với Groq LPU trước khi lưu</p>
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Key Selection Mode */}
          {existingKeys.length > 0 && (
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Chọn API Key Từ Database
              </label>
              <select
                value={selectedKeyId}
                onChange={(e) => {
                  setSelectedKeyId(e.target.value);
                  const found = existingKeys.find((k) => k.id === e.target.value);
                  if (found) {
                    setSelectedModel(found.model || "qwen/qwen3.8-27b");
                    setNote(found.note || "");
                  }
                  setTestResult(null);
                }}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none font-semibold text-gray-800 focus:bg-white focus:border-amber-500"
              >
                <option value="">-- [Nhập Key mới để test tự do] --</option>
                {existingKeys.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.note || "Khóa"} — {k.key_masked} (Model: {k.model})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* If entering a new key */}
          {!selectedKeyId && (
            <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Nhập Groq API Key Muốn Kiểm Tra <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    value={customKey}
                    onChange={(e) => setCustomKey(e.target.value)}
                    placeholder="gsk_..."
                    className="w-full pr-10 pl-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl outline-none font-mono focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showKey ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Ghi chú gợi nhớ
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="VD: Groq Gmail 1..."
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          {/* Model Selection */}
          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Chọn Model Groq
            </label>
            <select
              value={selectedModel}
              onChange={(e) => {
                setSelectedModel(e.target.value);
                setTestResult(null);
              }}
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none font-semibold text-amber-950 focus:bg-white focus:border-amber-500"
            >
              {GROQ_MODEL_OPTIONS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} — [{m.badge}]
                </option>
              ))}
            </select>
            <p className="text-[11px] text-gray-500 mt-1">
              {GROQ_MODEL_OPTIONS.find((m) => m.id === selectedModel)?.description}
            </p>
          </div>

          {/* Test Button */}
          <button
            type="button"
            disabled={testMutation.isPending || (!selectedKeyId && !customKey.trim())}
            onClick={handleTest}
            className="w-full py-3 px-4 text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 disabled:opacity-50 rounded-xl shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
          >
            {testMutation.isPending ? (
              <>
                <FaSpinner className="animate-spin text-base" /> Đang gửi test tới Groq Cloud...
              </>
            ) : (
              <>
                <FaBolt /> Bắt Đầu Kiểm Tra Key &amp; Model
              </>
            )}
          </button>

          {/* Test Result Feedback */}
          <GroqTestResultCard result={testResult} />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <span className="text-[11px] text-gray-400">
            💡 Nên kiểm tra trước khi lưu.
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-200/60 rounded-xl transition-colors"
            >
              Đóng
            </button>
            <button
              type="button"
              disabled={
                (!selectedKeyId && !customKey.trim()) ||
                addMutation.isPending ||
                updateModelMutation.isPending
              }
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 disabled:opacity-50 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <FaSave />
              {isTestingExisting ? "Lưu Model Cho Key Này" : "Thêm Key Vào Kho Groq"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

