export const metadata = {
  title: '오늘/내일 메모 보고',
  description: '업무 메모 공유 시스템',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
