"use client";

import React from "react";
import { UseFormRegister } from "react-hook-form";
import { FaSlidersH } from "react-icons/fa";
import { VoiceSynthesizeFormValues } from "../schema/voice.synthesize.schema";

interface VoiceSettingsSlidersProps {
  register: UseFormRegister<VoiceSynthesizeFormValues>;
  speedVal: number;
  stepsVal: number;
}

export const VoiceSettingsSliders: React.FC<VoiceSettingsSlidersProps> = ({
  register,
  speedVal,
  stepsVal,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-gray-50/70 border border-gray-100">
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
            <FaSlidersH className="text-gray-400 text-[10px]" /> Tốc độ nói:
          </span>
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
          <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
            <FaSlidersH className="text-gray-400 text-[10px]" /> Độ chi tiết (Steps):
          </span>
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
  );
};

