"use client";

import React from "react";
import { FaExternalLinkAlt, FaMusic, FaYoutube, FaFacebook, FaGem } from "react-icons/fa";

interface MusicSource {
  title: string;
  desc: string;
  url: string;
  badge: string;
  badgeColor: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SOURCES: MusicSource[] = [
  {
    title: "Mixkit Free Music",
    desc: "Hàng ngàn track nhạc ngắn 1-3 phút miễn phí bản quyền thương mại, cực kỳ hợp video ngắn.",
    url: "https://mixkit.co/free-stock-music/",
    badge: "100% Free",
    badgeColor: "bg-emerald-100 text-emerald-700",
    icon: FaMusic,
  },
  {
    title: "Pixabay Music",
    desc: "Kho nhạc khổng lồ không bản quyền (Royalty Free), đa dạng thể loại Chill, Lofi, Vui nhộn.",
    url: "https://pixabay.com/music/",
    badge: "Khuyên dùng",
    badgeColor: "bg-blue-100 text-blue-700",
    icon: FaGem,
  },
  {
    title: "YouTube Audio Library",
    desc: "Kho nhạc chính chủ của YouTube Studio, an toàn tuyệt đối 100% cho YouTube Shorts.",
    url: "https://studio.youtube.com/",
    badge: "Chính chủ Google",
    badgeColor: "bg-red-100 text-red-700",
    icon: FaYoutube,
  },
  {
    title: "Facebook Sound Collection",
    desc: "Thư viện âm thanh Meta cấp phép miễn phí cho nhà sáng tạo Facebook Reels.",
    url: "https://business.facebook.com/",
    badge: "Chính chủ Meta",
    badgeColor: "bg-indigo-100 text-indigo-700",
    icon: FaFacebook,
  },
];

export const BgmSourcesCard: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-indigo-50/70 via-purple-50/50 to-white border border-indigo-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-xs">
          <FaMusic className="text-sm" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-sm sm:text-base">
            Mỏ Vàng Nguồn Nhạc Bản Quyền Sạch (Miễn Phí 100%)
          </h3>
          <p className="text-xs text-gray-500">
            Bạn có thể click vào các nguồn dưới đây để nghe thử trực tiếp trên web và tải file MP3 về thêm vào kho
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
        {SOURCES.map((src, i) => {
          const Icon = src.icon;
          return (
            <a
              key={i}
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white/90 hover:bg-white border border-gray-200/80 hover:border-indigo-400 rounded-xl p-3.5 transition-all shadow-2xs hover:shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${src.badgeColor}`}>
                    {src.badge}
                  </span>
                  <Icon className="text-gray-400 group-hover:text-indigo-600 text-sm transition-colors" />
                </div>
                <h4 className="font-bold text-gray-800 text-xs sm:text-sm group-hover:text-indigo-600 transition-colors">
                  {src.title}
                </h4>
                <p className="text-[11px] text-gray-500 leading-relaxed mt-1 line-clamp-2">
                  {src.desc}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-indigo-600 font-semibold">
                <span>Khám phá ngay</span>
                <FaExternalLinkAlt className="text-[10px] group-hover:translate-x-0.5 transition-transform" />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

