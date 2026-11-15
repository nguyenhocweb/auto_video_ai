"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaPaintBrush, FaSpinner } from "react-icons/fa";
import { voiceDesignSchema, VoiceDesignFormValues } from "../schema/voice.design.schema";
import { useDesignVoice } from "../hook/useDesignVoice";
import { AudioGenerationResponse } from "../type/voice.type";
import { AudioResultPlayer } from "./AudioResultPlayer";
import { toast } from "sonner";

interface VoiceDesignFormProps {
  onSuccess: (data: AudioGenerationResponse) => void;
}

const PRESET_STYLES = [
  {
    label: "Nữ trẻ ấm áp (Miền Bắc)",
    prompt: "female, young adult, warm tone, vietnamese accent, gentle voice",
  },
  {
    label: "Nam trung niên trầm ấm (MC Tin tức)",
    prompt: "male, middle-aged, low pitch, confident, professional news anchor tone",
  },
  {
    label: "Nữ kể chuyện (Thì thầm / Truyện đêm muộn)",
    prompt: "female, soft whisper, storytelling, calm, low pitch",
  },
  {
    label: "Nam thiếu niên sôi nổi (Review TikTok)",
    prompt: "male, teenager, energetic, high pitch, fast pace, modern accent",
  },
];

export const VoiceDesignForm: React.FC<VoiceDesignFormProps> = ({ onSuccess }) => {
  const [result, setResult] = useState<AudioGenerationResponse | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VoiceDesignFormValues>({
    resolver: zodResolver(voiceDesignSchema) as any,
    defaultValues: {
      text: "Khám phá thế giới AI cùng Video Studio. Chúng tôi tạo nên những giọng nói chân thực nhất.",
      instruct: "female, young adult, warm tone, vietnamese accent",
      speed: 1.0,
      num_step: 28,
      guidance_scale: 2.5,
    },
  });

  const { mutate: designVoice, isPending } = useDesignVoice((data) => {
    setResult(data);
    onSuccess(data);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 150);
  });

  // Đếm thời gian thực hiện sinh giọng trên CPU
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

  const onSubmit = (values: VoiceDesignFormValues) => {
    designVoice(values);
  };

  const onInvalid = (formErrors: any) => {
    const errorKeys = Object.keys(formErrors);
    if (errorKeys.length > 0) {
      const firstErr = formErrors[errorKeys[0]];
      toast.error(firstErr?.message || "Vui lòng nhập mô tả phong cách và kịch bản cần đọc!", {
        id: "voice-action",
      });
    }
  };

  const speedVal = watch("speed");
  const stepsVal = watch("num_step");

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
      {/* Hidden input to guarantee registration */}
      <input type="hidden" {...register("guidance_scale", { valueAsNumber: true })} />

      {/* Gợi ý phong cách mẫu (Preset Chips) */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          Gợi ý phong cách có sẵn
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESET_STYLES.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setValue("instruct", preset.prompt, { shouldValidate: true })}
              className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-xs font-medium text-gray-700 hover:text-blue-700 transition-all text-left"
            >
              ✨ {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input mô tả đặc điểm giọng (Instruct) */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          Mô tả phong cách giọng nói (Voice Description) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("instruct")}
          placeholder="vd: female, young adult, warm tone, vietnamese accent..."
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm font-mono text-xs"
        />
        {errors.instruct && (
          <p className="text-xs text-red-500 mt-1 font-medium">{errors.instruct.message}</p>
        )}
        <p className="text-[11px] text-gray-400 mt-1.5">
          Hỗ trợ kết hợp: giới tính (male/female), độ tuổi (child/young adult/elderly), cao độ (low/high pitch), ngữ điệu (whisper/warm/energetic).
        </p>
      </div>

      {/* Input kịch bản */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          Kịch bản video cần đọc <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={4}
          {...register("text")}
          placeholder="Nhập nội dung bạn muốn giọng thiết kế đọc..."
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-y shadow-sm"
        />
        {errors.text && (
          <p className="text-xs text-red-500 mt-1 font-medium">{errors.text.message}</p>
        )}
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-gray-50/80 border border-gray-100">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-gray-700">Tốc độ đọc:</span>
            <span className="text-xs font-bold text-blue-600">{speedVal}x</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="1.5"
            step="0.1"
            {...register("speed", { valueAsNumber: true })}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-gray-700">Độ sâu Diffusion:</span>
            <span className="text-xs font-bold text-blue-600">{stepsVal} bước</span>
          </div>
          <input
            type="range"
            min="16"
            max="40"
            step="4"
            {...register("num_step", { valueAsNumber: true })}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
      >
        {isPending ? (
          <>
            <FaSpinner className="animate-spin text-base" />
            <span>Đang thiết kế và tổng hợp giọng nói... ({elapsedSeconds}s)</span>
          </>
        ) : (
          <>
            <FaPaintBrush className="text-sm" />
            <span>Thiết Kế & Sinh Giọng Nói</span>
          </>
        )}
      </button>

      {/* Audio Result Player hiển thị trực tiếp ngay bên dưới nút bấm */}
      {result && (
        <div ref={resultRef} className="pt-2 animate-fadeIn">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Kết Quả Giọng Thiết Kế Vừa Tạo
            </span>
          </div>
          <AudioResultPlayer result={result} />
        </div>
      )}
    </form>
  );
};

