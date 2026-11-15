import React from "react";
import { PublicHeader } from "@/src/core/components/layout/public-header";
import { PublicSidebar } from "@/src/core/components/layout/public-sidebar";
import { AuthGuard } from "@/src/core/components/auth/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-slate-50/50">
        <PublicHeader />
        <div className="flex-1 flex">
          <PublicSidebar />
          <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

