import { Metadata } from 'next';
import FeatureLanding from '@/components/FeatureLanding';

export const metadata: Metadata = {
  title: '우리 아이 기질 도감 — 아기 기질 테스트 | 아기속풀이 PRO',
  description:
    '아기 기질 테스트: 생년월일과 태어난 시간으로 읽는 60갑자 오행 기질 포토 카드, 원더윅스 도약기 D-day와 구간별 아기 신호·대처법까지 한 번에 확인하세요.',
  alternates: { canonical: '/temperament' },
  openGraph: {
    title: '우리 아이 기질 도감 — 아기 기질 테스트 | 아기속풀이 PRO',
    description:
      '생년월일과 태어난 시간으로 읽는 60갑자 오행 기질 포토 카드와 원더윅스 도약기 D-day, 구간별 대처법.',
    url: 'https://baby-sokpuli.vercel.app/temperament',
    siteName: '아기속풀이 PRO',
    locale: 'ko_KR',
    type: 'article',
  },
};

export default function TemperamentLandingPage() {
  return (
    <FeatureLanding
      badge="기질 도감"
      eyebrow="TEMPERAMENT & WONDER WEEKS"
      title="우리 아이 기질 도감"
      subtitle="아기 기질 테스트와 원더윅스 분석을 한 번에"
      intro={[
        '우리 아이 기질 도감은 아이의 이름과 생년월일, 태어난 시간을 입력하면 60갑자와 사주 오행으로 타고난 기질을 읽어 포토 카드로 만들어주는 아기 기질 테스트예요. 회원가입 없이 입력 한 번으로 결과를 볼 수 있습니다.',
        '여기에 출산 예정일 기준으로 계산하는 원더윅스 분석이 함께 붙어요. 지금이 도약기인지, 탈출까지 며칠 남았는지 D‑day로 보여주고, 그 구간에 자주 보이는 아기 신호와 오늘 바로 해볼 수 있는 대처를 알려줍니다.',
      ]}
      sections={[
        {
          heading: '기질 도감에서 볼 수 있는 것',
          paragraphs: [],
          bullets: [
            '오행 기질 포토 카드 — 이미지로 저장하고 카톡으로 공유할 수 있어요',
            '호기심·활동량 같은 기질 성향 점수와 쉬운 해석',
            '원더윅스 분석 — 도약 폭풍 여부와 탈출까지 남은 기간(D‑day)',
            '도약기에 자주 보이는 아기 신호와 실전 대처, 부모 멘탈 처방전',
            '지난 결과 이어보기 — 다시 입력하지 않아도 지난 기질 도감을 바로 열어요',
          ],
        },
        {
          heading: '원더윅스 계산이 더 궁금하다면',
          paragraphs: [
            '원더윅스는 출생일이 아니라 출산 예정일을 기준으로 계산해야 정확합니다. 10대 도약기 각각의 시기와 특징, 수면 퇴행 대처법은 원더윅스 백과 페이지에 따로 정리해 두었어요.',
          ],
        },
      ]}
      feature="temperament"
      ctaText="우리 아이 기질 도감 만들어보기"
      note="기질 해석은 사주 명리를 바탕으로 한 참고용 콘텐츠로, 아이의 발달 상태나 성격을 단정하는 진단이 아니에요."
    />
  );
}
