"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FaCloudUploadAlt,
  FaCheckCircle,
  FaSpinner,
  FaDatabase,
} from "react-icons/fa";
import {
  voiceProfileSchema,
  VoiceProfileFormValues,
} from "../schema/voice.profile.schema";
import { useCreateVoiceProfile } from "../hook/useCreateVoiceProfile";
import { uploadVoiceSampleService } from "../service/voice.upload.service";
import { extractErrorMessage } from "@/src/core/lib/errorHandle";
import { toast } from "sonner";

interface VoiceQuickSampleFormProps {
  onProfileCreated?: (profileId: string) => void;
}

export const VoiceQuickSampleForm: React.FC<VoiceQuickSampleFormProps> = ({
  onProfileCreated,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedSampleName, setUploadedSampleName] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<VoiceProfileFormValues>({
    resolver: zodResolver(voiceProfileSchema) as any,
    defaultValues: {
      profile_name: "",
      ref_audio_path: "",
      gender: "NEUTRAL",
      description: "",
      ref_text: "",
    },
  });

  const { mutate: createProfile, isPending } = useCreateVoiceProfile((data) => {
    reset();
    setUploadedSampleName(null);
    if (data?.profile_id && onProfileCreated) {
      onProfileCreated(data.profile_id);
    }
  });

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
      toast.success("Tải lên và xử lý audio mẫu thành công!");
    } catch (err) {
      toast.error(
        extractErrorMessage(err, "Không thể tải file mẫu. Vui lòng thử lại!")
      );
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = (values: VoiceProfileFormValues) => {
    createProfile(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-4">
        {/* Dropzone file ghi âm mẫu 3-10s */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            File Ghi Âm Mẫu (3 - 10 Giây) <span className="text-red-500">*</span>
          </label>
          <div className="relative border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-2xl p-5 text-center bg-gray-50/50 hover:bg-blue-50/20 transition-all flex flex-col items-center justify-center min-h-[130px] cursor-pointer group">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <FaSpinner className="animate-spin text-blue-600 text-2xl" />
                <span className="text-xs text-gray-600 font-semibold">
                  Đang tải lên và làm sạch âm thanh...
                </span>
              </div>
            ) : uploadedSampleName ? (
              <div className="flex flex-col items-center gap-1">
                <FaCheckCircle className="text-emerald-500 text-2xl" />
                <span className="text-xs font-bold text-gray-800 truncate max-w-[260px]">
                  {uploadedSampleName}
                </span>
                <span className="text-[10px] text-gray-400">Click để thay đổi file khác</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 group-hover:bg-blue-200 text-blue-600 flex items-center justify-center transition-all">
                  <FaCloudUploadAlt className="text-lg" />
                </div>
                <p className="text-xs font-bold text-gray-700">Tải lên file giọng (.mp3, .wav)</p>
                <p className="text-[10px] text-gray-400">Đoạn nói 3 – 10 giây rõ ràng, không lẫn tạp âm</p>
              </div>
            )}
          </div>
          {errors.ref_audio_path && (
            <p className="text-xs text-red-500 mt-1 font-medium">{errors.ref_audio_path.message}</p>
          )}
        </div>

        {/* Cài đặt thông tin */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Đặt Tên Kiểu Giọng Nói <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("profile_name")}
              placeholder="VD: Giọng Nam BTV Thời Sự, Giọng Nữ Truyền Cảm..."
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
            />
            {errors.profile_name && (
              <p className="text-xs text-red-500 mt-1 font-medium">{errors.profile_name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Giới Tính Giọng
              </label>
              <select
                {...register("gender")}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              >
                <option value="MALE">Nam (Male)</option>
                <option value="FEMALE">Nữ (Female)</option>
                <option value="NEUTRAL">Trung tính (Neutral)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Phong Cách / Ghi Chú
              </label>
              <input
                type="text"
                {...register("description")}
                placeholder="VD: Đọc tin tức, review xe..."
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending || isUploading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isPending ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Đang trích xuất embedding và lưu vào database...</span>
              </>
            ) : (
              <>
                <FaDatabase className="text-xs" />
                <span>Huấn Luyện &amp; Lưu Kiểu Giọng Vào Database</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

