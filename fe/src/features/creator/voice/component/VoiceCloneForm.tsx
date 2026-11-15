"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaCloudUploadAlt, FaMicrophone, FaMagic, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { voiceCloneSchema, VoiceCloneFormValues } from "../schema/voice.clone.schema";
import { useCloneVoice } from "../hook/useCloneVoice";
import { uploadVoiceSampleService } from "../service/voice.upload.service";
import { AudioGenerationResponse } from "../type/voice.type";
import { AudioResultPlayer } from "./AudioResultPlayer";
import { extractErrorMessage } from "@/src/core/lib/errorHandle";
import { toast } from "sonner";

interface VoiceCloneFormProps {
  onSuccess: (data: AudioGenerationResponse) => void;
}

export const VoiceCloneForm: React.FC<VoiceCloneFormProps> = ({ onSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedSampleName, setUploadedSampleName] = useState<string | null>(null);
  const [result, setResult] = useState<AudioGenerationResponse | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VoiceCloneFormValues>({
    resolver: zodResolver(voiceCloneSchema) as any,
    defaultValues: {
      text: "Chào mừng bạn đến với kênh Video AI. Hôm nay chúng ta sẽ cùng khám phá công nghệ mới.",
      speed: 1.0,
      num_step: 28,
      guidance_scale: 2.0,
      ref_audio_path: "",
    },
  });

  const { mutate: cloneVoice, isPending } = useCloneVoice((data) => {
    setResult(data);
    onSuccess(data);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 150);
  });

  // Đếm giây thời gian sinh giọng thực tế trên CPU
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      toast.error("File mẫu tối đa 20MB!");
      return;
    }

    try {
      setIsUploading(true);
      const res = await uploadVoiceSampleService(file);
      setValue("ref_audio_path", res.sample_path, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      setUploadedSampleName(res.original_name);
      toast.success("Đã tải lên audio mẫu thành công!");
    } catch (err) {
      toast.error(extractErrorMessage(err, "Không thể tải lên file audio mẫu. Vui lòng thử lại!"));
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = (values: VoiceCloneFormValues) => {
    cloneVoice(values);
  };

  const onInvalid = (formErrors: any) => {
    const errorKeys = Object.keys(formErrors);
    if (errorKeys.length > 0) {
      const firstErr = formErrors[errorKeys[0]];
      toast.error(firstErr?.message || "Vui lòng chọn file audio mẫu và nhập kịch bản cần đọc!", {
        id: "voice-action",
      });
    }
  };

  const speedVal = watch("speed");
  const stepsVal = watch("num_step");

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
      {/* Hidden inputs to guarantee registration in React Hook Form */}
      <input type="hidden" {...register("ref_audio_path")} />
      <input type="hidden" {...register("guidance_scale", { valueAsNumber: true })} />

      {/* 1. Upload audio mẫu */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          File giọng mẫu (3 - 10 giây) <span className="text-red-500">*</span>
        </label>

        <div className="border-2 border-dashed border-gray-200 hover:border-blue-500 rounded-2xl p-6 text-center transition-all bg-gray-50/50 hover:bg-blue-50/20">
          <input
            type="file"
            id="voice-sample-upload"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isUploading || isPending}
          />
          <label
            htmlFor="voice-sample-upload"
            className="cursor-pointer flex flex-col items-center justify-center gap-2"
          >
            {isUploading ? (
              <FaSpinner className="animate-spin text-3xl text-blue-600 mb-1" />
            ) : uploadedSampleName ? (
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <FaCheckCircle className="text-2xl" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <FaCloudUploadAlt className="text-2xl" />
              </div>
            )}

            {uploadedSampleName ? (
              <div>
                <p className="text-sm font-bold text-gray-900">{uploadedSampleName}</p>
                <p className="text-xs text-emerald-600 font-semibold mt-0.5">
                  Đã tải lên sẵn sàng • Bấm để chọn file khác
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-bold text-gray-800">
                  {isUploading ? "Đang tải file lên..." : "Tải lên file ghi âm mẫu (.wav, .mp3)"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Đoạn nói 3 – 10 giây rõ tiếng, không lẫn nhạc nền
                </p>
              </div>
            )}
          </label>
        </div>
        {errors.ref_audio_path && (
          <p className="text-xs text-red-500 mt-1.5 font-medium">
            {errors.ref_audio_path.message}
          </p>
        )}
      </div>

      {/* 2. Nhập văn bản kịch bản */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          Kịch bản video cần đọc <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={4}
          {...register("text")}
          placeholder="Nhập nội dung bạn muốn giọng AI đọc..."
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-y shadow-sm"
        />
        {errors.text && (
          <p className="text-xs text-red-500 mt-1 font-medium">{errors.text.message}</p>
        )}
      </div>

      {/* 3. Tinh chỉnh thông số nâng cao */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-gray-50/80 border border-gray-100">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-gray-700">Tốc độ nói:</span>
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
            <span className="text-xs font-semibold text-gray-700">Độ chi tiết (Diffusion Steps):</span>
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
        disabled={isPending || isUploading}
        className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>
            <FaSpinner className="animate-spin text-base" />
            <span>
              Đang tổng hợp giọng nói qua OmniVoice AI... ({elapsedSeconds}s)
            </span>
          </>
        ) : (
          <>
            <FaMagic className="text-base" />
            <span>Tạo Giọng Nói Ngay Tức Thì</span>
          </>
        )}
      </button>

      {/* Audio Result Player hiển thị trực tiếp ngay bên dưới nút bấm */}
      {result && (
        <div ref={resultRef} className="pt-2 animate-fadeIn">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Kết Quả Giọng Nói Vừa Tạo
            </span>
          </div>
          <AudioResultPlayer result={result} />
        </div>
      )}
    </form>
  );
};

