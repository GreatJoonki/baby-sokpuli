import { OG_ALT, OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '../og-shared';

export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOgImage('부모-자녀 육아 난이도 진단', '아이와 나의 오행 상성으로 보는 육아 난이도와 맞춤 솔루션');
}
