import { ImageResponse } from 'next/og';
import { NOTO_SANS_KR_BOLD_SUBSET_BASE64 } from './fonts/noto-sans-kr-bold-subset';

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';
export const OG_ALT = '아기속풀이 PRO';

let fontDataCache: ArrayBuffer | null = null;

function loadFont(): ArrayBuffer {
  if (!fontDataCache) {
    const buf = Buffer.from(NOTO_SANS_KR_BOLD_SUBSET_BASE64, 'base64');
    fontDataCache = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
  }
  return fontDataCache;
}

/**
 * 브랜드형 OG 이미지 공용 렌더러.
 * 파스텔 그라데이션 배경 + 브랜드 pill + 큰 제목 + 한 줄 소개.
 * 한글은 서브셋 폰트(NotoSansKR Bold)로 렌더링한다 — og 이미지 문구에 쓰는
 * 글자가 늘어나면 폰트 서브셋도 다시 만들어야 한다.
 */
export async function renderOgImage(title: string, subtitle: string) {
  const fontData = loadFont();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '72px 84px',
          background: 'linear-gradient(135deg, #FFF1F2 0%, #FDF4FF 52%, #EEF2FF 100%)',
          fontFamily: 'NotoSansKR',
          position: 'relative',
        }}
      >
        {/* 장식 원 */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -80,
            width: 340,
            height: 340,
            borderRadius: 9999,
            background: 'rgba(251, 207, 232, 0.55)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -140,
            right: 180,
            width: 260,
            height: 260,
            borderRadius: 9999,
            background: 'rgba(186, 230, 253, 0.5)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 84,
            right: 320,
            width: 26,
            height: 26,
            borderRadius: 9999,
            background: '#FBBF24',
          }}
        />

        <div
          style={{
            display: 'flex',
            alignSelf: 'flex-start',
            background: '#FFFFFF',
            color: '#E11D48',
            fontSize: 30,
            fontWeight: 700,
            padding: '12px 28px',
            borderRadius: 9999,
            border: '2px solid #FECDD3',
            marginBottom: 44,
          }}
        >
          아기속풀이 PRO
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 86,
            fontWeight: 700,
            color: '#0F172A',
            lineHeight: 1.18,
            letterSpacing: -2,
            marginBottom: 30,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 35,
            fontWeight: 700,
            color: '#475569',
            lineHeight: 1.45,
          }}
        >
          {subtitle}
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 56,
            left: 84,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <div style={{ width: 44, height: 6, borderRadius: 9999, background: '#F43F5E', display: 'flex' }} />
          <div style={{ fontSize: 24, color: '#94A3B8', display: 'flex' }}>baby-sokpuli.vercel.app</div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        {
          name: 'NotoSansKR',
          data: fontData,
          weight: 700,
          style: 'normal',
        },
      ],
    }
  );
}
