/**
 * entry-server.tsx — SSG 服務端渲染入口
 *
 * 此文件在 Node.js 環境中執行，用於 SSG 預渲染。
 * 通過 renderToString 將 React 組件渲染為靜態 HTML 字符串。
 * 使用 wouter 的 memoryLocation 避免訪問 window.location。
 */
import React from "react";
import { renderToString } from "react-dom/server";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import Home from "@/pages/Home";

export function render(url = "/") {
  const { hook } = memoryLocation({ path: url });

  const html = renderToString(
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router hook={hook}>
            <Home />
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );

  return { html };
}
