import React from 'react';
import Link from 'next/link';

export type LandingSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type FeatureLandingProps = {
  /** 상단 우측 칩 문구 */
  badge: string;
  /** 영문 eyebrow */
  eyebrow: string;
  title: string;
  subtitle: string;
  intro: string[];
  sections: LandingSection[];
  /** 메인 앱에서 열 기능 (?feature= 값) */
  feature: 'tarot' | 'court' | 'temperament' | 'couple' | 'difficulty';
  ctaText: string;
  /** 정직 고지 한 줄 (재미 목적 등) */
  note?: string;
};

export const FEATURE_LINKS: { href: string; label: string }[] = [
  { href: '/temperament', label: '우리 아이 기질 도감' },
  { href: '/wonder-weeks', label: '원더윅스 10대 도약기 백과' },
  { href: '/tarot', label: '오늘의 아기 속마음 타로' },
  { href: '/court', label: '오늘 밤 육아 당번 판결소' },
  { href: '/couple', label: '커플 가상 2세 시뮬레이터' },
  { href: '/difficulty', label: '부모-자녀 육아 난이도 진단' },
  { href: '/guide', label: '사주 오행 기질 백서' },
];

/**
 * 기능별 SEO 랜딩 공용 셸.
 * 기존 서브페이지(가이드/원더윅스)와 같은 app-bg 셸·타이포 문법을 따른다.
 * 본문은 서버 렌더링되고, CTA는 메인 앱의 ?feature= 파라미터로 연결된다.
 */
export default function FeatureLanding({
  badge,
  eyebrow,
  title,
  subtitle,
  intro,
  sections,
  feature,
  ctaText,
  note,
}: FeatureLandingProps) {
  const currentHref = `/${feature === 'temperament' ? 'temperament' : feature}`;
  const others = FEATURE_LINKS.filter((l) => l.href !== currentHref);

  return (
    <main className="min-h-screen bg-[#F8FAFC] app-bg flex justify-center py-0 sm:py-8 font-sans antialiased text-slate-900">
      <div className="w-full max-w-xl bg-[#FFFFFF] min-h-screen sm:min-h-0 sm:rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.06)] flex flex-col p-6 sm:p-8 border border-slate-100/80 space-y-6">
        {/* 상단 내비게이션 */}
        <header className="flex justify-between items-center border-b border-slate-100 pb-4">
          <Link
            href="/"
            className="text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
          >
            <span>←</span> 아기속풀이 홈으로
          </Link>
          <span className="text-[11px] font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-100">
            {badge}
          </span>
        </header>

        {/* 본문 아티클 */}
        <article className="space-y-6 text-slate-800 leading-relaxed text-sm sm:text-base break-keep">
          <div className="space-y-2 border-b border-slate-100 pb-5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">{eyebrow}</span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">{title}</h1>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">{subtitle}</p>
          </div>

          <div className="space-y-3">
            {intro.map((p, i) => (
              <p key={i} className="text-slate-600">
                {p}
              </p>
            ))}
          </div>

          {/* 바로 해보기 CTA (상단) */}
          <Link
            href={`/?feature=${feature}`}
            className="block w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm rounded-2xl text-center transition-all shadow-md"
          >
            {ctaText}
          </Link>

          {sections.map((sec, i) => (
            <section key={i} className="space-y-3">
              <h2 className="text-base sm:text-lg font-black text-slate-900">{sec.heading}</h2>
              {sec.paragraphs.map((p, j) => (
                <p key={j} className="text-slate-600">
                  {p}
                </p>
              ))}
              {sec.bullets && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-1.5">
                  <ul className="space-y-1 text-slate-600 text-xs sm:text-sm pl-1">
                    {sec.bullets.map((b, k) => (
                      <li key={k}>• {b}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          ))}

          {note && <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">{note}</p>}
        </article>

        {/* 하단 CTA + 다른 기능 */}
        <div className="pt-2 space-y-4">
          <Link
            href={`/?feature=${feature}`}
            className="block w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm rounded-2xl text-center transition-all shadow-md"
          >
            {ctaText}
          </Link>
          <nav className="space-y-2">
            <span className="text-xs font-bold text-slate-400 block">다른 기능도 둘러보기</span>
            <div className="flex flex-wrap gap-2">
              {others.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="px-3.5 py-2 rounded-xl bg-white border border-slate-200/80 text-xs font-bold text-slate-700 shadow-2xs hover:border-slate-400 transition-all"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </nav>
          <p className="pt-2 text-center text-[11px] text-slate-400">
            <Link href="/privacy" className="font-semibold text-slate-500 hover:text-slate-900 transition-colors">
              개인정보처리방침
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
