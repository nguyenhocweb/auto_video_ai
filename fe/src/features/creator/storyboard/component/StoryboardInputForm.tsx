"use client";

import React, { useState } from "react";
import { FaMagic, FaSpinner, FaLightbulb, FaBolt, FaPalette, FaBookOpen } from "react-icons/fa";

interface StoryboardInputFormProps {
  onGenerate: (topic: string, artStyle: string, genre: string, count: number) => void;
  isLoading: boolean;
}

const SUGGESTIONS = [
  "Áp lực phải thành công trước tuổi 30 và nghịch lý so sánh bản thân",
  "Định luật 1% mỗi ngày: Thay đổi nhỏ tạo nên kết quả phi thường",
  "Hai cậu bạn mò xuống căn hầm bỏ hoang và phát hiện bản đồ bí mật",
  "Tín hiệu vô tuyến lạ phát ra từ chiếc radio cũ giữa đêm khuya",
];

const SCENE_PRESETS = [8, 15, 30, 50];

export const StoryboardInputForm: React.FC<StoryboardInputFormProps> = ({
  onGenerate,
  isLoading,
}) => {
  const [topic, setTopic] = useState("");
  const [artStyle, setArtStyle] = useState("stickman");
  const [genre, setGenre] = useState("knowledge_sharing");
  const [sceneCount, setSceneCount] = useState(8);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onGenerate(topic.trim(), artStyle, genre, sceneCount);
  };

  const estSec = Math.round(sceneCount * 2.8);
  const estMin = Math.floor(estSec / 60);
  const remSec = estSec % 60;
  const timeLabel = estMin > 0 ? `${estMin}p${remSec > 0 ? `${remSec}s` : ""}` : `${estSec}s`;

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white border border-gray-200/90 rounded-2xl shadow-sm space-y-4"
    >
      <div>
        <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
          Ý Tưởng / Chủ Đề Câu Chuyện
        </label>
        <textarea
          rows={3}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Mô tả chủ đề (VD: Áp lực phải thành công, Định luật tâm lý học, Người que khám phá bí mật...)"
          className="w-full px-4 py-3 text-sm bg-gray-50/70 hover:bg-white focus:bg-white border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 rounded-xl text-gray-900 placeholder:text-gray-400 transition resize-none outline-none"
        />

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-2.5">
          <span className="text-[11px] font-medium text-gray-500 flex items-center gap-1">
            <FaLightbulb className="text-amber-500" /> Gợi ý nhanh:
          </span>
          {SUGGESTIONS.map((sug, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setTopic(sug)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-violet-50 text-gray-700 hover:text-violet-700 border border-gray-200/80 hover:border-violet-200 transition truncate max-w-[320px]"
            >
              {sug}
            </button>
          ))}
        </div>
      </div>

      {/* Grid tách riêng 2 chiều: Phong Cách Hội Họa & Thể Loại Nội Dung */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
        {/* Dropdown 1: Phong Cách Hội Họa & Nhân Vật */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
            <FaPalette className="text-violet-600" />
            Phong Cách Hội Họa & Nhân Vật
          </label>
          <select
            value={artStyle}
            onChange={(e) => setArtStyle(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 font-medium shadow-xs"
          >
            <option value="stickman">
              🖤 Stickman Người Que Mũ Snapback (Mẫu video gốc)
            </option>
            <option value="modern_vector">
              🎨 Flat Vector Hiện Đại (Modern Explainer / Infographic)
            </option>
            <option value="anime">
              ✨ Anime Điện Ảnh (Makoto Shinkai)
            </option>
            <option value="comic_webtoon">
              📱 Truyện Tranh Webtoon Đời Thường
            </option>
            <option value="doodle_sketch">
              ✏️ Doodle Phác Thảo Trắng Đen (Hand-Drawn Sketch)
            </option>
          </select>
        </div>

        {/* Dropdown 2: Thể Loại Nội Dung & Giọng Kể */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
            <FaBookOpen className="text-emerald-600" />
            Thể Loại Nội Dung & Giọng Kể
          </label>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 font-medium shadow-xs"
          >
            <option value="knowledge_sharing">
              💡 Kể Chuyện & Chia Sẻ Kiến Thức (Triết Lý, Tâm Lý, Bài Học)
            </option>
            <option value="horror_mystery">
              👻 Bí Ẩn, Gay Cấn, Kinh Dị (Suspense & Mystery)
            </option>
            <option value="motivation">
              🔥 Truyền Cảm Hứng & Động Lực (Inspirational)
            </option>
            <option value="daily_comedy">
              😂 Hài Hước, Đời Thường, Châm Biếm (Comedy)
            </option>
          </select>
        </div>

        {/* Selector 3: Số Lượng Cảnh Quay */}
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-gray-700">
              Số Lượng Cảnh ({sceneCount} cảnh ~ {timeLabel})
            </label>
            <div className="flex items-center gap-1">
              {SCENE_PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSceneCount(p)}
                  className={`text-[10px] px-1.5 py-0.5 rounded font-semibold transition ${
                    sceneCount === p
                      ? "bg-violet-600 text-white shadow-xs"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 border border-gray-200/60"
                  }`}
                >
                  {p} cảnh
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min={4}
              max={50}
              value={sceneCount}
              onChange={(e) => setSceneCount(parseInt(e.target.value) || 8)}
              className="flex-1 accent-violet-600 h-2 bg-gray-200 rounded-lg cursor-pointer"
            />
            <span className="px-3 py-1 bg-violet-50 border border-violet-200 rounded-lg text-xs font-bold text-violet-700 shrink-0">
              {sceneCount} cảnh
            </span>
          </div>
        </div>
      </div>

      {/* Pacing note */}
      <div className="p-3 bg-violet-50/70 border border-violet-200/80 rounded-xl flex items-start gap-2.5 text-xs text-violet-950">
        <FaBolt className="text-amber-500 mt-0.5 shrink-0" />
        <span>
          <b className="font-bold text-violet-900">Tiết tấu nhanh (Fast-Paced Retention):</b> Mỗi ảnh chỉ có 1 câu thoại ngắn 8–14 từ (~2.8s) giúp video đổi cảnh dồn dập, cuốn hút và không gây nhàm chán khi xem nhiều cảnh.
        </span>
      </div>

      <div className="flex justify-end pt-1">
        <button
          type="submit"
          disabled={isLoading || !topic.trim()}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition ${
            isLoading || !topic.trim()
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-violet-500/25 active:scale-95 cursor-pointer"
          }`}
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin text-sm" />
              Đang sáng tác kịch bản {sceneCount} cảnh & câu prompt...
            </>
          ) : (
            <>
              <FaMagic className="text-sm" />
              AI Viết Kịch Bản & Sinh Prompt ({sceneCount} cảnh)
            </>
          )}
        </button>
      </div>
    </form>
  );
};
