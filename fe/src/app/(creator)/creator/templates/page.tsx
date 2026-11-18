import { Metadata } from "next";
import { TemplateStudioView } from "@/src/features/creator/templates/component/TemplateStudioView";

export const metadata: Metadata = {
  title: "CapCut Template Studio | Video AI Studio",
  description: "Mô phỏng hiệu ứng video giật beat, chớp sáng theo mẫu CapCut",
};

export default function TemplatesPage() {
  return <TemplateStudioView />;
}
