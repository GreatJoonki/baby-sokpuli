import { Metadata } from 'next';
import FeatureLanding from '@/components/FeatureLanding';

export const metadata: Metadata = {
  title: '오늘의 아기 속마음 타로 | 아기속풀이 PRO',
  description:
    '말을 못 하는 아기가 오늘 어떤 하루를 보내고 있을지, 21종의 아기 속마음 타로 카드로 읽어보는 하루 한 번의 작은 위로. 카드 저장과 카톡 공유도 가능해요.',
  alternates: { canonical: '/tarot' },
  openGraph: {
    title: '오늘의 아기 속마음 타로 | 아기속풀이 PRO',
    description:
      '말을 못 하는 아기가 오늘 어떤 하루를 보내고 있을지, 21종의 아기 속마음 타로 카드로 읽어보는 하루 한 번의 작은 위로.',
    url: 'https://baby-sokpuli.vercel.app/tarot',
    siteName: '아기속풀이 PRO',
    locale: 'ko_KR',
    type: 'article',
  },
};

export default function TarotLandingPage() {
  return (
    <FeatureLanding
      badge="속마음 타로"
      eyebrow="BABY TAROT"
      title="오늘의 아기 속마음 타로"
      subtitle="아직 말을 못 하는 아기, 오늘은 어떤 마음일까요?"
      intro={[
        '오늘의 아기 속마음 타로는 카드 세 장 중 마음이 가는 한 장을 고르면, 아기의 오늘 하루를 담은 카드가 뒤집히며 공개되는 하루 한 번의 타로 콘텐츠예요. 낮 놀이, 밤잠, 컨디션처럼 매일 달라지는 아기의 상태를 21종의 카드로 풀어냈습니다.',
        '한 번 뽑은 카드는 그날 하루 동안 아이 기준으로 저장돼요. 아침에 뽑아두고, 저녁에 다시 열어 "오늘 정말 이런 하루였네" 하고 맞춰보는 재미도 있습니다.',
      ]}
      sections={[
        {
          heading: '어떻게 진행되나요?',
          paragraphs: [],
          bullets: [
            '뒤집힌 카드 세 장 중 마음이 가는 한 장을 골라요',
            '카드가 뒤집히며 오늘의 아기 속마음과 해석이 공개돼요',
            '결과는 이미지로 저장하거나 카톡으로 공유할 수 있어요',
            '자정에는 새로운 카드로 다시 뽑을 수 있어요',
          ],
        },
        {
          heading: '21종의 카드, 매일 다른 이야기',
          paragraphs: [
            '카드마다 낮의 놀이 기분부터 밤 통잠운까지, 육아 하루의 장면들을 담았어요. 같은 카드라도 아이의 기질 도감과 함께 보면 "우리 아이는 왜 이럴까" 하는 궁금증이 조금은 가벼워집니다.',
          ],
        },
      ]}
      feature="tarot"
      ctaText="오늘의 아기 속마음 타로 뽑아보기"
      note="타로는 의학적·발달적 판단이 아니라 재미와 위로를 위한 콘텐츠예요. 아기의 상태가 걱정될 때는 전문가 상담이 우선입니다."
    />
  );
}
