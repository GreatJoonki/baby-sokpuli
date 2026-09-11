'use client';

import React, { useState, useEffect, useRef } from 'react';
import { toPng } from 'html-to-image';

// =======================================================
// 🔗 서비스 및 후원 계좌 설정
// =======================================================
const SERVICE_LINKS = {
  youtube: 'https://www.youtube.com/@Hamin_Hayoon_day',
  instagramProfile: 'https://www.instagram.com/hamin_hayoon_day/',
  instagramDM: 'https://ig.me/m/hamin_hayoon_day',
  coupangDefault: 'https://link.coupang.com',
  parentHealing: 'https://link.coupang.com',
};

const DONATION_CONFIG = {
  bankName: '카카오뱅크',
  accountNumber: '3333-01-2345678',
  holderName: '김준기',
  colaPrice: '1,500원',
};

// =======================================================
// 💌 방문 횟수 기반 맞춤형 환영 훅
// =======================================================
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
      } else if (currentCount >= 3 && currentCount < 5) {
        msg = `벌써 ${currentCount}번째 함께하고 계시네요! 완벽한 하루 되세요 🌿`;
      } else if (currentCount >= 5 && currentCount < 10) {
        msg = `찐 육아 동지 인증! ${currentCount}번째 발걸음을 응원해요 🥤`;
      } else if (currentCount >= 10) {
        msg = `단골 육아 크루 등극 👑 (${currentCount}번째 함께 육아 중!)`;
      }

      setVisitInfo({ count: currentCount, message: msg });
    } catch (e) {
      console.error('방문 트래커 로드 실패', e);
    }
  }, []);

  return visitInfo;
}

// =======================================================
// 📅 캘린더 정밀 유효성 검증 함수
// =======================================================
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
    infant: { title: '유기농 케일·사과 초기 퓨레 포션', subTitle: '목(木)의 쑥쑥 자라는 생명력 충전', tag: '성장 퓨레', guide: '간과 근육 발달을 돕는 푸른 채소의 산뜻한 에너지가 아기의 첫 성장을 기분 좋게 응원해 줍니다.' },
    toddler: { title: '청포도 칼슘·비타민 구미 포션', subTitle: '활동량 폭발하는 아이를 위한 성장 간식', tag: '성장 젤리', guide: '지치지 않고 뛰어노는 아이를 위해 뼈와 근육의 기운을 채워주는 새콤달콤 청포도 영양 간식이에요.' },
    child: { title: '키즈 칼슘+마그네슘+비타민D 포션', subTitle: '골격 형성과 곧은 성장을 돕는 영양', tag: '키성장 포션', guide: '학교생활로 훌쩍 크는 시기예요. 곧고 튼튼한 골격 성장을 돕는 든든한 필수 미네랄을 보충해 주세요.' },
  },
  fire: {
    infant: { title: '유기농 비트·딸기 초기 퓨레 포션', subTitle: '화(火)의 따뜻한 순환을 돕는 힐링 과채', tag: '순환 퓨레', guide: '심장과 혈액 순환을 활발하게 도와주어, 아기의 손발을 따뜻하게 하고 방긋방긋 기분을 띄워줘요.' },
    toddler: { title: '베리베리 유기농 멀티비타민 젤리', subTitle: '지칠 줄 모르는 에너자이저 활력 충전', tag: '활력 젤리', guide: '온몸으로 에너지를 발산하는 활기찬 아이의 컨디션을 지켜주는 붉은 열매 비타민 간식입니다.' },
    child: { title: '어린이 홍삼 튼튼 활력 스틱 포션', subTitle: '기초 체력과 지치지 않는 집중력 유지', tag: '체력 포션', guide: '학습과 야외활동이 늘어나는 초등 시기, 지친 기운을 북돋워 주는 부드러운 어린이 홍삼 충전소예요.' },
  },
  earth: {
    infant: { title: '유기농 단호박·고구마 안심 퓨레', subTitle: '토(土)의 든든하고 편안한 소화 에너지', tag: '속편한 퓨레', guide: '비위와 소화기를 따뜻하게 감싸주어 배앓이 없이 뱃속을 편안하게 꿀잠 자도록 도와줍니다.' },
    toddler: { title: '유기농 바나나 달콤 쌀과자 포션', subTitle: '소화가 잘되는 순한 첫 곡물 간식', tag: '속편한 과자', guide: '소화 흡수가 빠른 노란 곡물의 부드러운 기운이 예민한 아이의 입맛과 뱃속을 포근하게 달래줍니다.' },
    child: { title: '100억 생유산균+아연 복합 포션', subTitle: '황금변과 튼튼한 장 면역을 지키는 균형', tag: '장건강 포션', guide: '불규칙해지기 쉬운 어린이 식습관을 위해 장내 유익균을 꽉 채워 소화 흡수를 편안하게 해줍니다.' },
  },
  metal: {
    infant: { title: '유기농 배·도라지 순한 초기 퓨레', subTitle: '금(金)의 맑고 깨끗한 호흡기 지킴이', tag: '목안심 퓨레', guide: '폐와 기관지를 촉촉하게 보호해 주어, 환절기 칭얼거림과 칼칼한 목을 부드럽게 지켜줍니다.' },
    toddler: { title: '착즙 배도라지 달콤 워터젤리 포션', subTitle: '목과 코가 편안해지는 수분 충전 간식', tag: '기관지 젤리', guide: '말문이 트이고 목을 많이 쓰는 시기, 은빛 금(金) 기운의 촉촉함으로 목 건강을 달콤하게 챙겨주세요.' },
    child: { title: '엘더베리+프로폴리스 면역 츄어블', subTitle: '단체생활 환절기 방패막이 영양 포션', tag: '면역 포션', guide: '학교와 학원 단체생활에서 감기 없이 튼튼하게 버틸 수 있도록 호흡기 방어력을 단단히 세워줍니다.' },
  },
  water: {
    infant: { title: '유기농 서양자두 푸룬·사과 퓨레', subTitle: '수(水)의 원활한 순환과 시원한 배변', tag: '쾌변 퓨레', guide: '신장과 배설 순환을 도와 아기의 속을 시원하게 뚫어주고 정서적 안정감을 찾아주는 보라빛 포션이에요.' },
    toddler: { title: '블랙베리 퐁당 유기농 철분 구미', subTitle: '밤잠을 깊게 돕는 깊은 수(水) 영양', tag: '철분 구미', guide: '깊은 휴식과 꿀잠을 도와주는 천연 블랙푸드의 미네랄 기운으로 예민한 밤을 차분히 달래줍니다.' },
    child: { title: '식물성 미세조류 DHA 오메가3 포션', subTitle: '반짝이는 두뇌 회전과 맑은 눈 건강', tag: '두뇌 포션', guide: '생각과 탐구가 깊어지는 시기, 맑고 스마트한 두뇌 순환과 시력을 지켜주는 필수 오메가 포션입니다.' },
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
    { title: '목(木)의 기운이 가득한 날 🌱', desc: '새로운 호기심과 성장이 폭발하는 날! 아이와 산책하기 좋아요.' },
    { title: '화(火)의 기운이 강한 날 🔥', desc: '에너지가 넘치는 날! 온몸으로 신나게 놀아주면 밤잠을 잘 자요.' },
    { title: '토(土)의 기운이 포근한 날 ⛰️', desc: '마음이 차분하고 안정되는 평화로운 하루입니다.' },
    { title: '금(金)의 기운이 맑은 날 🪙', desc: '규칙과 일과를 척척 해내는 똑똑한 기운이 감도는 날이에요.' },
    { title: '수(水)의 기운이 깊은 날 💧', desc: '충분한 스킨십과 포근한 안아주기로 정서적 교감을 나눠보세요.' },
  ];
  return elements[daySum % elements.length];
}

// 🌟 포켓몬 카드 스타일: 3D 캐릭터 영역 대폭 확대 (w-44 h-44)
function BabyAnimalHybridMascot({
  cheonganIndex,
  animalIndex,
  colorLabel,
}: {
  cheonganIndex: number;
  animalIndex: number;
  colorLabel: string;
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
    <div className="relative w-44 h-44 flex items-center justify-center filter drop-shadow-[0_16px_32px_rgba(0,0,0,0.25)] my-1">
      {!isError ? (
        <img
          src={imgSrc}
          alt={`${colorLabel} 캐릭터`}
          onError={handleError}
          className="w-full h-full object-contain rounded-3xl animate-fadeIn scale-105"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-white/20 rounded-3xl">
          <span className="text-5xl">🍼</span>
        </div>
      )}
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
    <div className="space-y-1.5 pb-2 border-b border-slate-100 last:border-b-0 last:pb-0">
      <div className="flex justify-between items-center text-xs">
        <div className="flex items-center space-x-1.5">
          <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
            {categoryTag}
          </span>
          <span className="font-extrabold text-slate-800 text-sm break-keep">{name}</span>
          <button
            type="button"
            onClick={() => onToggleTooltip(id)}
            aria-label={`${name} 설명 보기`}
            className={`w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] font-extrabold transition-all ${
              isOpen ? 'bg-slate-800 text-white shadow-xs' : 'bg-white text-slate-500 hover:bg-slate-50'
            }`}
          >
            !
          </button>
        </div>
        <span className="font-mono font-black text-sm tracking-tight" style={{ color: fillColor }}>
          {score}점
        </span>
      </div>

      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5">
        <div
          className="h-full rounded-full transition-all duration-500 shadow-xs"
          style={{ width: `${score}%`, backgroundColor: fillColor }}
        />
      </div>

      {isOpen && (
        <div className="mt-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200 shadow-xs text-left space-y-1.5 animate-fadeIn break-keep">
          <div>
            <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider block mb-0.5">
              어떤 성향인가요?
            </span>
            <p className="text-xs font-semibold text-slate-800 leading-relaxed">{description.meaning}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
              재미로 보는 점수 ({score}점)
            </span>
            <p className="text-xs font-medium text-slate-600 leading-relaxed">{description.levelInterpretation}</p>
          </div>
          <div className="pt-1.5 border-t border-slate-200">
            <p className="text-xs font-bold text-emerald-600 flex items-start space-x-1">
              <span className="flex-shrink-0">💡</span>
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

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<'form' | 'result'>('form');

  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoungeOpen, setIsLoungeOpen] = useState(false);
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
  }>({
    badge: '제4도약기 구간',
    mainTitle: '지금 제4도약기(마의 19주) 폭풍 구간이에요',
    bullets: [
      '아기의 두뇌 신경망이 새로운 세상을 배우며 낯설어하는 시기예요.',
      '이유 없는 울음과 잠투정은 뇌가 쑥쑥 크고 있다는 건강한 증거랍니다.',
      '엄마 아빠의 육아 잘못이 절대 아니니 마음 편히 포근하게 안아주세요.',
    ],
    highlightTag: '도약기 폭풍 탈출 디데이',
    highlightTitle: '앞으로 10일 뒤(10월 28일)에 맑은 날이 찾아와요',
    isLeap: true,
  });

  const [potionData, setPotionData] = useState<PotionDetail & { color: string }>({
    title: '유기농 서양자두 푸룬·사과 퓨레',
    subTitle: '수(水)의 원활한 순환과 시원한 배변',
    tag: '쾌변 퓨레',
    color: '#1E293B',
    guide: '신장과 배설 순환을 도와 아기의 속을 시원하게 뚫어주고 정서적 안정감을 찾아주는 보라빛 포션이에요.',
  });

  const todayGuide = getTodayElementGuide();

  const handleToggleTooltip = (id: 'curiosity' | 'energy' | 'fussy') => {
    setActiveTooltip((prev) => (prev === id ? null : id));
  };

  const [errors, setErrors] = useState<{ name?: string; birthDate?: string; dueDate?: string }>({});

  const handleDateChange = (value: string, setter: (val: string) => void, fieldKey: 'birthDate' | 'dueDate' | 'momBirth' | 'dadBirth') => {
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
  }, []);

  const getTodayDateString = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
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

  const handleSelectChild = (profile: BabyProfile) => {
    setActiveProfileId(profile.id);
    applyProfileToState(profile);
    runAdaptiveEngine(profile.birthDate, profile.dueDate);
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
      }
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
    } else {
      setOneLineSummary('다정하고 신중한 관찰자! 세상의 변화를 눈으로 조용히 음미해요');
    }

    let calculatedAgeMode: 'infant' | 'toddler' | 'child' = 'infant';

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
        const endDate = new Date(today.getTime() + daysRemaining * 24 * 60 * 60 * 1000);
        setSolutionData({
          badge: `생후 ${totalWeeks}주 · ${currentLeap.name}`,
          mainTitle: `지금은 ${currentLeap.name} 구간이에요`,
          bullets: [
            currentLeap.description,
            '이유 없는 울음과 잠투정은 두뇌가 폭풍 성장 중이라는 건강한 신호예요.',
            '엄마 아빠의 탓이 전혀 아니니 죄책감 없이 푹 안아주세요.',
          ],
          highlightTag: '도약기 폭풍 탈출 디데이',
          highlightTitle: `앞으로 ${daysRemaining}일 뒤(${endDate.getMonth() + 1}월 ${endDate.getDate()}일)에 맑음`,
          isLeap: true,
        });
      } else {
        const nextLeap = WONDER_LEAPS.find((l) => l.startDay > dueDays);
        const dDayNext = nextLeap ? nextLeap.startDay - dueDays : 0;
        setSolutionData({
          badge: `생후 ${totalWeeks}주 · 온화기 (평화 구간)`,
          mainTitle: `지금은 방긋방긋 웃는 평화로운 온화기예요`,
          bullets: [
            '아기가 배운 세상을 머릿속에 정리하며 편안하게 쉬어가는 달콤한 타이밍이에요.',
            '엄마 아빠도 밀린 낮잠을 자며 에너지를 든든하게 충전해 두세요.',
            nextLeap ? `다음 도약기는 약 D-${dDayNext}일 뒤에 찾아올 예정이에요.` : '원더윅스 주요 도약기를 멋지게 지나고 있어요.',
          ],
          highlightTag: '평화로운 성장 구간',
          highlightTitle: nextLeap ? `다음 도약기까지 약 ${dDayNext}일 남았어요` : '원더윅스 도약을 멋지게 달리는 중!',
          isLeap: false,
        });
      }

    } else if (totalMonths <= 84) {
      calculatedAgeMode = 'toddler';
      setAgeMode('toddler');
      setCalculatedAgeText(`만 ${manYears}세 (${totalMonths}개월)`);

      setSolutionData({
        badge: `만 ${manYears}세 · 자아 뿜뿜기 (원더윅스 졸업)`,
        mainTitle: `원더윅스 졸업 완료! 재미로 보는 '자아 뿜뿜 케어 팁'`,
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
      });

    } else {
      calculatedAgeMode = 'child';
      setAgeMode('child');
      const schoolGrade = Math.min(6, Math.max(1, manYears - 6));
      setCalculatedAgeText(`만 ${manYears}세 (초등 ${schoolGrade}학년)`);

      setSolutionData({
        badge: `초등 ${schoolGrade}학년 · 나만의 탐구기`,
        mainTitle: `재미로 보는 '스스로 탐구 스타일 & 마음 케어'`,
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
      });
    }

    const elementKey = cheongan.elementKey;
    const selectedPotion = POTION_MATRIX[elementKey][calculatedAgeMode];
    setPotionData({
      ...selectedPotion,
      color: cheongan.mainColor,
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
    if (countdownTimeoutRef.current) clearInterval(countdownTimeoutRef.current);
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

  const handleCopyAccount = async () => {
    try {
      await navigator.clipboard.writeText(`${DONATION_CONFIG.bankName} ${DONATION_CONFIG.accountNumber}`);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2500);
    } catch (err) {
      alert(`${DONATION_CONFIG.bankName} ${DONATION_CONFIG.accountNumber} (${DONATION_CONFIG.holderName}) 계좌를 복사해 주세요!`);
    }
  };

  const handleDownloadCard = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);

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

  return (
    <main className="min-h-screen bg-[#E9ECEF] flex justify-center py-0 sm:py-8 font-sans antialiased text-slate-900">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ticker-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker-marquee {
          display: inline-flex;
          width: max-content;
          animation: ticker-marquee 18s linear infinite;
        }
        .animate-ticker-marquee:hover {
          animation-play-state: paused;
        }
      `}} />

      <div className="w-full max-w-md bg-[#F8F9FA] min-h-screen sm:min-h-0 sm:rounded-[36px] shadow-[0_24px_48px_rgba(0,0,0,0.08)] flex flex-col p-6 relative border border-slate-200/60">
        
        {/* 상단 헤더 */}
        <header className="pt-2 pb-3 text-center">
          <div className="inline-block bg-slate-200/70 text-slate-700 px-3.5 py-1 rounded-full text-xs font-bold tracking-tight mb-2.5">
            실시간 60갑자 아기 도감
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 break-keep">
            우리 아이 기질카드
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium break-keep">
            가볍게 쏙 뽑아보는 우리 아이 속풀이
          </p>
        </header>

        {/* 무한 롤링 티커 배너 */}
        <div className="mb-3.5 overflow-hidden whitespace-nowrap bg-slate-100/90 border border-slate-200/80 rounded-xl py-1.5 flex items-center shadow-2xs">
          <div className="animate-ticker-marquee flex items-center space-x-8 text-[11px] font-bold text-slate-600">
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
              <span>💌</span>
              <span>{visitor.message}</span>
            </span>
            <span className="text-slate-300">✦</span>
            <span className="flex items-center space-x-1.5">
              <span>🍼</span>
              <span>신생아부터 어린이까지 쏙 뽑아보는 60갑자 성향 분석</span>
            </span>
            <span className="text-slate-300">✦</span>
          </div>
        </div>

        {/* 다자녀 탭 바 */}
        {profiles.length > 0 && (
          <div className="mb-4 pb-2 flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-extrabold text-slate-400 whitespace-nowrap mr-1">
              등록된 아이:
            </span>
            {profiles.map((p) => {
              const isActive = activeProfileId === p.id && step === 'result';
              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectChild(p)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="break-keep">{p.name}</span>
                  <button
                    onClick={(e) => handleDeleteChild(p.id, e)}
                    className="text-[10px] opacity-60 hover:opacity-100 ml-0.5"
                    aria-label={`${p.name} 삭제`}
                  >
                    ✕
                  </button>
                </div>
              );
            })}
            <button
              onClick={handleAddNewChild}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border border-dashed transition-all flex items-center space-x-1 whitespace-nowrap ${
                step === 'form' && activeProfileId === null
                  ? 'border-slate-800 bg-slate-100 text-slate-900 font-extrabold'
                  : 'border-slate-300 text-slate-500 hover:border-slate-500 hover:text-slate-800'
              }`}
            >
              <span>+ 다른 아이 추가</span>
            </button>
          </div>
        )}

        {/* 오늘의 오행 기운 배너 */}
        {step === 'form' && (
          <div className="mb-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4.5 rounded-2xl shadow-sm relative overflow-hidden flex items-center justify-between">
            <div className="space-y-1 relative z-10 break-keep">
              <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block">
                TODAY&apos;S ELEMENT VIBE
              </span>
              <h2 className="text-sm font-black">{todayGuide.title}</h2>
              <p className="text-[11px] text-slate-300 font-medium leading-relaxed break-keep">
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
              
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 break-keep">
                  아이 이름 또는 태명 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="예: 튼튼이, 김도윤"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className={`w-full px-3.5 py-3 bg-slate-50 rounded-xl border text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all ${
                    errors.name ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200 focus:border-slate-800'
                  }`}
                />
                {errors.name && (
                  <p className="text-xs font-semibold text-rose-600 mt-1 break-keep">⚠️ {errors.name}</p>
                )}
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 break-keep">
                  성별 <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setGender('boy')}
                    className={`py-3 rounded-xl text-xs font-bold border transition-all ${
                      gender === 'boy'
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    왕자님
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('girl')}
                    className={`py-3 rounded-xl text-xs font-bold border transition-all ${
                      gender === 'girl'
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    공주님
                  </button>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700 break-keep">
                    태어난 날짜 <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">
                    숫자 8자리
                  </span>
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="예: 2024.05.10"
                  value={birthDate}
                  onChange={(e) => handleDateChange(e.target.value, setBirthDate, 'birthDate')}
                  className={`w-full px-3.5 py-3 bg-slate-50 rounded-xl border text-sm font-bold tracking-wider text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all ${
                    errors.birthDate ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200 focus:border-slate-800'
                  }`}
                />
                {errors.birthDate && (
                  <p className="text-xs font-semibold text-rose-600 mt-1 break-keep">⚠️ {errors.birthDate}</p>
                )}
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700 break-keep">태어난 시간 (선택)</label>
                  <label className="flex items-center space-x-1 text-xs font-semibold text-slate-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isUnknownTime}
                      onChange={(e) => setIsUnknownTime(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-slate-300 text-slate-900 focus:ring-0"
                    />
                    <span>시간 모름</span>
                  </label>
                </div>
                <input
                  type="time"
                  value={birthTime}
                  disabled={isUnknownTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold ${
                    isUnknownTime ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' : 'bg-slate-50 text-slate-900 border-slate-200'
                  }`}
                />
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700 break-keep">출산 당시 예정일 (선택)</label>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    도약기 체크용
                  </span>
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="예: 2024.05.20"
                  value={dueDate}
                  onChange={(e) => handleDateChange(e.target.value, setDueDate, 'dueDate')}
                  className={`w-full px-3.5 py-3 bg-slate-50 rounded-xl border text-sm font-bold tracking-wider text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all ${
                    errors.dueDate ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200 focus:border-slate-800'
                  }`}
                />
                {errors.dueDate && (
                  <p className="text-xs font-semibold text-rose-600 mt-1 break-keep">⚠️ {errors.dueDate}</p>
                )}
                
                <div className="mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-left space-y-1 break-keep">
                  <p className="text-xs font-bold text-slate-900 flex items-center space-x-1">
                    <span>💡</span>
                    <span>왜 예정일을 넣나요?</span>
                  </p>
                  <p className="text-xs font-medium text-slate-600 leading-relaxed">
                    생후 20개월 이전 아기는 예정일을 넣으시면 <b>원더윅스 도약기 시기</b>를 더 딱 맞게 볼 수 있어요! 이미 2살이 지난 아이는 비워두셔도 기질 카드가 예쁘게 완성됩니다.
                  </p>
                </div>
              </div>

            </div>

            <div className="pt-3 pb-1 space-y-3">
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm shadow-md active:scale-[0.98] transition-all flex items-center justify-center break-keep"
              >
                우리 아이 기질카드 뽑아보기
              </button>

              <div 
                onClick={handleOpenChemiModal}
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 border border-indigo-500/30 shadow-sm cursor-pointer hover:scale-[1.01] transition-all flex items-center justify-between text-white"
              >
                <div className="break-keep">
                  <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-widest block mb-0.5">
                    FIVE ELEMENTS COURT ⚖️
                  </span>
                  <div className="text-xs font-black">오늘의 육아 당번 뽑기 (오행 판결소)</div>
                </div>
                <span className="text-xs font-bold bg-amber-400 text-slate-950 px-3 py-1.5 rounded-xl shadow-xs flex items-center space-x-1 whitespace-nowrap">
                  <span>오늘 당번 가리기 →</span>
                </span>
              </div>
            </div>
          </form>
        )}

        {/* STEP 2: 결과 카드 화면 */}
        {step === 'result' && (
          <div className="space-y-4 pb-4 pt-1">
            
            <div
              ref={cardRef}
              className="bg-white rounded-3xl p-5 shadow-sm flex flex-col items-center text-center relative overflow-hidden border border-slate-200"
            >
              
              <div className="w-full flex justify-between items-center pb-3 mb-2 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                    기질도감
                  </span>
                  <h2 className="text-base font-black text-slate-900 tracking-tight break-keep">
                    {name}
                  </h2>
                </div>

                <div className="flex items-center space-x-1">
                  <span className="text-xs font-extrabold text-slate-700 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: elementTag.color }} />
                    <span>{elementTag.name}의 기운</span>
                  </span>
                </div>
              </div>

              {/* 🌟 포켓몬 카드 스타일: 캐릭터가 확실히 중심이 되는 대형 3D 일러스트 영역 */}
              <div className="w-full bg-gradient-to-b from-sky-50 to-sky-100/60 rounded-2xl border border-sky-200/60 p-4 my-2 flex flex-col items-center justify-center relative shadow-inner">
                
                {/* 🌟 수식어와 종족명을 한 줄에 나란히 배치 */}
                <div className="bg-white text-slate-800 text-xs font-black px-4 py-1.5 rounded-full shadow-2xs mb-1 border border-slate-100 flex items-center space-x-1.5">
                  <span className="text-slate-500 font-bold">&ldquo;{animalModifier}&rdquo;</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-900">{characterTitle}</span>
                </div>

                <BabyAnimalHybridMascot
                  cheonganIndex={characterCheonganIndex}
                  animalIndex={characterAnimalIndex}
                  colorLabel={colorLabel}
                />
              </div>

              <div className="w-full bg-slate-100 py-1.5 px-3 rounded-xl my-2 text-xs font-bold text-slate-700 flex justify-between items-center">
                <span>🎂 {calculatedAgeText}</span>
                <span className="break-keep">📌 {solutionData.badge.split('·')[1]?.trim() || solutionData.badge}</span>
              </div>

              <div className="w-full bg-slate-50 border border-slate-200/80 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-800 my-1 shadow-2xs leading-relaxed break-keep">
                &ldquo;{oneLineSummary}&rdquo;
              </div>

              {/* 능력치 스탯 바 */}
              <div className="w-full space-y-3 bg-slate-50 rounded-2xl p-3.5 text-left border border-slate-200/80 my-1 shadow-2xs">
                <TemperamentStatBar
                  id="curiosity"
                  categoryTag="탐색"
                  name="세상 호기심"
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
                  name={ageMode === 'infant' ? '도약기 예민 지수' : '감각 민감도'}
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

              <div className="w-full pt-2.5 mt-1 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-400 font-bold font-mono">
                <span>{jijiHanja} {animalName}띠 아기 도감</span>
                <span className="tracking-widest">baby-sokpuli</span>
              </div>
            </div>

            {/* 🌟 [오늘의 육아 날씨 예보] 결과 카드 외부 독립 위젯 */}
            <div className={`w-full p-4 rounded-3xl border bg-gradient-to-br ${babyWeather.bgGradient} text-left shadow-2xs space-y-2 bg-white break-keep`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{babyWeather.icon}</span>
                  <span className="text-xs font-black text-slate-900">오늘의 육아 날씨: {babyWeather.status}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 whitespace-nowrap">
                  매일 자정 갱신
                </span>
              </div>
              <p className="text-xs font-bold text-slate-800 leading-snug">
                {babyWeather.tension}
              </p>
              <p className="text-xs text-slate-600 font-medium leading-relaxed pt-1.5 border-t border-slate-200/60">
                💡 <b>오늘의 코칭:</b> {babyWeather.tip}
              </p>
            </div>

            <button
              onClick={handleDownloadCard}
              disabled={isDownloading}
              className="w-full py-3.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-2xl text-xs font-bold text-slate-800 shadow-2xs transition-all flex items-center justify-center space-x-1.5 break-keep"
            >
              <span>{isDownloading ? '기질 카드 생성 중...' : '우리 아이 기질 카드 저장'}</span>
            </button>

            {/* STEP 3: 솔루션 및 맞춤형 포션 추천 영역 */}
            <div className="space-y-3 pt-1">
              
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs text-left space-y-3">
                <div className="pb-2 border-b border-slate-100">
                  <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider block mb-0.5">
                    {ageMode === 'infant' ? 'BABY GUIDE · 원더윅스 체크' : 'GROWTH NOTE · 가볍게 읽는 팁'}
                  </span>
                  <h3 className="text-xs font-extrabold text-slate-900 break-keep">
                    {solutionData.mainTitle}
                  </h3>
                </div>

                <ul className="text-xs text-slate-600 font-medium space-y-1.5 leading-relaxed pl-1 break-keep">
                  {solutionData.bullets.map((bullet, idx) => (
                    <li key={idx}>• {bullet}</li>
                  ))}
                </ul>

                <div className={`p-3.5 rounded-xl border flex items-center space-x-3 ${
                  solutionData.isLeap
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}>
                  <span className="text-xl flex-shrink-0">
                    {solutionData.isLeap ? '⏳' : '💡'}
                  </span>
                  <div className="flex-1 break-keep">
                    <div className="text-[10px] font-semibold opacity-85">
                      {solutionData.highlightTag}
                    </div>
                    <div className="text-xs font-bold mt-0.5 leading-snug">
                      {solutionData.highlightTitle}
                    </div>
                  </div>
                </div>
              </div>

              {/* 쿠팡 파트너스 포션 추천 */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs text-left">
                <div className="mb-2.5 pb-2 border-b border-slate-100 flex justify-between items-end">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider block mb-0.5" style={{ color: potionData.color }}>
                      FIVE ELEMENTS POTION [{jijiHanja}]
                    </span>
                    <h3 className="text-xs font-extrabold text-slate-900 break-keep">
                      기운 팍팍! [{elementTag.name}] 충전소
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {potionData.tag}
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-medium leading-relaxed mb-3 pl-0.5 break-keep">
                  {potionData.guide}
                </p>

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center border border-slate-200 shadow-2xs flex-shrink-0">
                      <HealingPotionIcon potionColor={potionData.color} />
                    </div>
                    <div className="break-keep">
                      <div className="text-xs font-bold text-slate-900">{potionData.title}</div>
                      <div className="text-[10px] text-slate-500 font-medium mt-0.5">{potionData.subTitle}</div>
                    </div>
                  </div>
                  <a
                    href={SERVICE_LINKS.coupangDefault}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-3 py-2 rounded-xl active:scale-95 transition-all inline-block shadow-2xs flex-shrink-0 whitespace-nowrap"
                  >
                    최저가 보기
                  </a>
                </div>

                <p className="text-[10px] text-slate-400 font-medium mt-2 text-center whitespace-nowrap overflow-hidden text-ellipsis">
                  * 이 포스팅은 쿠팡 파트너스 활동의 일환으로 수수료를 제공받아요.
                </p>
              </div>

              {/* 🌟 [AI 심층 육아 보고서 준비 중] 담백한 페이크 도어 티저 */}
              <div 
                onClick={() => setIsAiReportModalOpen(true)}
                className="rounded-2xl border border-amber-300 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white p-4 text-left shadow-2xs cursor-pointer hover:scale-[1.01] transition-all space-y-1.5 relative overflow-hidden break-keep"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    PREVIEW · AI 심층 분석
                  </span>
                  <span className="text-[11px] font-bold text-amber-600 flex items-center space-x-0.5">
                    <span>목차 보기</span>
                    <span>→</span>
                  </span>
                </div>
                <h4 className="text-xs font-black text-slate-900">
                  우리 아이 10년 성장 & 훈육 AI 심층 보고서 (오픈 준비 중)
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  오행 본성과 소아 심리학을 결합한 프리미엄 훈육 가이드를 준비하고 있어요.
                </p>
              </div>

              {/* 오행 판결소 배너 */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-center text-white shadow-sm relative overflow-hidden">
                <div className="inline-block bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full mb-2 uppercase tracking-wider">
                  오행 판결소
                </div>

                <h4 className="text-sm font-extrabold tracking-tight break-keep">
                  오늘의 육아 당번 뽑기 (오행 판결소)
                </h4>
                <p className="text-xs text-slate-300 mt-1 font-medium leading-relaxed break-keep">
                  부모 생년월일과 오늘 날짜 오행 기운을 조합해 유쾌한 육아 당번을 판정해 드립니다.
                </p>

                <button
                  onClick={handleOpenChemiModal}
                  className="w-full mt-3.5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black shadow-xs active:scale-[0.98] transition-all flex items-center justify-center break-keep"
                >
                  오늘 당번 가리기 →
                </button>
              </div>

              {/* 하단 푸터 버튼 */}
              <div className="pt-2 space-y-2.5">
                <button
                  onClick={handleAddNewChild}
                  className="w-full py-3.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all shadow-2xs break-keep"
                >
                  + 다른 아이 카드도 뽑아보기
                </button>

                <button
                  onClick={() => setIsLoungeOpen(true)}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all flex items-center justify-center shadow-2xs break-keep"
                >
                  새로운 기능 제안 및 남매 아빠 후원하기
                </button>
              </div>

            </div>

          </div>
        )}

        {/* AI 심층 리포트 티저 목차 모달 */}
        {isAiReportModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
            <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div className="text-left">
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block mb-0.5">
                    AI REPORT PREVIEW
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 break-keep">
                    AI 심층 육아 보고서 목차 미리보기
                  </h3>
                </div>
                <button
                  onClick={() => setIsAiReportModalOpen(false)}
                  className="w-7 h-7 bg-slate-100 border border-slate-200 rounded-full text-xs font-bold text-slate-600 flex items-center justify-center hover:bg-slate-200"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-3 break-keep">
                <div className="inline-block bg-amber-400 text-slate-950 px-2 py-0.5 rounded text-[10px] font-extrabold">
                  정식 런칭 예정 목차
                </div>
                <ul className="text-xs text-slate-700 space-y-2 font-medium">
                  <li>• <b>제1장:</b> {name || '아이'}의 타고난 5대 오행 본성과 감각 레이더 분석</li>
                  <li>• <b>제2장:</b> 고집부리고 드러누울 때 통하는 맞춤형 대화법</li>
                  <li>• <b>제3장:</b> 초등학교 입학 전 자기주도성 & 집중력 케어</li>
                  <li>• <b>제4장:</b> 엄마·아빠와의 오행 궁합 및 부부 역할 분담</li>
                  <li>• <b>제5장:</b> 지친 육아 동지들을 위한 멘탈 케어 응원 편지</li>
                </ul>
              </div>

              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-left space-y-1 break-keep">
                <p className="text-xs font-extrabold text-amber-900">
                  💡 가볍게 훑어보는 AI 맞춤형 분석으로 준비 중이에요!
                </p>
                <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                  개발 완료 시 메인 화면을 통해 자연스럽게 만나보실 수 있습니다.
                </p>
              </div>

              <button
                onClick={() => setIsAiReportModalOpen(false)}
                className="w-full py-3.5 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs transition-all break-keep"
              >
                확인 완료 / 닫기
              </button>

            </div>
          </div>
        )}

        {/* 오행 판결소 모달 */}
        {isChemiModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
            <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider block mb-0.5">
                    FIVE ELEMENTS COURT
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 break-keep">
                    오늘의 육아 당번 뽑기 (오행 판결소)
                  </h3>
                </div>
                <button
                  onClick={handleCloseChemiModal}
                  className="w-7 h-7 bg-slate-100 border border-slate-200 rounded-full text-xs font-bold text-slate-600 flex items-center justify-center hover:bg-slate-200"
                >
                  ✕
                </button>
              </div>

              {isAnalyzingChemi ? (
                <div className="py-8 text-center space-y-5 animate-fadeIn">
                  <div className="space-y-1">
                    <div className="w-14 h-14 mx-auto bg-slate-900 text-amber-400 rounded-full flex items-center justify-center text-xl font-black shadow-md border border-amber-400/40 animate-pulse">
                      {countdown !== null ? countdown : '✨'}초
                    </div>
                    <h4 className="text-sm font-black text-slate-900 mt-2 break-keep">
                      오행 기운 격돌 중! 오늘의 당번 판정 중...
                    </h4>
                    <p className="text-[11px] text-slate-500 break-keep">
                      엄마와 아빠의 오늘 오행 파워가 팽팽하게 맞서고 있습니다!
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 shadow-inner">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-pink-600">👩 엄마의 실시간 오행 기운</span>
                        <span className="font-mono text-pink-600">{dynamicMomBar}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-3.5 rounded-full overflow-hidden p-0.5">
                        <div
                          className="bg-gradient-to-r from-pink-400 to-rose-500 h-full rounded-full transition-all duration-200 ease-out shadow-xs"
                          style={{ width: `${dynamicMomBar}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-center font-black text-amber-500 text-xs tracking-widest animate-bounce">
                      ⚡ VS ⚡
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-sky-600">👨 아빠의 실시간 오행 기운</span>
                        <span className="font-mono text-sky-600">{dynamicDadBar}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-3.5 rounded-full overflow-hidden p-0.5">
                        <div
                          className="bg-gradient-to-r from-sky-400 to-blue-500 h-full rounded-full transition-all duration-200 ease-out shadow-xs"
                          style={{ width: `${dynamicDadBar}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="w-full p-3.5 bg-gradient-to-br from-slate-900 to-slate-800 border border-amber-400/30 rounded-2xl text-left text-white space-y-2 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest">
                        SPONSORED · 부모 충전소
                      </span>
                      <span className="text-[10px] text-slate-400">15초 후 자동 판결</span>
                    </div>
                    <p className="text-xs font-bold leading-snug break-keep">
                      오늘 육아 당번을 위한 피로회복제 & 커피 타임 ☕
                    </p>
                    <div className="flex space-x-2 pt-0.5">
                      <a
                        href={SERVICE_LINKS.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-[11px] font-bold text-center transition-all shadow-xs"
                      >
                        ▶ 유튜브 숏폼
                      </a>
                      <a
                        href={SERVICE_LINKS.parentHealing}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-[11px] font-bold text-center transition-all shadow-xs"
                      >
                        🛍️ 부모 힐링템 구경
                      </a>
                    </div>
                  </div>
                </div>
              ) : !chemiResult ? (
                <form onSubmit={handleCalculateChemi} noValidate className="space-y-3.5 text-left">
                  <p className="text-xs text-slate-600 font-medium leading-relaxed break-keep">
                    오늘 날짜의 오행 기운과 두 분의 사주를 대조해 <b>오늘 집안의 평화를 지킬 육아 주인공</b>을 판정해 드립니다.
                  </p>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 break-keep">
                      👩 엄마 생년월일 (8자리)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="예: 1993.08.15"
                      value={momBirth}
                      onChange={(e) => handleDateChange(e.target.value, setMomBirth, 'momBirth')}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-bold text-slate-900 focus:outline-none transition-all ${
                        chemiErrors.mom ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200 bg-slate-50 focus:border-slate-800'
                      }`}
                    />
                    {chemiErrors.mom && (
                      <p className="text-[11px] font-semibold text-rose-600 mt-1 break-keep">⚠️ {chemiErrors.mom}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 break-keep">
                      👨 아빠 생년월일 (8자리)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="예: 1991.04.22"
                      value={dadBirth}
                      onChange={(e) => handleDateChange(e.target.value, setDadBirth, 'dadBirth')}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-bold text-slate-900 focus:outline-none transition-all ${
                        chemiErrors.dad ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200 bg-slate-50 focus:border-slate-800'
                      }`}
                    />
                    {chemiErrors.dad && (
                      <p className="text-[11px] font-semibold text-rose-600 mt-1 break-keep">⚠️ {chemiErrors.dad}</p>
                    )}
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 leading-relaxed break-keep">
                    판정 버튼을 누르시면 15초간 오행 파워 대격돌 심사가 진행됩니다!
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center break-keep"
                  >
                    오늘의 육아 당번 가리기 🔥
                  </button>
                </form>
              ) : (
                <div className="space-y-4 text-left animate-fadeIn">
                  <div className="bg-amber-50 border border-amber-200 text-amber-900 px-3.5 py-2.5 rounded-xl text-xs space-y-0.5 break-keep shadow-2xs">
                    <div className="font-extrabold flex items-center space-x-1 text-amber-800">
                      <span>⚖️</span>
                      <span>오행 법정 일사부재리(一事不再理) 원칙</span>
                    </div>
                    <p className="text-[11px] text-amber-800/90 leading-relaxed">
                      판결은 하루에 단 한 번만 선고되며 당일 번복이 불가합니다. 내일 자정 00:00에 새로운 기운으로 리셋돼요!
                    </p>
                  </div>

                  <div className="p-4 bg-slate-900 rounded-2xl text-center text-white space-y-1.5 border border-amber-400/40 shadow-md">
                    <span className="text-[10px] font-extrabold bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      오행 판결소 최종 선고
                    </span>
                    <h4 className="text-xl font-black text-amber-300 mt-1 break-keep">
                      오늘의 육아 &lsquo;주인공&rsquo;은 &lsquo;{chemiResult.best}&rsquo;!
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed pt-1 break-keep">
                      {chemiResult.summary}
                    </p>
                  </div>

                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-xs text-amber-900 leading-relaxed break-keep">
                    <div className="font-extrabold flex items-center space-x-1">
                      <span>⚖️</span>
                      <span>오행 판결 이유</span>
                    </div>
                    <p className="text-[11px] text-amber-800 font-medium">
                      {chemiResult.reason}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className={`p-3 rounded-xl border ${chemiResult.momScore >= chemiResult.dadScore ? 'border-pink-300 bg-pink-50/60' : 'border-slate-200 bg-slate-50'}`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs text-slate-700 break-keep">👩 엄마의 오늘 오행 파워</span>
                        <span className="font-mono font-black text-xs text-pink-600">{chemiResult.momScore}점</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-pink-500 h-full rounded-full" style={{ width: `${chemiResult.momScore}%` }} />
                      </div>
                    </div>

                    <div className={`p-3 rounded-xl border ${chemiResult.dadScore > chemiResult.momScore ? 'border-sky-300 bg-sky-50/60' : 'border-slate-200 bg-slate-50'}`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs text-slate-700 break-keep">👨 아빠의 오늘 오행 파워</span>
                        <span className="font-mono font-black text-xs text-sky-600">{chemiResult.dadScore}점</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-sky-500 h-full rounded-full" style={{ width: `${chemiResult.dadScore}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs text-slate-700 leading-relaxed break-keep">
                    <div className="font-bold text-slate-900 flex items-center space-x-1">
                      <span>📜</span>
                      <span>오늘의 역할 분담 미션</span>
                    </div>
                    <p>• <b>주인공 ({chemiResult.best})</b>: 오늘 하루 아이의 메인 케어 및 온몸으로 놀아주기 특임 수행!</p>
                    <p>• <b>도우미 ({chemiResult.best === '엄마' ? '아빠' : '엄마'})</b>: 저녁 집안일 전담 및 주인공을 향한 따뜻한 커피 리필 후원 ☕</p>
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={handleCloseChemiModal}
                      className="w-full py-3.5 bg-slate-900 text-white font-bold text-xs rounded-xl transition-all shadow-xs break-keep"
                    >
                      판결 수용하고 닫기
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 패밀리 라운지 모달 */}
        {isLoungeOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
            <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
              
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div className="text-left">
                  <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider block mb-0.5">
                    FAMILY LOUNGE & FEEDBACK
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 break-keep">
                    하민 & 하윤 패밀리 라운지
                  </h3>
                </div>
                <button
                  onClick={() => setIsLoungeOpen(false)}
                  className="w-7 h-7 bg-slate-100 border border-slate-200 rounded-full text-xs font-bold text-slate-600 flex items-center justify-center hover:bg-slate-200"
                >
                  ✕
                </button>
              </div>

              <div className="bg-gradient-to-br from-amber-500/10 via-rose-500/10 to-amber-500/5 border border-amber-400/50 rounded-2xl p-4 text-left shadow-2xs space-y-2.5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">🥤</span>
                    <h4 className="text-xs font-black text-slate-900 break-keep">
                      남매 아빠에게 콜라 한 캔 후원하기
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    {DONATION_CONFIG.colaPrice}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed break-keep">
                  오늘 서비스가 작게나마 웃음과 위로를 드렸다면, 남매 육아와 사이트 운영에 힘이 나는 시원한 콜라 한 캔을 선물해주세요!
                </p>

                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-2xs">
                  <div className="break-keep">
                    <div className="text-[10px] font-bold text-slate-400">
                      {DONATION_CONFIG.bankName} (예금주: {DONATION_CONFIG.holderName})
                    </div>
                    <div className="text-xs font-black font-mono text-slate-900 mt-0.5">
                      {DONATION_CONFIG.accountNumber}
                    </div>
                  </div>
                  <button
                    onClick={handleCopyAccount}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs whitespace-nowrap ${
                      copyFeedback
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95'
                    }`}
                  >
                    {copyFeedback ? '✓ 복사완료!' : '계좌 복사'}
                  </button>
                </div>
                {copyFeedback && (
                  <p className="text-[10px] font-bold text-emerald-600 text-center animate-fadeIn break-keep">
                    🎉 계좌가 복사되었습니다! 금융 앱에서 바로 붙여넣어 송금하실 수 있어요.
                  </p>
                )}
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left shadow-2xs space-y-2.5">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 bg-red-600 text-white rounded-md flex items-center justify-center text-xs font-bold">
                    ▶
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 break-keep">
                    아기속풀이 실제 모델! 하민&하윤 유튜브
                  </h4>
                </div>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed break-keep">
                  원더윅스 폭풍을 온몸으로 이겨낸 하민이와 하윤이의 생생한 일상과 육아 성장 숏폼을 구경해보세요.
                </p>
                <a
                  href={SERVICE_LINKS.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-bold rounded-xl text-center transition-all break-keep"
                >
                  하민&하윤이 유튜브 채널 구경가기
                </a>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left shadow-2xs space-y-2.5">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white rounded-md flex items-center justify-center text-xs font-bold">
                    💡
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 break-keep">
                    아이디어 & 새로운 기능 제안
                  </h4>
                </div>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed break-keep">
                  &ldquo;이런 기능이 더 있으면 좋겠어요!&rdquo; 등 다양한 아이디어를 인스타 DM으로 남겨주시면 개발자 아빠가 직접 읽고 반영합니다.
                </p>
                <a
                  href={SERVICE_LINKS.instagramDM}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-700 text-xs font-bold rounded-xl text-center transition-all active:scale-[0.98] shadow-2xs break-keep"
                >
                  인스타 DM으로 새로운 기능 제안하기
                </a>
              </div>

              <button
                onClick={() => setIsLoungeOpen(false)}
                className="w-full py-3 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs transition-all break-keep"
              >
                닫기
              </button>
            </div>
          </div>
        )}

        {/* 사파리 이미지 저장 모달 */}
        {iosSavedImageUrl && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div className="w-full max-w-sm bg-white rounded-3xl p-5 text-center space-y-3.5 shadow-2xl">
              <div className="space-y-1 break-keep">
                <span className="text-2xl">📸</span>
                <h4 className="text-sm font-black text-slate-900">
                  카드를 사진첩에 저장하기
                </h4>
                <p className="text-xs text-amber-700 font-bold bg-amber-50 py-1.5 px-2 rounded-lg">
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
                className="w-full py-3 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs active:scale-95 transition-all break-keep"
              >
                저장 완료 / 닫기
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}