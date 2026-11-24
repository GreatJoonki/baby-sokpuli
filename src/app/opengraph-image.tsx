import { OG_ALT, OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from './og-shared';

export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOgImage('아기속풀이 PRO', '우리 아이 기질 도감 · 원더윅스 · 오늘 밤 당번 판결 · 속마음 타로');
}
