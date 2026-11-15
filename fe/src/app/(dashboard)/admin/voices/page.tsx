"use client";

import React, { useState } from "react";
import {
  FaDatabase,
  FaTrash,
  FaSpinner,
  FaPlay,
  FaPause,
  FaExternalLinkAlt,
} from "react-icons/fa";
import {
  useAdminVoices,
  useAdminDeleteVoice,
} from "@/src/features/admin/hook/useAdminVoices";

export default function AdminVoicesPage() {
  const { data: voices, isLoading } = useAdminVoices();
  const { mutate: deleteVoice, isPending: isDeleting } = useAdminDeleteVoice();
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);
  const [audioObj, setAudioObj] = useState<HTMLAudioElement | null>(null);

  const togglePlayAudio = (url?: string) => {
    if (!url) return;

    if (playingUrl === url && audioObj) {
      audioObj.pause();
      setPlayingUrl(null);
      return;
    }

    if (audioObj) {
      audioObj.pause();
    }

    const newAudio = new Audio(url);
    newAudio.play();
    newAudio.onended = () => setPlayingUrl(null);
    setAudioObj(newAudio);
    setPlayingUrl(url);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn model giọng "${name}" khỏi toàn hệ thống?`)) {
      deleteVoice(id);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200/90 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">
              <FaDatabase />
            </div>
            <h2 className="text-base font-extrabold text-gray-900">
              Quản Trị Toàn Bộ Models Giọng Nói AI
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Danh sách tất cả embeddings, weights LoRA đã tạo bởi người dùng và hệ thống
          </p>
        </div>

        <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-xl">
          Tổng số: {voices?.length || 0} kiểu giọng
        </span>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 gap-2">
          <FaSpinner className="animate-spin text-xl text-blue-600" />
          <span className="text-xs font-bold text-gray-500">Đang tải danh sách models giọng...</span>
        </div>
      ) : !voices || voices.length === 0 ? (
        <div className="text-center py-12 text-xs text-gray-400">
          Chưa có model giọng nào trong cơ sở dữ liệu.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/70 text-gray-600 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4 rounded-l-xl">Kiểu Giọng</th>
                <th className="py-3 px-4">Giới Tính</th>
                <th className="py-3 px-4">Lưu Trữ</th>
                <th className="py-3 px-4">Ngày Tạo</th>
                <th className="py-3 px-4 text-right rounded-r-xl">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {voices.map((v) => {
                const isPlaying = playingUrl === v.prompt_file_path;

                return (
                  <tr key={v.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-bold text-gray-900">{v.name}</p>
                        <p className="text-[10px] text-gray-400 font-mono truncate max-w-[200px]">
                          {v.id}
                        </p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 text-gray-700">
                        {v.gender || "NEUTRAL"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          v.provider === "CLOUDINARY"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {v.provider || "LOCAL"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-gray-500 text-[11px]">
                      {v.created_at || "N/A"}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {v.prompt_file_path && (
                          <>
                            <button
                              type="button"
                              onClick={() => togglePlayAudio(v.prompt_file_path)}
                              title={isPlaying ? "Dừng phát" : "Nghe thử file mẫu"}
                              className={`p-2 rounded-xl text-xs font-bold transition-all ${
                                isPlaying
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              {isPlaying ? <FaPause /> : <FaPlay />}
                            </button>

                            <a
                              href={v.prompt_file_path}
                              target="_blank"
                              rel="noreferrer"
                              title="Mở link trực tiếp"
                              className="p-2 rounded-xl bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200 text-xs"
                            >
                              <FaExternalLinkAlt />
                            </a>
                          </>
                        )}

                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={() => handleDelete(v.id, v.name)}
                          title="Xóa model giọng này"
                          className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold transition-all disabled:opacity-50"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

