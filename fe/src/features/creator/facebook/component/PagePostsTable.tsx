"use client";

import React, { useState } from "react";
import {
  FaHeart,
  FaComment,
  FaShare,
  FaExternalLinkAlt,
  FaFileAlt,
  FaClock,
} from "react-icons/fa";
import { FacebookPost } from "../type/facebook.type";
import { Table } from "@/src/core/components/ui/Table";

interface PagePostsTableProps {
  posts: FacebookPost[];
  isLoading: boolean;
}

export const PagePostsTable: React.FC<PagePostsTableProps> = ({
  posts,
  isLoading,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalItems = posts.length;
  const startIndex = (currentPage - 1) * pageSize;
  const currentPosts = posts.slice(startIndex, startIndex + pageSize);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/80 p-12 text-center text-sm text-gray-500">
        <div className="inline-block animate-spin text-blue-600 text-2xl mb-2">⏳</div>
        <p>Đang tải danh sách bài viết từ Facebook...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3 text-xl">
          <FaFileAlt />
        </div>
        <h3 className="text-base font-bold text-gray-800">Chưa có bài viết nào</h3>
        <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
          Fanpage chưa có bài viết văn bản hoặc ảnh nào được xuất bản công khai.
        </p>
      </div>
    );
  }

  return (
    <Table
      currentPage={currentPage}
      pageSize={pageSize}
      totalItems={totalItems}
      onPageChange={(page) => setCurrentPage(page)}
      onPageSizeChange={(size) => {
        setPageSize(size);
        setCurrentPage(1);
      }}
      pageSizeOptions={[5, 10, 20]}
    >
      <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-gray-50/80 text-[11px] uppercase tracking-wider text-gray-400 border-b border-gray-100">
          <tr>
            <th className="px-5 py-3.5 font-semibold">Nội dung bài viết</th>
            <th className="px-5 py-3.5 font-semibold text-center">Lượt thích ❤️</th>
            <th className="px-5 py-3.5 font-semibold text-center">Bình luận 💬</th>
            <th className="px-5 py-3.5 font-semibold text-center">Chia sẻ 🔁</th>
            <th className="px-5 py-3.5 font-semibold">Ngày đăng</th>
            <th className="px-5 py-3.5 font-semibold text-right">Xem bài</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {currentPosts.map((post) => (
            <tr key={post.id} className="hover:bg-blue-50/20 transition-colors">
              <td className="px-5 py-3.5">
                <div className="flex items-start gap-3">
                  {post.thumbnail ? (
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                      <img
                        src={post.thumbnail}
                        alt="post img"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : null}
                  <div className="min-w-0 max-w-md">
                    <p className="text-xs font-semibold text-gray-800 line-clamp-2">
                      {post.message || "(Bài viết không có nội dung văn bản)"}
                    </p>
                    <p className="text-[10px] text-gray-400 font-mono mt-1">ID: {post.id}</p>
                  </div>
                </div>
              </td>

              <td className="px-5 py-3.5 text-center">
                <span className="inline-flex items-center gap-1 font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-md text-xs">
                  <FaHeart className="text-[10px]" />
                  {post.reactions_count.toLocaleString("vi-VN")}
                </span>
              </td>

              <td className="px-5 py-3.5 text-center">
                <span className="inline-flex items-center gap-1 font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md text-xs">
                  <FaComment className="text-[10px]" />
                  {post.comments_count.toLocaleString("vi-VN")}
                </span>
              </td>

              <td className="px-5 py-3.5 text-center">
                <span className="inline-flex items-center gap-1 font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-md text-xs">
                  <FaShare className="text-[10px]" />
                  {post.shares_count.toLocaleString("vi-VN")}
                </span>
              </td>

              <td className="px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                <div className="flex items-center gap-1.5">
                  <FaClock className="text-gray-400 text-[10px]" />
                  <span>{formatDate(post.created_time)}</span>
                </div>
              </td>

              <td className="px-5 py-3.5 text-right whitespace-nowrap">
                <a
                  href={post.permalink_url || `https://www.facebook.com/${post.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-700 hover:text-blue-600 bg-gray-100 hover:bg-blue-50 transition-colors"
                >
                  <FaExternalLinkAlt className="text-[10px]" />
                  Xem bài
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Table>
  );
};

