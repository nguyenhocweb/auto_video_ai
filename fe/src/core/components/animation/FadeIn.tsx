"use client";

import React from "react";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 300,
  className = "",
}) => {
  return (
    <div
      style={{
        animationDuration: `${duration}ms`,
        animationDelay: `${delay}ms`,
      }}
      className={`animate-[fadeIn_0.3s_ease-out_forwards] ${className}`}
    >
      {children}
    </div>
  );
};

