import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ELEMENT_GUIDES } from '@/data/guideContent';

interface Props {
  params: Promise<{ element: string }>;
}

// 구글 봇이 읽을 정적 경로 5개 사전 생성 (SSG)
export async function generateStaticParams() {
  return Object.keys(ELEMENT_GUIDES).map((slug) => ({ element: slug }));
}

// SEO 메타데이터 동적 생성
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { element } = await params;
  const guide = ELEMENT_GUIDES[element];
  if (!guide) return { title: '가이드를 찾을 수 없습니다' };

  return {
    title: `${guide.title} | 아기속풀이 육아 백과`,
    description: `${guide.subTitle} - 사주 오행 기질별 맞춤 수면 솔루션 및 양육 가이드`,
    keywords: guide.keywords.join(', '),
  };
}

export default async function GuidePage({ params }: Props) {
  const { element } = await params;
  const guide = ELEMENT_GUIDES[element];

  if (!guide) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-5">
        
        {/* 상단 네비게이션 */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs"
          >
            <span>←</span> 아기속풀이 홈으로
          </Link>
          <span className="text-[11px] font-mono text-slate-400 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
            육아 백과 PRO
          </span>
        </div>

        {/* 메인 가이드 아티클 */}
        <article className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6 text-left">
          
          <header className="space-y-2 border-b border-slate-100 pb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black">
              <span>{guide.icon}</span>
              <span>{guide.element}</span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 leading-snug break-keep">
              {guide.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium break-keep">
              {guide.subTitle}
            </p>
          </header>

          {/* 섹션 1: 타고난 기질 특징 */}
          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5">
              <span>📌</span> 1. 타고난 본성과 기질적 행동 특성
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium break-keep bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {guide.temperament}
            </p>
          </section>

          {/* 섹션 2: 수면 퇴행 및 등센서 솔루션 */}
          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5">
              <span>🌙</span> 2. 수면 퇴행·등센서 맞춤 처방전
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium break-keep bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {guide.sleepSolution}
            </p>
          </section>

          {/* 섹션 3: 실전 훈육 및 상호작용 */}
          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5">
              <span>💡</span> 3. 부모를 위한 실전 양육 조언
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium break-keep bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {guide.parentingAdvice}
            </p>
          </section>

          {/* 섹션 4: 주의사항 */}
          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-black text-rose-700 flex items-center gap-1.5">
              <span>⚠️</span> 4. 양육 시 반드시 주의할 점
            </h2>
            <p className="text-xs sm:text-sm text-rose-900/90 leading-relaxed font-medium break-keep bg-rose-50/70 p-4 rounded-2xl border border-rose-100">
              {guide.caution}
            </p>
          </section>

          {/* 하단 태그 */}
          <div className="pt-2 flex flex-wrap gap-1.5 border-t border-slate-100">
            {guide.keywords.map((kw) => (
              <span key={kw} className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                {kw}
              </span>
            ))}
          </div>

          {/* 인터랙티브 앱 연결 CTA */}
          <div className="pt-2">
            <Link
              href="/"
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <span>🔮</span> 우리 아기 생년월일로 사주 오행 기질 직접 분석하기
            </Link>
          </div>

        </article>

        {/* 다른 기질 백서 탐색 링크 (크롤러 링크 구조 완성) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 text-left space-y-2 shadow-2xs">
          <span className="text-xs font-bold text-slate-700 block">다른 오행 기질 백서 둘러보기</span>
          <div className="flex flex-wrap gap-2">
            {Object.values(ELEMENT_GUIDES).map((g) => (
              <Link
                key={g.slug}
                href={`/guide/${g.slug}`}
                className="text-[11px] font-bold px-2.5 py-1 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 rounded-lg border border-slate-200 transition-colors"
              >
                {g.icon} {g.element.split(' ')[0]} 기질
              </Link>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}