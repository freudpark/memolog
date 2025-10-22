```ts
export const WORK_TYPES = [
  '사업/품질',
  '인프라구축',
  'AP통합이전',
  'AP개발',
  '추진단요청사항',
] as const;

export type WorkType = typeof WORK_TYPES[number];
```
