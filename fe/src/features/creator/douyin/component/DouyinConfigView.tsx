"use client";

import React from "react";
import { FadeIn } from "@/src/core/components/animation/FadeIn";
import { DouyinAccountCard } from "./DouyinAccountCard";
import { useDouyinStatus } from "../hook/useDouyinStatus";
import {
  FaShieldAlt,
  FaCheckCircle,
  FaMobileAlt,
  FaKey,
  FaServer,
  FaInfoCircle,
} from "react-icons/fa";
import { SiTiktok } from "react-icons/si";

export const DouyinConfigView: React.FC = () => {
  const { data: status } = useDouyinStatus();

  return (
    <FadeIn className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header giới thiệu */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold mb-2 shadow-xs">
            <SiTiktok /> Douyin QR Session & Cookie Manager
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Cấu hình & Kết nối Tài khoản Douyin
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
            Quản lý phiên đăng nhập QR chính chủ từ Douyin, tự động đồng bộ Cookie và phần cứng token để vượt rào chắn bảo mật ArgusSecurityPlugin, chống chặn 403 khi quét video hàng loạt.
          </p>
        </div>
      </div>

      {/* Thẻ Quản Lý Kết Nối Chính */}
      <div>
        <DouyinAccountCard />
      </div>

      {/* Grid 3 Khối Thông Tin Kỹ Thuật & Hướng Dẫn */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Khối 1: Trạng thái hạ tầng */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
            <FaServer />
          </div>
          <h3 className="text-sm font-bold text-gray-900">Hạ tầng Engine & Phiên</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Hệ thống sử dụng Playwright Automation chạy ngầm để lấy mã QR trực tiếp từ máy chủ Douyin Passport và tự động đồng bộ cookies vào MongoDB.
          </p>
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500">Cơ chế xác thực:</span>
            <span className="font-semibold text-blue-600">Native QR Pass</span>
          </div>
        </div>

        {/* Khối 2: Bảo mật & Chống chặn 403 */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
            <FaShieldAlt />
          </div>
          <h3 className="text-sm font-bold text-gray-900">Bảo mật & Token Phần cứng</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Việc quét mã trực tiếp trên server giúp token <code className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">bd_ticket_guard</code> và TLS fingerprint khớp 100%, triệt tiêu lỗi Captcha và 403 Forbidden.
          </p>
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500">Trạng thái bảo mật:</span>
            <span className={`font-semibold ${status?.is_connected ? "text-emerald-600" : "text-amber-600"}`}>
              {status?.is_connected ? "Tối ưu (Đã xác thực)" : "Chưa kết nối"}
            </span>
          </div>
        </div>

        {/* Khối 3: Thời hạn phiên làm việc */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg">
            <FaKey />
          </div>
          <h3 className="text-sm font-bold text-gray-900">Thời hạn Cookie & Session</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Phiên đăng nhập Douyin có hiệu lực từ 30 đến 60 ngày. Bạn chỉ cần quét mã QR một lần duy nhất, sau đó có thể quét hàng nghìn video ổn định.
          </p>
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500">Tự động nạp:</span>
            <span className="font-semibold text-purple-600">Dynamic Cache</span>
          </div>
        </div>
      </div>

      {/* Hướng Dẫn Chi Tiết 3 Bước */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <FaMobileAlt className="text-red-500 text-lg" />
          <h3 className="text-base font-bold text-gray-900">
            Quy trình kết nối qua App Douyin (Chỉ mất 10 giây)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
            <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold">
              1
            </div>
            <h4 className="text-xs font-bold text-gray-900">Mở ứng dụng Douyin</h4>
            <p className="text-xs text-gray-500">
              Mở ứng dụng <strong>Douyin (抖音)</strong> trên điện thoại của bạn và đảm bảo đã đăng nhập tài khoản.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
            <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold">
              2
            </div>
            <h4 className="text-xs font-bold text-gray-900">Quét mã QR</h4>
            <p className="text-xs text-gray-500">
              Bấm nút <strong>Quét mã QR kết nối</strong> ở trên, mở tính năng <strong>扫一扫 (Quét mã)</strong> ở góc trái trên App Douyin để quét.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
            <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold">
              3
            </div>
            <h4 className="text-xs font-bold text-gray-900">Xác nhận đăng nhập</h4>
            <p className="text-xs text-gray-500">
              Nhấn nút màu đỏ <strong>确认登录 (Xác nhận đăng nhập)</strong> trên điện thoại. Web sẽ tự động kích hoạt phiên ngay lập tức!
            </p>
          </div>
        </div>
      </div>
    </FadeIn>
  );
};

