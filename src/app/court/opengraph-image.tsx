import { OG_ALT, OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '../og-shared';

export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOgImage('오늘 밤 육아 당번 판결소', '엄마와 아빠, 오늘 밤 당번은 오행 판결로 정해요');
}
