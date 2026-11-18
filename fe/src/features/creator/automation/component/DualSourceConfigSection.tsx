"use client";

import React from "react";
import {
  FaLayerGroup,
  FaClock,
  FaCut,
  FaMobileAlt,
  FaTv,
  FaRandom,
} from "react-icons/fa";
import { DualSourceConfig } from "../type/automation.type";
import { HookChannelPickerSub } from "./HookChannelPickerSub";

interface DualSourceConfigSectionProps {
  config: DualSourceConfig | undefined;
  onChange: (cfg: DualSourceConfig | undefined) => void;
  disabled?: boolean;
}

export const DualSourceConfigSection: React.FC<DualSourceConfigSectionProps> = ({
  config,
  onChange,
  disabled = false,
}) => {
  const isEnabled = Boolean(config?.enabled);

  const handleToggle = () => {
    if (isEnabled) {
      onChange(undefined);
    } else {
      onChange({
        enabled: true,
        hook_channels: [],
        hook_duration_sec: 3.5,
        body_skip_start_sec: 3.0,
        audio_mode: "sequential",
        aspect_ratio: "9:16",
        transition_duration_sec: 1.2,
        fallback_policy: "reuse_oldest",
      });
    }
  };

  const updateConfig = (patch: Partial<DualSourceConfig>) => {
    if (!config) return;
    onChange({
      ...config,
      ...patch,
    });
  };

  return (
    <div className="bg-indigo-50/40 p-3.5 rounded-xl border border-indigo-200/80 space-y-3">
      {/* Header toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs shadow-xs">
            <FaLayerGroup />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-900 flex items-center gap-2">
              <span>Chế độ Ghép 2 Nguồn (Visual Hook &amp; Thân Bài)</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700">
                Mới
              </span>
            </div>
            <div className="text-[10px] text-gray-500">
              Cắt lấy 0s - Xs video đoạn đầu ghép mờ dần xfade vào thân bài chính
            </div>
          </div>
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={handleToggle}
          className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
            isEnabled ? "bg-indigo-600" : "bg-gray-300"
          }`}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
              isEnabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Chi tiết cấu hình khi bật */}
      {isEnabled && config && (
        <div className="pt-2 space-y-3 border-t border-indigo-100 text-xs text-gray-700 animate-[fadeIn_0.2s_ease-out]">
          {/* Mini diagram cấu trúc ghép nối */}
          <div className="bg-white/90 p-2 rounded-lg border border-indigo-200/80 flex flex-wrap items-center gap-1.5 text-[11px] font-bold shadow-2xs">
            <span className="text-gray-500 shrink-0">Cấu trúc:</span>
            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800">
              [Đoạn Đầu: {config.hook_duration_sec}s] Kênh Hook (dưới)
            </span>
            <span className="text-indigo-500 font-black">→ xfade →</span>
            <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800">
              [Đoạn Đuôi: Hết video] Kênh Thân Bài (trên)
            </span>
          </div>

          {/* Sub component chọn kênh Hook */}
          <HookChannelPickerSub
            hookChannels={config.hook_channels || []}
            onChangeHookChannels={(chs) => updateConfig({ hook_channels: chs })}
            disabled={disabled}
          />

          {/* Thiết lập thời lượng Hook & Bỏ đầu Body */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="bg-white p-2.5 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center text-xs mb-1 font-bold">
                <span className="flex items-center gap-1 text-blue-700">
                  <FaClock className="text-[10px]" /> Lấy đoạn đầu (Hook):
                </span>
                <span className="text-blue-600 font-black">{config.hook_duration_sec}s</span>
              </div>
              <input
                type="range"
                min={1.0}
                max={15.0}
                step={0.5}
                value={config.hook_duration_sec}
                disabled={disabled}
                onChange={(e) => updateConfig({ hook_duration_sec: parseFloat(e.target.value) })}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-gray-400 mt-0.5">
                <span>1.0s</span>
                <span>3.5s (Khuyên dùng)</span>
                <span>15.0s</span>
              </div>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center text-xs mb-1 font-bold">
                <span className="flex items-center gap-1 text-purple-700">
                  <FaCut className="text-[10px]" /> Cắt bỏ đầu video chính:
                </span>
                <span className="text-purple-600 font-black">{config.body_skip_start_sec}s</span>
              </div>
              <input
                type="range"
                min={0.0}
                max={20.0}
                step={0.5}
                value={config.body_skip_start_sec}
                disabled={disabled}
                onChange={(e) => updateConfig({ body_skip_start_sec: parseFloat(e.target.value) })}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-gray-400 mt-0.5">
                <span>0s (Giữ nguyên)</span>
                <span>3.0s (Bỏ intro)</span>
                <span>20.0s</span>
              </div>
            </div>
          </div>

          {/* Tỷ lệ khung hình & Âm thanh */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">
                Tỷ lệ khung hình xuất bản:
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => updateConfig({ aspect_ratio: "9:16" })}
                  className={`flex-1 py-1.5 px-2 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    config.aspect_ratio === "9:16"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <FaMobileAlt /> 9:16 (Dọc)
                </button>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => updateConfig({ aspect_ratio: "16:9" })}
                  className={`flex-1 py-1.5 px-2 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    config.aspect_ratio === "16:9"
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <FaTv /> 16:9 (Ngang)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">
                Chế độ phối âm thanh:
              </label>
              <select
                value={config.audio_mode}
                disabled={disabled}
                onChange={(e) => updateConfig({ audio_mode: e.target.value as any })}
                className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold outline-none"
              >
                <option value="sequential">Nối tuần tự (Hook audio → Body audio)</option>
                <option value="body_audio">Dùng 100% âm thanh video chính</option>
                <option value="hook_audio">Lặp âm thanh Hook xuyên suốt</option>
                <option value="bgm_override">Đè nhạc nền BGM Studio</option>
              </select>
            </div>
          </div>

          {/* Tốc độ chuyển cảnh mờ dần xfade */}
          <div className="bg-white p-2.5 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center text-xs mb-1.5 font-bold">
              <span className="flex items-center gap-1.5 text-indigo-700">
                <FaRandom className="text-[10px]" /> Tốc độ chuyển cảnh xfade (Video 1 mờ dần → Video 2 hiện lên):
              </span>
              <span className="text-indigo-600 font-black">
                {config.transition_duration_sec ?? 1.2}s ({(config.transition_duration_sec ?? 1.2) >= 1.2 ? "Chậm & Mượt" : "Nhanh"})
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {[0.8, 1.2, 1.6, 2.0].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  disabled={disabled}
                  onClick={() => updateConfig({ transition_duration_sec: sec })}
                  className={`flex-1 py-1 text-[11px] font-bold rounded border transition-all cursor-pointer ${
                    (config.transition_duration_sec ?? 1.2) === sec
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {sec}s {sec === 1.2 && "(Chuẩn)"}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-gray-400 mt-1">
              Chuyển cảnh 1.2s giúp đoạn Hook mờ dần từ từ và video chính hiện lên êm dịu, không giật gấp.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
