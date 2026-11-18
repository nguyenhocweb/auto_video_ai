"use client";

import React, { useState } from "react";
import { FaLink, FaEye, FaCloudUploadAlt } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
import { useGetSavedChannels } from "@/src/features/creator/video/hook/useGetSavedChannels";
import { crawlChannelTodayService } from "@/src/features/creator/video/service/video.crawl.service";
import { ChannelVideoItem } from "@/src/features/creator/video/type/video.type";
import { StitchSavedChannelsList } from "./StitchSavedChannelsList";
import { StitchScannedVideosGrid } from "./StitchScannedVideosGrid";
import { StitchDurationSlider } from "./StitchDurationSlider";
import { StitchFileUploadInput } from "./StitchFileUploadInput";
import { toast } from "sonner";

interface StitchChannelPickerProps {
  label: string;
  badgeNumber: number;
  badgeText: string;
  accentColor: "blue" | "purple";
  selectedUrl: string;
  onSelectUrl: (url: string) => void;
  sliderValue: number;
  onSliderChange: (val: number) => void;
  sliderMin: number;
  sliderMax: number;
  sliderStep: number;
  sliderLabel: string;
  sliderUnitText: string;
  sliderHints: [string, string, string];
  isHookSource?: boolean;
  disabled?: boolean;
}

export const StitchChannelPicker: React.FC<StitchChannelPickerProps> = ({
  label,
  badgeNumber,
  badgeText,
  accentColor,
  selectedUrl,
  onSelectUrl,
  sliderValue,
  onSliderChange,
  sliderMin,
  sliderMax,
  sliderStep,
  sliderLabel,
  sliderUnitText,
  sliderHints,
  isHookSource = true,
  disabled = false,
}) => {
  const { data: savedData, isLoading: isLoadingSaved } = useGetSavedChannels();
  const savedChannels = savedData?.channels || [];

  const [inputMode, setInputMode] = useState<"channel" | "direct" | "upload">("channel");
  const [selectedChannelUrls, setSelectedChannelUrls] = useState<string[]>([]);
  const [customChannelUrl, setCustomChannelUrl] = useState("");
  const [maxAgeHours, setMaxAgeHours] = useState<number>(24);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedVideos, setScannedVideos] = useState<ChannelVideoItem[]>([]);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState<string>("");

  const isBlue = accentColor === "blue";
  const borderClass = isBlue ? "border-blue-200 bg-blue-50/20" : "border-purple-200 bg-purple-50/20";
  const badgeColorClass = isBlue ? "bg-blue-600 text-white" : "bg-purple-600 text-white";
  const headerTextClass = isBlue ? "text-blue-800" : "text-purple-800";
  const ringAccent = isBlue ? "focus:ring-blue-500/30 focus:border-blue-500" : "focus:ring-purple-500/30 focus:border-purple-500";

  const toggleChannelSelection = (url: string) => {
    if (selectedChannelUrls.includes(url)) {
      setSelectedChannelUrls(selectedChannelUrls.filter((u) => u !== url));
    } else {
      setSelectedChannelUrls([...selectedChannelUrls, url]);
    }
  };

  const handleScanLatestVideos = async () => {
    const urlsToScan = [...selectedChannelUrls];
    if (customChannelUrl.trim() && !urlsToScan.includes(customChannelUrl.trim())) {
      urlsToScan.push(customChannelUrl.trim());
    }

    if (urlsToScan.length === 0) {
      toast.warning("Vui lòng chọn ít nhất 1 kênh từ danh sách hoặc dán link kênh!");
      return;
    }

    setIsScanning(true);
    try {
      const allVideos: ChannelVideoItem[] = [];
      for (const chUrl of urlsToScan) {
        try {
          const res = await crawlChannelTodayService({ url: chUrl, limit: 6 });
          if (res?.videos?.length) {
            allVideos.push(...res.videos);
          }
        } catch (e: any) {
          console.warn(`Lỗi crawl kênh ${chUrl}:`, e);
        }
      }

      if (allVideos.length === 0) {
        toast.error("Không tìm thấy video nào từ kênh đã chọn. Vui lòng kiểm tra lại link kênh!");
        return;
      }

      allVideos.sort((a, b) => (b.created_timestamp || 0) - (a.created_timestamp || 0));

      // Lọc theo khoảng thời gian video đăng nếu có yêu cầu
      let targetList = allVideos;
      if (maxAgeHours > 0) {
        const nowSec = Date.now() / 1000;
        const cutoffSec = nowSec - maxAgeHours * 3600;
        const filtered = allVideos.filter((v) => {
          if (v.created_timestamp && v.created_timestamp > 0) {
            return v.created_timestamp >= cutoffSec;
          }
          return v.is_today;
        });
        if (filtered.length > 0) {
          targetList = filtered;
        } else {
          toast.info(`Không có video trong ${maxAgeHours}h qua. Đã chọn video mới nhất hiện có.`);
        }
      }

      setScannedVideos(targetList);

      // Tự động chọn video mới nhất đầu tiên
      const newestVideo = targetList[0];
      onSelectUrl(newestVideo.video_url);
      setSelectedVideoTitle(newestVideo.title || "Video mới nhất");
      toast.success(
        `Đã quét được ${targetList.length} video (${maxAgeHours > 0 ? `trong ${maxAgeHours}h qua` : "tất cả"})! Tự động chọn video mới nhất: "${newestVideo.title?.slice(0, 35)}..."`
      );
    } catch (err: any) {
      toast.error(err?.message || "Lỗi khi quét kênh!");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className={`p-4 rounded-xl border ${borderClass} space-y-4`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className={`text-xs font-black uppercase ${headerTextClass} tracking-wider flex items-center gap-2`}>
          <span className={`w-5 h-5 rounded-full ${badgeColorClass} flex items-center justify-center text-[10px]`}>
            {badgeNumber}
          </span>
          {label}
        </span>
        <span
          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
            isBlue ? "text-blue-600 bg-blue-100" : "text-purple-600 bg-purple-100"
          }`}
        >
          {badgeText}
        </span>
      </div>

      {/* Tabs chuyển chế độ: Quét từ Kênh vs Dán link trực tiếp vs Tải từ máy */}
      <div className="flex gap-1.5 p-1 bg-gray-100 rounded-lg text-[11px] font-bold">
        <button
          type="button"
          onClick={() => setInputMode("channel")}
          className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            inputMode === "channel" ? "bg-white text-gray-800 shadow-xs" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <SiTiktok className="text-[10px]" /> Quét Kênh
        </button>
        <button
          type="button"
          onClick={() => setInputMode("upload")}
          className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            inputMode === "upload" ? "bg-white text-gray-800 shadow-xs" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <FaCloudUploadAlt className="text-[11px]" /> Tải File Lên
        </button>
        <button
          type="button"
          onClick={() => setInputMode("direct")}
          className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            inputMode === "direct" ? "bg-white text-gray-800 shadow-xs" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <FaLink className="text-[10px]" /> Dán Link
        </button>
      </div>

      {/* Chế độ 1: Chọn Kênh và Quét video mới nhất */}
      {inputMode === "channel" ? (
        <div className="space-y-3">
          <StitchSavedChannelsList
            savedChannels={savedChannels}
            isLoadingSaved={isLoadingSaved}
            selectedUrls={selectedChannelUrls}
            onToggleChannel={toggleChannelSelection}
            customUrl={customChannelUrl}
            onChangeCustomUrl={setCustomChannelUrl}
            maxAgeHours={maxAgeHours}
            onChangeMaxAgeHours={setMaxAgeHours}
            onScan={handleScanLatestVideos}
            isScanning={isScanning}
            accentColor={accentColor}
            disabled={disabled}
          />
          <StitchScannedVideosGrid
            videos={scannedVideos}
            selectedUrl={selectedUrl}
            onSelect={(url, title) => {
              onSelectUrl(url);
              setSelectedVideoTitle(title || "");
            }}
            accentColor={accentColor}
          />
        </div>
      ) : inputMode === "upload" ? (
        <StitchFileUploadInput
          onUploaded={(path, title) => {
            onSelectUrl(path);
            setSelectedVideoTitle(title || "Video tải từ máy");
          }}
          selectedUrl={selectedUrl}
          accentColor={accentColor}
          disabled={disabled}
        />
      ) : (
        /* Chế độ 3: Dán Link Trực Tiếp */
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
            <FaLink className="text-gray-400" /> Link Video Douyin / TikTok hoặc Đường Dẫn File
          </label>
          <input
            type="text"
            required
            placeholder="https://www.douyin.com/video/... hoặc dán link TikTok"
            value={selectedUrl}
            disabled={disabled}
            onChange={(e) => {
              onSelectUrl(e.target.value);
              setSelectedVideoTitle("");
            }}
            className={`w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 ${ringAccent} bg-white transition-all`}
          />
        </div>
      )}

      {/* Hiển thị video đang được chọn */}
      {selectedUrl && (
        <div className="p-2.5 bg-white border border-gray-200 rounded-xl flex items-center justify-between text-xs shadow-xs">
          <div className="flex items-center gap-2 truncate flex-1 min-w-0">
            <div className={`w-2 h-2 rounded-full ${isBlue ? "bg-blue-600" : "bg-purple-600"} shrink-0`} />
            <div className="truncate text-[11px]">
              <span className="font-bold text-gray-700">Đã chọn: </span>
              <span className="text-gray-500 font-mono">{selectedVideoTitle || selectedUrl}</span>
            </div>
          </div>
          <a
            href={selectedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-blue-600 hover:underline flex items-center gap-1 shrink-0 ml-2 font-semibold"
          >
            <FaEye /> Xem link
          </a>
        </div>
      )}

      {/* Slider thời lượng */}
      <StitchDurationSlider
        label={sliderLabel}
        value={sliderValue}
        onChange={onSliderChange}
        min={sliderMin}
        max={sliderMax}
        step={sliderStep}
        unitText={sliderUnitText}
        hints={sliderHints}
        isHookSource={isHookSource}
        accentColor={accentColor}
        disabled={disabled}
      />
    </div>
  );
};
