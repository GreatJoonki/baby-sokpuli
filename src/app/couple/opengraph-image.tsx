import { OG_ALT, OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '../og-shared';

export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOgImage('커플 가상 2세 시뮬레이터', '두 사람의 오행 조합으로 미리 보는 우리 아이 성향');
}
