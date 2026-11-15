"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreatorDubbingPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/creator/video");
  }, [router]);

  return (
    <div className="py-12 text-center text-xs text-gray-400">
      Đang chuyển hướng về Studio Tải & Dubbing Video...
    </div>
  );
}
