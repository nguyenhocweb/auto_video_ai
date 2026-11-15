"use client";

import React, { useState } from "react";
import {
  FaKey,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaSpinner,
  FaShieldAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { Modal } from "@/src/core/components/ui/Modal";
import { useUpdateToken } from "../hook/useUpdateToken";

interface UpdateTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessReload?: () => void;
}

export const UpdateTokenModal: React.FC<UpdateTokenModalProps> = ({
  isOpen,
  onClose,
  onSuccessReload,
}) => {
  const [tokenInput, setTokenInput] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { mutateAsync: updateToken, isPending } = useUpdateToken();

  const handleUpdate = async () => {
    if (!tokenInput.trim()) {
      setErrorMsg("Vui lòng dán Access Token vào ô bên dưới");
      return;
    }
    setErrorMsg(null);
    setMessage(null);

    try {
      const res = await updateToken({ user_token: tokenInput.trim() });
      setMessage(res.message);
      setTokenInput("");
      if (onSuccessReload) onSuccessReload();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string; message?: string } }; message?: string };
      const msg =
        axiosErr.response?.data?.detail ||
        axiosErr.response?.data?.message ||
        axiosErr.message ||
        "Cập nhật token thất bại";
      setErrorMsg(msg);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!isPending) {
          setMessage(null);
          setErrorMsg(null);
          onClose();
        }
      }}
      title="Cập nhật User Access Token (Tự động tải Trang mới)"
      maxWidth="lg"
    >
      <div className="p-6 space-y-4">
        {message ? (
          <div className="p-5 bg-green-50 rounded-xl border border-green-200 text-center space-y-3">
            <FaCheckCircle className="text-green-500 text-3xl mx-auto" />
            <div>
              <h4 className="text-sm font-bold text-gray-900">Đồng bộ hoàn tất!</h4>
              <p className="text-xs text-green-700 mt-1">{message}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700"
            >
              Đóng và xem danh sách Trang
            </button>
          </div>
        ) : (
          <>
            <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3.5 text-xs text-blue-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-blue-800">
                <FaInfoCircle />
                <span>Cách lấy đầy đủ tất cả Trang bạn mới được thêm:</span>
              </div>
              <ol className="list-decimal pl-4 space-y-1 text-gray-700 text-[11px] leading-relaxed">
                <li>
                  Vào Facebook cá nhân kiểm tra thông báo và bấm <strong>&quot;Chấp nhận lời mời làm quản trị viên&quot;</strong>.
                </li>
                <li>
                  Mở công cụ{" "}
                  <a
                    href="https://developers.facebook.com/tools/explorer/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
                  >
                    Graph API Explorer <FaExternalLinkAlt className="text-[9px]" />
                  </a>
                </li>
                <li>
                  <strong className="text-amber-800 bg-amber-100/70 px-1.5 py-0.5 rounded font-bold">Bắt buộc:</strong> Tại ô <strong>&quot;Facebook App&quot;</strong>, chọn ứng dụng <strong>video_ai</strong> (App ID: 1815527473001673) để hệ thống tự động gia hạn thành công sang <strong>Token 60 ngày</strong>!
                </li>
                <li>
                  Chọn User Token có các quyền: <code>pages_show_list</code>, <code>pages_manage_posts</code>, <code>pages_read_engagement</code>, <code>pages_read_user_content</code> rồi bấm <strong>Generate Access Token</strong>.
                </li>
                <li>
                  Sao chép mã Token đó và dán vào ô bên dưới.
                </li>
              </ol>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">
                Dán User Access Token mới tại đây:
              </label>
              <textarea
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                rows={3}
                placeholder="EAAZAzNm4btMkBO..."
                className="w-full text-xs p-3 font-mono border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-gray-50/50"
              />
              <p className="text-[11px] text-gray-400 flex items-center gap-1">
                <FaShieldAlt className="text-gray-400" />
                Hệ thống tự động đổi sang Long-Lived Token có thời hạn <strong>60 ngày</strong>.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs">
                {errorMsg}
              </div>
            )}

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleUpdate}
                disabled={isPending}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <FaSpinner className="animate-spin text-xs" />
                    Đang nâng cấp & quét Trang...
                  </>
                ) : (
                  <>
                    <FaKey className="text-xs" />
                    Nâng cấp Token & Quét Trang mới
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

