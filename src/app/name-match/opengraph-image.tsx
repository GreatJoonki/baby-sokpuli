import { OG_ALT, OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '../og-shared';

export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOgImage('아기 이름 궁합', '엄마 아빠가 지은 이름, 우리 아기와 얼마나 찰떡일까요');
}
