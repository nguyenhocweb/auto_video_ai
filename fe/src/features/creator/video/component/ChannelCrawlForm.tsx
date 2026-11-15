"use client";

import React, { useState } from "react";
import { FaLink, FaRegClipboard, FaSearch, FaSpinner, FaTimes, FaInfoCircle } from "react-icons/fa";
import { toast } from "sonner";
import { useCrawlChannelToday } from "../hook/useCrawlChannelToday";
import { ChannelTodayVideosResponse } from "../type/video.type";

interface ChannelCrawlFormProps {
  onCrawlSuccess: (data: ChannelTodayVideosResponse) => void;
  crawlTrigger?: { url: string; ts: number } | null;
}

export const ChannelCrawlForm: React.FC<ChannelCrawlFormProps> = ({
  onCrawlSuccess,
  crawlTrigger,
}) => {
  const [channelInput, setChannelInput] = useState<string>("");
  const crawlMutation = useCrawlChannelToday();

  React.useEffect(() => {
    if (crawlTrigger?.url) {
      setChannelInput(crawlTrigger.url);
      crawlMutation.mutate(
        { url: crawlTrigger.url, limit: 20 },
        {
          onSuccess: (data) => {
            onCrawlSuccess(data);
          },
        }
      );
    }
  }, [crawlTrigger]);

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setChannelInput(text.trim());
        toast.info("Đã dán link kênh từ clipboard!");
      }
    } catch {
      toast.error("Không thể đọc từ clipboard. Vui lòng dán thủ công!");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = channelInput.trim();
    if (!clean) {
      toast.warning("Vui lòng dán link kênh hoặc trang cá nhân Douyin của Creator!");
      return;
    }

    if (clean.includes("/user/")) {
      const match = clean.match(/\/user\/([a-zA-Z0-9_\-]+)/);
      if (match && match[1] && match[1].length < 35) {
        toast.warning(
          "Link kênh này bị thiếu ký tự ở đuôi. Bạn hãy dán link 1 video bất kỳ từ kênh đó để hệ thống tự động nhận diện chính xác 100% nhé!"
        );
        return;
      }
    }

    crawlMutation.mutate(
      { url: clean, limit: 20 },
      {
        onSuccess: (data) => {
          onCrawlSuccess(data);
        },
      }
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-center gap-3 w-full"
      >
        {/* Input Box đồng bộ mẫu 2 */}
        <div className="relative flex-1 w-full bg-white rounded-xl border-2 border-blue-500 shadow-sm flex items-center px-4 py-2.5 transition-all focus-within:ring-2 focus-within:ring-blue-400">
          <FaLink className="text-gray-400 text-base sm:text-lg mr-3 flex-shrink-0" />
          <input
            type="text"
            value={channelInput}
            onChange={(e) => setChannelInput(e.target.value)}
            placeholder="Dán link kênh hoặc link bất kỳ của Creator vào đây"
            className="w-full text-sm sm:text-base text-gray-800 placeholder-gray-400 bg-transparent outline-none"
          />

          {channelInput && (
            <button
              type="button"
              onClick={() => setChannelInput("")}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-lg text-xs mr-2 transition-colors"
              title="Xóa link"
            >
              <FaTimes />
            </button>
          )}

          <button
            type="button"
            onClick={handlePasteClipboard}
            className="p-1.5 text-gray-700 hover:text-blue-600 rounded-lg text-lg sm:text-xl transition-colors flex-shrink-0"
            title="Dán từ bộ nhớ tạm"
          >
            <FaRegClipboard />
          </button>
        </div>

        {/* Nút Quét Kênh */}
        <button
          type="submit"
          disabled={crawlMutation.isPending}
          className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-2 px-7 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm sm:text-base rounded-xl shadow-md shadow-blue-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {crawlMutation.isPending ? (
            <>
              <FaSpinner className="animate-spin text-base" />
              <span>Đang quét kênh...</span>
            </>
          ) : (
            <>
              <FaSearch className="text-base" />
              <span>Quét Video</span>
            </>
          )}
        </button>
      </form>
      <div className="mt-2.5 flex items-center gap-1.5 text-xs text-gray-500 bg-blue-50/60 border border-blue-100 rounded-lg px-3 py-1.5">
        <FaInfoCircle className="text-blue-500 text-xs flex-shrink-0" />
        <span>
          <strong>Mẹo:</strong> Bạn có thể dán link trang cá nhân Douyin hoặc dán link 1 video bất kỳ từ kênh đó. Hệ thống sẽ tự động quét toàn bộ danh sách video kèm ngày giờ đăng chuẩn xác!
        </span>
      </div>
    </div>
  );
};

