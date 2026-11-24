import { OG_ALT, OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '../og-shared';

export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOgImage('오늘의 아기 속마음 타로', '말로 다 못 하는 아기의 오늘 하루를 카드로 읽어보세요');
}
