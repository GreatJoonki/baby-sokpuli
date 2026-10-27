import { MetadataRoute } from 'next';
import { ELEMENT_GUIDES } from '@/data/guideContent';
import { WONDER_WEEKS_GUIDES } from '@/data/wonderWeeksContent';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://baby-sokpuli.vercel.app';
  const lastModified = new Date();

  // 1. 사주 오행 기질 백서 5개 상세 페이지 동적 생성 (/guide/wood 등)
  const guideDetailUrls: MetadataRoute.Sitemap = Object.keys(ELEMENT_GUIDES).map((slug) => ({
    url: `${baseUrl}/guide/${slug}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // 2. 원더윅스 10대 도약기 백서 10개 상세 페이지 동적 생성 (/wonder-weeks/1 등)
  const wonderWeeksDetailUrls: MetadataRoute.Sitemap = Object.keys(WONDER_WEEKS_GUIDES).map((leap) => ({
    url: `${baseUrl}/wonder-weeks/${leap}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  return [
    // 메인 홈
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    // 기존 가이드 및 원더윅스 대표 경로 유지
    {
      url: `${baseUrl}/guide`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/wonder-weeks`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // 15개 상세 백서 페이지 전체 포함
    ...guideDetailUrls,
    ...wonderWeeksDetailUrls,
  ];
}