import { Metadata } from 'next';
import FeatureLanding from '@/components/FeatureLanding';

export const metadata: Metadata = {
  title: '아기 이름 궁합 — 엄마·아빠가 지은 이름, 얼마나 찰떡일까 | 아기속풀이 PRO',
  description:
    '엄마·아빠 이름과 아기 이름 후보를 넣으면 세 이름의 글자 조합으로 읽는 재미 궁합 점수와 한 줄 코멘트를 알려드려요. 같은 조합은 언제나 같은 결과, 결과 카드는 이미지로 저장하고 카톡으로 공유할 수 있어요.',
  alternates: { canonical: '/name-match' },
  openGraph: {
    title: '아기 이름 궁합 — 엄마·아빠가 지은 이름, 얼마나 찰떡일까 | 아기속풀이 PRO',
    description:
      '엄마·아빠 이름과 아기 이름 후보의 글자 조합으로 읽는 재미 궁합 점수와 한 줄 코멘트.',
    url: 'https://baby-sokpuli.vercel.app/name-match',
    siteName: '아기속풀이 PRO',
    locale: 'ko_KR',
    type: 'article',
  },
};

export default function NameMatchLandingPage() {
  return (
    <FeatureLanding
      badge="이름 궁합"
      eyebrow="BABY NAME MATCHING"
      title="아기 이름 궁합"
      subtitle="엄마·아빠가 지은 이름, 우리 아기와 얼마나 찰떡일까요"
      intro={[
        '아기 이름 궁합은 엄마 이름, 아빠 이름, 그리고 지어둔 아기 이름 후보를 넣으면 세 이름의 글자 조합으로 궁합 점수와 한 줄 코멘트를 읽어주는 가벼운 재미 기능이에요. 회원가입 없이 이름 세 개만 넣으면 바로 결과가 나옵니다.',
        '점수는 이름 조합마다 고정이라, 같은 이름을 넣으면 언제나 같은 결과가 나와요. 후보가 여러 개라면 하나씩 넣어보며 가족끼리 웃고 고르는 재미로 즐겨보세요.',
      ]}
      sections={[
        {
          heading: '이렇게 즐겨보세요',
          paragraphs: [],
          bullets: [
            '엄마·아빠 이름과 아기 이름 후보 입력 — 10초면 결과 확인',
            '62~99점 궁합 점수와 등급(천생연분 이름 · 찰떡궁합 이름 · 포근한 조화 · 무럭무럭 자라는 궁합)',
            '결과 카드는 이미지로 저장하고 카톡으로 공유할 수 있어요',
            '후보 이름을 바꿔 넣으며 온 가족이 함께 골라보는 재미',
          ],
        },
        {
          heading: '이름 짓기가 고민이라면',
          paragraphs: [
            '이름은 평생 불리는 만큼 소리의 울림, 가족과의 어울림, 부르기 쉬운지를 함께 보는 게 좋아요. 이 궁합은 그중 "가족 이름과의 어울림"을 재미로 풀어낸 것이니, 최종 결정은 부부의 마음이 가는 이름으로 하시길 권해요.',
          ],
        },
      ]}
      feature="name"
      ctaText="아기 이름 궁합 보러 가기"
      note="이름 궁합은 과학적 근거나 작명학적 판단이 아니라, 이름 글자의 조합으로 만드는 재미용 결과예요. 이름의 좋고 나쁨을 판단하지 않습니다."
    />
  );
}
