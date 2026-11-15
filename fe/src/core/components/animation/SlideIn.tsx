"use client";

import React from "react";

interface SlideInProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
}

export const SlideIn: React.FC<SlideInProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`transition-all duration-300 ease-out transform ${className}`}>
      {children}
    </div>
  );
};

