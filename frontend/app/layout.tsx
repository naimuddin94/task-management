import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "@/provider";

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
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
