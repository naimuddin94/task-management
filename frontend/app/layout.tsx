import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Task Management",
  description: "This is a task management system application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
