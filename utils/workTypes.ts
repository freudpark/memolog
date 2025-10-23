// 표 행으로 표시할 업무영역 (회의/협의는 별도 섹션으로 분리)
export const WORK_TYPES = [
  '사업/품질',
  '인프라구축',
  'AP통합이전',
  'AP개발',
  '추진단요청사항',
] as const;

export type WorkType = typeof WORK_TYPES[number];

// 회의/협의 일정은 별도 섹션(1행)으로 저장
export const MEETING_TYPE = '회의/협의 일정' as const;
