import { OG_ALT, OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '../og-shared';

export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOgImage('우리 아이 기질 도감', '사주 오행으로 읽는 우리 아이 타고난 기질');
}
