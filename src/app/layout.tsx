import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: '아기속풀이 | 60갑자 아기 기질 도감 & 육아 날씨',
  description: '신생아부터 어린이까지 쏙 뽑아보는 60갑자 아기 성향 분석 및 오행 육아 톡톡',
  icons: {
    icon: '/favicon.ico', // public 폴더나 app 폴더 내 파비콘 경로
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const GA_ID = 'G-12207483QQ'; // 👈 본인의 GA4 측정 ID로 교체하세요

  return (
    <html lang="ko">
      <head>
        {GA_ID && GA_ID !== 'G-12207483QQ' && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="bg-[#E9ECEF] text-slate-900 antialiased">{children}</body>
    </html>
  );
}