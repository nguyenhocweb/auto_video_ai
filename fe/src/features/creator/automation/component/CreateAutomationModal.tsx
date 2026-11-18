"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import {
  AutomationCampaign,
  AutomationCampaignCreatePayload,
  ProcessingMode,
  SourceChannelConfig,
  TargetPageConfig,
  TargetYouTubeChannelConfig,
} from "../type/automation.type";
import { CreateAutomationModalHeader } from "./CreateAutomationModalHeader";
import { CreateAutomationModalFooter } from "./CreateAutomationModalFooter";
import { SourceChannelSelector } from "./SourceChannelSelector";
import { TargetPageSelector } from "./TargetPageSelector";
import { TargetYouTubeChannelSelector } from "./TargetYouTubeChannelSelector";
import { CrawlStrategySection } from "./CrawlStrategySection";
import { ProcessingModeSelector } from "./ProcessingModeSelector";
import { HashtagConfigSection } from "./HashtagConfigSection";

interface CreateAutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: AutomationCampaignCreatePayload) => void;
  isLoading?: boolean;
  initialData?: AutomationCampaign | null;
}

export const CreateAutomationModal: React.FC<CreateAutomationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  initialData = null,
}) => {
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [sourceChannels, setSourceChannels] = useState<SourceChannelConfig[]>([]);
  const [targetPages, setTargetPages] = useState<TargetPageConfig[]>([]);
  const [targetYouTubeChannels, setTargetYouTubeChannels] = useState<TargetYouTubeChannelConfig[]>([]);
  const [fbPostType, setFbPostType] = useState<"reel" | "feed">("reel");
  const [ytVideoType, setYtVideoType] = useState<"video" | "shorts">("shorts");
  const [intervalMin, setIntervalMin] = useState<number>(30);
  const [onlyToday, setOnlyToday] = useState(true);
  const [maxVideoAgeHours, setMaxVideoAgeHours] = useState<number>(24);
  const [onlyNew, setOnlyNew] = useState(true);
  const [mode, setMode] = useState<ProcessingMode>("both");
  const [voiceSource, setVoiceSource] = useState<"preset" | "profile">("preset");
  const [voicePreset, setVoicePreset] = useState("vi-VN-NamMinhNeural");
  const [voiceProfileId, setVoiceProfileId] = useState<string | undefined>(undefined);
  const [voiceName, setVoiceName] = useState<string | undefined>(undefined);
  const [selectedBgmIds, setSelectedBgmIds] = useState<string[]>([]);
  const [keepOriginalAudio, setKeepOriginalAudio] = useState(false);
  const [autoAddTag, setAutoAddTag] = useState(true);
  const [hashtags, setHashtags] = useState("#Douyin #Reels #Shorts #Viral");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setSourceChannels(initialData.source_channels);
      setTargetPages(initialData.target_pages);
      setTargetYouTubeChannels(initialData.target_youtube_channels || []);
      setFbPostType(initialData.fb_post_type || "reel");
      setYtVideoType(initialData.youtube_video_type || "shorts");
      setIntervalMin(initialData.crawl_interval_minutes);
      setOnlyToday(initialData.only_today);
      setMaxVideoAgeHours(
        initialData.max_video_age_hours !== undefined
          ? initialData.max_video_age_hours
          : initialData.only_today ? 24 : 0
      );
      setOnlyNew(initialData.only_new_unprocessed);
      setMode(initialData.processing_mode);
      setVoiceSource(initialData.voice_source || (initialData.voice_profile_id ? "profile" : "preset"));
      setVoicePreset(initialData.voice_preset || "vi-VN-NamMinhNeural");
      setVoiceProfileId(initialData.voice_profile_id);
      setVoiceName(initialData.voice_name);
      setSelectedBgmIds(initialData.selected_bgm_ids || []);
      setKeepOriginalAudio(initialData.keep_original_audio || false);
      setAutoAddTag(initialData.auto_add_title_tag);
      setHashtags(initialData.hashtags || "#Douyin #Reels #Shorts #Viral");
    } else {
      setName("");
      setSourceChannels([]);
      setTargetPages([]);
      setTargetYouTubeChannels([]);
      setFbPostType("reel");
      setYtVideoType("shorts");
      setIntervalMin(30);
      setOnlyToday(true);
      setMaxVideoAgeHours(24);
      setOnlyNew(true);
      setMode("both");
      setVoiceSource("preset");
      setVoicePreset("vi-VN-NamMinhNeural");
      setVoiceProfileId(undefined);
      setVoiceName(undefined);
      setSelectedBgmIds([]);
      setKeepOriginalAudio(false);
      setAutoAddTag(true);
      setHashtags("#Douyin #Reels #Shorts #Viral");
    }
  }, [initialData, isOpen]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.warning("Vui lòng nhập tên chiến dịch Automation!");
      return;
    }
    if (sourceChannels.length === 0) {
      toast.warning("Vui lòng chọn ít nhất 1 kênh Douyin nguồn!");
      return;
    }
    if (targetPages.length === 0 && targetYouTubeChannels.length === 0) {
      toast.warning("Vui lòng chọn ít nhất 1 Fanpage Facebook hoặc 1 Kênh YouTube Shorts đích!");
      return;
    }

    onSubmit({
      name: name.trim(),
      source_channels: sourceChannels,
      target_pages: targetPages,
      target_youtube_channels: targetYouTubeChannels,
      publish_to_youtube: targetYouTubeChannels.length > 0,
      youtube_video_type: ytVideoType,
      fb_post_type: fbPostType,
      crawl_interval_minutes: Number(intervalMin),
      only_today: maxVideoAgeHours > 0 && maxVideoAgeHours <= 24,
      max_video_age_hours: Number(maxVideoAgeHours),
      only_new_unprocessed: onlyNew,
      processing_mode: mode,
      voice_source: voiceSource,
      voice_preset: voicePreset,
      voice_profile_id: voiceProfileId,
      voice_name: voiceName,
      selected_bgm_ids: selectedBgmIds,
      keep_original_audio: keepOriginalAudio,
      auto_add_title_tag: autoAddTag,
      hashtags: hashtags.trim(),
      remove_subtitles: true,
      caption_template: "{title}",
      is_active: true,
    });
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col max-h-[92vh] overflow-hidden my-auto">
        <CreateAutomationModalHeader isEditing={Boolean(initialData)} onClose={onClose} />

        {/* Nội dung Form cuộn */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-gray-700">
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              Tên chiến dịch Automation:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Cào Kênh Hoạt Hình Douyin -> FB Reels & Shorts"
              className="w-full px-3.5 py-2 border border-gray-300 rounded-xl outline-none focus:border-blue-500 font-medium"
            />
          </div>

          {/* Kênh nguồn Douyin */}
          <SourceChannelSelector
            selectedChannels={sourceChannels}
            onChange={(chs) => setSourceChannels(chs)}
          />

          {/* Chiến lược cào: Khoảng thời gian nào & Cách bao lâu cào 1 lần */}
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
            onChange={(pages) => setTargetPages(pages)}
            postType={fbPostType}
            onChangePostType={setFbPostType}
          />

          <TargetYouTubeChannelSelector
            selectedChannels={targetYouTubeChannels}
            onChange={(chs) => setTargetYouTubeChannels(chs)}
            videoType={ytVideoType}
            onChangeVideoType={setYtVideoType}
          />

          <ProcessingModeSelector
            mode={mode}
            onChangeMode={setMode}
            voiceSource={voiceSource}
            voicePreset={voicePreset}
            voiceProfileId={voiceProfileId}
            selectedBgmIds={selectedBgmIds}
            onChangeSelectedBgmIds={setSelectedBgmIds}
            keepOriginalAudio={keepOriginalAudio}
            onChangeKeepOriginalAudio={setKeepOriginalAudio}
            onChangeVoiceConfig={(src, idOrPreset, vName) => {
              setVoiceSource(src);
              if (src === "profile") {
                setVoiceProfileId(idOrPreset);
                setVoicePreset("vi-VN-NamMinhNeural");
              } else {
                setVoicePreset(idOrPreset);
                setVoiceProfileId(undefined);
              }
              setVoiceName(vName);
            }}
          />

          <HashtagConfigSection
            autoAddTag={autoAddTag}
            onChangeAutoAdd={setAutoAddTag}
            hashtags={hashtags}
            onChangeHashtags={setHashtags}
          />
        </form>

        <CreateAutomationModalFooter
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
