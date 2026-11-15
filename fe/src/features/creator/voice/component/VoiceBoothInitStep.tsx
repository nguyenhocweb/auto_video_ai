"use client";

import React, { useState } from "react";
import { FaMicrophone, FaSpinner } from "react-icons/fa";

interface VoiceBoothInitStepProps {
  isCreatingJob: boolean;
  onCreateJob: (payload: { voice_name: string; gender: string }) => void;
}

export const VoiceBoothInitStep: React.FC<VoiceBoothInitStepProps> = ({
  isCreatingJob,
  onCreateJob,
}) => {
  const [voiceNameInput, setVoiceNameInput] = useState("");
  const [genderInput, setGenderInput] = useState("MALE");

  return (
    <div className="max-w-lg mx-auto py-8 text-center space-y-6 animate-fadeIn">
      <div className="w-16 h-16 rounded-3xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto text-2xl shadow-sm">
        <FaMicrophone />
      </div>
      <div>
        <h4 className="text-lg font-bold text-gray-900">
          Phòng Thu Âm Trực Tiếp (30 Câu Chuẩn Ngữ Âm)
        </h4>
        <p className="text-xs text-gray-500 mt-1">
          Đặt tên cho mô hình giọng của bạn và bắt đầu đọc 30 câu mẫu tiếng Việt qua micro
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-4 text-left shadow-sm">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Tên Giọng Nói Độc Quyền <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={voiceNameInput}
            onChange={(e) => setVoiceNameInput(e.target.value)}
            placeholder="VD: Giọng Kể Chuyện Chính Chủ, Reviewer Tuấn..."
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Giới tính
          </label>
          <select
            value={genderInput}
            onChange={(e) => setGenderInput(e.target.value)}
            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="MALE">Nam (Male)</option>
            <option value="FEMALE">Nữ (Female)</option>
            <option value="NEUTRAL">Trung tính (Neutral)</option>
          </select>
        </div>

        <button
          type="button"
          disabled={!voiceNameInput.trim() || isCreatingJob}
          onClick={() =>
            onCreateJob({ voice_name: voiceNameInput, gender: genderInput })
          }
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {isCreatingJob ? (
            <>
              <FaSpinner className="animate-spin text-base" />
              <span>Đang tạo phòng thu...</span>
            </>
          ) : (
            <>
              <FaMicrophone className="text-base" />
              <span>Bắt Đầu Vào Phòng Thu Âm (30 Câu)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

