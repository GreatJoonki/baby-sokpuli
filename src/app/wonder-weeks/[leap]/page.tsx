import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { WONDER_WEEKS_GUIDES } from '@/data/wonderWeeksContent';

interface Props {
  params: Promise<{ leap: string }>;
}

export async function generateStaticParams() {
  return Object.keys(WONDER_WEEKS_GUIDES).map((leap) => ({ leap }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { leap } = await params;
  const guide = WONDER_WEEKS_GUIDES[leap];
  if (!guide) return { title: '가이드를 찾을 수 없습니다' };

  return {
    title: `${guide.title} | 아기속풀이 육아 백과`,
    description: `${guide.subTitle} - ${guide.timing} 아기 수면 퇴행 및 성장 도약기 대처 가이드`,
    keywords: guide.keywords.join(', '),
  };
}

export default async function WonderWeekDetailPage({ params }: Props) {
  const { leap } = await params;
  const guide = WONDER_WEEKS_GUIDES[leap];

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
          <span className="text-xs font-semibold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
            Leap {guide.leapNumber} 도약기
          </span>
        </div>

        {/* 메인 콘텐츠 아티클 */}
        <article className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-7 text-left">
          
          <header className="space-y-3 border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-bold">
              <span>{guide.timing}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight break-keep">
              {guide.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-medium break-keep leading-relaxed">
              {guide.subTitle}
            </p>
          </header>

          {/* 섹션 1: 아기의 신체 및 인지 변화 */}
          <section className="space-y-2.5">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              1. 아기의 뇌와 신체 발달 변화
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal break-keep bg-slate-50/80 p-5 rounded-2xl border border-slate-100">
              {guide.babyChange}
            </p>
          </section>

          {/* 섹션 2: 주요 증상 및 수면 퇴행 */}
          <section className="space-y-2.5">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              2. 주요 수면 퇴행 및 까다로운 행동 징후
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal break-keep bg-slate-50/80 p-5 rounded-2xl border border-slate-100">
              {guide.signAndSymptom}
            </p>
          </section>

          {/* 섹션 3: 양육 및 대처 솔루션 */}
          <section className="space-y-2.5">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              3. 부모를 위한 현명한 대처 솔루션
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal break-keep bg-slate-50/80 p-5 rounded-2xl border border-slate-100">
              {guide.parentingSolution}
            </p>
          </section>

          {/* 섹션 4: 멘탈 케어 팁 */}
          <section className="space-y-2.5">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              4. 육아 동지를 위한 멘탈 케어 팁
            </h2>
            <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal break-keep bg-slate-100/70 p-5 rounded-2xl border border-slate-200/60">
              {guide.momTip}
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

          {/* 인터랙티브 앱 연결 CTA */}
          <div className="pt-2">
            <Link
              href="/"
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm sm:text-base rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>우리 아기 생년월일로 원더윅스 도약기 계산하기</span>
            </Link>
          </div>

        </article>

        {/* 다른 도약기 탐색 퀵내비게이션 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 text-left space-y-3 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 block">원더윅스 1~10차 도약기 전체 보기</span>
          <div className="grid grid-cols-5 gap-2">
            {Object.values(WONDER_WEEKS_GUIDES).map((w) => (
              <Link
                key={w.slug}
                href={`/wonder-weeks/${w.slug}`}
                className={`text-center py-2.5 text-xs font-bold rounded-xl border transition-colors ${
                  w.slug === leap
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {w.leapNumber}도약기
              </Link>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}