export const metadata = {
  title: "AdventureBag Visual Prototype",
  description: "AdventureBag e-commerce visual prototype",
};

// Mobile responsiveness: ensure correct scaling + safe-area support (iPhone notch).
export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen overflow-x-hidden antialiased">{children}</body>
    </html>
  );
}
