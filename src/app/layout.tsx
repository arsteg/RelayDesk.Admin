import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "RelayDesk Admin", template: "%s · RelayDesk Admin" },
  description: "Operator console for the RelayDesk platform.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#dd5f06" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
