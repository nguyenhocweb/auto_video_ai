"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FaShieldAlt,
  FaSpinner,
  FaPaperPlane,
  FaSyncAlt,
  FaArrowLeft,
  FaExclamationCircle,
} from "react-icons/fa";
import { toast } from "sonner";
import { useSubmitDouyinOtp } from "../hook/useSubmitDouyinOtp";
import { useResendDouyinOtp } from "../hook/useResendDouyinOtp";

interface DouyinOtpFormProps {
  sessionId: string;
  maskedMobile?: string | null;
  onBack: () => void;
  onSubmitted?: () => void;
}

export const DouyinOtpForm: React.FC<DouyinOtpFormProps> = ({
  sessionId,
  maskedMobile,
  onBack,
  onSubmitted,
}) => {
  const [code, setCode] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(60);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const autoSubmittedRef = useRef<boolean>(false);

  const submitMutation = useSubmitDouyinOtp();
  const resendMutation = useResendDouyinOtp();

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const executeSubmit = (otpCode: string) => {
    if (!otpCode || otpCode.length < 4) return;
    setErrorMessage(null);
    setIsVerifying(true);

    submitMutation.mutate(
      { session_id: sessionId, code: otpCode },
      {
        onSuccess: () => {
          toast.success("Đang tự động xác minh mã với Douyin...");
          if (onSubmitted) {
            onSubmitted();
          }
        },
        onError: (err: unknown) => {
          setIsVerifying(false);
          autoSubmittedRef.current = false;
          const errorAny = err as { response?: { data?: { detail?: string } }; message?: string };
          const msg = errorAny.response?.data?.detail || errorAny.message || "Không thể xác minh mã OTP";
          setErrorMessage(msg);
          toast.error(msg);
        },
      }
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, "");
    setCode(rawVal);
    setErrorMessage(null);

    // Tự động gửi khi gõ đủ 6 ký tự số
    if (rawVal.length === 6 && !autoSubmittedRef.current && !isVerifying) {
      autoSubmittedRef.current = true;
      executeSubmit(rawVal);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || code.trim().length < 4) {
      toast.error("Vui lòng nhập đầy đủ mã xác minh OTP (từ 4-6 số).");
      return;
    }
    executeSubmit(code.trim());
  };

  const handleResend = () => {
    if (countdown > 0) return;
    setErrorMessage(null);
    resendMutation.mutate(
      { session_id: sessionId },
      {
        onSuccess: () => {
          toast.success("Đã yêu cầu Douyin gửi lại mã xác minh SMS!");
          setCountdown(60);
          autoSubmittedRef.current = false;
        },
        onError: (err: unknown) => {
          const errorAny = err as { response?: { data?: { detail?: string } }; message?: string };
          const msg = errorAny.response?.data?.detail || errorAny.message || "Gửi lại mã thất bại";
          toast.error(msg);
        },
      }
    );
  };

  if (isVerifying) {
    return (
      <div className="w-full max-w-sm flex flex-col items-center py-6 animate-[fadeIn_0.2s_ease-out]">
        <div className="relative flex items-center justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center border-2 border-rose-200">
            <FaSpinner className="text-3xl text-rose-600 animate-spin" />
          </div>
        </div>

        <h4 className="text-base font-bold text-gray-900">Đang xác thực với Douyin...</h4>
        <p className="text-xs text-gray-500 mt-1.5 text-center px-4 leading-relaxed">
          Hệ thống đang tự động điền mã <span className="font-mono font-bold text-gray-700">{code}</span> và đồng bộ phiên đăng nhập từ máy chủ Douyin.
        </p>

        <div className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 text-rose-600 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          Đang kiểm tra kết quả...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm flex flex-col items-center animate-[fadeIn_0.2s_ease-out]">
      <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2.5 shadow-inner">
        <FaShieldAlt className="text-2xl" />
      </div>

      <h4 className="text-lg font-bold text-gray-900">Nhận mã xác minh SMS</h4>
      <p className="text-xs text-gray-500 mt-1 text-center">
        {maskedMobile ? (
          <>
            Mã xác minh đã gửi tới:{" "}
            <span className="font-semibold text-gray-800 font-mono text-sm">{maskedMobile}</span>
          </>
        ) : (
          "Douyin đã gửi mã xác minh SMS đến số điện thoại liên kết của bạn."
        )}
      </p>

      {errorMessage && (
        <div className="mt-3 w-full p-2.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-600 text-left animate-[shake_0.3s_ease-in-out]">
          <FaExclamationCircle className="text-base shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4 w-full space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 text-left mb-1.5">
            Mã xác minh (请输入验证码)
          </label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            autoFocus
            value={code}
            onChange={handleInputChange}
            placeholder="Nhập mã 6 số"
            className="w-full text-center tracking-[0.35em] font-mono text-2xl py-3 px-4 bg-gray-50 border-2 border-gray-200 focus:border-rose-500 focus:bg-white focus:outline-none rounded-xl transition-all font-bold text-gray-900 shadow-sm placeholder:tracking-normal placeholder:font-sans placeholder:text-sm placeholder:text-gray-400"
          />
        </div>

        <button
          type="submit"
          disabled={code.length < 4}
          className="w-full py-2.5 px-4 bg-rose-500 hover:bg-rose-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
        >
          <FaPaperPlane className="text-xs" />
          <span>Xác minh (验证)</span>
        </button>

        <div className="flex items-center justify-between text-xs pt-1">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-800 transition-colors"
          >
            <FaArrowLeft className="text-[10px]" /> Quay lại mã QR
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={countdown > 0 || resendMutation.isPending}
            className="inline-flex items-center gap-1.5 text-rose-600 hover:text-rose-700 disabled:text-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {resendMutation.isPending ? (
              <FaSpinner className="animate-spin text-[10px]" />
            ) : (
              <FaSyncAlt className="text-[10px]" />
            )}
            <span>{countdown > 0 ? `${countdown}s sau gửi lại` : "Gửi lại mã"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
