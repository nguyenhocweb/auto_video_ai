"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { SceneItem } from "../type/storyboard.type";

interface UseStoryboardHotkeysOptions {
  scenes: SceneItem[];
  activeIdx: number;
  setActiveIdx: (idx: number) => void;
  onUploadImage: (idx: number, file: File) => void;
  onBatchClean: () => void;
}

export const useStoryboardHotkeys = ({
  scenes,
  activeIdx,
  setActiveIdx,
  onUploadImage,
  onBatchClean,
}: UseStoryboardHotkeysOptions) => {
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      if (key === "c") {
        if (!scenes.length) return;
        const targetScene =
          scenes.find((s) => s.scene_idx === activeIdx) || scenes[0];
        if (targetScene?.prompt_en) {
          navigator.clipboard.writeText(targetScene.prompt_en);
          toast.success(`📋 Đã sao chép prompt Cảnh #${targetScene.scene_idx}!`);
        }
      } else if (key === "v") {
        if (!scenes.length) return;
        e.preventDefault();
        try {
          if (!navigator.clipboard?.read) {
            toast.info(`Hãy nhấp vào Cảnh #${activeIdx} và nhấn Ctrl+V để dán ảnh.`);
            return;
          }
          const items = await navigator.clipboard.read();
          for (const item of items) {
            const imageType = item.types.find((t) => t.startsWith("image/"));
            if (imageType) {
              const blob = await item.getType(imageType);
              const ext = imageType.split("/")[1] || "png";
              const file = new File([blob], `scene_${activeIdx}.${ext}`, {
                type: imageType,
              });
              onUploadImage(activeIdx, file);
              const nextScene = scenes.find(
                (s) => s.scene_idx > activeIdx && !s.image_url
              );
              if (nextScene) setActiveIdx(nextScene.scene_idx);
              return;
            }
          }
          toast.error("Không tìm thấy ảnh trong Clipboard. Hãy copy ảnh trước nhé!");
        } catch {
          toast.info(`Hãy nhấp vào Cảnh #${activeIdx} và nhấn Ctrl+V để dán ảnh.`);
        }
      } else if (key === "k") {
        if (!scenes.length) return;
        e.preventDefault();
        onBatchClean();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [scenes, activeIdx, setActiveIdx, onUploadImage, onBatchClean]);
};

