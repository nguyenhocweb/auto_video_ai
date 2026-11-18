import { ParsedSlotItem } from "../type/templates.types";

/**
 * Tạo tự động các file ảnh mẫu giả lập có màu và nhãn slot để test nhanh.
 */
export const generateSampleSlotFiles = (
  slots: ParsedSlotItem[]
): Record<number, File | null> => {
  const canvas = document.createElement("canvas");
  canvas.width = 720;
  canvas.height = 1280;
  const ctx = canvas.getContext("2d");

  const newFiles: Record<number, File | null> = {};
  const sampleColors = ["#334155", "#475569", "#64748b", "#94a3b8"];

  slots.forEach((slot, idx) => {
    if (ctx) {
      ctx.fillStyle = sampleColors[idx % sampleColors.length];
      ctx.fillRect(0, 0, 720, 1280);
      ctx.fillStyle = "#ffffff";
      ctx.font = "500 36px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`SLOT ${slot.slot_id}`, 360, 600);
      ctx.font = "400 24px monospace";
      ctx.fillStyle = "#e2e8f0";
      ctx.fillText(`${slot.slot_type.toUpperCase()} • ${slot.duration}s`, 360, 650);

      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      const byteString = atob(dataUrl.split(",")[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: "image/jpeg" });
      newFiles[slot.slot_id] = new File([blob], `sample_slot_${slot.slot_id}.jpg`, {
        type: "image/jpeg",
      });
    }
  });

  return newFiles;
};
