"use client";

import React from "react";
import {
  FaMicrophone,
  FaUserCircle,
  FaSignOutAlt,
  FaShieldAlt,
  FaUser,
} from "react-icons/fa";
import { useAuth } from "@/src/features/shared/auth/hook/useAuth";
import { NotificationBell } from "@/src/features/shared/notification/component/NotificationBell";

export const PublicHeader: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <header className="h-16 px-6 bg-white/80 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-30 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
          <FaMicrophone className="text-lg" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-gray-900 leading-none">Video AI Studio</h1>
          <p className="text-[10px] text-gray-500 mt-0.5">Voice Generation &amp; Video Automation</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <NotificationBell />

        {isAuthenticated ? (
          <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs text-white shadow-sm ${
                  isAdmin ? "bg-gradient-to-tr from-amber-500 to-red-500" : "bg-gradient-to-tr from-blue-600 to-indigo-600"
                }`}
              >
                {isAdmin ? <FaShieldAlt /> : <FaUser />}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-gray-900 leading-tight">
                  {user?.full_name || user?.email}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-md ${
                      isAdmin
                        ? "bg-amber-100 text-amber-800 border border-amber-200"
                        : "bg-blue-100 text-blue-800 border border-blue-200"
                    }`}
                  >
                    {isAdmin ? "Super Admin" : "Người Dùng"}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              title="Đăng xuất"
              className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all text-xs"
            >
              <FaSignOutAlt />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
            <FaUserCircle className="text-2xl text-gray-400" />
            <div className="text-left">
              <p className="text-xs font-bold text-gray-700">Chưa đăng nhập</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
