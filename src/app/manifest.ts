import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '아기속풀이 PRO',
    short_name: '아기속풀이',
    description: '사주 오행으로 읽어보는 우리 아이 기질 도감과 커플 가상 2세 시뮬레이션',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#FFF1F2',
    theme_color: '#FFF1F2',
    lang: 'ko',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
