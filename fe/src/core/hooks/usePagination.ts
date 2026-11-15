"use client";

import { useState } from "react";

interface UsePaginationProps {
  initialPage?: number;
  initialPageSize?: number;
}

export const usePagination = ({
  initialPage = 1,
  initialPageSize = 10,
}: UsePaginationProps = {}) => {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const nextPage = () => setPage((prev) => prev + 1);
  const prevPage = () => setPage((prev) => Math.max(1, prev - 1));
  const goToPage = (newPage: number) => setPage(Math.max(1, newPage));
  const changePageSize = (newSize: number) => {
    setPageSize(newSize);
    setPage(1); // reset về trang 1 khi đổi số dòng
  };

  return {
    page,
    pageSize,
    nextPage,
    prevPage,
    goToPage,
    changePageSize,
  };
};

