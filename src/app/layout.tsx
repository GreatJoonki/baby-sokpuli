import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: '아기속풀이 | 60갑자 아기 기질 도감 & 육아 날씨',
  description: '신생아부터 어린이까지 쏙 뽑아보는 60갑자 아기 성향 분석 및 사주 오행 기반 육아 난이도 측정',
  keywords: ['아기기질', '원더윅스', '육아난이도', '사주오행', '기질카드', '육아팁'],
  metadataBase: new URL('https://baby-sokpuli.vercel.app'),
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: '우리 아이 기질카드 & 육아 난이도 측정 🍼',
    description: '생년월일로 쏙 뽑아보는 60갑자 기질 분석과 부모-자녀 육아 난이도 진단! 오늘의 육아 날씨를 확인해보세요.',
    url: 'https://baby-sokpuli.vercel.app',
    siteName: '아기속풀이',
    images: [
      {
        url: 'https://baby-sokpuli.vercel.app/og-image.png', // 👈 절대 경로로 수정,
        width: 1200,
        height: 630,
        alt: '우리 아이 기질카드 대표 썸네일',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  // 🌟 [추가/수정] 트위터 카드 메타 태그 (절대 경로 적용)
  twitter: {
    card: 'summary_large_image',
    title: '우리 아이 기질카드 & 육아 난이도 측정 🍼',
    description: '생년월일로 쏙 뽑아보는 60갑자 기질 분석과 부모-자녀 육아 난이도 진단!',
    images: ['https://baby-sokpuli.vercel.app/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const GA_ID = 'G-12207483QQ'; // 👈 발급받으신 GA4 측정 ID

  return (
    <html lang="ko">
      <head>
        {/* 구글 애드센스 심사 코드 */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2413854196655476"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {GA_ID && (
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
