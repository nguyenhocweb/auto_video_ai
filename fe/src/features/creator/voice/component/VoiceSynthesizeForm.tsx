"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaPlay, FaSpinner } from "react-icons/fa";
import { voiceSynthesizeSchema, VoiceSynthesizeFormValues } from "../schema/voice.synthesize.schema";
import { useSynthesizeVoice } from "../hook/useSynthesizeVoice";
import { useGetVoiceProfiles } from "../hook/useGetVoiceProfiles";
import { AudioGenerationResponse } from "../type/voice.type";
import { AudioResultPlayer } from "./AudioResultPlayer";
import { toast } from "sonner";

interface VoiceSynthesizeFormProps {
  onSuccess: (data: AudioGenerationResponse) => void;
}

export const VoiceSynthesizeForm: React.FC<VoiceSynthesizeFormProps> = ({ onSuccess }) => {
  const { data: profilesData, isLoading: isLoadingProfiles } = useGetVoiceProfiles();
  const [result, setResult] = useState<AudioGenerationResponse | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<VoiceSynthesizeFormValues>({
    resolver: zodResolver(voiceSynthesizeSchema) as any,
    defaultValues: {
      profile_id_or_path: "",
      text: "Đoạn thuyết minh video này được tạo tự động bằng hồ sơ giọng nói AI đã lưu.",
      speed: 1.0,
      num_step: 28,
    },
  });

  const { mutate: synthesizeVoice, isPending } = useSynthesizeVoice((data) => {
    setResult(data);
    onSuccess(data);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 150);
  });

  // Đếm giây thời gian thực thi trên CPU
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPending) {
      setElapsedSeconds(0);
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isPending]);

  const onSubmit = (values: VoiceSynthesizeFormValues) => {
    synthesizeVoice(values);
  };

  const onInvalid = (formErrors: any) => {
    const errorKeys = Object.keys(formErrors);
    if (errorKeys.length > 0) {
      const firstErr = formErrors[errorKeys[0]];
      toast.error(firstErr?.message || "Vui lòng chọn hồ sơ giọng và nhập kịch bản cần đọc!", {
        id: "voice-action",
      });
    }
  };

  const speedVal = watch("speed");
  const profiles = profilesData?.profiles || [];

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
      {/* Chọn hồ sơ giọng */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          Chọn Hồ sơ Giọng Nói đã lưu <span className="text-red-500">*</span>
        </label>

        {isLoadingProfiles ? (
          <div className="flex items-center gap-2 p-3 text-xs text-gray-500 bg-gray-50 rounded-xl">
            <FaSpinner className="animate-spin text-blue-600" />
            <span>Đang tải danh sách hồ sơ giọng...</span>
          </div>
        ) : profiles.length === 0 ? (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
            <p className="font-bold mb-1">Chưa có hồ sơ giọng nói nào!</p>
            <p>
              Hãy chuyển sang tab <strong>"Tạo Hồ Sơ Giọng Mới"</strong> để nạp mẫu audio 5s và lưu thành hồ sơ dùng lâu dài.
            </p>
          </div>
        ) : (
          <select
            {...register("profile_id_or_path")}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
          >
            <option value="">-- Chọn một hồ sơ giọng nói --</option>
            {profiles.map((p) => (
              <option key={p.profile_id} value={p.profile_id}>
                🎙️ {p.profile_name} (ID: {p.profile_id.slice(0, 8)})
              </option>
            ))}
          </select>
        )}
        {errors.profile_id_or_path && (
          <p className="text-xs text-red-500 mt-1 font-medium">
            {errors.profile_id_or_path.message}
          </p>
        )}
      </div>

      {/* Kịch bản video */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          Nội dung kịch bản video <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={5}
          {...register("text")}
          placeholder="Dán toàn bộ kịch bản bạn muốn chuyển thành giọng đọc tại đây..."
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-y shadow-sm"
        />
        {errors.text && (
          <p className="text-xs text-red-500 mt-1 font-medium">{errors.text.message}</p>
        )}
      </div>

      {/* Tốc độ đọc */}
      <div className="p-4 rounded-xl bg-gray-50/80 border border-gray-100">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-semibold text-gray-700">Tốc độ đọc:</span>
          <span className="text-xs font-bold text-blue-600">{speedVal}x</span>
        </div>
        <input
          type="range"
          min="0.5"
          max="1.5"
          step="0.1"
          {...register("speed", { valueAsNumber: true })}
          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending || profiles.length === 0}
        className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
      >
        {isPending ? (
          <>
            <FaSpinner className="animate-spin text-base" />
            <span>Đang đọc kịch bản qua hồ sơ giọng... ({elapsedSeconds}s)</span>
          </>
        ) : (
          <>
            <FaPlay className="text-sm" />
            <span>Tạo Thuyết Minh Kịch Bản</span>
          </>
        )}
      </button>

      {/* Audio Result Player hiển thị trực tiếp ngay bên dưới nút bấm */}
      {result && (
        <div ref={resultRef} className="pt-2 animate-fadeIn">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Kết Quả Thuyết Minh Vừa Tạo
            </span>
          </div>
          <AudioResultPlayer result={result} />
        </div>
      )}
    </form>
  );
};

