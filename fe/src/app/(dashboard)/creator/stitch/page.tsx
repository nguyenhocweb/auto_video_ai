import { Metadata } from "next";
import { StitchStudioView } from "@/src/features/creator/stitch/component/StitchStudioView";

export const metadata: Metadata = {
  title: "Studio Ghép Nối Video (Hook & Body) | Video AI Platform",
  description: "Ghép nối video 2 nguồn tự động và thủ công chuẩn viral TikTok, Reels, Shorts",
};

export default function StitchPage() {
  return <StitchStudioView />;
}
