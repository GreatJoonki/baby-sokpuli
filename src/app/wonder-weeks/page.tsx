import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '원더윅스(Wonder Weeks) 10대 도약기 완벽 분석 백과 | 아기속풀이 PRO',
  description: '생후 20개월 동안 겪는 10번의 두뇌 급성장 도약기 주기, 출산 예정일 기준 계산법, 수면 퇴행 극복 솔루션을 제공합니다.',
};

export default function WonderWeeksPage() {
  return (
    <main className="min-h-screen bg-[#E9ECEF] flex justify-center py-0 sm:py-8 font-sans antialiased text-slate-900">
      <div className="w-full max-w-xl bg-[#FFFFFF] min-h-screen sm:min-h-0 sm:rounded-[36px] shadow-[0_20px_40px_rgba(0,0,0,0.06)] flex flex-col p-6 sm:p-8 border border-slate-100 space-y-6">
        
        {/* 상단 내비게이션 */}
        <header className="flex justify-between items-center border-b border-slate-100 pb-4">
          <Link
            href="/"
            className="text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
          >
            <span>←</span> 아기속풀이 홈으로
          </Link>
          <span className="text-[11px] font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-100">
            원더윅스 백과
          </span>
        </header>

        {/* 본문 아티클 */}
        <article className="space-y-6 text-slate-800 leading-relaxed text-xs sm:text-sm break-keep">
          <div className="space-y-2 border-b border-slate-100 pb-5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
              DEVELOPMENTAL MILESTONES
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              원더윅스(Wonder Weeks) 10대 도약기의 과학적 기전과 대처 가이드
            </h1>
            <p className="text-slate-500 text-xs font-medium">
              출산 예정일 기준 계산 이유와 영유아 수면 퇴행(Sleep Regression) 극복법
            </p>
          </div>

          {/* 섹션 1 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              1. 원더윅스의 정의와 계산 기준의 원리
            </h2>
            <p className="text-slate-600">
              &lsquo;원더윅스(The Wonder Weeks)&rsquo;는 네덜란드의 행동생물학자이자 발달심리학자인 프란스 플로이(Frans X. Plooij) 박사와 헤티 판 더 헤이트(Hetty van de Rijt) 박사가 35년간의 영아 관찰 연구를 바탕으로 정립한 발달 이론입니다.
            </p>
            <p className="text-slate-600">
              많은 부모가 혼란을 겪는 핵심 포인트는 <b>계산 기준일</b>입니다. 원더윅스는 실제 출생일이 아닌 <b>&lsquo;출산 예정일(Due Date)&rsquo;</b>을 기준으로 계산해야 정확합니다. 뇌와 중추신경계의 생물학적 성숙 속도는 자궁 내 수태 시점부터 시작되므로, 조산아나 과숙아 모두 수정란 형성 후 경과된 절대적 주수에 맞춰 도약기가 발생하기 때문입니다.
            </p>
          </section>

          {/* 섹션 2: 10대 도약기 상세 리스트 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              2. 생후 20개월 동안 거치는 10대 정신적 도약(Mental Leap)
            </h2>
            
            <div className="space-y-3 pt-1">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-1">
                <span className="text-xs font-black text-indigo-700">제1도약기 (생후 5주경) · 감각의 변화</span>
                <p className="text-slate-600 text-[11px] sm:text-xs">
                  빛, 냄새, 소리 등 오감 자극이 뇌로 한꺼번에 쏟아져 들어옵니다. 모로반사가 증가하고 깜짝 놀라며 우는 횟수가 늘어납니다.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-1">
                <span className="text-xs font-black text-indigo-700">제2도약기 (생후 8주경) · 패턴의 인지</span>
                <p className="text-slate-600 text-[11px] sm:text-xs">
                  자신의 손과 발을 신기하게 응시하며, 주변 사물의 규칙적인 명암 패턴과 목소리 억양을 인지하기 시작합니다.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-1">
                <span className="text-xs font-black text-indigo-700">제3도약기 (생후 12주경) · 유연한 변화</span>
                <p className="text-slate-600 text-[11px] sm:text-xs">
                  목을 가누고 딸랑이를 흔드는 등 부드러운 움직임을 통제합니다. 옹알이가 급증하고 주변과 소통하려는 반응이 두드러집니다.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-1">
                <span className="text-xs font-black text-rose-600">제4도약기 (생후 19주경) · 마의 19주 폭풍</span>
                <p className="text-slate-600 text-[11px] sm:text-xs">
                  인과관계와 사건의 발생 순서를 깨닫습니다. 뇌 신경망의 대규모 리모델링으로 인해 심각한 수면 퇴행과 등센서 각성이 동반되는 가장 힘든 구간입니다.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-1">
                <span className="text-xs font-black text-indigo-700">제5도약기 (생후 26주경) · 관계의 인지</span>
                <p className="text-slate-600 text-[11px] sm:text-xs">
                  사물과 양육자 사이의 물리적 거리를 이해합니다. 엄마 아빠와 자신이 떨어질 수 있다는 사실을 인지하며 분리불안이 본격화됩니다.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-1">
                <span className="text-xs font-black text-indigo-700">제6도약기 (생후 37주경) · 범주의 인지</span>
                <p className="text-slate-600 text-[11px] sm:text-xs">
                  강아지 인형과 진짜 강아지가 같은 &lsquo;동물&rsquo;이라는 공통점을 묶어 사고하기 시작합니다. 촉감 놀이와 그림책에 눈을 뜹니다.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-1">
                <span className="text-xs font-black text-indigo-700">제7도약기 (생후 46주경) · 순서의 도약</span>
                <p className="text-slate-600 text-[11px] sm:text-xs">
                  물건을 통에 넣었다 빼는 일의 연속성을 이해합니다. 숟가락질 시도와 블록 쌓기 등 소근육 협응이 급격히 정교해집니다.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-1">
                <span className="text-xs font-black text-indigo-700">제8도약기 (생후 55주경) · 체계의 도약</span>
                <p className="text-slate-600 text-[11px] sm:text-xs">
                  돌 무렵 식사 시간, 목욕 시간 등 하루 일과의 순서와 가족 간의 약속을 직관적으로 이해하고 따르기 시작합니다.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-1">
                <span className="text-xs font-black text-indigo-700">제9도약기 (생후 64주경) · 원리의 도약</span>
                <p className="text-slate-600 text-[11px] sm:text-xs">
                  자아와 소유 개념이 생기며 고집을 부리고 떼를 씁니다. 자신의 의도대로 상황을 조작하려는 협상 본능이 나타납니다.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-1">
                <span className="text-xs font-black text-emerald-600">제10도약기 (생후 75주경) · 체계의 완성</span>
                <p className="text-slate-600 text-[11px] sm:text-xs">
                  단어 조합 대화가 가능해지며 사회적 규칙과 타인의 감정을 이해하는 꼬마 대장으로 훌쩍 성장합니다.
                </p>
              </div>
            </div>
          </section>

          {/* 섹션 3 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              3. 도약기 3대 핵심 징후(3C)와 부모의 실전 솔루션
            </h2>
            <p className="text-slate-600">
              원더윅스 구간의 아기는 <b>울음(Crying), 집착(Clinginess), 보챔(Crankiness)</b>이라는 3C 징후를 보입니다. 세상이 완전히 달라 보이는 뇌 과부하 상태에서 유일하게 믿을 수 있는 양육자에게 필사적으로 달라붙는 것입니다.
            </p>
            <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-2">
              <span className="font-extrabold text-amber-900 text-xs">💡 부모의 멘탈 수호 솔루션 3원칙</span>
              <ul className="space-y-1 text-[11px] text-amber-800 pl-1">
                <li>• <b>양육 잘못이 아닙니다:</b> 아기의 칭얼거림은 지능이 정밀하게 도약하고 있다는 건강한 증거입니다.</li>
                <li>• <b>수면 교육을 일시 중단하세요:</b> 도약기 기간에는 눕혀 재우기 고집보다 아기띠나 포옹으로 신경계를 안정시키는 것이 우선입니다.</li>
                <li>• <b>부모 교대 휴식이 필수입니다:</b> 혼자서 버티지 마시고 배우자나 가족과 2시간씩 육아 교대를 통해 수면 빚을 갚아야 합니다.</li>
              </ul>
            </div>
          </section>

          {/* 출처 및 참고 문헌 */}
          <footer className="pt-6 border-t border-slate-200 space-y-2 text-[11px] text-slate-500">
            <span className="font-extrabold text-slate-700 block">📚 학술 자료 및 참고 문헌</span>
            <ul className="space-y-1 pl-1">
              <li>• Van de Rijt, H., & Plooij, F. X. (2019). <i>The Wonder Weeks: A Stress-Free Guide to Your Baby&apos;s 10 Predictable, Great, Fussy Phases</i>. Kiddy World Publishing.</li>
              <li>• Plooij, F. X. (2003). <i>The developmental leaps of early childhood</i>. Infant Behavior and Development.</li>
            </ul>
          </footer>
        </article>

        {/* 홈 바로가기 버튼 */}
        <div className="pt-4">
          <Link
            href="/"
            className="block w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm rounded-2xl text-center transition-all shadow-md"
          >
            우리 아이 원더윅스 디데이 계산하기
          </Link>
        </div>
      </div>
    </main>
  );
}