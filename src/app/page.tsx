'use client';

import React, { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { toPng } from 'html-to-image';

function trackEvent(action: string, category: string, label: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
    });
  }
}

// 결과 저장/공유 성공 시 가벼운 컨페티 (라이브러리 없이 WAAPI로 1회성 연출, 1~2초 내 소멸)
function fireConfetti() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const colors = ['#F472B6', '#60A5FA', '#FBBF24', '#818CF8', '#34D399', '#FDA4AF'];
  const layer = document.createElement('div');
  layer.className = 'confetti-layer';
  document.body.appendChild(layer);
  const animations: Animation[] = [];
  for (let i = 0; i < 26; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    const size = 6 + Math.random() * 6;
    piece.style.width = `${size}px`;
    piece.style.height = `${size * (0.5 + Math.random() * 0.9)}px`;
    piece.style.left = `${8 + Math.random() * 84}vw`;
    piece.style.backgroundColor = colors[i % colors.length];
    layer.appendChild(piece);
    const drift = (Math.random() - 0.5) * 160;
    animations.push(
      piece.animate(
        [
          { transform: 'translate3d(0, -4vh, 0) rotate(0deg)', opacity: 1 },
          { transform: `translate3d(${drift * 0.6}px, 55vh, 0) rotate(${240 + Math.random() * 240}deg)`, opacity: 1, offset: 0.7 },
          { transform: `translate3d(${drift}px, 92vh, 0) rotate(${420 + Math.random() * 300}deg)`, opacity: 0 },
        ],
        { duration: 1300 + Math.random() * 500, delay: Math.random() * 180, easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)', fill: 'forwards' }
      )
    );
  }
  Promise.allSettled(animations.map((a) => a.finished)).then(() => layer.remove());
  setTimeout(() => layer.remove(), 2600);
}

const SERVICE_LINKS = {
  youtube: 'https://www.youtube.com/@Hamin_Hayoon_day?utm_source=baby_sokpuli&utm_medium=lounge&utm_campaign=youtube',
  instagramProfile: 'https://www.instagram.com/hamin_hayoon_day/?utm_source=baby_sokpuli&utm_medium=instagram',
  instagramDM: 'https://ig.me/m/hamin_hayoon_day?utm_source=baby_sokpuli&utm_medium=ai_teaser&utm_campaign=dm_inquiry',
  coupangDefault: 'https://link.coupang.com/a/gZzbA8ezNk',
  parentHealing: 'https://link.coupang.com/a/gZAUwv5ctw',
};

const PARENT_HEALING_PRODUCTS = {
  level5: { title: '무선 온열 목·어깨 마사지기', subTitle: '지친 하루, 뻐근해진 승모근과 목을 시원하게', icon: '💆', link: 'https://link.coupang.com/a/gZzATurY6u' },
  level4: { title: '콜드브루 디카페인 파우치 세트', subTitle: '지친 오후 부모 멘탈을 채워줄 든든한 카페인 수혈', icon: '☕', link: 'https://link.coupang.com/a/gZzDh8XAE8' },
  level3: { title: '유기농 카모마일 릴랙스 티 세트', subTitle: '육퇴 후 복잡한 생각을 비우고 편안한 숙면을', icon: '🫖', link: 'https://link.coupang.com/a/gZzHmhAhae' },
  level2: { title: '천연 아로마 롤온 힐링 테라피', subTitle: '하루 1분, 손목에 가볍게 바르는 스트레스 완화', icon: '🌿', link: 'https://link.coupang.com/a/gZzJINaiAK' },
  level1: { title: '프리미엄 페어링 디저트 컬렉션', subTitle: '평화로운 육퇴 후 부부가 함께 나누는 달콤한 보상', icon: '🍪', link: 'https://link.coupang.com/a/gZzLYIshOK' },
};

const BABY_POTION_LINKS: Record<'wood' | 'fire' | 'earth' | 'metal' | 'water', Record<'infant' | 'toddler' | 'child', string>> = {
  wood: { infant: 'https://link.coupang.com/a/gZxQNRGK0i', toddler: 'https://link.coupang.com/a/gZzTAoFGHA', child: 'https://link.coupang.com/a/gZzWiJKXxA' },
  fire: { infant: 'https://link.coupang.com/a/gZz0FSD20y', toddler: 'https://link.coupang.com/a/gZz2WPe6cS', child: 'https://link.coupang.com/a/gZz5q33Qqa' },
  earth: { infant: 'https://link.coupang.com/a/gZz7vAV37s', toddler: 'https://link.coupang.com/a/gZAB1mecDY', child: 'https://link.coupang.com/a/gZADU7LZvw' },
  metal: { infant: 'https://link.coupang.com/a/gZAF6nJOrk', toddler: 'https://link.coupang.com/a/gZAH1uI9zU', child: 'https://link.coupang.com/a/gZAJNeiG4q' },
  water: { infant: 'https://link.coupang.com/a/gZANoTDZEi', toddler: 'https://link.coupang.com/a/gZAPp2bXVI', child: 'https://link.coupang.com/a/gZARxR6UJo' },
};

const DONATION_CONFIG = {
  bankName: '카카오뱅크',
  accountNumber: '3333-03-8113703',
  holderName: '김준기',
};

interface TarotCardItem {
  id: number;
  image: string;
  korTitle: string;
  engSub: string;
  name?: string;
  animal: string;
  keyword: string;
  babyVoice: string;
  prescription: string;
  nightDifficulty: string;
}

const TAROT_CARDS_DATA: TarotCardItem[] = [
  { id: 1, image: '/tarot_cards_clay/01_peaceful_sleep.png', korTitle: '01. 통잠의 축복', engSub: 'The Slumber', animal: '돼지', keyword: '수면의 평화', babyVoice: '오늘따라 달님 베개가 너무 포근해... 통잠 자줄 테니 둘 다 푹 쉬어', prescription: '넷플릭스 켜고 야식 시키세요. 오늘은 온 우주가 돕는 합법적 자유의 밤이에요.', nightDifficulty: '최하 (로또 맞은 날)' },
  { id: 2, image: '/tarot_cards_clay/02_back_sensor.png', korTitle: '02. 등센서의 경고', engSub: 'The Sensor', animal: '강아지', keyword: '밀착 육아', babyVoice: '바닥에 등이 닿는 순간 비상벨 울릴 거야! 절대 내려놓지 마!', prescription: '눕히기보단 아기띠를 차고 한 몸이 되는 것이 부모의 정신건강에 이로워요.', nightDifficulty: '상 (팔근육 단련의 날)' },
  { id: 3, image: '/tarot_cards_clay/03_midnight_party.png', korTitle: '03. 새벽의 파티피플', engSub: 'The Party', animal: '강아지', keyword: '밤샘 각성', babyVoice: '엄마 아빠 왜 자? 디스코볼 켜졌는데 이제부터가 진짜 본게임이야 일어나!', prescription: '조명을 절대 켜지 마시고, 말도 걸지 않는 무반응 침묵 육아로 대응하세요.', nightDifficulty: '극상 (새벽 3시 각성 주의)' },
  { id: 4, image: '/tarot_cards_clay/04_micro_nap.png', korTitle: '04. 15분 칼낮잠', engSub: 'The Micro-Nap', animal: '양', keyword: '얕은 수면', babyVoice: '15분 딱 눈 감았더니 배터리 100% 충전 완료! 다시 출동하자!', prescription: '커피 한 모금 마실 틈도 없어요. 얼른 배우자와 육아 교대를 하세요.', nightDifficulty: '중 (낮 동안 체력 방전 필요)' },
  { id: 5, image: '/tarot_cards_clay/05_crib_escape.png', korTitle: '05. 탈출 본능', engSub: 'The Escape', animal: '원숭이', keyword: '대근육 폭발', babyVoice: '날 가두지 마라! 이 난간만 넘으면 넓은 거실 월드가 펼쳐진다!', prescription: '침대 주변 낙상 위험 요소와 단단한 가드를 최우선으로 점검해 주세요.', nightDifficulty: '중상 (눈을 뗄 수 없는 날)' },
  { id: 6, image: '/tarot_cards_clay/06_dawn_wake.png', korTitle: '06. 새벽 5시 모닝콜', engSub: 'The Early Bird', animal: '닭', keyword: '일출 기상', babyVoice: '꼬끼오! 일찍 일어나는 새가 먼저 모이를 먹는대! 얼른 일어나서 놀자!', prescription: '암막 커튼 틈새로 새는 빛을 완벽히 차단하고 밤잠 시간을 30분 늦춰보세요.', nightDifficulty: '중 (부모 수면 부족 주의)' },
  { id: 7, image: '/tarot_cards_clay/07_deep_slumber.png', korTitle: '07. 구름떡 기절 숙면', engSub: 'The Coma', animal: '소', keyword: '완벽 방전', babyVoice: '구름 이불에 싸여서 숨소리만 새근새근 내며 잘 테니까 푹 쉬어...', prescription: '작은 소음에도 깨지 않는 날이에요. 밀린 집안일을 편안히 해치우세요.', nightDifficulty: '최하 (평화로운 고요)' },
  { id: 8, image: '/tarot_cards_clay/08_teething_cranky.png', korTitle: '08. 이앓이 몬스터', engSub: 'The Teething', animal: '토끼', keyword: '잇몸 열감', babyVoice: '잇몸이 간지럽고 욱신거려! 뭐든 입에 다 넣고 깨물어 버릴 거야!', prescription: '냉장고에 시원하게 넣어둔 쿨링 치발기를 물려주는 것이 최고의 명약이에요.', nightDifficulty: '상 (이유 없는 칭얼거림)' },
  { id: 9, image: '/tarot_cards_clay/09_wonder_weeks.png', korTitle: '09. 원더윅스 타워', engSub: 'The Tower', animal: '용', keyword: '도약의 폭풍', babyVoice: '나도 내 뇌가 왜 이러는지 몰라! 세상이 너무 넓어져서 다 서러워', prescription: '뇌가 급성장하면서 겪는 과부하예요. 훈육 대신 넓은 포옹을 건네주세요.', nightDifficulty: '극상 (부모 멘탈 관리 필수)' },
  { id: 10, image: '/tarot_cards_clay/10_milk_drunk.png', korTitle: '10. 배부른 만수르', engSub: 'The Feast', animal: '돼지', keyword: '포만감 만족', babyVoice: '맘마 원샷 때리고 배 빵빵하니 기분 최고야! 아무것도 안 부러워.', prescription: '시원하게 트림만 잘 시켜주면 오늘 반나절은 아주 순둥순둥한 모드예요.', nightDifficulty: '하 (수유 성공적)' },
  { id: 11, image: '/tarot_cards_clay/11_food_strike.png', korTitle: '11. 단식 투쟁가', engSub: 'The Strike', animal: '닭', keyword: '식사 거부', babyVoice: '이유식 숟가락 치워! 입 꾹 닫고 고개 휙 돌려버릴 거야!', prescription: '억지로 먹이지 말고 과감히 식판을 치우세요. 배고픔이 다음 끼니의 최고의 반찬이에요.', nightDifficulty: '중 (부모 속터짐 주의)' },
  { id: 12, image: '/tarot_cards_clay/12_belly_discomfort.png', korTitle: '12. 배앓이 주의보', engSub: 'The Gas', animal: '양', keyword: '복부 팽만', babyVoice: '뱃속에 방귀 공기가 찼나 봐... 다리 배로 끌어올리고 뿌엥 울 거야.', prescription: '따뜻한 손으로 시계 방향 배 마사지와 하늘자전거 다리 운동을 해주세요.', nightDifficulty: '중상 (소화케어 집중)' },
  { id: 13, image: '/tarot_cards_clay/13_messy_eater.png', korTitle: '13. 오감 대환장파티', engSub: 'The Artist', animal: '쥐', keyword: '오감 탐색', babyVoice: '음식은 먹는 게 아니라 온몸과 식판에 바르고 주무르는 예술이야!', prescription: '마음을 비우면 편안해져요. 식사 후 바로 따뜻한 목욕탕으로 직행하세요.', nightDifficulty: '중 (청소 지옥 주의)' },
  { id: 14, image: '/tarot_cards_clay/14_healing_recovery.png', korTitle: '14. 컨디션 완충', engSub: 'The Healing', animal: '말', keyword: '활력 회복', babyVoice: '미열도 내리고 쌩쌩해졌어! 그동안 간호해 줘서 고마워요.', prescription: '체온만 가볍게 확인하시고, 오늘은 아이와 함께 편안히 누워 힐링하세요.', nightDifficulty: '하 (안정권 진입)' },
  { id: 15, image: '/tarot_cards_clay/15_hyper_active.png', korTitle: '15. 무한 에너자이저', engSub: 'The Chariot', animal: '토끼', keyword: '무한 체력', babyVoice: '세상이 너무 신나! 기어 다니고 뛰어다니고 온 집안을 다 털어버릴 거야!', prescription: '낮 동안 신나는 신체 놀이로 체력을 0%까지 방전시켜야 밤이 편해요.', nightDifficulty: '중상 (체력 소모전)' },
  { id: 16, image: '/tarot_cards_clay/16_clingy_mode.png', korTitle: '16. 강력 접착제 모드', engSub: 'The Lovers', animal: '강아지', keyword: '분리 불안', babyVoice: '화장실도 가지 마! 1cm만 시야에서 사라져도 대성통곡할 거야.', prescription: '분리불안 시기예요. 틈틈이 눈을 맞추고 포옹하며 든든한 안정감을 주세요.', nightDifficulty: '상 (자유시간 제로)' },
  { id: 17, image: '/tarot_cards_clay/17_curious_explorer.png', korTitle: '17. 서랍 털이 탐험가', engSub: 'The Explorer', animal: '호랑이', keyword: '공간 탐구', babyVoice: '물티슈 뽑기 장인 등판! 판도라의 서랍은 다 열려야 제맛이지.', prescription: '서랍 안전장치를 점검하고, 마음껏 찢어도 되는 탐색 상자를 쥐여주세요.', nightDifficulty: '중 (사고 방지 집중)' },
  { id: 18, image: '/tarot_cards_clay/18_meltdown_alarm.png', korTitle: '18. 돌고래 샤우팅', engSub: 'The Judgment', animal: '호랑이', keyword: '의사 표현', babyVoice: '내 뜻대로 안 되면 우주가 떠나가라 돌고래 고음 샤우팅 발사!', prescription: '놀라거나 함께 흥분하지 마시고, 차분하고 나긋나긋한 톤으로 반응해 주세요.', nightDifficulty: '상 (부모 귀마개 권장)' },
  { id: 19, image: '/tarot_cards_clay/19_angelic_smile.png', korTitle: '19. 심쿵 천사표 미소', engSub: 'The Star', animal: '소', keyword: '극강 애교', babyVoice: '눈 마주치면 헤헤 웃어줄게! 내 살인 애교 한 방에 사르르 녹지?', prescription: '카메라를 켜고 연사로 셔터를 누르세요. 오늘 평생 간직할 인생샷이 나와요.', nightDifficulty: '최하 (피로가 싹 풀림)' },
  { id: 20, image: '/tarot_cards_clay/20_toy_collector.png', korTitle: '20. 블록 덕후', engSub: 'The Builder', animal: '쥐', keyword: '집중 몰입', babyVoice: '높이높이 쌓아놓은 블록 와르르 무너뜨리는 소리가 제일 짜릿해!', prescription: '소근육과 인과관계를 탐구 중이에요. 마음껏 무너뜨려도 되는 블록을 깔아주세요.', nightDifficulty: '하 (집중력 최고조)' },
  { id: 21, image: '/tarot_cards_clay/21_master_negotiator.png', korTitle: '21. 육아 상전 지휘관', engSub: 'The Emperor', animal: '용', keyword: '군림 본능', babyVoice: '오늘은 내가 황제야. 안아주는 각도부터 맘마 온도까지 내 뜻대로 맞춰라!', prescription: '아이에게 두 가지 중 하나를 고르게 하는 선택권을 주면서 주도성을 존중해 주세요.', nightDifficulty: '상 (극진한 수발 필요)' },
];

function useVisitorTracker() {
  const [visitInfo, setVisitInfo] = useState<{ count: number; message: string }>({
    count: 1,
    message: '첫 방문을 환영해요! 우리 아이 기질 도감을 열어보세요 🌱',
  });

  useEffect(() => {
    try {
      const todayStr = new Date().toISOString().slice(0, 10);
      const lastVisitDate = localStorage.getItem('last_visit_date');
      const savedCount = parseInt(localStorage.getItem('total_visit_count') || '0', 10);

      let currentCount = savedCount;
      if (lastVisitDate !== todayStr) {
        currentCount = savedCount + 1;
        localStorage.setItem('total_visit_count', currentCount.toString());
        localStorage.setItem('last_visit_date', todayStr);
      }

      let msg = '첫 방문을 환영해요! 우리 아이 기질 도감을 열어보세요 🌱';
      if (currentCount === 2) {
        msg = '다시 만나서 반가워요! 오늘도 함께 힘내요 ☕ (2번째 방문)';
      } else if (currentCount >= 3) {
        msg = `벌써 ${currentCount}번째 함께하고 계시네요! 완벽한 하루 되세요 🌿`;
      }

      setVisitInfo({ count: currentCount, message: msg });
    } catch (e) {
      console.error('방문 트래커 로드 실패', e);
    }
  }, []);

  return visitInfo;
}

interface DateValidationResult {
  isValid: boolean;
  errorMsg?: string;
}

function validateDateString(
  dateStr: string,
  options: {
    allowFuture?: boolean;
    minYear?: number;
    maxYear?: number;
    fieldName?: string;
  } = {}
): DateValidationResult {
  const {
    allowFuture = false,
    minYear = 1940,
    maxYear = new Date().getFullYear() + 1,
    fieldName = '날짜',
  } = options;

  const digits = dateStr.replace(/[^0-9]/g, '');

  if (!digits) return { isValid: false, errorMsg: `${fieldName}를 입력해주세요.` };
  if (digits.length !== 8) return { isValid: false, errorMsg: `${fieldName} 8자리를 끝까지 입력해주세요. (예: 2024.05.10)` };

  const year = parseInt(digits.slice(0, 4), 10);
  const month = parseInt(digits.slice(4, 6), 10);
  const day = parseInt(digits.slice(6, 8), 10);

  if (year < minYear || year > maxYear) return { isValid: false, errorMsg: `연도는 ${minYear}년~${maxYear}년 사이여야 해요.` };
  if (month < 1 || month > 12) return { isValid: false, errorMsg: '월은 01월부터 12월 사이여야 해요.' };

  const maxDaysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > maxDaysInMonth) return { isValid: false, errorMsg: `${year}년 ${month}월은 ${maxDaysInMonth}일까지 있어요. 존재하지 않는 날짜예요.` };

  const inputDate = new Date(year, month - 1, day);
  const now = new Date();
  now.setHours(23, 59, 59, 999);

  if (!allowFuture && inputDate > now) return { isValid: false, errorMsg: `${fieldName}는 오늘보다 미래일 수 없어요.` };

  return { isValid: true };
}

interface BabyProfile {
  id: string;
  name: string;
  gender: 'boy' | 'girl';
  birthDate: string;
  birthTime: string;
  isUnknownTime: boolean;
  dueDate: string;
}

interface CheonganColor {
  name: string;
  colorLabel: string;
  element: string;
  elementKey: 'wood' | 'fire' | 'earth' | 'metal' | 'water';
  mainColor: string;
}

const CHEONGAN_LIST: CheonganColor[] = [
  { name: '갑(甲)', colorLabel: '푸른', element: '목(木)', elementKey: 'wood', mainColor: '#38BDF8' },
  { name: '을(乙)', colorLabel: '초록', element: '목(木)', elementKey: 'wood', mainColor: '#10B981' },
  { name: '병(丙)', colorLabel: '붉은', element: '화(火)', elementKey: 'fire', mainColor: '#F43F5E' },
  { name: '정(丁)', colorLabel: '선홍', element: '화(火)', elementKey: 'fire', mainColor: '#FB7185' },
  { name: '무(戊)', colorLabel: '황금', element: '토(土)', elementKey: 'earth', mainColor: '#F59E0B' },
  { name: '기(己)', colorLabel: '노란', element: '토(土)', elementKey: 'earth', mainColor: '#EAB308' },
  { name: '경(庚)', colorLabel: '하얀', element: '금(金)', elementKey: 'metal', mainColor: '#94A3B8' },
  { name: '신(辛)', colorLabel: '은빛', element: '금(金)', elementKey: 'metal', mainColor: '#64748B' },
  { name: '임(壬)', colorLabel: '검은', element: '수(水)', elementKey: 'water', mainColor: '#334155' },
  { name: '계(癸)', colorLabel: '흑빛', element: '수(水)', elementKey: 'water', mainColor: '#1E293B' },
];

interface JijiAnimal {
  animal: string;
  hanja: string;
  order: string;
  modifier: string;
  fallbackFileName: string;
}

const JIJI_LIST: JijiAnimal[] = [
  { animal: '쥐', hanja: '子', order: '1', modifier: '똘망똘망 총명한', fallbackFileName: 'mouse.png' },
  { animal: '소', hanja: '丑', order: '2', modifier: '우직하고 든든한', fallbackFileName: 'cow.png' },
  { animal: '호랑이', hanja: '寅', order: '3', modifier: '용맹하고 씩씩한', fallbackFileName: 'tiger.png' },
  { animal: '토끼', hanja: '卯', order: '4', modifier: '깡총깡총 사랑스러운', fallbackFileName: 'rabbit.png' },
  { animal: '용', hanja: '辰', order: '5', modifier: '여의주를 품은 멋진', fallbackFileName: 'dragon.png' },
  { animal: '뱀', hanja: '巳', order: '6', modifier: '지혜롭고 눈치 빠른', fallbackFileName: 'snake.png' },
  { animal: '말', hanja: '午', order: '7', modifier: '신나게 달리는 활발한', fallbackFileName: 'horse.png' },
  { animal: '양', hanja: '未', order: '8', modifier: '순둥순둥 다정한', fallbackFileName: 'sheep.png' },
  { animal: '원숭이', hanja: '申', order: '9', modifier: '재치 만점 호기심 대장', fallbackFileName: 'monkey.png' },
  { animal: '닭', hanja: '酉', order: '10', modifier: '새벽을 여는 맑은', fallbackFileName: 'rooster.png' },
  { animal: '개', hanja: '戌', order: '11', modifier: '충직하고 따뜻한', fallbackFileName: 'dog.png' },
  { animal: '돼지', hanja: '亥', order: '12', modifier: '복을 부르는 사랑둥이', fallbackFileName: 'pig.png' },
];

const CHEONGAN_TO_COLOR: Record<number, string> = {
  0: 'blue', 1: 'blue', 2: 'red', 3: 'red',
  4: 'yellow', 5: 'yellow', 6: 'white', 7: 'white',
  8: 'black', 9: 'black',
};

const JIJI_TO_ANIMAL: Record<number, string> = {
  0: 'rat', 1: 'ox', 2: 'tiger', 3: 'rabbit',
  4: 'dragon', 5: 'snake', 6: 'horse', 7: 'sheep',
  8: 'monkey', 9: 'rooster', 10: 'dog', 11: 'pig',
};

interface PotionDetail {
  title: string;
  subTitle: string;
  tag: string;
  guide: string;
}

const POTION_MATRIX: Record<'wood' | 'fire' | 'earth' | 'metal' | 'water', Record<'infant' | 'toddler' | 'child', PotionDetail>> = {
  wood: {
    infant: { title: '유기농 케일·사과 초기 퓨레', subTitle: '목(木)의 쑥쑥 자라는 생명력 충전', tag: '성장 퓨레', guide: '간과 근육 발달을 돕는 푸른 채소의 산뜻한 에너지가 아기의 첫 성장을 기분 좋게 응원해 줍니다.' },
    toddler: { title: '청포도 칼슘·비타민 구미', subTitle: '활동량 폭발하는 아이를 위한 성장 간식', tag: '성장 간식', guide: '지치지 않고 뛰어노는 아이를 위해 뼈와 근육의 기운을 채워주는 새콤달콤 청포도 영양 간식이에요.' },
    child: { title: '키즈 칼슘+마그네슘+비타민D', subTitle: '골격 형성과 곧은 성장을 돕는 영양', tag: '키성장 포션', guide: '학교생활로 훌쩍 크는 시기예요. 곧고 튼튼한 골격 성장을 돕는 든든한 필수 미네랄을 보충해 주세요.' },
  },
  fire: {
    infant: { title: '유기농 비트·딸기 초기 퓨레', subTitle: '화(火)의 따뜻한 순환을 돕는 힐링 과채', tag: '순환 퓨레', guide: '심장과 혈액 순환을 활발하게 도와주어, 아기의 손발을 따뜻하게 하고 방긋방긋 기분을 띄워줘요.' },
    toddler: { title: '베리베리 유기농 멀티비타민', subTitle: '지칠 줄 모르는 에너자이저 활력 충전', tag: '활력 간식', guide: '온몸으로 에너지를 발산하는 활기찬 아이의 컨디션을 지켜주는 붉은 열매 비타민 간식입니다.' },
    child: { title: '어린이 홍삼 튼튼 활력 스틱', subTitle: '기초 체력과 지치지 않는 집중력 유지', tag: '체력 포션', guide: '학습과 야외활동이 늘어나는 초등 시기, 지친 기운을 북돋워 주는 부드러운 어린이 홍삼 충전소예요.' },
  },
  earth: {
    infant: { title: '유기농 단호박·고구마 안심 퓨레', subTitle: '토(土)의 든든하고 편안한 소화 에너지', tag: '속편한 퓨레', guide: '비위와 소화기를 따뜻하게 감싸주어 배앓이 없이 뱃속을 편안하게 꿀잠 자도록 도와줍니다.' },
    toddler: { title: '유기농 바나나 달콤 쌀과자', subTitle: '소화가 잘되는 순한 첫 곡물 간식', tag: '속편한 과자', guide: '소화 흡수가 빠른 노란 곡물의 부드러운 기운이 예민한 아이의 입맛과 뱃속을 포근하게 달래줍니다.' },
    child: { title: '100억 생유산균+아연 복합', subTitle: '황금변과 튼튼한 장 면역을 지키는 균형', tag: '장건강 포션', guide: '불규칙해지기 쉬운 어린이 식습관을 위해 장내 유익균을 꽉 채워 소화 흡수를 편안하게 해줍니다.' },
  },
  metal: {
    infant: { title: '유기농 배·도라지 순한 초기 퓨레', subTitle: '금(金)의 맑고 깨끗한 호흡기 지킴이', tag: '목안심 퓨레', guide: '폐와 기관지를 촉촉하게 보호해 주어, 환절기 칭얼거림과 칼칼한 목을 부드럽게 지켜줍니다.' },
    toddler: { title: '착즙 배도라지 달콤 워터젤리', subTitle: '목과 코가 편안해지는 수분 충전 간식', tag: '기관지 간식', guide: '말문이 트이고 목을 많이 쓰는 시기, 은빛 금(金) 기운의 촉촉함으로 목 건강을 달콤하게 챙겨주세요.' },
    child: { title: '엘더베리+프로폴리스 면역 츄어블', subTitle: '단체생활 환절기 방패막이 영양 포션', tag: '면역 포션', guide: '학교와 학원 단체생활에서 감기 없이 튼튼하게 버틸 수 있도록 호흡기 방어력을 단단히 세워줍니다.' },
  },
  water: {
    infant: { title: '유기농 서양자두 푸룬·사과 퓨레', subTitle: '수(水)의 원활한 순환과 시원한 배변', tag: '쾌변 퓨레', guide: '신장과 배설 순환을 도와 아기의 속을 시원하게 뚫어주고 정서적 안정감을 찾아주는 보라빛 포션이에요.' },
    toddler: { title: '블랙베리 퐁당 유기농 구미', subTitle: '밤잠을 깊게 돕는 깊은 수(水) 영양', tag: '영양 간식', guide: '깊은 휴식과 꿀잠을 도와주는 천연 블랙푸드의 미네랄 기운으로 예민한 밤을 차분히 달래줍니다.' },
    child: { title: '식물성 미세조류 DHA 오메가3', subTitle: '반짝이는 두뇌 회전과 맑은 눈 건강', tag: '두뇌 포션', guide: '생각과 탐구가 깊어지는 시기, 맑고 스마트한 두뇌 순환과 시력을 지켜주는 필수 오메가 포션입니다.' },
  },
};

interface BabyWeather {
  icon: string;
  status: string;
  tension: string;
  tip: string;
  bgGradient: string;
}

function calculateTodayBabyWeather(babyElementKey: 'wood' | 'fire' | 'earth' | 'metal' | 'water'): BabyWeather {
  const today = new Date();
  const dayIndex = (today.getFullYear() * 372 + (today.getMonth() + 1) * 31 + today.getDate()) % 5;
  const elements: ('wood' | 'fire' | 'earth' | 'metal' | 'water')[] = ['wood', 'fire', 'earth', 'metal', 'water'];
  const todayElement = elements[dayIndex];

  if (babyElementKey === todayElement) {
    return {
      icon: '☀️',
      status: '맑고 쾌청 (텐션 100%)',
      tension: '아이의 타고난 오행 본성과 오늘 기운이 완벽하게 일치해요!',
      tip: '호기심과 웃음이 만개하는 날입니다. 칭찬을 아끼지 마시고 가벼운 산책을 선물해 보세요.',
      bgGradient: 'from-amber-500/10 via-amber-500/5 to-transparent border-amber-300',
    };
  } else if (
    (babyElementKey === 'wood' && todayElement === 'fire') ||
    (babyElementKey === 'fire' && todayElement === 'earth') ||
    (babyElementKey === 'earth' && todayElement === 'metal') ||
    (babyElementKey === 'metal' && todayElement === 'water') ||
    (babyElementKey === 'water' && todayElement === 'wood')
  ) {
    return {
      icon: '⛅',
      status: '에너지 분출 (텐션 120%)',
      tension: '기운이 밖으로 뿜어져 나와 활동량이 평소보다 폭발해요!',
      tip: '낮 동안 신체 에너지를 충분히 쏟지 않으면 밤잠 투정이 생길 수 있어요. 터미타임이나 신체 놀이를 챙겨주세요.',
      bgGradient: 'from-sky-500/10 via-sky-500/5 to-transparent border-sky-300',
    };
  } else if (
    (babyElementKey === 'wood' && todayElement === 'metal') ||
    (babyElementKey === 'metal' && todayElement === 'fire') ||
    (babyElementKey === 'fire' && todayElement === 'water') ||
    (babyElementKey === 'water' && todayElement === 'earth') ||
    (babyElementKey === 'earth' && todayElement === 'wood')
  ) {
    return {
      icon: '🌦',
      status: '소나기 주의 (감각 민감도 UP)',
      tension: '오늘 기운이 아기의 성향을 살짝 자극해 작은 일에도 보챌 수 있어요.',
      tip: '이유 없는 떼쓰기는 성장의 과부하 신호예요. 통제하거나 다그치기보다 포근한 스킨십으로 안정감을 주세요.',
      bgGradient: 'from-rose-500/10 via-rose-500/5 to-transparent border-rose-300',
    };
  } else {
    return {
      icon: '🌈',
      status: '포근한 온화 (마음 안정기)',
      tension: '마음이 차분하게 가라앉아 혼자서도 집중을 잘하는 날이에요.',
      tip: '그림책 읽기나 사운드북, 퍼즐 맞추기처럼 정적인 놀이에 눈빛이 반짝입니다. 엄마 아빠도 숨을 돌리세요.',
      bgGradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-300',
    };
  }
}

function getTodayElementGuide() {
  const today = new Date();
  const daySum = today.getFullYear() + (today.getMonth() + 1) + today.getDate();
  const elements = [
    { title: '목(木)의 기운이 가득한 날', desc: '새로운 호기심과 성장이 폭발하는 날! 아이와 산책하기 좋아요.' },
    { title: '화(火)의 기운이 강한 날', desc: '에너지가 넘치는 날! 온몸으로 신나게 놀아주면 밤잠을 잘 자요.' },
    { title: '토(土)의 기운이 포근한 날', desc: '마음이 차분하고 안정되는 평화로운 하루입니다.' },
    { title: '금(金)의 기운이 맑은 날', desc: '규칙과 일과를 척척 해내는 똑똑한 기운이 감도는 날이에요.' },
    { title: '수(水)의 기운이 깊은 날', desc: '충분한 스킨십과 포근한 안아주기로 정서적 교감을 나눠보세요.' },
  ];
  return elements[daySum % elements.length];
}

function BabyAnimalHybridMascot({
  cheonganIndex,
  animalIndex,
  colorLabel,
  animalModifier,
  characterTitle,
}: {
  cheonganIndex: number;
  animalIndex: number;
  colorLabel: string;
  animalModifier: string;
  characterTitle: string;
}) {
  const colorKey = CHEONGAN_TO_COLOR[cheonganIndex] || 'blue';
  const animalKey = JIJI_TO_ANIMAL[animalIndex] || 'tiger';
  const currentAnimal = JIJI_LIST[animalIndex] || JIJI_LIST[2];

  const targetFile = `/animals/${colorKey}_${animalKey}.png`;
  const [imgSrc, setImgSrc] = useState(targetFile);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setImgSrc(`/animals/${colorKey}_${animalKey}.png`);
    setIsError(false);
  }, [colorKey, animalKey]);

  const handleError = () => {
    if (imgSrc !== `/animals/${currentAnimal.fallbackFileName}`) {
      setImgSrc(`/animals/${currentAnimal.fallbackFileName}`);
    } else {
      setIsError(true);
    }
  };

  return (
    <div className="nm-art holo-frame w-full rounded-2xl p-6 my-3 flex flex-col items-center justify-center relative overflow-hidden shadow-xs">
      <CaptureStickers />
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
        <div className="w-44 h-44 rounded-full bg-amber-300/30 blur-2xl animate-[pulse_4s_ease-in-out_infinite]"></div>
      </div>
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute top-4 left-6 text-xs animate-[bounce_3s_infinite]">✨</div>
        <div className="absolute bottom-6 right-8 text-xs animate-[bounce_4s_infinite_1s]">⭐</div>
        <div className="absolute top-1/2 left-4 text-xs animate-[pulse_2s_infinite]">💫</div>
      </div>

      <div className="relative z-10 bg-white/95 backdrop-blur-md text-slate-900 text-xs sm:text-sm font-black px-4 py-2 rounded-2xl shadow-xs border border-slate-200/90 flex items-center space-x-1.5 mb-5">
        <span className="text-amber-700 font-bold">&ldquo;{animalModifier}&rdquo;</span>
        <span className="text-slate-300">·</span>
        <span className="text-slate-900">{characterTitle}</span>
      </div>

      <div className="relative z-10 w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)] my-1">
        {!isError ? (
          <img
            src={imgSrc}
            alt={`${colorLabel} 캐릭터`}
            onError={handleError}
            className="w-full h-full object-contain rounded-3xl animate-fadeIn scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/40 rounded-3xl">
            <span className="text-6xl">🍼</span>
          </div>
        )}
      </div>
    </div>
  );
}

function HealingPotionIcon({ potionColor }: { potionColor: string }) {
  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8 drop-shadow-sm">
      <path d="M9 3 H15 V5 H9 Z" fill="#94A3B8" stroke="#1E293B" strokeWidth="1.5" />
      <path d="M10 5 H14 V8 L19 14 C20 16 19 20 16 21 H8 C5 20 4 16 5 14 L10 8 Z" fill={potionColor} stroke="#1E293B" strokeWidth="2" />
      <circle cx="10" cy="14" r="2" fill="#FFFFFF" opacity="0.7" />
      <circle cx="14" cy="16" r="1.5" fill="#FFFFFF" opacity="0.6" />
    </svg>
  );
}

interface TemperamentStatBarProps {
  id: 'curiosity' | 'energy' | 'fussy';
  categoryTag: string;
  name: string;
  score: number;
  fillColor: string;
  description: { meaning: string; levelInterpretation: string; careTip: string };
  activeTooltip: string | null;
  onToggleTooltip: (id: 'curiosity' | 'energy' | 'fussy') => void;
}

function TemperamentStatBar({
  id,
  categoryTag,
  name,
  score,
  fillColor,
  description,
  activeTooltip,
  onToggleTooltip,
}: TemperamentStatBarProps) {
  const isOpen = activeTooltip === id;
  const displayScore = useCountUp(score);

  return (
    <div className="space-y-2 pb-3 border-b border-slate-100 last:border-b-0 last:pb-0">
      <div className="flex justify-between items-center text-xs sm:text-sm">
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-extrabold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
            {categoryTag}
          </span>
          <span className="font-extrabold text-slate-900 break-keep">{name}</span>
          <button
            type="button"
            onClick={() => onToggleTooltip(id)}
            aria-label={`${name} 설명 보기`}
            className={`w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] font-extrabold transition-all ${
              isOpen ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            !
          </button>
        </div>
        <span className="trait-score font-mono font-black tracking-tight" style={{ color: fillColor }}>
          {displayScore}점
        </span>
      </div>

      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5">
        <div
          className="h-full rounded-full transition-all duration-500 shadow-xs animate-grow-x"
          style={{ width: `${score}%`, backgroundColor: fillColor }}
        />
      </div>

      {isOpen && (
        <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200 shadow-xs text-left space-y-2 animate-fadeIn break-keep text-xs">
          <div>
            <span className="text-[10px] font-extrabold text-slate-900 uppercase tracking-wider block mb-0.5">
              어떤 성향인가요?
            </span>
            <p className="font-semibold text-slate-800 leading-relaxed">{description.meaning}</p>
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-slate-900 uppercase tracking-wider block mb-0.5">
              점수 분석 ({score}점)
            </span>
            <p className="font-medium text-slate-700 leading-relaxed">{description.levelInterpretation}</p>
          </div>
          <div className="pt-1.5 border-t border-slate-200">
            <p className="font-bold text-slate-900 flex items-start space-x-1">
              <span className="flex-shrink-0 text-slate-900">포인트:</span>
              <span className="text-slate-700 font-medium leading-relaxed">{description.careTip}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

interface WonderLeapDetail {
  leapIndex: number;
  name: string;
  startDay: number;
  endDay: number;
  description: string;
  signals: string[];
  actions: string[];
  parentTip: string;
}

/* ===== 결과 캡처 카드 공통 푸터: 브랜드 · 기능명 · 날짜 표기를 모든 결과 카드에서 통일 ===== */
function formatTodayDot(): string {
  const t = new Date();
  return `${t.getFullYear()}.${String(t.getMonth() + 1).padStart(2, '0')}.${String(t.getDate()).padStart(2, '0')}`;
}

function CaptureBrandFooter({ label }: { label: string }) {
  return (
    <div className="w-full pt-2.5 border-t border-slate-200/70 flex flex-col gap-0.5 text-[10px] text-slate-400 font-mono">
      <span className="font-bold">아기속풀이 PRO · {label}</span>
      <span>{formatTodayDot()} · baby-sokpuli.vercel.app</span>
    </div>
  );
}

/* ===== 결과 카드 모서리 스티커: 히어로 프레임 네 모서리에만 절제해서 (텍스트 영역 침범 금지) ===== */
function CaptureStickers() {
  return (
    <>
      <span aria-hidden className="absolute top-2.5 left-3.5 z-10 text-[11px] leading-none text-pink-400 select-none">★</span>
      <span aria-hidden className="absolute top-2.5 right-3.5 z-10 text-[11px] leading-none text-amber-400 select-none">♥</span>
      <span aria-hidden className="absolute bottom-2.5 left-3.5 z-10 text-[11px] leading-none text-emerald-400 select-none">♥</span>
      <span aria-hidden className="absolute bottom-2.5 right-3.5 z-10 text-[11px] leading-none text-sky-400 select-none">★</span>
    </>
  );
}

/* ===== 판결 문장 줄바꿈 보정: 문장 끝 괄호 문구(+이모지)만 한 덩어리로 묶는다 =====
   긴 표현까지 통째로 묶으면 그 덩어리가 다음 줄로 넘어가며 앞 줄 오른쪽이
   크게 비는 부작용이 있어(사용자 지적), 묶음은 괄호 문구로 한정한다.
   나머지 끊김은 keep-all(어절 단위) + text-wrap: pretty가 담당한다. */
function glueVerdictText(text: string): React.ReactNode {
  const phrases: string[] = [];
  // 문장 끝에 붙은 짧은 괄호 문구만 한 덩어리로 (본문 중간의 날짜·한자 괄호는 제외)
  const parenIdx = text.indexOf('(');
  if (parenIdx >= 0 && text.trimEnd().endsWith(')') && text.length - parenIdx <= 22) phrases.push(text.slice(parenIdx));
  let nodes: React.ReactNode[] = [text];
  phrases.forEach((phrase, pi) => {
    const next: React.ReactNode[] = [];
    nodes.forEach((node) => {
      if (typeof node !== 'string' || !node.includes(phrase)) {
        next.push(node);
        return;
      }
      node.split(phrase).forEach((seg, si) => {
        if (si > 0) {
          next.push(
            <span key={`${pi}-${si}`} className="whitespace-nowrap">
              {phrase}
            </span>
          );
        }
        if (seg) next.push(seg);
      });
    });
    nodes = next;
  });
  return <>{nodes}</>;
}

/* ===== 배너·안내 문장 줄바꿈 보정: 문장 끝 이모지(와 끝 괄호 문구)가 혼자 다음 줄로
   떨어지지 않게, 마지막 어절 + 꼬리 토큰들을 한 덩어리(keep-line)로 묶는다 ===== */
function glueBannerText(text: string): React.ReactNode {
  const tokens = text.split(' ');
  if (tokens.length < 3) return text;
  let start = tokens.length;
  let inParen = false;
  for (let i = tokens.length - 1; i >= 0; i--) {
    const t = tokens[i];
    const bare = t.replace(/\uFE0F/g, '');
    if (/^\p{Extended_Pictographic}+$/u.test(bare)) {
      start = i;
      continue;
    }
    if (t.endsWith(')')) {
      inParen = true;
      start = i;
      continue;
    }
    if (inParen) {
      start = i;
      if (t.startsWith('(')) inParen = false;
      continue;
    }
    break;
  }
  if (start === tokens.length) return text; // 묶을 꼬리 토큰이 없음
  if (start > 0) start -= 1; // 이모지가 붙는 마지막 어절까지 함께 묶는다
  const head = tokens.slice(0, start).join(' ');
  const tail = tokens.slice(start).join(' ');
  return (
    <>
      {head} <span className="keep-line">{tail}</span>
    </>
  );
}

/* ===== 허브 그룹 헤더: 기능이 많아져도 성격별로 묶어 첫 방문자가 헤매지 않게 ===== */
function HubGroupHeader({ icon, title, hint }: { icon: string; title: string; hint: string }) {
  return (
    <div className="flex items-center gap-2 pt-1.5">
      <span className="text-sm font-black text-slate-800 tracking-tight whitespace-nowrap">
        {icon} {title}
      </span>
      <span className="text-[11px] font-bold text-slate-400 truncate">{hint}</span>
      <span className="flex-1 h-px bg-slate-200/80" />
    </div>
  );
}

/* ===== 십이지 라인 드로잉: 선으로만 그린 12간지 동물 (stroke 전용, fill 없음) ===== */
const ZODIAC_LINE_ART: Record<number, React.ReactNode> = {
  0: ( // 쥐
    <>
      <circle cx="17" cy="16" r="4.5" />
      <circle cx="31" cy="16" r="4.5" />
      <ellipse cx="24" cy="29" rx="11" ry="9.5" />
      <path d="M34 33c6 1.5 9.5-1.5 10.5-6.5" />
      <path d="M13 28H6.5M13.5 31.5L8 34" />
      <circle cx="20" cy="27" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="28" cy="27" r="0.8" fill="currentColor" stroke="none" />
    </>
  ),
  1: ( // 소
    <>
      <path d="M11 12c-2.5 4-1 7.5 2.5 9M37 12c2.5 4 1 7.5-2.5 9" />
      <path d="M14 21c0-3.5 4.5-6.5 10-6.5s10 3 10 6.5V31c0 5-4.5 8.5-10 8.5S14 36 14 31z" />
      <path d="M14 23l-5.5-2M34 23l5.5-2" />
      <ellipse cx="24" cy="33.5" rx="6" ry="3.8" />
      <circle cx="21.5" cy="33.5" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="26.5" cy="33.5" r="0.8" fill="currentColor" stroke="none" />
    </>
  ),
  2: ( // 호랑이
    <>
      <circle cx="14.5" cy="15.5" r="4" />
      <circle cx="33.5" cy="15.5" r="4" />
      <circle cx="24" cy="27" r="12.5" />
      <path d="M24 14.5v5M17.5 15.5l2 4M30.5 15.5l-2 4" />
      <path d="M12 27H5.5M12.5 31l-5.5 2M36 27h6.5M35.5 31l5.5 2" />
      <circle cx="19.5" cy="25" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="28.5" cy="25" r="0.8" fill="currentColor" stroke="none" />
    </>
  ),
  3: ( // 토끼
    <>
      <path d="M18.5 21c-1.2-8.5-.2-14 1.8-16.2 2.2 2 3.2 7.5 2.4 14.5M29.5 21c1.2-8.5.2-14-1.8-16.2-2.2 2-3.2 7.5-2.4 14.5" />
      <circle cx="24" cy="31" r="10.5" />
      <circle cx="20.5" cy="29" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="27.5" cy="29" r="0.8" fill="currentColor" stroke="none" />
      <path d="M22.5 34.5c1 1 2 1 3 0" />
    </>
  ),
  4: ( // 용
    <>
      <path d="M15.5 13L12 6.5M32.5 13L36 6.5" />
      <path d="M13.5 23c0-6.5 4.5-11 10.5-11s10.5 4.5 10.5 11c0 7.5-4.5 11.5-10.5 15.5-3.2-2.2-6-4.6-7.2-8" />
      <path d="M12.5 27c-3 .3-5.5-.7-7-3M35.5 27c3 .3 5.5-.7 7-3" />
      <path d="M19 38.5c1.8 2.2 5 2.6 7.5 1" />
      <circle cx="19.5" cy="22" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="28.5" cy="22" r="0.8" fill="currentColor" stroke="none" />
    </>
  ),
  5: ( // 뱀
    <>
      <path d="M10 38c11 1 6-9 14-9.5S29 21 37 18.5" />
      <circle cx="39.5" cy="16.5" r="4.2" />
      <path d="M43 13.5l4.5-3" />
      <path d="M14 31.5c-2.5.5-4 2-4.5 4" />
      <circle cx="38.5" cy="15.5" r="0.8" fill="currentColor" stroke="none" />
    </>
  ),
  6: ( // 말
    <>
      <path d="M17.5 11.5L15.5 5M30.5 11.5L32.5 5" />
      <path d="M16 15c0-2.8 3.5-5 8-5s8 2.2 8 5l1.8 13.5c.5 5.5-4 10-9.8 10s-10.3-4.5-9.8-10z" />
      <path d="M24 10.2C23 7 20 4.8 16.8 4.6" />
      <circle cx="20" cy="31" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="28" cy="31" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="20" cy="21" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="28" cy="21" r="0.8" fill="currentColor" stroke="none" />
    </>
  ),
  7: ( // 양
    <>
      <circle cx="16.5" cy="17.5" r="5" />
      <circle cx="24" cy="13.5" r="6" />
      <circle cx="31.5" cy="17.5" r="5" />
      <circle cx="13.5" cy="24" r="4.2" />
      <circle cx="34.5" cy="24" r="4.2" />
      <path d="M18 23.5V30c0 5 2.8 8.5 6 8.5s6-3.5 6-8.5v-6.5" />
      <path d="M18.5 26.5l-5.5-1M29.5 26.5l5.5-1" />
      <circle cx="21" cy="30" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="27" cy="30" r="0.8" fill="currentColor" stroke="none" />
    </>
  ),
  8: ( // 원숭이
    <>
      <circle cx="10.5" cy="22" r="4.2" />
      <circle cx="37.5" cy="22" r="4.2" />
      <circle cx="24" cy="24" r="13" />
      <path d="M16 26.5c0-5 3.8-8.5 8-8.5s8 3.5 8 8.5c0 6-3.8 10-8 10s-8-4-8-10z" />
      <path d="M36.5 35.5c5 2.2 8.5-.8 7.5-6" />
      <circle cx="20.5" cy="25" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="27.5" cy="25" r="0.8" fill="currentColor" stroke="none" />
    </>
  ),
  9: ( // 닭
    <>
      <path d="M17.5 13c-.5-3.5 3.5-4.2 4.8-1.2.8-4 6-4.4 6.4-.4 2-2.2 5.2-.2 4.3 2.8" />
      <circle cx="24" cy="23" r="8.5" />
      <path d="M32 22.5l7.5 2.2-7.5 3" />
      <path d="M15 29.5C13 37 17.5 42.5 24 42.5c5 0 8.8-3 9.8-7.5" />
      <path d="M14 28.5C8.8 25.5 6.5 19 7.2 12M16 30.5c-5.2-1-9.2-5-10.4-10.5" />
      <circle cx="22" cy="21.5" r="0.8" fill="currentColor" stroke="none" />
    </>
  ),
  10: ( // 개
    <>
      <path d="M13.5 15.5C10.5 21.5 10.5 28 14 32.5M34.5 15.5c3 6 3 12.5-.5 17" />
      <circle cx="24" cy="25" r="11.5" />
      <ellipse cx="24" cy="29.5" rx="3.6" ry="2.6" />
      <path d="M24 32.2v3.8" />
      <circle cx="19" cy="22" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="29" cy="22" r="0.8" fill="currentColor" stroke="none" />
    </>
  ),
  11: ( // 돼지
    <>
      <path d="M14.5 15.5L13.5 10l6 2.2M33.5 15.5L34.5 10l-6 2.2" />
      <circle cx="24" cy="26.5" r="13" />
      <ellipse cx="24" cy="27.5" rx="6" ry="4.6" />
      <circle cx="21.4" cy="27.5" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="26.6" cy="27.5" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="18" cy="20.5" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="30" cy="20.5" r="0.8" fill="currentColor" stroke="none" />
    </>
  ),
};

function ZodiacLineIcon({ index, size }: { index: number; size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {ZODIAC_LINE_ART[index]}
    </svg>
  );
}

/**
 * 배경 십이지 드리프트 레이어 (순수 CSS 애니메이션, 장식 전용).
 * 하루 단위로 바뀌는 5마리가 천천히 떠다니고, 저장된 아이 프로필이 있으면
 * 그 아이의 띠 동물을 살짝 강조해 함께 띄운다. 콘텐츠보다 튀지 않게 낮은 opacity 유지.
 */
function ZodiacDriftLayer({ highlightIndex }: { highlightIndex: number | null }) {
  // 서버 렌더링에서는 -1(렌더링 안 함), 클라이언트에서는 오늘 날짜 시드 — 수화 불일치 없이 클라이언트에서만 그린다
  const daySeed = useSyncExternalStore(
    () => () => {},
    () => Math.floor(Date.now() / 86400000),
    () => -1
  );
  if (daySeed < 0) return null;
  const slots = [
    { left: '3%', top: '10%', size: 56, duration: 27, delay: -6, opacity: 0.1 },
    { left: '84%', top: '6%', size: 44, duration: 33, delay: -15, opacity: 0.08 },
    { left: '76%', top: '44%', size: 64, duration: 39, delay: -9, opacity: 0.07 },
    { left: '5%', top: '57%', size: 48, duration: 31, delay: -20, opacity: 0.09 },
    { left: '86%', top: '80%', size: 52, duration: 36, delay: -25, opacity: 0.08 },
  ];

  return (
    <div aria-hidden className="zodiac-layer pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {slots.map((slot, i) => (
        <span
          key={i}
          className="zodiac-drift-item"
          style={{
            left: slot.left,
            top: slot.top,
            opacity: slot.opacity,
            animationDuration: `${slot.duration}s`,
            animationDelay: `${slot.delay}s`,
          }}
        >
          <ZodiacLineIcon index={(daySeed + i * 3) % 12} size={slot.size} />
        </span>
      ))}
      {highlightIndex !== null && (
        <span
          className="zodiac-drift-item text-rose-400"
          style={{ left: '63%', top: '84px', opacity: 0.17, animationDuration: '30s', animationDelay: '-11s' }}
        >
          <ZodiacLineIcon index={highlightIndex} size={78} />
        </span>
      )}
    </div>
  );
}

/* ===== 첫 화면 구름 레이어: 하단에 깔렸다가 짧은 시간 뒤(또는 첫 탭) 걷히는 장식 ===== */
function IntroCloudLayer({ cleared }: { cleared: boolean }) {
  return (
    <div aria-hidden className={`cloud-layer ${cleared ? 'cloud-cleared' : ''}`}>
      <svg viewBox="0 0 400 200" preserveAspectRatio="none" className="w-full h-full" style={{ filter: 'blur(5px)' }}>
        <g fill="currentColor">
          <ellipse cx="55" cy="178" rx="115" ry="58" />
          <ellipse cx="175" cy="152" rx="135" ry="76" />
          <ellipse cx="315" cy="168" rx="125" ry="66" />
          <ellipse cx="405" cy="188" rx="100" ry="52" />
          <rect x="0" y="158" width="400" height="42" />
        </g>
      </svg>
    </div>
  );
}

/* ===== 아기 이름 궁합: 이름 글자들의 조합으로 만드는 결정적(같은 입력=같은 결과) 재미 점수 ===== */
interface NameMatchResult {
  score: number;
  grade: string;
  comment: string;
}

const NAME_MATCH_BANDS: { min: number; grade: string; comments: string[] }[] = [
  {
    min: 92,
    grade: '천생연분 이름',
    comments: [
      '부르는 순간부터 기운이 착 붙는 조합이에요. 첫돌 사진 속 미소가 벌써 그려져요.',
      '세 이름의 울림이 한 줄로 이어지는 찰떡 조합! 부를 때마다 사랑이 묻어나요.',
      '어느 방향으로 불러도 부드럽게 이어지는 이름이에요. 평생 불릴 이름으로 손색없어요.',
    ],
  },
  {
    min: 84,
    grade: '찰떡궁합 이름',
    comments: [
      '엄마·아빠의 온기가 이름에 고스란히 담겼어요. 부를수록 정이 쌓이는 조합이에요.',
      '발음의 흐름이 매끄러워서 가족 모두 입에 착 붙을 이름이에요.',
      '든든함과 사랑스러움이 반반씩 섞인 균형 잡힌 조합이에요.',
    ],
  },
  {
    min: 74,
    grade: '포근한 조화',
    comments: [
      '세 이름이 서로를 살살 밀어주며 균형을 잡는 조합이에요. 시간이 지날수록 빛나요.',
      '부드러운 울림 뒤에 단단한 중심이 있는 이름이에요. 자랄수록 매력이 커져요.',
      '가족의 리듬과 잘 어우러지는 무난하고 따뜻한 조합이에요.',
    ],
  },
  {
    min: 0,
    grade: '무럭무럭 자라는 궁합',
    comments: [
      '처음엔 낯설어도 부를수록 정드는 타입! 우리 가족만의 이야기가 쌓일 이름이에요.',
      '개성이 톡톡 튀는 조합이에요. 아이가 자라면서 이름값을 톡톡히 할 거예요.',
      '세 사람의 에너지가 톡톡 부딪히며 반짝이는 조합이에요. 평범하지 않은 게 매력이에요.',
    ],
  },
];

function computeNameMatch(momName: string, dadName: string, babyName: string): NameMatchResult {
  const clean = (s: string) => s.replace(/\s/g, '');
  const key = `${clean(momName)}|${clean(dadName)}|${clean(babyName)}`;
  let hash = 0;
  for (const ch of key) {
    hash = (hash * 31 + (ch.codePointAt(0) || 0)) % 9973;
  }
  const score = 62 + (hash % 38); // 62~99점
  const band = NAME_MATCH_BANDS.find((b) => score >= b.min) || NAME_MATCH_BANDS[NAME_MATCH_BANDS.length - 1];
  return {
    score,
    grade: band.grade,
    comment: band.comments[hash % band.comments.length],
  };
}

const WONDER_LEAPS: WonderLeapDetail[] = [
  {
    leapIndex: 1,
    name: '제1도약기 (감각의 변화)',
    startDay: 32,
    endDay: 39,
    description: '빛과 소리 등 낯선 세상 감각이 뇌에 처음으로 쏟아지는 시기예요.',
    signals: ['모로반사가 급증하며 깜짝깜짝 놀람', '수유 중 젖꼭지를 물고만 있으려 함', '작은 소리에도 눈을 크게 뜨며 울음 터뜨림'],
    actions: ['스와들업이나 포대기로 모로반사 완화하기', '수유 전후 조명을 낮추고 백색소음 틀어주기', '안아줄 때 심장박동 소리가 들리게 가슴에 밀착하기'],
    parentTip: '아기가 세상 감각에 첫눈을 뜨는 중입니다. 부모의 잘못이 절대 아니니 안심하세요!',
  },
  {
    leapIndex: 2,
    name: '제2도약기 (패턴의 인지)',
    startDay: 53,
    endDay: 67,
    description: '손발을 쳐다보며 몸의 움직임과 일정한 모양을 깨닫기 시작해요.',
    signals: ['자신의 주먹을 뚫어져라 응시함', '익숙한 목소리에 고개를 돌리며 반응함', '저녁 시간대 이유 없는 칭얼거림(마녀의 시간)'],
    actions: ['흑백 모빌이나 패턴 카드 시야에 보여주기', '기저귀 갈 때 다리를 부드럽게 마사지하기', '저녁 목욕 루틴을 일정한 시간에 반복하기'],
    parentTip: '뇌가 세상의 패턴을 학습하느라 피곤해하는 상태입니다. 안아주기로 달래주세요.',
  },
  {
    leapIndex: 3,
    name: '제3도약기 (변화의 도약)',
    startDay: 81,
    endDay: 88,
    description: '목을 가누고 소리를 내며 세상과 유연하게 소통할 준비를 해요.',
    signals: ['목에 힘을 주며 뒤집기를 시도함', '딸랑이를 흔들면 소리 방향을 바라봄', '옹알이 소리가 커지고 고음 샤우팅 시작'],
    actions: ['낮 동안 터미타임(배 엎드리기) 3~5분 진행', '아기 옹알이에 나긋나긋하게 눈 맞추며 맞장구치기', '손에 가벼운 치발기나 딸랑이 쥐여주기'],
    parentTip: '몸을 움직이고 싶은 욕구가 폭발하는 때예요. 낮에 신나게 놀아줘야 밤에 푹 자요.',
  },
  {
    leapIndex: 4,
    name: '제4도약기 (마의 19주 폭풍)',
    startDay: 102,
    endDay: 137,
    description: '원인과 결과를 이해하느라 뇌에 거대한 리모델링 과부하가 걸려요.',
    signals: ['누우면 바로 깨는 극강의 등센서 각성', '밤중에 1~2시간마다 깨며 수면 퇴행 발생', '수유 중 산만해져 주변을 두리번거리며 보챔'],
    actions: ['눕혀 재우기 고집 대신 아기띠로 신경계 안정시키기', '잠들기 전 20분간 동일한 수면 의식 반복하기', '밤에 깼을 때 불 켜지 않고 무반응 침묵 육아로 대응'],
    parentTip: '가장 힘든 마의 구간입니다! 혼자 버티지 마시고 배우자와 교대로 수면을 보충하세요.',
  },
  {
    leapIndex: 5,
    name: '제5도약기 (관계의 인지)',
    startDay: 158,
    endDay: 186,
    description: '엄마 아빠와 자신이 떨어져 있음을 알고 껌딱지가 되는 시기예요.',
    signals: ['양육자가 시야에서 1cm만 벗어나도 오열', '낯선 사람을 보면 입술을 삐죽거리며 낯가림', '물건을 바닥에 떨어뜨리고 반응 관찰'],
    actions: ['수시로 까꿍 놀이로 대상영속성 안도감 주기', '방을 비울 땐 목소리로 "엄마 여기 있어" 말해주기', '떨어뜨려도 깨지지 않는 안전한 장난감 쥐여주기'],
    parentTip: '엄마와 자신이 분리된 존재임을 깨닫는 기특한 성장통이에요. 든든한 품을 선물해 주세요.',
  },
  {
    leapIndex: 6,
    name: '제6도약기 (범주의 인지)',
    startDay: 235,
    endDay: 263,
    description: '사물과 동물의 공통점을 묶어 생각하는 호기심이 무럭무럭 자라요.',
    signals: ['판도라의 서랍을 열고 물건을 다 끄집어냄', '음식을 손으로 주무르고 얼굴에 바르는 촉감 파티', '작은 먼지나 흠집에 집착하며 손가락으로 콕 찌름'],
    actions: ['마음껏 털어도 되는 안전 탐색 바구니 제공', '식사 후 스트레스 없이 바로 따뜻한 목욕 직행', '모서리 안전가드와 서랍 잠금장치 점검'],
    parentTip: '작은 아인슈타인이 실험 중입니다! 위험한 것만 치우고 마음껏 만지게 해주세요.',
  },
  {
    leapIndex: 7,
    name: '제7도약기 (순서의 도약)',
    startDay: 291,
    endDay: 326,
    description: '통에 물건을 넣었다 뺐다 하며 일의 순서를 탐구하는 작은 과학자예요.',
    signals: ['블록을 쌓아주면 와르르 무너뜨리며 쾌감 느낌', '이유식 숟가락을 직접 쥐고 입으로 가져가려 함', '옷 입히려고 하면 고개를 젓고 양말 벗어던짐'],
    actions: ['쌓고 무너뜨릴 수 있는 컵쌓기/소프트 블록 놀이', '스스로 쥘 수 있는 자기주도 스푼 쥐여주기', '"양말 쏙! 바지 쏙!" 순서를 리듬감 있게 말해주기'],
    parentTip: '일의 순서를 머릿속으로 시뮬레이션하는 두뇌 훈련 중입니다. 인내심을 가져주세요.',
  },
  {
    leapIndex: 8,
    name: '제8도약기 (체계의 도약)',
    startDay: 361,
    endDay: 389,
    description: '돌 무렵 식사나 옷 입기 등 하루의 즐거운 일과와 약속을 익혀가요.',
    signals: ['상황 파악이 빨라져 자기 뜻대로 안 되면 드러눕기', '외출 준비를 하면 신발을 가리키며 문 앞으로 감', '단어 흉내를 내며 손가락으로 요구사항 표현'],
    actions: ['"이거 할래, 저거 할래?" 2가지 선택권 주기', '식사-놀이-수면의 규칙적인 하루 시간표 지키기', '원하는 것을 가리킬 때 명확한 단어로 읽어주기'],
    parentTip: '자기주도성이 자라나는 첫 관문이에요. 통제보단 사소한 선택권을 주면 잘 따릅니다.',
  },
  {
    leapIndex: 9,
    name: '제9도약기 (원리의 도약)',
    startDay: 417,
    endDay: 452,
    description: '자아와 소유 개념이 분명해지며 감정을 솔직하게 드러내는 시기예요.',
    signals: ['"내 거야!" 집착과 친구 장난감 빼앗기', '어른의 행동과 말투를 스펀지처럼 똑같이 흉내 냄', '떼쓸 때 고음 샤우팅과 몸 뒤로 젖히기'],
    actions: ['위험한 것만 단호하게 제한하고 감정은 100% 읽어주기', '"지금 많이 속상했구나" 공감 후 3초 침묵하기', '역할 놀이(소꿉놀이, 인형 돌보기)로 공감 연습'],
    parentTip: '떼쓰기는 못된 버릇이 아니라 자아가 건강하게 서는 과정입니다. 차분히 대응하세요.',
  },
  {
    leapIndex: 10,
    name: '제10도약기 (체계의 완성)',
    startDay: 494,
    endDay: 529,
    description: '사회적 규칙과 타인의 감정을 이해하는 의젓한 꼬마 대장이 되었어요!',
    signals: ['간단한 문장으로 대화하며 의사 표현', '약속이나 규칙을 알고 눈치를 살피며 밀당함', '엄마 아빠를 안아주고 뽀뽀하는 정서적 위로'],
    actions: ['스스로 해냈을 때 구체적인 칭찬 아끼지 않기', '그림책을 읽으며 "친구 기분은 어떨까?" 질문하기', '신체 놀이와 바깥 활동으로 규칙과 차례 익히기'],
    parentTip: '10대 원더윅스 대장정을 멋지게 완주하셨습니다! 부모님도 스스로를 칭찬해 주세요.',
  },
];

interface ParentingDifficultyResult {
  score: number;
  grade: string;
  badge: string;
  icon: string;
  level: string;
  barColor: string;
  summary: string;
  synergy: string;
  solution: string;
  parentHealingItem: { title: string; subTitle: string; icon: string; link: string };
  desc?: string;
}

const calculate5StepDifficulty = (babyDateStr: string, parentDateStr: string): ParentingDifficultyResult => {
  const babyYear = parseInt(babyDateStr.replace(/[^0-9]/g, '').slice(0, 4), 10) || 2024;
  const parentYear = parseInt(parentDateStr.replace(/[^0-9]/g, '').slice(0, 4), 10) || 1990;

  const babyEl = (babyYear - 4) % 5;
  const parentEl = (parentYear - 4) % 5;
  // 오행 순환(목→화→토→금→수→목) 기준, 방향까지 본 두 오행의 관계 (절대 차이만 보면 방향이 뭉개져 일부 등급에 도달할 수 없다)
  // rel 1: 부모가 아이를 생(生)함 · rel 4: 아이가 부모를 생함 · rel 0: 동일 오행(비화) · rel 2: 부모가 아이를 극(克)함 · rel 3: 아이가 부모를 극함
  const rel = (babyEl - parentEl + 5) % 5;

  if (rel === 3) {
    return {
      score: 95,
      grade: 'LEVEL 5',
      badge: '불꽃 스파크',
      icon: '🔥',
      level: '최상 (폭풍 성장 챌린지형)',
      barColor: '#C75B6E',
      summary: '서로의 주관과 활동성이 정면으로 부딪히기 쉬운 불꽃 타입이에요!',
      synergy: '아이의 기운이 부모의 기운을 거침없이 밀어붙여, 부모가 아이의 페이스에 휘둘리기 쉬운 조합입니다.',
      solution: '아이가 고집부릴 때 즉각적인 훈계보다 "지금 많이 속상했구나"라고 감정을 먼저 읽어준 뒤 3초간 침묵하며 진정할 시간을 주세요.',
      parentHealingItem: PARENT_HEALING_PRODUCTS.level5,
      desc: '아이와 부모 모두 주관과 에너지가 넘쳐 매일이 다이내믹한 챌린지예요! 명확한 규칙과 신체 놀이가 필수입니다.',
    };
  } else if (rel === 2) {
    return {
      score: 80,
      grade: 'LEVEL 4',
      badge: '에너지 불균형',
      icon: '⚡',
      level: '상 (힘 조율형)',
      barColor: '#C97A52',
      summary: '부모의 단단한 기운이 아이를 앞서 이끌어, 힘의 균형을 조율해야 하는 타입이에요!',
      synergy: '부모의 기준과 방식이 아이에게 강하게 전달돼, 아이가 주눅 들거나 반대로 반발이 커질 수 있습니다.',
      solution: '"안 돼!"라는 단정적 제지 대신 "신발 먼저 신을까, 양말 먼저 신을까?"처럼 사소한 선택권을 주어 아이 스스로 통제감을 느끼도록 해주세요.',
      parentHealingItem: PARENT_HEALING_PRODUCTS.level4,
      desc: '부모의 기운이 아이를 누르기 쉬운 조합이라, 아이의 속도에 맞추는 여유와 부드러운 말투가 중요해요.',
    };
  } else if (rel === 0) {
    return {
      score: 65,
      grade: 'LEVEL 3',
      badge: '닮은꼴 케미',
      icon: '🪞',
      level: '중 (서로 배우는 탐구형)',
      barColor: '#C09A58',
      summary: '서로 닮은 결이라, 알아갈수록 끈끈한 단짝이 되는 관계예요!',
      synergy: '성향이 닮아 마음은 잘 통하지만, 닮은 만큼 같은 지점에서 예민해질 수 있어 아이가 원하는 바를 세심하게 관찰하는 시간이 필요합니다.',
      solution: '아이가 놀이에 몰입해 있을 때 먼저 개입하기보다는, 5초간 지켜보며 아이의 행동과 표정을 조용히 따라 해주는 미러링 교감이 효과적입니다.',
      parentHealingItem: PARENT_HEALING_PRODUCTS.level3,
      desc: '아이의 표현 방식을 읽어내는 연습이 필요하지만, 그만큼 서로에게서 배우는 게 많은 조합이에요.',
    };
  } else if (rel === 4) {
    return {
      score: 40,
      grade: 'LEVEL 2',
      badge: '포근한 완충재',
      icon: '🛡️',
      level: '하 (상호 보완 완충형)',
      barColor: '#6482A8',
      summary: '아이의 예민한 투정을 부모의 넓은 품으로 유연하게 감싸주는 조화예요!',
      synergy: '아이의 기운이 부모에게 활력을 건네고, 부모의 차분함이 아이의 날 선 감각을 부드럽게 식혀주어 마찰이 적습니다.',
      solution: '아이가 투정을 부릴 땐 길고 복잡한 논리적 설득보다 따뜻한 눈맞춤과 가벼운 허그가 가장 빠르게 안정을 찾게 합니다.',
      parentHealingItem: PARENT_HEALING_PRODUCTS.level2,
      desc: '부모의 차분한 기운이 아이의 투정을 유연하게 녹여줄 수 있는 평온하고 안정적인 육아 궁합입니다.',
    };
  } else {
    return {
      score: 20,
      grade: 'LEVEL 1',
      badge: '찰떡 평화',
      icon: '🕊️',
      level: '최하 (무결점 찰떡 평화형)',
      barColor: '#6FA287',
      summary: '눈빛만 봐도 서로의 컨디션이 읽히는 환상의 평화 모드예요!',
      synergy: '부모의 기운이 아이에게 자연스럽게 흘러들어가 기질이 완벽하게 맞물려, 큰 갈등 없이 순탄하게 하루가 흘러갑니다.',
      solution: '평소 작은 행동에도 구체적인 칭찬과 지지를 아끼지 마시고, 부모의 확고한 신뢰를 다정한 말로 자주 표현해 주세요.',
      parentHealingItem: PARENT_HEALING_PRODUCTS.level1,
      desc: '눈빛만 봐도 아이의 마음이 읽히는 환상의 조화예요! 큰 마찰 없이 순탄하게 육아를 이어갈 수 있습니다.',
    };
  }
};

// 숫자 8자리 → 'YYYY.MM.DD' 표시 형식 (공유 링크 파라미터 복원용)
function formatDateDigits(digits: string): string {
  const d = (digits || '').replace(/[^0-9]/g, '').slice(0, 8);
  if (d.length !== 8) return '';
  return `${d.slice(0, 4)}.${d.slice(4, 6)}.${d.slice(6, 8)}`;
}

interface DutyVerdictResult {
  momScore: number;
  dadScore: number;
  best: string;
  summary: string;
  reason: string;
}

// 당번 판결소 점수 계산: 날짜 기반 결정적 계산이라 공유 링크로 열어도 같은 날이면 같은 결과가 나온다
function computeDutyVerdict(momBirth: string, dadBirth: string, babyBirth: string): DutyVerdictResult {
  const today = new Date();
  const todaySum = today.getFullYear() + (today.getMonth() + 1) + today.getDate();

  const momDigits = momBirth.replace(/[^0-9]/g, '');
  const dadDigits = dadBirth.replace(/[^0-9]/g, '');
  const babyDigits = babyBirth ? babyBirth.replace(/[^0-9]/g, '') : '20240101';

  const digitSum = (s: string) => s.split('').reduce((a, c) => a + parseInt(c, 10), 0);
  const momSum = digitSum(momDigits);
  const dadSum = digitSum(dadDigits);
  const babySum = digitSum(babyDigits);

  const momScore = 78 + ((momSum + babySum + todaySum) % 20);
  const dadScore = 78 + ((dadSum + babySum + todaySum) % 20);
  const best = momScore >= dadScore ? '엄마' : '아빠';

  const summary =
    best === '엄마'
      ? '오늘 하루는 엄마의 섬세한 기운이 집안의 평화와 아기의 텐션을 지켜주는 최적의 날입니다!'
      : '오늘 하루는 아빠의 활력 넘치는 에너지가 아기의 호기심에 최고의 보약이 되는 날입니다!';

  const reason =
    best === '엄마'
      ? `오늘(${today.getMonth() + 1}월 ${today.getDate()}일) 흐르는 오행의 기운이 엄마의 따뜻한 수(水)·목(木) 에너지와 완벽한 조화를 이루어, 아이가 칭얼거릴 때 가장 편안하게 안아줄 수 있는 날입니다.`
      : `오늘(${today.getMonth() + 1}월 ${today.getDate()}일) 흐르는 오행의 기운이 아빠의 든든한 화(火)·토(土) 에너지와 맞물려, 아이의 지치지 않는 에너지를 신나게 받아줄 수 있는 최고의 날입니다.`;

  return { momScore, dadScore, best, summary, reason };
}

type LeapStatus =
  | { kind: 'in'; name: string; daysLeft: number }
  | { kind: 'next'; name: string; dDay: number }
  | { kind: 'done' };

// 원더윅스 도약 상태 계산 (대시보드 엔진과 동일하게 출산 예정일로 보정한 일수 기준)
function getLeapStatus(bDateStr: string, dDateStr: string): LeapStatus {
  const cleanDigits = (bDateStr || '').replace(/[^0-9]/g, '');
  if (cleanDigits.length !== 8) return { kind: 'done' };

  const birth = new Date(
    parseInt(cleanDigits.slice(0, 4), 10),
    parseInt(cleanDigits.slice(4, 6), 10) - 1,
    parseInt(cleanDigits.slice(6, 8), 10)
  );
  const effectiveDue =
    dDateStr && dDateStr.length >= 10 ? new Date(dDateStr.replace(/\./g, '-')) : birth;

  const today = new Date();
  const dueDays = Math.max(0, Math.floor((today.getTime() - effectiveDue.getTime()) / (1000 * 60 * 60 * 24)));

  const currentLeap = WONDER_LEAPS.find((l) => dueDays >= l.startDay && dueDays <= l.endDay);
  if (currentLeap) {
    return { kind: 'in', name: currentLeap.name, daysLeft: Math.max(1, currentLeap.endDay - dueDays) };
  }
  const nextLeap = WONDER_LEAPS.find((l) => l.startDay > dueDays);
  if (nextLeap) {
    return { kind: 'next', name: nextLeap.name, dDay: nextLeap.startDay - dueDays };
  }
  return { kind: 'done' };
}

// 숫자 카운트업 (결과 점수 표시용)
function useCountUp(target: number, duration: number = 900): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

export default function Home() {
  const [selectedGateway, setSelectedGateway] = useState<'parenting' | 'couple'>('parenting');
  const [isEntered, setIsEntered] = useState<boolean>(false);
  const [activeTabMode, setActiveTabMode] = useState<'parenting' | 'couple'>('parenting');

  const [coupleModeType, setCoupleModeType] = useState<'simulator' | 'daily' | null>(null);

  const [partner1Name, setPartner1Name] = useState('');
  const [partner1Birth, setPartner1Birth] = useState('');
  const [partner2Name, setPartner2Name] = useState('');
  const [partner2Birth, setPartner2Birth] = useState('');
  const [coupleResult, setCoupleResult] = useState<any>(null);

  const [isAnalyzingCouple, setIsAnalyzingCouple] = useState(false);
  const [coupleCountdown, setCoupleCountdown] = useState<number | null>(null);
  const coupleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const coupleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isAnalyzingDaily, setIsAnalyzingDaily] = useState(false);
  const [isAllLeapsModalOpen, setIsAllLeapsModalOpen] = useState(false);

  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  const handleCalculateCouple = () => {
    if (!partner1Birth || !partner2Birth) {
      alert('두 분의 생년월일을 모두 입력해주세요!');
      return;
    }

    const p1Check = validateDateString(partner1Birth, {
      allowFuture: false,
      minYear: 1950,
      maxYear: new Date().getFullYear(),
      fieldName: '나의 생년월일',
    });
    if (!p1Check.isValid) {
      alert(p1Check.errorMsg);
      return;
    }

    const p2Check = validateDateString(partner2Birth, {
      allowFuture: false,
      minYear: 1950,
      maxYear: new Date().getFullYear(),
      fieldName: '연인의 생년월일',
    });
    if (!p2Check.isValid) {
      alert(p2Check.errorMsg);
      return;
    }

    setIsAnalyzingCouple(true);
    setCoupleCountdown(15);
    trackEvent('click_couple_analyze', 'Engagement', '커플 가상 2세 분석 시작');

    coupleIntervalRef.current = setInterval(() => {
      setCoupleCountdown((prev) => {
        if (prev === null || prev <= 1) {
          if (coupleIntervalRef.current) clearInterval(coupleIntervalRef.current);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    coupleTimeoutRef.current = setTimeout(() => {
      const ANIMALS = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];
      const ANIMAL_ICONS: Record<string, string> = {
        쥐: '🐭', 소: '🐮', 호랑이: '🐯', 토끼: '🐰', 용: '🐲', 뱀: '🐍',
        말: '🐴', 양: '🐑', 원숭이: '🐵', 닭: '🐔', 개: '🐶', 돼지: '🐷',
      };

      const p1Year = parseInt(partner1Birth.replace(/[^0-9]/g, '').slice(0, 4) || '2000', 10);
      const p2Year = parseInt(partner2Birth.replace(/[^0-9]/g, '').slice(0, 4) || '2000', 10);
      const p1Animal = ANIMALS[((p1Year - 4) % 12 + 12) % 12];
      const p2Animal = ANIMALS[((p2Year - 4) % 12 + 12) % 12];

      const p1Hash = partner1Birth.replace(/[^0-9]/g, '').split('').reduce((acc, cur) => acc + parseInt(cur, 10), 0);
      const p2Hash = partner2Birth.replace(/[^0-9]/g, '').split('').reduce((acc, cur) => acc + parseInt(cur, 10), 0);
      const today = new Date();
      const todayHash = today.getFullYear() + today.getMonth() + 1 + today.getDate();

      const elements = ['목(Wood) 🌱', '화(Fire) 🔥', '토(Earth) 🌾', '금(Metal) 💎', '수(Water) 🌊'];
      const p1Elem = elements[p1Hash % elements.length];
      const p2Elem = elements[p2Hash % elements.length];

      const babyList = [
        { title: '호기심 폭발 자유로운 에너자이저', desc: '둘의 추진력과 호기심을 쏙 빼닮아 잠시도 가만히 있지 못하는 탐험가! 아기띠와 운동화는 필수입니다.', difficulty: '상 (체력전)', dadPercent: 52, momPercent: 48, icon: '🚀' },
        { title: '뚝심 있는 평화주의 먹보 천사', desc: '둘의 느긋하고 든든한 면모를 이어받아 잘 먹고 잘 자는 힐링 아기. 단, 고집부리기 시작하면 황소고집!', difficulty: '중 (멘탈 평온)', dadPercent: 58, momPercent: 42, icon: '🍯' },
        { title: '눈치 100단 두뇌형 보스 베이비', desc: '상황 파악이 빨라 부모 머리 꼭대기에 앉아 밀당하는 천재과 아기! 어설픈 속임수는 통하지 않아요.', difficulty: '중상 (두뇌 싸움)', dadPercent: 45, momPercent: 55, icon: '🧠' },
        { title: '엄마아빠 껌딱지 애교 만점 사랑둥이', desc: '눈 맞춤 한 번에 심장을 녹이는 애교쟁이! 분리불안과 등센서가 살짝 있지만 미소 한 방에 사르르 녹습니다.', difficulty: '중상 (안아주기 지옥)', dadPercent: 35, momPercent: 65, icon: '💖' },
      ];

      const selectedBaby = babyList[(p1Hash + p2Hash) % babyList.length];
      const chemistryScore = 75 + ((p1Hash * 7 + p2Hash * 3) % 25);

      const isP1Turn = (todayHash + p1Hash) % 2 === 0;
      const winnerName = isP1Turn ? (partner1Name.trim() || '나') : (partner2Name.trim() || '연인');
      const supporterName = isP1Turn ? (partner2Name.trim() || '연인') : (partner1Name.trim() || '나');

      const chore = {
        winner: winnerName,
        supporter: supporterName,
        benefit: '오늘 저녁 메뉴 & 데이트 코스 전권 획득! (손 하나 까딱 안 할 권리 🎟️)',
        duty: `${supporterName}님은 오늘 ${winnerName}님을 위한 특급 풀케어와 데이트 준비를 기분 좋게 전담하는 날입니다!`,
      };

      setCoupleResult({
        p1Elem,
        p2Elem,
        p1Animal,
        p2Animal,
        p1AnimalIcon: ANIMAL_ICONS[p1Animal] || '🐯',
        p2AnimalIcon: ANIMAL_ICONS[p2Animal] || '🐰',
        baby: selectedBaby,
        chore,
        chemistryScore,
      });

      setIsAnalyzingCouple(false);
      setCoupleCountdown(null);
    }, 1800);
  };

  const handleCalculateDailyVerdict = () => {
    if (!partner1Birth || !partner2Birth) {
      alert('두 분의 생년월일을 모두 입력해주세요!');
      return;
    }

    const p1Check = validateDateString(partner1Birth, {
      allowFuture: false,
      minYear: 1950,
      maxYear: new Date().getFullYear(),
      fieldName: '나의 생년월일',
    });
    if (!p1Check.isValid) {
      alert(p1Check.errorMsg);
      return;
    }

    const p2Check = validateDateString(partner2Birth, {
      allowFuture: false,
      minYear: 1950,
      maxYear: new Date().getFullYear(),
      fieldName: '연인의 생년월일',
    });
    if (!p2Check.isValid) {
      alert(p2Check.errorMsg);
      return;
    }

    setIsAnalyzingDaily(true);
    trackEvent('click_couple_daily_verdict', 'Engagement', '커플 특권 판결 시작');

    setTimeout(() => {
      const p1Hash = partner1Birth.replace(/[^0-9]/g, '').split('').reduce((acc, cur) => acc + parseInt(cur, 10), 0);
      const p2Hash = partner2Birth.replace(/[^0-9]/g, '').split('').reduce((acc, cur) => acc + parseInt(cur, 10), 0);
      const today = new Date();
      const todayHash = today.getFullYear() + today.getMonth() + 1 + today.getDate();

      const isP1Turn = (todayHash + p1Hash) % 2 === 0;
      const winnerName = isP1Turn ? (partner1Name.trim() || '나') : (partner2Name.trim() || '연인');
      const supporterName = isP1Turn ? (partner2Name.trim() || '연인') : (partner1Name.trim() || '나');
      const chemistryScore = 75 + ((p1Hash * 7 + p2Hash * 3) % 25);

      const chore = {
        winner: winnerName,
        supporter: supporterName,
        benefit: '오늘 저녁 메뉴 & 데이트 코스 전권 획득! (손 하나 까딱 안 할 권리 🎟️)',
        duty: `${supporterName}님은 오늘 ${winnerName}님을 위한 특급 풀케어와 데이트 준비를 기분 좋게 전담하는 날입니다!`,
      };

      setCoupleResult((prev: any) => ({
        ...(prev || {}),
        chore,
        chemistryScore,
      }));

      setIsAnalyzingDaily(false);
    }, 1500);
  };

  const handleDownloadCoupleCard = async () => {
    if (!coupleResult) return;

    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1120;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawBox = (x: number, y: number, w: number, h: number, r: number = 24) => {
      const radius = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + w - radius, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
      ctx.lineTo(x + w, y + h - radius);
      ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
      ctx.lineTo(x + radius, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    };

    const bgGrad = ctx.createLinearGradient(0, 0, 800, 1120);
    bgGrad.addColorStop(0, '#FFF1F2');
    bgGrad.addColorStop(0.5, '#FDF4FF');
    bgGrad.addColorStop(1, '#EEF2FF');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 800, 1120);

    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(15, 23, 42, 0.08)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 15;
    drawBox(40, 40, 720, 1040, 32);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // 홀로그램 그라데이션 테두리 (빛 반사 효과는 넣지 않음)
    const holoGrad = ctx.createLinearGradient(40, 40, 760, 1080);
    holoGrad.addColorStop(0, '#F9A8D4');
    holoGrad.addColorStop(0.25, '#FDE68A');
    holoGrad.addColorStop(0.5, '#6EE7B7');
    holoGrad.addColorStop(0.75, '#7DD3FC');
    holoGrad.addColorStop(1, '#C4B5FD');
    ctx.strokeStyle = holoGrad;
    ctx.lineWidth = 6;
    drawBox(43, 43, 714, 1034, 30);
    ctx.stroke();

    // 모서리 스티커
    ctx.font = '20px sans-serif';
    ctx.fillStyle = '#F472B6';
    ctx.fillText('★', 72, 82);
    ctx.fillStyle = '#F59E0B';
    ctx.fillText('♥', 728, 82);
    ctx.fillStyle = '#34D399';
    ctx.fillText('♥', 72, 1054);
    ctx.fillStyle = '#38BDF8';
    ctx.fillText('★', 728, 1054);

    ctx.fillStyle = '#C75B6E';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('아기속풀이 PRO · 60갑자 커플 & 가상 2세 도감', 400, 95);

    ctx.fillStyle = '#0F172A';
    ctx.font = '900 34px sans-serif';
    ctx.fillText('우리의 가상 2세 & 오행 궁합', 400, 145);

    // 섹션 배경 통일: 모든 섹션을 흰 배경 + 얇은 중성 테두리로 (구분은 테두리와 라벨 색으로만)
    ctx.fillStyle = '#FFFFFF';
    drawBox(75, 175, 650, 210, 24);
    ctx.fill();
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    drawBox(75, 175, 650, 210, 24);
    ctx.stroke();

    // 부모 띠 동물 일러스트 (기존 public/animals 자산, 로드 실패 시 이모지 폴백)
    const loadAnimalImg = (src: string) =>
      new Promise<HTMLImageElement | null>((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });
    const animalFileFor = (birth: string) => {
      const year = parseInt(birth.replace(/[^0-9]/g, '').slice(0, 4) || '2000', 10);
      const aIdx = ((year - 4) % 12 + 12) % 12;
      const cIdx = ((year - 4) % 10 + 10) % 10;
      return `/animals/${CHEONGAN_TO_COLOR[cIdx] || 'blue'}_${JIJI_TO_ANIMAL[aIdx] || 'tiger'}.png`;
    };
    const [p1Img, p2Img] = await Promise.all([
      loadAnimalImg(animalFileFor(partner1Birth)),
      loadAnimalImg(animalFileFor(partner2Birth)),
    ]);
    const drawAnimal = (img: HTMLImageElement | null, x: number, fallback: string) => {
      if (img) {
        ctx.save();
        drawBox(x, 188, 96, 96, 20);
        ctx.clip();
        ctx.drawImage(img, x, 188, 96, 96);
        ctx.restore();
      } else {
        ctx.font = '58px sans-serif';
        ctx.fillText(fallback, x + 48, 260);
      }
    };
    drawAnimal(p1Img, 182, coupleResult.p1AnimalIcon || '🐯');
    drawAnimal(p2Img, 522, coupleResult.p2AnimalIcon || '🐰');

    ctx.font = '40px sans-serif';
    ctx.fillText('❤️', 400, 252);

    ctx.font = 'bold 22px sans-serif';
    ctx.fillStyle = '#0F172A';
    ctx.fillText(`${partner1Name || '나'} (${coupleResult.p1Animal || '호랑이'}띠)`, 230, 305);
    ctx.fillText(`${partner2Name || '연인'} (${coupleResult.p2Animal || '토끼'}띠)`, 570, 305);

    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#C75B6E';
    ctx.fillText(coupleResult.p1Elem || '', 230, 332);
    ctx.fillStyle = '#6670A8';
    ctx.fillText(coupleResult.p2Elem || '', 570, 332);

    ctx.fillStyle = '#F8FAFC';
    drawBox(110, 345, 580, 30, 15);
    ctx.fill();
    ctx.fillStyle = '#B04A5E';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText(`💡 60갑자 상생: 서로의 부족한 기운을 채워주며 교감이 통하는 천생연분 궁합`, 400, 366);

    ctx.fillStyle = '#FFFFFF';
    drawBox(75, 400, 650, 275, 24);
    ctx.fill();
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    drawBox(75, 400, 650, 275, 24);
    ctx.stroke();

    ctx.fillStyle = '#A87B4F';
    ctx.font = 'bold 19px sans-serif';
    ctx.fillText(`FUTURE BABY · 육아 난이도: ${coupleResult.baby?.difficulty || '보통'}`, 400, 445);

    ctx.font = '58px sans-serif';
    ctx.fillText(coupleResult.baby?.icon || '🍼', 400, 520);

    ctx.fillStyle = '#0F172A';
    ctx.font = '900 26px sans-serif';
    ctx.fillText(coupleResult.baby?.title || '', 400, 570);

    ctx.fillStyle = '#475569';
    ctx.font = 'bold 19px sans-serif';
    ctx.fillText(`${partner1Name || '나'} 성향 ${coupleResult.baby?.dadPercent || 50}%  |  ${partner2Name || '연인'} 성향 ${coupleResult.baby?.momPercent || 50}%`, 400, 622);

    ctx.fillStyle = '#A87B4F';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(`💡 산출 근거: 부모의 추진력과 감각적 재능을 가장 조화롭게 이어받을 유형`, 400, 655);

    ctx.fillStyle = '#FFFFFF';
    drawBox(75, 690, 650, 205, 24);
    ctx.fill();
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    drawBox(75, 690, 650, 205, 24);
    ctx.stroke();

    ctx.fillStyle = '#6670A8';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(`오늘의 커플 특권 판결 (케미스트리 ${coupleResult.chemistryScore || 85}점)`, 400, 735);

    ctx.fillStyle = '#C75B6E';
    ctx.font = '900 23px sans-serif';
    ctx.fillText(`👑 오늘의 특권자: ${coupleResult.chore?.winner || '나'}`, 400, 782);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(coupleResult.chore?.benefit || '', 400, 825);

    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(`🫡 ${coupleResult.chore?.supporter || '연인'}님은 특급 풀케어로 모셔주세요!`, 400, 862);

    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(`아기속풀이 PRO · 커플 & 가상 2세 도감 · ${formatTodayDot()} · baby-sokpuli.vercel.app`, 400, 990);

    const link = document.createElement('a');
    link.download = `아기속풀이_커플2세도감_${partner1Name || '커플'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    fireConfetti();
  };

  const [mounted, setMounted] = useState(false);
  const [isNightMode, setIsNightMode] = useState(false);
  const [attendance, setAttendance] = useState<{
    streak: number;
    total: number;
    week: { label: string; attended: boolean; isToday: boolean }[];
  } | null>(null);
  const [step, setStep] = useState<'form' | 'result'>('form');
  const [viewMode, setViewMode] = useState<'hub' | 'form'>('hub');

  // 밤중 모드 토글 (선택은 localStorage에 저장해 재방문 시 유지)
  const handleToggleNightMode = () => {
    setIsNightMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('night_mode', next ? '1' : '0');
      } catch (e) {
        console.error('밤중 모드 저장 실패', e);
      }
      return next;
    });
  };

  // 밤중 모드일 때 앱 바깥(body) 배경도 어둡게 맞춤
  useEffect(() => {
    document.body.style.backgroundColor = isNightMode ? '#0B1220' : '';
  }, [isNightMode]);

  const cardRef = useRef<HTMLDivElement>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);
  const birthDateInputRef = useRef<HTMLInputElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoungeOpen, setIsLoungeOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [iosSavedImageUrl, setIosSavedImageUrl] = useState<string | null>(null);

  const [isAiReportModalOpen, setIsAiReportModalOpen] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const visitor = useVisitorTracker();

  const [profiles, setProfiles] = useState<BabyProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [gender, setGender] = useState<'boy' | 'girl'>('boy');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [isUnknownTime, setIsUnknownTime] = useState(false);
  const [dueDate, setDueDate] = useState('');

  const [parentBirth, setParentBirth] = useState('');
  const [parentMatchError, setParentMatchError] = useState<string | undefined>();
  const [parentingDifficulty, setParentingDifficulty] = useState<ParentingDifficultyResult | null>(null);
  const [isParentMatchModalOpen, setIsParentMatchModalOpen] = useState(false);
  const [isAnalyzingParentMatch, setIsAnalyzingParentMatch] = useState(false);
  const [parentMatchCountdown, setParentMatchCountdown] = useState<number | null>(null);

  const parentMatchCardRef = useRef<HTMLDivElement>(null);
  const [isDownloadingParentMatch, setIsDownloadingParentMatch] = useState(false);

  // 아기 이름 궁합 (커플·예비부모 그룹의 가벼운 재미 기능)
  const [isNameMatchModalOpen, setIsNameMatchModalOpen] = useState(false);
  const [nameMatchMom, setNameMatchMom] = useState('');
  const [nameMatchDad, setNameMatchDad] = useState('');
  const [nameMatchBaby, setNameMatchBaby] = useState('');
  const [nameMatchError, setNameMatchError] = useState<string | undefined>();
  const [nameMatchResult, setNameMatchResult] = useState<NameMatchResult | null>(null);
  const [isAnalyzingNameMatch, setIsAnalyzingNameMatch] = useState(false);
  const nameMatchCardRef = useRef<HTMLDivElement>(null);
  const [isDownloadingNameMatch, setIsDownloadingNameMatch] = useState(false);
  const nameMatchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 첫 화면 구름 걷히기: 마운트 후 짧은 시간(0.95초) 뒤, 또는 첫 탭에 즉시 걷힌다 (접근을 막지 않는 장식)
  const [introCloudCleared, setIntroCloudCleared] = useState(false);
  const [introCloudGone, setIntroCloudGone] = useState(false);
  // reduced-motion 환경에서는 globals.css가 .cloud-layer를 display:none으로 숨기므로 JS 분기는 두지 않는다
  useEffect(() => {
    const timer = window.setTimeout(() => setIntroCloudCleared(true), 950);
    const clearNow = () => setIntroCloudCleared(true);
    window.addEventListener('pointerdown', clearNow, { once: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('pointerdown', clearNow);
    };
  }, []);
  useEffect(() => {
    if (!introCloudCleared) return;
    const timer = window.setTimeout(() => setIntroCloudGone(true), 1000);
    return () => window.clearTimeout(timer);
  }, [introCloudCleared]);

  const [pushSubscribed, setPushSubscribed] = useState(false);
  const [tarotPushSubscribed, setTarotPushSubscribed] = useState(false);

  const parentMatchIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const parentMatchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isChemiModalOpen, setIsChemiModalOpen] = useState(false);
  const [momBirth, setMomBirth] = useState('');
  const [dadBirth, setDadBirth] = useState('');
  const [chemiResult, setChemiResult] = useState<{ momScore: number; dadScore: number; best: string; summary: string; reason: string } | null>(null);
  const [isAnalyzingChemi, setIsAnalyzingChemi] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isAlreadyJudgedToday, setIsAlreadyJudgedToday] = useState(false);

  const [chemiErrors, setChemiErrors] = useState<{ mom?: string; dad?: string }>({});
  const [dynamicMomBar, setDynamicMomBar] = useState(50);
  const [dynamicDadBar, setDynamicDadBar] = useState(50);

  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clashAnimationRef = useRef<NodeJS.Timeout | null>(null);

  const [isTarotModalOpen, setIsTarotModalOpen] = useState(false);
  const [tarotSelectedCard, setTarotSelectedCard] = useState<TarotCardItem | null>(null);
  const [isTarotAnalyzing, setIsTarotAnalyzing] = useState(false);
  const [tarotCountdown, setTarotCountdown] = useState<number | null>(null);
  const [isTarotRevealed, setIsTarotRevealed] = useState(false);
  const [tarotFlipped, setTarotFlipped] = useState(false);
  const [tarotFlipSettled, setTarotFlipSettled] = useState(false);

  // 타로 결과가 공개되면 카드가 3D로 뒤집히며 앞면을 보여주고, 애니메이션이 끝나면 이미지 캡처 안정성을 위해 정적 이미지로 교체한다
  // (플립 상태 초기화는 모달 열기/카드 선택 핸들러에서 수행)
  useEffect(() => {
    if (isTarotRevealed && tarotSelectedCard) {
      const t1 = setTimeout(() => setTarotFlipped(true), 200);
      const t2 = setTimeout(() => setTarotFlipSettled(true), 1150);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [isTarotRevealed, tarotSelectedCard]);
  const [tarotImgError, setTarotImgError] = useState(false);
  const tarotIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const tarotTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tarotCardCaptureRef = useRef<HTMLDivElement>(null);
  const [isDownloadingTarot, setIsDownloadingTarot] = useState(false);

  // 결과 화면 공통: 토스트 피드백
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const showToast = (message: string) => {
    setToastMessage(message);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setToastMessage(null), 2600);
  };

  // 결과 화면 공통: 공유 (카카오 SDK → Web Share → 클립보드 복사 순으로 폴백, 항상 토스트로 결과 안내)
  // shareUrl을 넘기면 현재 주소 대신 결과 공유 링크(쿼리 파라미터 포함)를 공유한다
  // 공유 본문에는 브랜드 기본 문구가 자동으로 붙는다 (이미 포함된 경우 중복 방지)
  const SHARE_BRAND_LINE = '🍼 아기속풀이 PRO에서 확인했어요';
  const shareResult = async (title: string, text: string, eventLabel: string, shareUrl?: string) => {
    trackEvent('click_share_result', 'Viral', eventLabel);
    const brandedText = text.includes('아기속풀이') ? text : `${text}\n${SHARE_BRAND_LINE}`;
    const currentUrl = shareUrl || (typeof window !== 'undefined' ? window.location.href : 'https://baby-sokpuli.vercel.app');

    const kakao = (window as unknown as {
      Kakao?: {
        isInitialized: () => boolean;
        Share: { sendDefault: (options: Record<string, unknown>) => void };
      };
    }).Kakao;

    if (typeof window !== 'undefined' && kakao && kakao.isInitialized()) {
      try {
        kakao.Share.sendDefault({
          objectType: 'feed',
          content: {
            title,
            description: brandedText,
            imageUrl: 'https://baby-sokpuli.vercel.app/og-image.png',
            link: { mobileWebUrl: currentUrl, webUrl: currentUrl },
          },
        });
        fireConfetti();
        return;
      } catch (e) {
        console.error('카카오 공유 실패, 폴백 진행', e);
      }
    }

    if (navigator.share) {
      try {
        await navigator.share({ title, text: brandedText, url: currentUrl });
        fireConfetti();
        return;
      } catch {
        console.log('공유 취소됨');
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(`${title}\n${brandedText}\n${currentUrl}`);
      fireConfetti();
      showToast('결과가 복사됐어요! 카톡 대화방에 붙여넣어 공유해보세요 💌');
    } catch {
      showToast('복사에 실패했어요. 주소창의 링크를 직접 공유해주세요 🙏');
    }
  };

  // 기질 도감 결과 공유 링크: 아이 정보를 쿼리 파라미터로 인코딩 (링크를 열면 같은 대시보드가 바로 보임)
  const buildBabyShareUrl = (): string | undefined => {
    if (typeof window === 'undefined') return undefined;
    const bd = birthDate.replace(/[^0-9]/g, '');
    if (bd.length !== 8) return undefined;
    const params = new URLSearchParams();
    params.set('baby', '1');
    if (name.trim()) params.set('n', name.trim());
    params.set('g', gender);
    params.set('bd', bd);
    if (isUnknownTime) params.set('tu', '1');
    else if (birthTime) params.set('bt', birthTime);
    const dd = dueDate.replace(/[^0-9]/g, '');
    if (dd.length === 8) params.set('dd', dd);
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  };

  // 당번 판결소 결과 공유 링크: 엄마·아빠(선택: 아기) 생년월일을 인코딩 (판결은 날짜 기반이라 같은 날 열면 같은 결과)
  const buildCourtShareUrl = (): string | undefined => {
    if (typeof window === 'undefined') return undefined;
    const m = momBirth.replace(/[^0-9]/g, '');
    const d = dadBirth.replace(/[^0-9]/g, '');
    if (m.length !== 8 || d.length !== 8) return undefined;
    const params = new URLSearchParams();
    params.set('court', '1');
    params.set('m', m);
    params.set('d', d);
    const b = birthDate.replace(/[^0-9]/g, '');
    if (b.length === 8) params.set('b', b);
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  };

  // 당번 판결소 결과 캡처용
  const chemiResultRef = useRef<HTMLDivElement>(null);
  const [isDownloadingChemi, setIsDownloadingChemi] = useState(false);
  const handleDownloadChemiCard = async () => {
    if (!chemiResultRef.current || !chemiResult) return;
    setIsDownloadingChemi(true);
    trackEvent('click_download_chemi', 'Engagement', '당번 판결 결과 이미지 저장');

    try {
      const dataUrl = await toPng(chemiResultRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#FFFFFF',
      });

      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      if (isIOS) {
        setIosSavedImageUrl(dataUrl);
        showToast('이미지가 준비됐어요! 이미지를 길게 눌러 저장해주세요 📸');
      } else {
        const link = document.createElement('a');
        link.download = `아기속풀이_오늘의육아당번_${chemiResult.best}.png`;
        link.href = dataUrl;
        link.click();
      }
      fireConfetti();
    } catch (error) {
      console.error('판결 결과 이미지 저장 실패:', error);
      showToast('이미지 저장 중 오류가 발생했어요. 화면을 직접 캡처해 공유해 보세요!');
    } finally {
      setIsDownloadingChemi(false);
    }
  };

  // 커플 특권 판결소 결과 캡처용
  const coupleVerdictRef = useRef<HTMLDivElement>(null);
  const [isDownloadingCoupleVerdict, setIsDownloadingCoupleVerdict] = useState(false);
  const handleDownloadCoupleVerdictCard = async () => {
    if (!coupleVerdictRef.current || !coupleResult?.chore) return;
    setIsDownloadingCoupleVerdict(true);
    trackEvent('click_download_couple_verdict', 'Engagement', '커플 특권 판결 결과 이미지 저장');

    try {
      const dataUrl = await toPng(coupleVerdictRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#F8FAFC',
      });

      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      if (isIOS) {
        setIosSavedImageUrl(dataUrl);
        showToast('이미지가 준비됐어요! 이미지를 길게 눌러 저장해주세요 📸');
      } else {
        const link = document.createElement('a');
        link.download = `아기속풀이_커플특권판결_${coupleResult.chore.winner}.png`;
        link.href = dataUrl;
        link.click();
      }
      fireConfetti();
    } catch (error) {
      console.error('커플 판결 결과 이미지 저장 실패:', error);
      showToast('이미지 저장 중 오류가 발생했어요. 화면을 직접 캡처해 공유해 보세요!');
    } finally {
      setIsDownloadingCoupleVerdict(false);
    }
  };

  const handleDownloadTarotCard = async () => {
    if (!tarotCardCaptureRef.current) return;
    setIsDownloadingTarot(true);
    trackEvent('click_download_tarot', 'Engagement', '타로 카드 이미지 저장');

    try {
      const dataUrl = await toPng(tarotCardCaptureRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#FFFFFF',
      });

      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      if (isIOS) {
        setIosSavedImageUrl(dataUrl);
      } else {
        const link = document.createElement('a');
        link.download = `아기속풀이_육아타로_${tarotSelectedCard?.korTitle || '카드'}.png`;
        link.href = dataUrl;
        link.click();
      }
      fireConfetti();
    } catch (error) {
      alert('이미지 저장 중 일시적인 오류가 발생했습니다. 화면을 직접 캡처해 주세요!');
    } finally {
      setIsDownloadingTarot(false);
    }
  };

  const [activeTooltip, setActiveTooltip] = useState<'curiosity' | 'energy' | 'fussy' | null>(null);

  const [ageMode, setAgeMode] = useState<'infant' | 'toddler' | 'child'>('infant');
  const [calculatedAgeText, setCalculatedAgeText] = useState('생후 19주차 (4개월)');
  const [characterTitle, setCharacterTitle] = useState('흑빛토끼 [癸卯]');
  const [animalModifier, setAnimalModifier] = useState('깡총깡총 사랑스러운');
  const [colorLabel, setColorLabel] = useState('흑빛');
  const [characterCheonganIndex, setCharacterCheonganIndex] = useState(9);
  const [characterAnimalIndex, setCharacterAnimalIndex] = useState(3);
  const [elementTag, setElementTag] = useState({ name: '수(水)', color: '#1E293B' });
  const [jijiHanja, setJijiHanja] = useState('卯');
  const [animalName, setAnimalName] = useState('토끼');

  const [scores, setScores] = useState({ curiosity: 88, energy: 94, fussy: 42 });
  const [oneLineSummary, setOneLineSummary] = useState('호기심 대폭발! 눈앞의 모든 걸 만져보고 두드려봐야 직성이 풀려요');

  const [babyWeather, setBabyWeather] = useState<BabyWeather>({
    icon: '☀️',
    status: '맑고 쾌청 (텐션 100%)',
    tension: '아이의 타고난 오행 본성과 오늘 기운이 완벽하게 일치해요!',
    tip: '호기심과 웃음이 만개하는 날입니다. 칭찬을 아끼지 마시고 가벼운 산책을 선물해 보세요.',
    bgGradient: 'from-amber-500/10 via-amber-500/5 to-transparent border-amber-300',
  });

  const [solutionData, setSolutionData] = useState<{
    badge: string;
    mainTitle: string;
    signals: string[];
    actions: string[];
    parentTip: string;
    highlightTag: string;
    highlightTitle: string;
    isLeap: boolean;
    isWonderLeap: boolean;
    dDayText: string;
    currentLocation: string;
  }>({
    badge: '제4도약기 구간',
    mainTitle: '마의 19주 폭풍 구간이에요',
    signals: [
      '누우면 바로 깨는 극강의 등센서 각성',
      '밤중에 1~2시간마다 깨며 수면 퇴행 발생',
      '수유 중 산만해져 주변을 두리번거리며 보챔',
    ],
    actions: [
      '눕혀 재우기 고집 대신 아기띠로 신경계 안정시키기',
      '잠들기 전 20분간 동일한 수면 의식 반복하기',
      '밤에 깼을 때 불 켜지 않고 무반응 침묵 육아로 대응',
    ],
    parentTip: '가장 힘든 마의 구간입니다! 혼자 버티지 마시고 배우자와 교대로 수면을 보충하세요.',
    highlightTag: '도약기 폭풍 탈출 디데이',
    highlightTitle: '앞으로 10일 뒤에 맑은 날이 찾아와요',
    isLeap: true,
    isWonderLeap: true,
    dDayText: '원더윅스 탈출까지 약 D-10일',
    currentLocation: '도약기 폭풍 구간',
  });

  const [potionData, setPotionData] = useState<PotionDetail & { color: string; link?: string }>({
    title: '유기농 서양자두 푸룬·사과 퓨레',
    subTitle: '수(水)의 원활한 순환과 시원한 배변',
    tag: '쾌변 퓨레',
    color: '#1E293B',
    guide: '신장과 배설 순환을 도와 아기의 속을 시원하게 뚫어주고 정서적 안정감을 찾아주는 보라빛 포션이에요.',
    link: SERVICE_LINKS.coupangDefault,
  });

  const todayGuide = getTodayElementGuide();

  const handleToggleTooltip = (id: 'curiosity' | 'energy' | 'fussy') => {
    setActiveTooltip((prev) => (prev === id ? null : id));
  };

  const [errors, setErrors] = useState<{ name?: string; birthDate?: string; dueDate?: string }>({});

  const handleDateChange = (value: string, setter: (val: string) => void, fieldKey: 'birthDate' | 'dueDate' | 'momBirth' | 'dadBirth' | 'parentBirth' | 'partner1Birth' | 'partner2Birth') => {
    const cleanNumbers = value.replace(/[^0-9]/g, '').slice(0, 8);
    let formatted = cleanNumbers;
    if (cleanNumbers.length >= 5 && cleanNumbers.length <= 6) {
      formatted = `${cleanNumbers.slice(0, 4)}.${cleanNumbers.slice(4)}`;
    } else if (cleanNumbers.length >= 7) {
      formatted = `${cleanNumbers.slice(0, 4)}.${cleanNumbers.slice(4, 6)}.${cleanNumbers.slice(6, 8)}`;
    }
    setter(formatted);

    if (fieldKey === 'birthDate' && errors.birthDate) setErrors((prev) => ({ ...prev, birthDate: undefined }));
    if (fieldKey === 'dueDate' && errors.dueDate) setErrors((prev) => ({ ...prev, dueDate: undefined }));
    if (fieldKey === 'momBirth' && chemiErrors.mom) setChemiErrors((prev) => ({ ...prev, mom: undefined }));
    if (fieldKey === 'dadBirth' && chemiErrors.dad) setChemiErrors((prev) => ({ ...prev, dad: undefined }));
    if (fieldKey === 'parentBirth' && parentMatchError) setParentMatchError(undefined);
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
  };

  useEffect(() => {
    setMounted(true);

    // 밤중 모드 설정 복원
    try {
      if (localStorage.getItem('night_mode') === '1') setIsNightMode(true);
    } catch (e) {
      console.error('밤중 모드 로드 실패', e);
    }

    // 저장된 아이 프로필 로드 (목록 상태용)
    let parsed: BabyProfile[] = [];
    try {
      const saved = localStorage.getItem('baby_profiles');
      if (saved) {
        const list = JSON.parse(saved) as BabyProfile[];
        if (Array.isArray(list) && list.length > 0) {
          parsed = list;
          setProfiles(list);
        }
      }
    } catch (e) {
      console.error('다자녀 프로필 로드 실패', e);
    }

    // 출석 도장: 오늘 방문을 기록하고 연속 출석(스트릭)과 이번 주 출석 현황을 계산
    try {
      const ATT_KEY = 'attendance_log_v1';
      const fmtDate = (d: Date) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      let visitDates: string[] = [];
      const rawVisits = localStorage.getItem(ATT_KEY);
      if (rawVisits) {
        const parsedVisits = JSON.parse(rawVisits);
        if (Array.isArray(parsedVisits)) {
          visitDates = parsedVisits.filter((x: unknown) => typeof x === 'string');
        }
      }
      const todayDate = new Date();
      const todayStr = fmtDate(todayDate);
      if (!visitDates.includes(todayStr)) {
        visitDates = [...visitDates, todayStr].sort().slice(-365);
        localStorage.setItem(ATT_KEY, JSON.stringify(visitDates));
      }
      const attendedSet = new Set(visitDates);
      // 오늘부터 거꾸로 세는 연속 출석 (하루라도 비면 스트릭 리셋)
      let streakCount = 0;
      const streakCursor = new Date(todayDate);
      while (attendedSet.has(fmtDate(streakCursor))) {
        streakCount += 1;
        streakCursor.setDate(streakCursor.getDate() - 1);
      }
      // 이번 주(월~일) 출석 현황
      const mondayDate = new Date(todayDate);
      mondayDate.setDate(todayDate.getDate() - ((todayDate.getDay() + 6) % 7));
      const weekLabels = ['월', '화', '수', '목', '금', '토', '일'];
      const weekStatus = weekLabels.map((label, i) => {
        const d = new Date(mondayDate);
        d.setDate(mondayDate.getDate() + i);
        const ds = fmtDate(d);
        return { label, attended: attendedSet.has(ds), isToday: ds === todayStr };
      });
      setAttendance({ streak: streakCount, total: visitDates.length, week: weekStatus });
    } catch (e) {
      console.error('출석 도장 로드 실패', e);
    }

    // 결과 공유 링크로 들어온 경우: 같은 결과를 바로 표시
    try {
      const params = new URLSearchParams(window.location.search);

      if (params.get('court') === '1') {
        const m = formatDateDigits(params.get('m') || '');
        const d = formatDateDigits(params.get('d') || '');
        const b = formatDateDigits(params.get('b') || '');
        if (m && d) {
          setMomBirth(m);
          setDadBirth(d);
          if (b) setBirthDate(b);
          const verdict = computeDutyVerdict(m, d, b);
          setChemiResult(verdict);
          setDynamicMomBar(verdict.momScore);
          setDynamicDadBar(verdict.dadScore);
          setIsAlreadyJudgedToday(true);
          const nowForCache = new Date();
          const todayStrForCache = `${nowForCache.getFullYear()}-${String(nowForCache.getMonth() + 1).padStart(2, '0')}-${String(nowForCache.getDate()).padStart(2, '0')}`;
          localStorage.setItem(`duty_verdict_${todayStrForCache}`, JSON.stringify(verdict));
          setIsChemiModalOpen(true);
          return;
        }
      }

      if (params.get('baby') === '1') {
        const bd = formatDateDigits(params.get('bd') || '');
        if (bd) {
          const sharedProfile: BabyProfile = {
            id: 'shared_baby',
            name: params.get('n') || '우리 아이',
            gender: params.get('g') === 'girl' ? 'girl' : 'boy',
            birthDate: bd,
            birthTime: params.get('bt') || '',
            isUnknownTime: params.get('tu') === '1',
            dueDate: formatDateDigits(params.get('dd') || ''),
          };
          applyProfileToState(sharedProfile);
          runAdaptiveEngine(sharedProfile.birthDate, sharedProfile.dueDate);
          setStep('result');
          return;
        }
      }
    } catch (e) {
      console.error('공유 링크 처리 실패', e);
    }

    // 지난 결과 이어보기: 마지막으로 본 아이 프로필을 자동 복원
    if (parsed.length > 0) {
      let target = parsed[0];
      try {
        const lastId = localStorage.getItem('last_profile_id');
        const found = lastId ? parsed.find((p) => p.id === lastId) : undefined;
        if (found) target = found;
      } catch (e) {
        console.error('마지막 프로필 로드 실패', e);
      }
      setActiveProfileId(target.id);
      applyProfileToState(target);
      runAdaptiveEngine(target.birthDate, target.dueDate);
      setStep('result');
    }
  }, []);

  const getTodayDateString = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const getTarotStorageKey = (profileId: string | null) => {
    const todayStr = getTodayDateString();
    const targetId = profileId || (name.trim() ? `child_${name.trim()}` : 'guest_child');
    return `daily_tarot_${todayStr}_${targetId}`;
  };

  const handleOpenTarotModal = () => {
    const storageKey = getTarotStorageKey(activeProfileId);
    const cachedTarot = localStorage.getItem(storageKey);
    setTarotImgError(false);

    if (cachedTarot) {
      try {
        const parsed = JSON.parse(cachedTarot);
        if (parsed) {
          if (!parsed.korTitle && parsed.name) {
            const raw = parsed.name as string;
            const parts = raw.split('(');
            parsed.korTitle = parts[0]?.trim() || raw;
            parsed.engSub = parts[1]?.replace(')', '').trim() || '';
          }
          setTarotSelectedCard(parsed);
          setIsTarotRevealed(true);
        }
      } catch (e) {
        setIsTarotRevealed(false);
      }
    } else {
      setIsTarotRevealed(false);
      setTarotSelectedCard(null);
    }
    setIsTarotAnalyzing(false);
    setTarotCountdown(null);
    setTarotFlipped(false);
    setTarotFlipSettled(false);
    setIsTarotModalOpen(true);
  };

  const handleSelectTarotCard = (cardIdx: number) => {
    if (isTarotRevealed || isTarotAnalyzing) return;

    trackEvent('click_pick_tarot', 'Engagement', `타로 카드 선택 (${cardIdx}번)`);
    setIsTarotAnalyzing(true);
    setTarotCountdown(15);
    setTarotImgError(false);
    setTarotFlipped(false);
    setTarotFlipSettled(false);

    const chosen = TAROT_CARDS_DATA[Math.floor(Math.random() * TAROT_CARDS_DATA.length)];
    setTarotSelectedCard(chosen);

    tarotIntervalRef.current = setInterval(() => {
      setTarotCountdown((prev) => {
        if (prev === null || prev <= 1) {
          if (tarotIntervalRef.current) clearInterval(tarotIntervalRef.current);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    tarotTimeoutRef.current = setTimeout(() => {
      setIsTarotAnalyzing(false);
      setIsTarotRevealed(true);
      setTarotCountdown(null);

      const storageKey = getTarotStorageKey(activeProfileId);
      localStorage.setItem(storageKey, JSON.stringify(chosen));
    }, 1800);
  };

  const handleCloseTarotModal = () => {
    if (tarotIntervalRef.current) clearInterval(tarotIntervalRef.current);
    if (tarotTimeoutRef.current) clearInterval(tarotTimeoutRef.current);
    setIsTarotModalOpen(false);
    setIsTarotAnalyzing(false);
    setTarotCountdown(null);
    setTarotFlipped(false);
    setTarotFlipSettled(false);
  };

  const handleOpenChemiModal = () => {
    // 지난 판결 때 입력한 엄마·아빠 생년월일 복원 (다시 입력하지 않게)
    if (!momBirth && !dadBirth) {
      try {
        const savedParents = localStorage.getItem('duty_parents');
        if (savedParents) {
          const parsedParents = JSON.parse(savedParents) as { mom?: string; dad?: string };
          if (parsedParents.mom) setMomBirth(parsedParents.mom);
          if (parsedParents.dad) setDadBirth(parsedParents.dad);
        }
      } catch (e) {
        console.error('판결소 입력값 복원 실패', e);
      }
    }

    const todayStr = getTodayDateString();
    const cachedToday = localStorage.getItem(`duty_verdict_${todayStr}`);

    if (cachedToday) {
      try {
        const parsed = JSON.parse(cachedToday);
        setChemiResult(parsed);
        setIsAlreadyJudgedToday(true);
      } catch (e) {
        setIsAlreadyJudgedToday(false);
      }
    } else {
      setIsAlreadyJudgedToday(false);
    }
    setChemiErrors({});
    setIsChemiModalOpen(true);
  };

  const handleScrollToForm = () => {
    setSelectedGateway('parenting');
    setActiveTabMode('parenting');
    setCoupleModeType(null);
    window.setTimeout(() => {
      formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      birthDateInputRef.current?.focus({ preventScroll: true });
    }, 80);
  };

  const handleOpenVirtualBabySimulator = () => {
    setSelectedGateway('couple');
    setActiveTabMode('couple');
    setCoupleModeType('simulator');
    setIsEntered(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 기능별 랜딩 페이지 CTA(?feature=)로 들어온 경우: 해당 기능을 바로 연다 (최초 진입 시 1회)
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const feature = new URLSearchParams(window.location.search).get('feature');
        if (feature === 'tarot') {
          handleOpenTarotModal();
        } else if (feature === 'court') {
          handleOpenChemiModal();
        } else if (feature === 'difficulty') {
          setIsParentMatchModalOpen(true);
        } else if (feature === 'couple') {
          handleOpenVirtualBabySimulator();
        } else if (feature === 'name') {
          setIsNameMatchModalOpen(true);
        } else if (feature === 'temperament') {
          setStep('form');
          setViewMode('form');
          handleScrollToForm();
        }
      } catch (e) {
        console.error('기능 파라미터 처리 실패', e);
      }
    }, 60);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyProfileToState = (profile: BabyProfile) => {
    setName(profile.name);
    setGender(profile.gender);
    setBirthDate(profile.birthDate);
    setBirthTime(profile.birthTime);
    setIsUnknownTime(profile.isUnknownTime);
    setDueDate(profile.dueDate);
  };

  const handleSelectChild = (profile: BabyProfile) => {
    setActiveProfileId(profile.id);
    try {
      localStorage.setItem('last_profile_id', profile.id);
    } catch (e) {
      console.error('마지막 프로필 저장 실패', e);
    }
    applyProfileToState(profile);
    runAdaptiveEngine(profile.birthDate, profile.dueDate);
    setTarotSelectedCard(null);
    setIsTarotRevealed(false);
    setIsTarotAnalyzing(false);
    setStep('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddNewChild = () => {
    setActiveProfileId(null);
    setName('');
    setGender('boy');
    setBirthDate('');
    setBirthTime('');
    setIsUnknownTime(false);
    setDueDate('');
    setErrors({});
    setTarotSelectedCard(null);
    setIsTarotRevealed(false);
    setIsTarotAnalyzing(false);
    setViewMode('form');
    setStep('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteChild = (idToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = profiles.filter((p) => p.id !== idToDelete);
    setProfiles(updated);
    localStorage.setItem('baby_profiles', JSON.stringify(updated));

    if (activeProfileId === idToDelete) {
      if (updated.length > 0) {
        handleSelectChild(updated[0]);
      } else {
        handleAddNewChild();
        setParentingDifficulty(null);
      }
    }
  };

  const handleShareResult = async () => {
    trackEvent('click_share_result', 'Viral', '육아 난이도 결과 공유');
    const shareTitle = `우리 집 육아 난이도: ${parentingDifficulty?.score || 80}점! [${parentingDifficulty?.level || '기질 분석'}]`;
    const shareDesc = `${name || '아이'}와 부모의 사주 오행 케미 및 실전 훈육 대화법을 확인해보세요 🍼`;
    const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://baby-sokpuli.vercel.app';

    if (typeof window !== 'undefined' && (window as any).Kakao && (window as any).Kakao.isInitialized()) {
      try {
        (window as any).Kakao.Share.sendDefault({
          objectType: 'feed',
          content: {
            title: shareTitle,
            description: shareDesc,
            imageUrl: 'https://baby-sokpuli.vercel.app/og-image.png',
            link: { mobileWebUrl: currentUrl, webUrl: currentUrl },
          },
        });
        fireConfetti();
        return;
      } catch (e) {
        console.error('카카오 공유 실패, 폴백 진행', e);
      }
    }

    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, text: shareDesc, url: currentUrl });
        fireConfetti();
        return;
      } catch (err) {
        console.log('공유 취소됨');
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareTitle}\n${shareDesc}\n${currentUrl}`);
      fireConfetti();
      showToast('결과 링크가 복사됐어요! 카톡 대화방이나 인스타에 붙여넣어 공유해보세요 💌');
    } catch {
      showToast('복사에 실패했어요. 주소창의 링크를 직접 공유해주세요 🙏');
    }
  };

  const handleDownloadParentMatchCard = async () => {
    if (!parentMatchCardRef.current) return;
    setIsDownloadingParentMatch(true);
    trackEvent('click_download_parent_match', 'Engagement', '육아난이도 카드 이미지 저장');

    try {
      const dataUrl = await toPng(parentMatchCardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#FFFFFF',
      });

      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      if (isIOS) {
        setIosSavedImageUrl(dataUrl);
      } else {
        const link = document.createElement('a');
        link.download = `${name || '아이'}_육아난이도_${parentingDifficulty?.grade || '진단결과'}.png`;
        link.href = dataUrl;
        link.click();
      }
      fireConfetti();
    } catch (error) {
      console.error('육아난이도 이미지 저장 실패:', error);
      alert('이미지 저장 중 일시적인 오류가 발생했습니다. 화면을 직접 캡처해 공유해 보세요!');
    } finally {
      setIsDownloadingParentMatch(false);
    }
  };

  const runAdaptiveEngine = (bDateStr: string, dDateStr: string) => {
    const today = new Date();
    const cleanDigits = bDateStr.replace(/[^0-9]/g, '');
    const birthYear = parseInt(cleanDigits.slice(0, 4), 10) || 2024;
    const birthMonth = parseInt(cleanDigits.slice(4, 6), 10) || 1;
    const birthDay = parseInt(cleanDigits.slice(6, 8), 10) || 1;
    const birth = new Date(birthYear, birthMonth - 1, birthDay);

    const cheonganIdx = Math.abs((birthYear - 4) % 10);
    const jijiIdx = Math.abs((birthYear - 4) % 12);
    const cheongan = CHEONGAN_LIST[cheonganIdx];
    const jiji = JIJI_LIST[jijiIdx];

    setColorLabel(cheongan.colorLabel);
    setCharacterCheonganIndex(cheonganIdx);
    setCharacterAnimalIndex(jijiIdx);
    setJijiHanja(jiji.hanja);
    setAnimalName(jiji.animal);
    setAnimalModifier(jiji.modifier);
    setCharacterTitle(`${cheongan.colorLabel}${jiji.animal} [${cheongan.name[0]}${jiji.hanja}]`);
    setElementTag({ name: `${cheongan.element}`, color: cheongan.mainColor });

    const diffTime = Math.max(0, today.getTime() - birth.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = Math.floor(totalDays / 30.4375);
    const manYears = Math.max(0, today.getFullYear() - birthYear - (today < new Date(today.getFullYear(), birthMonth - 1, birthDay) ? 1 : 0));

    const digitSum = cleanDigits.split('').reduce((acc, curr) => acc + parseInt(curr, 10), 0);
    const scoreCuriosity = 60 + ((digitSum * 7) % 39);
    const scoreEnergy = 60 + ((digitSum * 11) % 39);
    const scoreFussy = 30 + ((digitSum * 13) % 55);
    setScores({ curiosity: scoreCuriosity, energy: scoreEnergy, fussy: scoreFussy });

    if (scoreCuriosity >= 85) {
      setOneLineSummary('호기심 대폭발! 눈앞의 모든 걸 만져보고 두드려봐야 직성이 풀려요');
    } else if (scoreEnergy >= 85) {
      setOneLineSummary('지치지 않는 에너자이저! 온몸으로 신나게 놀아야 꿀잠을 자요');
    } else if (scoreCuriosity < 70 && scoreEnergy < 70) {
      setOneLineSummary('다정하고 신중한 관찰자! 세상의 변화를 눈으로 조용히 음미해요');
    } else {
      setOneLineSummary('재미있는 호기심과 활력이 조화로운 우리 집 비타민이에요');
    }

    let calculatedAgeMode: 'infant' | 'toddler' | 'child' = 'infant';
    let locationStr = '온화한 평화 구간';

    if (totalMonths <= 20) {
      calculatedAgeMode = 'infant';
      setAgeMode('infant');
      setCalculatedAgeText(`생후 ${totalWeeks}주차 (${totalMonths}개월)`);

      const effectiveDue = dDateStr && dDateStr.length >= 10
        ? new Date(dDateStr.replace(/\./g, '-'))
        : birth;
      const dueDays = Math.max(0, Math.floor((today.getTime() - effectiveDue.getTime()) / (1000 * 60 * 60 * 24)));
      const currentLeap = WONDER_LEAPS.find((l) => dueDays >= l.startDay && dueDays <= l.endDay);

      if (currentLeap) {
        const daysRemaining = Math.max(1, currentLeap.endDay - dueDays);
        locationStr = `도약기 폭풍 구간 (${currentLeap.name})`;
        setSolutionData({
          badge: `생후 ${totalWeeks}주 · ${currentLeap.name}`,
          mainTitle: `${currentLeap.name} 구간이에요`,
          signals: currentLeap.signals,
          actions: currentLeap.actions,
          parentTip: currentLeap.parentTip,
          highlightTag: '도약기 폭풍 탈출',
          highlightTitle: `원더윅스 탈출까지 약 D-${daysRemaining}일 남았어요`,
          isLeap: true,
          isWonderLeap: true,
          dDayText: `원더윅스 탈출까지 약 D-${daysRemaining}일`,
          currentLocation: locationStr,
        });
      } else {
        const nextLeap = WONDER_LEAPS.find((l) => l.startDay > dueDays);
        const dDayNext = nextLeap ? nextLeap.startDay - dueDays : 0;
        locationStr = '온화한 평화 구간 (성장 안정기)';
        setSolutionData({
          badge: `생후 ${totalWeeks}주 · 온화기 (평화 구간)`,
          mainTitle: `방긋방긋 웃는 평화로운 온화기예요`,
          signals: [
            '방긋방긋 미소를 자주 짓고 눈을 잘 맞춤',
            '낮잠과 밤잠에 비교적 수월하게 입면함',
            '새롭게 배운 동작(손발 움직임, 옹알이)을 복습하며 놀아요',
          ],
          actions: [
            '아기가 배운 세상을 머릿속에 정리하도록 편안히 쉬게 해주기',
            '엄마 아빠도 밀린 낮잠과 휴식으로 부모 배터리 충전하기',
            '가벼운 산책과 따뜻한 스킨십으로 정서적 유대감 다지기',
          ],
          parentTip: '달콤한 평화 구간입니다. 다가올 다음 도약기를 위해 부모님도 체력을 비축하세요!',
          highlightTag: '평화로운 성장 구간',
          highlightTitle: nextLeap ? `다음 도약기까지 약 ${dDayNext}일 남았어요` : '원더윅스 도약을 멋지게 달리는 중!',
          isLeap: false,
          isWonderLeap: false,
          dDayText: nextLeap ? `다음 도약기까지 약 D-${dDayNext}일` : '원더윅스 안정기',
          currentLocation: locationStr,
        });
      }

    } else if (totalMonths <= 84) {
      calculatedAgeMode = 'toddler';
      setAgeMode('toddler');
      setCalculatedAgeText(`만 ${manYears}세 (${totalMonths}개월)`);
      locationStr = '만 2세 자아 뿜뿜기 (원더윅스 안정기)';

      setSolutionData({
        badge: `만 ${manYears}세 · 자아 뿜뿜기`,
        mainTitle: `자아 뿜뿜기 (원더윅스 안정기)`,
        signals: [
          '자기 뜻대로 안 되면 "싫어!"를 외치며 고집부림',
          '원하는 옷이나 신발만 신겠다고 실랑이함',
          '에너지가 넘쳐 온 집안을 뛰어다니며 활동량 폭발',
        ],
        actions: [
          '"안 돼!" 대신 "신발 먼저 신을까, 모자 먼저 쓸까?" 2가지 선택권 주기',
          '낮 동안 바깥놀이나 신체 놀이로 땀을 흘려 에너지 발산 돕기',
          '떼쓸 때 "속상했구나" 감정을 먼저 읽어주고 3초 침묵하기',
        ],
        parentTip: '떼쓰기는 못된 버릇이 아니라 자아가 건강하게 자라는 기특한 신호입니다!',
        highlightTag: '소소한 육아 꿀팁',
        highlightTitle: `${jiji.animal}띠 공략법: "안 돼!" 대신 재미있는 선택지 선물하기`,
        isLeap: false,
        isWonderLeap: false,
        dDayText: '원더윅스 졸업 완료 (성장 안정기)',
        currentLocation: locationStr,
      });

    } else {
      calculatedAgeMode = 'child';
      setAgeMode('child');
      const schoolGrade = Math.min(6, Math.max(1, manYears - 6));
      setCalculatedAgeText(`만 ${manYears}세 (초등 ${schoolGrade}학년)`);
      locationStr = '초등 탐구기 (아동기 성장 단계)';

      setSolutionData({
        badge: `초등 ${schoolGrade}학년 · 나만의 탐구기`,
        mainTitle: `스스로 탐구하는 스타일 & 마음 케어`,
        signals: [
          '친구 관계에 민감해지며 비밀이나 자기만의 영역이 생김',
          '숙제나 할 일을 두고 부모와 주도권 밀당 발생',
          '관심 있는 분야에는 놀라운 집중력을 보임',
        ],
        actions: [
          '일방적인 지시 대신 "네 생각은 어때?"라고 의견 물어봐 주기',
          '학교에서 돌아왔을 때 오늘 있었던 일 1줄 경청해 주기',
          '스스로 약속을 지켰을 때 아낌없이 엄지척으로 격려해 주기',
        ],
        parentTip: '아이가 부모의 든든한 조언자를 필요로 하는 시기입니다. 묵묵한 믿음을 보여주세요.',
        highlightTag: '마음 톡톡 코칭',
        highlightTitle: `${jiji.animal}띠 집중법: 스스로 해냈을 때 아낌없이 엄지척 해주기`,
        isLeap: false,
        isWonderLeap: false,
        dDayText: '아동기 성장 단계',
        currentLocation: locationStr,
      });
    }

    const elementKey = cheongan.elementKey;
    const selectedPotion = POTION_MATRIX[elementKey][calculatedAgeMode];
    const linkedPotionUrl = BABY_POTION_LINKS[elementKey][calculatedAgeMode] || SERVICE_LINKS.coupangDefault;

    setPotionData({
      ...selectedPotion,
      color: cheongan.mainColor,
      link: linkedPotionUrl,
    });

    const weather = calculateTodayBabyWeather(elementKey);
    setBabyWeather(weather);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { name?: string; birthDate?: string; dueDate?: string } = {};

    if (!name.trim()) newErrors.name = '아이 이름(태명)을 입력해주세요!';

    const birthCheck = validateDateString(birthDate, {
      allowFuture: false,
      minYear: 2000,
      maxYear: new Date().getFullYear(),
      fieldName: '생년월일',
    });
    if (!birthCheck.isValid) newErrors.birthDate = birthCheck.errorMsg;

    if (dueDate.trim().length > 0) {
      const dueCheck = validateDateString(dueDate, {
        allowFuture: true,
        minYear: 2000,
        maxYear: new Date().getFullYear() + 1,
        fieldName: '출산 예정일',
      });
      if (!dueCheck.isValid) newErrors.dueDate = dueCheck.errorMsg;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    runAdaptiveEngine(birthDate, dueDate);

    const newProfile: BabyProfile = {
      id: activeProfileId || `baby_${Date.now()}`,
      name,
      gender,
      birthDate,
      birthTime: isUnknownTime ? '모름' : birthTime,
      isUnknownTime,
      dueDate,
    };

    let updatedProfiles = [...profiles];
    const existingIndex = updatedProfiles.findIndex((p) => p.id === newProfile.id);
    if (existingIndex >= 0) {
      updatedProfiles[existingIndex] = newProfile;
    } else {
      updatedProfiles.push(newProfile);
    }

    setProfiles(updatedProfiles);
    setActiveProfileId(newProfile.id);
    localStorage.setItem('baby_profiles', JSON.stringify(updatedProfiles));
    try {
      localStorage.setItem('last_profile_id', newProfile.id);
    } catch (e) {
      console.error('마지막 프로필 저장 실패', e);
    }

    setStep('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseChemiModal = () => {
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    if (countdownTimeoutRef.current) clearInterval(countdownTimeoutRef.current);
    if (clashAnimationRef.current) clearInterval(clashAnimationRef.current);
    setIsChemiModalOpen(false);
    setCountdown(null);
    setIsAnalyzingChemi(false);
  };

  const handleCalculateChemi = (e: React.FormEvent) => {
    e.preventDefault();

    if (isAlreadyJudgedToday) {
      alert('오행 법정의 판결은 하루에 단 한 번만 선고돼요. 내일 자정 새로운 기운으로 리셋돼요!');
      return;
    }

    const newChemiErrors: { mom?: string; dad?: string } = {};

    const momCheck = validateDateString(momBirth, {
      allowFuture: false,
      minYear: 1950,
      maxYear: new Date().getFullYear(),
      fieldName: '엄마 생년월일',
    });
    if (!momCheck.isValid) newChemiErrors.mom = momCheck.errorMsg;

    const dadCheck = validateDateString(dadBirth, {
      allowFuture: false,
      minYear: 1950,
      maxYear: new Date().getFullYear(),
      fieldName: '아빠 생년월일',
    });
    if (!dadCheck.isValid) newChemiErrors.dad = dadCheck.errorMsg;

    if (Object.keys(newChemiErrors).length > 0) {
      setChemiErrors(newChemiErrors);
      return;
    }

    setIsAnalyzingChemi(true);
    setCountdown(15);
    trackEvent('click_court_start', 'Engagement', '오행판결소 시작');

    clashAnimationRef.current = setInterval(() => {
      const momPower = Math.floor(Math.random() * 55) + 30;
      const dadPower = Math.floor(Math.random() * 55) + 30;
      setDynamicMomBar(momPower);
      setDynamicDadBar(dadPower);
    }, 200);

    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    countdownTimeoutRef.current = setTimeout(() => {
      if (clashAnimationRef.current) clearInterval(clashAnimationRef.current);

      const finalResult = computeDutyVerdict(momBirth, dadBirth, birthDate);

      // 애니메이션 바의 마지막 프레임이 실제 최종 점수와 일치하도록 고정
      // (랜덤 바가 승자와 어긋난 수치로 멈추면 결과가 모순되어 보임)
      setDynamicMomBar(finalResult.momScore);
      setDynamicDadBar(finalResult.dadScore);

      setChemiResult(finalResult);
      setIsAnalyzingChemi(false);
      setCountdown(null);
      setIsAlreadyJudgedToday(true);

      const todayStr = getTodayDateString();
      localStorage.setItem(`duty_verdict_${todayStr}`, JSON.stringify(finalResult));

      // 다음에 판결소를 열 때 다시 입력하지 않도록 엄마·아빠 생년월일 저장
      try {
        localStorage.setItem('duty_parents', JSON.stringify({ mom: momBirth, dad: dadBirth }));
      } catch (e) {
        console.error('판결소 입력값 저장 실패', e);
      }
    }, 1800);
  };

  const handleCalculateParentMatchModal = (e: React.FormEvent) => {
    e.preventDefault();

    if (!birthDate || birthDate.replace(/[^0-9]/g, '').length !== 8) {
      alert('우리 아이 정보를 먼저 입력하고 진행해주세요');
      setIsParentMatchModalOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const parentCheck = validateDateString(parentBirth, {
      allowFuture: false,
      minYear: 1950,
      maxYear: new Date().getFullYear(),
      fieldName: '부모 생년월일',
    });
    if (!parentCheck.isValid) {
      setParentMatchError(parentCheck.errorMsg);
      return;
    }

    setIsAnalyzingParentMatch(true);
    setParentMatchCountdown(15);

    parentMatchIntervalRef.current = setInterval(() => {
      setParentMatchCountdown((prev) => {
        if (prev === null || prev <= 1) {
          if (parentMatchIntervalRef.current) clearInterval(parentMatchIntervalRef.current);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    parentMatchTimeoutRef.current = setTimeout(() => {
      const result = calculate5StepDifficulty(birthDate, parentBirth);
      setParentingDifficulty(result);
      setIsAnalyzingParentMatch(false);
      setParentMatchCountdown(null);
    }, 1800);
  };

  // 아기 이름 궁합: 세 이름이 모두 있어야 계산 (짧은 연출 후 결과 표시 — 흐름을 끊지 않게 1.4초)
  const handleCalculateNameMatch = (e: React.FormEvent) => {
    e.preventDefault();
    const mom = nameMatchMom.trim();
    const dad = nameMatchDad.trim();
    const baby = nameMatchBaby.trim();
    if (mom.length < 1 || dad.length < 1 || baby.length < 1) {
      setNameMatchError('엄마·아빠 이름과 아기 이름 후보를 모두 입력해주세요.');
      return;
    }
    setNameMatchError(undefined);
    setIsAnalyzingNameMatch(true);
    trackEvent('click_name_match_start', 'Engagement', '아기 이름 궁합 시작');

    nameMatchTimeoutRef.current = setTimeout(() => {
      setNameMatchResult(computeNameMatch(mom, dad, baby));
      setIsAnalyzingNameMatch(false);
    }, 1400);
  };

  const handleCloseNameMatchModal = () => {
    if (nameMatchTimeoutRef.current) clearTimeout(nameMatchTimeoutRef.current);
    setIsNameMatchModalOpen(false);
    setIsAnalyzingNameMatch(false);
  };

  const handleDownloadNameMatchCard = async () => {
    if (!nameMatchCardRef.current || !nameMatchResult) return;
    setIsDownloadingNameMatch(true);
    trackEvent('click_download_name_match', 'Engagement', '이름 궁합 결과 이미지 저장');

    try {
      const dataUrl = await toPng(nameMatchCardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#FFFFFF',
      });

      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      if (isIOS) {
        setIosSavedImageUrl(dataUrl);
        showToast('이미지가 준비됐어요! 이미지를 길게 눌러 저장해주세요 📸');
      } else {
        const link = document.createElement('a');
        link.download = `아기속풀이_이름궁합_${nameMatchBaby.trim() || '아기'}.png`;
        link.href = dataUrl;
        link.click();
      }
      fireConfetti();
    } catch (error) {
      console.error('이름 궁합 이미지 저장 실패:', error);
      showToast('이미지 저장 중 오류가 발생했어요. 화면을 직접 캡처해 공유해 보세요!');
    } finally {
      setIsDownloadingNameMatch(false);
    }
  };

  const handleCopyAccount = async () => {
    try {
      await navigator.clipboard.writeText(`${DONATION_CONFIG.bankName} ${DONATION_CONFIG.accountNumber}`);
      setCopyFeedback(true);
      trackEvent('click_copy_account', 'Monetization', '후원 계좌 복사');
      setTimeout(() => setCopyFeedback(false), 2500);
    } catch (err) {
      alert(`${DONATION_CONFIG.bankName} ${DONATION_CONFIG.accountNumber} (${DONATION_CONFIG.holderName}) 계좌를 복사해 주세요!`);
    }
  };

  const handleDownloadCard = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    trackEvent('click_download_card', 'Engagement', '기질카드 이미지 저장');

    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: '#FFFFFF',
      });

      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      if (isIOS) {
        setIosSavedImageUrl(dataUrl);
      } else {
        const link = document.createElement('a');
        link.download = `${name || '아이'}_기질포토카드_baby-sokpuli.png`;
        link.href = dataUrl;
        link.click();
      }
      fireConfetti();
    } catch (error) {
      console.error('이미지 저장 실패:', error);
      alert('이미지 저장 중 일시적인 오류가 발생했습니다. 화면을 직접 캡처해 공유해 보세요!');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F4F6F8] flex items-center justify-center p-4">
        <div className="text-center font-bold text-slate-500 text-sm tracking-widest animate-pulse">
          사주 기질 도감 여는 중... 🍼
        </div>
      </div>
    );
  }

  // 홈의 "지난 결과 이어보기" 카드용: 마지막으로 본 아이 + 도약 상태
  const lastProfile =
    profiles.find((p) => p.id === activeProfileId) ?? profiles[profiles.length - 1];
  const lastLeapStatus = lastProfile ? getLeapStatus(lastProfile.birthDate, lastProfile.dueDate) : null;
  // 배경 십이지 드리프트 개인화: 저장된 아이의 띠 동물을 살짝 강조한다 (기질 도감과 같은 간지 계산)
  const lastProfileBirthYear = lastProfile
    ? parseInt(lastProfile.birthDate.replace(/[^0-9]/g, '').slice(0, 4), 10)
    : NaN;
  const lastProfileZodiacIndex = Number.isNaN(lastProfileBirthYear)
    ? null
    : Math.abs((lastProfileBirthYear - 4) % 12);

  return (
    <main className={`min-h-screen bg-[#F8FAFC] app-bg flex justify-center py-0 sm:py-10 font-sans antialiased text-slate-900 transition-colors ${isNightMode ? 'night-mode' : ''}`}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes tickerLoop {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes softFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-ticker-marquee {
          display: inline-flex;
          width: max-content;
          animation: tickerLoop 24s linear infinite;
        }
        .animate-ticker-marquee:hover {
          animation-play-state: paused;
        }
        .animate-slide-up {
          animation: slideUpFade 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-soft-float {
          animation: softFloat 2.6s ease-in-out infinite;
        }
        .interactive-card {
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
          will-change: transform;
        }
        .interactive-card:hover {
          transform: translateY(-2px);
        }
        .interactive-card:active {
          transform: scale(0.985);
        }
      `}} /> 

      <div className="w-full max-w-lg bg-[#FFFFFF] app-shell min-h-screen sm:min-h-0 sm:rounded-[32px] shadow-[0_10px_30px_rgba(0,0,0,0.04)] sm:shadow-[0_20px_50px_rgba(0,0,0,0.06)] flex flex-col p-6 sm:p-10 relative border border-slate-100/80 overflow-x-hidden">

        {/* 배경 장식: 십이지 라인 드로잉 드리프트 + 첫 화면 구름 (둘 다 장식 전용, 클릭을 막지 않음) */}
        <ZodiacDriftLayer highlightIndex={lastProfileZodiacIndex} />
        {!introCloudGone && <IntroCloudLayer cleared={introCloudCleared} />}

        <div className="flex justify-end relative z-20">
          <button
            type="button"
            onClick={handleToggleNightMode}
            aria-pressed={isNightMode}
            className="px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600 shadow-2xs hover:bg-slate-200 transition-all active:scale-95"
          >
            {isNightMode ? '☀️ 낮 모드로' : '🌙 밤중 모드'}
          </button>
        </div>

        <header className="pt-1 pb-2 text-center space-y-1.5 relative">
          <div aria-hidden className="pointer-events-none absolute -top-8 -left-12 w-44 h-44 rounded-full bg-rose-200/40 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -top-4 -right-12 w-44 h-44 rounded-full bg-sky-200/40 blur-3xl" />
          <svg aria-hidden viewBox="0 0 220 56" className="relative w-[210px] h-[54px] mx-auto animate-soft-float">
            <path d="M104 8a15 15 0 1 0 8 27.6A17 17 0 0 1 104 8z" fill="#FCD34D" />
            <path d="M36 14l1.8 4.6L42.5 20.4l-4.7 1.8L36 26.8l-1.8-4.6L29.5 20.4l4.7-1.8z" fill="#F9A8D4" />
            <path d="M182 10l1.5 3.9 3.9 1.5-3.9 1.5-1.5 3.9-1.5-3.9-3.9-1.5 3.9-1.5z" fill="#93C5FD" />
            <circle cx="160" cy="34" r="2.4" fill="#F9A8D4" />
            <circle cx="58" cy="38" r="2.2" fill="#93C5FD" />
            <circle cx="140" cy="12" r="1.8" fill="#FCD34D" />
            <g fill="#E2E8F0">
              <ellipse cx="34" cy="46" rx="20" ry="7" />
              <ellipse cx="52" cy="42" rx="14" ry="6" />
              <ellipse cx="182" cy="46" rx="20" ry="7" />
              <ellipse cx="164" cy="42" rx="14" ry="6" />
            </g>
          </svg>
          <h1 className="relative text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-center justify-center gap-2">
            <span>아기속풀이</span>
            <span className="text-[11px] font-extrabold tracking-wider text-rose-500 bg-rose-50 border border-rose-200/80 px-2 py-0.5 rounded-lg shadow-2xs">PRO</span>
          </h1>
          <p className="relative text-sm text-slate-600 font-medium tracking-tight break-keep text-balance">
            생년월일로 읽는 우리 아이 기질부터 설레는 가상 2세까지
          </p>
        </header>

        <div className="flex justify-center my-3 animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 text-xs font-medium text-slate-600 shadow-2xs">
            <span>💌</span>
            <span className="break-keep">{glueBannerText(visitor.message)}</span>
          </div>
        </div>

        {!isEntered && step === 'form' && viewMode === 'hub' && (
          <div className="space-y-3.5 py-2 animate-fadeIn">
            {(lastProfile || attendance) && (
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs font-black tracking-wider text-slate-500 whitespace-nowrap">🏠 오늘의 우리 집</span>
                <span className="flex-1 h-px bg-slate-200/80" />
              </div>
            )}
            {lastProfile && (
              <button
                type="button"
                onClick={() => handleSelectChild(lastProfile)}
                className="nm-resume-card w-full p-5 rounded-2xl bg-gradient-to-r from-rose-50 via-amber-50 to-sky-50 border border-rose-200/80 text-left shadow-2xs hover:border-rose-300 active:scale-[0.98] transition-all flex items-center justify-between interactive-card group"
              >
                <div className="space-y-1">
                  <span className="text-[11px] font-extrabold tracking-wider text-rose-500 uppercase block">
                    지난 결과 이어보기
                  </span>
                  <span className="text-base font-extrabold text-slate-900 tracking-tight block">
                    🍼 {lastProfile.name} 기질 도감 · {lastProfile.birthDate}
                  </span>
                  {lastLeapStatus && (
                    <span className="text-sm text-slate-600 font-medium leading-relaxed block">
                      {lastLeapStatus.kind === 'in' ? (
                        <>
                          🌪️ 지금 도약 중이에요 · {lastLeapStatus.name} (탈출까지{' '}
                          <span className="keep-line">D-{lastLeapStatus.daysLeft}</span>)
                        </>
                      ) : lastLeapStatus.kind === 'next' ? (
                        <>
                          다음 도약까지 <span className="keep-line">D-{lastLeapStatus.dDay}</span> ·{' '}
                          {lastLeapStatus.name}
                        </>
                      ) : (
                        glueBannerText('원더윅스 졸업 완료 · 성장 안정기예요 🎉')
                      )}
                    </span>
                  )}
                </div>
                <span className="text-slate-400 group-hover:text-slate-700 text-lg font-bold pr-1 transition-colors">→</span>
              </button>
            )}

            {attendance && (
              <div className="w-full p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3.5 animate-fadeIn">
                <div className="w-11 h-11 rounded-full border-2 border-rose-300 bg-rose-50 text-rose-500 flex flex-col items-center justify-center shrink-0 -rotate-6 animate-stamp">
                  <span className="text-sm leading-none">🐾</span>
                  <span className="text-[8px] font-black tracking-widest mt-0.5">출석</span>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">오늘의 출석 도장</h3>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-50 text-rose-600 border border-rose-100 whitespace-nowrap">
                      연속 {attendance.streak}일째
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    {attendance.streak > 1
                      ? '오늘도 와줬네요! 출석 도장이 쾅 찍혔어요.'
                      : '오늘의 출석 도장이 쾅 찍혔어요. 내일도 오면 연속 출석이 이어져요.'}
                  </p>
                  <div className="space-y-1 pt-0.5">
                    <div className="flex items-center gap-1.5">
                      {attendance.week.map((d, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                              d.attended ? 'bg-rose-400 text-white' : 'bg-slate-100 text-slate-300'
                            } ${d.isToday ? 'ring-2 ring-rose-300 ring-offset-1' : ''}`}
                          >
                            {d.attended ? '✓' : ''}
                          </span>
                          <span className={`text-[9px] font-bold ${d.isToday ? 'text-rose-500' : 'text-slate-400'}`}>
                            {d.label}
                          </span>
                        </div>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 block">
                      지금까지 총 {attendance.total}일 출석했어요
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 그룹 1: 우리 아이 — 기질·성장 (등록된 아이 바로가기는 이 그룹 안에서) */}
            <section className="space-y-3">
              <HubGroupHeader icon="🍼" title="우리 아이" hint="기질과 성장" />
              {profiles.length > 0 && (
                <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="text-xs font-bold text-slate-400">등록된 아이 도감 바로가기</div>
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                    {profiles.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectChild(p)}
                        className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200/80 text-xs font-bold text-slate-800 shadow-2xs hover:border-slate-400 flex items-center gap-1.5 shrink-0 transition-all"
                      >
                        <span>🍼</span>
                        <span>{p.name}</span>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddNewChild}
                      className="px-3.5 py-2.5 rounded-xl border border-dashed border-slate-300 text-xs font-bold text-slate-500 hover:text-slate-900 shrink-0 transition-all"
                    >
                      + 아이 추가
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3 stagger-in">
                <button
                  type="button"
                  onClick={() => {
                    trackEvent('click_landing_temperament', 'Engagement', '랜딩 기질분석 카드');
                    setViewMode('form');
                    handleScrollToForm();
                  }}
                  className="w-full p-5 rounded-2xl bg-white border border-slate-200/90 text-left shadow-2xs hover:border-slate-300 hover:bg-slate-50/50 active:scale-[0.98] transition-all flex items-center justify-between interactive-card group"
                >
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 tracking-tight group-hover:text-slate-950">우리 아이 기질 도감 & 원더윅스</h3>
                    <p className="text-sm text-slate-600 mt-1.5 font-medium leading-relaxed">사주 오행 기질 분석 및 10대 도약기 솔루션</p>
                  </div>
                  <span className="text-slate-400 group-hover:text-slate-700 text-lg font-bold pr-1 transition-colors">→</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    trackEvent('click_open_parent_match', 'Engagement', '부모-자녀 기질 비교 진단 모달 오픈');
                    setIsParentMatchModalOpen(true);
                  }}
                  className="w-full p-5 rounded-2xl bg-white border border-slate-200/90 text-left shadow-2xs hover:border-slate-300 hover:bg-slate-50/50 active:scale-[0.98] transition-all flex items-center justify-between interactive-card group"
                >
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 tracking-tight group-hover:text-slate-950">부모-자녀 육아 난이도 진단</h3>
                    <p className="text-sm text-slate-600 mt-1.5 font-medium leading-relaxed">아이와 나의 오행 상극 분석과 1~5단계 양육법</p>
                  </div>
                  <span className="text-slate-400 group-hover:text-slate-700 text-lg font-bold pr-1 transition-colors">→</span>
                </button>
              </div>
            </section>

            {/* 그룹 2: 커플 · 예비부모 */}
            <section className="space-y-3">
              <HubGroupHeader icon="💕" title="커플 · 예비부모" hint="둘이서, 그리고 곧 만날 아기" />
              <div className="space-y-3 stagger-in">
                <button
                  type="button"
                  onClick={() => {
                    trackEvent('click_landing_virtual_baby', 'Engagement', '랜딩 가상 2세 카드');
                    handleOpenVirtualBabySimulator();
                  }}
                  className="w-full p-5 rounded-2xl bg-white border border-slate-200/90 text-left shadow-2xs hover:border-slate-300 hover:bg-slate-50/50 active:scale-[0.98] transition-all flex items-center justify-between interactive-card group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-slate-900 tracking-tight group-hover:text-slate-950">설레는 커플 가상 2세 시뮬레이터</h3>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-50 text-rose-600 border border-rose-100">HOT</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1.5 font-medium leading-relaxed">엄마·아빠 사주 조합으로 미리 보는 2세 성향</p>
                  </div>
                  <span className="text-slate-400 group-hover:text-slate-700 text-lg font-bold pr-1 transition-colors">→</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    trackEvent('click_open_name_match', 'Engagement', '아기 이름 궁합 모달 오픈');
                    setIsNameMatchModalOpen(true);
                  }}
                  className="w-full p-5 rounded-2xl bg-white border border-slate-200/90 text-left shadow-2xs hover:border-slate-300 hover:bg-slate-50/50 active:scale-[0.98] transition-all flex items-center justify-between interactive-card group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-slate-900 tracking-tight group-hover:text-slate-950">아기 이름 궁합</h3>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-indigo-50 text-indigo-600 border border-indigo-100">NEW</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1.5 font-medium leading-relaxed">엄마·아빠가 지은 이름, 우리 아기와 얼마나 찰떡일까요?</p>
                  </div>
                  <span className="text-slate-400 group-hover:text-slate-700 text-lg font-bold pr-1 transition-colors">→</span>
                </button>
              </div>
            </section>

            {/* 그룹 3: 오늘의 한 컷 — 매일 자정에 새로워지는 가벼운 재미 */}
            <section className="space-y-3">
              <HubGroupHeader icon="🌙" title="오늘의 한 컷" hint="매일 자정에 새로워져요" />
              <div className="space-y-3 stagger-in">
                <button
                  type="button"
                  onClick={() => {
                    trackEvent('click_open_tarot', 'Engagement', '메인 오늘의 육아 타로 배너 클릭');
                    handleOpenTarotModal();
                  }}
                  className="w-full p-5 rounded-2xl bg-white border border-slate-200/90 text-left shadow-2xs hover:border-slate-300 hover:bg-slate-50/50 active:scale-[0.98] transition-all flex items-center justify-between interactive-card group"
                >
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 tracking-tight group-hover:text-slate-950">오늘의 아기 속마음 타로</h3>
                    <p className="text-sm text-slate-600 mt-1.5 font-medium leading-relaxed">낮 놀이부터 밤 통잠까지 · 아기 속마음 21종</p>
                  </div>
                  <span className="text-slate-400 group-hover:text-slate-700 text-lg font-bold pr-1 transition-colors">→</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    trackEvent('click_open_court', 'Engagement', '오행판결소 모달 오픈');
                    handleOpenChemiModal();
                  }}
                  className="w-full p-5 rounded-2xl bg-white border border-slate-200/90 text-left shadow-2xs hover:border-slate-300 hover:bg-slate-50/50 active:scale-[0.98] transition-all flex items-center justify-between interactive-card group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-slate-900 tracking-tight group-hover:text-slate-950">오늘 밤 육아 당번 판결소</h3>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-100 text-slate-600 border border-slate-200/80">오늘 밤</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1.5 font-medium leading-relaxed">엄마 vs 아빠 매일 자정 바뀌는 당번 선고</p>
                  </div>
                  <span className="text-slate-400 group-hover:text-slate-700 text-lg font-bold pr-1 transition-colors">→</span>
                </button>
              </div>
            </section>
          </div>
        )}

        {isEntered && (
          <div className="flex justify-between items-center bg-slate-50/80 px-4 py-3 rounded-2xl border border-slate-200/80 shadow-2xs mb-4 animate-fadeIn">
            <button
              type="button"
              onClick={() => {
                if (coupleModeType) {
                  setCoupleModeType(null);
                  setCoupleResult(null);
                } else {
                  setIsEntered(false);
                  setStep('form');
                  setViewMode('hub');
                }
              }}
              className="text-xs sm:text-sm font-extrabold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
            >
              <span>←</span> {coupleModeType ? '커플 메뉴로' : '전체 메뉴'}
            </button>
            <span className="text-xs font-extrabold text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1 rounded-lg">
              {coupleModeType === 'simulator'
                ? '🧬 가상 2세 시뮬레이터'
                : coupleModeType === 'daily'
                ? '👑 커플 특권 판결소'
                : '💍 커플 도감'}
            </span>
          </div>
        )}

        {!(isEntered && activeTabMode === 'couple') && (
          <div className="space-y-6">
            {step === 'form' && viewMode === 'form' && (
              <div ref={formSectionRef} id="baby-birth-form" className="space-y-4 animate-slide-up">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('hub');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 py-1"
                  >
                    <span>←</span> 전체 메뉴로 돌아가기
                  </button>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-800">아이 정보 입력</span>
                </div>

                <div className="mb-4 bg-slate-900 text-white p-5 rounded-2xl shadow-sm relative overflow-hidden flex items-center justify-between">
                  <div className="space-y-1.5 relative z-10 break-keep">
                    <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-widest block">
                      TODAY&apos;S ELEMENT VIBE
                    </span>
                    <h2 className="text-base sm:text-lg font-black">{todayGuide.title}</h2>
                    <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed break-keep">
                      {todayGuide.desc}
                    </p>
                  </div>
                  <div className="text-3xl sm:text-4xl relative z-10 pl-3 flex-shrink-0">✨</div>
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-4 flex-1 flex flex-col justify-between pt-1">
                  <div className="space-y-3.5">
                    <div className="bg-slate-50/80 p-4.5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
                      <label className="block text-xs sm:text-sm font-bold text-slate-800 break-keep">
                        아이 이름 또는 태명 <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="예: 튼튼이, 김도윤"
                        value={name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        className={`w-full px-4 py-3 bg-white rounded-xl border text-sm sm:text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all ${
                          errors.name ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200 focus:border-slate-800'
                        }`}
                      />
                      {errors.name && (
                        <p className="text-xs font-semibold text-rose-600 mt-1 break-keep">⚠️ {errors.name}</p>
                      )}
                    </div>

                    <div className="bg-slate-50/80 p-4.5 rounded-2xl border border-slate-200/80 space-y-2">
                      <label className="block text-xs sm:text-sm font-bold text-slate-800 break-keep">
                        성별 <span className="text-rose-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setGender('boy')}
                          className={`py-3 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                            gender === 'boy'
                              ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          왕자님
                        </button>
                        <button
                          type="button"
                          onClick={() => setGender('girl')}
                          className={`py-3 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                            gender === 'girl'
                              ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          공주님
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-50/80 p-4.5 rounded-2xl border border-slate-200/80 space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs sm:text-sm font-bold text-slate-800 break-keep">
                          태어난 날짜 <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-[11px] font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                          숫자 8자리
                        </span>
                      </div>
                      <input
                        ref={birthDateInputRef}
                        type="text"
                        inputMode="numeric"
                        placeholder="예: 2024.05.10"
                        value={birthDate}
                        onChange={(e) => handleDateChange(e.target.value, setBirthDate, 'birthDate')}
                        className={`w-full px-4 py-3 bg-white rounded-xl border text-sm sm:text-base font-semibold tracking-wider text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all ${
                          errors.birthDate ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200 focus:border-slate-800'
                        }`}
                      />
                      {errors.birthDate && (
                        <p className="text-xs font-semibold text-rose-600 mt-1 break-keep">⚠️ {errors.birthDate}</p>
                      )}
                    </div>

                    <div className="bg-slate-50/80 p-4.5 rounded-2xl border border-slate-200/80 space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs sm:text-sm font-bold text-slate-800 break-keep">태어난 시간 (선택)</label>
                        <label className="flex items-center space-x-2 text-xs font-semibold text-slate-500 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isUnknownTime}
                            onChange={(e) => setIsUnknownTime(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-0"
                          />
                          <span>시간 모름</span>
                        </label>
                      </div>
                      <input
                        type="time"
                        value={birthTime}
                        disabled={isUnknownTime}
                        onChange={(e) => setBirthTime(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                          isUnknownTime ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' : 'bg-white text-slate-900 border-slate-200'
                        }`}
                      />
                    </div>

                    <div className="bg-slate-50/80 p-4.5 rounded-2xl border border-slate-200/80 space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs sm:text-sm font-bold text-slate-800 break-keep">출산 당시 예정일 (선택)</label>
                        <span className="text-[11px] font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                          도약기 체크용
                        </span>
                      </div>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="예: 2024.05.20"
                        value={dueDate}
                        onChange={(e) => handleDateChange(e.target.value, setDueDate, 'dueDate')}
                        className={`w-full px-4 py-3 bg-white rounded-xl border text-sm sm:text-base font-semibold tracking-wider text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all ${
                          errors.dueDate ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200 focus:border-slate-800'
                        }`}
                      />
                      <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed pt-1">
                        ※ 원더윅스는 출생일 대신 <b>출산 예정일</b>을 기준으로 계산해요. (모르시면 비워두셔도 돼요)
                      </p>
                      {errors.dueDate && (
                        <p className="text-xs font-semibold text-rose-600 mt-1 break-keep">⚠️ {errors.dueDate}</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 pb-1">
                    <button
                      type="submit"
                      onClick={() => trackEvent('click_submit_form', 'Engagement', '기질카드 생성하기')}
                      className="btn-jelly w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm shadow-sm active:scale-[0.98] transition-all flex items-center justify-center space-x-2 break-keep"
                    >
                      <span>✨ 우리 아이 기질카드 뽑아보기</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 'result' && (
              <div className="space-y-4 pb-4 pt-1 animate-slide-up">
                
                <div className="space-y-2.5 pb-2 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setStep('form');
                        setViewMode('hub');
                        setIsEntered(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 py-1"
                    >
                      <span>←</span> 전체 메뉴
                    </button>
                    <button
                      type="button"
                      onClick={handleAddNewChild}
                      className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <span>+</span> 다른 아이 추가
                    </button>
                  </div>

                  {profiles.length > 0 && (
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                      <span className="text-xs font-bold text-slate-400 whitespace-nowrap mr-1">
                        등록된 아이:
                      </span>
                      {profiles.map((p) => {
                        const isActive = activeProfileId === p.id;
                        return (
                          <div
                            key={p.id}
                            onClick={() => handleSelectChild(p)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-all shrink-0 ${
                              isActive
                                ? 'bg-slate-900 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            <span className="break-keep">{p.name}</span>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteChild(p.id, e)}
                              className="text-[11px] opacity-60 hover:opacity-100 ml-1"
                              aria-label={`${p.name} 삭제`}
                            >
                              ✕
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setIsCardModalOpen(true)}
                  className="w-full bg-[#111827] text-white p-5 rounded-2xl shadow-sm flex items-center justify-between text-left active:scale-[0.98] transition-all group interactive-card"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-md bg-white/15 text-slate-200 whitespace-nowrap shrink-0">
                        {elementTag.name} 기질
                      </span>
                      <span className="text-base sm:text-lg font-black text-white group-hover:text-amber-300 transition-colors break-keep">
                        {name} 기질 카드 보기
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400 font-medium">🎂 {calculatedAgeText}</p>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-300 bg-white/10 px-3.5 py-2.5 rounded-xl group-hover:bg-white/20 transition-all shrink-0">
                    카드 열기 →
                  </span>
                </button>

                <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm text-slate-900 space-y-5 border border-slate-200/90">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <div className="space-y-0.5 text-left">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                        DAILY BRIEFING & ACTION
                      </span>
                      <h3 className="text-lg sm:text-xl font-black text-slate-900">
                        오늘의 성장 노트
                      </h3>
                    </div>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl">
                      ※ 매일 갱신
                    </span>
                  </div>

                  <div className="bg-slate-50/80 rounded-2xl p-4.5 sm:p-5 border border-slate-200/80 space-y-4 text-left">
                    <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5">
                      <span className="text-base font-black text-slate-900 shrink-0 break-keep">
                        원더윅스 분석
                      </span>
                      <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-3 sm:px-3.5 py-1 rounded-full border border-indigo-200 break-keep text-center whitespace-nowrap tracking-tight">
                        {solutionData.badge}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-bold">
                      <div className="bg-white border border-slate-200/80 p-3 rounded-xl shadow-2xs flex flex-col items-start justify-center gap-1.5">
                        <span className="text-slate-500">도약 폭풍 여부</span>
                        <span className={`px-2.5 py-0.5 rounded-md text-xs font-extrabold ${solutionData.isWonderLeap ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {solutionData.isWonderLeap ? '도약기 (폭풍)' : '안정기 (온화)'}
                        </span>
                      </div>
                      <div className="bg-white border border-slate-200/80 p-3 rounded-xl shadow-2xs flex flex-col items-start justify-center gap-1.5">
                        <span className="text-slate-500">남은 기간</span>
                        <span className="font-extrabold text-slate-900 keep-line">{solutionData.dDayText.replace('원더윅스 ', '')}</span>
                      </div>
                    </div>

                    <h4 className="text-base sm:text-lg font-black text-slate-900 pt-1">
                      {solutionData.mainTitle}
                    </h4>

                    <div className="p-4 bg-white rounded-2xl border border-slate-200/80 space-y-2 shadow-2xs">
                      <span className="text-xs sm:text-sm font-extrabold text-rose-600 flex items-center gap-1.5">
                        <span>👀</span> 자주 보이는 모습 (아기 신호)
                      </span>
                      <ul className="text-xs sm:text-sm text-slate-700 space-y-1.5 pl-1 font-medium">
                        {solutionData.signals.map((sig, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-slate-400">•</span>
                            <span>{sig}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-slate-200/80 space-y-2 shadow-2xs">
                      <span className="text-xs sm:text-sm font-extrabold text-indigo-600 flex items-center gap-1.5">
                        <span>💡</span> 오늘 해볼 수 있는 실전 대책
                      </span>
                      <ul className="text-xs sm:text-sm text-slate-700 space-y-1.5 pl-1 font-medium">
                        {solutionData.actions.map((act, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-slate-400">•</span>
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs sm:text-sm text-amber-900 font-semibold space-y-1.5 shadow-2xs">
                      <span className="font-black flex items-center gap-1.5 text-amber-800">
                        <span>☕</span> 부모 멘탈 안심 처방전
                      </span>
                      <p className="leading-relaxed pl-1 font-medium">
                        {solutionData.parentTip}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsAllLeapsModalOpen(true)}
                      className="w-full py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <span>🔍</span> 10대 도약기 전체 타임라인 가이드 펼쳐보기
                    </button>
                  </div>

                  <div className="bg-slate-50/80 rounded-2xl p-4.5 sm:p-5 border border-slate-200/80 space-y-3 text-left">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-black text-slate-900">
                        오늘의 육아 날씨
                      </span>
                    </div>

                    <div className="flex items-center justify-between space-x-2">
                      <div className="text-sm sm:text-base font-black text-slate-900 break-keep">
                        {babyWeather.status}
                      </div>
                      <span className="text-3xl p-1.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex-shrink-0">
                        {babyWeather.icon}
                      </span>
                    </div>

                    <p className="text-sm font-extrabold text-slate-900 leading-snug">
                      {babyWeather.tension}
                    </p>

                    <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 space-y-1 shadow-2xs">
                      <div className="text-xs font-bold text-slate-900">소소한 육아 꿀팁</div>
                      <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                        {babyWeather.tip}
                      </p>
                    </div>
                  </div>

                </div>

                <div className="space-y-3 pt-2 text-left">
                  <div className="text-xs sm:text-sm font-bold text-slate-600 px-1">함께 즐기는 패밀리 도감</div>

                  <button
                    type="button"
                    onClick={() => {
                      trackEvent('click_open_parent_match', 'Engagement', '결과 난이도 모달');
                      setIsParentMatchModalOpen(true);
                    }}
                    className="w-full p-5 rounded-2xl bg-white border border-slate-200/90 text-left shadow-2xs hover:border-slate-300 hover:bg-slate-50/50 active:scale-[0.98] transition-all flex items-center justify-between interactive-card group"
                  >
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900 tracking-tight group-hover:text-slate-950">아이와 나의 육아 난이도는 몇 점?</h4>
                      <p className="text-sm text-slate-600 mt-1.5 font-medium leading-relaxed">오행 상극 분석 및 1~5단계 양육법</p>
                    </div>
                    <span className="text-slate-400 group-hover:text-slate-700 text-lg font-bold pr-1 transition-colors">→</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      trackEvent('click_open_court', 'Engagement', '결과 당번판결');
                      handleOpenChemiModal();
                    }}
                    className="w-full p-5 rounded-2xl bg-white border border-slate-200/90 text-left shadow-2xs hover:border-slate-300 hover:bg-slate-50/50 active:scale-[0.98] transition-all flex items-center justify-between interactive-card group"
                  >
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900 tracking-tight group-hover:text-slate-950">엄마 vs 아빠 오늘의 육아 당번 뽑기</h4>
                      <p className="text-sm text-slate-600 mt-1.5 font-medium leading-relaxed">매일 자정 갱신되는 오행 판결소</p>
                    </div>
                    <span className="text-slate-400 group-hover:text-slate-700 text-lg font-bold pr-1 transition-colors">→</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      trackEvent('click_open_tarot', 'Engagement', '결과 육아타로');
                      handleOpenTarotModal();
                    }}
                    className="w-full p-5 rounded-2xl bg-white border border-slate-200/90 text-left shadow-2xs hover:border-slate-300 hover:bg-slate-50/50 active:scale-[0.98] transition-all flex items-center justify-between interactive-card group"
                  >
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900 tracking-tight group-hover:text-slate-950">오늘 아이의 기분은? 아기 속마음 타로</h4>
                      <p className="text-sm text-slate-600 mt-1.5 font-medium leading-relaxed">이유식·놀이·잠투정 속마음 21종</p>
                    </div>
                    <span className="text-slate-400 group-hover:text-slate-700 text-lg font-bold pr-1 transition-colors">→</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      trackEvent('click_landing_virtual_baby', 'Engagement', '결과 가상2세');
                      handleOpenVirtualBabySimulator();
                    }}
                    className="w-full p-5 rounded-2xl bg-white border border-slate-200/90 text-left shadow-2xs hover:border-slate-300 hover:bg-slate-50/50 active:scale-[0.98] transition-all flex items-center justify-between interactive-card group"
                  >
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900 tracking-tight group-hover:text-slate-950">우리 커플의 가상 2세도 궁금하다면?</h4>
                      <p className="text-sm text-slate-600 mt-1.5 font-medium leading-relaxed">부부 오행 조합으로 미리 보는 2세</p>
                    </div>
                    <span className="text-slate-400 group-hover:text-slate-700 text-lg font-bold pr-1 transition-colors">→</span>
                  </button>
                </div>

                <div className="pt-2 space-y-3">
                  <button
                    onClick={() => {
                      trackEvent('click_add_child', 'Engagement', '다른 아이 추가');
                      handleAddNewChild();
                    }}
                    className="w-full py-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold rounded-2xl text-xs sm:text-sm transition-all shadow-2xs break-keep flex items-center justify-center space-x-2"
                  >
                    <span>+</span>
                    <span>다른 아이 카드도 뽑아보기</span>
                  </button>

                  <button
                    onClick={() => {
                      trackEvent('click_open_lounge', 'Engagement', '패밀리 라운지 오픈');
                      setIsLoungeOpen(true);
                    }}
                    className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold rounded-2xl text-xs sm:text-sm transition-all flex items-center justify-center break-keep"
                  >
                    새로운 기능 제안 및 남매 아빠 후원하기
                  </button>
                </div>

                <div className="bg-slate-50/80 rounded-2xl p-4.5 sm:p-5 border border-slate-200/80 space-y-3 text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-black text-slate-900 break-keep">
                      우리 아이 기질 맞춤 충전 아이템
                    </span>
                  </div>

                  <div className="flex items-center space-x-3.5 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 flex-shrink-0">
                      <HealingPotionIcon potionColor={potionData.color} />
                    </div>
                    <div className="break-keep flex-1">
                      <div className="text-[10px] font-bold text-slate-400">추천 아이템</div>
                      <div className="text-sm font-black text-slate-900">{potionData.title}</div>
                      <div className="text-xs text-slate-500 font-medium">{potionData.subTitle}</div>
                    </div>
                  </div>

                  <div className="space-y-1 pt-0.5">
                    <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed break-keep bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                      우리 아이는 <b>{elementTag.name}</b> 기운을 타고나서 호기심({scores.curiosity}점)과 활동량({scores.energy}점)이 왕성해요! {potionData.guide}
                    </p>
                  </div>

                  <div className="pt-1.5 space-y-1.5">
                    <a
                      href={potionData.link || SERVICE_LINKS.coupangDefault}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent('click_coupang', 'Monetization', '성장노트 충전템 쿠팡 클릭')}
                      className="block w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm rounded-xl text-center transition-all shadow-2xs"
                    >
                      🛒 추천 보기
                    </a>
                    <p className="text-[11px] text-slate-400 font-medium text-center leading-relaxed">
                      ※ 이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {isEntered && activeTabMode === 'couple' && (
          <div className="space-y-4 animate-fadeIn">
            {!coupleModeType && (
              <div className="space-y-4 animate-fadeIn">
                <div className="text-center space-y-1.5 mb-3">
                  <h3 className="text-lg font-black text-slate-900">어떤 커플 도감을 열어볼까요?</h3>
                  <p className="text-sm text-slate-600 break-keep font-medium">매일 즐기는 데일리 콘텐츠와 설레는 미래 시뮬레이션을 골라보세요.</p>
                </div>

                <button
                  type="button"
                  onClick={() => setCoupleModeType('simulator')}
                  className="w-full p-5 rounded-2xl border border-rose-200/80 bg-white text-left shadow-2xs hover:shadow-md transition-all flex items-center justify-between group active:scale-98 interactive-card"
                >
                  <div className="space-y-1.5 pr-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black bg-rose-50 text-rose-600 border border-rose-100 inline-block">
                      설렘 가득 도감
                    </span>
                    <h4 className="text-base font-extrabold text-slate-900 tracking-tight">가상 2세 & 커플 페어링</h4>
                    <p className="text-sm text-slate-600 leading-relaxed break-keep font-medium">
                      두 사람의 60갑자 사주로 미리 보는 우리 아이 성향과 인스타 카드 저장
                    </p>
                  </div>
                  <div className="text-4xl shrink-0 group-hover:scale-110 transition-transform">🍼</div>
                </button>

                <button
                  type="button"
                  onClick={() => setCoupleModeType('daily')}
                  className="w-full p-5 rounded-2xl border border-indigo-200/80 bg-white text-left shadow-2xs hover:shadow-md transition-all flex items-center justify-between group active:scale-98 interactive-card"
                >
                  <div className="space-y-1.5 pr-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-600 border border-indigo-100 inline-block">
                      매일 자정 갱신 데일리
                    </span>
                    <h4 className="text-base font-extrabold text-slate-900 tracking-tight">오늘의 커플 특권 판결소</h4>
                    <p className="text-sm text-slate-600 leading-relaxed break-keep font-medium">
                      오늘 데이트 코스, 저녁 메뉴, 손 하나 까딱 안 할 권리를 선고받는 오행 법정
                    </p>
                  </div>
                  <div className="text-4xl shrink-0 group-hover:scale-110 transition-transform">👑</div>
                </button>
              </div>
            )}

            {coupleModeType === 'simulator' && (
              <div className="space-y-4 animate-slide-up">
                {isAnalyzingCouple ? (
                 <div className="py-12 text-center space-y-4 animate-fadeIn bg-slate-50/80 rounded-3xl p-8 border border-rose-100 shadow-md">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-rose-500 to-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-black shadow-md border-2 border-white animate-pulse">
                    🧬
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-base sm:text-lg font-black text-slate-900 break-keep">
                      두 사람의 60갑자 사주 기운과 가상 2세 유전자 대조 중...
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 break-keep">
                      두 사람의 오행 조화와 태어날 아기의 기질 성향을 정밀하게 연산하고 <span className="keep-line">있습니다 ✨</span>
                    </p>
                  </div>
                  <div className="w-48 mx-auto bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-rose-500 to-indigo-600 h-full rounded-full animate-pulse" style={{ width: '75%' }} />
                  </div>
                </div>
                ) : (
                  <>
                    <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-sm space-y-4">
                      <div className="text-center space-y-1 pb-1">
                        <h2 className="text-lg sm:text-xl font-black text-slate-900">우리 둘이 만나면 어떤 아이가 태어날까?</h2>
                        <p className="text-xs sm:text-sm text-slate-500 break-keep">
                          두 사람의 생년월일로 가상 2세의 성향과, 두 분 중 누구를 얼마나 닮을지 예측합니다.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div className="space-y-2 p-4 bg-rose-50/50 rounded-2xl border border-rose-100">
                          <span className="text-xs font-bold text-rose-700 block">👤 나</span>
                          <input
                            type="text"
                            placeholder="이름/별명 (선택)"
                            value={partner1Name}
                            onChange={(e) => setPartner1Name(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-white border border-rose-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-rose-500"
                          />
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="생년월일 8자리 (예: 1993.08.15)"
                            value={partner1Birth}
                            onChange={(e) => handleDateChange(e.target.value, setPartner1Birth, 'partner1Birth')}
                            className="w-full px-3.5 py-2.5 bg-white border border-rose-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-rose-500"
                          />
                        </div>

                        <div className="space-y-2 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                          <span className="text-xs font-bold text-indigo-700 block">👤 연인</span>
                          <input
                            type="text"
                            placeholder="이름/별명 (선택)"
                            value={partner2Name}
                            onChange={(e) => setPartner2Name(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-white border border-indigo-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-indigo-500"
                          />
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="생년월일 8자리 (예: 1995.04.22)"
                            value={partner2Birth}
                            onChange={(e) => handleDateChange(e.target.value, setPartner2Birth, 'partner2Birth')}
                            className="w-full px-3.5 py-2.5 bg-white border border-indigo-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-indigo-500"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleCalculateCouple}
                        className="nm-couple-cta btn-jelly w-full py-4 bg-gradient-to-r from-rose-400 via-pink-400 to-indigo-400 hover:from-rose-500 hover:to-indigo-500 text-white font-black text-sm rounded-2xl shadow-sm transition-all transform active:scale-98 flex items-center justify-center gap-2"
                      >
                        <span>🔮</span> 가상 2세 성향 시뮬레이션 시작하기
                      </button>
                    </div>

                    {coupleResult?.baby && (
                      <div className="space-y-4 animate-slide-up">
                        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-rose-200 shadow-sm space-y-5 text-center">
                          <span className="text-xs font-black text-rose-600 bg-rose-50 px-4 py-1.5 rounded-full inline-block border border-rose-100">
                            60갑자 커플 페어링
                          </span>

                          <div className="nm-pair-panel flex items-center justify-around py-5 bg-gradient-to-r from-rose-50/60 via-purple-50/40 to-indigo-50/60 rounded-2xl border border-slate-100">
                            <div className="space-y-1.5">
                              <div className="text-4xl sm:text-5xl">{coupleResult.p1AnimalIcon}</div>
                              <span className="text-sm sm:text-base font-black text-slate-900 block">{partner1Name || '나'}</span>
                              <span className="text-xs font-extrabold text-rose-600 block">{coupleResult.p1Animal}띠</span>
                              <span className="text-xs text-slate-500 block font-semibold">{coupleResult.p1Elem}</span>
                            </div>

                            <div className="text-3xl font-black text-rose-500 animate-pulse">❤️</div>

                            <div className="space-y-1.5">
                              <div className="text-4xl sm:text-5xl">{coupleResult.p2AnimalIcon}</div>
                              <span className="text-sm sm:text-base font-black text-slate-900 block">{partner2Name || '연인'}</span>
                              <span className="text-xs font-extrabold text-indigo-600 block">{coupleResult.p2Animal}띠</span>
                              <span className="text-xs text-slate-500 block font-semibold">{coupleResult.p2Elem}</span>
                            </div>
                          </div>

                          <div className="p-4.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-left space-y-2">
                            <span className="text-xs sm:text-sm font-extrabold text-rose-600 block">🔮 60갑자 오행 페어링 분석 이유</span>
                            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed break-keep">
                              두 분의 사주 기운인 <b>{coupleResult.p1Elem}</b>과 <b>{coupleResult.p2Elem}</b>이 만나 서로의 부족한 에너지를 유연하게 채워주며, 감정적 교감과 추진력이 잘 어우러지는 상생 궁합입니다.
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={handleDownloadCoupleCard}
                            className="btn-jelly w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 transform active:scale-98 break-keep"
                          >
                            <span>📸</span> 결과 카드 이미지 저장하기
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              shareResult(
                                `우리 커플의 가상 2세는 「${coupleResult.baby.title}」`,
                                `${partner1Name || '나'} ${coupleResult.baby.dadPercent}% · ${partner2Name || '연인'} ${coupleResult.baby.momPercent}% — 우리 커플 가상 2세도 확인해보세요 💕`,
                                '가상 2세 결과 공유'
                              )
                            }
                            className="btn-jelly w-full py-4 bg-[#FEE500] hover:bg-[#FADA0A] text-[#191919] font-black text-sm rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
                          >
                            <span>💬</span> 결과 공유하기 (카톡 / 링크)
                          </button>
                        </div>

                        <div className="nm-baby-card bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 rounded-3xl p-6 sm:p-7 border border-orange-200 shadow-sm space-y-5">
                          <div className="flex justify-between items-center flex-wrap gap-2 pb-3 border-b border-orange-200/80">
                            <span className="text-xs font-black text-orange-900">FUTURE BABY SIMULATOR</span>
                            <span className="px-3.5 py-1 bg-orange-200 text-orange-900 rounded-full text-xs font-extrabold break-keep whitespace-nowrap">
                              육아 난이도: {coupleResult.baby.difficulty}
                            </span>
                          </div>

                          <div className="text-center space-y-2.5 py-1">
                            <div className="text-4xl sm:text-5xl">{coupleResult.baby.icon}</div>
                            <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">{coupleResult.baby.title}</h3>
                            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed break-keep px-1 font-medium">
                              {coupleResult.baby.desc}
                            </p>
                          </div>

                          <div className="p-4 bg-white/90 rounded-2xl border border-orange-100 text-left space-y-1.5">
                            <span className="text-xs font-extrabold text-orange-800 block">💡 2세 성향 시뮬레이션 산출 근거</span>
                            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed break-keep">
                              두 분의 탄생 연도 오행 에너지 값과 성향 조합을 분석한 결과, 부모의 왕성한 추진력과 감각적 재능을 가장 조화롭게 이어받을 유형으로 판정되었습니다.
                            </p>
                          </div>

                          <div className="bg-white/90 p-4.5 rounded-2xl border border-orange-100 space-y-3 text-xs sm:text-sm">
                            <div className="flex justify-between font-black text-slate-800">
                              <span>{partner1Name || '나'} 성향: {coupleResult.baby.dadPercent}%</span>
                              <span>{partner2Name || '연인'} 성향: {coupleResult.baby.momPercent}%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden flex shadow-inner">
                              <div style={{ width: `${coupleResult.baby.dadPercent}%` }} className="bg-rose-500 h-full transition-all duration-700" />
                              <div style={{ width: `${coupleResult.baby.momPercent}%` }} className="bg-indigo-500 h-full transition-all duration-700" />
                            </div>
                          </div>

                          <div className="pt-2 space-y-3">
                            <div className="p-4 bg-white/90 border border-rose-200/80 rounded-2xl text-left space-y-2.5 shadow-2xs">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-extrabold text-rose-600 flex items-center gap-1.5">
                                  <span>☕</span> 커플 & 부모 힐링 라운지
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">추천 콘텐츠</span>
                              </div>
                              <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug break-keep">
                                아기속풀이를 만든 아빠의 리얼 육아 숏폼 구경 & 커플 힐링템 둘러보기
                              </p>
                              <div className="flex space-x-2.5 pt-1.5">
                                <a
                                  href={SERVICE_LINKS.youtube}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs sm:text-sm font-bold text-center transition-all shadow-xs flex items-center justify-center gap-1.5"
                                >
                                  <span>▶ 아빠의 리얼 육아 숏폼</span>
                                </a>
                                <a
                                  href={SERVICE_LINKS.parentHealing}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs sm:text-sm font-bold text-center transition-all shadow-xs flex items-center justify-center gap-1.5"
                                >
                                  <span>🛒 커플 힐링템 구경</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {coupleModeType === 'daily' && (
              <div className="space-y-4 animate-slide-up">
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-indigo-100 shadow-sm space-y-5">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <div className="space-y-0.5">
                      <span className="text-sm font-black text-slate-900">👑 오늘의 커플 특권 판결소</span>
                      <span className="text-xs font-bold text-indigo-600 block">매일 자정 갱신되는 데일리 오행 법정</span>
                    </div>
                    <span className="text-xs text-slate-400 font-semibold bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">하루 1회</span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium break-keep">
                    오늘 날짜의 오행 기운과 두 분의 사주를 대조해, 오늘 데이트 주도권과 손 하나 까딱 안 할 권리를 누릴 특권자를 판정합니다.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                      <span className="text-xs font-bold text-slate-600 block">👤 나</span>
                      <input
                        type="text"
                        placeholder="이름/별명"
                        value={partner1Name}
                        onChange={(e) => setPartner1Name(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 mb-2"
                      />
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="생년월일 8자리 (예: 1993.08.15)"
                        value={partner1Birth}
                        onChange={(e) => handleDateChange(e.target.value, setPartner1Birth, 'partner1Birth')}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900"
                      />
                    </div>

                    <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                      <span className="text-xs font-bold text-slate-600 block">👤 연인</span>
                      <input
                        type="text"
                        placeholder="이름/별명"
                        value={partner2Name}
                        onChange={(e) => setPartner2Name(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 mb-2"
                      />
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="생년월일 8자리 (예: 1995.04.22)"
                        value={partner2Birth}
                        onChange={(e) => handleDateChange(e.target.value, setPartner2Birth, 'partner2Birth')}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900"
                      />
                    </div>
                  </div>

                  {isAnalyzingDaily ? (
                    <div className="py-8 text-center space-y-3 bg-indigo-50/70 rounded-2xl border border-indigo-100 p-6 animate-pulse">
                      <div className="text-4xl animate-bounce">⚖️</div>
                      <div className="text-sm font-black text-indigo-950">
                        오행 법정에서 판결 심리 중... (탕! 탕! 탕! 🔨)
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        오늘 날짜의 우주 기운과 두 사람의 사주를 정밀 대조하고 있어요!
                      </p>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleCalculateDailyVerdict}
                      className="btn-jelly w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-2xl shadow-sm transition-all active:scale-98 flex items-center justify-center gap-2"
                    >
                      <span>👑</span> 오늘의 커플 특권 판결 받기 (데일리)
                    </button>
                  )}

                  {coupleResult?.chore && (
                    <div className="space-y-3 animate-fadeIn">
                    <div ref={coupleVerdictRef} className="holo-card relative p-6 rounded-3xl space-y-4 text-left">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                        <span className="text-xs sm:text-sm font-black text-[#6670A8] block">오행 법정 오늘의 판결 📜</span>
                        <span className="text-xs font-bold text-slate-500">케미 지수: {coupleResult.chemistryScore}점</span>
                      </div>
                      
                      <div className="space-y-1.5">
                        <span className="text-xs font-extrabold text-[#C75B6E] bg-rose-50 px-3 py-1 rounded-full border border-rose-100 inline-block">
                          👑 오늘의 특권 당첨자 (절대 권력자)
                        </span>
                        <p className="text-lg font-black text-slate-900">
                          {coupleResult.chore.winner}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-800 font-bold leading-relaxed break-keep verdict-text">
                          👉 {glueVerdictText(coupleResult.chore.benefit)}
                        </p>
                      </div>

                      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 space-y-1">
                        <span className="text-xs font-bold text-slate-500 block">🫡 오늘의 풀케어 담당: {coupleResult.chore.supporter}</span>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium break-keep verdict-text">
                          {glueVerdictText(coupleResult.chore.duty)}
                        </p>
                      </div>

                      <CaptureBrandFooter label="커플 특권 판결소" />
                      <CaptureStickers />
                    </div>

                    <div className="space-y-2.5">
                      <button
                        type="button"
                        onClick={handleDownloadCoupleVerdictCard}
                        disabled={isDownloadingCoupleVerdict}
                        className="btn-jelly w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.98]"
                      >
                        <span>{isDownloadingCoupleVerdict ? '결과 카드 생성 중...' : '📸 결과 이미지로 저장하기'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          shareResult(
                            `오늘 우리 커플의 특권자는 바로 ${coupleResult.chore.winner}!`,
                            `[아기속풀이 오늘의 커플 특권 판결 📜] 👑 오늘의 특권자: ${coupleResult.chore.winner} / 👉 혜택: ${coupleResult.chore.benefit} / 🫡 풀케어 서포터: ${coupleResult.chore.supporter} — 우리도 판결 받아보기`,
                            '커플 특권 판결 결과 공유'
                          )
                        }
                        className="btn-jelly w-full py-4 bg-[#FEE500] hover:bg-[#FADA0A] text-[#191919] font-black text-sm rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
                      >
                        <span>💬</span> 결과 공유하기 (카톡 / 링크)
                      </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {isCardModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
            <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto text-slate-900 animate-slide-up">
              
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center text-base border border-slate-200">
                    🖼️
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                    우리 아이 기질 포토 카드
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCardModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold transition-colors"
                >
                  ✕
                </button>
              </div>

              <div
                ref={cardRef}
                className="holo-card text-slate-900 rounded-3xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden space-y-5"
              >
                <div
                  className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-15 pointer-events-none"
                  style={{ backgroundColor: elementTag.color }}
                />
                <div
                  className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none"
                  style={{ backgroundColor: elementTag.color }}
                />

                <div className="w-full flex justify-between items-start relative z-10">
                  <div className="text-left space-y-0.5">
                    <span className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase block">
                      SOKPULI TEMPERAMENT CARD
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <span>{name}</span>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                        {calculatedAgeText}
                      </span>
                    </h2>
                  </div>

                  <span
                    className="text-xs font-extrabold px-3.5 py-1 rounded-full border flex items-center gap-1.5 shadow-2xs shrink-0 whitespace-nowrap"
                    style={{
                      backgroundColor: `${elementTag.color}20`,
                      borderColor: `${elementTag.color}50`,
                      color: '#0F172A',
                    }}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: elementTag.color }} />
                    <span>{elementTag.name} 기질</span>
                  </span>
                </div>

                <div className="relative z-10 my-1">
                  <BabyAnimalHybridMascot
                    cheonganIndex={characterCheonganIndex}
                    animalIndex={characterAnimalIndex}
                    colorLabel={colorLabel}
                    animalModifier={animalModifier}
                    characterTitle={characterTitle}
                  />
                </div>

                <div className="w-full bg-white border border-slate-200/80 px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 leading-relaxed break-keep text-center relative z-10">
                  &ldquo;{oneLineSummary}&rdquo;
                </div>

                <div className="w-full grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-left relative z-10">
                  <div className="bg-white p-3 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-500 block">탐색 · 호기심</span>
                    <span className="text-xl sm:text-2xl font-black font-mono text-[#6482A8] tracking-tight">
                      {scores.curiosity}<span className="text-xs font-normal text-slate-500 ml-0.5">점</span>
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-500 block">체력 · 활동량</span>
                    <span className="text-xl sm:text-2xl font-black font-mono text-[#6FA287] tracking-tight">
                      {scores.energy}<span className="text-xs font-normal text-slate-500 ml-0.5">점</span>
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-500 block">감각 · 예민도</span>
                    <span className="text-xl sm:text-2xl font-black font-mono text-[#C75B6E] tracking-tight">
                      {scores.fussy}<span className="text-xs font-normal text-slate-500 ml-0.5">점</span>
                    </span>
                  </div>
                </div>

                <div className="w-full pt-2 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500 font-mono relative z-10">
                  <span className="truncate max-w-[210px]">
                    P&lt;SOKPULI&lt;&lt;{jijiHanja}&lt;&lt;{birthDate.replace(/\./g, '')}
                  </span>
                  <span className="text-slate-500 font-bold tracking-wider">baby-sokpuli.vercel.app</span>
                </div>
              </div>

              <button
                onClick={handleDownloadCard}
                disabled={isDownloading}
                className="btn-jelly w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-sm font-black shadow-sm transition-all flex items-center justify-center space-x-2 active:scale-95"
              >
                <span>{isDownloading ? '포토 카드 생성 중...' : '📸 기질 포토 카드 이미지로 저장하기'}</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  shareResult(
                    `${name || '우리 아이'}의 기질 카드는 「${characterTitle}」`,
                    `한 줄 요약: ${oneLineSummary} — 우리 아이 기질 카드도 뽑아보세요 🍼`,
                    '기질 포토 카드 공유',
                    buildBabyShareUrl()
                  )
                }
                className="btn-jelly w-full py-4 bg-[#FEE500] hover:bg-[#FADA0A] text-[#191919] font-black text-sm rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <span>💬</span>
                <span>결과 공유하기 (카톡 / 링크)</span>
              </button>

              <div className="w-full space-y-3 bg-slate-50 rounded-2xl p-4.5 text-left border border-slate-200">
                <div className="text-xs font-black text-slate-900 pb-1.5 border-b border-slate-200">
                  상세 기질 성향 점수
                </div>
                <TemperamentStatBar
                  id="curiosity"
                  categoryTag="탐색"
                  name="호기심 레벨"
                  score={scores.curiosity}
                  fillColor="#38BDF8"
                  activeTooltip={activeTooltip}
                  onToggleTooltip={handleToggleTooltip}
                  description={{
                    meaning: '주변 사물과 환경 변화에 반응하고 새로운 감각을 탐험하려는 지적 호기심 성향이에요.',
                    levelInterpretation: `${scores.curiosity}점은 새로운 소리나 장난감에 눈을 반짝이며 적극적으로 손을 뻗는 호기심 대장 유형이에요!`,
                    careTip: '촉감 놀이책이나 사운드북, 가벼운 바깥 산책으로 다양한 자극을 주면 기분이 아주 좋아져요.',
                  }}
                />
                <TemperamentStatBar
                  id="energy"
                  categoryTag="체력"
                  name="활동 에너지"
                  score={scores.energy}
                  fillColor="#4ADE80"
                  activeTooltip={activeTooltip}
                  onToggleTooltip={handleToggleTooltip}
                  description={{
                    meaning: '신체를 움직이고 에너지를 신나게 발산하려는 기초 활력이에요.',
                    levelInterpretation: `${scores.energy}점은 지치지 않고 즐겁게 움직이며 온몸으로 놀아야 만족하는 에너자이저 성향이에요!`,
                    careTip: '낮 동안 신체 놀이나 터미타임으로 에너지를 충분히 쏟게 해주면 밤잠을 푹 자요.',
                  }}
                />
                <TemperamentStatBar
                  id="fussy"
                  categoryTag="감각"
                  name="감정 및 수면 예민도"
                  score={scores.fussy}
                  fillColor="#F43F5E"
                  activeTooltip={activeTooltip}
                  onToggleTooltip={handleToggleTooltip}
                  description={{
                    meaning: ageMode === 'infant'
                      ? '원더윅스 급성장기 도약기에 아기가 느끼는 뇌 과부하와 칭얼거림 수준이에요.'
                      : '새로운 환경이나 자극에 대한 아이의 섬세한 감각 반응 수준이에요.',
                    levelInterpretation: `${scores.fussy}점은 현재 비교적 차분하고 안정적인 정서 상태를 유지하는 편안한 구간이에요.`,
                    careTip: '갑작스러운 보챔이나 고집은 성장 과정에서 나타나는 자연스러운 신호이니 따뜻한 눈빛으로 공감해 주세요.',
                  }}
                />
              </div>

              <button
                type="button"
                onClick={() => setIsCardModalOpen(false)}
                className="btn-jelly w-full py-4 bg-slate-200 hover:bg-slate-300 text-slate-800 font-black text-sm rounded-2xl shadow-2xs transition-all"
              >
                확인 완료
              </button>
            </div>
          </div>
        )}

        <section className="mt-14 max-w-lg mx-auto px-2 mb-6">
          <div className="bg-slate-50/80 border border-slate-200/90 rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xs">
            
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-black text-slate-800 flex items-center gap-2">
                <span>📘</span> 아기속풀이 육아 백과 & FAQ
              </h3>
              <p className="text-sm text-slate-600 font-medium tracking-tight">
                아기 기질과 원더윅스, 심야 타로에 대한 모든 것
              </p>
            </div>

            <div className="space-y-3.5 pt-1 text-left">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-2xs space-y-2">
                <h4 className="text-xs sm:text-sm font-black text-slate-900 flex gap-2 leading-snug">
                  <span className="text-indigo-600 shrink-0">Q.</span>
                  <span>아기속풀이 분석은 어떤 원리로 제공되나요?</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed break-keep">
                  전통 기질 분석(사주 오행)과 소아청소년 성장 발달 주기를 바탕으로 아기 고유의 성향을 진단합니다. 타고난 기질과 도약기(원더윅스) 변화를 함께 분석하여 신뢰도 높은 육아 솔루션을 제공합니다.
                </p>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-2xs space-y-2">
                <h4 className="text-xs sm:text-sm font-black text-slate-900 flex gap-2 leading-snug">
                  <span className="text-indigo-600 shrink-0">Q.</span>
                  <span>원더윅스(도약기)란 무엇이고 어떻게 대처하나요?</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed break-keep">
                  원더윅스는 아기의 뇌와 신체가 급성장하면서 불안을 느끼는 '마의 구간'입니다. 특히 제4도약기(19주 폭풍 등)에는 잠투정과 등센서가 심해지는데, 안아주기 대신 아기띠로 진정시키거나 일정한 수면 의식을 반복하는 것이 중요합니다.
                </p>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-2xs space-y-2">
                <h4 className="text-xs sm:text-sm font-black text-slate-900 flex gap-2 leading-snug">
                  <span className="text-indigo-600 shrink-0">Q.</span>
                  <span>밤에 자주 깰 때(수면 퇴행) 꿀팁이 있나요?</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed break-keep">
                  아기가 밤중에 깰 때는 조명을 최소화하고, 눈을 맞추거나 자극을 주지 않는 '무반응 침묵 육아'가 가장 효과적입니다. 백색소음이나 따뜻한 마사지로 안정을 유도하세요.
                </p>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-2xs space-y-2">
                <h4 className="text-xs sm:text-sm font-black text-slate-900 flex gap-2 leading-snug">
                  <span className="text-indigo-600 shrink-0">Q.</span>
                  <span>심야 아기 타로는 과학적인가요?</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed break-keep">
                  부모가 아기의 행동 신호를 세심히 관찰하고 감정에 공감할 수 있도록 돕는 심리적 가이드입니다. 불안을 낮추고 오늘 밤 행동에 맞춘 맞춤형 조언을 참고용으로 활용해 보세요.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-2 justify-center">
              {['#아기기질분석', '#원더윅스계산', '#등센서원인', '#수면퇴행', '#심야타로', '#부모성향'].map((tag) => (
                <span key={tag} className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-lg">
                  {tag}
                </span>
              ))}
            </div>

          </div>
        </section>

        <footer className="mt-8 pt-6 pb-6 border-t border-slate-200 text-center space-y-3 text-xs text-slate-500">
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 text-xs text-slate-600 font-semibold pb-2">
            <Link href="/guide/wood" className="hover:text-indigo-600">목(木) 기질</Link>
            <span className="flex items-center gap-3"><span>·</span><Link href="/guide/fire" className="hover:text-indigo-600">화(火) 기질</Link></span>
            <span className="flex items-center gap-3"><span>·</span><Link href="/guide/earth" className="hover:text-indigo-600">토(土) 기질</Link></span>
            <span className="flex items-center gap-3"><span>·</span><Link href="/guide/metal" className="hover:text-indigo-600">금(金) 기질</Link></span>
            <span className="flex items-center gap-3"><span>·</span><Link href="/guide/water" className="hover:text-indigo-600">수(水) 기질</Link></span>
            <span className="flex items-center gap-3"><span>·</span><Link href="/wonder-weeks/4" className="hover:text-indigo-600">원더윅스 10대 도약기</Link></span>
            <span className="flex items-center gap-3"><span>·</span><Link href="/privacy" className="hover:text-indigo-600">개인정보처리방침</Link></span>
            <span className="flex items-center gap-3"><span>·</span><a href="mailto:hamin.save.moment@gmail.com" className="hover:text-indigo-600">문의하기</a></span>
          </div>

          <p className="leading-relaxed break-keep text-slate-400">
            아기속풀이 PRO · 영유아 기질 분석 및 커플 가상 2세 시뮬레이터<br />
            문의: <a href="mailto:hamin.save.moment@gmail.com" className="underline font-medium text-slate-600">hamin.save.moment@gmail.com</a> (인스타 @hamin_hayoon_day)
          </p>
          <p className="text-[11px] text-slate-400">
            © 2026 Baby Sokpuli. All rights reserved.
          </p>
        </footer>

        {isAllLeapsModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
            <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto text-slate-900">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block mb-0.5">
                    10 MENTAL LEAPS TIMELINE
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 break-keep">
                    원더윅스 10대 도약기 전체 가이드
                  </h3>
                </div>
                <button
                  onClick={() => setIsAllLeapsModalOpen(false)}
                  className="w-8 h-8 bg-slate-100 border border-slate-200 rounded-full text-xs font-bold text-slate-600 flex items-center justify-center hover:bg-slate-200"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3.5 text-left text-xs sm:text-sm leading-relaxed break-keep">
                <p className="text-slate-500 font-medium">
                  ※ 원더윅스는 출생일 대신 <b>출산 예정일</b> 기준 생후 주수로 계산됩니다.
                </p>

                {WONDER_LEAPS.map((leap) => (
                  <div key={leap.leapIndex} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-black text-slate-900 text-xs sm:text-sm">
                        {leap.name}
                      </span>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {Math.floor(leap.startDay / 7)}~{Math.ceil(leap.endDay / 7)}주차
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs font-medium">{leap.description}</p>
                    
                    <div className="pt-1 space-y-1 text-xs">
                      <div className="text-rose-600 font-bold">• 신호: {leap.signals[0]}</div>
                      <div className="text-indigo-600 font-bold">• 대책: {leap.actions[0]}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIsAllLeapsModalOpen(false)}
                className="w-full py-4 bg-slate-900 text-white font-bold text-sm rounded-2xl transition-all shadow-md break-keep"
              >
                닫기
              </button>
            </div>
          </div>
        )}

        {isTarotModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
            <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto text-slate-900 animate-slide-up">
              
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-base">
                    🔮
                  </span>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                      오늘의 아기 속마음 타로
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">오늘 우리 아이는 어떤 하루를 보내고 있을까요?</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCloseTarotModal}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold transition-colors"
                >
                  ✕
                </button>
              </div>

              {isTarotAnalyzing ? (
                <div className="py-12 text-center space-y-4 animate-fadeIn">
                  <div className="w-16 h-16 mx-auto bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center text-2xl font-black shadow-2xs border border-indigo-100 animate-pulse">
                    🔮
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-base font-black text-slate-900">
                      오늘 우리 아이의 주파수와 카드를 조율 중...
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      오늘 날짜의 우주 기운과 아이의 기질을 대조하고 <span className="keep-line">있어요 ✨</span>
                    </p>
                  </div>
                  <div className="w-44 mx-auto bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full animate-pulse" style={{ width: '70%' }} />
                  </div>
                </div>
              ) : !isTarotRevealed ? (
                <div className="space-y-4 text-center py-2">
                  <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100/80 text-xs sm:text-sm text-indigo-950 font-medium leading-relaxed">
                    💡 오늘 아이의 <span className="font-extrabold text-indigo-700">잠투정, 등센서, 이앓이</span>를 마음속으로 떠올린 뒤, 가장 끌리는 카드 1장을 터치하세요.
                  </div>

                  <div className="grid grid-cols-3 gap-3 py-2">
                    {[1, 2, 3].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleSelectTarotCard(num)}
                        className="nm-pick-btn group aspect-[3/4.2] bg-gradient-to-b from-white via-indigo-50/30 to-purple-50/40 rounded-2xl border-2 border-slate-200 hover:border-indigo-500 hover:shadow-md flex flex-col items-center justify-center p-3 transition-all duration-300 interactive-card relative overflow-hidden"
                      >
                        <div className="w-12 h-12 rounded-xl bg-white shadow-2xs border border-indigo-100 flex items-center justify-center text-xl mb-2.5 group-hover:scale-110 transition-transform">
                          🌙
                        </div>
                        <span className="text-xs sm:text-sm font-extrabold text-slate-700 group-hover:text-indigo-600">
                          {num}번 카드
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">선택하기</span>
                      </button>
                    ))}
                  </div>

                  <p className="text-xs text-slate-400 font-medium">
                    ※ 카드는 하루에 한 번만 뽑을 수 있고, 매일 밤 자정에 리셋됩니다.
                  </p>
                </div>
              ) : (
                tarotSelectedCard && (() => {
                  const displayKorTitle = tarotSelectedCard.korTitle || tarotSelectedCard.name?.split('(')[0]?.trim() || '통잠의 축복';
                  const displayEngSub = tarotSelectedCard.engSub || tarotSelectedCard.name?.split('(')[1]?.replace(')', '').trim() || 'The Slumber';

                  return (
                    <div className="space-y-4 text-left animate-slide-up">
                      <div
                        ref={tarotCardCaptureRef}
                        className="holo-card rounded-3xl p-6 flex flex-col items-center text-center shadow-xs space-y-4"
                      >
                        {!tarotFlipSettled ? (
                          <div className="tarot-flip w-56 h-80 shrink-0 animate-soft-float" aria-hidden>
                            <div className={`tarot-flip-inner ${tarotFlipped ? 'is-flipped' : ''}`}>
                              <div className="tarot-face bg-gradient-to-b from-indigo-600 via-indigo-800 to-slate-900 border-2 border-indigo-300/60 shadow-lg flex flex-col items-center justify-center gap-3">
                                <span className="text-5xl">🌙</span>
                                <span className="text-[10px] font-black tracking-[0.3em] text-indigo-200">BABY SOKPULI TAROT</span>
                              </div>
                              <div className="tarot-face tarot-face-back bg-white border-2 border-indigo-200/80 shadow-lg flex items-center justify-center">
                                {!tarotImgError ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={tarotSelectedCard.image}
                                    alt={displayKorTitle}
                                    onError={() => setTarotImgError(true)}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-6xl">🔮</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="holo-frame w-56 h-80 rounded-2xl overflow-hidden shadow-lg shrink-0 flex items-center justify-center relative animate-soft-float">
                            {!tarotImgError ? (
                              <img
                                src={tarotSelectedCard.image}
                                alt={displayKorTitle}
                                onError={() => setTarotImgError(true)}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-6xl">🔮</span>
                            )}
                            <CaptureStickers />
                          </div>
                        )}

                        <div className="space-y-1">
                          <span className="text-xs font-extrabold text-[#6670A8] bg-white border border-[#C7CCEA] px-3.5 py-1 rounded-full inline-block shadow-2xs">
                            {tarotSelectedCard.animal || '수호동물'} · {tarotSelectedCard.keyword || '속마음'}
                          </span>
                          <h4 className="text-xl font-black text-slate-900 pt-1 tracking-tight">
                            {displayKorTitle}
                          </h4>
                          <p className="text-xs text-slate-400 font-mono tracking-wider uppercase">
                            {displayEngSub}
                          </p>
                        </div>

                        <div className="w-full p-4 bg-white rounded-2xl border border-slate-200/80 text-left space-y-1.5 shadow-2xs">
                          <span className="text-xs font-extrabold text-[#C75B6E] flex items-center gap-1.5">
                            <span>💬</span> 아기의 오늘 밤 속마음
                          </span>
                          <p className="text-sm font-bold text-slate-800 leading-relaxed break-keep">
                            &ldquo;{tarotSelectedCard.babyVoice}&rdquo;
                          </p>
                        </div>

                        <div className="w-full p-4 bg-white rounded-2xl border border-slate-200/80 text-xs sm:text-sm font-bold flex justify-between items-center shadow-2xs">
                          <span className="text-slate-600">🌙 오늘 밤 통잠 난이도</span>
                          <span className="text-[#6670A8] font-black">{tarotSelectedCard.nightDifficulty}</span>
                        </div>

                        <div className="w-full pt-1 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                          <span>아기속풀이 PRO · 데일리 타로</span>
                          <span>{formatTodayDot()} · baby-sokpuli.vercel.app</span>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                        <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                          <span>☕</span> 부모 멘탈 안심 처방전
                        </span>
                        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed break-keep">
                          {tarotSelectedCard.prescription}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleDownloadTarotCard}
                        disabled={isDownloadingTarot}
                        className="btn-jelly w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                      >
                        <span>{isDownloadingTarot ? '타로 카드 생성 중...' : '📸 타로 카드 이미지로 저장하기'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          shareResult(
                            `오늘의 아기 속마음 타로: ${displayKorTitle}`,
                            `오늘 밤 통잠 난이도는 「${tarotSelectedCard.nightDifficulty}」 — 우리 아기 속마음 타로도 확인해보세요 🔮`,
                            '타로 결과 공유'
                          )
                        }
                        className="btn-jelly w-full py-4 bg-[#FEE500] hover:bg-[#FADA0A] text-[#191919] font-black text-sm rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
                      >
                        <span>💬</span>
                        <span>결과 공유하기 (카톡 / 링크)</span>
                      </button>

                      <div className="w-full p-4 bg-white/90 border border-indigo-200/80 rounded-2xl text-left space-y-2.5 shadow-2xs">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-extrabold text-indigo-600 flex items-center gap-1.5">
                            <span>☕</span> 부모 힐링 라운지
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">추천 콘텐츠</span>
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug break-keep">
                          아기속풀이를 만든 아빠의 리얼 육아 숏폼 구경 & 육퇴 힐링템 둘러보기
                        </p>
                        <div className="flex space-x-2.5 pt-1.5">
                          <a
                            href={SERVICE_LINKS.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs sm:text-sm font-bold text-center transition-all shadow-xs flex items-center justify-center gap-1.5"
                          >
                            <span>▶ 아빠의 리얼 육아 숏폼</span>
                          </a>
                          <a
                            href={SERVICE_LINKS.parentHealing}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs sm:text-sm font-bold text-center transition-all shadow-xs flex items-center justify-center gap-1.5"
                          >
                            <span>🛒 육퇴 힐링템 구경</span>
                          </a>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleCloseTarotModal}
                        className="btn-jelly w-full py-4 bg-slate-200 hover:bg-slate-300 text-slate-800 font-black text-sm rounded-2xl shadow-2xs transition-all active:scale-[0.98]"
                      >
                        확인 완료
                      </button>
                    </div>
                  );
                })()
              )}

            </div>
          </div>
        )}

        {isParentMatchModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
            <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto text-slate-900">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    PARENT-CHILD MATCHING
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 break-keep">
                    우리 아이 육아 난이도 측정
                  </h3>
                </div>
                <button
                  onClick={() => setIsParentMatchModalOpen(false)}
                  className="w-8 h-8 bg-slate-100 border border-slate-200 rounded-full text-xs font-bold text-slate-600 flex items-center justify-center hover:bg-slate-200"
                >
                  ✕
                </button>
              </div>

              {isAnalyzingParentMatch ? (
                <div className="py-12 text-center space-y-4 animate-fadeIn bg-slate-50/80 rounded-3xl p-8 border border-amber-100 shadow-md">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-amber-500 to-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-black shadow-md border-2 border-white animate-pulse">
                    🔥
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-base sm:text-lg font-black text-slate-900 break-keep">
                      아이와 부모의 기질 에너지 대조 중...
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 break-keep">
                      부모님의 오행 기운과 아이의 본성을 비교해 육아 난이도를 정밀 연산하고 <span className="keep-line">있습니다 ✨</span>
                    </p>
                  </div>
                  <div className="w-48 mx-auto bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-600 h-full rounded-full animate-pulse" style={{ width: '75%' }} />
                  </div>
                </div>
              ) : !parentingDifficulty ? (
                <form onSubmit={handleCalculateParentMatchModal} noValidate className="space-y-4 text-left">
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed break-keep">
                    아이의 기질과 <b>부모 생년월일 (엄마/아빠 중 한 분)</b>을 비교하여 우리 집만의 육아 난이도 점수를 측정해 드려요.
                  </p>

                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-bold text-slate-800 break-keep">
                      부모 생년월일 (8자리)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="예: 1993.08.15"
                      value={parentBirth}
                      onChange={(e) => handleDateChange(e.target.value, setParentBirth, 'parentBirth')}
                      className={`w-full px-4.5 py-3.5 rounded-xl border text-xs sm:text-sm font-bold text-slate-900 bg-slate-50 placeholder:text-slate-400 focus:outline-none transition-all ${
                        parentMatchError ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200 focus:border-slate-800'
                      }`}
                    />
                    {parentMatchError && (
                      <p className="text-xs font-semibold text-rose-600 mt-1 break-keep">⚠️ {parentMatchError}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn-jelly w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm rounded-2xl shadow-sm transition-all flex items-center justify-center break-keep"
                  >
                    🔥 육아 난이도 측정 시작하기
                  </button>
                </form>
              ) : (
                <div className="space-y-4 text-left animate-slide-up">
                  <div ref={parentMatchCardRef} className="holo-card relative p-6 rounded-3xl shadow-xs space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-xl shadow-2xs border border-slate-200/80">
                          {parentingDifficulty.icon}
                        </div>
                        <div>
                          <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                            {parentingDifficulty.grade} · {parentingDifficulty.badge}
                          </span>
                          <h4 className="text-base sm:text-lg font-black text-slate-900">
                            {parentingDifficulty.level}
                          </h4>
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="text-[11px] text-slate-500 font-bold">난이도 지수</div>
                        <div className="text-2xl font-black text-slate-900">{parentingDifficulty.score}<span className="text-xs text-slate-400">/100</span></div>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden p-0.5">
                        <div
                          className="h-full rounded-full transition-all duration-700 shadow-xs"
                          style={{ width: `${parentingDifficulty.score}%`, backgroundColor: parentingDifficulty.barColor }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] font-bold text-slate-400">
                        <span>평화 모드 (10점)</span>
                        <span>챌린지 모드 (100점)</span>
                      </div>
                    </div>

                    <div className="space-y-3 pt-1 text-xs sm:text-sm">
                      <div className="p-4 bg-white rounded-2xl border border-slate-200/85 space-y-1.5 shadow-2xs">
                        <div className="font-extrabold text-[#A87B4F] flex items-center space-x-1.5">
                          <span>📌</span><span>핵심 케미스트리</span>
                        </div>
                        <div className="text-slate-800 font-semibold leading-relaxed">{parentingDifficulty.summary}</div>
                      </div>

                      <div className="p-4 bg-white rounded-2xl border border-slate-200/85 space-y-1.5 shadow-2xs">
                        <div className="font-extrabold text-[#55769C] flex items-center space-x-1.5">
                          <span>⚡</span><span>상호 작용 (시너지)</span>
                        </div>
                        <div className="text-slate-700 font-medium leading-relaxed">{parentingDifficulty.synergy}</div>
                      </div>

                      <div className="p-4 bg-white rounded-2xl border border-slate-200/85 space-y-2 shadow-2xs">
                        <div className="flex justify-between items-center">
                          <div className="font-extrabold text-[#5E8F74] flex items-center space-x-1.5">
                            <span>💡</span><span>실전 훈육 대화 스크립트</span>
                          </div>
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">전체 공개</span>
                        </div>
                        <div className="text-slate-700 font-medium leading-relaxed break-keep bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                          {parentingDifficulty.solution}
                        </div>
                      </div>
                    </div>

                    <CaptureBrandFooter label="부모-자녀 육아 난이도 진단" />
                    <CaptureStickers />
                  </div>

                  <button
                    onClick={handleDownloadParentMatchCard}
                    disabled={isDownloadingParentMatch}
                    className="btn-jelly w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-sm font-black shadow-sm transition-all flex items-center justify-center space-x-2 active:scale-95 break-keep"
                  >
                    <span>{isDownloadingParentMatch ? '결과 카드 캡처 중...' : '📸 육아 난이도 결과 이미지로 저장하기'}</span>
                  </button>

                  <button
                    onClick={handleShareResult}
                    className="btn-jelly w-full py-4 bg-[#FEE500] hover:bg-[#FADA0A] text-[#191919] font-black text-sm rounded-2xl shadow-xs transition-all flex items-center justify-center space-x-2 active:scale-[0.99]"
                  >
                    <span>💬</span>
                    <span>결과 공유하기 (카톡 / 링크)</span>
                  </button>

                  <button
                    onClick={() => setIsParentMatchModalOpen(false)}
                    className="btn-jelly w-full py-4 bg-slate-200 hover:bg-slate-300 text-slate-800 font-black text-sm rounded-2xl transition-all shadow-xs break-keep"
                  >
                    확인 완료
                  </button>

                  <div className="space-y-3 pt-1">
                    <div className="p-4 bg-white rounded-2xl border border-slate-200/85 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl flex-shrink-0">{parentingDifficulty.parentHealingItem.icon}</span>
                        <div className="break-keep">
                          <div className="text-xs font-bold text-amber-700">고생한 부모를 위한 충전템</div>
                          <div className="text-sm font-black text-slate-900 mt-0.5">{parentingDifficulty.parentHealingItem.title}</div>
                        </div>
                      </div>
                      <a
                        href={parentingDifficulty.parentHealingItem.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold text-center whitespace-nowrap shadow-xs"
                      >
                        추천 보기
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {isNameMatchModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
            <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto text-slate-900">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    BABY NAME MATCHING
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 break-keep">
                    아기 이름 궁합
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleCloseNameMatchModal}
                  className="w-8 h-8 bg-slate-100 border border-slate-200 rounded-full text-xs font-bold text-slate-600 flex items-center justify-center hover:bg-slate-200"
                >
                  ✕
                </button>
              </div>

              {isAnalyzingNameMatch ? (
                <div className="py-12 text-center space-y-4 animate-fadeIn bg-slate-50/80 rounded-3xl p-8 border border-indigo-100 shadow-md">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-rose-400 to-indigo-500 text-white rounded-full flex items-center justify-center text-2xl font-black shadow-md border-2 border-white animate-pulse">
                    💌
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-base sm:text-lg font-black text-slate-900 break-keep">
                      세 이름의 울림을 맞춰보는 중...
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 break-keep">
                      엄마·아빠 이름과 아기 이름의 글자 조합으로 궁합을 읽고 <span className="keep-line">있어요 ✨</span>
                    </p>
                  </div>
                  <div className="w-48 mx-auto bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-[#E3A0AC] to-[#93A5C4] h-full rounded-full animate-pulse" style={{ width: '70%' }} />
                  </div>
                </div>
              ) : !nameMatchResult ? (
                <form onSubmit={handleCalculateNameMatch} noValidate className="space-y-4 text-left">
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed break-keep">
                    엄마·아빠 이름과 지어둔 <b>아기 이름 후보</b>를 넣으면, 세 이름의 글자 조합으로 읽는 재미 궁합 점수를 알려드려요.
                  </p>

                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-bold text-slate-800 break-keep">👩 엄마 이름</label>
                    <input
                      type="text"
                      placeholder="예: 서연"
                      value={nameMatchMom}
                      onChange={(e) => setNameMatchMom(e.target.value)}
                      maxLength={12}
                      className="w-full px-4.5 py-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 bg-slate-50 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-bold text-slate-800 break-keep">👨 아빠 이름</label>
                    <input
                      type="text"
                      placeholder="예: 준혁"
                      value={nameMatchDad}
                      onChange={(e) => setNameMatchDad(e.target.value)}
                      maxLength={12}
                      className="w-full px-4.5 py-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 bg-slate-50 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-bold text-slate-800 break-keep">🍼 아기 이름 후보</label>
                    <input
                      type="text"
                      placeholder="예: 하린"
                      value={nameMatchBaby}
                      onChange={(e) => setNameMatchBaby(e.target.value)}
                      maxLength={12}
                      className="w-full px-4.5 py-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 bg-slate-50 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 transition-all"
                    />
                    {nameMatchError && (
                      <p className="text-xs font-semibold text-rose-600 mt-1 break-keep">⚠️ {nameMatchError}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn-jelly w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm rounded-2xl shadow-sm transition-all flex items-center justify-center break-keep"
                  >
                    💌 이름 궁합 보러 가기
                  </button>

                  <p className="text-[11px] text-slate-400 leading-relaxed break-keep">
                    ※ 이름 궁합은 과학적 근거가 있는 검사가 아니라, 셋이 함께 웃어보자는 재미로 보는 결과예요. 같은 이름 조합은 언제나 같은 결과가 나와요.
                  </p>
                </form>
              ) : (
                <div className="space-y-4 text-left animate-slide-up">
                  <div ref={nameMatchCardRef} className="holo-card relative p-6 rounded-3xl shadow-xs space-y-4">
                    <div className="flex items-center justify-center gap-1.5 text-center flex-wrap">
                      <span className="flex items-center gap-1.5">
                        <span className="px-3 py-1.5 rounded-2xl bg-white border border-slate-200/80 text-[13px] font-black text-slate-900 shadow-2xs whitespace-nowrap">
                          👩 {nameMatchMom.trim()}
                        </span>
                        <span className="text-[#D96C7B] text-sm">♥</span>
                        <span className="px-3 py-1.5 rounded-2xl bg-white border border-slate-200/80 text-[13px] font-black text-slate-900 shadow-2xs whitespace-nowrap">
                          👨 {nameMatchDad.trim()}
                        </span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="text-slate-400 font-black text-[13px]">→</span>
                        <span className="px-3 py-1.5 rounded-2xl bg-rose-50 border border-rose-200/80 text-[13px] font-black text-[#C75B6E] shadow-2xs whitespace-nowrap">
                          🍼 {nameMatchBaby.trim()}
                        </span>
                      </span>
                    </div>

                    <div className="text-center space-y-1 pt-1">
                      <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase block">
                        {nameMatchResult.grade}
                      </span>
                      <div className="text-5xl font-black text-slate-900 font-mono tracking-tight">
                        {nameMatchResult.score}
                        <span className="text-lg text-slate-400 font-bold">점</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden p-0.5">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#E3A0AC] to-[#93A5C4] transition-all duration-700 shadow-xs animate-grow-x"
                          style={{ width: `${nameMatchResult.score}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] font-bold text-slate-400">
                        <span>무럭무럭 (62점)</span>
                        <span>천생연분 (99점)</span>
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-slate-200/85 space-y-1.5 shadow-2xs">
                      <div className="font-extrabold text-[#C75B6E] flex items-center space-x-1.5">
                        <span>💬</span>
                        <span>궁합 한 줄</span>
                      </div>
                      <div className="text-slate-800 font-semibold leading-relaxed break-keep">{nameMatchResult.comment}</div>
                    </div>

                    <CaptureBrandFooter label="아기 이름 궁합" />
                    <CaptureStickers />
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadNameMatchCard}
                    disabled={isDownloadingNameMatch}
                    className="btn-jelly w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-sm font-black shadow-sm transition-all flex items-center justify-center space-x-2 active:scale-95 break-keep"
                  >
                    <span>{isDownloadingNameMatch ? '결과 카드 캡처 중...' : '📸 이름 궁합 결과 이미지로 저장하기'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      shareResult(
                        `「${nameMatchBaby.trim()}」 이름 궁합 ${nameMatchResult.score}점!`,
                        `${nameMatchMom.trim()} ♥ ${nameMatchDad.trim()}이 지은 이름 「${nameMatchBaby.trim()}」은 ${nameMatchResult.grade} — 아기 이름 궁합도 재미로 확인해보세요 ✨`,
                        '이름 궁합 결과 공유'
                      )
                    }
                    className="btn-jelly w-full py-4 bg-[#FEE500] hover:bg-[#FADA0A] text-[#191919] font-black text-sm rounded-2xl shadow-xs transition-all flex items-center justify-center space-x-2 active:scale-[0.99]"
                  >
                    <span>💬</span>
                    <span>결과 공유하기 (카톡 / 링크)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNameMatchResult(null);
                      setNameMatchError(undefined);
                    }}
                    className="btn-jelly w-full py-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-black text-sm rounded-2xl transition-all shadow-xs break-keep"
                  >
                    다른 이름으로도 보기
                  </button>

                  <button
                    type="button"
                    onClick={handleCloseNameMatchModal}
                    className="btn-jelly w-full py-4 bg-slate-200 hover:bg-slate-300 text-slate-800 font-black text-sm rounded-2xl transition-all shadow-xs break-keep"
                  >
                    확인 완료
                  </button>

                  <p className="text-[11px] text-slate-400 leading-relaxed break-keep">
                    ※ 재미로 보는 이름 궁합이에요. 이름의 좋고 나쁨을 판단하는 결과가 아니니 가볍게 즐겨주세요.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {isChemiModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
            <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto text-slate-900 animate-slide-up">
              
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center text-base border border-slate-200">
                    ⚖️
                  </span>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                      오늘 밤 육아 당번 판결소
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">엄마 vs 아빠 오늘의 육아 주인공은?</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCloseChemiModal}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold transition-colors"
                >
                  ✕
                </button>
              </div>

              {isAnalyzingChemi ? (
                <div className="py-8 text-center space-y-4 animate-fadeIn">
                  <div className="space-y-2">
                    <div className="w-16 h-16 mx-auto bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-black shadow-2xs border border-indigo-100 animate-pulse">
                      ⚖️
                    </div>
                    <h4 className="text-sm sm:text-base font-extrabold text-slate-900 mt-2">
                      부모의 오늘 오행 파워 실시간 심리 중...
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500">
                      우주의 기운을 공정하게 판결하고 있습니다 (탕! 탕! 탕! 🔨)
                    </p>
                  </div>

                  <div className="p-4.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3.5">
                    <div className="space-y-2 text-left">
                      <div className="flex justify-between text-xs sm:text-sm font-bold">
                        <span className="text-[#C75B6E]">👩 엄마의 오늘 기운</span>
                        <span className="font-mono text-slate-700">{dynamicMomBar}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                        <div className="bg-[#D96C7B] h-full rounded-full transition-all duration-200" style={{ width: `${dynamicMomBar}%` }} />
                      </div>
                    </div>

                    <div className="text-center text-xs font-black text-slate-400">VS</div>

                    <div className="space-y-2 text-left">
                      <div className="flex justify-between text-xs sm:text-sm font-bold">
                        <span className="text-[#55769C]">👨 아빠의 오늘 기운</span>
                        <span className="font-mono text-slate-700">{dynamicDadBar}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                        <div className="bg-[#6482A8] h-full rounded-full transition-all duration-200" style={{ width: `${dynamicDadBar}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              ) : !chemiResult ? (
                <form onSubmit={handleCalculateChemi} noValidate className="space-y-4 text-left pt-1">
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    오늘 날짜의 오행 기운과 두 분의 사주를 대조해 <b>오늘 집안의 평화를 지킬 육아 주인공</b>을 판정해 드립니다.
                  </p>

                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-bold text-slate-800">
                      👩 엄마 생년월일 (8자리)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="예: 1993.08.15"
                      value={momBirth}
                      onChange={(e) => handleDateChange(e.target.value, setMomBirth, 'momBirth')}
                      className={`w-full px-4.5 py-3.5 rounded-xl border text-xs sm:text-sm font-bold text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none transition-all ${
                        chemiErrors.mom ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200 focus:border-slate-800'
                      }`}
                    />
                    {chemiErrors.mom && <p className="text-xs font-semibold text-rose-600 mt-1">⚠️ {chemiErrors.mom}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-bold text-slate-800">
                      👨 아빠 생년월일 (8자리)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="예: 1991.04.22"
                      value={dadBirth}
                      onChange={(e) => handleDateChange(e.target.value, setDadBirth, 'dadBirth')}
                      className={`w-full px-4.5 py-3.5 rounded-xl border text-xs sm:text-sm font-bold text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none transition-all ${
                        chemiErrors.dad ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200 focus:border-slate-800'
                      }`}
                    />
                    {chemiErrors.dad && <p className="text-xs font-semibold text-rose-600 mt-1">⚠️ {chemiErrors.dad}</p>}
                  </div>

                  <button
                    type="submit"
                    className="btn-jelly w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm rounded-2xl shadow-2xs transition-all active:scale-[0.98] mt-2"
                  >
                    ⚖️ 오늘의 육아 판결 받기
                  </button>
                </form>
              ) : (
                <div className="space-y-4 text-center animate-slide-up">
                  <div ref={chemiResultRef} className="space-y-4">
                    <div className="holo-card relative p-6 rounded-3xl space-y-2.5">
                      <div aria-hidden className="nm-art animate-stamp pointer-events-none absolute top-3 right-3 z-10 rounded-lg border-[3px] border-[#BE5A4E]/90 bg-white/85 px-2.5 py-1 text-center shadow-sm">
                        <div className="text-[10px] font-black tracking-widest text-[#BE5A4E]">아기속풀이 법정</div>
                        <div className="text-base font-black leading-tight text-[#BE5A4E]">판결 완료</div>
                      </div>
                      <span className="mt-12 text-[10px] font-extrabold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                        오행 법정 최종 선고
                      </span>
                      <h4 className="text-xl sm:text-2xl font-black text-slate-900">
                        오늘의 육아 주인공은 &ldquo;{chemiResult.best}&rdquo;!
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium pt-1 break-keep verdict-text">
                        {glueVerdictText(chemiResult.summary)}
                      </p>

                      {/* 최종 점수 바: 표시 수치가 승자와 반드시 일치하도록 실제 점수를 그대로 렌더링 */}
                      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 space-y-3 text-left shadow-2xs">
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs sm:text-sm font-bold">
                            <span className="text-[#C75B6E]">👩 엄마의 오늘 기운</span>
                            <span className="font-mono text-slate-700">{chemiResult.momScore}%</span>
                          </div>
                          <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                            <div className="bg-[#D96C7B] h-full rounded-full transition-all duration-500 animate-grow-x" style={{ width: `${chemiResult.momScore}%` }} />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs sm:text-sm font-bold">
                            <span className="text-[#55769C]">👨 아빠의 오늘 기운</span>
                            <span className="font-mono text-slate-700">{chemiResult.dadScore}%</span>
                          </div>
                          <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                            <div className="bg-[#6482A8] h-full rounded-full transition-all duration-500 animate-grow-x" style={{ width: `${chemiResult.dadScore}%` }} />
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 text-xs sm:text-sm text-slate-600 text-left leading-relaxed mt-2 shadow-2xs verdict-text">
                        💡 <b>판결 사유:</b> {glueVerdictText(chemiResult.reason)}
                      </div>
                    </div>
                    <CaptureBrandFooter label="오늘 밤 육아 당번 판결소" />
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadChemiCard}
                    disabled={isDownloadingChemi}
                    className="btn-jelly w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-sm font-black shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    <span>{isDownloadingChemi ? '결과 카드 생성 중...' : '📸 결과 이미지로 저장하기'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      shareResult(
                        `오늘 밤 육아 당번은 ${chemiResult.best}!`,
                        `엄마 ${chemiResult.momScore}% vs 아빠 ${chemiResult.dadScore}% — 오행 법정의 판결을 확인해보세요 ⚖️`,
                        '당번 판결 결과 공유',
                        buildCourtShareUrl()
                      )
                    }
                    className="btn-jelly w-full py-4 bg-[#FEE500] hover:bg-[#FADA0A] text-[#191919] font-black text-sm rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
                  >
                    <span>💬</span>
                    <span>결과 공유하기 (카톡 / 링크)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCloseChemiModal}
                    className="btn-jelly w-full py-4 bg-slate-200 hover:bg-slate-300 text-slate-800 font-black text-sm rounded-2xl shadow-2xs transition-all active:scale-[0.98]"
                  >
                    판결 확인 완료
                  </button>

                  {/* 추천 콘텐츠(라운지)는 결과 확인 뒤 맨 아래로 분리 */}
                  <div className="p-4 bg-white border border-indigo-200/80 rounded-2xl text-left space-y-2.5 shadow-2xs">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-extrabold text-indigo-600 flex items-center gap-1.5">
                        <span>☕</span> 당번 판결 라운지
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">추천 콘텐츠</span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug break-keep">
                      아기속풀이를 만든 아빠의 리얼 육아 숏폼 구경 & 야간 힐링템 둘러보기
                    </p>
                    <div className="flex space-x-2.5 pt-1">
                      <a
                        href={SERVICE_LINKS.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs sm:text-sm font-bold text-center transition-all shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <span>▶ 아빠의 리얼 육아 숏폼</span>
                      </a>
                      <a
                        href={SERVICE_LINKS.parentHealing}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs sm:text-sm font-bold text-center transition-all shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <span>🛒 야간 힐링템 구경</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {isLoungeOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
            <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
              <div className="flex justify-between items-center pb-3.5 border-b border-slate-100">
                <div className="text-left">
                  <span className="text-xs font-bold text-sky-700 uppercase tracking-wider block mb-0.5">
                    새로운 기능 제안 및 남매 아빠 후원하기
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 break-keep">
                    LOUNGE
                  </h3>
                </div>
                <button
                  onClick={() => setIsLoungeOpen(false)}
                  className="w-8 h-8 bg-slate-100 border border-slate-200 rounded-full text-xs font-bold text-slate-700 flex items-center justify-center hover:bg-slate-200"
                >
                  ✕
                </button>
              </div>

              <div className="bg-gradient-to-br from-amber-500/10 via-rose-500/10 to-amber-500/5 border border-amber-400/50 rounded-2xl p-5 text-left shadow-2xs space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">🥤</span>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 break-keep">
                      남매 아빠에게 콜라 한 캔 후원하기
                    </h4>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed break-keep">
                  오늘 서비스가 작게나마 웃음과 위로를 드렸다면, 남매 육아와 사이트 운영에 힘이 나는 시원한 콜라 한 캔을 선물해주세요!
                </p>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between shadow-2xs">
                  <div className="break-keep">
                    <div className="text-xs font-bold text-slate-500">
                      {DONATION_CONFIG.bankName} (예금주: {DONATION_CONFIG.holderName})
                    </div>
                    <div className="text-xs sm:text-sm font-black font-mono text-slate-900 mt-0.5">
                      {DONATION_CONFIG.accountNumber}
                    </div>
                  </div>
                  <button
                    onClick={handleCopyAccount}
                    className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs whitespace-nowrap ${
                      copyFeedback ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95'
                    }`}
                  >
                    {copyFeedback ? '✓ 복사완료!' : '계좌 복사'}
                  </button>
                </div>
                {copyFeedback && (
                  <p className="text-xs font-bold text-emerald-600 text-center animate-fadeIn break-keep">
                    🎉 계좌가 복사됐어요! 금융 앱에 붙여넣어 바로 송금하실 수 있어요.
                  </p>
                )}
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left shadow-2xs space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 bg-red-600 text-white rounded-lg flex items-center justify-center text-xs font-bold">
                    ▶
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 break-keep">
                    아기속풀이 실제 모델! 하민&하윤 유튜브
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed break-keep">
                  원더윅스 폭풍을 온몸으로 이겨내고 있는 하민이와 하윤이의 생생한 일상과 육아 성장 숏폼을 구경해보세요.
                </p>
                <a
                  href={SERVICE_LINKS.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('click_youtube', 'Outbound', '유튜브 채널 방문')}
                  className="block w-full py-3.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs sm:text-sm font-bold rounded-xl text-center transition-all break-keep"
                >
                  하민&하윤이 유튜브 채널 구경 가기
                </a>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left shadow-2xs space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white rounded-lg flex items-center justify-center text-xs font-bold">
                    💡
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 break-keep">
                    아이디어 & 새로운 기능 제안
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed break-keep">
                  &ldquo;이런 기능이 더 있으면 좋겠어요!&rdquo; 등 다양한 아이디어를 인스타 DM으로 남겨주시면 아빠가 직접 읽고 반영해요.
                </p>
                <a
                  href={SERVICE_LINKS.instagramDM}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('click_instagram', 'Outbound', '인스타그램 DM 문의')}
                  className="block w-full py-3.5 bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-700 text-xs sm:text-sm font-bold rounded-xl text-center transition-all active:scale-[0.98] shadow-2xs break-keep"
                >
                  인스타 DM으로 새로운 기능 제안하기
                </a>
              </div>

              <button
                onClick={() => setIsLoungeOpen(false)}
                className="w-full py-4 bg-slate-900 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-xs transition-all break-keep"
              >
                확인 완료
              </button>
            </div>
          </div>
        )}

      </div>

      {iosSavedImageUrl && (
        <div className="fixed inset-0 z-[70] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-5 animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 space-y-3.5 shadow-2xl animate-slide-up">
            <p className="text-sm font-black text-slate-900 text-center break-keep">
              이미지를 길게 눌러 저장해주세요 📸
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={iosSavedImageUrl} alt="저장할 결과 이미지" className="w-full rounded-2xl border border-slate-200" />
            <button
              type="button"
              onClick={() => setIosSavedImageUrl(null)}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm rounded-2xl transition-all"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-2.5rem)] max-w-md animate-slide-up pointer-events-none">
          <div className="bg-slate-900/95 text-white text-sm font-bold text-center leading-relaxed break-keep px-5 py-3.5 rounded-2xl shadow-2xl">
            {toastMessage}
          </div>
        </div>
      )}
    </main>
  );
}