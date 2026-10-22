import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { WONDER_WEEKS_GUIDES } from '@/data/wonderWeeksContent';

interface Props {
  params: Promise<{ leap: string }>;
}

// 빌드 시 1일부터 10일까지의 정적 경로 사전 생성 (SSG)
export async function generateStaticParams() {
  return Object.keys(WONDER_WEEKS_GUIDES).map((leap) => ({ leap }));
}

// 메타데이터 동적 생성
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
          <span className="text-[11px] font-mono text-indigo-600 font-bold bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
            Leap {guide.leapNumber} 도약기 백서
          </span>
        </div>

        {/* 메인 콘텐츠 아티클 */}
        <article className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6 text-left">
          
          <header className="space-y-2 border-b border-slate-100 pb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-black">
              <span>{guide.icon}</span>
              <span>{guide.timing}</span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 leading-snug break-keep">
              {guide.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium break-keep">
              {guide.subTitle}
            </p>
          </header>

          {/* 섹션 1: 아기의 신체 및 인지 변화 */}
          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5">
              <span>🧠</span> 1. 아기의 뇌와 신체 발달 변화
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium break-keep bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {guide.babyChange}
            </p>
          </section>

          {/* 섹션 2: 주요 증상 및 수면 퇴행 */}
          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5">
              <span>🌙</span> 2. 주요 수면 퇴행 및 까다로운 행동 징후
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium break-keep bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {guide.signAndSymptom}
            </p>
          </section>

          {/* 섹션 3: 양육 및 대처 솔루션 */}
          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5">
              <span>💡</span> 3. 부모를 위한 현명한 대처 솔루션
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium break-keep bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {guide.parentingSolution}
            </p>
          </section>

          {/* 섹션 4: 아빠 엄마 멘탈 케어 팁 */}
          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-black text-indigo-700 flex items-center gap-1.5">
              <span>☕</span> 4. 육아 동지를 위한 멘탈 케어 팁
            </h2>
            <p className="text-xs sm:text-sm text-indigo-950/90 leading-relaxed font-medium break-keep bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100">
              {guide.momTip}
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
              <span>🔮</span> 우리 아기 생년월일로 원더윅스 도약기 계산하기
            </Link>
          </div>

        </article>

        {/* 다른 도약기 탐색 링크 퀵내비게이션 */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 text-left space-y-2.5 shadow-2xs">
          <span className="text-xs font-bold text-slate-700 block">원더윅스 1~10차 도약기 전체 보기</span>
          <div className="grid grid-cols-5 gap-1.5">
            {Object.values(WONDER_WEEKS_GUIDES).map((w) => (
              <Link
                key={w.slug}
                href={`/wonder-weeks/${w.slug}`}
                className={`text-center py-2 text-[11px] font-bold rounded-xl border transition-colors ${
                  w.slug === leap
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 hover:bg-indigo-50 text-slate-700 border-slate-200'
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