export const metadata = {
  title: "YONI App",
  description: "YONI-CORE Frontend"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}