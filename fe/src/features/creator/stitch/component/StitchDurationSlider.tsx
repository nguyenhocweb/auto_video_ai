"use client";

import React from "react";
import { FaClock, FaCut } from "react-icons/fa";

interface StitchDurationSliderProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  step: number;
  unitText: string;
  hints: [string, string, string];
  isHookSource?: boolean;
  accentColor: "blue" | "purple";
  disabled?: boolean;
}

export const StitchDurationSlider: React.FC<StitchDurationSliderProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unitText,
  hints,
  isHookSource = true,
  accentColor,
  disabled = false,
}) => {
  const isBlue = accentColor === "blue";

  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <label className="font-bold text-gray-700 flex items-center gap-1.5">
          {isHookSource ? <FaClock className="text-gray-400" /> : <FaCut className="text-gray-400" />}
          {label}
        </label>
        <span className={`font-black ${isBlue ? "text-blue-600" : "text-purple-600"}`}>
          {value} {unitText}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={`w-full ${isBlue ? "accent-blue-600" : "accent-purple-600"} cursor-pointer`}
      />
      <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
        <span>{hints[0]}</span>
        <span>{hints[1]}</span>
        <span>{hints[2]}</span>
      </div>
    </div>
  );
};
