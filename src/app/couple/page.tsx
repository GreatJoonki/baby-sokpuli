import { Metadata } from 'next';
import FeatureLanding from '@/components/FeatureLanding';

export const metadata: Metadata = {
  title: '커플 가상 2세 시뮬레이터 | 아기속풀이 PRO',
  description:
    '엄마·아빠 두 사람의 사주 오행 조합으로 미리 보는 가상 2세의 성향과 육아 난이도, 오행 궁합 점수. 결과 카드를 이미지로 저장해 공유해 보세요.',
  alternates: { canonical: '/couple' },
  openGraph: {
    title: '커플 가상 2세 시뮬레이터 | 아기속풀이 PRO',
    description:
      '두 사람의 사주 오행 조합으로 미리 보는 가상 2세의 성향과 육아 난이도, 오행 궁합 점수.',
    url: 'https://baby-sokpuli.vercel.app/couple',
    siteName: '아기속풀이 PRO',
    locale: 'ko_KR',
    type: 'article',
  },
};

export default function CoupleLandingPage() {
  return (
    <FeatureLanding
      badge="가상 2세"
      eyebrow="FUTURE BABY SIMULATOR"
      title="커플 가상 2세 시뮬레이터"
      subtitle="두 사람을 닮은 아이는 어떤 성향일까요?"
      intro={[
        '커플 가상 2세 시뮬레이터는 엄마와 아빠, 두 사람의 생년월일에서 읽은 사주 오행을 조합해 가상 2세의 성향을 미리 그려보는 콘텐츠예요. 두 사람의 오행 궁합 점수와 함께, 아이가 어떤 기질을 타고날지 시뮬레이션으로 보여줍니다.',
        '결과는 카드 이미지로 저장할 수 있어, 연인이나 배우자와 가볍게 나눠보기 좋습니다.',
      ]}
      sections={[
        {
          heading: '무엇을 보여주나요?',
          paragraphs: [],
          bullets: [
            '두 사람의 오행 궁합(케미) 지수',
            '가상 2세의 성향 카드와 예상 육아 난이도',
            '엄마·아빠 중 누구를 더 닮았는지 닮은 비율',
            '결과 카드 이미지 저장과 공유',
          ],
        },
        {
          heading: '매일 열리는 커플 특권 판결도 있어요',
          paragraphs: [
            '가상 2세 결과와 함께, 매일 자정에 갱신되는 데일리 커플 특권 판결도 열립니다. 오늘 데이트 주도권과 손 하나 까딱 안 할 권리를 두고 두 사람의 오행 기운을 대조하는 작은 판결 놀이예요.',
          ],
        },
      ]}
      feature="couple"
      ctaText="커플 가상 2세 시뮬레이션 해보기"
      note="실제 아이의 모습이나 성격을 예측하는 것이 아니라, 두 사람의 오행 조합을 풀어낸 재미용 시뮬레이션이에요."
    />
  );
}
