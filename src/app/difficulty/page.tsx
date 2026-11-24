import { Metadata } from 'next';
import FeatureLanding from '@/components/FeatureLanding';

export const metadata: Metadata = {
  title: '부모-자녀 육아 난이도 진단 | 아기속풀이 PRO',
  description:
    '부모와 아이의 오행 상성으로 보는 육아 난이도 지수와 단계별 양육 가이드. 왜 우리 아이가 유독 힘들게 느껴지는지, 기질의 차이로 풀어보세요.',
  alternates: { canonical: '/difficulty' },
  openGraph: {
    title: '부모-자녀 육아 난이도 진단 | 아기속풀이 PRO',
    description:
      '부모와 아이의 오행 상성으로 보는 육아 난이도 지수와 단계별 양육 가이드.',
    url: 'https://baby-sokpuli.vercel.app/difficulty',
    siteName: '아기속풀이 PRO',
    locale: 'ko_KR',
    type: 'article',
  },
};

export default function DifficultyLandingPage() {
  return (
    <FeatureLanding
      badge="난이도 진단"
      eyebrow="PARENTING DIFFICULTY"
      title="부모-자녀 육아 난이도 진단"
      subtitle="힘든 건 아이 탓도, 부모 탓도 아닌 기질의 조합일 수 있어요"
      intro={[
        '같은 행동도 어떤 부모와 어떤 아이가 만나느냐에 따라 전혀 다르게 느껴집니다. 부모-자녀 육아 난이도 진단은 부모와 아이의 생년월일에서 읽은 오행의 상생·상극 관계를 분석해, 두 사람의 조합이 만드는 육아 난이도를 지수와 단계로 알려줘요.',
        '난이도가 높게 나왔다고 해서 나쁜 조합이라는 뜻은 아니에요. 서로 다른 기질이 부딪히는 지점을 알면, 그만큼 대처법도 구체적으로 준비할 수 있습니다.',
      ]}
      sections={[
        {
          heading: '진단 결과에서 볼 수 있는 것',
          paragraphs: [],
          bullets: [
            '100점 만점의 육아 난이도 지수와 단계(등급)',
            '부모와 아이의 오행 상성이 만드는 케미 해석',
            '단계에 맞춘 실전 양육법과 훈육 대화 예시',
            '결과 이미지 저장과 카톡 공유',
          ],
        },
        {
          heading: '아이 기질 도감과 함께 보면 더 정확해요',
          paragraphs: [
            '진단은 부모와 아이의 조합을 보는 도구예요. 아이 자체의 기질이 궁금하다면 기질 도감에서 오행 기질 카드와 원더윅스 분석을 함께 확인해 보세요.',
          ],
        },
      ]}
      feature="difficulty"
      ctaText="부모-자녀 육아 난이도 진단해보기"
      note="진단 결과는 양육을 돕기 위한 참고 정보예요. 아이와의 관계에서 어려움이 크다고 느껴지면 전문가 상담을 함께 권합니다."
    />
  );
}
