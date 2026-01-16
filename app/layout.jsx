export const metadata = {
  title: "AdventureBag Visual Prototype",
  description: "AdventureBag e-commerce visual prototype",
};

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
