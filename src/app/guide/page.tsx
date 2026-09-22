import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '60갑자 사주 오행과 영유아 기질 발달 가이드 | 아기속풀이 PRO',
  description: '전통 동양 명리학의 음양오행 간지 체계와 현대 아동 발달심리학을 융합한 영유아 선천 기질 분석 백서입니다.',
};

export default function GuidePage() {
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
          <span className="text-[11px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
            기질도감 백서
          </span>
        </header>

        {/* 본문 아티클 */}
        <article className="space-y-6 text-slate-800 leading-relaxed text-xs sm:text-sm break-keep">
          <div className="space-y-2 border-b border-slate-100 pb-5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
              CHILD TEMPERAMENT RESEARCH
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              전통 60갑자 오행 이론과 현대 영유아 발달심리학의 상관성
            </h1>
            <p className="text-slate-500 text-xs font-medium">
              동양 명리학의 5대 에너지 체계와 토마스·체스(Thomas & Chess)의 9가지 기질 척도 비교
            </p>
          </div>

          {/* 섹션 1 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              1. 기질 분석의 학술적 배경과 음양오행의 해석
            </h2>
            <p className="text-slate-600">
              영유아 발달 연구에서 &lsquo;기질(Temperament)&rsquo;은 환경적 자극에 대한 개인의 고유하고 비교적 일관된 정서적·행동적 반응 양식으로 정의됩니다. 발달심리학의 개척자인 알렉산더 토마스(Alexander Thomas)와 스텔라 체스(Stella Chess)의 뉴욕 종단 연구(NYLS, 1977)에 따르면, 영유아의 약 65%는 순한 아이(40%), 까다로운 아이(10%), 더딘 아이(15%)라는 세 가지 뚜렷한 기질 범주로 분류됩니다.
            </p>
            <p className="text-slate-600">
              동양의 60갑자 체계는 인간이 태어난 시점의 천간(天干)과 지지(地支)를 기반으로 우주 자연의 기운을 다섯 가지 상징적 요소인 오행(목, 화, 토, 금, 수)으로 범주화합니다. 이는 현대 심리학의 접근-회피 동기, 감각 민감성, 활동 수준을 은유적 기호로 정밀하게 매핑한 전통적 관찰 체계로 평가할 수 있습니다.
            </p>
          </section>

          {/* 섹션 2: 5대 오행 본성 카드 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              2. 5대 오행(五行) 본성과 아동 발달 행동 양상
            </h2>
            
            <div className="space-y-3 pt-1">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-1.5">
                <h3 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block"></span>
                  목(木)의 기운: 진취적 탐색형 (Explorative Learner)
                </h3>
                <p className="text-slate-600 text-[11px] sm:text-xs">
                  봄의 싹트듯 위로 뻗어 나가는 성질을 가지며, 높은 지적 호기심과 빠른 대근육 발달을 특징으로 합니다. 눈앞의 물건을 직접 만지고 조작해야 직성이 풀리며, 제지당했을 때 일시적으로 강한 좌절감을 표현합니다. 대근육 놀이와 자율적 선택권 부여가 양육의 핵심입니다.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-1.5">
                <h3 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                  화(火)의 기운: 활동적 표현형 (Expressive Dynamo)
                </h3>
                <p className="text-slate-600 text-[11px] sm:text-xs">
                  여름의 불꽃처럼 에너지가 밖으로 분출되는 성향입니다. 감정 표현이 즉각적이고 활발하며 낯선 자극에 호의적으로 접근합니다. 에너지 소모량이 많아 낮 동안 충분한 신체 에너지를 방전시키지 않으면 밤잠 투정과 재수면 각성이 잦아지는 특성을 보입니다.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-1.5">
                <h3 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                  토(土)의 기운: 온화한 수용형 (Grounded Anchor)
                </h3>
                <p className="text-slate-600 text-[11px] sm:text-xs">
                  환절기의 완충재처럼 매사에 우직하고 완만하게 반응합니다. 급격한 환경 변화에는 신중하게 적응하지만, 한번 형성된 수면 및 수유 리듬은 높은 일관성을 유지합니다. 비위(소화기) 순환이 편안할 때 정서적 안정감이 극대화됩니다.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-1.5">
                <h3 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block"></span>
                  금(金)의 기운: 섬세한 질서형 (Reflective Observer)
                </h3>
                <p className="text-slate-600 text-[11px] sm:text-xs">
                  가을의 결실처럼 단단하고 명확한 경계를 선호합니다. 감각(청각, 촉각)이 예민하여 사소한 소음이나 기저귀의 축축함에 즉각 반응합니다. 일과표와 취침 루틴의 규칙성이 지켜질 때 가장 차분하고 정돈된 집중력을 보여줍니다.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-1.5">
                <h3 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-900 inline-block"></span>
                  수(水)의 기운: 깊은 정서형 (Empathetic Dreamer)
                </h3>
                <p className="text-slate-600 text-[11px] sm:text-xs">
                  겨울의 깊은 바다처럼 조용하고 유연한 순환을 나타냅니다. 풍부한 감수성과 관찰력을 지니며, 부모와의 신체 접촉 및 눈맞춤 교감에서 정서적 안전기지를 형성합니다. 분리불안이 도드라질 수 있으므로 충분한 스킨십이 필수적입니다.
                </p>
              </div>
            </div>
          </section>

          {/* 섹션 3 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              3. 적합성 적응도(Goodness of Fit)와 부모의 대처
            </h2>
            <p className="text-slate-600">
              발달심리학에서 가장 강조하는 개념은 &lsquo;적합성(Goodness of Fit)&rsquo;입니다. 아이의 기질에 절대적으로 좋거나 나쁜 것은 없으며, 부모의 양육 방식과 아이의 기질이 얼마나 조화를 이루는지가 아동의 정서 발달을 결정합니다.
            </p>
            <p className="text-slate-600">
              예를 들어 화(火) 기운이 강한 부모가 금(金) 기운의 섬세한 아동을 키울 때, 지나치게 빠른 템포로 지시하면 아이는 감각 과부하를 겪게 됩니다. 사주 오행은 부모가 자신과 아이의 상호작용 스타일을 객관화하여 서로의 템포를 맞추는 훌륭한 나침반 역할을 수행합니다.
            </p>
          </section>

          {/* 출처 및 참고 문헌 */}
          <footer className="pt-6 border-t border-slate-200 space-y-2 text-[11px] text-slate-500">
            <span className="font-extrabold text-slate-700 block">📚 학술 자료 및 참고 문헌</span>
            <ul className="space-y-1 pl-1">
              <li>• Thomas, A., & Chess, S. (1977). <i>Temperament and development</i>. Brunner/Mazel.</li>
              <li>• Rothbart, M. K. (2011). <i>Becoming Who We Are: Temperament and Personality in Development</i>. Guilford Press.</li>
              <li>• 김동완 (2018). <i>사주명리학 초격: 음양오행과 간지체계의 원리</i>. 동학사.</li>
            </ul>
          </footer>
        </article>

        {/* 홈 바로가기 버튼 */}
        <div className="pt-4">
          <Link
            href="/"
            className="block w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm rounded-2xl text-center transition-all shadow-md"
          >
            우리 아이 사주 기질 진단하러 가기
          </Link>
        </div>
      </div>
    </main>
  );
}