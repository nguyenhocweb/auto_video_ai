import { SlotRequirement } from "../type/slicer.type";

export interface SlicerPreset {
  name: string;
  desc: string;
  slots: SlotRequirement[];
}

export const PRESET_TEMPLATES: SlicerPreset[] = [
  {
    name: "Mẫu 6 ô (4 ảnh + 2 clip)",
    desc: "Mẫu thịnh hành: clip mở đầu, ảnh lướt, clip cao trào",
    slots: [
      { id: "1", type: "video", duration: 2.0, description: "Clip mở đầu" },
      { id: "2", type: "image", description: "Ảnh cận mặt" },
      { id: "3", type: "image", description: "Ảnh góc nghiêng" },
      { id: "4", type: "video", duration: 2.5, description: "Clip chuyển động" },
      { id: "5", type: "image", description: "Ảnh toàn thân" },
      { id: "6", type: "image", description: "Ảnh kết thúc" },
    ],
  },
  {
    name: "Mẫu 8 ảnh giật beat",
    desc: "Mẫu ảnh nhanh theo nhịp nhạc acoustic/remix",
    slots: Array.from({ length: 8 }, (_, i) => ({
      id: `${i + 1}`,
      type: "image",
      description: `Ảnh beat #${i + 1}`,
    })),
  },
  {
    name: "Mẫu 4 clip chill (Vlog/Story)",
    desc: "Cắt 4 đoạn ngắn 2.5s lofi cinematic",
    slots: [
      { id: "1", type: "video", duration: 2.5, description: "Cảnh 1" },
      { id: "2", type: "video", duration: 2.5, description: "Cảnh 2" },
      { id: "3", type: "video", duration: 2.5, description: "Cảnh 3" },
      { id: "4", type: "video", duration: 2.5, description: "Cảnh 4" },
    ],
  },
];

