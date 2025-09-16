"use client";

import { ParallaxProvider } from "react-scroll-parallax";
import { ReactNode } from "react";

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <ParallaxProvider>
      {children}
    </ParallaxProvider>
  );
}
