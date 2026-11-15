"use client";

import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface TableProps {
  children: React.ReactNode;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

export const Table: React.FC<TableProps> = ({
  children,
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">{children}</div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50 gap-4">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>Hiển thị</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size} dòng / trang
              </option>
            ))}
          </select>
          <span>
            trên tổng số <strong className="text-gray-900">{totalItems}</strong> mục
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 mr-2">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <FaChevronLeft className="text-xs" />
          </button>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <FaChevronRight className="text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
};

