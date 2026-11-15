"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaSpinner, FaMagic } from "react-icons/fa";
import {
  voiceSynthesizeSchema,
  VoiceSynthesizeFormValues,
} from "../schema/voice.synthesize.schema";
import { useSynthesizeVoiceAsync } from "../hook/useSynthesizeVoiceAsync";
import { useGetVoiceProfiles } from "../hook/useGetVoiceProfiles";
import { VoiceProfileGrid } from "./VoiceProfileGrid";
import { VoiceSettingsSliders } from "./VoiceSettingsSliders";
import { toast } from "sonner";

interface VoiceSynthesizeCardProps {
  selectedProfileId: string;
  onSelectProfile: (id: string) => void;
  onOpenManageModal: () => void;
  onOpenTrainingForm: () => void;
}

export const VoiceSynthesizeCard: React.FC<VoiceSynthesizeCardProps> = ({
  selectedProfileId,
  onSelectProfile,
  onOpenManageModal,
  onOpenTrainingForm,
}) => {
  const { data: profilesData, isLoading: isLoadingProfiles } = useGetVoiceProfiles();
  const profiles = profilesData?.profiles || [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VoiceSynthesizeFormValues>({
    resolver: zodResolver(voiceSynthesizeSchema) as any,
    defaultValues: {
      profile_id_or_path: selectedProfileId || "",
      text: "Chào mừng bạn đến với kênh Video AI. Hôm nay chúng ta sẽ cùng khám phá công nghệ mới.",
      speed: 1.0,
      num_step: 28,
    },
  });

  useEffect(() => {
    if (selectedProfileId) {
      setValue("profile_id_or_path", selectedProfileId, {
        shouldValidate: true,
      });
    }
  }, [selectedProfileId, setValue]);

  const { mutate: synthesizeVoiceAsync, isPending } = useSynthesizeVoiceAsync();

  const onSubmit = (values: VoiceSynthesizeFormValues) => {
    const selectedVoice = profiles.find((p) => p.profile_id === values.profile_id_or_path);
    synthesizeVoiceAsync({
      payload: values,
      voiceName: selectedVoice?.profile_name || "Giọng Đọc AI",
    });
  };

  const onInvalid = (formErrors: any) => {
    const errorKeys = Object.keys(formErrors);
    if (errorKeys.length > 0) {
      const firstErr = formErrors[errorKeys[0]];
      toast.error(
        firstErr?.message || "Vui lòng chọn kiểu giọng và nhập kịch bản cần đọc!",
        { id: "voice-action" }
      );
    }
  };

  const speedVal = watch("speed");
  const stepsVal = watch("num_step");
  const currentProfileId = watch("profile_id_or_path");

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200/90 shadow-sm space-y-6">
      <div className="pb-4 border-b border-gray-100">
        <h3 className="text-base md:text-lg font-extrabold text-gray-900 tracking-tight">
          2. Chọn Kiểu Giọng &amp; Tạo Thuyết Minh Kịch Bản
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Dùng kiểu giọng đã huấn luyện trên database để đọc bất kỳ văn bản nào
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
        {/* Lưới chọn giọng & phân trang */}
        <VoiceProfileGrid
          profiles={profiles}
          selectedProfileId={currentProfileId || selectedProfileId}
          isLoading={isLoadingProfiles}
          onSelectProfile={(id) => {
            setValue("profile_id_or_path", id, { shouldValidate: true });
            onSelectProfile(id);
          }}
          onOpenManageModal={onOpenManageModal}
          onOpenTrainingForm={onOpenTrainingForm}
        />
        {errors.profile_id_or_path && (
          <p className="text-xs text-red-500 font-medium">
            {errors.profile_id_or_path.message}
          </p>
        )}

        {/* Kịch bản cần đọc */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Kịch Bản Video Cần Đọc <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] text-gray-400">
              Hỗ trợ tiếng Việt, Anh và 600+ ngôn ngữ
            </span>
          </div>

          <textarea
            rows={4}
            {...register("text")}
            placeholder="Nhập hoặc dán nội dung kịch bản bạn muốn AI đọc thuyết minh..."
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-y shadow-sm"
          />
          {errors.text && (
            <p className="text-xs text-red-500 mt-1 font-medium">{errors.text.message}</p>
          )}
        </div>

        {/* Sliders tốc độ & steps */}
        <VoiceSettingsSliders
          register={register}
          speedVal={speedVal}
          stepsVal={stepsVal}
        />

        {/* Nút hành động */}
        <button
          type="submit"
          disabled={isPending || isLoadingProfiles}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold text-sm md:text-base shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2.5 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <FaSpinner className="animate-spin text-lg" />
              <span>Đang gửi vào hàng đợi xử lý ngầm...</span>
            </>
          ) : (
            <>
              <FaMagic className="text-lg" />
              <span>Tạo Giọng Nói Ngay Tức Thì (Chạy Ngầm & Báo Socket)</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
