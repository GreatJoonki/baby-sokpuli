import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ELEMENT_GUIDES } from '@/data/guideContent';

interface Props {
  params: Promise<{ element: string }>;
}

export async function generateStaticParams() {
  return Object.keys(ELEMENT_GUIDES).map((slug) => ({ element: slug }));
}

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
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* 상단 네비게이션 */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs transition-colors"
          >
            <span>←</span> 홈으로 돌아가기
          </Link>
          <span className="text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
            육아 백과
          </span>
        </div>

        {/* 메인 가이드 아티클 */}
        <article className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-7 text-left">
          
          <header className="space-y-3 border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-bold">
              <span>{guide.element}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight break-keep">
              {guide.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-medium break-keep leading-relaxed">
              {guide.subTitle}
            </p>
          </header>

          {/* 섹션 1: 타고난 기질 특징 */}
          <section className="space-y-2.5">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              1. 타고난 본성과 기질적 행동 특성
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal break-keep bg-slate-50/80 p-5 rounded-2xl border border-slate-100">
              {guide.temperament}
            </p>
          </section>

          {/* 섹션 2: 수면 퇴행 및 등센서 솔루션 */}
          <section className="space-y-2.5">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              2. 수면 퇴행·등센서 맞춤 처방전
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal break-keep bg-slate-50/80 p-5 rounded-2xl border border-slate-100">
              {guide.sleepSolution}
            </p>
          </section>

          {/* 섹션 3: 실전 훈육 및 상호작용 */}
          <section className="space-y-2.5">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              3. 부모를 위한 실전 양육 조언
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal break-keep bg-slate-50/80 p-5 rounded-2xl border border-slate-100">
              {guide.parentingAdvice}
            </p>
          </section>

          {/* 섹션 4: 주의사항 */}
          <section className="space-y-2.5">
            <h2 className="text-base sm:text-lg font-black text-rose-800">
              4. 양육 시 반드시 주의할 점
            </h2>
            <p className="text-sm sm:text-base text-rose-950 leading-relaxed font-normal break-keep bg-rose-50/60 p-5 rounded-2xl border border-rose-100">
              {guide.caution}
            </p>
          </section>

          {/* 하단 태그 */}
          <div className="pt-3 flex flex-wrap gap-2 border-t border-slate-100">
            {guide.keywords.map((kw) => (
              <span key={kw} className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                {kw}
              </span>
            ))}
          </div>

          {/* 인터랙티브 앱 연결 CTA (디자인 패턴 통일) */}
          <div className="pt-2">
            <Link
              href="/"
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm sm:text-base rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>우리 아기 생년월일로 사주 오행 기질 직접 분석하기</span>
            </Link>
          </div>

        </article>

        {/* 다른 기질 백서 탐색 링크 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 text-left space-y-3 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 block">다른 오행 기질 백서 둘러보기</span>
          <div className="flex flex-wrap gap-2">
            {Object.values(ELEMENT_GUIDES).map((g) => (
              <Link
                key={g.slug}
                href={`/guide/${g.slug}`}
                className="text-xs font-semibold px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-colors"
              >
                {g.element.split(' ')[0]} 기질
              </Link>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}