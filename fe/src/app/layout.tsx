import React from "react";
import type { Metadata } from "next";
import { QueryProvider } from "@/src/core/components/providers/QueryProvider";
import { AuthProvider } from "@/src/features/shared/auth/context/auth.context";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Video AI - AI Voice & Video Automation Studio",
  description: "Nền tảng tự động hóa Video và tạo giọng đọc AI (OmniVoice & Voice Cloning)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="antialiased">
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster richColors position="top-right" closeButton />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

