'use client';

import React, { useState, useEffect, useRef } from 'react';
import { toPng } from 'html-to-image';

function trackEvent(action: string, category: string, label: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
    });
  }
}

const SERVICE_LINKS = {
  youtube: 'https://www.youtube.com/@Hamin_Hayoon_day?utm_source=baby_sokpuli&utm_medium=lounge&utm_campaign=youtube',
  instagramProfile: 'https://www.instagram.com/hamin_hayoon_day/?utm_source=baby_sokpuli&utm_medium=lounge&utm_campaign=instagram',
  instagramDM: 'https://ig.me/m/hamin_hayoon_day?utm_source=baby_sokpuli&utm_medium=ai_teaser&utm_campaign=dm_inquiry',
  coupangDefault: 'https://link.coupang.com/a/gZzbA8ezNk',
  parentHealing: 'https://link.coupang.com/a/gZAUwv5ctw',
};

const PARENT_HEALING_PRODUCTS = {
  level5: {
    title: '무선 온열 목·어깨 마사지기',
    subTitle: '지친 하루, 뻐근해진 승모근과 목을 시원하게',
    icon: '💆',
    link: 'https://link.coupang.com/a/gZzATurY6u',
  },
  level4: {
    title: '콜드브루 디카페인 파우치 세트',
    subTitle: '지친 오후 부모 멘탈을 채워줄 든든한 카페인 수혈',
    icon: '☕',
    link: 'https://link.coupang.com/a/gZzDh8XAE8',
  },
  level3: {
    title: '유기농 카모마일 릴랙스 티 세트',
    subTitle: '육퇴 후 복잡한 생각을 비우고 편안한 숙면을',
    icon: '🫖',
    link: 'https://link.coupang.com/a/gZzHmhAhae',
  },
  level2: {
    title: '천연 아로마 롤온 힐링 테라피',
    subTitle: '하루 1분, 손목에 가볍게 바르는 스트레스 완화',
    icon: '🌿',
    link: 'https://link.coupang.com/a/gZzJINaiAK',
  },
  level1: {
    title: '프리미엄 페어링 디저트 컬렉션',
    subTitle: '평화로운 육퇴 후 부부가 함께 나누는 달콤한 보상',
    icon: '🍪',
    link: 'https://link.coupang.com/a/gZzLYIshOK',
  },
};

const BABY_POTION_LINKS: Record<'wood' | 'fire' | 'earth' | 'metal' | 'water', Record<'infant' | 'toddler' | 'child', string>> = {
  wood: {
    infant: 'https://link.coupang.com/a/gZxQNRGK0i',
    toddler: 'https://link.coupang.com/a/gZzTAoFGHA',
    child: 'https://link.coupang.com/a/gZzWiJKXxA',
  },
  fire: {
    infant: 'https://link.coupang.com/a/gZz0FSD20y',
    toddler: 'https://link.coupang.com/a/gZz2WPe6cS',
    child: 'https://link.coupang.com/a/gZz5q33Qqa',
  },
  earth: {
    infant: 'https://link.coupang.com/a/gZz7vAV37s',
    toddler: 'https://link.coupang.com/a/gZAB1mecDY',
    child: 'https://link.coupang.com/a/gZADU7LZvw',
  },
  metal: {
    infant: 'https://link.coupang.com/a/gZAF6nJOrk',
    toddler: 'https://link.coupang.com/a/gZAH1uI9zU',
    child: 'https://link.coupang.com/a/gZAJNeiG4q',
  },
  water: {
    infant: 'https://link.coupang.com/a/gZANoTDZEi',
    toddler: 'https://link.coupang.com/a/gZAPp2bXVI',
    child: 'https://link.coupang.com/a/gZARxR6UJo',
  },
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
  {
    id: 1,
    image: '/tarot_cards_clay/01_peaceful_sleep.png',
    korTitle: '01. 통잠의 축복',
    engSub: 'The Slumber',
    animal: '돼지',
    keyword: '수면의 평화',
    babyVoice: '오늘따라 달님 베개가 너무 포근해... 통잠 자줄 테니 둘 다 푹 쉬어 😴',
    prescription: '넷플릭스 켜고 야식 시키세요. 오늘은 온 우주가 돕는 합법적 자유의 밤입니다.',
    nightDifficulty: '최하 (로또 맞은 날)',
  },
  {
    id: 2,
    image: '/tarot_cards_clay/02_back_sensor.png',
    korTitle: '02. 등센서의 경고',
    engSub: 'The Sensor',
    animal: '강아지',
    keyword: '밀착 육아',
    babyVoice: '바닥 매트리스에 등 닿는 순간 비상벨 울린다? 절대 내려놓지 마!',
    prescription: '눕히기보단 아기띠를 차고 한 몸이 되는 것이 부모의 정신건강에 이롭습니다.',
    nightDifficulty: '상 (팔근육 단련의 날)',
  },
  {
    id: 3,
    image: '/tarot_cards_clay/03_midnight_party.png',
    korTitle: '03. 새벽의 파티피플',
    engSub: 'The Party',
    animal: '강아지',
    keyword: '밤샘 각성',
    babyVoice: '엄마 아빠 왜 자? 디스코볼 켜졌는데 이제부터가 진짜 본게임이야 일어나!',
    prescription: '조명을 절대 켜지 마시고, 말도 걸지 않는 무반응 침묵 육아로 대응하세요.',
    nightDifficulty: '극상 (새벽 3시 각성 주의)',
  },
  {
    id: 4,
    image: '/tarot_cards_clay/04_micro_nap.png',
    korTitle: '04. 15분 칼낮잠',
    engSub: 'The Micro-Nap',
    animal: '양',
    keyword: '얕은 수면',
    babyVoice: '15분 딱 눈 감았더니 배터리 100% 충전 완료! 다시 출동하자!',
    prescription: '커피 한 모금 마실 틈도 없습니다. 빠르게 육아 교대를 신청하세요.',
    nightDifficulty: '중 (낮 동안 체력 방전 필요)',
  },
  {
    id: 5,
    image: '/tarot_cards_clay/05_crib_escape.png',
    korTitle: '05. 탈출 본능',
    engSub: 'The Escape',
    animal: '원숭이',
    keyword: '대근육 폭발',
    babyVoice: '날 가두지 마라! 이 난간만 넘으면 넓은 거실 월드가 펼쳐진다!',
    prescription: '침대 주변 낙상 위험 요소와 단단한 가드를 최우선으로 점검해 주세요.',
    nightDifficulty: '중상 (시야 고정보조 필요)',
  },
  {
    id: 6,
    image: '/tarot_cards_clay/06_dawn_wake.png',
    korTitle: '06. 새벽 5시 모닝콜',
    engSub: 'The Early Bird',
    animal: '닭',
    keyword: '일출 기상',
    babyVoice: '꼬끼오! 일찍 일어나는 새가 먼저 모이를 먹는대! 얼른 일어나서 놀자!',
    prescription: '암막 커튼 틈새로 새는 빛을 완벽히 차단하고 밤잠 시간을 30분 늦춰보세요.',
    nightDifficulty: '중 (부모 수면 부족 주의)',
  },
  {
    id: 7,
    image: '/tarot_cards_clay/07_deep_slumber.png',
    korTitle: '07. 구름떡 기절 숙면',
    engSub: 'The Coma',
    animal: '소',
    keyword: '완벽 방전',
    babyVoice: '구름 이불에 싸여서 숨소리만 색색 내며 잘 테니까 푹 쉬어...',
    prescription: '작은 소음에도 깨지 않는 날입니다. 밀린 집안일을 편안히 해치우세요.',
    nightDifficulty: '최하 (평화로운 고요)',
  },
  {
    id: 8,
    image: '/tarot_cards_clay/08_teething_cranky.png',
    korTitle: '08. 이앓이 몬스터',
    engSub: 'The Teething',
    animal: '토끼',
    keyword: '잇몸 열감',
    babyVoice: '잇몸이 간지럽고 욱신거려! 뭐든 입에 다 넣고 깨물어 버릴 거야!',
    prescription: '냉장고에 시원하게 넣어둔 쿨링 치발기를 물려주는 것이 최고의 명약입니다.',
    nightDifficulty: '상 (이유 없는 칭얼거림)',
  },
  {
    id: 9,
    image: '/tarot_cards_clay/09_wonder_weeks.png',
    korTitle: '09. 원더윅스 타워',
    engSub: 'The Tower',
    animal: '용',
    keyword: '도약의 폭풍',
    babyVoice: '나도 내 뇌가 왜 이러는지 몰라! 세상이 너무 넓어져서 다 서러워 😭',
    prescription: '지능이 급성장하며 겪는 과부하입니다. 훈육 대신 넓은 포옹을 건네주세요.',
    nightDifficulty: '극상 (부모 멘탈 관리 필수)',
  },
  {
    id: 10,
    image: '/tarot_cards_clay/10_milk_drunk.png',
    korTitle: '10. 배부른 만수르',
    engSub: 'The Feast',
    animal: '돼지',
    keyword: '포만감 만족',
    babyVoice: '맘마 원샷 때리고 배 빵빵하니 기분 최고야! 아무것도 안 부러워.',
    prescription: '시원하게 트림만 잘 시켜주면 오늘 반나절은 매우 순둥순둥 모드입니다.',
    nightDifficulty: '하 (수유 성공적)',
  },
  {
    id: 11,
    image: '/tarot_cards_clay/11_food_strike.png',
    korTitle: '11. 단식 투쟁가',
    engSub: 'The Strike',
    animal: '닭',
    keyword: '식사 거부',
    babyVoice: '이유식 숟가락 치워! 입 꾹 닫고 고개 휙 돌려버릴 거야!',
    prescription: '억지로 먹이지 말고 과감히 식판을 치우세요. 굶주림이 다음 끼니의 최고의 반찬입니다.',
    nightDifficulty: '중 (부모 속터짐 주의)',
  },
  {
    id: 12,
    image: '/tarot_cards_clay/12_belly_discomfort.png',
    korTitle: '12. 배앓이 주의보',
    engSub: 'The Gas',
    animal: '양',
    keyword: '복부 팽만',
    babyVoice: '뱃속에 방귀 공기가 찼나 봐... 다리 배로 끌어올리고 뿌엥 울 거야.',
    prescription: '따뜻한 손으로 시계 방향 배 마사지와 하늘자전거 다리 운동을 해주세요.',
    nightDifficulty: '중상 (소화케어 집중)',
  },
  {
    id: 13,
    image: '/tarot_cards_clay/13_messy_eater.png',
    korTitle: '13. 촉감 대환장파티',
    engSub: 'The Artist',
    animal: '쥐',
    keyword: '오감 탐색',
    babyVoice: '음식은 먹는 게 아니라 온몸과 식판에 바르고 주무르는 예술이야!',
    prescription: '마음을 비우면 편안해집니다. 식사 후 바로 따뜻한 목욕탕으로 직행하세요.',
    nightDifficulty: '중 (청소 지옥 주의)',
  },
  {
    id: 14,
    image: '/tarot_cards_clay/14_healing_recovery.png',
    korTitle: '14. 컨디션 완충',
    engSub: 'The Healing',
    animal: '말',
    keyword: '활력 회복',
    babyVoice: '미열도 내리고 쌩쌩해졌어! 그동안 간호해 줘서 고마워요.',
    prescription: '체온만 가볍게 확인하시고, 오늘은 아이와 함께 편안히 누워 힐링하세요.',
    nightDifficulty: '하 (안정권 진입)',
  },
  {
    id: 15,
    image: '/tarot_cards_clay/15_hyper_active.png',
    korTitle: '15. 무한 에너자이저',
    engSub: 'The Chariot',
    animal: '토끼',
    keyword: '무한 체력',
    babyVoice: '세상이 너무 신나! 기어 다니고 뛰어다니고 온 집안을 다 털어버릴 거야!',
    prescription: '낮 동안 신나는 신체 놀이로 체력을 0%로 완전히 방전시켜야 밤이 편합니다.',
    nightDifficulty: '중상 (육지컬 승부)',
  },
  {
    id: 16,
    image: '/tarot_cards_clay/16_clingy_mode.png',
    korTitle: '16. 강력 접착제 모드',
    engSub: 'The Lovers',
    animal: '강아지',
    keyword: '분리 불안',
    babyVoice: '화장실도 가지 마! 1cm만 시야에서 사라져도 대성통곡할 거야.',
    prescription: '분리불안 시기입니다. 틈틈이 눈을 맞추고 포옹하며 든든한 안정감을 주세요.',
    nightDifficulty: '상 (자유시간 제로)',
  },
  {
    id: 17,
    image: '/tarot_cards_clay/17_curious_explorer.png',
    korTitle: '17. 서랍 털이 탐험가',
    engSub: 'The Explorer',
    animal: '호랑이',
    keyword: '공간 탐구',
    babyVoice: '물티슈 뽑기 장인 등판! 판도라의 서랍은 다 열려야 제맛이지.',
    prescription: '서랍 안전장치를 점검하고, 마음껏 찢어도 되는 탐색 상자를 쥐여주세요.',
    nightDifficulty: '중 (사고 방지 집중)',
  },
  {
    id: 18,
    image: '/tarot_cards_clay/18_meltdown_alarm.png',
    korTitle: '18. 돌고래 샤우팅',
    engSub: 'The Judgment',
    animal: '호랑이',
    keyword: '의사 표현',
    babyVoice: '내 뜻대로 안 되면 우주가 떠나가라 돌고래 고음 샤우팅 발사!',
    prescription: '놀라거나 함께 흥분하지 마시고, 차분하고 나긋나긋한 톤으로 호응해 주세요.',
    nightDifficulty: '상 (부모 귀마개 권장)',
  },
  {
    id: 19,
    image: '/tarot_cards_clay/19_angelic_smile.png',
    korTitle: '19. 심쿵 천사표 미소',
    engSub: 'The Star',
    animal: '소',
    keyword: '극강 애교',
    babyVoice: '눈 마주치면 헤헤 웃어줄게! 내 살인 애교 한 방에 사르르 녹지?',
    prescription: '카메라를 켜고 연사로 셔터를 누르세요. 오늘 평생 간직할 인생샷이 나옵니다.',
    nightDifficulty: '최하 (피로가 싹 풀림)',
  },
  {
    id: 20,
    image: '/tarot_cards_clay/20_toy_collector.png',
    korTitle: '20. 블록 성애자',
    engSub: 'The Builder',
    animal: '쥐',
    keyword: '집중 몰입',
    babyVoice: '높이높이 쌓아놓은 블록 와르르 무너뜨리는 소리가 제일 짜릿해!',
    prescription: '소근육과 인과관계를 탐구 중입니다. 마음껏 무너뜨려도 되는 블록을 깔아주세요.',
    nightDifficulty: '하 (집중력 최고조)',
  },
  {
    id: 21,
    image: '/tarot_cards_clay/21_master_negotiator.png',
    korTitle: '21. 육아 상전 지휘관',
    engSub: 'The Emperor',
    animal: '용',
    keyword: '군림 본능',
    babyVoice: '오늘은 내가 황제야. 안아주는 각도부터 맘마 온도까지 내 뜻대로 맞춰라!',
    prescription: '아이에게 두 가지 중 하나를 고르게 하는 선택권을 주어 주도성을 존중해 주세요.',
    nightDifficulty: '상 (극진한 수발 필요)',
  },
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

  if (!digits) {
    return { isValid: false, errorMsg: `${fieldName}를 입력해주세요.` };
  }

  if (digits.length !== 8) {
    return { isValid: false, errorMsg: `${fieldName} 8자리를 끝까지 입력해주세요. (예: 2024.05.10)` };
  }

  const year = parseInt(digits.slice(0, 4), 10);
  const month = parseInt(digits.slice(4, 6), 10);
  const day = parseInt(digits.slice(6, 8), 10);

  if (year < minYear || year > maxYear) {
    return { isValid: false, errorMsg: `연도는 ${minYear}년~${maxYear}년 사이여야 해요.` };
  }

  if (month < 1 || month > 12) {
    return { isValid: false, errorMsg: '월은 01월부터 12월 사이여야 해요.' };
  }

  const maxDaysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > maxDaysInMonth) {
    return {
      isValid: false,
      errorMsg: `${year}년 ${month}월은 ${maxDaysInMonth}일까지 있어요. 존재하지 않는 날짜예요.`,
    };
  }

  const inputDate = new Date(year, month - 1, day);
  const now = new Date();
  now.setHours(23, 59, 59, 999);

  if (!allowFuture && inputDate > now) {
    return { isValid: false, errorMsg: `${fieldName}는 오늘보다 미래일 수 없어요.` };
  }

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
      tip: '낮 동안 신체 에너지를 충분히 쏟아주지 않으면 밤잠 투정이 생길 수 있어요. 터미타임이나 신체 놀이를 챙겨주세요.',
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
      icon: '🌦️',
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
    <div className="w-full bg-gradient-to-b from-amber-50/60 to-[#FAF8F5] rounded-3xl border border-amber-200/60 p-6 my-3 flex flex-col items-center justify-center relative overflow-hidden shadow-xs">
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
  description: {
    meaning: string;
    levelInterpretation: string;
    careTip: string;
  };
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

  return (
    <div className="space-y-2.5 pb-3.5 border-b border-slate-100 last:border-b-0 last:pb-0">
      <div className="flex justify-between items-center text-sm sm:text-base">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-extrabold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
            {categoryTag}
          </span>
          <span className="font-extrabold text-slate-900 break-keep">{name}</span>
          <button
            type="button"
            onClick={() => onToggleTooltip(id)}
            aria-label={`${name} 설명 보기`}
            className={`w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-xs font-extrabold transition-all ${
              isOpen ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            !
          </button>
        </div>
        <span className="font-mono font-black tracking-tight" style={{ color: fillColor }}>
          {score}점
        </span>
      </div>

      <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-0.5">
        <div
          className="h-full rounded-full transition-all duration-500 shadow-xs"
          style={{ width: `${score}%`, backgroundColor: fillColor }}
        />
      </div>

      {isOpen && (
        <div className="mt-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs text-left space-y-2.5 animate-fadeIn break-keep text-sm sm:text-base">
          <div>
            <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block mb-1">
              어떤 성향인가요?
            </span>
            <p className="font-semibold text-slate-800 leading-relaxed">{description.meaning}</p>
          </div>
          <div>
            <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block mb-1">
              점수 분석 ({score}점)
            </span>
            <p className="font-medium text-slate-700 leading-relaxed">{description.levelInterpretation}</p>
          </div>
          <div className="pt-2 border-t border-slate-200">
            <p className="font-bold text-slate-900 flex items-start space-x-1.5">
              <span className="flex-shrink-0 text-slate-900">포인트:</span>
              <span className="text-slate-700 font-medium leading-relaxed">{description.careTip}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

interface WonderLeap {
  leapIndex: number;
  name: string;
  startDay: number;
  endDay: number;
  description: string;
}

const WONDER_LEAPS: WonderLeap[] = [
  { leapIndex: 1, name: '제1도약기 (감각의 변화)', startDay: 32, endDay: 39, description: '주변 소리와 빛 등 낯선 세상 감각에 첫눈을 뜨며 적응하는 시기예요.' },
  { leapIndex: 2, name: '제2도약기 (패턴의 인지)', startDay: 53, endDay: 67, description: '손발을 쳐다보며 몸의 움직임과 일정한 모양을 깨닫기 시작해요.' },
  { leapIndex: 3, name: '제3도약기 (변화의 도약)', startDay: 81, endDay: 88, description: '목을 가누고 소리를 내며 세상과 신나게 소통할 준비를 해요.' },
  { leapIndex: 4, name: '제4도약기 (마의 19주 폭풍)', startDay: 102, endDay: 137, description: '손을 뻗어 잡고 원인과 결과를 이해하느라 뇌에 즐거운 과부하가 걸려요.' },
  { leapIndex: 5, name: '제5도약기 (관계의 인지)', startDay: 158, endDay: 186, description: '엄마 아빠와 자신이 떨어져 있음을 알고 살짝 불안해지는 껌딱지 구간이에요.' },
  { leapIndex: 6, name: '제6도약기 (범주의 인지)', startDay: 235, endDay: 263, description: '사물과 동물의 공통점을 묶어 생각하는 호기심이 무럭무럭 자라요.' },
  { leapIndex: 7, name: '제7도약기 (순서의 도약)', startDay: 291, endDay: 326, description: '통에 물건을 넣었다 뺐다 하며 일의 순서를 탐구하는 작은 과학자예요.' },
  { leapIndex: 8, name: '제8도약기 (체계의 도약)', startDay: 361, endDay: 389, description: '돌 무렵 식사나 옷 입기 등 하루의 즐거운 일과와 규칙을 익혀가요.' },
  { leapIndex: 9, name: '제9도약기 (원리의 도약)', startDay: 417, endDay: 452, description: '마음대로 행동하고 표현하며 감정을 솔직하게 드러내는 시기예요.' },
  { leapIndex: 10, name: '제10도약기 (체계의 완성)', startDay: 494, endDay: 529, description: '엄마 아빠와 대화하고 자아를 자유롭게 뽐내는 꼬마 대장이 되었어요!' },
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
  parentHealingItem: {
    title: string;
    subTitle: string;
    icon: string;
    link: string;
  };
  desc?: string;
}

const calculate5StepDifficulty = (babyDateStr: string, parentDateStr: string): ParentingDifficultyResult => {
  const babyYear = parseInt(babyDateStr.replace(/[^0-9]/g, '').slice(0, 4), 10) || 2024;
  const parentYear = parseInt(parentDateStr.replace(/[^0-9]/g, '').slice(0, 4), 10) || 1990;

  const babyEl = (babyYear - 4) % 5;
  const parentEl = (parentYear - 4) % 5;
  const diff = Math.abs(babyEl - parentEl);

  if (babyEl === parentEl) {
    return {
      score: 95,
      grade: 'LEVEL 5',
      badge: '불꽃 스파크',
      icon: '🔥',
      level: '최상 (폭풍 성장 챌린지형)',
      barColor: '#E11D48',
      summary: '서로의 주관과 활동성이 정면으로 부딪히기 쉬운 불꽃 타입이에요!',
      synergy: '아이가 부모의 고집과 행동 방식을 쏙 빼닮아 양보 없는 상황이 자주 일어납니다.',
      solution: '아이가 고집부릴 때 즉각적인 훈계보다 "지금 많이 속상했구나"라고 감정을 먼저 읽어준 뒤 3초간 침묵하며 진정할 시간을 주세요.',
      parentHealingItem: PARENT_HEALING_PRODUCTS.level5,
      desc: '아이와 부모 모두 주관과 에너지가 넘쳐 매일이 다이내믹한 챌린지예요! 명확한 규칙과 신체 놀이가 필수입니다.',
    };
  } else if (diff === 2 || diff === 3) {
    return {
      score: 80,
      grade: 'LEVEL 4',
      badge: '에너지 불균형',
      icon: '⚡',
      level: '상 (체력 조율형)',
      barColor: '#EA580C',
      summary: '아이의 폭발적인 활동량을 부모의 체력이 따라가며 조율해야 하는 타입이에요!',
      synergy: '아이의 빠른 반응과 텐션에 맞춰주느라 부모의 에너지가 쉽게 방전될 수 있습니다.',
      solution: '"안 돼!"라는 단정적 제지 대신 "신발 먼저 신을까, 양말 먼저 신을까?"처럼 사소한 선택권을 주어 아이 스스로 통제감을 느끼게 유도하세요.',
      parentHealingItem: PARENT_HEALING_PRODUCTS.level4,
      desc: '아이의 왕성한 호기심을 부모가 맞춰주느라 에너지가 빠르게 소진될 수 있어요. 부모의 휴식 분담이 중요합니다.',
    };
  } else if (diff === 0) {
    return {
      score: 65,
      grade: 'LEVEL 3',
      badge: '지적 탐구',
      icon: '🔍',
      level: '중 (서로 배우는 탐구형)',
      barColor: '#D97706',
      summary: '서로의 표현 방식을 알아갈수록 끈끈한 단짝이 되는 관계예요!',
      synergy: '성향의 결이 조금 달라 초반에는 아이가 원하는 바를 세심하게 관찰하는 시간이 필요합니다.',
      solution: '아이가 놀이에 몰입해 있을 때 먼저 개입하기보다는, 5초간 지켜보며 아이의 행동과 표정을 조용히 따라 해주는 미러링 교감이 효과적입니다.',
      parentHealingItem: PARENT_HEALING_PRODUCTS.level3,
      desc: '서로 성향의 결이 달라 조율이 필요하지만, 대화와 관찰을 통해 둘도 없는 최고의 단짝이 될 수 있어요.',
    };
  } else if (diff === 1 || diff === 4) {
    return {
      score: 40,
      grade: 'LEVEL 2',
      badge: '포근한 완충재',
      icon: '🛡️',
      level: '하 (상호 보완 완충형)',
      barColor: '#0284C7',
      summary: '아이의 예민한 투정을 부모의 넓은 품으로 유연하게 감싸주는 조화예요!',
      synergy: '부모의 차분한 기운이 아이의 날 선 감각을 부드럽게 식혀주어 마찰이 적습니다.',
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
      barColor: '#059669',
      summary: '눈빛만 봐도 서로의 컨디션이 읽히는 환상의 평화 모드예요!',
      synergy: '기질의 궁합이 완벽하게 맞물려 큰 갈등 없이 자연스럽고 순탄하게 하루가 흘러갑니다.',
      solution: '평소 작은 행동에도 구체적인 칭찬과 지지를 아끼지 마시고, 부모의 확고한 신뢰를 다정한 말로 자주 표현해 주세요.',
      parentHealingItem: PARENT_HEALING_PRODUCTS.level1,
      desc: '눈빛만 봐도 아이의 마음이 읽히는 환상의 조화예요! 큰 마찰 없이 순탄하게 육아를 이어갈 수 있습니다.',
    };
  }
};

export default function Home() {
  // 🌟 [추가] 모드 전환: 'parenting' (기존 육아) | 'couple' (커플·예비부부)
  const [activeTabMode, setActiveTabMode] = useState<'parenting' | 'couple'>('parenting');

  // 🌟 [추가] 커플 모드 입력값 및 결과 상태
  const [partner1Name, setPartner1Name] = useState('');
  const [partner1Birth, setPartner1Birth] = useState('');
  const [partner2Name, setPartner2Name] = useState('');
  const [partner2Birth, setPartner2Birth] = useState('');
  const [coupleResult, setCoupleResult] = useState<any>(null);

  // 🌟 [추가] 커플 가상 2세 및 생활 분담 계산 함수
  const handleCalculateCouple = () => {
    if (!partner1Birth || !partner2Birth) {
      alert('두 분의 생년월일을 모두 입력해주세요!');
      return;
    }

    const p1Year = parseInt(partner1Birth.split('-')[0] || '2000', 10);
    const p2Year = parseInt(partner2Birth.split('-')[0] || '2000', 10);
    const p1Animal = ANIMALS[((p1Year - 4) % 12 + 12) % 12];
    const p2Animal = ANIMALS[((p2Year - 4) % 12 + 12) % 12];

    const p1Hash = partner1Birth.split('-').reduce((acc, cur) => acc + parseInt(cur || '0', 10), 0);
    const p2Hash = partner2Birth.split('-').reduce((acc, cur) => acc + parseInt(cur || '0', 10), 0);
    const today = new Date();
    const todayHash = today.getFullYear() + today.getMonth() + 1 + today.getDate();

    const elements = ['목(Wood) 🌱', '화(Fire) 🔥', '토(Earth) 🏔️', '금(Metal) ⚔️', '수(Water) 💧'];
    const p1Elem = elements[p1Hash % elements.length];
    const p2Elem = elements[p2Hash % elements.length];

    const babyList = [
      { title: '호기심 폭발 자유로운 에너자이저', desc: '둘의 추진력과 호기심만 쏙 빼닮아 잠시도 가만히 있지 않는 탐험가! 아기띠와 운동화는 필수입니다.', difficulty: '상 (체력전)', dadPercent: 52, momPercent: 48, icon: '🚀' },
      { title: '뚝심 있는 평화주의 먹보 천사', desc: '둘의 느긋하고 든든한 면모를 이어받아 잘 먹고 잘 자는 힐링 아기. 단, 고집부리기 시작하면 황소고집!', difficulty: '중 (멘탈 평온)', dadPercent: 58, momPercent: 42, icon: '🍯' },
      { title: '눈치 100단 두뇌형 보스 베이비', desc: '상황 파악이 빨라 부모 머리꼭대기에서 밀당하는 천재과 아기! 어설픈 속임수는 통하지 않습니다.', difficulty: '중상 (두뇌 싸움)', dadPercent: 45, momPercent: 55, icon: '🧠' },
      { title: '엄마아빠 껌딱지 애교 만점 사랑둥이', desc: '눈 맞춤 한 번에 심장을 녹이는 애교쟁이! 분리불안과 등센서가 살짝 있지만 미소 한 방에 사르르 녹습니다.', difficulty: '중상 (안아주기 지옥)', dadPercent: 35, momPercent: 65, icon: '💖' },
    ];

    const selectedBaby = babyList[(p1Hash + p2Hash) % babyList.length];
    const chemistryScore = 75 + ((p1Hash * 7 + p2Hash * 3) % 25);

    const isP1Turn = (todayHash + p1Hash) % 2 === 0;
    const chore = isP1Turn
      ? { leader: partner1Name || '첫 번째 분', role: '오늘의 데이트 코스 & 저녁 메뉴 결정권자 (설거지 면제권 획득!)', desc: '오늘 우주의 주도권 기운이 강합니다. 망설이지 말고 결단을 내려주세요!' }
      : { leader: partner2Name || '두 번째 분', role: '오늘의 힐링 수혜자 (상대방의 풀케어를 누리는 날)', desc: '상대방이 이끄는 대로 편안하게 맛있는 음식과 휴식을 즐기시면 됩니다.' };

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
  };

  // 🌟 [추가] 인스타 스토리용 Canvas 이미지 다운로드 함수
  const handleDownloadCoupleCard = () => {
    if (!coupleResult) return;
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1050;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawRoundRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y + x, y, r);
      ctx.closePath();
    };

    const bgGrad = ctx.createLinearGradient(0, 0, 800, 1050);
    bgGrad.addColorStop(0, '#FFF1F2');
    bgGrad.addColorStop(0.5, '#FDF4FF');
    bgGrad.addColorStop(1, '#EEF2FF');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 800, 1050);

    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(15, 23, 42, 0.08)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 15;
    drawRoundRect(40, 40, 720, 970, 32);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.fillStyle = '#E11D48';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ 아기속풀이 PRO · 60갑자 커플 & 가상 2세 도감', 400, 95);

    ctx.fillStyle = '#0F172A';
    ctx.font = '900 32px sans-serif';
    ctx.fillText('우리의 가상 2세 & 오행 궁합', 400, 145);

    ctx.fillStyle = '#F8FAFC';
    drawRoundRect(80, 185, 640, 180, 24);
    ctx.fill();

    ctx.font = '56px sans-serif';
    ctx.fillText(coupleResult.p1AnimalIcon, 230, 275);
    ctx.fillText('❤️', 400, 275);
    ctx.fillText(coupleResult.p2AnimalIcon, 570, 275);

    ctx.font = 'bold 20px sans-serif';
    ctx.fillStyle = '#1E293B';
    ctx.fillText(`${partner1Name || '예비 신랑'} (${coupleResult.p1Animal}띠)`, 230, 325);
    ctx.fillText(`${partner2Name || '예비 신부'} (${coupleResult.p2Animal}띠)`, 570, 325);

    ctx.font = 'bold 15px sans-serif';
    ctx.fillStyle = '#E11D48';
    ctx.fillText(coupleResult.p1Elem, 230, 348);
    ctx.fillStyle = '#4F46E5';
    ctx.fillText(coupleResult.p2Elem, 570, 348);

    const babyGrad = ctx.createLinearGradient(80, 395, 720, 680);
    babyGrad.addColorStop(0, '#FFFBEB');
    babyGrad.addColorStop(1, '#FFF7ED');
    ctx.fillStyle = babyGrad;
    drawRoundRect(80, 395, 640, 265, 24);
    ctx.fill();

    ctx.fillStyle = '#9A3412';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(`👶 FUTURE BABY · 난이도: ${coupleResult.baby.difficulty}`, 400, 440);

    ctx.font = '54px sans-serif';
    ctx.fillText(coupleResult.baby.icon, 400, 515);

    ctx.fillStyle = '#0F172A';
    ctx.font = '900 24px sans-serif';
    ctx.fillText(coupleResult.baby.title, 400, 565);

    ctx.fillStyle = '#475569';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(`${partner1Name || '나'} 성향 ${coupleResult.baby.dadPercent}%  |  ${partner2Name || '상대방'} 성향 ${coupleResult.baby.momPercent}%`, 400, 620);

    ctx.fillStyle = '#F1F5F9';
    drawRoundRect(80, 685, 640, 195, 24);
    ctx.fill();

    ctx.fillStyle = '#4F46E5';
    ctx.font = 'bold 19px sans-serif';
    ctx.fillText(`⚖️ 오늘의 생활 주도권 (케미스트리 ${coupleResult.chemistryScore}점)`, 400, 730);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(`👉 ${coupleResult.chore.leader}`, 400, 775);

    ctx.fillStyle = '#E11D48';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(coupleResult.chore.role, 400, 815);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '15px sans-serif';
    ctx.fillText('baby-sokpuli.vercel.app', 400, 955);

    const link = document.createElement('a');
    link.download = `아기속풀이_커플2세도감_${partner1Name || '커플'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<'form' | 'result'>('form');

  const cardRef = useRef<HTMLDivElement>(null);
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

  // 🔮 타로 모달 및 상태
  const [isTarotModalOpen, setIsTarotModalOpen] = useState(false);
  const [tarotSelectedCard, setTarotSelectedCard] = useState<TarotCardItem | null>(null);
  const [isTarotAnalyzing, setIsTarotAnalyzing] = useState(false);
  const [tarotCountdown, setTarotCountdown] = useState<number | null>(null);
  const [isTarotRevealed, setIsTarotRevealed] = useState(false);
  const [tarotImgError, setTarotImgError] = useState(false);
  const tarotIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const tarotTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    bullets: string[];
    highlightTag: string;
    highlightTitle: string;
    isLeap: boolean;
    isWonderLeap: boolean;
    dDayText: string;
    currentLocation: string;
  }>({
    badge: '제4도약기 구간',
    mainTitle: '마의 19주 폭풍 구간이에요',
    bullets: [
      '아기의 두뇌 신경망이 새로운 세상을 배우며 낯설어하는 시기예요.',
      '이유 없는 울음과 잠투정은 뇌가 쑥쑥 크고 있다는 건강한 증거랍니다.',
      '엄마 아빠의 육아 잘못이 절대 아니니 마음 편히 포근하게 안아주세요.',
    ],
    highlightTag: '도약기 폭풍 탈출 디데이',
    highlightTitle: '앞으로 10일 뒤(10월 28일)에 맑은 날이 찾아와요',
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

  const handleDateChange = (value: string, setter: (val: string) => void, fieldKey: 'birthDate' | 'dueDate' | 'momBirth' | 'dadBirth' | 'parentBirth') => {
    const cleanNumbers = value.replace(/[^0-9]/g, '').slice(0, 8);
    let formatted = cleanNumbers;
    if (cleanNumbers.length >= 5 && cleanNumbers.length <= 6) {
      formatted = `${cleanNumbers.slice(0, 4)}.${cleanNumbers.slice(4)}`;
    } else if (cleanNumbers.length >= 7) {
      formatted = `${cleanNumbers.slice(0, 4)}.${cleanNumbers.slice(4, 6)}.${cleanNumbers.slice(6, 8)}`;
    }
    setter(formatted);

    if (fieldKey === 'birthDate' && errors.birthDate) {
      setErrors((prev) => ({ ...prev, birthDate: undefined }));
    }
    if (fieldKey === 'dueDate' && errors.dueDate) {
      setErrors((prev) => ({ ...prev, dueDate: undefined }));
    }
    if (fieldKey === 'momBirth' && chemiErrors.mom) {
      setChemiErrors((prev) => ({ ...prev, mom: undefined }));
    }
    if (fieldKey === 'dadBirth' && chemiErrors.dad) {
      setChemiErrors((prev) => ({ ...prev, dad: undefined }));
    }
    if (fieldKey === 'parentBirth' && parentMatchError) {
      setParentMatchError(undefined);
    }
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('baby_profiles');
    if (saved) {
      try {
        const parsed: BabyProfile[] = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          setProfiles(parsed);
          const first = parsed[0];
          setActiveProfileId(first.id);
          applyProfileToState(first);
          runAdaptiveEngine(first.birthDate, first.dueDate);
          setStep('result');
          return;
        }
      } catch (e) {
        console.error('다자녀 프로필 로드 실패', e);
      }
    }
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      setPushSubscribed(true);
      setTarotPushSubscribed(true);
    }
  }, []);

  const getTodayDateString = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  // 🌟 아이별 독립 타로 캐시 키 생성기
  const getTarotStorageKey = (profileId: string | null) => {
    const todayStr = getTodayDateString();
    const targetId = profileId || (name.trim() ? `child_${name.trim()}` : 'guest_child');
    return `daily_tarot_${todayStr}_${targetId}`;
  };

  // 🌟 타로 모달 열기: 현재 선택된 아이 기준으로 격리 조회
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
    setIsTarotModalOpen(true);
  };

  // 🌟 타로 카드 선택 및 저장: 현재 선택된 아이 전용 키에 보존
  const handleSelectTarotCard = (cardIdx: number) => {
    if (isTarotRevealed || isTarotAnalyzing) return;

    trackEvent('click_pick_tarot', 'Engagement', `타로 카드 선택 (${cardIdx}번)`);
    setIsTarotAnalyzing(true);
    setTarotCountdown(15);
    setTarotImgError(false);

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
    }, 15000);
  };

  const handleCloseTarotModal = () => {
    if (tarotIntervalRef.current) clearInterval(tarotIntervalRef.current);
    if (tarotTimeoutRef.current) clearTimeout(tarotTimeoutRef.current);
    setIsTarotModalOpen(false);
    setIsTarotAnalyzing(false);
    setTarotCountdown(null);
  };

  const handleOpenChemiModal = () => {
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

  const applyProfileToState = (profile: BabyProfile) => {
    setName(profile.name);
    setGender(profile.gender);
    setBirthDate(profile.birthDate);
    setBirthTime(profile.birthTime);
    setIsUnknownTime(profile.isUnknownTime);
    setDueDate(profile.dueDate);
  };

  // 🌟 아이 탭 선택 시 타로 상태 초기화 연동
  const handleSelectChild = (profile: BabyProfile) => {
    setActiveProfileId(profile.id);
    applyProfileToState(profile);
    runAdaptiveEngine(profile.birthDate, profile.dueDate);

    setTarotSelectedCard(null);
    setIsTarotRevealed(false);
    setIsTarotAnalyzing(false);

    setStep('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 🌟 다른 아이 추가 시 타로 상태 초기화 연동
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
        setActiveProfileId(null);
        setName('');
        setGender('boy');
        setBirthDate('');
        setBirthTime('');
        setIsUnknownTime(false);
        setDueDate('');
        setErrors({});
        setParentingDifficulty(null);
        setStep('form');
      }
    }
  };

  const handleSubscribeNotification = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('현재 브라우저는 웹 알림 기능을 지원하지 않습니다.');
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setPushSubscribed(true);
        trackEvent('subscribe_web_push', 'Engagement', '성장 알림 구독 완료');
        new Notification('아기속풀이 성장 알림이 켜졌어요!', {
          body: `${name || '아이'}의 다음 도약기 D-Day와 매일 자정 육아 날씨를 배달해 드릴게요 💌`,
          icon: '/favicon.ico',
        });
      } else {
        alert('알림 권한이 차단되어 있습니다. 브라우저 설정에서 알림을 허용해주세요.');
      }
    } catch (e) {
      console.error(e);
      alert('알림 등록 중 일시적인 오류가 발생했습니다.');
    }
  };

  // 🌟 매일 자정 타로 갱신 알림 구독 핸들러
  const handleSubscribeTarotPush = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('현재 브라우저는 웹 알림 기능을 지원하지 않습니다.');
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setTarotPushSubscribed(true);
        trackEvent('subscribe_tarot_push', 'Engagement', '타로 갱신 알림 구독 완료');
        new Notification('🔮 육아 타로 운세 알림이 등록되었습니다!', {
          body: `매일 자정 새로운 우주의 기운과 ${name || '우리 아이'}의 속마음 카드를 배달해 드릴게요 ✨`,
          icon: '/favicon.ico',
        });
      } else {
        alert('알림 권한이 차단되어 있습니다. 브라우저 설정에서 알림을 허용해주세요.');
      }
    } catch (e) {
      console.error(e);
      alert('알림 등록 중 일시적인 오류가 발생했습니다.');
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
            link: {
              mobileWebUrl: currentUrl,
              webUrl: currentUrl,
            },
          },
        });
        return;
      } catch (e) {
        console.error('카카오 공유 실패, 폴백 진행', e);
      }
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareDesc,
          url: currentUrl,
        });
        return;
      } catch (err) {
        console.log('공유 취소됨');
      }
    }

    navigator.clipboard.writeText(`${shareTitle}\n${shareDesc}\n${currentUrl}`);
    alert('결과 링크가 복사되었습니다! 카카오톡 대화방이나 인스타에 붙여넣어 공유해보세요 💌');
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
          bullets: [
            '아기의 두뇌 신경망이 새로운 세상을 배우며 낯설어하는 시기예요.',
            '이유 없는 울음과 잠투정은 뇌가 쑥쑥 크고 있다는 건강한 증거랍니다.',
            '엄마 아빠의 육아 잘못이 절대 아니니 마음 편히 포근하게 안아주세요.',
          ],
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
          bullets: [
            '아기가 배운 세상을 머릿속에 정리하며 편안하게 쉬어가는 달콤한 타이밍이에요.',
            '엄마 아빠도 밀린 낮잠을 자며 에너지를 든든하게 충전해 두세요.',
            nextLeap ? `다음 도약기는 약 D-${dDayNext}일 뒤에 찾아올 예정이에요.` : '원더윅스 주요 도약기를 멋지게 지나고 있어요.',
          ],
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
        bullets: [
          '신생아 도약기를 멋지게 거치고, 이제 자기 생각과 취향이 분명해지는 시기예요.',
          scoreCuriosity >= 80
            ? '궁금한 게 너무 많아 고집을 부릴 땐, 통제보다 "이거 할래, 저거 할래?" 선택권을 주면 신나게 따라와요.'
            : '활동 에너지가 넘칠 땐 하루 30분 신나는 바깥 놀이로 땀을 흘려주면 천사 모드로 변신해요.',
          '떼쓰기는 못된 버릇이 아니라 자기표현을 멋지게 배우고 있다는 즐거운 성장 신호예요.',
        ],
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
        bullets: [
          '학교와 친구들 속에서 나만의 멋진 개성과 관심사를 찾아가는 멋진 시기예요.',
          scoreCuriosity >= 80
            ? '직접 해보는 걸 좋아해서 주입식 설명보다 "네 생각은 어때?"라고 물어볼 때 눈빛이 반짝여요.'
            : '친구와의 소소한 고민은 좋아하는 취미나 운동으로 가볍게 털어내도록 응원해 주세요.',
          '오늘 있었던 일 한마디를 다정하게 들어주는 것만으로도 아이의 마음은 든든해집니다.',
        ],
        highlightTag: '마음 톡톡 코칭',
        highlightTitle: `${jiji.animal}띠 집중법: 스스로 해냈을 때 아낌없이 엄지 척 해주기`,
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

    if (!name.trim()) {
      newErrors.name = '아이 이름(태명)을 입력해주세요!';
    }

    const birthCheck = validateDateString(birthDate, {
      allowFuture: false,
      minYear: 2000,
      maxYear: new Date().getFullYear(),
      fieldName: '생년월일',
    });
    if (!birthCheck.isValid) {
      newErrors.birthDate = birthCheck.errorMsg;
    }

    if (dueDate.trim().length > 0) {
      const dueCheck = validateDateString(dueDate, {
        allowFuture: true,
        minYear: 2000,
        maxYear: new Date().getFullYear() + 1,
        fieldName: '출산 예정일',
      });
      if (!dueCheck.isValid) {
        newErrors.dueDate = dueCheck.errorMsg;
      }
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

    setStep('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseChemiModal = () => {
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    if (countdownTimeoutRef.current) clearTimeout(countdownTimeoutRef.current);
    if (clashAnimationRef.current) clearInterval(clashAnimationRef.current);
    setIsChemiModalOpen(false);
    setCountdown(null);
    setIsAnalyzingChemi(false);
  };

  const handleCalculateChemi = (e: React.FormEvent) => {
    e.preventDefault();

    if (isAlreadyJudgedToday) {
      alert('오행 법정의 판결은 하루에 단 한 번만 선고됩니다. 내일 자정 새로운 기운으로 리셋돼요!');
      return;
    }

    const newChemiErrors: { mom?: string; dad?: string } = {};

    const momCheck = validateDateString(momBirth, {
      allowFuture: false,
      minYear: 1950,
      maxYear: new Date().getFullYear(),
      fieldName: '엄마 생년월일',
    });
    if (!momCheck.isValid) {
      newChemiErrors.mom = momCheck.errorMsg;
    }

    const dadCheck = validateDateString(dadBirth, {
      allowFuture: false,
      minYear: 1950,
      maxYear: new Date().getFullYear(),
      fieldName: '아빠 생년월일',
    });
    if (!dadCheck.isValid) {
      newChemiErrors.dad = dadCheck.errorMsg;
    }

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

      const today = new Date();
      const todaySum = today.getFullYear() + (today.getMonth() + 1) + today.getDate();

      const momDigits = momBirth.replace(/[^0-9]/g, '');
      const dadDigits = dadBirth.replace(/[^0-9]/g, '');
      const babyDigits = birthDate ? birthDate.replace(/[^0-9]/g, '') : '20240101';

      const momSum = momDigits.split('').reduce((a, c) => a + parseInt(c, 10), 0);
      const dadSum = dadDigits.split('').reduce((a, c) => a + parseInt(c, 10), 0);
      const babySum = babyDigits.split('').reduce((a, c) => a + parseInt(c, 10), 0);

      const momScore = 78 + ((momSum + babySum + todaySum) % 20);
      const dadScore = 78 + ((dadSum + babySum + todaySum) % 20);
      const best = momScore >= dadScore ? '엄마' : '아빠';

      const summary =
        best === '엄마'
          ? '오늘 하루는 엄마의 섬세한 기운이 집안의 평화와 아기의 텐션을 지키는 최적의 컨디션입니다!'
          : '오늘 하루는 아빠의 활력 넘치는 에너지가 아기의 호기심을 폭발시키는 최고의 보약입니다!';

      const reason =
        best === '엄마'
          ? `오늘(${today.getMonth() + 1}월 ${today.getDate()}일) 흐르는 오행의 기운이 엄마의 따뜻한 수(水)·목(木) 에너지와 완벽한 조화를 이루어, 아이가 칭얼거릴 때 가장 편안하게 안아줄 수 있는 날입니다.`
          : `오늘(${today.getMonth() + 1}월 ${today.getDate()}일) 흐르는 오행의 기운이 아빠의 든든한 화(火)·토(土) 에너지와 맞물려, 아이의 지치지 않는 에너지를 신나게 받아줄 수 있는 최고의 날입니다.`;

      const finalResult = {
        momScore,
        dadScore,
        best,
        summary,
        reason,
      };

      setChemiResult(finalResult);
      setIsAnalyzingChemi(false);
      setCountdown(null);
      setIsAlreadyJudgedToday(true);

      const todayStr = getTodayDateString();
      localStorage.setItem(`duty_verdict_${todayStr}`, JSON.stringify(finalResult));
    }, 15000);
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
    }, 15000);
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
        pixelRatio: 2,
        backgroundColor: '#FAF5EA',
      });

      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

      if (isIOS) {
        setIosSavedImageUrl(dataUrl);
      } else {
        const link = document.createElement('a');
        link.download = `${name || '아이'}_기질카드_baby-sokpuli.png`;
        link.href = dataUrl;
        link.click();
      }
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

  const babyDisplayName = name.trim() ? `${name.trim()}의` : '우리 아이의';

  return (
    <main className="min-h-screen bg-[#E9ECEF] flex justify-center py-0 sm:py-8 font-sans antialiased text-slate-900">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes tickerLoop {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker-marquee {
          display: inline-flex;
          width: max-content;
          animation: tickerLoop 24s linear infinite;
        }
        .animate-ticker-marquee:hover {
          animation-play-state: paused;
        }
      `}} />

      <div className="w-full max-w-md bg-[#FFFFFF] min-h-screen sm:min-h-0 sm:rounded-[36px] shadow-[0_20px_40px_rgba(0,0,0,0.06)] flex flex-col p-6 relative border border-slate-100">
        
        {/* 상단 헤더 */}
        <header className="pt-2 pb-3 text-center">
          <div className="inline-block bg-slate-100 text-slate-700 px-4 py-1 rounded-full text-xs sm:text-sm font-bold tracking-tight mb-2.5">
            실시간 60갑자 아기 도감
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 break-keep">
            우리 아이 기질카드
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium break-keep">
            가볍게 쏙 뽑아보는 우리 아이 속풀이
          </p>
        </header>
{/* 🍼 육아 모드 / 💍 커플 모드 전환 탭 */}
<div className="flex bg-slate-200/90 p-1.5 rounded-2xl shadow-inner my-4">
  <button
    type="button"
    onClick={() => setActiveTabMode('parenting')}
    className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 ${
      activeTabMode === 'parenting'
        ? 'bg-white text-slate-900 shadow-md scale-[1.02]'
        : 'text-slate-500 hover:text-slate-800'
    }`}
  >
    <span>🍼</span> 육아 모드 (기질 & 타로)
  </button>
  <button
    type="button"
    onClick={() => setActiveTabMode('couple')}
    className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 ${
      activeTabMode === 'couple'
        ? 'bg-rose-500 text-white shadow-md scale-[1.02]'
        : 'text-slate-500 hover:text-slate-800'
    }`}
  >
    <span>💍</span> 커플·예비부부 모드
  </button>
</div>

{/* 기존 육아 콘텐츠 전체 래핑 시작 */}
{activeTabMode === 'parenting' && (
  <div className="space-y-6">
        {/* 🌟 1. 끊김 없는 무한 롤링 티커 배너 (2벌 100% 미러링) */}
        <div className="mb-4 overflow-hidden whitespace-nowrap bg-slate-50 border border-slate-100 rounded-2xl py-2 flex items-center shadow-2xs">
          <div className="animate-ticker-marquee flex items-center text-xs sm:text-sm font-semibold text-slate-600 select-none">
            
            {/* 세트 1 */}
            <div className="inline-flex items-center space-x-8 pr-8">
              <span className="flex items-center space-x-1.5">
                <span>💌</span>
                <span>{visitor.message}</span>
              </span>
              <span className="text-slate-300">✦</span>
              <span className="flex items-center space-x-1.5">
                <span>🍼</span>
                <span>신생아부터 어린이까지 쏙 뽑아보는 60갑자 성향 분석</span>
              </span>
              <span className="text-slate-300">✦</span>
              <span className="flex items-center space-x-1.5">
                <span>🔮</span>
                <span>오늘 밤 통잠 잘 수 있을까? 오늘의 육아 타로 오픈!</span>
              </span>
              <span className="text-slate-300">✦</span>
            </div>

            {/* 세트 2 */}
            <div className="inline-flex items-center space-x-8 pr-8">
              <span className="flex items-center space-x-1.5">
                <span>💌</span>
                <span>{visitor.message}</span>
              </span>
              <span className="text-slate-300">✦</span>
              <span className="flex items-center space-x-1.5">
                <span>🍼</span>
                <span>신생아부터 어린이까지 쏙 뽑아보는 60갑자 성향 분석</span>
              </span>
              <span className="text-slate-300">✦</span>
              <span className="flex items-center space-x-1.5">
                <span>🔮</span>
                <span>오늘 밤 통잠 잘 수 있을까? 오늘의 육아 타로 오픈!</span>
              </span>
              <span className="text-slate-300">✦</span>
            </div>

          </div>
        </div>

        {/* 다자녀 탭 바 */}
        {profiles.length > 0 && (
          <div className="mb-4 pb-2 flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
            <span className="text-xs font-bold text-slate-400 whitespace-nowrap mr-1">
              등록된 아이:
            </span>
            {profiles.map((p) => {
              const isActive = activeProfileId === p.id && step === 'result';
              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectChild(p)}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold flex items-center space-x-1.5 cursor-pointer transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="break-keep">{p.name}</span>
                  <button
                    onClick={(e) => handleDeleteChild(p.id, e)}
                    className="text-xs opacity-60 hover:opacity-100 ml-0.5"
                    aria-label={`${p.name} 삭제`}
                  >
                    ✕
                  </button>
                </div>
              );
            })}
            <button
              onClick={handleAddNewChild}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold border border-dashed transition-all flex items-center space-x-1 whitespace-nowrap ${
                step === 'form' && activeProfileId === null
                  ? 'border-slate-800 bg-slate-50 text-slate-900 font-extrabold'
                  : 'border-slate-300 text-slate-500 hover:border-slate-500 hover:text-slate-800'
              }`}
            >
              <span>+ 다른 아이 추가</span>
            </button>
          </div>
        )}

        {/* 오늘의 오행 기운 배너 */}
        {step === 'form' && (
          <div className="mb-4 bg-slate-900 text-white p-4.5 rounded-2xl shadow-sm relative overflow-hidden flex items-center justify-between">
            <div className="space-y-1.5 relative z-10 break-keep">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-widest block">
                TODAY&apos;S ELEMENT VIBE
              </span>
              <h2 className="text-sm sm:text-base font-black">{todayGuide.title}</h2>
              <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed break-keep">
                {todayGuide.desc}
              </p>
            </div>
            <div className="text-3xl relative z-10 pl-2 flex-shrink-0">✨</div>
          </div>
        )}

        {/* STEP 1: 입력 폼 */}
        {step === 'form' && (
          <form onSubmit={handleSubmit} noValidate className="space-y-4 flex-1 flex flex-col justify-between pt-1">
            <div className="space-y-4">
              
              <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-100 shadow-2xs space-y-2">
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
                  <p className="text-xs sm:text-sm font-semibold text-rose-600 mt-1 break-keep">⚠️ {errors.name}</p>
                )}
              </div>

              <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-100 shadow-2xs space-y-2">
                <label className="block text-xs sm:text-sm font-bold text-slate-800 break-keep">
                  성별 <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
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

              <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-100 shadow-2xs space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs sm:text-sm font-bold text-slate-800 break-keep">
                    태어난 날짜 <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-xs font-semibold text-slate-500 bg-white px-2.5 py-1 rounded border border-slate-200">
                    숫자 8자리
                  </span>
                </div>
                <input
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
                  <p className="text-xs sm:text-sm font-semibold text-rose-600 mt-1 break-keep">⚠️ {errors.birthDate}</p>
                )}
              </div>

              <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-100 shadow-2xs space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs sm:text-sm font-bold text-slate-800 break-keep">태어난 시간 (선택)</label>
                  <label className="flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-slate-500 cursor-pointer">
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
                  className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm font-semibold ${
                    isUnknownTime ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' : 'bg-white text-slate-900 border-slate-200'
                  }`}
                />
              </div>

              <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-100 shadow-2xs space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs sm:text-sm font-bold text-slate-800 break-keep">출산 당시 예정일 (선택)</label>
                  <span className="text-xs font-semibold text-slate-500 bg-white px-2.5 py-1 rounded border border-slate-200">
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
                <p className="text-xs text-slate-500 leading-relaxed pt-0.5">
                  ※ 원더윅스 도약기는 아기가 엄마 배 속에서부터 자란 기간을 고려해, 출생일 대신 <b>출산 예정일</b>을 기준으로 계산합니다. (모르시면 비워두셔도 괜찮아요)
                </p>
                {errors.dueDate && (
                  <p className="text-xs sm:text-sm font-semibold text-rose-600 mt-1 break-keep">⚠️ {errors.dueDate}</p>
                )}
              </div>

            </div>

            {/* 🌟 2. 메인 3종 배너 (디자인 시스템 & 버튼 규격 완전 일치) */}
            <div className="pt-3 pb-1 space-y-3">
              <button
                type="submit"
                onClick={() => trackEvent('click_submit_form', 'Engagement', '기질카드 생성하기')}
                className="w-full py-4.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm sm:text-base shadow-sm active:scale-[0.98] transition-all flex items-center justify-center space-x-2 break-keep"
              >
                <span>✨ 우리 아이 기질카드 뽑아보기</span>
              </button>

              {/* [배너 1] 오늘의 육아 타로 배너 */}
              <div
                onClick={() => {
                  trackEvent('click_open_tarot', 'Engagement', '메인 오늘의 육아 타로 배너 클릭');
                  handleOpenTarotModal();
                }}
                className="w-full p-4.5 rounded-2xl bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-950 border border-purple-400/50 shadow-sm cursor-pointer hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-between text-white"
              >
                <div className="break-keep space-y-1">
                  <span className="text-[10px] font-extrabold text-purple-300 uppercase tracking-widest flex items-center space-x-1">
                    <span>🔮</span>
                    <span>TODAY&apos;S BABY TAROT</span>
                  </span>
                  <div className="text-sm font-black text-white">
                    {babyDisplayName} 속마음 타로 확인
                  </div>
                </div>
                <button
                  type="button"
                  className="w-20 sm:w-24 py-2 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-xs text-center whitespace-nowrap animate-pulse transition-all flex-shrink-0"
                >
                  타로뽑기
                </button>
              </div>

              {/* [배너 2] 육아 난이도 배너 */}
              <div 
                onClick={() => {
                  trackEvent('click_open_parent_match', 'Engagement', '부모-자녀 기질 비교 진단 모달 오픈');
                  setIsParentMatchModalOpen(true);
                }}
                className="w-full p-4.5 rounded-2xl bg-gradient-to-r from-[#FF5E3A] via-[#FF3B30] to-[#FF2A68] border border-white/40 shadow-sm cursor-pointer hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-between text-white"
              >
                <div className="break-keep space-y-1">
                  <span className="text-[10px] font-extrabold text-amber-200 uppercase tracking-widest flex items-center space-x-1">
                    <span>🔥</span>
                    <span>PARENT-CHILD MATCHING</span>
                  </span>
                  <div className="text-sm font-black text-white">
                    우리 아이 육아 난이도 측정
                  </div>
                </div>
                <button
                  type="button"
                  className="w-20 sm:w-24 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-xs text-center whitespace-nowrap animate-pulse transition-all flex-shrink-0"
                >
                  측정하기
                </button>
              </div>

              {/* [배너 3] 오행 판결소 배너 */}
              <div 
                onClick={() => {
                  trackEvent('click_open_court', 'Engagement', '오행판결소 모달 오픈');
                  handleOpenChemiModal();
                }}
                className="w-full p-4.5 rounded-2xl bg-slate-900 border border-slate-700 shadow-sm cursor-pointer hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-between text-white"
              >
                <div className="break-keep space-y-1">
                  <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest flex items-center space-x-1">
                    <span>⚖️</span>
                    <span>FIVE ELEMENTS COURT</span>
                  </span>
                  <div className="text-sm font-black text-white">
                    오늘의 육아 당번 뽑기 (오행 판결소)
                  </div>
                </div>
                <button
                  type="button"
                  className="w-20 sm:w-24 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-xs text-center whitespace-nowrap animate-pulse transition-all flex-shrink-0"
                >
                  입장하기
                </button>
              </div>

            </div>
          </form>
        )}

        {/* STEP 2: 결과 카드 화면 */}
        {step === 'result' && (
          <div className="space-y-6 pb-4 pt-1">
            
            <div
              ref={cardRef}
              className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden border border-slate-200 space-y-4"
            >
              <div className="w-full flex justify-between items-center pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-extrabold bg-slate-900 text-white px-2.5 py-1 rounded-md">
                    기질도감
                  </span>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight break-keep">
                    {name}
                  </h2>
                </div>

                <div className="flex items-center space-x-1">
                  <span className="text-xs sm:text-sm font-extrabold text-slate-800 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: elementTag.color }} />
                    <span>{elementTag.name}의 기운</span>
                  </span>
                </div>
              </div>

              <BabyAnimalHybridMascot
                cheonganIndex={characterCheonganIndex}
                animalIndex={characterAnimalIndex}
                colorLabel={colorLabel}
                animalModifier={animalModifier}
                characterTitle={characterTitle}
              />

              <div className="w-full bg-slate-50 py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-bold text-slate-800 flex justify-between items-center border border-slate-100">
                <span>🎂 {calculatedAgeText}</span>
                <span className="break-keep font-extrabold text-slate-900">📌 {solutionData.badge.split('·')[1]?.trim() || solutionData.badge}</span>
              </div>

              <div className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-xs sm:text-sm font-extrabold text-slate-900 leading-relaxed break-keep">
                &ldquo;{oneLineSummary}&rdquo;
              </div>

              {parentingDifficulty && (
                <div className="w-full p-4.5 rounded-2xl border text-left space-y-2 bg-slate-50 border-slate-200 shadow-2xs break-keep">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                      부모-자녀 기질 비교 및 육아 난이도
                    </span>
                    <span className="text-xs font-black px-2.5 py-0.5 rounded bg-slate-900 text-white shadow-2xs font-mono">
                      난이도 점수: {parentingDifficulty.score}점 / 100점
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-black text-slate-900 flex items-center space-x-1.5">
                    <span>{parentingDifficulty.icon}</span>
                    <span>진단 결과: {parentingDifficulty.level}</span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">
                    {parentingDifficulty.summary}
                  </p>
                </div>
              )}

              <div className="w-full space-y-4 bg-slate-50/80 rounded-2xl p-4 text-left border border-slate-200/80 shadow-2xs">
                <div className="text-sm sm:text-base font-black text-slate-900 pb-1.5 border-b border-slate-200">
                  우리 아이 핵심 기질 성향 분석
                </div>

                <TemperamentStatBar
                  id="curiosity"
                  categoryTag="탐색"
                  name="우리 아이 호기심 레벨"
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
                  name="일일 활동 에너자이저"
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
                      : '새로운 환경이나 감정 자극에 대해 아이가 느끼는 섬세한 감각 반응 수준이에요.',
                    levelInterpretation: `${scores.fussy}점은 현재 비교적 차분하고 안정적인 정서 상태를 유지하는 편안한 구간이에요.`,
                    careTip: '갑작스러운 보챔이나 고집은 성장의 정상 신호이니 따뜻한 눈빛으로 공감해 주세요.',
                  }}
                />
              </div>

              <div className="w-full pt-3 border-t border-slate-100 flex justify-between items-center text-xs sm:text-sm text-slate-600 font-bold font-mono">
                <span>{jijiHanja} {animalName}띠 아기 도감</span>
                <span className="tracking-widest">baby-sokpuli</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <button
                onClick={handleDownloadCard}
                disabled={isDownloading}
                className="w-full py-4.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-sm sm:text-base font-black shadow-sm transition-all flex items-center justify-center space-x-2 active:scale-95 break-keep"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>{isDownloading ? '기질 카드 생성 중...' : '우리 아이 기질 카드 이미지로 저장하기'}</span>
              </button>
              <p className="text-[11px] text-slate-500 font-medium text-center">
                💡 사진첩에 저장한 뒤 인스타그램 스토리나 피드에 공유해보세요!
              </p>
            </div>

            {/* 🌟 결과 화면 전용 배너 2종 (통일된 디자인 시스템 적용) */}
            <div className="space-y-3 pt-1">
              
              {/* 타로 배너 */}
              <div
                onClick={() => {
                  trackEvent('click_open_tarot_result', 'Engagement', '결과페이지 오늘의 육아 타로 배너 클릭');
                  handleOpenTarotModal();
                }}
                className="w-full p-4.5 rounded-2xl bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-950 border border-purple-400/50 shadow-sm cursor-pointer hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-between text-white"
              >
                <div className="break-keep space-y-1">
                  <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-widest flex items-center space-x-1">
                    <span>🔮</span>
                    <span>TODAY&apos;S BABY TAROT</span>
                  </span>
                  <div className="text-sm sm:text-base font-black text-white">
                    {babyDisplayName} 속마음 타로 확인
                  </div>
                  <p className="text-xs text-purple-200 font-medium">
                    오늘 밤 통잠 잘 수 있을까? 카드로 미리 엿보기
                  </p>
                </div>
                <button
                  type="button"
                  className="w-20 sm:w-24 py-2 bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-xs text-center whitespace-nowrap animate-pulse transition-all flex-shrink-0"
                >
                  타로뽑기
                </button>
              </div>

              {/* 육아 난이도 배너 */}
              <div 
                onClick={() => {
                  trackEvent('click_open_parent_match', 'Engagement', '부모-자녀 기질 비교 진단 모달 오픈');
                  setIsParentMatchModalOpen(true);
                }}
                className="w-full p-4.5 rounded-2xl bg-gradient-to-r from-[#FF5E3A] via-[#FF3B30] to-[#FF2A68] border border-white/40 shadow-sm cursor-pointer hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-between text-white"
              >
                <div className="break-keep space-y-1">
                  <span className="text-[10px] font-extrabold text-amber-200 uppercase tracking-widest flex items-center space-x-1">
                    <span>🔥</span>
                    <span>PARENT-CHILD MATCHING</span>
                  </span>
                  <div className="text-sm sm:text-base font-black text-white">
                    우리 아이 육아 난이도 측정
                  </div>
                  <p className="text-xs text-rose-100 font-medium">
                    엄마 vs 아빠 누가 더 매운맛일까? 케미 분석
                  </p>
                </div>
                <button
                  type="button"
                  className="w-20 sm:w-24 py-2 bg-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-xs text-center whitespace-nowrap animate-pulse transition-all flex-shrink-0"
                >
                  측정하기
                </button>
              </div>

            </div>

            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm text-slate-900 space-y-6 border border-slate-200">
              
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div className="space-y-0.5">
                  <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest block">
                    DAILY BRIEFING
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    오늘의 성장 노트
                  </h3>
                </div>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                  ※ 매일 갱신
                </span>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4.5 border border-slate-100 space-y-3 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base font-black text-slate-900">
                    원더윅스 분석
                  </span>
                  <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                    {solutionData.badge}
                  </span>
                </div>
                
                <hr className="border-slate-200/80 my-1" />

                <div className="text-xs sm:text-sm font-bold text-slate-800 bg-white border border-slate-200 p-3 rounded-xl shadow-2xs flex items-center space-x-2">
                  <span>원더윅스 여부</span><span className="text-slate-400">|</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${solutionData.isWonderLeap ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {solutionData.isWonderLeap ? 'O' : 'X'}
                  </span>
                </div>

                <div className="text-xs sm:text-sm font-bold text-slate-800 bg-white border border-slate-200 p-2.5 rounded-xl shadow-2xs">
                  <span>원더윅스 남은 기간</span><span className="text-slate-300 mx-2 font-normal">|</span>
                  {solutionData.dDayText}
                </div>

                <h4 className="text-sm sm:text-base font-black text-slate-900">
                  {solutionData.mainTitle}
                </h4>
                
                <ul className="text-xs sm:text-sm text-slate-700 font-medium space-y-2 leading-relaxed pl-1 break-keep">
                  {solutionData.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="font-extrabold text-slate-900 whitespace-nowrap">
                        {idx === 0 ? '[원인 분석]' : idx === 1 ? '[성장 신호]' : '[케어 팁]'}
                      </span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center space-x-3 shadow-2xs">
                  <span className="text-xl">{solutionData.isLeap ? '⏳' : '💡'}</span>
                  <div className="flex-1 break-keep">
                    <div className="text-xs font-bold text-slate-500">{solutionData.highlightTag}</div>
                    <div className="text-xs sm:text-sm font-black text-slate-900 mt-0.5">{solutionData.highlightTitle}</div>
                  </div>
                </div>

                <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl flex items-center justify-between">
                  <div className="text-xs font-bold text-indigo-950">
                    🔔 다음 발달 도약기 시작일에 알림 받기
                  </div>
                  <button
                    onClick={handleSubscribeNotification}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                      pushSubscribed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-2xs'
                    }`}
                  >
                    {pushSubscribed ? '✓ 알림 켜짐' : '알림 받기'}
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4.5 border border-slate-100 space-y-3 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base font-black text-slate-900">
                    오늘의 육아 날씨
                  </span>
                </div>

                <hr className="border-slate-200/80 my-1" />

                <div className="flex items-center justify-between space-x-2">
                  <div className="text-xs sm:text-sm font-black text-slate-900 break-keep">
                    {babyWeather.status}
                  </div>
                  <span className="text-3xl p-1 bg-white rounded-xl border border-slate-200 shadow-2xs flex-shrink-0">
                    {babyWeather.icon}
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
                  {babyWeather.tension}
                </p>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1 shadow-2xs">
                  <div className="text-xs font-bold text-slate-900">소소한 육아 꿀팁</div>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                    {babyWeather.tip}
                  </p>
                </div>
              </div>

              {/* 아이 기질 맞춤 충전 아이템 영역 */}
              <div className="bg-slate-50 rounded-2xl p-4.5 border border-slate-100 space-y-3 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base font-black text-slate-900 break-keep">
                    우리 아이 기질 맞춤 충전 아이템 [{jijiHanja}]
                  </span>
                </div>

                <hr className="border-slate-200/80 my-1" />

                <div className="flex items-center space-x-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 flex-shrink-0">
                    <HealingPotionIcon potionColor={potionData.color} />
                  </div>
                  <div className="break-keep flex-1">
                    <div className="text-xs font-bold text-slate-400">추천 아이템</div>
                    <div className="text-xs sm:text-sm font-black text-slate-900">{potionData.title}</div>
                    <div className="text-[11px] text-slate-500 font-medium">{potionData.subTitle}</div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="text-xs font-bold text-slate-900">
                    기질에 근거한 추천 이유 <span className="text-indigo-600 font-extrabold">[{elementTag.name}의 본성 연동]</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed break-keep bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                    우리 아이는 <b>{elementTag.name}</b> 기운을 타고나서 호기심({scores.curiosity}점)과 활동량({scores.energy}점)이 왕성해요! {potionData.guide} 이 아이템은 아이의 오행 본성을 편안하게 다독여주는 맞춤 처방입니다.
                  </p>
                </div>

                <div className="pt-2 space-y-1.5">
                  <a
                    href={potionData.link || SERVICE_LINKS.coupangDefault}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('click_coupang', 'Monetization', '성장노트 충전템 쿠팡 클릭')}
                    className="block w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm rounded-xl text-center transition-all shadow-2xs"
                  >
                    🛒 추천 보기
                  </a>
                  <p className="text-[10px] text-slate-400 font-medium text-center leading-tight">
                    ※ 이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
                  </p>
                </div>
              </div>

            </div>

            <div 
              onClick={() => {
                trackEvent('click_ai_teaser', 'Engagement', 'AI 심층보고서 티저 클릭');
                setIsAiReportModalOpen(true);
              }}
              className="rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm cursor-pointer hover:bg-slate-50 transition-all space-y-2 relative overflow-hidden break-keep"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-extrabold text-slate-600 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">
                  AI 분석 서비스
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-700 flex items-center space-x-0.5">
                  <span>목차 보기</span>
                  <span>→</span>
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-black text-slate-900">
                우리 아이 10년 성장 가이드 가볍게 읽어보기 (오픈 준비 중)
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                오행 본성과 소아 심리학을 결합한 프리미엄 훈육 가이드를 준비하고 있어요.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-900 bg-slate-900 p-5 text-center text-white shadow-sm relative overflow-hidden">
              <div className="inline-block bg-amber-400 text-slate-950 text-xs font-extrabold px-3.5 py-1 rounded-full mb-2.5 uppercase tracking-wider">
                ⚖️ FIVE ELEMENTS COURT
              </div>

              <h4 className="text-sm sm:text-base font-black tracking-tight break-keep text-white">
                오늘의 육아 당번 뽑기 (오행 판결소)
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-1.5 font-medium leading-relaxed break-keep">
                부모 생년월일과 오늘 날짜 오행 기운을 조합해 유쾌한 육아 당번을 판정해 드립니다.
              </p>

              <button
                onClick={() => {
                  trackEvent('click_open_court', 'Engagement', '오행판결소 모달 오픈');
                  handleOpenChemiModal();
                }}
                className="w-full mt-4 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl text-xs sm:text-sm font-black shadow-xs active:scale-[0.98] transition-all flex items-center justify-center break-keep"
              >
                ⚖️ 법정 입장 및 오늘 당번 가리기
              </button>
            </div>

            <div className="pt-2 space-y-3">
              <button
                onClick={() => {
                  trackEvent('click_add_child', 'Engagement', '다른 아이 추가');
                  handleAddNewChild();
                }}
                className="w-full py-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold rounded-2xl text-xs sm:text-sm transition-all shadow-2xs break-keep flex items-center justify-center space-x-1.5"
              >
                <span>➕</span>
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

          </div>
        )}

        {/* ======================================================= */}
        {/* 🔮 3. 타로 모달 (다자녀 분리 & 자정 갱신 알림 기능 탑재) */}
        {/* ======================================================= */}
        {isTarotModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
            <div className="w-full max-w-md bg-gradient-to-b from-[#110D23] via-[#0A0D17] to-[#120B24] rounded-t-3xl sm:rounded-3xl border border-amber-400/40 p-6 shadow-2xl space-y-4 max-h-[94vh] overflow-y-auto text-white">
              
              {/* 모달 헤더 */}
              <div className="flex justify-between items-center pb-3.5 border-b border-amber-400/20">
                <div>
                  <span className="text-xs font-black text-amber-300 uppercase tracking-widest block mb-0.5">
                    🔮 TODAY&apos;S BABY TAROT
                  </span>
                  <h3 className="text-lg font-black text-purple-100 break-keep">
                    오늘의 육아 속마음 타로
                  </h3>
                </div>
                <button
                  onClick={handleCloseTarotModal}
                  className="w-8 h-8 bg-white/10 border border-white/20 rounded-full text-xs font-bold text-white flex items-center justify-center hover:bg-white/20"
                >
                  ✕
                </button>
              </div>

              {isTarotAnalyzing ? (
                /* 15초 인터스티셜 수익화 화면 */
                <div className="py-8 text-center space-y-5 animate-fadeIn">
                  <div className="space-y-1.5">
                    <div className="w-16 h-16 mx-auto bg-slate-900 text-amber-300 rounded-full flex items-center justify-center text-xl font-black shadow-md border border-amber-400/40 animate-pulse">
                      {tarotCountdown !== null ? tarotCountdown : '✨'}초
                    </div>
                    <h4 className="text-base font-black text-white mt-2 break-keep">
                      아이의 오늘 기운과 카드를 매칭하는 중...
                    </h4>
                    <p className="text-sm text-purple-200 break-keep">
                      오늘 밤 통잠 여부와 아기의 귀여운 속마음을 읽어내고 있습니다!
                    </p>
                  </div>

                  <div className="w-full p-4.5 bg-black/50 border border-purple-400/30 rounded-2xl text-left text-white space-y-2.5 shadow-md">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-widest">
                        SPONSORED · 부모 충전소
                      </span>
                      <span className="text-[10px] text-slate-400">15초 후 타로 공개</span>
                    </div>
                    <p className="text-sm font-bold leading-snug break-keep text-purple-100">
                      카드 여는 동안 남매 유튜브 숏폼 구경 & 부모 힐링템 충전 ☕
                    </p>
                    <div className="flex space-x-2 pt-1">
                      <a
                        href={SERVICE_LINKS.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs sm:text-sm font-bold text-center transition-all shadow-xs"
                      >
                        ▶ 유튜브 숏폼
                      </a>
                      <a
                        href={SERVICE_LINKS.parentHealing}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs sm:text-sm font-bold text-center transition-all shadow-xs"
                      >
                        🛒 부모 힐링템 구경
                      </a>
                    </div>
                  </div>
                </div>
              ) : !isTarotRevealed ? (
                /* 카드 선택 대기 화면 */
                <div className="space-y-4 text-center">
                  <div className="p-4.5 bg-purple-950/70 rounded-2xl border border-purple-400/30 text-sm sm:text-base font-semibold text-purple-100 leading-relaxed break-keep shadow-inner">
                    💡 오늘 아이의 <span className="text-amber-300 font-extrabold">수면, 수유, 잠투정</span> 중 가장 궁금한 점을 마음속으로 3초간 떠올린 후, 마음에 와닿는 <span className="text-amber-300 font-extrabold">카드 한 장</span>을 터치해 보세요!
                  </div>

                  <div className="grid grid-cols-3 gap-3 py-4">
                    {[1, 2, 3].map((num) => (
                      <div
                        key={num}
                        onClick={() => handleSelectTarotCard(num)}
                        className="aspect-[3/4] bg-gradient-to-b from-indigo-950 via-[#191338] to-slate-950 rounded-2xl border-2 border-amber-400/70 flex flex-col items-center justify-center cursor-pointer shadow-lg hover:scale-105 active:scale-95 transition-all group"
                      >
                        <span className="text-3xl group-hover:scale-125 transition-transform drop-shadow">🔮</span>
                        <span className="text-xs font-black text-amber-300 mt-2 tracking-wide">선택하기</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs font-medium text-purple-200">
                    ※ 카드는 하루에 단 한 번만 뽑을 수 있으며, 자정에 리셋됩니다.
                  </p>
                </div>
              ) : (
                /* 🌟 타로 결과 화면 */
                tarotSelectedCard && (() => {
                  const displayKorTitle = tarotSelectedCard.korTitle || tarotSelectedCard.name?.split('(')[0]?.trim() || '18. 돌고래 샤우팅';
                  const displayEngSub = tarotSelectedCard.engSub || tarotSelectedCard.name?.split('(')[1]?.replace(')', '').trim() || 'The Judgment';

                  return (
                    <div className="space-y-4 text-center animate-fadeIn">
                      
                      <div className="text-center">
                        <span className="inline-block text-xs font-bold text-amber-300 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30">
                          12간지 기질 심볼 • {tarotSelectedCard.animal || '호랑이'}
                        </span>
                      </div>

                      {/* 럭셔리 와이드 골드 타로 카드 액자 */}
                      <div className="relative w-64 mx-auto rounded-2xl p-[3px] bg-gradient-to-b from-[#F7E5A9] via-[#AA7922] to-[#E3BE63] shadow-[0_12px_35px_rgba(0,0,0,0.85)]">
                        <div className="relative w-full rounded-[13px] bg-[#070B16] p-3 flex flex-col items-center border border-[#FFE799]/40 overflow-hidden">
                          
                          {/* 상단 타로 각인 헤더 */}
                          <div className="w-full flex justify-between items-center px-1 pb-1.5 text-[#E6CA65] text-[10px] tracking-widest opacity-90 select-none font-serif">
                            <span>✦ ☽</span>
                            <span className="font-extrabold tracking-widest">BABY TAROT</span>
                            <span>☾ ✦</span>
                          </div>

                          {/* 캐릭터 이미지 영역 */}
                          <div className="w-full aspect-square rounded-xl overflow-hidden border border-[#D4AF37]/50 shadow-inner bg-[#03060E] relative flex items-center justify-center">
                            {!tarotImgError ? (
                              <img
                                src={tarotSelectedCard.image}
                                alt={displayKorTitle}
                                onError={() => setTarotImgError(true)}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center text-center p-4">
                                <span className="text-5xl animate-bounce">🔮</span>
                                <span className="text-[11px] text-amber-200/80 mt-2 font-medium">
                                  {tarotSelectedCard.animal || '호랑이'}의 신비로운 기운
                                </span>
                              </div>
                            )}
                          </div>

                          {/* 2단 분리 타이틀 */}
                          <div className="w-full mt-2.5 pt-2 border-t border-[#D4AF37]/30 flex flex-col items-center">
                            <span className="text-sm sm:text-base font-extrabold text-[#FFEAA7] tracking-tight">
                              {displayKorTitle}
                            </span>
                            {displayEngSub && (
                              <span className="text-[11px] text-amber-300/80 font-serif uppercase tracking-widest mt-0.5">
                                ({displayEngSub})
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400 mt-1 font-medium bg-white/5 px-2 py-0.5 rounded">
                              {tarotSelectedCard.keyword || '의사 표현'}
                            </span>
                          </div>

                        </div>
                      </div>

                      {/* 아기 속마음 풀이 */}
                      <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 text-left space-y-1">
                        <span className="text-xs font-bold text-pink-300 block">💬 아기의 오늘 속마음</span>
                        <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed break-keep">
                          &ldquo;{tarotSelectedCard.babyVoice}&rdquo;
                        </p>
                      </div>

                      {/* 부모 육아 처방전 */}
                      <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 text-left space-y-1">
                        <span className="text-xs font-bold text-emerald-300 block">☕ 부모 육아 처방전</span>
                        <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed break-keep">
                          {tarotSelectedCard.prescription}
                        </p>
                      </div>

                      <div className="text-xs font-bold text-amber-200 bg-amber-950/60 py-2.5 rounded-xl border border-amber-500/30">
                        🌙 오늘 밤 난이도: {tarotSelectedCard.nightDifficulty}
                      </div>

                      {/* 🌟 신규: 매일 자정 타로 갱신 알림 신청 박스 */}
                      <div className="p-3.5 bg-indigo-950/60 border border-indigo-400/40 rounded-2xl flex items-center justify-between shadow-inner">
                        <div className="text-left space-y-0.5">
                          <div className="text-xs font-bold text-amber-300 flex items-center space-x-1">
                            <span>🔔</span>
                            <span>매일 자정 타로 갱신 알림</span>
                          </div>
                          <div className="text-[11px] text-slate-300">
                            내일 밤 통잠 운세도 놓치지 마세요!
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleSubscribeTarotPush}
                          className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all shadow-xs flex-shrink-0 ${
                            tarotPushSubscribed
                              ? 'bg-emerald-600 text-white'
                              : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white animate-pulse'
                          }`}
                        >
                          {tarotPushSubscribed ? '✓ 알림 켜짐' : '알림 받기'}
                        </button>
                      </div>

                      {/* 하단 확인 버튼 */}
                      <button
                        onClick={handleCloseTarotModal}
                        className="w-full py-4 bg-gradient-to-r from-amber-400 to-yellow-400 hover:brightness-110 text-slate-950 font-black text-sm rounded-2xl transition-all shadow-md break-keep"
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

        {/* AI 분석 미리보기 모달 */}
        {isAiReportModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
            <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              
              <div className="flex justify-between items-center pb-3.5 border-b border-slate-100">
                <div className="text-left">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                    AI ANALYSIS PREVIEW
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 break-keep">
                    우리 아이 10년 성장 가이드 미리보기
                  </h3>
                </div>
                <button
                  onClick={() => setIsAiReportModalOpen(false)}
                  className="w-8 h-8 bg-slate-100 border border-slate-200 rounded-full text-xs font-bold text-slate-700 flex items-center justify-center hover:bg-slate-200"
                >
                  ✕
                </button>
              </div>

              <div className="p-4.5 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-3 break-keep">
                <div className="inline-block bg-slate-900 text-white px-2.5 py-1 rounded text-xs font-extrabold">
                  정식 런칭 예정 목차
                </div>
                <ul className="text-xs sm:text-sm text-slate-800 space-y-2.5 font-medium">
                  <li>• <b>제1장:</b> {name || '아이'}의 타고난 5대 오행 본성과 감각 레이더 분석</li>
                  <li>• <b>제2장:</b> 고집부리고 드러누울 때 통하는 맞춤형 대화법</li>
                  <li>• <b>제3장:</b> 초등학교 입학 전 자기주도성 & 집중력 케어</li>
                  <li>• <b>제4장:</b> 엄마·아빠와의 오행 궁합 및 부부 역할 분담</li>
                  <li>• <b>제5장:</b> 지친 육아 동지들을 위한 멘탈 케어 응원 편지</li>
                </ul>
              </div>

              <button
                onClick={() => setIsAiReportModalOpen(false)}
                className="w-full py-4 bg-slate-900 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-xs transition-all break-keep"
              >
                확인 완료
              </button>

            </div>
          </div>
        )}

        {/* 부모-자녀 매칭 모달 */}
        {isParentMatchModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
            <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-slate-900">
              
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    PARENT-CHILD MATCHING
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 break-keep">
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
                <div className="py-8 text-center space-y-5 animate-fadeIn">
                  <div className="space-y-1.5">
                    <div className="w-16 h-16 mx-auto bg-slate-900 text-amber-300 rounded-full flex items-center justify-center text-xl font-black shadow-md border border-slate-800 animate-pulse">
                      {parentMatchCountdown !== null ? parentMatchCountdown : '✨'}초
                    </div>
                    <h4 className="text-sm sm:text-base font-black text-slate-900 mt-2 break-keep">
                      아이와 부모의 기질 에너지 대조 중...
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 break-keep">
                      부모님의 오행 기운과 아이의 본성을 비교해 육아 난이도를 산정하고 있습니다!
                    </p>
                  </div>

                  <div className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left text-slate-900 space-y-2.5 shadow-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                        SPONSORED · 부모 충전소 (AdSense 대기 중)
                      </span>
                      <span className="text-[10px] text-slate-400">15초 후 결과 공개</span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold leading-snug break-keep text-slate-800">
                      진단 기다리는 동안 남매 유튜브 숏폼 구경 & 부모 힐링템 충전 ☕
                    </p>
                    <div className="flex space-x-2 pt-1">
                      <a
                        href={SERVICE_LINKS.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs sm:text-sm font-bold text-center transition-all shadow-xs"
                      >
                        ▶ 유튜브 숏폼
                      </a>
                      <a
                        href={SERVICE_LINKS.parentHealing}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs sm:text-sm font-bold text-center transition-all shadow-xs"
                      >
                        🛒 부모 힐링템 구경
                      </a>
                    </div>
                  </div>
                </div>
              ) : !parentingDifficulty ? (
                <form onSubmit={handleCalculateParentMatchModal} noValidate className="space-y-4 text-left">
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed break-keep">
                    아이의 기질과 <b>부모 생년월일 (엄마/아빠 중 한 분)</b>을 비교하여 우리 집만의 정밀 육아 난이도 점수를 측정해 드립니다.
                  </p>

                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-bold text-slate-800 break-keep">
                      부모 생년월일 (8자리)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="예: 1993.08.15"
                      value={parentBirth}
                      onChange={(e) => handleDateChange(e.target.value, setParentBirth, 'parentBirth')}
                      className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm font-bold text-slate-900 bg-slate-50 placeholder:text-slate-400 focus:outline-none transition-all ${
                        parentMatchError ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200 focus:border-slate-800'
                      }`}
                    />
                    {parentMatchError && (
                      <p className="text-xs sm:text-sm font-semibold text-rose-600 mt-1 break-keep">⚠️ {parentMatchError}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-[#FF5E3A] to-[#FF2A68] hover:opacity-90 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center break-keep"
                  >
                    🔥 육아 난이도 측정 시작하기
                  </button>
                </form>
              ) : (
                <div className="space-y-4 text-left animate-fadeIn">
                  
                  <div ref={parentMatchCardRef} className="bg-slate-50 p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                    
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-xl shadow-2xs border border-slate-200">
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

                    <div className="space-y-1 pt-0.5">
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden p-0.5">
                        <div
                          className="h-full rounded-full transition-all duration-700 shadow-xs"
                          style={{ width: `${parentingDifficulty.score}%`, backgroundColor: parentingDifficulty.barColor }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-bold text-slate-400">
                        <span>평화 모드 (10점)</span>
                        <span>챌린지 모드 (100점)</span>
                      </div>
                    </div>

                    <div className="space-y-2.5 pt-1 text-xs sm:text-sm">
                      <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-1 shadow-2xs">
                        <div className="font-extrabold text-amber-700 flex items-center space-x-1">
                          <span>📌</span><span>핵심 케미스트리</span>
                        </div>
                        <div className="text-slate-800 font-semibold leading-relaxed">{parentingDifficulty.summary}</div>
                      </div>

                      <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-1 shadow-2xs">
                        <div className="font-extrabold text-sky-700 flex items-center space-x-1">
                          <span>⚡</span><span>상호 작용 (시너지)</span>
                        </div>
                        <div className="text-slate-700 font-medium leading-relaxed">{parentingDifficulty.synergy}</div>
                      </div>

                      <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-1.5 shadow-2xs">
                        <div className="flex justify-between items-center">
                          <div className="font-extrabold text-emerald-700 flex items-center space-x-1">
                            <span>💡</span><span>실전 훈육 대화 스크립트</span>
                          </div>
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-bold">전체 공개</span>
                        </div>
                        <div className="text-slate-700 font-medium leading-relaxed break-keep bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          {parentingDifficulty.solution}
                        </div>
                      </div>

                      <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="flex items-center space-x-2.5">
                          <span className="text-2xl flex-shrink-0">{parentingDifficulty.parentHealingItem.icon}</span>
                          <div className="break-keep">
                            <div className="text-[11px] font-bold text-amber-700">고생한 부모를 위한 충전템</div>
                            <div className="text-xs sm:text-sm font-black text-slate-900 mt-0.5">{parentingDifficulty.parentHealingItem.title}</div>
                            <div className="text-[10px] text-slate-500">{parentingDifficulty.parentHealingItem.subTitle}</div>
                          </div>
                        </div>
                        <a
                          href={parentingDifficulty.parentHealingItem.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold text-center whitespace-nowrap shadow-xs"
                        >
                          추천 보기
                        </a>
                      </div>

                    </div>
                  </div>

                  <button
                    onClick={handleDownloadParentMatchCard}
                    disabled={isDownloadingParentMatch}
                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs sm:text-sm font-black shadow-sm transition-all flex items-center justify-center space-x-2 active:scale-95 break-keep"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>{isDownloadingParentMatch ? '결과 카드 캡처 중...' : '🔥 육아 난이도 진단 결과 이미지로 저장하기'}</span>
                  </button>

                  <button
                    onClick={handleShareResult}
                    className="w-full py-3.5 bg-[#FEE500] hover:bg-[#FADA0A] text-[#191919] font-black text-xs sm:text-sm rounded-2xl shadow-xs transition-all flex items-center justify-center space-x-1.5 active:scale-[0.99]"
                  >
                    <span>💬</span>
                    <span>결과 공유하기 (카톡 / 링크)</span>
                  </button>

                  <button
                    onClick={() => setIsParentMatchModalOpen(false)}
                    className="w-full py-3.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-black text-xs sm:text-sm rounded-2xl transition-all shadow-xs break-keep"
                  >
                    확인 완료
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 오행 판결소 모달 */}
        {isChemiModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
            <div className="w-full max-w-md bg-gradient-to-b from-amber-950 via-slate-900 to-indigo-950 rounded-t-3xl sm:rounded-3xl border-2 border-amber-500/50 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-white">
              
              <div className="flex justify-between items-center pb-3.5 border-b border-amber-500/30">
                <div>
                  <span className="text-xs font-black text-amber-400 uppercase tracking-widest block mb-0.5">
                    ⚖️ THE FIVE ELEMENTS COURT
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-amber-100 break-keep">
                    오늘의 육아 당번 뽑기 (오행 판결소)
                  </h3>
                </div>
                <button
                  onClick={handleCloseChemiModal}
                  className="w-8 h-8 bg-white/10 border border-white/20 rounded-full text-xs font-bold text-white flex items-center justify-center hover:bg-white/20"
                >
                  ✕
                </button>
              </div>

              {isAnalyzingChemi ? (
                <div className="py-8 text-center space-y-5 animate-fadeIn">
                  <div className="space-y-1.5">
                    <div className="w-16 h-16 mx-auto bg-slate-900 text-amber-400 rounded-full flex items-center justify-center text-xl font-black shadow-md border border-amber-400/40 animate-pulse">
                      {countdown !== null ? countdown : '✨'}초
                    </div>
                    <h4 className="text-sm sm:text-base font-black text-white mt-2 break-keep">
                      법정 기운 격돌 중! 오늘의 당번 판정 중...
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 break-keep">
                      엄마와 아빠의 오늘 오행 파워가 팽팽하게 맞서고 있습니다!
                    </p>
                  </div>

                  <div className="p-4.5 bg-black/40 border border-white/10 rounded-2xl space-y-3.5 shadow-inner">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs sm:text-sm font-bold">
                        <span className="text-pink-400">👩 엄마의 실시간 오행 기운</span>
                        <span className="font-mono text-pink-400">{dynamicMomBar}%</span>
                      </div>
                      <div className="w-full bg-white/10 h-4 rounded-full overflow-hidden p-0.5">
                        <div
                          className="bg-gradient-to-r from-pink-400 to-rose-500 h-full rounded-full transition-all duration-200 ease-out shadow-xs"
                          style={{ width: `${dynamicMomBar}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-center font-black text-amber-400 text-sm tracking-widest animate-bounce">
                      ⚡ VS ⚡
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs sm:text-sm font-bold">
                        <span className="text-sky-400">👨 아빠의 실시간 오행 기운</span>
                        <span className="font-mono text-sky-400">{dynamicDadBar}%</span>
                      </div>
                      <div className="w-full bg-white/10 h-4 rounded-full overflow-hidden p-0.5">
                        <div
                          className="bg-gradient-to-r from-sky-400 to-blue-500 h-full rounded-full transition-all duration-200 ease-out shadow-xs"
                          style={{ width: `${dynamicDadBar}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="w-full p-4 bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-400/40 rounded-2xl text-left text-white space-y-2.5 shadow-md">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest">
                        SPONSORED · 부모 충전소 (AdSense 대기 중)
                      </span>
                      <span className="text-[10px] text-slate-400">15초 후 판결 완료</span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold leading-snug break-keep text-amber-100">
                      판정 기다리는 동안 남매 유튜브 숏폼 구경 & 부모 힐링템 충전 ☕
                    </p>
                    <div className="flex space-x-2 pt-1">
                      <a
                        href={SERVICE_LINKS.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs sm:text-sm font-bold text-center transition-all shadow-xs"
                      >
                        ▶ 유튜브 숏폼
                      </a>
                      <a
                        href={SERVICE_LINKS.parentHealing}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs sm:text-sm font-bold text-center transition-all shadow-xs"
                      >
                        🛒 부모 힐링템 구경
                      </a>
                    </div>
                  </div>
                </div>
              ) : !chemiResult ? (
                <form onSubmit={handleCalculateChemi} noValidate className="space-y-4 text-left">
                  <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed break-keep">
                    오늘 날짜의 오행 기운과 두 분의 사주를 대조해 <b>오늘 집안의 평화를 지킬 육아 주인공</b>을 판정해 드립니다.
                  </p>

                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-bold text-slate-200 break-keep">
                      👩 엄마 생년월일 (8자리)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="예: 1993.08.15"
                      value={momBirth}
                      onChange={(e) => handleDateChange(e.target.value, setMomBirth, 'momBirth')}
                      className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm font-bold text-white bg-white/10 placeholder:text-slate-400 focus:outline-none transition-all ${
                        chemiErrors.mom ? 'border-rose-400 bg-rose-950/40' : 'border-white/20 focus:border-amber-400'
                      }`}
                    />
                    {chemiErrors.mom && (
                      <p className="text-xs sm:text-sm font-semibold text-rose-400 mt-1 break-keep">⚠️ {chemiErrors.mom}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-bold text-slate-200 break-keep">
                      👨 아빠 생년월일 (8자리)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="예: 1991.04.22"
                      value={dadBirth}
                      onChange={(e) => handleDateChange(e.target.value, setDadBirth, 'dadBirth')}
                      className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm font-bold text-white bg-white/10 placeholder:text-slate-400 focus:outline-none transition-all ${
                        chemiErrors.dad ? 'border-rose-400 bg-rose-950/40' : 'border-white/20 focus:border-amber-400'
                      }`}
                    />
                    {chemiErrors.dad && (
                      <p className="text-xs sm:text-sm font-semibold text-rose-400 mt-1 break-keep">⚠️ {chemiErrors.dad}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center break-keep"
                  >
                    ⚖️ 법정 판정 시작하기 🔥
                  </button>
                </form>
              ) : (
                <div className="space-y-4 text-left animate-fadeIn">
                  <div className="p-4.5 bg-black/60 rounded-3xl text-center text-white space-y-2 border border-amber-400/40 shadow-md">
                    <span className="text-xs font-extrabold bg-amber-400 text-slate-950 px-3 py-1 rounded-full uppercase tracking-wider">
                      오행 법정 최종 선고
                    </span>
                    <h4 className="text-lg sm:text-xl font-black text-amber-300 mt-1 break-keep">
                      오늘의 육아 &lsquo;주인공&rsquo;은 &lsquo;{chemiResult.best}&rsquo;!
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1 break-keep">
                      {chemiResult.summary}
                    </p>
                  </div>
                  <button
                    onClick={handleCloseChemiModal}
                    className="w-full py-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-2xl transition-all shadow-md break-keep"
                  >
                    확인 완료
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 패밀리 라운지 모달 */}
        {isLoungeOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
            <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
              
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

              <div className="bg-gradient-to-br from-amber-500/10 via-rose-500/10 to-amber-500/5 border border-amber-400/50 rounded-2xl p-4.5 text-left shadow-2xs space-y-3">
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

                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center justify-between shadow-2xs">
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
                    className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs whitespace-nowrap ${
                      copyFeedback
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95'
                    }`}
                  >
                    {copyFeedback ? '✓ 복사완료!' : '계좌 복사'}
                  </button>
                </div>
                {copyFeedback && (
                  <p className="text-xs font-bold text-emerald-600 text-center animate-fadeIn break-keep">
                    🎉 계좌가 복사되었습니다! 금융 앱에서 바로 붙여넣어 송금하실 수 있어요.
                  </p>
                )}
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 text-left shadow-2xs space-y-3">
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
                  className="block w-full py-3 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs sm:text-sm font-bold rounded-xl text-center transition-all break-keep"
                >
                  하민&하윤이 유튜브 채널 구경가기
                </a>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 text-left shadow-2xs space-y-3">
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
                  className="block w-full py-3 bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-700 text-xs sm:text-sm font-bold rounded-xl text-center transition-all active:scale-[0.98] shadow-2xs break-keep"
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

        {/* iOS 이미지 저장 가이드 모달 */}
        {iosSavedImageUrl && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div className="w-full max-w-sm bg-white rounded-3xl p-6 text-center space-y-4 shadow-2xl">
              <div className="space-y-1.5 break-keep">
                <span className="text-3xl">📸</span>
                <h4 className="text-base sm:text-lg font-black text-slate-900">
                  카드를 사진첩에 저장하기
                </h4>
                <p className="text-xs sm:text-sm text-amber-800 font-bold bg-amber-50 py-2 px-3 rounded-xl border border-amber-200">
                  👉 아래 이미지를 <b>길게 꾹 눌러서</b> [사진에 추가]를 선택해주세요!
                </p>
              </div>

              <div className="max-h-[60vh] overflow-y-auto rounded-2xl border border-slate-200 p-1 shadow-inner">
                <img
                  src={iosSavedImageUrl}
                  alt="우리 아이 기질 카드"
                  className="w-full h-auto rounded-xl object-contain"
                />
              </div>

              <button
                onClick={() => setIosSavedImageUrl(null)}
                className="w-full py-4 bg-slate-900 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-xs active:scale-95 transition-all break-keep"
              >
                확인 완료
              </button>
            </div>
          </div>
        )}
      </div>
)}

{/* 커플·예비부부 전용 화면 */}
{activeTabMode === 'couple' && (
  <div className="space-y-6 animate-fadeIn">
    {/* 커플 정보 입력 카드 */}
    <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xl space-y-4">
      <div className="text-center space-y-1 pb-1">
        <span className="inline-block px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[11px] font-black">
          60갑자 커플 도감 & 2세 시뮬레이터
        </span>
        <h2 className="text-lg font-black text-slate-900">우리 둘이 만나면 어떤 아이가 태어날까?</h2>
        <p className="text-xs text-slate-500 break-keep">
          두 사람의 생년월일로 가상 2세 성향과 오늘 생활 주도권을 판결합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div className="space-y-1.5 p-3.5 bg-rose-50/60 rounded-2xl border border-rose-100">
          <span className="text-[11px] font-bold text-rose-700 block">👤 나 (또는 예비 신랑)</span>
          <input
            type="text"
            placeholder="이름/별명 (선택)"
            value={partner1Name}
            onChange={(e) => setPartner1Name(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-rose-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-rose-500"
          />
          <input
            type="date"
            value={partner1Birth}
            onChange={(e) => setPartner1Birth(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-rose-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-rose-500"
          />
        </div>

        <div className="space-y-1.5 p-3.5 bg-indigo-50/60 rounded-2xl border border-indigo-100">
          <span className="text-[11px] font-bold text-indigo-700 block">👤 연인 (또는 예비 신부)</span>
          <input
            type="text"
            placeholder="이름/별명 (선택)"
            value={partner2Name}
            onChange={(e) => setPartner2Name(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-indigo-500"
          />
          <input
            type="date"
            value={partner2Birth}
            onChange={(e) => setPartner2Birth(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-indigo-500"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleCalculateCouple}
        className="w-full py-3.5 bg-gradient-to-r from-rose-500 via-pink-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white font-black text-sm rounded-2xl shadow-lg transition-all transform active:scale-98"
      >
        🔮 가상 2세 성향 & 오늘 분담 판결 확인하기
      </button>
    </div>

    {/* 커플 결과 노출 영역 */}
    {coupleResult && (
      <div className="space-y-5 animate-fadeIn">
        {/* 1. 커플 60갑자 수호신 캐릭터 페어링 카드 */}
        <div className="bg-white rounded-3xl p-5 border border-rose-200 shadow-xl space-y-4 text-center">
          <span className="text-[11px] font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-full inline-block">
            60갑자 커플 수호신 페어링
          </span>

          <div className="flex items-center justify-around py-3.5 bg-gradient-to-r from-rose-50 via-purple-50 to-indigo-50 rounded-2xl border border-slate-100">
            <div className="space-y-1">
              <div className="text-4xl animate-bounce">{coupleResult.p1AnimalIcon}</div>
              <span className="text-xs font-black text-slate-800 block">{partner1Name || '예비 신랑'}</span>
              <span className="text-[10px] font-bold text-rose-600 block">{coupleResult.p1Animal}띠</span>
              <span className="text-[9px] text-slate-500 block">{coupleResult.p1Elem}</span>
            </div>

            <div className="text-2xl font-black text-rose-500">❤️</div>

            <div className="space-y-1">
              <div className="text-4xl animate-bounce">{coupleResult.p2AnimalIcon}</div>
              <span className="text-xs font-black text-slate-800 block">{partner2Name || '예비 신부'}</span>
              <span className="text-[10px] font-bold text-indigo-600 block">{coupleResult.p2Animal}띠</span>
              <span className="text-[9px] text-slate-500 block">{coupleResult.p2Elem}</span>
            </div>
          </div>

          {/* 인스타 스토리용 이미지 다운로드 버튼 */}
          <button
            type="button"
            onClick={handleDownloadCoupleCard}
            className="w-full py-3.5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white font-black text-xs rounded-2xl shadow-lg hover:from-slate-800 hover:to-indigo-900 transition-all flex items-center justify-center gap-2 transform active:scale-98"
          >
            <span>📸</span> 결과 카드 이미지 저장 (인스타 스토리용)
          </button>
        </div>

        {/* 2. 가상 2세 시뮬레이터 카드 */}
        <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 rounded-3xl p-6 border border-orange-200 shadow-xl space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-orange-200/80">
            <span className="text-xs font-black text-orange-900">👶 FUTURE BABY SIMULATOR</span>
            <span className="px-2.5 py-0.5 bg-orange-200 text-orange-900 rounded-full text-[10px] font-extrabold">
              육아 난이도: {coupleResult.baby.difficulty}
            </span>
          </div>

          <div className="text-center space-y-2 py-1">
            <div className="text-4xl">{coupleResult.baby.icon}</div>
            <h3 className="text-lg font-black text-slate-900">{coupleResult.baby.title}</h3>
            <p className="text-xs text-slate-700 leading-relaxed break-keep px-1">
              {coupleResult.baby.desc}
            </p>
          </div>

          {/* 닮을 확률 게이지 */}
          <div className="bg-white/90 p-4 rounded-2xl border border-orange-100 space-y-2 text-xs">
            <div className="flex justify-between font-extrabold text-slate-700 text-[11px]">
              <span>{partner1Name || '나'} 성향: {coupleResult.baby.dadPercent}%</span>
              <span>{partner2Name || '상대방'} 성향: {coupleResult.baby.momPercent}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
              <div style={{ width: `${coupleResult.baby.dadPercent}%` }} className="bg-rose-500 h-full" />
              <div style={{ width: `${coupleResult.baby.momPercent}%` }} className="bg-indigo-500 h-full" />
            </div>
          </div>
        </div>

        {/* 3. 오행 케미 & 생활 분담 판결소 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <div className="space-y-0.5">
              <span className="text-xs font-black text-slate-800">⚖️ 오늘의 커플 생활 판결소</span>
              <span className="text-[10px] text-indigo-600 block">연애 케미 지수: {coupleResult.chemistryScore}점</span>
            </div>
            <span className="text-[10px] text-slate-400">자정 기준 갱신</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <span className="text-[11px] font-black text-indigo-600 block">오늘의 사주 오행 선고 결과 📜</span>
            <p className="text-xs font-black text-slate-900">
              👉 {coupleResult.chore.leader}: <span className="text-rose-600 font-extrabold">{coupleResult.chore.role}</span>
            </p>
            <p className="text-[11px] text-slate-600 leading-relaxed break-keep">
              {coupleResult.chore.desc}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: '우리 둘의 가상 2세 성향 & 커플 판결 결과!',
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('결과 링크가 클립보드에 복사되었습니다! 카톡으로 공유해보세요 💌');
              }
            }}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-md"
          >
            💌 이 결과 링크로 복사하기
          </button>
        </div>
      </div>
    )}
  </div>
)}
      {/* 애드센스 승인 심사용 필수 푸터: 운영 정보 및 개인정보 처리방침 */}
      <footer className="mt-8 pt-6 pb-6 border-t border-slate-200 text-center space-y-2.5 text-[11px] text-slate-500">
          <div className="flex justify-center items-center space-x-3 text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => setIsPrivacyModalOpen(true)}
              className="underline hover:text-slate-900 transition-colors"
            >
              개인정보처리방침
            </button>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              onClick={() => setIsLoungeOpen(true)}
              className="underline hover:text-slate-900 transition-colors"
            >
              서비스 소개 및 문의
            </button>
          </div>
          <p className="leading-relaxed break-keep">
            아기속풀이 (Baby Sokpuli) · 비영리 토이 프로젝트<br />
            문의: <a href="mailto:hamin.save.moment@gmail.com" className="underline font-medium text-slate-700">hamin.save.moment@gmail.com</a> (인스타 @hamin_hayoon_day)
          </p>
          <p className="text-[10px] text-slate-400">
            © 2026 Baby Sokpuli. All rights reserved.
          </p>
        </footer>

        {/* 개인정보처리방침 팝업 모달 */}
        {isPrivacyModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
            <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto text-slate-900 text-left">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-900">개인정보처리방침</h3>
                <button
                  type="button"
                  onClick={() => setIsPrivacyModalOpen(false)}
                  className="w-8 h-8 bg-slate-100 border border-slate-200 rounded-full text-xs font-bold text-slate-600 flex items-center justify-center hover:bg-slate-200"
                >
                  ✕
                </button>
              </div>
              <div className="text-xs text-slate-600 space-y-3 leading-relaxed break-keep">
                <p>
                  &lsquo;아기속풀이&rsquo;는 이용자의 개인정보를 소중히 다루며, 관련 법령을 준수합니다.
                </p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800 block">1. 수집하는 개인정보 항목 및 보관 방식</span>
                  <p>
                    이용자가 입력한 아이 이름, 생년월일, 태어난 시간, 부모 생년월일 정보는 <b>외부 서버로 전송되거나 데이터베이스에 저장되지 않습니다.</b> 모든 연산과 임시 저장은 이용자의 스마트폰/PC 웹 브라우저(localStorage) 내부에서만 안전하게 동작합니다.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800 block">2. 제3자 제공 및 마케팅 활용</span>
                  <p>
                    수집된 데이터가 서버에 남지 않으므로 어떠한 제3자에게도 정보를 제공하거나 공유하지 않습니다.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800 block">3. 문의처</span>
                  <p>
                    개인정보 보호 관련 문의 및 서비스 피드백은 아래 이메일로 접수해 주시면 성실히 답변해 드리겠습니다.<br />
                    이메일: <a href="mailto:hamin.save.moment@gmail.com" className="text-slate-900 font-bold underline">hamin.save.moment@gmail.com</a>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPrivacyModalOpen(false)}
                className="w-full py-3.5 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}