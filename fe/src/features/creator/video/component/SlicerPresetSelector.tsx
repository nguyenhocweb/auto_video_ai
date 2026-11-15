"use client";

import React from "react";
import { PRESET_TEMPLATES } from "../constants/slicer.constants";
import { SlotRequirement } from "../type/slicer.type";

interface SlicerPresetSelectorProps {
  onSelectPreset: (slots: SlotRequirement[]) => void;
}

export const SlicerPresetSelector: React.FC<SlicerPresetSelectorProps> = ({
  onSelectPreset,
}) => {
  return (
    <div>
      <label className="block text-xs font-semibold text-zinc-300 mb-2">
        Chọn Mẫu Nhanh (Preset Blueprints)
      </label>
      <div className="space-y-2">
        {PRESET_TEMPLATES.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectPreset(p.slots)}
            className="w-full p-2.5 text-left rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-violet-500/50 hover:bg-zinc-900 transition group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-200 group-hover:text-violet-300 transition">
                {p.name}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                {p.slots.length} slots
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">{p.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

