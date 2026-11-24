import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침 | 아기속풀이 PRO',
  description:
    '아기속풀이 PRO의 개인정보처리방침입니다. 회원가입 없이 이용하며, 입력한 정보는 서버에 저장되지 않고 이용자 기기의 브라우저 로컬 저장소에만 저장됩니다.',
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: '개인정보처리방침 | 아기속풀이 PRO',
    description:
      '아기속풀이 PRO가 이용자 정보를 어떻게 다루는지 안내합니다. 입력 정보는 서버에 저장되지 않고 기기 내 로컬 저장소에만 보관됩니다.',
    url: 'https://baby-sokpuli.vercel.app/privacy',
    siteName: '아기속풀이 PRO',
    locale: 'ko_KR',
    type: 'article',
  },
};

const STORAGE_ITEMS: { name: string; desc: string }[] = [
  {
    name: '아이 프로필',
    desc: '아기 기질 도감 이용을 위해 입력한 아이의 이름, 성별, 생년월일, 태어난 시간(선택), 출생 예정일(선택)이 저장됩니다.',
  },
  {
    name: '부모 생년월일과 판결 결과',
    desc: '육아 당번 판결소·난이도 진단 이용 시 입력한 부모의 생년월일과, 그날의 판결·진단 결과가 저장됩니다.',
  },
  {
    name: '오늘의 타로 결과',
    desc: '날짜와 아이별로 그날 뽑은 타로 카드 결과가 저장됩니다.',
  },
  {
    name: '방문·출석 기록',
    desc: '출석 도장 표시를 위해 방문한 날짜 목록, 마지막 방문일, 누적 방문 횟수가 저장됩니다.',
  },
  {
    name: '이어보기·화면 설정',
    desc: '마지막으로 본 아이 프로필의 식별값과 밤중 모드(다크 모드) 설정값이 저장됩니다.',
  },
];

export default function PrivacyPage() {
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
          <span className="text-[11px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
            개인정보처리방침
          </span>
        </header>

        {/* 본문 아티클 */}
        <article className="space-y-6 text-slate-800 leading-relaxed text-sm sm:text-base break-keep">
          <div className="space-y-2 border-b border-slate-100 pb-5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
              PRIVACY POLICY
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              개인정보처리방침
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">
              아기속풀이 PRO(이하 &lsquo;서비스&rsquo;)는 이용자의 정보를 어떻게 다루는지 아래와 같이 안내합니다.
            </p>
          </div>

          <p className="text-slate-600">
            서비스는 회원가입이나 로그인이 없으며, 이용자가 입력한 정보를 운영자의 서버 데이터베이스에 수집·저장하지
            않습니다. 기능 이용을 위해 입력한 정보는 이용자 본인의 기기(브라우저 로컬 저장소)에만 저장되며, 아래
            안내하는 외부 서비스(방문 통계·광고 등)를 통한 처리는 각 항목에서 따로 설명합니다.
          </p>

          {/* 섹션 1 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              1. 수집하는 정보와 저장 방식
            </h2>
            <p className="text-slate-600">
              이용자가 기능을 사용하면서 직접 입력한 정보는 서비스 제공을 위한 계산에만 사용되고, 운영자의 서버로
              전송·저장되지 않습니다. 입력 정보는 이용자 기기의 브라우저 로컬 저장소(localStorage)에 아래와 같이
              저장되어, 다시 방문했을 때 지난 결과를 이어서 볼 수 있게 합니다.
            </p>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-2.5">
              <ul className="space-y-2 text-slate-600 text-xs sm:text-sm pl-1">
                {STORAGE_ITEMS.map((item) => (
                  <li key={item.name}>
                    <span className="font-bold text-slate-800">• {item.name}</span>
                    <span className="block pl-3 mt-0.5">{item.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-slate-600">
              결과 공유 기능을 이용해 공유 링크를 만드는 경우, 결과 확인에 필요한 정보(아이 이름, 생년월일 등)가
              링크 주소(URL)의 파라미터에 포함됩니다. 이 링크는 이용자가 직접 상대방에게 보내는 것이며, 링크를 받은
              사람은 같은 결과를 볼 수 있으므로 공유에 유의해 주세요.
            </p>
          </section>

          {/* 섹션 2 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900">2. 정보의 이용 목적</h2>
            <ul className="space-y-1.5 text-slate-600 pl-1">
              <li>• 아이 기질 분석, 원더윅스 도약기 계산, 타로, 육아 당번 판결 등 서비스 기능 제공</li>
              <li>• 지난 결과 이어보기, 출석 도장 등 편의 기능 제공</li>
              <li>• 방문 통계 분석을 통한 서비스 개선 (아래 4항의 Google Analytics 이용)</li>
              <li>• 광고 서비스 도입 시 광고 게재 (아래 4항의 Google AdSense 이용)</li>
            </ul>
          </section>

          {/* 섹션 3 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900">3. 보관 기간과 삭제 방법</h2>
            <p className="text-slate-600">
              로컬 저장소에 저장된 정보는 이용자가 삭제할 때까지 본인 기기에만 보관되며, 운영자는 이 정보를 따로
              보관하지 않습니다. 삭제는 언제든 아래 방법으로 할 수 있습니다.
            </p>
            <ul className="space-y-1.5 text-slate-600 pl-1">
              <li>• 아이 프로필은 서비스 화면에서 프로필 삭제 버튼으로 지울 수 있습니다.</li>
              <li>
                • 전체 정보는 사용 중인 브라우저의 설정에서 본 사이트의 사이트 데이터(쿠키 및 사이트 데이터)를
                삭제하면 한 번에 모두 지워집니다.
              </li>
            </ul>
          </section>

          {/* 섹션 4 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              4. 쿠키와 외부 서비스 안내
            </h2>
            <p className="text-slate-600">
              서비스는 아래 외부 서비스를 이용합니다. 각 서비스는 자체 개인정보처리방침에 따라 정보를 처리할 수
              있습니다.
            </p>
            <ul className="space-y-2 text-slate-600 pl-1">
              <li>
                <span className="font-bold text-slate-800">• Google Analytics (방문 통계)</span>
                <span className="block pl-3 mt-0.5">
                  방문·이용 통계 분석을 위해 쿠키를 사용하며, 방문 기록, 기기·브라우저 정보, 버튼 클릭 같은 이용
                  이벤트가 Google로 전송되어 처리됩니다. 이용자가 입력한 아이와 부모의 이름·생년월일 등 입력 정보는
                  이 통계 서비스로 보내지 않습니다.
                </span>
              </li>
              <li>
                <span className="font-bold text-slate-800">• Google AdSense (광고)</span>
                <span className="block pl-3 mt-0.5">
                  현재 광고 도입을 위한 심사 대기 중으로, 페이지에 광고 로더 스크립트가 포함되어 있습니다. 광고
                  서비스가 실제로 도입되면 Google이 쿠키를 사용해 광고 게재와 맞춤 광고 제공을 할 수 있으며,
                  이용자는 Google 광고 설정에서 맞춤 광고를 거부할 수 있습니다.
                </span>
              </li>
              <li>
                <span className="font-bold text-slate-800">• 쿠팡 파트너스 (제휴 링크)</span>
                <span className="block pl-3 mt-0.5">
                  서비스 일부 링크는 쿠팡 파트너스 제휴 링크입니다. 링크를 눌러 쿠팡으로 이동한 뒤에는 쿠팡의
                  개인정보처리방침이 적용됩니다. ※ 이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의
                  수수료를 제공받습니다.
                </span>
              </li>
              <li>
                <span className="font-bold text-slate-800">• 결과 공유 (카카오톡 등)</span>
                <span className="block pl-3 mt-0.5">
                  이용자가 공유 버튼을 누른 경우에 한해, 결과 제목·설명·링크가 카카오톡 공유 또는 기기의 공유
                  기능을 통해 이용자가 선택한 상대방에게 전달됩니다.
                </span>
              </li>
            </ul>
          </section>

          {/* 섹션 5 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900">5. 개인정보의 제3자 제공</h2>
            <p className="text-slate-600">
              운영자는 이용자의 정보를 제3자에게 제공하지 않는 것을 원칙으로 합니다. 입력 정보는 운영자 서버에
              저장되지 않으므로 제공할 정보 자체를 보유하고 있지 않으며, 다만 법령에 근거한 정당한 요청이 있는
              경우와 위 4항의 외부 서비스가 자체 방침에 따라 처리하는 경우는 예외로 합니다.
            </p>
          </section>

          {/* 섹션 6 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900">6. 이용자의 권리</h2>
            <p className="text-slate-600">
              이용자는 본인 기기에 저장된 정보를 언제든 직접 확인·삭제할 수 있습니다(3항 참조). 운영자는 서버에
              이용자의 개인정보를 보유하고 있지 않아 별도의 열람·정정 대상 정보가 없으며, 처리 방식에 대한 문의나
              권리 행사 요청은 아래 문의처로 연락해 주시면 안내해 드립니다.
            </p>
          </section>

          {/* 섹션 7 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900">7. 문의처</h2>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-1.5">
              <p className="text-slate-600 text-xs sm:text-sm">
                개인정보 관련 문의:{' '}
                <a
                  href="mailto:hamin.save.moment@gmail.com"
                  className="font-bold text-slate-800 underline underline-offset-2"
                >
                  hamin.save.moment@gmail.com
                </a>
              </p>
              <p className="text-slate-600 text-xs sm:text-sm">
                인스타그램: @hamin_hayoon_day
              </p>
            </div>
          </section>

          {/* 섹션 8 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900">8. 방침의 변경과 시행일</h2>
            <p className="text-slate-600">
              이 방침의 내용이 추가·삭제·수정되는 경우 변경 사항을 이 페이지에 게시합니다.
            </p>
            <p className="text-slate-600">시행일자: 2026년 11월 24일</p>
          </section>
        </article>

        {/* 홈 바로가기 버튼 */}
        <div className="pt-4">
          <Link
            href="/"
            className="block w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm rounded-2xl text-center transition-all shadow-md"
          >
            아기속풀이 홈으로 가기
          </Link>
        </div>
      </div>
    </main>
  );
}
