"use client";

import React from "react";
import { FiImage, FiVideo, FiTrash2 } from "react-icons/fi";
import { SlotRequirement } from "../type/slicer.type";

interface SlotConfigItemProps {
  index: number;
  slot: SlotRequirement;
  onUpdate: (index: number, updated: SlotRequirement) => void;
  onDelete: (index: number) => void;
  canDelete: boolean;
}

export const SlotConfigItem: React.FC<SlotConfigItemProps> = ({
  index,
  slot,
  onUpdate,
  onDelete,
  canDelete,
}) => {
  return (
    <div className="flex items-center gap-3 p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition">
      <div className="w-8 h-8 rounded-md bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300 shrink-0">
        #{index + 1}
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => onUpdate(index, { ...slot, type: "image", duration: undefined })}
          className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded font-medium transition ${
            slot.type === "image"
              ? "bg-emerald-600 text-white"
              : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <FiImage className="w-3.5 h-3.5" />
          Ảnh
        </button>
        <button
          type="button"
          onClick={() => onUpdate(index, { ...slot, type: "video", duration: slot.duration || 2.0 })}
          className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded font-medium transition ${
            slot.type === "video"
              ? "bg-violet-600 text-white"
              : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <FiVideo className="w-3.5 h-3.5" />
          Clip
        </button>
      </div>

      {slot.type === "video" && (
        <div className="flex items-center gap-1.5 shrink-0">
          <input
            type="number"
            step="0.5"
            min="0.5"
            max="15.0"
            value={slot.duration || 2.0}
            onChange={(e) =>
              onUpdate(index, {
                ...slot,
                duration: Math.max(0.5, parseFloat(e.target.value) || 2.0),
              })
            }
            className="w-16 px-2 py-1 text-xs bg-zinc-950 border border-zinc-700 rounded text-center text-white focus:outline-none focus:border-violet-500"
          />
          <span className="text-xs text-zinc-400">giây</span>
        </div>
      )}

      <input
        type="text"
        placeholder="Ghi chú (VD: cận cảnh, góc nghiêng...)"
        value={slot.description || ""}
        onChange={(e) => onUpdate(index, { ...slot, description: e.target.value })}
        className="flex-1 px-2.5 py-1 text-xs bg-zinc-950/60 border border-zinc-800 rounded text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
      />

      {canDelete && (
        <button
          type="button"
          onClick={() => onDelete(index)}
          className="p-1.5 text-zinc-500 hover:text-red-400 transition shrink-0"
          title="Xóa slot này"
        >
          <FiTrash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

