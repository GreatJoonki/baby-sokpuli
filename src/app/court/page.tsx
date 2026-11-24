import { Metadata } from 'next';
import FeatureLanding from '@/components/FeatureLanding';

export const metadata: Metadata = {
  title: '오늘 밤 육아 당번 판결소 | 아기속풀이 PRO',
  description:
    '밤중 수유와 새벽 육아 당번, 누가 할지 다투지 마세요. 엄마·아빠 생년월일의 오행과 오늘의 기운을 비교해 당번을 정해주는 육아 당번 판결 콘텐츠예요.',
  alternates: { canonical: '/court' },
  openGraph: {
    title: '오늘 밤 육아 당번 판결소 | 아기속풀이 PRO',
    description:
      '밤중 수유와 새벽 육아 당번, 누가 할지 다투지 마세요. 엄마·아빠 오행과 오늘의 기운으로 정하는 육아 당번 판결.',
    url: 'https://baby-sokpuli.vercel.app/court',
    siteName: '아기속풀이 PRO',
    locale: 'ko_KR',
    type: 'article',
  },
};

export default function CourtLandingPage() {
  return (
    <FeatureLanding
      badge="당번 판결소"
      eyebrow="NIGHT DUTY COURT"
      title="오늘 밤 육아 당번 판결소"
      subtitle="오늘 밤 새벽 당번, 판결로 깔끔하게 정해보세요"
      intro={[
        '매일 밤 반복되는 "오늘은 누가 일어날까" 눈치 싸움, 판결소가 대신 정해드립니다. 엄마와 아빠의 생년월일에서 읽은 오행 점수와 그날 날짜의 기운을 비교해, 오늘 밤 육아 당번과 응원 담당을 나눈 판결문을 선고해요.',
        '판결은 매일 자정에 새로 열립니다. 어제의 당번이 오늘도 이어질지, 뒤집힐지는 열어봐야 아는 재미가 있어요.',
      ]}
      sections={[
        {
          heading: '판결 방식',
          paragraphs: [],
          bullets: [
            '엄마와 아빠의 생년월일을 입력해요 (다음 방문부터는 자동 입력)',
            '두 사람의 오늘 오행 점수를 막대 그래프로 비교해요',
            '점수와 함께 오늘 밤 당번 판결문이 선고돼요',
            '결과는 링크로 공유할 수 있어, 상대에게 바로 판결문을 보낼 수 있어요',
          ],
        },
        {
          heading: '판결 도장까지 찍히는 결과 화면',
          paragraphs: [
            '결과 화면에는 판결 완료 도장이 찍히고, 두 사람의 점수가 실제 수치로 표시됩니다. 저장한 판결문 이미지를 가족 단톡방에 올리면 그날 밤 당번 정하기가 조금 더 유쾌해져요.',
          ],
        },
      ]}
      feature="court"
      ctaText="오늘 밤 육아 당번 판결 받아보기"
      note="판결은 부부가 웃으며 정하자는 재미용 콘텐츠예요. 실제 육아 분담은 두 분의 컨디션과 약속이 언제나 우선입니다."
    />
  );
}
