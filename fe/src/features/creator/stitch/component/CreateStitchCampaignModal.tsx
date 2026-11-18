"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import {
  AutomationCampaign,
  AutomationCampaignCreatePayload,
  SourceChannelConfig,
  TargetPageConfig,
  TargetYouTubeChannelConfig,
} from "@/src/features/creator/automation/type/automation.type";
import { CreateStitchModalHeader } from "./CreateStitchModalHeader";
import { CreateStitchModalFooter } from "./CreateStitchModalFooter";
import { StitchHookSourceSection } from "./StitchHookSourceSection";
import { StitchBodySourceSection } from "./StitchBodySourceSection";
import { StitchFormatTransitionSection } from "./StitchFormatTransitionSection";
import { StitchAudioModeSection, StitchAudioMode } from "./StitchAudioModeSection";
import { CrawlStrategySection } from "@/src/features/creator/automation/component/CrawlStrategySection";
import { TargetPageSelector } from "@/src/features/creator/automation/component/TargetPageSelector";
import { TargetYouTubeChannelSelector } from "@/src/features/creator/automation/component/TargetYouTubeChannelSelector";
import { HashtagConfigSection } from "@/src/features/creator/automation/component/HashtagConfigSection";

interface CreateStitchCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: AutomationCampaignCreatePayload) => void;
  isLoading?: boolean;
  initialData?: AutomationCampaign | null;
}

export const CreateStitchCampaignModal: React.FC<CreateStitchCampaignModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  initialData = null,
}) => {
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [hookChannels, setHookChannels] = useState<SourceChannelConfig[]>([]);
  const [hookDurationSec, setHookDurationSec] = useState<number>(3.5);
  const [bodyChannels, setBodyChannels] = useState<SourceChannelConfig[]>([]);
  const [bodySkipSec, setBodySkipSec] = useState<number>(3.0);
  const [aspectRatio, setAspectRatio] = useState<"9:16" | "16:9">("9:16");
  const [transitionDurationSec, setTransitionDurationSec] = useState<number>(1.2);
  const [audioMode, setAudioMode] = useState<StitchAudioMode>("body_audio");
  const [selectedBgmIds, setSelectedBgmIds] = useState<string[]>([]);
  const [targetPages, setTargetPages] = useState<TargetPageConfig[]>([]);
  const [targetYouTubeChannels, setTargetYouTubeChannels] = useState<TargetYouTubeChannelConfig[]>([]);
  const [fbPostType, setFbPostType] = useState<"reel" | "feed">("reel");
  const [ytVideoType, setYtVideoType] = useState<"video" | "shorts">("shorts");
  const [intervalMin, setIntervalMin] = useState<number>(240);
  const [maxVideoAgeHours, setMaxVideoAgeHours] = useState<number>(4);
  const [onlyNew, setOnlyNew] = useState<boolean>(true);
  const [autoAddTag, setAutoAddTag] = useState<boolean>(true);
  const [hashtags, setHashtags] = useState<string>("#Shorts #Reels #Viral #Douyin");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setBodyChannels(initialData.source_channels || []);
      const ds = initialData.dual_source;
      setHookChannels(ds?.hook_channels || []);
      setHookDurationSec(ds?.hook_duration_sec ?? 3.5);
      setBodySkipSec(ds?.body_skip_start_sec ?? 3.0);
      setAspectRatio(ds?.aspect_ratio ?? "9:16");
      setTransitionDurationSec(ds?.transition_duration_sec ?? 1.2);
      setAudioMode(ds?.audio_mode ?? "body_audio");
      setSelectedBgmIds(initialData.selected_bgm_ids || []);
      setTargetPages(initialData.target_pages || []);
      setTargetYouTubeChannels(initialData.target_youtube_channels || []);
      setFbPostType(initialData.fb_post_type || "reel");
      setYtVideoType(initialData.youtube_video_type || "shorts");
      setIntervalMin(initialData.crawl_interval_minutes || 240);
      setMaxVideoAgeHours(initialData.max_video_age_hours ?? 4);
      setOnlyNew(initialData.only_new_unprocessed ?? true);
      setAutoAddTag(initialData.auto_add_title_tag ?? true);
      setHashtags(initialData.hashtags || "#Shorts #Reels #Viral #Douyin");
    } else {
      setName("");
      setHookChannels([]);
      setHookDurationSec(3.5);
      setBodyChannels([]);
      setBodySkipSec(3.0);
      setAspectRatio("9:16");
      setTransitionDurationSec(1.2);
      setAudioMode("body_audio");
      setSelectedBgmIds([]);
      setTargetPages([]);
      setTargetYouTubeChannels([]);
      setFbPostType("reel");
      setYtVideoType("shorts");
      setIntervalMin(240);
      setMaxVideoAgeHours(4);
      setOnlyNew(true);
      setAutoAddTag(true);
      setHashtags("#Shorts #Reels #Viral #Douyin");
    }
  }, [initialData, isOpen]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.warning("Vui lòng nhập tên chiến dịch Auto Ghép Nối!");
      return;
    }
    if (hookChannels.length === 0) {
      toast.warning("Vui lòng chọn ít nhất 1 kênh Douyin Đoạn Đầu (Hook)!");
      return;
    }
    if (bodyChannels.length === 0) {
      toast.warning("Vui lòng chọn ít nhất 1 kênh Douyin Đoạn Đuôi (Thân Bài)!");
      return;
    }
    if (targetPages.length === 0 && targetYouTubeChannels.length === 0) {
      toast.warning("Vui lòng chọn ít nhất 1 Fanpage Facebook hoặc 1 Kênh YouTube Shorts đích!");
      return;
    }

    onSubmit({
      name: name.trim(),
      source_channels: bodyChannels,
      dual_source: {
        enabled: true,
        hook_channels: hookChannels,
        hook_duration_sec: hookDurationSec,
        body_skip_start_sec: bodySkipSec,
        aspect_ratio: aspectRatio,
        transition_duration_sec: transitionDurationSec,
        audio_mode: audioMode,
        fallback_policy: "reuse_oldest",
      },
      target_pages: targetPages,
      target_youtube_channels: targetYouTubeChannels,
      publish_to_youtube: targetYouTubeChannels.length > 0,
      youtube_video_type: ytVideoType,
      fb_post_type: fbPostType,
      crawl_interval_minutes: Number(intervalMin),
      only_today: maxVideoAgeHours > 0 && maxVideoAgeHours <= 24,
      max_video_age_hours: Number(maxVideoAgeHours),
      only_new_unprocessed: onlyNew,
      processing_mode: "download_only",
      selected_bgm_ids: selectedBgmIds,
      keep_original_audio: audioMode !== "bgm_override",
      auto_add_title_tag: autoAddTag,
      hashtags: hashtags.trim(),
      remove_subtitles: true,
      caption_template: "{title}",
      is_active: true,
    });
  };

  return createPortal(
    <div className="fixed inset-0 w-screen h-screen z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col max-h-[92vh] overflow-hidden my-auto">
        <CreateStitchModalHeader isEditing={Boolean(initialData)} onClose={onClose} />

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs text-gray-700">
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              Tên chiến dịch Auto Ghép Nối:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Auto Ghép Girl + Xe Douyin -> Reels & Shorts"
              className="w-full px-3.5 py-2 border border-gray-300 rounded-xl outline-none focus:border-indigo-500 font-medium text-xs"
            />
          </div>

          <StitchHookSourceSection
            selectedChannels={hookChannels}
            onChangeChannels={setHookChannels}
            hookDuration={hookDurationSec}
            onChangeDuration={setHookDurationSec}
            disabled={isLoading}
          />

          <StitchBodySourceSection
            selectedChannels={bodyChannels}
            onChangeChannels={setBodyChannels}
            bodySkipSec={bodySkipSec}
            onChangeBodySkip={setBodySkipSec}
            disabled={isLoading}
          />

          <StitchAudioModeSection
            value={audioMode}
            onChange={setAudioMode}
            selectedBgmIds={selectedBgmIds}
            onChangeBgmIds={setSelectedBgmIds}
            disabled={isLoading}
          />

          <StitchFormatTransitionSection
            aspectRatio={aspectRatio}
            onChangeAspectRatio={setAspectRatio}
            transitionDuration={transitionDurationSec}
            onChangeTransitionDuration={setTransitionDurationSec}
            disabled={isLoading}
          />

          <CrawlStrategySection
            intervalMin={intervalMin}
            onChangeInterval={setIntervalMin}
            maxVideoAgeHours={maxVideoAgeHours}
            onChangeMaxVideoAgeHours={setMaxVideoAgeHours}
            onlyNew={onlyNew}
            onChangeOnlyNew={setOnlyNew}
          />

          <TargetPageSelector
            selectedPages={targetPages}
            onChange={setTargetPages}
            postType={fbPostType}
            onChangePostType={setFbPostType}
          />

          <TargetYouTubeChannelSelector
            selectedChannels={targetYouTubeChannels}
            onChange={setTargetYouTubeChannels}
            videoType={ytVideoType}
            onChangeVideoType={setYtVideoType}
          />

          <HashtagConfigSection
            autoAddTag={autoAddTag}
            onChangeAutoAdd={setAutoAddTag}
            hashtags={hashtags}
            onChangeHashtags={setHashtags}
          />
        </form>

        <CreateStitchModalFooter
          isEditing={Boolean(initialData)}
          isLoading={isLoading}
          onClose={onClose}
          onSubmit={handleSubmit}
        />
      </div>
    </div>,
    document.body
  );
};
