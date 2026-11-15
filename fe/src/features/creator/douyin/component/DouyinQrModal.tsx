"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  FaTimes,
  FaQrcode,
  FaSyncAlt,
  FaCheckCircle,
  FaMobileAlt,
  FaSpinner,
  FaShieldAlt,
} from "react-icons/fa";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useStartDouyinQr } from "../hook/useStartDouyinQr";
import { useDouyinQrPolling } from "../hook/useDouyinQrPolling";
import { douyinSessionService } from "../service/douyin-session.service";
import { DouyinOtpForm } from "./DouyinOtpForm";

interface DouyinQrModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DouyinQrModal: React.FC<DouyinQrModalProps> = ({ isOpen, onClose }) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(120);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isNeedVerify, setIsNeedVerify] = useState<boolean>(false);
  const [isScanned, setIsScanned] = useState<boolean>(false);
  const [maskedMobile, setMaskedMobile] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const startMutation = useStartDouyinQr();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStartQr = useCallback(() => {
    setIsSuccess(false);
    setIsNeedVerify(false);
    setIsScanned(false);
    setMaskedMobile(null);
    setTimeLeft(120);
    setSessionId(null);
    setQrCodeUrl(null);

    startMutation.mutate(undefined, {
      onSuccess: (data) => {
        setSessionId(data.session_id);
        setQrCodeUrl(data.qr_code_url);
        setTimeLeft(data.expires_in || 120);
      },
      onError: (err: unknown) => {
        const errorAny = err as { response?: { data?: { detail?: string } }; message?: string };
        const msg = errorAny.response?.data?.detail || errorAny.message || "Lỗi khi gọi máy chủ";
        toast.error(`Không thể tạo mã QR: ${msg}`);
      },
    });
  }, [startMutation]);

  useEffect(() => {
    if (isOpen) {
      handleStartQr();
    } else {
      if (sessionId) {
        douyinSessionService.cancelQr(sessionId).catch(() => {});
      }
      setSessionId(null);
      setQrCodeUrl(null);
      setIsSuccess(false);
      setIsNeedVerify(false);
      setIsScanned(false);
      setMaskedMobile(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !sessionId || isSuccess || isNeedVerify || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, sessionId, isSuccess, isNeedVerify, timeLeft]);

  useDouyinQrPolling({
    sessionId,
    enabled: isOpen && !isSuccess && (timeLeft > 0 || isNeedVerify),
    onConfirmed: (data) => {
      setIsSuccess(true);
      setIsNeedVerify(false);
      toast.success(data.message || "Kết nối tài khoản Douyin thành công!");
      queryClient.invalidateQueries({ queryKey: ["douyin-status"] });
      setTimeout(() => {
        onClose();
      }, 1500);
    },
    onNeedVerify: (data) => {
      setIsNeedVerify(true);
      if (data.masked_mobile) {
        setMaskedMobile(data.masked_mobile);
      }
    },
  });

  const handleClose = () => {
    if (sessionId) {
      douyinSessionService.cancelQr(sessionId).catch(() => {});
    }
    onClose();
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 my-auto animate-[fadeIn_0.2s_ease-out]">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              {isNeedVerify ? <FaShieldAlt className="text-base" /> : <FaQrcode className="text-base" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                {isNeedVerify ? "Xác minh tài khoản Douyin" : "Quét mã QR Douyin"}
              </h3>
              <p className="text-xs text-gray-500">
                {isNeedVerify ? "Nhập mã OTP để hoàn tất" : "Đăng nhập tài khoản Douyin chính chủ"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="text-base" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col items-center text-center">
          {startMutation.isPending ? (
            <div className="w-64 h-64 flex flex-col items-center justify-center space-y-3 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <FaSpinner className="text-3xl text-red-500 animate-spin" />
              <p className="text-sm font-medium text-gray-600">Đang khởi tạo mã QR từ Douyin...</p>
              <p className="text-xs text-gray-400">Vui lòng chờ trong giây lát (khoảng 3-5s)</p>
            </div>
          ) : isSuccess ? (
            <div className="w-64 h-64 flex flex-col items-center justify-center space-y-3 bg-green-50 rounded-2xl border border-green-200">
              <FaCheckCircle className="text-5xl text-green-500 animate-bounce" />
              <p className="text-base font-bold text-green-700">Đăng nhập thành công!</p>
              <p className="text-xs text-green-600">Đang đồng bộ phiên vào hệ thống...</p>
            </div>
          ) : isNeedVerify && sessionId ? (
            <DouyinOtpForm
              sessionId={sessionId}
              maskedMobile={maskedMobile}
              onBack={() => setIsNeedVerify(false)}
              onSubmitted={() => {
                queryClient.invalidateQueries({ queryKey: ["douyin-qr-status", sessionId] });
              }}
            />
          ) : timeLeft === 0 ? (
            <div className="w-64 h-64 flex flex-col items-center justify-center space-y-3 bg-gray-50 rounded-2xl border border-dashed border-gray-300 p-4">
              <p className="text-sm font-medium text-gray-700">Mã QR đã hết hạn</p>
              <p className="text-xs text-gray-500">Vui lòng bấm nút bên dưới để tạo lại mã mới</p>
              <button
                type="button"
                onClick={handleStartQr}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
              >
                <FaSyncAlt className="text-xs" /> Tạo mã QR mới
              </button>
            </div>
          ) : qrCodeUrl ? (
            <div className="relative group">
              <div className="p-3 bg-white rounded-2xl border-2 border-red-500/20 shadow-md">
                <img
                  src={qrCodeUrl}
                  alt="Douyin Login QR"
                  className="w-56 h-56 rounded-xl object-contain bg-white"
                />
              </div>

              <div className="mt-3 flex items-center justify-center gap-2">
                {isScanned ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    Đã quét! Chờ xác nhận...
                  </span>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    Mã hết hạn sau: {timeLeft}s
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="w-64 h-64 flex flex-col items-center justify-center space-y-3 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-sm text-gray-500">Chưa có mã QR</p>
              <button
                type="button"
                onClick={handleStartQr}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl"
              >
                <FaSyncAlt /> Thử lại
              </button>
            </div>
          )}

          {!isNeedVerify && !isSuccess && !startMutation.isPending && (
            <div className="mt-6 w-full bg-gray-50 rounded-xl p-3.5 text-left border border-gray-100 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                <FaMobileAlt className="text-red-500 text-sm" /> Hướng dẫn quét mã trên điện thoại:
              </div>
              <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside pl-1">
                <li>Mở ứng dụng <strong>Douyin (抖音)</strong> trên điện thoại.</li>
                <li>Chạm vào biểu tượng <strong>Kính lúp</strong> hoặc <strong>扫一扫 (Quét mã)</strong> ở góc trên.</li>
                <li>Hướng camera quét mã QR và bấm <strong>Xác nhận đăng nhập (确认登录)</strong>.</li>
              </ol>
            </div>
          )}

          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-gray-400">
            <FaShieldAlt className="text-green-500 text-xs" />
            <span>Kết nối an toàn chuẩn HTTPS, phiên được bảo mật tự động trên server.</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
